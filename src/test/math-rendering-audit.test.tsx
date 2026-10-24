import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { curriculum } from '../data/curriculum';
import { questionBank } from '../data/tests/registry';
import { MathText } from '../components/math/MathText';
import { Math as Formula } from '../components/math/Math';

/**
 * تدقيق شامل لمخرجات العرض الرياضي في كل محتوى المنصة.
 *
 * الفكرة: لا نتحقق من النص المخزَّن، بل من النص الذي يراه الطالب فعلًا بعد
 * `renderToStaticMarkup` عبر المكوّنين المشتركين `MathText` و`Math`. كل حقل
 * نصّي في المنهج وبنك الأسئلة يمرّ من هنا.
 *
 * ما يُعدّ تسريبًا:
 *  - `$` أو `\(` أو `\[` (محلل رياضيات لم يُعِد التنسيق).
 *  - أي شرطة مائلة عكسية `\` ظاهرة (أمر LaTeX خام).
 *  - أسماء أوامر LaTeX مبعثرة الحروف كما يخرجها KaTeX عند اعتبار الأمر نصًا
 *    عاديًا: `neq` تُعرض `n e q`، و`qquad` تُعرض `q q u a d`.
 *
 * سبب وجود هذا الاختبار: `throwOnError: false` في KaTeX يخفي الأخطاء بصريًا،
 * فكانت `\\neq` تُعرض «neq» و`\\;\\;` تُعرض «;;» بينما تبقى اختبارات
 * `.katex-error` خضراء. الاختبار هنا يفحص الحروف الناتجة نفسها.
 */

const VISIBLE_TEXT = (html: string): string =>
  html
    .replace(/<annotation[\s\S]*?<\/annotation>/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();

/** أوامر تُقرأ كنص عادي إن فشل تمريرها إلى KaTeX. */
const COMMAND_NAMES = [
  'neq',
  'qquad',
  'quad',
  'frac',
  'dfrac',
  'sqrt',
  'times',
  'cdot',
  'div',
  'left',
  'right',
  'text',
  'mathrm',
  'mathbb',
  'overline',
  'underbrace',
  'approx',
  'begin',
  'aligned',
  'end',
  'Rightarrow',
  'pm',
  'leq',
  'geq',
];

/** يسمح بمسافات بين الحروف لأن KaTeX يلفّ كل حرف في عنصر مستقل عند التسريب. */
const leakedCommandPattern = (name: string) => new RegExp(name.split('').join('\\s*'), 'i');

const LEAKS: { label: string; test: (visible: string) => boolean }[] = [
  { label: 'raw $ delimiter', test: (v) => v.includes('$') },
  { label: 'raw backslash', test: (v) => v.includes('\\') },
  ...COMMAND_NAMES.map((name) => ({
    label: `leaked \\${name}`,
    test: (v: string) => leakedCommandPattern(name).test(v),
  })),
];

interface Failure {
  where: string;
  renderer: 'MathText' | 'Math';
  leak: string;
  visible: string;
}

const failures: Failure[] = [];
const checked = new Set<string>();
const lessonsSeen = new Set<string>();

function inspect(where: string, value: string): void {
  if (!value || checked.has(value)) return;
  // فقط الحقول التي قد تحمل رياضيًا (محددات أو أوامر أو أسس).
  if (!value.includes('$') && !value.includes('\\') && !value.includes('^') && !value.includes('_')) return;
  checked.add(value);

  const renders: { renderer: 'MathText' | 'Math'; html: string }[] = [
    { renderer: 'MathText', html: renderToStaticMarkup(<MathText text={value} />) },
    { renderer: 'Math', html: renderToStaticMarkup(<Formula math={value} />) },
  ];

  for (const { renderer, html } of renders) {
    if (html.includes('katex-error')) {
      failures.push({ where, renderer, leak: 'katex-error span', visible: VISIBLE_TEXT(html).slice(0, 160) });
    }
    const visible = VISIBLE_TEXT(html);
    for (const leak of LEAKS) {
      if (leak.test(visible)) {
        failures.push({ where, renderer, leak: leak.label, visible: visible.slice(0, 160) });
        break;
      }
    }
  }
}

function walk(value: unknown, where: string, seen = new Set<unknown>()): void {
  if (typeof value === 'string') {
    inspect(where, value);
    return;
  }
  if (!value || typeof value !== 'object') return;
  if (seen.has(value)) return;
  seen.add(value);
  for (const [key, entry] of Object.entries(value as Record<string, unknown>)) {
    walk(entry, `${where}.${key}`, seen);
  }
}

describe('Math display audit — the whole curriculum and the whole question bank', () => {
  it('never shows LaTeX commands, delimiters, or escapes to the student', () => {
    for (const unit of curriculum) {
      lessonsSeen.add(unit.warmup.id);
      walk(unit.warmup, `unit-${unit.number}.warmup`);
      for (const lesson of unit.lessons) {
        lessonsSeen.add(lesson.id);
        walk(lesson, `unit-${unit.number}.${lesson.id}`);
      }
    }
    walk(questionBank, 'question-bank');

    const report = failures
      .slice(0, 25)
      .map((f) => `${f.where} [${f.renderer}] ${f.leak} :: ${f.visible}`)
      .join('\n');
    expect(failures, report).toHaveLength(0);
  });

  it('audits every lesson and warm-up in the curriculum (not just the reported one)', () => {
    const expectedIds = curriculum.flatMap((unit) => [unit.warmup.id, ...unit.lessons.map((l) => l.id)]);
    expect([...lessonsSeen].sort()).toEqual([...new Set(expectedIds)].sort());
    // الحجم ليس تافهًا: آلاف الحقول الرياضية تمرّ من العارضين.
    expect(checked.size).toBeGreaterThan(3000);
  });
});
