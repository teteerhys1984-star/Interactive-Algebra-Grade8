import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../app/App';
import { curriculum, getLessonById } from '../data/curriculum';
import { lesson03Data } from '../data/unit1/lesson03';
import { lesson02Data } from '../data/unit1/lesson02';
import { lesson01Data } from '../data/unit1/lesson01';
import { FinalAssessment } from '../components/assessment/FinalAssessment';
import { ReciprocalExplorer } from '../components/interactive/ReciprocalExplorer';
import { DivisionStepBuilder } from '../components/interactive/DivisionStepBuilder';
import { OrderOfOperationsSorter } from '../components/interactive/OrderOfOperationsSorter';
import { CompoundFractionReader } from '../components/interactive/CompoundFractionReader';
import { CalculatorKeys } from '../components/interactive/CalculatorKeys';
import { SourceContentBlock } from '../components/lesson/SourceContentBlock';
import { TeacherArea } from '../components/teacher/TeacherArea';

const blocks = () => lesson03Data.steps.flatMap((s) => s.blocks);
const titles = (stepIndex: number) => lesson03Data.steps[stepIndex].blocks.map((b) => b.title);

/** يجمع كل النصوص العربية (خارج الرياضيات) لفحص الطباعة والاتجاه. */
const arabicRuns = (): string[] => {
  const out: string[] = [];
  const push = (t?: string) => {
    if (!t) return;
    out.push(t.replace(/\$\$[\s\S]*?\$\$/g, ' ').replace(/\$[^$\n]*?\$/g, ' '));
  };
  blocks().forEach((b) => {
    push(b.content);
    push(b.explanation);
    push(b.title);
    b.subItems?.forEach((s) => {
      push(s.text);
      push(s.explanation);
      push(s.label);
    });
  });
  lesson03Data.finalAssessment!.questions.forEach((q) => {
    push(q.prompt);
    push(q.explanation);
    push(q.hint);
  });
  return out;
};

describe('Lesson 3 — القسمة (Pages 12, 13, 14, 15, 16)', () => {
  beforeEach(() => {
    window.location.hash = '';
    sessionStorage.clear();
  });

  /* ------------------------- Registry & structure ------------------------ */
  describe('Curriculum registry', () => {
    it('registers Lesson 3 in Unit 1 next to Lessons 1 and 2', () => {
      const unit1 = curriculum[0];
      expect(unit1.lessons.map((l) => l.id)).toEqual(['lesson-1', 'lesson-2', 'lesson-3']);
      expect(getLessonById('unit-1', 'lesson-3')).toBeDefined();
    });

    it('carries the correct title, number and source pages', () => {
      expect(lesson03Data.title).toBe('القسمة');
      expect(lesson03Data.number).toBe(3);
      expect(lesson03Data.sourcePages).toEqual([12, 13, 14, 15, 16]);
      expect(curriculum[0].sourcePages).toContain(16);
    });

    it('is a sequential lesson of 10 steps covering every source page', () => {
      expect(lesson03Data.steps.length).toBe(10);
      const covered = new Set(lesson03Data.steps.flatMap((s) => s.sourcePages));
      [12, 13, 14, 15, 16].forEach((p) => expect(covered.has(p)).toBe(true));
    });

    it('every block declares a source reference and a unique id', () => {
      const ids = blocks().map((b) => b.id);
      expect(new Set(ids).size).toBe(ids.length);
      blocks().forEach((b) => {
        expect(b.sourceRef.page).toBeGreaterThanOrEqual(12);
        expect(b.sourceRef.page).toBeLessThanOrEqual(16);
        expect(b.sourceRef.section.length).toBeGreaterThan(0);
      });
    });

    it('marks platform-authored teaching layers with authored:true', () => {
      const authored = blocks().filter((b) => b.authored);
      expect(authored.length).toBeGreaterThanOrEqual(8);
      // كل ما هو منقول من الكتاب ليس authored.
      const verbatim = blocks().filter((b) => !b.authored);
      expect(verbatim.length).toBeGreaterThanOrEqual(20);
    });
  });

  /* ---------------------------- Source fidelity -------------------------- */
  describe('Source fidelity — page 12 (نشاط + تعلّم)', () => {
    it('Step 1 keeps activity ① with its three questions', () => {
      expect(lesson03Data.steps[0].sourcePages).toContain(12);
      const act = lesson03Data.steps[0].blocks.find((b) => b.id === 'l3-p12-act1');
      expect(act?.subItems?.length).toBe(3);
      expect(act?.subItems?.[0].solution).toContain('= 1');
      expect(act?.subItems?.[1].solution).toContain('-1');
      expect(act?.subItems?.[2].solution).toContain('\\frac{b}{a}');
    });

    it('Step 2 keeps activity ② statement «القسمة هي الضرب بالمقلوب»', () => {
      const act2 = lesson03Data.steps[1].blocks.find((b) => b.title.includes('②'));
      expect(act2?.content).toContain('خارج القسمة على عدد');
      expect(act2?.content).toContain('جداء الضرب بمقلوب ذلك العدد');
      expect(act2?.subItems?.[0].solution).toContain('\\times \\frac{b}{a}');
    });

    it('Step 3 keeps all six quotients of activity ③ including the undefined one', () => {
      const ex = lesson03Data.steps[2].blocks.find((b) => b.title.includes('القيمة التامة'));
      expect(ex?.subItems?.length).toBe(6);
      const solutions = ex!.subItems!.map((s) => s.solution ?? '');
      expect(solutions[0]).toContain('= 2');
      expect(solutions[1]).toContain('-4');
      expect(solutions[2]).toContain('5');
      expect(solutions[4]).toContain('0');
      expect(solutions[5]).toContain('غير معرّفة');
    });

    it('Step 3 keeps the calculator screen −2.333333333 and the three bullet questions', () => {
      const calc = lesson03Data.steps[2].blocks.find((b) => b.id === 'l3-p12-calc-screen');
      expect(calc?.interactiveData.screen).toBe('−2.333333333');
      expect(calc?.interactiveData.screenSource).toBe('book');
      // الكتاب يطبع الزر ÷ فقط؛ أي تسلسل ضغط كامل يجب أن يكون في كتلة authored منفصلة.
      expect(calc?.interactiveData.printedKeys).toEqual(['÷']);
      expect(calc?.interactiveData.keys).toBeUndefined();
      const rebuilt = lesson03Data.steps[2].blocks.find((b) => b.id === 'l3-p12-calc-reconstruction');
      expect(rebuilt?.authored).toBe(true);
      expect(rebuilt?.interactiveData.reconstructed).toBe(true);
      const bullets = lesson03Data.steps[2].blocks.find((b) => b.title.includes('الثلاثة'));
      expect(bullets?.subItems?.length).toBe(3);
      expect(bullets?.subItems?.[0].solution).toContain('6.999');
      expect(bullets?.subItems?.[2].solution).toContain('-2.33');
    });

    it('Step 4 keeps the reciprocal definition with both notations and both examples', () => {
      const learn = lesson03Data.steps[3].blocks.find((b) => b.type === 'learn');
      expect(learn?.subItems?.length).toBe(4);
      expect(learn?.subItems?.some((s) => s.math?.includes('x^{-1}'))).toBe(true);
      expect(learn?.subItems?.some((s) => s.math === 'x \\times \\frac{1}{x} = 1')).toBe(true);
      expect(learn?.subItems?.some((s) => s.math?.includes('\\frac{c \\times d}{d \\times c}'))).toBe(true);
      expect(titles(3).some((t) => t.includes('مقلوب كسر سالب'))).toBe(true);
      const ex1 = lesson03Data.steps[3].blocks.find((b) => b.id === 'l3-p13-ex-recip-1');
      expect(ex1?.mathFormula).toContain('-\\frac{3}{7}');
      const ex2 = lesson03Data.steps[3].blocks.find((b) => b.id === 'l3-p13-ex-recip-2');
      expect(ex2?.mathFormula).toContain('= 5');
    });
  });

  describe('Source fidelity — pages 13, 14, 15', () => {
    it('Step 5 keeps both division rules (h ÷ d/c and a/b ÷ d/c)', () => {
      const learn = lesson03Data.steps[4].blocks.find((b) => b.type === 'learn');
      expect(learn?.content).toContain('نضرب العدد بمقلوب الكسر');
      expect(learn?.subItems?.[0].math).toBe('h \\div \\frac{d}{c} = h \\times \\frac{c}{d}');
      expect(learn?.subItems?.[1].math).toBe(
        '\\frac{a}{b} \\div \\frac{d}{c} = \\frac{a}{b} \\times \\frac{c}{d}',
      );
    });

    it('Step 5 keeps the three ordered bullets of the worked example and its result −2/5', () => {
      const worked = lesson03Data.steps[4].blocks.find((b) => b.id === 'l3-p13-worked-1');
      expect(worked?.subItems?.length).toBe(3);
      expect(worked?.subItems?.[0].text).toContain('نضع أولاً إشارة خارج القسمة');
      expect(worked?.subItems?.[1].text).toContain('نضرب الكسر المقسوم بمقلوب المقسوم عليه');
      expect(worked?.subItems?.[2].text).toContain('لا نغفل الاختصار');
      expect(worked?.subItems?.[2].solution).toContain('-\\frac{2}{5}');
    });

    it('Step 5 keeps 3/4 ÷ 2 = 3/8 and the compound examples A = −20/9, B = −2/15', () => {
      const simple = lesson03Data.steps[4].blocks.find((b) => b.id === 'l3-p13-worked-2');
      expect(simple?.mathFormula).toContain('\\frac{3}{8}');
      const ab = lesson03Data.steps[4].blocks.find((b) => b.id === 'l3-p13-compound-AB');
      expect(ab?.subItems?.[0].solution).toContain('-\\frac{20}{9}');
      expect(ab?.subItems?.[1].solution).toContain('-\\frac{2}{15}');
      // العبارات مكتوبة بخط كسر حقيقي، لا بشرطة مائلة نصية.
      expect(ab?.subItems?.[0].math).toContain('\\dfrac');
    });

    it('Step 6 keeps the three priority rules and both worked examples (−49/100, −9/4)', () => {
      const rules = lesson03Data.steps[5].blocks.find((b) => b.id === 'l3-p14-priorities');
      expect(rules?.subItems?.length).toBe(3);
      expect(rules?.subItems?.[0].text).toContain('داخل الأقواس');
      expect(rules?.subItems?.[1].text).toContain('الضرب والقسمة');
      expect(rules?.subItems?.[2].text).toContain('الجمع والطرح');
      const ex = lesson03Data.steps[5].blocks.find((b) => b.id === 'l3-p14-example-AB');
      expect(ex?.subItems?.[0].solution).toContain('-\\frac{49}{100}');
      expect(ex?.subItems?.[1].solution).toContain('-\\frac{9}{4}');
    });

    it('Step 7 keeps a/b = a × 1/b, the −4/0.5 = −8 example and the نظير/مقلوب comparison', () => {
      const rule = lesson03Data.steps[6].blocks.find((b) => b.id === 'l3-p15-divide-by-number');
      expect(rule?.mathFormula).toContain('a \\times \\frac{1}{b}');
      const dec = lesson03Data.steps[6].blocks.find((b) => b.id === 'l3-p15-example-decimal');
      expect(dec?.mathFormula).toContain('-8');
      const cmp = lesson03Data.steps[6].blocks.find((b) => b.id === 'l3-p15-opposite-vs-reciprocal');
      expect(cmp?.subItems?.[0].text).toContain('نظير $-5$ هو $5$');
      // القراءة حُسمت من القصاصة المكبّرة: مقلوب −5 = −0.2، فلا قراءة بديلة ولا تعليق تحقّق.
      expect(cmp?.subItems?.[1].text).toContain('مقلوب $-5$');
      expect(cmp?.subItems?.[1].math).toBe('\\frac{1}{-5} = -\\frac{1}{5} = -0.2');
      expect(cmp?.verifyNote).toBeUndefined();
      expect(cmp?.subItems?.every((si) => !si.verifyNote)).toBe(true);
    });

    it('Step 8 keeps both calculator key sequences and the results A = −7/8, B = 109/50', () => {
      const a = lesson03Data.steps[7].blocks.find((b) => b.id === 'l3-p15-calc-A');
      const b = lesson03Data.steps[7].blocks.find((b2) => b2.id === 'l3-p15-calc-B');
      // الصف المطبوع في الكتاب محفوظ بترتيب ظهوره، وصف الضغط معكوسه وموسوم كإعادة بناء.
      expect(a?.interactiveData.printedKeys[0]).toBe('8');
      expect(a?.interactiveData.keys).toEqual([...a!.interactiveData.printedKeys].reverse());
      expect(a?.interactiveData.reconstructed).toBe(true);
      expect(b?.interactiveData.printedKeys[0]).toBe('100');
      expect(b?.interactiveData.keys).toEqual([...b!.interactiveData.printedKeys].reverse());
      expect(b?.interactiveData.reconstructed).toBe(true);
      expect(a?.interactiveData.screen).toBeUndefined();
      expect(b?.interactiveData.screen).toBeUndefined();
      const res = lesson03Data.steps[7].blocks.find((x) => x.id === 'l3-p15-calc-results');
      expect(res?.mathFormula).toContain('-\\frac{7}{8}');
      expect(res?.mathFormula).toContain('\\frac{109}{50}');
    });

    it('Step 8 keeps the compound expression C and its full solution −5/8', () => {
      const c = lesson03Data.steps[7].blocks.find((b) => b.id === 'l3-p15-compound');
      expect(c?.mathFormula).toContain('3 + \\dfrac{1}{5}');
      const sol = lesson03Data.steps[7].blocks.find((b) => b.id === 'l3-p15-compound-solution');
      expect(sol?.content).toContain('خط الكسر المحاذي للرمز');
      expect(sol?.subItems?.[0].math).toContain('\\frac{16}{5}');
      expect(sol?.subItems?.[1].solution).toContain('-\\frac{5}{8}');
    });
  });

  describe('Source fidelity — page 16 (تحقّق من فهمك + تدرّب)', () => {
    it('Step 9 keeps the four تحقّق exercises with all their items', () => {
      const step = lesson03Data.steps[8];
      expect(step.sourcePages).toEqual([16]);
      const source = step.blocks.filter((b) => !b.authored);
      expect(source.length).toBe(4);
      expect(source[0].subItems?.length).toBe(4);
      expect(source[0].subItems?.[0].solution).toContain('\\frac{9}{7}');
      expect(source[1].subItems?.[0].solution).toContain('= 1');
      expect(source[2].interactiveType).toBe('fill-blank');
      expect(source[2].interactiveData.solution).toContain('\\frac{21}{20}');
      expect(source[3].subItems?.length).toBe(4);
      expect(source[3].subItems?.[0].solution).toContain('\\frac{33}{50}');
      expect(source[3].subItems?.[1].solution).toContain('-\\frac{6}{13}');
      expect(source[3].subItems?.[2].solution).toContain('-\\frac{5}{2}');
      // الحلول من المنصة لا من الكتاب — يجب أن يُصرَّح بذلك للطالب.
      expect(step.blocks[0].authored).toBe(true);
      expect(step.blocks[0].content).toContain('من إعداد المنصة');
    });

    it('Step 10 keeps the five تدرّب exercises including the olive word problem', () => {
      const step = lesson03Data.steps[9];
      const ids = step.blocks.map((b) => b.id);
      ['l3-p16-practice-1', 'l3-p16-practice-2', 'l3-p16-practice-3', 'l3-p16-practice-4', 'l3-p16-practice-5'].forEach(
        (id) => expect(ids).toContain(id),
      );
      // ترقيم الكتاب لقسم «تدرّب» يبدأ من ① وليس من ⑤.
      const printed = step.blocks
        .filter((b) => !b.authored)
        .map((b) => b.sourceRef?.item);
      expect(printed).toEqual(['①', '②', '③', '④', '⑤']);
      const one = step.blocks.find((b) => b.id === 'l3-p16-practice-1');
      expect(one?.title).toContain('انسخْ وأكملْ');
      expect(one?.subItems?.length).toBe(6);
      expect(one?.subItems?.[4].solution).toContain('6.5');
      const two = step.blocks.find((b) => b.id === 'l3-p16-practice-2');
      expect(two?.subItems?.length).toBe(4);
      expect(two?.subItems?.[0].solution).toContain('\\frac{28}{15}');
      expect(two?.subItems?.[2].solution).toContain('\\frac{1}{6}');
      // البند ④ حُسم من القصاصة: −2 ÷ 4/5.
      expect(two?.subItems?.[3].math).toBe('-2 \\div \\frac{4}{5}');
      expect(two?.subItems?.[3].verifyNote).toBeUndefined();
      const three = step.blocks.find((b) => b.id === 'l3-p16-practice-3');
      expect(three?.subItems?.[0].solution).toContain('\\frac{21}{40}');
      const four = step.blocks.find((b) => b.id === 'l3-p16-practice-4');
      expect(four?.subItems?.length).toBe(4);
      expect(four?.subItems?.[0].solution).toContain('0.01');
      const five = step.blocks.find((b) => b.id === 'l3-p16-practice-5');
      expect(five?.type).toBe('word-problem');
      expect(five?.content).toContain('500');
      expect(five?.subItems?.[1].solution).toContain('\\frac{5500}{9}');
    });

    it('carries no unresolved reading left: every source segment is confirmed', () => {
      const flagged = blocks().filter(
        (b) => b.verifyNote || b.subItems?.some((s) => s.verifyNote),
      );
      // كل المقاطع حُسمت من القصاصات المكبّرة ⇒ لا verifyNote في الدرس.
      expect(flagged).toEqual([]);
      // «تحقّق ① / ④»: البسط عدد عشري 3.4 والمقام 3، والمقلوب 15/17.
      const item34 = lesson03Data.steps[8].blocks.find((b) => b.id === 'l3-p16-check-1')!.subItems?.[3];
      expect(item34?.math).toBe('\\frac{3.4}{3}');
      expect(item34?.verifyNote).toBeUndefined();
      expect(item34?.solution).toContain('\\frac{15}{17}');
      // البند ④ من «تحقّق ④» حُسم بالقصاصة: الخط الرئيسي الأطول تحت (−5) ⇒ البسط (16)/(−5) والمقام 2.
      const item4 = lesson03Data.steps[8].blocks.find((b) => b.id === 'l3-p16-check-4')!.subItems?.[3];
      expect(item4?.verifyNote).toBeUndefined();
      expect(item4?.math).toBe('\\dfrac{\\dfrac{16}{-5}}{2}');
      expect(item4?.solution).toContain('-\\frac{8}{5}');
      expect(item4?.solution).not.toContain('-\\frac{32}{5}');
      expect(item4?.solution).not.toContain('-\\frac{5}{32}');
    });
  });

  /* --------------------------- Mathematics / BIDI ------------------------ */
  describe('Mathematical typography and BIDI safety', () => {
    it('never uses plain-text slash fractions inside Arabic prose', () => {
      const offenders = arabicRuns().filter((t) => /\d\s*\/\s*\d/.test(t));
      expect(offenders).toEqual([]);
    });

    it('writes every fraction with \\frac or \\dfrac inside math', () => {
      const mathStrings: string[] = [];
      blocks().forEach((b) => {
        if (b.mathFormula) mathStrings.push(b.mathFormula);
        b.subItems?.forEach((s) => {
          if (s.math) mathStrings.push(s.math);
          if (s.solution) mathStrings.push(s.solution);
        });
      });
      expect(mathStrings.length).toBeGreaterThan(40);
      mathStrings.forEach((m) => {
        // شرطة مائلة عارية بين رقمين داخل الرياضيات ممنوعة (الكسور عمودية).
        expect(/\d\s*\/\s*\d/.test(m)).toBe(false);
      });
    });

    it('renders lesson math isolated as LTR inside the RTL page', () => {
      window.location.hash = '#/unit/unit-1/lesson/lesson-3/4';
      const { container } = render(<App />);
      const mathNodes = container.querySelectorAll('.math-inline-isolated, .math-block-isolated');
      expect(mathNodes.length).toBeGreaterThan(0);
      mathNodes.forEach((n) => expect(n.getAttribute('dir')).toBe('ltr'));
      expect(container.querySelectorAll('.katex .mfrac').length).toBeGreaterThan(0);
    });

    it('renders math inside block titles as isolated LTR (no raw $...$ in the heading)', () => {
      // الخطوة 5 تحوي «مثال محلول: لإنجاز العملية …» والخطوة 4 تحوي «قراءة الرمز x^{-1} دون خوف».
      [['#/unit/unit-1/lesson/lesson-3/5', 'مثال محلول: لإنجاز العملية'],
       ['#/unit/unit-1/lesson/lesson-3/4', 'قراءة الرمز']].forEach(([hash, arabic]) => {
        window.location.hash = hash;
        const { container, unmount } = render(<App />);
        const heading = Array.from(container.querySelectorAll('.block-title')).find((h) =>
          (h.textContent ?? '').includes(arabic),
        );
        expect(heading).toBeDefined();
        // النص العربي كما هو، بلا علامات $ ولا أوامر LaTeX ظاهرة للطالب.
        const withoutMath = heading!.cloneNode(true) as HTMLElement;
        withoutMath.querySelectorAll('.math-inline-isolated').forEach((n) => n.remove());
        expect(withoutMath.textContent).toContain(arabic);
        expect(withoutMath.textContent).not.toContain('$');
        expect(withoutMath.textContent).not.toContain('\\frac');
        // الرياضيات داخل العنوان معزولة LTR ومرسومة بـ KaTeX.
        const isolated = heading!.querySelectorAll('.math-inline-isolated');
        expect(isolated.length).toBeGreaterThan(0);
        isolated.forEach((n) => expect(n.getAttribute('dir')).toBe('ltr'));
        expect(heading!.querySelectorAll('.katex').length).toBeGreaterThan(0);
        unmount();
      });
    });

    it('wires every CalculatorKeys prop through SourceContentBlock (printed vs reconstructed vs screen)', () => {
      /** يقرأ صفوف اللوحة كما يراها الطالب فعلًا: وسم الصف + مفاتيحه. */
      const readRows = (container: HTMLElement) =>
        Array.from(container.querySelectorAll('.ck-row')).map((row) => ({
          tag: row.querySelector('.ck-row-tag')?.textContent?.trim() ?? '',
          isBook: !!row.querySelector('.ck-tag-book'),
          isPlatform: !!row.querySelector('.ck-tag-platform'),
          keys: Array.from(row.querySelectorAll('.ck-key')).map((k) => k.textContent),
        }));
      const blockById = (id: string) => blocks().find((b) => b.id === id)!;

      // ① صفحة 12: الزر ÷ مطبوع في الكتاب، والشاشة مصدرها الكتاب أيضًا.
      const p12 = render(<SourceContentBlock block={blockById('l3-p12-calc-screen')} />);
      const p12Rows = readRows(p12.container);
      expect(p12Rows.length).toBe(1);
      expect(p12Rows[0].keys).toEqual(['÷']);
      expect(p12Rows[0].isBook).toBe(true);
      expect(p12Rows[0].isPlatform).toBe(false);
      const p12Screen = p12.container.querySelector('.ck-screen-wrap');
      expect(p12Screen?.querySelector('.ck-screen')?.textContent).toBe('−2.333333333');
      expect(p12Screen?.querySelector('.ck-tag-book')).toBeTruthy();
      expect(p12Screen?.querySelector('.ck-tag-platform')).toBeNull();
      p12.unmount();

      // ② صفحة 12: تسلسل الضغط المُعاد بناؤه يجب ألا يُنسب إلى الكتاب.
      const rebuilt = render(<SourceContentBlock block={blockById('l3-p12-calc-reconstruction')} />);
      const rebuiltRows = readRows(rebuilt.container);
      expect(rebuiltRows.length).toBe(1);
      expect(rebuiltRows[0].keys).toEqual(['7', '÷', '(−)', '3', '=']);
      expect(rebuiltRows[0].isPlatform).toBe(true);
      expect(rebuiltRows[0].isBook).toBe(false);
      expect(rebuiltRows[0].tag).toContain('إعادة بناء من المنصة');
      rebuilt.unmount();

      // ③ صفحة 15: صف مطبوع + صف إعادة بناء، كلٌّ بوسمه الصحيح ومفاتيحه الصحيحة.
      (['l3-p15-calc-A', 'l3-p15-calc-B'] as const).forEach((id) => {
        const block = blockById(id);
        const { container, unmount } = render(<SourceContentBlock block={block} />);
        const rows = readRows(container);
        expect(rows.length).toBe(2);
        expect(rows[0].isBook).toBe(true);
        expect(rows[0].tag).toContain('مطبوع في الكتاب');
        expect(rows[0].keys).toEqual(block.interactiveData.printedKeys);
        expect(rows[1].isPlatform).toBe(true);
        expect(rows[1].tag).toContain('إعادة بناء من المنصة');
        expect(rows[1].keys).toEqual(block.interactiveData.keys);
        // لا شاشة مخترعة في صفحة 15.
        expect(container.querySelector('.ck-screen-wrap')).toBeNull();
        unmount();
      });
    });

    it('renders the printed ÷ key and the book-sourced screen inside the running lesson (step 3)', () => {
      window.location.hash = '#/unit/unit-1/lesson/lesson-3/3';
      const { container } = render(<App />);
      const printedRow = Array.from(container.querySelectorAll('.ck-row')).find(
        (row) => !!row.querySelector('.ck-tag-book'),
      );
      expect(printedRow).toBeDefined();
      expect(Array.from(printedRow!.querySelectorAll('.ck-key')).map((k) => k.textContent)).toEqual(['÷']);
      expect(container.querySelector('.ck-screen')?.textContent).toBe('−2.333333333');
      // صف إعادة البناء موجود أيضًا وموسوم كمنصة لا ككتاب.
      expect(container.querySelectorAll('.ck-tag-platform').length).toBeGreaterThan(0);
    });

    it('keeps calculator key sequences in an isolated LTR run', () => {
      const { container } = render(
        <CalculatorKeys
          printedKeys={['8', 'a b/c', '3']}
          keys={['3', 'a b/c', '8']}
          reconstructed
          screen="−2.333333333"
        />,
      );
      container.querySelectorAll('.ck-keys').forEach((row) =>
        expect(row.getAttribute('dir')).toBe('ltr'),
      );
      expect(container.querySelector('.ck-screen')?.getAttribute('dir')).toBe('ltr');
      // فصل صريح بين المطبوع في الكتاب وإعادة البناء.
      expect(screen.getAllByText('مطبوع في الكتاب').length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText('إعادة بناء من المنصة')).toBeInTheDocument();
    });
  });

  /* ------------------------------ Lesson flow ---------------------------- */
  describe('Lesson flow (sequential, one step at a time)', () => {
    it('renders only the current step and advances with Next', () => {
      window.location.hash = '#/unit/unit-1/lesson/lesson-3';
      render(<App />);
      expect(screen.getByText(/الخطوة 1 من 10/)).toBeInTheDocument();
      expect(screen.queryByText(/الخطوة 2 من 10/)).not.toBeInTheDocument();
      fireEvent.click(screen.getByLabelText('الخطوة التالية'));
      expect(screen.getByText(/الخطوة 2 من 10/)).toBeInTheDocument();
    });

    it('supports deep links to a specific step and going back', () => {
      window.location.hash = '#/unit/unit-1/lesson/lesson-3/6';
      render(<App />);
      expect(screen.getByText(/الخطوة 6 من 10/)).toBeInTheDocument();
      fireEvent.click(screen.getByLabelText('الخطوة السابقة'));
      expect(screen.getByText(/الخطوة 5 من 10/)).toBeInTheDocument();
    });

    it('shows the outline with all ten steps for navigation', () => {
      window.location.hash = '#/unit/unit-1/lesson/lesson-3';
      const { container } = render(<App />);
      const outlineItems = container.querySelectorAll('.lesson-sidebar .outline-list .outline-item-btn');
      expect(outlineItems.length).toBeGreaterThanOrEqual(10);
    });

    it('last step leads to the comprehensive assessment', () => {
      window.location.hash = '#/unit/unit-1/lesson/lesson-3/10';
      render(<App />);
      expect(screen.getByText(/الخطوة 10 من 10/)).toBeInTheDocument();
      fireEvent.click(screen.getByLabelText('الانتقال إلى الاختبار الشامل'));
      expect(screen.getAllByText(/الاختبار الشامل/).length).toBeGreaterThanOrEqual(1);
    });

    it('never leaks teacher answer keys into the student view', () => {
      window.location.hash = '#/unit/unit-1/lesson/lesson-3/10';
      render(<App />);
      expect(screen.queryByText(/مفاتيح الإجابة/)).not.toBeInTheDocument();
      expect(screen.queryByText(/أهداف الدرس/)).not.toBeInTheDocument();
    });
  });

  /* --------------------------- Final assessment -------------------------- */
  describe('Final assessment (original questions)', () => {
    it('has 12 original questions with a 70% pass threshold', () => {
      const fa = lesson03Data.finalAssessment!;
      expect(fa.questions.length).toBe(12);
      expect(fa.passThreshold).toBe(70);
      const types = new Set(fa.questions.map((q) => q.type));
      expect(types.size).toBeGreaterThanOrEqual(5);
    });

    it('every question has an explanation, a concept and a valid step link', () => {
      lesson03Data.finalAssessment!.questions.forEach((q) => {
        expect(q.explanation.length).toBeGreaterThan(10);
        expect(q.concept.length).toBeGreaterThan(0);
        expect(q.relatedStepIndex).toBeGreaterThanOrEqual(0);
        expect(q.relatedStepIndex).toBeLessThan(lesson03Data.steps.length);
        if (q.choices) expect(q.choices.some((c) => c.id === q.correctId)).toBe(true);
        else expect(q.acceptedAnswers?.length).toBeGreaterThan(0);
      });
    });

    it('does not simply copy the textbook exercises', () => {
      const bookNumbers = ['\\frac{28}{15}', '\\frac{21}{40}', '\\frac{5500}{9}', '\\frac{15}{17}'];
      const answers = lesson03Data.finalAssessment!.questions.map((q) => q.answerDisplay ?? '');
      bookNumbers.forEach((n) => expect(answers.some((a) => a.includes(n))).toBe(false));
    });

    it('scores the test and offers review navigation back to the lesson', () => {
      const onGoToStep = vi.fn();
      const { container } = render(
        <FinalAssessment
          assessment={lesson03Data.finalAssessment!}
          onExit={() => {}}
          onGoToStep={onGoToStep}
        />,
      );
      // السؤال الأول اختيار من متعدد والإجابة الصحيحة هي الخيار الثاني (b).
      const choices = container.querySelectorAll('.aq-choice');
      fireEvent.click(choices[1] as HTMLElement);
      for (let i = 0; i < 11; i++) fireEvent.click(screen.getByText('التالي'));
      fireEvent.click(screen.getByText(/إنهاء الاختبار/));
      expect(screen.getByText('1 / 12')).toBeInTheDocument();
      expect(screen.getByText(/مراجعة الأسئلة/)).toBeInTheDocument();
      fireEvent.click(screen.getAllByText('مراجعة الشرح في الدرس')[0]);
      expect(onGoToStep).toHaveBeenCalled();
    });
  });

  /* ------------------------------ Teacher area --------------------------- */
  describe('Teacher area (password gate: somer173)', () => {
    it('ships objectives, mistakes, remediation, notes, guidance and answer keys for Lesson 3', () => {
      const ta = lesson03Data.teacherArea!;
      expect(ta.objectives.length).toBeGreaterThanOrEqual(5);
      expect(ta.commonMistakes.length).toBeGreaterThanOrEqual(5);
      expect(ta.remediation.length).toBeGreaterThanOrEqual(4);
      expect(ta.teachingNotes.length).toBeGreaterThanOrEqual(4);
      expect(ta.assessmentGuidance.length).toBeGreaterThanOrEqual(3);
      expect(ta.answerKeys.length).toBe(4);
      expect(ta.answerKeys.some((g) => g.source.includes('16'))).toBe(true);
    });

    it('keeps Lesson 3 content gated behind the password', () => {
      render(<TeacherArea onNavigateHome={() => {}} />);
      expect(screen.queryByText(/القسمة/)).not.toBeInTheDocument();
      fireEvent.change(screen.getByLabelText('كلمة المرور'), { target: { value: 'somer173' } });
      fireEvent.click(screen.getByText('دخول'));
      expect(screen.getAllByText(/الدرس 3/).length).toBeGreaterThanOrEqual(1);
    });
  });

  /* --------------------------- Interactive demos ------------------------- */
  describe('Interactive components of Lesson 3', () => {
    it('ReciprocalExplorer shows reciprocal, opposite and the product = 1', () => {
      const { container } = render(<ReciprocalExplorer initial={{ n: 3, d: 4 }} />);
      expect(screen.getByText('المقلوب')).toBeInTheDocument();
      expect(screen.getByText('النظير (للمقارنة)')).toBeInTheDocument();
      expect(container.querySelectorAll('.katex').length).toBeGreaterThan(0);
      expect(screen.getByText(/جداء العدد بمقلوبه/)).toBeInTheDocument();
    });

    it('ReciprocalExplorer reports that zero has no reciprocal', () => {
      render(<ReciprocalExplorer initial={{ n: 0, d: 4 }} />);
      expect(screen.getByText('الصفر لا مقلوب له')).toBeInTheDocument();
    });

    it('DivisionStepBuilder reveals sign → reciprocal → simplification in order', () => {
      render(<DivisionStepBuilder initial={{ n1: -1, d1: 2, n2: 5, d2: 4 }} />);
      fireEvent.click(screen.getByText('① حدّد إشارة خارج القسمة'));
      expect(screen.getByText(/إشارتاهما مختلفتان/)).toBeInTheDocument();
      fireEvent.click(screen.getByText('② اضرب بمقلوب المقسوم عليه'));
      expect(screen.getByText('الضرب بالمقلوب')).toBeInTheDocument();
      fireEvent.click(screen.getByText('③ اختصر الناتج'));
      expect(screen.getByText('الاختصار')).toBeInTheDocument();
      expect(screen.getByText(/المقسوم عليه وحده هو/)).toBeInTheDocument();
    });

    it('OrderOfOperationsSorter waits for the full order before giving calm feedback', () => {
      const steps = [
        { text: 'الخطوة الأولى' },
        { text: 'الخطوة الثانية' },
        { text: 'الخطوة الثالثة' },
      ];
      const { container } = render(
        <OrderOfOperationsSorter expression="B = 1" steps={steps} shuffled={[2, 0, 1]} />,
      );
      const reviewBtn = screen.getByText('راجع الترتيب').closest('button') as HTMLButtonElement;
      expect(reviewBtn.disabled).toBe(true); // لا حكم قبل اكتمال الترتيب
      fireEvent.click(screen.getByText('الخطوة الأولى'));
      fireEvent.click(screen.getByText('الخطوة الثانية'));
      fireEvent.click(screen.getByText('الخطوة الثالثة'));
      fireEvent.click(reviewBtn);
      expect(screen.getByText('ترتيب سليم')).toBeInTheDocument();
      expect(container.querySelectorAll('.oo-right').length).toBe(3);
    });

    it('CompoundFractionReader checks the reading then reveals the steps', () => {
      const { container } = render(
        <CompoundFractionReader
          items={[
            {
              expression: '\\dfrac{-2}{3 + \\dfrac{1}{5}}',
              readings: [
                { text: '(-2) \\div \\left(3 + \\frac{1}{5}\\right)', correct: true },
                { text: '\\frac{-2}{3} + \\frac{1}{5}' },
              ],
              solution: '-\\frac{5}{8}',
              explain: 'الخط الرئيسي يفصل العبارة كاملة.',
            },
          ]}
        />,
      );
      fireEvent.click(container.querySelectorAll('.cf-reading')[0] as HTMLElement);
      fireEvent.click(screen.getByText('تحقّق'));
      expect(screen.getByText('قراءة صحيحة')).toBeInTheDocument();
      fireEvent.click(screen.getByText('إظهار خطوات الحل'));
      expect(screen.getByText('خطوات الحل:')).toBeInTheDocument();
    });

    it('lesson 3 uses several distinct interaction types tied to its concepts', () => {
      const kinds = new Set(blocks().map((b) => b.interactiveType).filter(Boolean));
      ['reciprocal-explorer', 'division-builder', 'operations-order', 'compound-fraction', 'calculator-keys', 'practice-check', 'fill-blank'].forEach(
        (k) => expect(kinds.has(k)).toBe(true),
      );
    });
  });

  /* --------------------------- Previous lessons -------------------------- */
  describe('Regression — Lessons 1 and 2 untouched', () => {
    it('Lesson 1 still has 6 steps and no assessment', () => {
      expect(lesson01Data.steps.length).toBe(6);
      expect(lesson01Data.finalAssessment).toBeUndefined();
    });

    it('Lesson 2 still has 8 steps and a 10-question assessment', () => {
      expect(lesson02Data.steps.length).toBe(8);
      expect(lesson02Data.finalAssessment!.questions.length).toBe(10);
    });

    it('Lesson 2 still renders and navigates', () => {
      window.location.hash = '#/unit/unit-1/lesson/lesson-2';
      render(<App />);
      expect(screen.getByText(/الخطوة 1 من 8/)).toBeInTheDocument();
    });
  });
});
