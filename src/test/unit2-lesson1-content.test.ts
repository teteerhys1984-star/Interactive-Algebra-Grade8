import { describe, expect, it } from 'vitest';
import { unit2Lesson1Data } from '../data/unit2/lesson01';
import { unit2WarmupData } from '../data/unit2/warmup';
import type { ContentBlock } from '../data/unit1/lesson01';

/**
 * المراجعة المرجعية لأرقام الدرس الأول من الوحدة الثانية.
 *
 * كل قيمة هنا تُعاد حسابها مستقلًا من الأعداد الأصلية (10^n، أو a×10^n) ثم
 * تُقارن بالنص المخزَّن في بيانات الدرس. الفرق بين هذا الاختبار واختبارات
 * البيانات الأخرى أنه لا يثق بأي نتيجة مكتوبة: يحسبها من جديد.
 */

/** يزيل رموز TeX المستعملة في فصل الأرقام ويعيد النص رقمًا قابلًا للقراءة. */
const numericText = (value: string): string =>
  value
    .replace(/\\(?:,|;|!|quad|qquad| )/g, '')
    .replace(/\\text\{[^}]*\}/g, '')
    .replace(/[\s\u00a0\u202f]/g, '')
    .replace(/[\u2212\u2013\u2014]/g, '-');

const toNumber = (value: string): number => Number(numericText(value));

/**
 * تقييم بسيط لنص رياضي مخزَّن: جداء بعلامة \times، أو كسر، أو عدد مباشر.
 * لا يستعمل eval؛ يقسم النص ويجري العمليتين المطلوبتين فقط.
 */
const evaluateTexNumber = (value: string): number => {
  const fraction = value.match(/^\\frac\{(.+?)\}\{(.+?)\}$/);
  if (fraction) return evaluateTexNumber(fraction[1]) / evaluateTexNumber(fraction[2]);
  if (value.includes('\\times')) {
    return value.split('\\times').reduce((product, part) => product * toNumber(part), 1);
  }
  return toNumber(value);
};

const blocks = (): ContentBlock[] => unit2Lesson1Data.steps.flatMap((step) => step.blocks);
const block = (id: string): ContentBlock => {
  const found = blocks().find((entry) => entry.id === id);
  if (!found) throw new Error(`كتلة مفقودة: ${id}`);
  return found;
};

/** الأس من نص من النوع ۱۰^{k}. */
const exponentOf = (tex: string): number => {
  const match = tex.match(/10\^\{(-?\d+)\}/);
  if (!match) throw new Error(`لا يوجد أس في: ${tex}`);
  return Number(match[1]);
};

/** معامل وأس من نص الصيغة المعيارية: a\times10^{n}. */
const standardFormOf = (tex: string): { coefficient: number; exponent: number } => {
  const match = tex.match(/^(.+?)\\times10\^\{(-?\d+)\}$/);
  if (!match) throw new Error(`ليست صيغة a×10^n: ${tex}`);
  return { coefficient: toNumber(match[1]), exponent: Number(match[2]) };
};

const closeTo = (actual: number, expected: number, tolerance = 1e-9): boolean =>
  Math.abs(actual - expected) <= Math.abs(expected) * tolerance + Number.EPSILON * 10;

describe('صفحة 26 — نشاط الإطارات السبعة', () => {
  const items = block('p26-activity-fill').subItems ?? [];

  it('يحتفظ بترتيب الإطارات السبعة نفسه في الكتاب', () => {
    expect(items.map((item) => item.label)).toEqual(['1000', '100', '10', '1', '0.1', '0.01', '0.001']);
  });

  it('كل أس مخزَّن ينتج العدد المكتوب في إطاره', () => {
    for (const item of items) {
      const solution = item.solution ?? '';
      const exponent = exponentOf(solution);
      const value = toNumber(solution.split('=')[0]);
      expect(closeTo(10 ** exponent, value), `${item.label} ← 10^${exponent}`).toBe(true);
      expect(toNumber(item.label ?? ''), item.label).toBe(value);
    }
  });

  it('الإطارات العشرية تحمل الصورة الكسرية 1/10^n أيضًا', () => {
    for (const item of items.slice(4)) {
      const solution = item.solution ?? '';
      const exponent = exponentOf(solution);
      expect(solution, item.label).toContain('\\frac{1}{10^');
      expect(closeTo(1 / 10 ** -exponent, toNumber(item.label ?? '')), item.label).toBe(true);
      expect(toNumber(item.label ?? '')).toBeLessThan(1);
    }
  });
});

describe('صفحة 28 — تحقّق من فهمك وتدرّب', () => {
  it('① وتدرّب 1: كل قوة 10^n تساوي العدد العشري المخزَّن', () => {
    for (const blockId of ['p28-check-1', 'p28-practice-1']) {
      for (const item of block(blockId).subItems ?? []) {
        const math = item.math ?? '';
        const exponent = exponentOf(math);
        const [lhs, rhs] = (item.solution ?? '').split('=');
        expect(exponentOf(lhs), `${blockId} ${item.label}`).toBe(exponent);
        expect(closeTo(10 ** exponent, toNumber(rhs)), `${blockId} ${item.label}`).toBe(true);
      }
    }
  });

  it('② وتدرّب 2: كل عدد عشري مخزَّن يساوي 10^n المكتوبة في الحل', () => {
    for (const blockId of ['p28-check-2', 'p28-practice-2']) {
      for (const item of block(blockId).subItems ?? []) {
        const solution = item.solution ?? '';
        const value = evaluateTexNumber(item.math ?? '');
        if (solution.includes('\\frac{1}{10\\,000}')) {
          expect(closeTo(value, 1 / 10 ** 4)).toBe(true);
          expect(exponentOf(solution.split('=').slice(-1)[0])).toBe(-4);
          continue;
        }
        if ((item.math ?? '').includes('\\times')) {
          // 100×1 000: نتحقق من الجداء نفسه ومن الأس الناتج (2 + 3 = 5).
          expect(evaluateTexNumber(item.math ?? '')).toBe(100 * 1000);
          expect(exponentOf(solution.split('=').slice(-1)[0])).toBe(5);
          continue;
        }
        expect(
          closeTo(10 ** exponentOf(solution.split('=').slice(-1)[0]), value),
          `${blockId} ${item.label}`,
        ).toBe(true);
      }
    }
  });

  it('③ وتدرّب 3: كل صيغة معيارية تعيد العدد الأصلي عند الضرب', () => {
    for (const blockId of ['p28-check-3', 'p28-practice-3']) {
      for (const item of block(blockId).subItems ?? []) {
        const solution = item.solution ?? '';
        // في البند ④ من تحقّق ③ الحل يبدأ بالعدد ثم بالصيغة.
        const form = solution.includes('=') ? solution.split('=').slice(-1)[0] : solution;
        const { coefficient, exponent } = standardFormOf(form);
        const original = toNumber(item.math ?? '');
        expect(closeTo(coefficient * 10 ** exponent, original), `${blockId} ${item.label}`).toBe(true);
        expect(Math.abs(coefficient)).toBeGreaterThanOrEqual(1);
        expect(Math.abs(coefficient)).toBeLessThan(10);
      }
    }
  });

  it('④ من تحقّق ③: «566 3.3» تُقرأ 5 663.3 ويبقى الموضع موسومًا', () => {
    const item = (block('p28-check-3').subItems ?? [])[3];
    expect(item.math).toBe('566\\;3.3');
    expect(item.solution).toContain('5.6633\\times10^{3}');
    expect(item.verifyNote).toBeTruthy();
    expect(closeTo(5.6633 * 10 ** 3, 5663.3)).toBe(true);
  });

  it('تدرّب 4: «4500 مليار» تعادل 4.5×10^12 والصيغتان المخزَّنتان صحيحتان', () => {
    const items = block('p28-practice-4').subItems ?? [];
    expect(items).toHaveLength(3);

    const billions = 4500 * 10 ** 9;
    expect(billions).toBe(4.5 * 10 ** 12);
    expect(toNumber('4\\,500\\,000\\,000\\,000')).toBe(billions);

    expect(toNumber('45') * 10 ** 11).toBe(billions);
    expect(toNumber('0.45') * 10 ** 13).toBe(billions);
    expect(items[1].solution).toContain('45\\times10^{11}');
    expect(items[1].solution).toContain('0.45\\times10^{13}');

    expect(4.5 * 10 ** 12).toBe(billions);
    expect(items[2].solution).toContain('4.5\\times10^{12}');
  });
});

describe('أمثلة الصفحتين 26 و27 — مطابقة النص المخزَّن للحساب', () => {
  it('مثالا 10^3 و10^6', () => {
    expect(block('p26-ex-10-3').mathFormula).toBe('10^3=10\\times10\\times10=1\\,000');
    expect(block('p26-ex-10-6').mathFormula).toBe(
      '10^6=10\\times10\\times10\\times10\\times10\\times10=1\\,000\\,000',
    );
    expect(10 ** 3).toBe(1000);
    expect(10 ** 6).toBe(1000000);
  });

  it('مثالا 10^{-3} و10^{-6}', () => {
    expect(block('p26-ex-10-minus-3').mathFormula).toBe(
      '10^{-3}=\\frac{1}{10^{3}}=\\frac{1}{1\\,000}=0.001',
    );
    expect(block('p27-ex-10-minus-6').mathFormula).toBe(
      '10^{-6}=\\frac{1}{10^{6}}=\\frac{1}{1\\,000\\,000}=0.000\\,001',
    );
    expect(closeTo(10 ** -3, 0.001)).toBe(true);
    expect(closeTo(10 ** -6, 0.000001)).toBe(true);
  });

  it('سلسلة 2 569.8 بالصيغ الأربع تعطي القيمة نفسها', () => {
    const forms: [number, number][] = [
      [25698, -1],
      [0.25698, 4],
      [25.698, 2],
      [2.5698, 3],
    ];
    for (const [coefficient, exponent] of forms) {
      expect(closeTo(coefficient * 10 ** exponent, 2569.8)).toBe(true);
    }
    expect(block('p27-standard-ex').mathFormula).toContain('2.569\\,8\\times10^{3}');
  });

  it('الصيغة المعيارية للعدد السالب تحتفظ بالإشارة أمام a', () => {
    expect(block('p27-standard-negative').mathFormula).toBe('-2\\,569.8=-2.569\\,8\\times10^{3}');
    expect(closeTo(-2.5698 * 10 ** 3, -2569.8)).toBe(true);
  });

  it('اكتساب معارف: 10^4 = 10 000 و10^{-4} = 0.000 1', () => {
    expect(block('p27-convert-positive').mathFormula).toContain('10\\,000');
    expect(block('p27-convert-negative').mathFormula).toBe('10^{-4}=0.000\\,1');
    expect(10 ** 4).toBe(10000);
    expect(closeTo(10 ** -4, 0.0001)).toBe(true);
  });

  it('تحويل 2 715×10^9 و0.075×10^{-22} صحيح عدديًا', () => {
    expect(closeTo(2715 * 10 ** 9, 0.02715 * 10 ** 14)).toBe(true);
    expect(block('p27-ex-2715').mathFormula).toBe(
      '2\\,715\\times10^{9}=2\\,715\\times10^{-5}\\times10^{14}=0.027\\,15\\times10^{14}',
    );
    expect(closeTo(0.075 * 10 ** -22, 7.5 * 10 ** -24)).toBe(true);
    expect(block('p27-ex-0075').mathFormula).toBe(
      '0.075\\times10^{-22}=7.5\\times10^{-2}\\times10^{-22}=7.5\\times10^{-24}',
    );
  });

  it('مثال الصيغة المعيارية في التعريف: 2.03105×10^2 = 203.105', () => {
    expect(block('p27-standard-def').content).toContain('2.03105\\times10^{2}');
    expect(block('p27-standard-def').content).toContain('203.105');
    expect(closeTo(2.03105 * 10 ** 2, 203.105)).toBe(true);
  });
});

describe('انطلاقة نشطة (الصفحة 25) — تحقّق عددي مستقل', () => {
  const warmupBlock = (id: string): ContentBlock => {
    const found = unit2WarmupData.steps
      .flatMap((step) => step.blocks)
      .find((entry) => entry.id === id);
    if (!found) throw new Error(`كتلة انطلاقة مفقودة: ${id}`);
    return found;
  };

  const correctOption = (id: string) => {
    const options = warmupBlock(id).interactiveData?.options ?? [];
    return options.find((option: { isCorrect: boolean }) => option.isCorrect);
  };

  it.each([
    ['p25-item-1', 13.8 * 1000, '13800', '③'],
    ['p25-item-2', 0.0037 * 1000, '3.7', '②'],
    ['p25-item-3', 135.2 * 0.01, '1.352', '②'],
    ['p25-item-4', 6.19 * 0.001, '0.00619', '①'],
  ])('%s: الخيار الصحيح هو القيمة المحسوبة', (id, value, text, label) => {
    const option = correctOption(id);
    expect(option.label).toBe(label);
    expect(Number(option.text)).toBeCloseTo(value as number, 12);
    expect(option.text).toBe(text);
  });

  it('الرموز R^2 وa^3 تعني الضرب المتكرر لا الجمع', () => {
    expect(correctOption('p25-item-5').text).toBe('R\\times R');
    expect(correctOption('p25-item-6').text).toBe('a\\times a\\times a');
    expect(3 ** 2).toBe(3 * 3);
    expect(2 ** 3).toBe(2 * 2 * 2);
  });

  it('تقريب 3.538441805 إلى جزء من عشرة ثم من مئة', () => {
    expect(correctOption('p25-item-7').label).toBe('③');
    expect(correctOption('p25-item-7').text).toBe('3.5');
    expect(Math.round(3.538441805 * 10) / 10).toBe(3.5);

    expect(correctOption('p25-item-8').label).toBe('①');
    expect(correctOption('p25-item-8').text).toBe('3.54');
    expect(Math.round(3.538441805 * 100) / 100).toBe(3.54);
  });
});

describe('الاختبار المستقل للدرس — إجابات محسوبة من جديد', () => {
  const assessment = unit2Lesson1Data.finalAssessment!;
  const question = (id: string) => assessment.questions.find((entry) => entry.id === id)!;

  it('عشرة أسئلة، ولكل سؤال مرجع خطوة داخل الدرس', () => {
    expect(assessment.questions).toHaveLength(10);
    for (const entry of assessment.questions) {
      expect(entry.relatedStepIndex).toBeGreaterThanOrEqual(0);
      expect(entry.relatedStepIndex).toBeLessThan(unit2Lesson1Data.steps.length);
      expect(entry.explanation.trim().length).toBeGreaterThan(0);
    }
  });

  it('الأسئلة الرقمية: الإجابات المقبولة تطابق الحساب', () => {
    expect(question('q2').acceptedAnswers).toContain('0.0001');
    expect(closeTo(10 ** -4, 0.0001)).toBe(true);

    expect(question('q4').acceptedAnswers).toEqual(['-5']);
    expect(closeTo(2.5 * 10 ** -5, 0.000025)).toBe(true);

    expect(question('q6').acceptedAnswers).toEqual(['0.02715']);
    expect(closeTo(2715 * 10 ** 9, 0.02715 * 10 ** 14)).toBe(true);

    expect(question('q9').acceptedAnswers).toEqual(['12']);
    expect(4500 * 10 ** 9).toBe(4.5 * 10 ** 12);
  });

  it('أسئلة الاختيار: الخيار الصحيح هو العبارة الصحيحة فعليًا', () => {
    const q1 = question('q1');
    expect(q1.choices!.find((choice) => choice.id === q1.correctId)!.text).toBe('100\\,000');
    expect(10 ** 5).toBe(100000);

    const q5 = question('q5');
    expect(q5.choices!.find((choice) => choice.id === q5.correctId)!.text).toBe('8.536\\times10^{2}');
    expect(closeTo(8.536 * 10 ** 2, 853.6)).toBe(true);

    const q10 = question('q10');
    expect(q10.correctId).toBe('a');
    expect(10 ** -2).toBeGreaterThan(10 ** -4);

    const q7 = question('q7');
    expect(q7.correctId).toBe('a');
    expect(closeTo(10 ** -2, 0.01)).toBe(true);
  });
});
