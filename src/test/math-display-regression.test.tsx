import { beforeEach, describe, expect, it } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fireEvent, render, screen } from '@testing-library/react';
import { Math as Formula } from '../components/math/Math';
import { MathText } from '../components/math/MathText';
import { parseInlineMath, looksLikeBareTex } from '../components/math/parseInlineMath';
import { SourceContentBlock } from '../components/lesson/SourceContentBlock';
import { StepRenderer } from '../components/lesson/StepRenderer';
import { TeacherArea } from '../components/teacher/TeacherArea';
import { TestSolutions } from '../components/tests/TestSolutions';
import { unit3Lesson2Data } from '../data/unit3/lesson02';
import { unit3Lesson2TeacherSolutions } from '../data/unit3/lesson02TeacherSolutions';
import { resolveTest } from '../data/tests/registry';

/**
 * اختبارات انحدار لمشكلتي العرض بعد PR #22، ولكل ما يلزم لعرض رياضي سليم:
 * الرموز (`\neq`)، والمسافات (`\qquad`)، والأسس، والكسور، وعزل الاتجاه RTL/LTR،
 * وعدم تسريب أوامر LaTeX أو محددات `$` إلى الطالب.
 *
 * كل تأكيد هنا يقع على **مخرجات المكوّن** (نص مرئي + بنية KaTeX)، لا على النص
 * المخزَّن في بيانات الدرس.
 */

/**
 * النص المرئي فعلًا: يُستبعد `.katex-mathml` (نسخة MathML المخفية بصريًا للقارئ
 * الصوتي، وتحمل TeX الأصلي في `<annotation>`). بدون هذا الاستبعاد يظهر TeX
 * «خامًا» في `textContent` بينما الطالب لا يراه.
 */
const visibleText = (root: Element | DocumentFragment): string => {
  const clone = root.cloneNode(true) as Element;
  clone.querySelectorAll('.katex-mathml').forEach((node) => node.remove());
  return (clone.textContent ?? '').replace(/\s+/g, ' ').trim();
};

/**
 * KaTeX يرسم `≠` كعلامة `=` مع شرطة متراكبة (\not)، فلا يظهر الرمز في
 * `textContent` المرئي بل في شجرة MathML وفي طبقة `.rlap`. نتحقّق من الاثنين:
 * الدلالة (MathML) والرسم (طبقة التراكب).
 */
const expectNotEqualGlyph = (root: Element) => {
  expect(root.querySelector('.katex-mathml')?.textContent ?? '').toContain('≠');
  expect(root.querySelector('.rlap')).not.toBeNull();
};

const katexVisibleText = (root: Element): string => {
  const clone = root.cloneNode(true) as Element;
  clone.querySelectorAll('.katex-mathml').forEach((node) => node.remove());
  return (clone.textContent ?? '').replace(/\s+/g, '');
};

const RAW_LATEX = /\\|\$|\bneq\b|\bqquad\b|\bfrac\b/;

describe('الرمز «لا يساوي» لا يُعرض نصًا حرفيًا', () => {
  it('يرسم \\neq كرمز ≠ داخل معادلة كتلية', () => {
    const { container } = render(<Formula math="1250 - 350 + 225 = 1125 \;\; (\neq 1375)" display />);
    const text = visibleText(container);

    expectNotEqualGlyph(container);
    expect(text).toContain('1375');
    // جوهر العطل الأول: `\\neq` كان يُعرض «neq» و`\\;\\;` كان يُعرض «;;».
    expect(text).not.toMatch(/n\s*e\s*q/i);
    expect(text).not.toContain(';;');
    expect(container.querySelector('.katex')).toBeInTheDocument();
    expect(container.querySelector('.katex-error')).toBeNull();
  });

  it('يعرض بند نشاط الدرس الثالث (بيانات حقيقية) بالرمز ≠ بعد كشف الحل', () => {
    const block = unit3Lesson2Data.steps
      .flatMap((step) => step.blocks)
      .find((candidate) => candidate.subItems?.some((item) => item.solution?.includes('\\neq')));
    expect(block, 'لم يُعثر على بند يحوي \\neq في بيانات الدرس').toBeDefined();

    const index = block!.subItems!.findIndex((item) => item.solution?.includes('\\neq'));
    const { container } = render(<SourceContentBlock block={block!} />);
    fireEvent.click(container.querySelectorAll('.reveal-btn')[index]);

    const panel = container.querySelector('.solution-panel')!;
    const text = visibleText(panel);
    expect(panel.textContent).toContain('≠');
    expect(text).toContain('1125');
    expect(text).not.toMatch(/n\s*e\s*q/i);
    expect(text).not.toContain(';;');
    expect(panel.querySelector('.math-block-isolated')).toHaveAttribute('dir', 'ltr');
    expect(panel.querySelector('.katex-error')).toBeNull();
  });
});

describe('التعبير ذو المتغيرات والأسس يُعرض كمعادلة لا كنص خام', () => {
  it('يعرض \\qquad فاصلًا بين تعبيرين بدل كلمة «qquad»', () => {
    const { container } = render(<Formula math="a + (b + c) \qquad c - (a + b)" display />);
    const text = visibleText(container);

    expect(text).not.toMatch(/q\s*q\s*u\s*a\s*d/i);
    expect(text).toContain('a');
    expect(text).toContain('b');
    expect(text).toContain('c');
    expect(container.querySelector('.mspace')).toBeInTheDocument();
  });

  it('يعرض جواب المعلّم النهائي C = -6x - 4 مع الأس السفلي، ولا يعرض ``\\qquad``', () => {
    const solution = unit3Lesson2TeacherSolutions.find((entry) =>
      entry.finalAnswer.includes('C = -6x - 4'),
    );
    expect(solution, 'لم يُعثر على حل المعلّم الخاص بالعبارة C').toBeDefined();

    const { container } = render(<MathText text={solution!.finalAnswer} />);
    const text = visibleText(container);

    expect(container.querySelector('.katex')).toBeInTheDocument();
    expect(text).not.toMatch(/\\/);
    expect(text).not.toMatch(/q\s*q\s*u\s*a\s*d/i);
    expect(text).toContain('6');
    expect(text).toContain('10');
    // `C_{x=1}` أس سفلي حقيقي:
    expect(container.querySelector('.msupsub')).toBeInTheDocument();
  });

  it('يحفظ ترتيب الرموز المنطقي والأسس والكسور داخل حاوية LTR معزولة', () => {
    const { container } = render(<Formula math="x^{-1} - 7x^{-3} = -6x^{-4}" display />);
    const htmlSpans = container.querySelector('.katex-html')!;
    const logical = katexVisibleText(htmlSpans);

    expect(container.querySelector('.math-block-isolated')).toHaveAttribute('dir', 'ltr');
    expect(container.querySelector('.math-block-isolated')).toHaveStyle({ unicodeBidi: 'isolate' });
    // الترتيب المنطقي محفوظ: x أولًا ثم الأس −1، والطرف الأيمن ـ6x−4 في آخره.
    expect(logical.startsWith('x−1−7x−3')).toBe(true);
    expect(logical.endsWith('−6x−4')).toBe(true);
    expect(container.querySelectorAll('.msupsub').length).toBe(3);
    expect(container.querySelector('.katex-error')).toBeNull();
  });

  it('يرسم الكسر عموديًا داخل نص عربي RTL بلا أوامر خام', () => {
    const { container } = render(
      <div dir="rtl">
        <MathText text="احسب $\frac{a}{b} \times \frac{c}{d}$ ثم بسّط." />
      </div>,
    );

    const mathSpan = container.querySelector('.math-inline-isolated')!;
    expect(mathSpan).toHaveAttribute('dir', 'ltr');
    expect(mathSpan).toHaveStyle({ unicodeBidi: 'isolate' });
    expect(container.querySelectorAll('.mfrac')).toHaveLength(2);
    expect(visibleText(container)).not.toMatch(RAW_LATEX);
    expect(visibleText(container)).toContain('احسب');
  });
});

describe('نصّان مختلفان يمرّان من العارض المشترك بلا تسريب', () => {
  it('MathText يعرض TeX خامًا بلا محددات (حقول finalAnswer/solution)', () => {
    const { container } = render(<MathText text="\frac{1}{4}" />);
    expect(container.querySelector('.katex')).toBeInTheDocument();
    expect(visibleText(container)).not.toMatch(RAW_LATEX);
  });

  it('Math يعرض جملة عربية تحوي $…$ بدل تمريرها إلى KaTeX كما هي', () => {
    const { container } = render(<Formula math="الخياران ① و④ (كلاهما $1375$)" />);
    const text = visibleText(container);
    expect(container.querySelector('.katex')).toBeInTheDocument();
    expect(text).toContain('الخياران');
    expect(text).toContain('1375');
    expect(text).not.toContain('$');
  });

  it('يدعم المحددات \(…\) و\[…\] الواردة في بنود الكتاب', () => {
    const tokens = parseInlineMath('اكتب \\(\\frac{2}{3}\\) ثم \\[\\frac{1}{4}\\]');
    expect(tokens.filter((token) => token.type === 'math')).toEqual([
      { type: 'math', content: '\\frac{2}{3}', display: false },
      { type: 'math', content: '\\frac{1}{4}', display: true },
    ]);

    const { container } = render(<MathText text={'اكتب \\(\\frac{2}{3}\\) ثم'} />);
    expect(container.querySelectorAll('.mfrac')).toHaveLength(1);
    expect(visibleText(container)).not.toMatch(/\\/);
  });

  it('لا يمرّر نصًا عربيًا إلى KaTeX', () => {
    const { container } = render(<MathText text="الجداء التقاطعي متساوٍ دائمًا في كسرين متساويين." />);
    expect(container.querySelector('.katex')).toBeNull();
    expect(looksLikeBareTex('الجداء التقاطعي متساوٍ')).toBe(false);
    expect(looksLikeBareTex('\\frac{1}{4}')).toBe(true);
    expect(looksLikeBareTex('\\text{موجبة}')).toBe(true);
  });
});

describe('الشاشات الفعلية للدرس الثالث (الدرس الثاني) خالية من التسريب', () => {
  it('كل خطوات الدرس تُعرض بلا أوامر LaTeX خام أو محددات $', () => {
    unit3Lesson2Data.steps.forEach((step, index) => {
      const { container, unmount } = render(
        <StepRenderer step={step} stepIndex={index} totalSteps={unit3Lesson2Data.steps.length} />,
      );
      const text = visibleText(container);
      expect(container.querySelector('.katex-error'), step.id).toBeNull();
      expect(text, step.id).not.toMatch(/\\/);
      expect(text, step.id).not.toContain('$');
      expect(text, step.id).not.toMatch(/q\s*q\s*u\s*a\s*d/i);
      expect(text, step.id).not.toMatch(/\bn\s*e\s*q\b/i);
      unmount();
    });
  });

  it('مساحة المعلّم تعرض الحلول التفصيلية ومفاتيحها بلا نصوص LaTeX خام', () => {
    sessionStorage.clear();
    const { container } = render(<TeacherArea onNavigateHome={() => {}} />);
    fireEvent.change(screen.getByPlaceholderText(/كلمة المرور/), { target: { value: 'somer173' } });
    fireEvent.submit(container.querySelector('form')!);

    const tab = screen.getAllByRole('button', { name: /حذف الأقواس/ })[0];
    fireEvent.click(tab);

    const body = container.querySelector('.ta-content')!;
    const text = visibleText(body);
    expect(text).not.toMatch(/\\/);
    expect(text).not.toContain('$');
    expect(text).not.toMatch(/\bn\s*e\s*q\b/i);
    expect(text).not.toMatch(/q\s*q\s*u\s*a\s*d/i);

    const answerRow = Array.from(body.querySelectorAll('.ta-solution')).find((solution) =>
      visibleText(solution).includes('7x'),
    );
    expect(answerRow, 'لم يُعثر على حل العبارة C في مساحة المعلّم').toBeDefined();
    const finalAnswer = Array.from(answerRow!.querySelectorAll('.ta-solution-row')).find((row) =>
      visibleText(row).includes('الجواب النهائي'),
    );
    expect(finalAnswer, 'لم يُعثر على صفّ الجواب النهائي').toBeDefined();
    expect(finalAnswer!.querySelector('.katex')).toBeInTheDocument();
    expect(visibleText(finalAnswer!)).not.toMatch(/\\/);
  });

  it('صفحة حلول اختبار الدرس الثالث تُعرض بلا أوامر خام', () => {
    const test = resolveTest('u3-test-lesson-2')!;
    const { container } = render(
      <TestSolutions test={test} onReturnToSolutions={() => {}} onReturnToTests={() => {}} />,
    );
    const text = visibleText(container);
    expect(container.querySelector('.katex-error')).toBeNull();
    expect(text).not.toMatch(/\\/);
    expect(text).not.toMatch(/\bn\s*e\s*q\b/i);
  });
});

describe('حماية من تكرار سبب العطل: محتوى String.raw مزدوج الهروب', () => {
  it('لا يحوي أي قالب TeX خام في src/data أو src/components شرطة مزدوجة قبل أمر', () => {
    // القاعدة: داخل `tex`...`` و`String.raw`...`` تكون الشرطة المزدوجة `\\`
    // فاصل سطر داخل بيئة محاذاة، ولا تأتي أبدًا قبل اسم أمر مثل frac/neq/qquad؛
    // و`\\neq` تعني حرفيًا «سطر جديد + الحروف neq» وهو ما ظهر للطالب.
    const commandAlternation =
      'frac|dfrac|tfrac|sqrt|neq|ne|leq|geq|le|ge|qquad|quad|times|cdot|div|pm|mp|' +
      'left|right|text|mathrm|mathbf|mathbb|overline|underline|underbrace|to|rightarrow|' +
      'Rightarrow|Leftarrow|approx|sim|begin|end|aligned|cases|matrix|array';
    const doubledCommand = new RegExp(`\\\\\\\\(${commandAlternation})(?![a-zA-Z])`, 'g');

    const offenders: string[] = [];
    for (const file of collectFiles(['src/data', 'src/components'])) {
      const source = readFileSync(file, 'utf8');
      const literalStart = /(\btex|String\.raw)`/g;
      let match: RegExpExecArray | null;
      while ((match = literalStart.exec(source)) !== null) {
        let cursor = match.index + match[0].length;
        while (cursor < source.length && source[cursor] !== '`') {
          cursor += source[cursor] === '\\' ? 2 : 1;
        }
        const literal = source.slice(match.index + match[0].length, cursor);
        const line = source.slice(0, match.index).split('\n').length;
        for (const hit of literal.matchAll(doubledCommand)) {
          offenders.push(`${file}:${line} → ${JSON.stringify(hit[0])}`);
        }
        literalStart.lastIndex = cursor;
      }
    }

    expect(offenders, offenders.join('\n')).toHaveLength(0);
  });
});

function collectFiles(roots: string[]): string[] {
  const results: string[] = [];
  const walkDirectory = (dir: string) => {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) walkDirectory(full);
      else if (/\.(ts|tsx)$/.test(full)) results.push(full);
    }
  };
  roots.forEach(walkDirectory);
  return results;
}

beforeEach(() => {
  sessionStorage.clear();
});
