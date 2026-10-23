import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import katex from 'katex';
import { unit2Lesson5Data } from '../data/unit2/lesson05';
import { unit2Lesson5Questions } from '../data/unit2/lesson05Questions';
import { unit2Lesson5SubItemCount, unit2Lesson5TeacherSolutions } from '../data/unit2/lesson05TeacherSolutions';
import { unit2Lesson5Stations } from '../data/unit2/lesson05Stations';
import { getTestsByType, resolveTest } from '../data/tests/registry';

/**
 * تمارين الوحدة الثانية (الدرس الخامس) — تحقق من مطابقة المصدر.
 *
 * الجرد أدناه مأخوذ من صور المصدر الأربعين: السؤال 1 صورتان (①–⑥ ثم ⑦–⑩) وباقي
 * الأسئلة صورة لكل سؤال. الأعداد المكتوبة هنا هي «مقياس المصدر»، ولا تُعدَّل إلا
 * بعد إعادة قراءة الصور. الاختبار يفحص:
 *  - عدد الأسئلة وترتيبها وترقيمها،
 *  - عدد البنود الفرعية وعلاماتها (خصوصًا الترقيم المتداخل 1./①)،
 *  - وجود حل وتحقّق لكل بند،
 *  - سلامة كل صيغة رياضية (KaTeX) وسلامة النص من محارف تحكّم،
 *  - بروز الصيغة المعيارية في أسئلة تحقّق اختيار من متعدد (الصواب والموضع)،
 *  - وجود وسم مصدر حقيقي بدل رقم صفحة غير موجود،
 *  - اتساق مفاتيح مساحة المعلّم مع البنود.
 */

/** مقياس المصدر: عدد البنود الفرعية لكل سؤال (1–39). */
const SOURCE_ITEM_COUNTS: Record<number, number> = {
  1: 10, 2: 10, 3: 9, 4: 6, 5: 4, 6: 6, 7: 1, 8: 2, 9: 8, 10: 6,
  11: 4, 12: 4, 13: 3, 14: 1, 15: 2, 16: 4, 17: 2, 18: 8, 19: 4, 20: 4,
  21: 4, 22: 3, 23: 1, 24: 1, 25: 4, 26: 3, 27: 6, 28: 4, 29: 2, 30: 10,
  31: 9, 32: 3, 33: 2, 34: 2, 35: 4, 36: 1, 37: 2, 38: 2, 39: 4,
};

/** علامات البنود كما في المصدر، للأسئلة ذات الترقيم المتداخل. */
const SOURCE_LABELS: Record<number, string[]> = {
  3: ['1.①', '1.②', '1.③', '2.①', '2.②', '2.③', '3.①', '3.②', '3.③'],
  4: ['1.①', '1.②', '1.③', '2.①', '2.②', '2.③'],
  6: ['1.①', '1.②', '1.③', '2.①', '2.②', '2.③'],
  18: ['1.①', '1.②', '2.①', '2.②', '3.①', '3.②', '4.①', '4.②'],
  30: ['1.①', '1.②', '2.①', '2.②', '3.①', '3.②', '3.③', '3.④', '4.①', '4.②'],
  31: ['1.①', '1.②', '1.③', '2.①', '2.②', '2.③', '3.①', '3.②', '3.③'],
  39: ['1.①', '1.②', '2.①', '2.②'],
};

/** أسئلة التحقّق السريع: السؤال ← الإجابة الصحيحة المتوقعة وموضعها. */
const PROBE_ANSWERS: Record<number, { answer: string; index: number }> = {
  2: { answer: '\\frac{1}{10^{3}}', index: 1 },
  6: { answer: '537\\times10^{-5}', index: 2 },
  9: { answer: 'p=3', index: 0 },
  13: { answer: '10^{4}', index: 2 },
  16: { answer: '1.8\\times10^{3}', index: 1 },
  21: { answer: '149', index: 2 },
  25: { answer: '10^{5}', index: 0 },
  27: { answer: '2.4\\times10^{-4}', index: 1 },
  31: { answer: 'x^{-7}', index: 2 },
  35: { answer: 'p=-2', index: 0 },
};

/** عدد البنود في كل محطة، محسوبًا من مقياس المصدر لا من البيانات نفسها. */
const STATION_ITEM_COUNTS = unit2Lesson5Stations.map((station) =>
  Object.entries(SOURCE_ITEM_COUNTS)
    .filter(([n]) => Number(n) >= station.from && Number(n) <= station.to)
    .reduce((total, [, count]) => total + count, 0),
);

/* ----------------------------- أدوات الفحص ----------------------------- */

const MATH_SEGMENT = /\$([^$]*)\$/g;

const renderKaTeX = (tex: string, where: string): void => {
  try {
    katex.renderToString(tex, { throwOnError: true, strict: false });
  } catch (error) {
    throw new Error(`صيغة غير صالحة في ${where}: ${tex}\n${(error as Error).message}`);
  }
};

/** يفحص كل نصّ داخل بنية البيانات: كل $...$ وكل حقل ينتهي بـ `.math`. */
const auditMath = (value: unknown, path: string, failures: string[]): void => {
  if (typeof value === 'string') {
    if (path.endsWith('.math')) renderKaTeX(value, path);
    for (const match of value.matchAll(MATH_SEGMENT)) renderKaTeX(match[1], `${path} (inline)`);
    if ((value.match(/\$/g) ?? []).length % 2 !== 0) failures.push(`$ غير متوازنة في ${path}`);
    if (/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(value)) failures.push(`محرف تحكّم في ${path}`);
    if (/\\n/.test(value.replace(/\\neq/g, ''))) failures.push(`\\n حرفي في ${path}`);
  } else if (Array.isArray(value)) {
    value.forEach((entry, index) => auditMath(entry, `${path}[${index}]`, failures));
  } else if (value && typeof value === 'object') {
    for (const [key, entry] of Object.entries(value)) auditMath(entry, `${path}.${key}`, failures);
  }
};

/* ------------------------------- الاختبارات ------------------------------- */

describe('تمارين الوحدة الثانية — مطابقة المصدر (39 سؤالًا)', () => {
  it('يحوي 39 سؤالًا مرقّمة 1–39 بالترتيب نفسه', () => {
    expect(unit2Lesson5Questions.map((question) => question.n)).toEqual(
      Array.from({ length: 39 }, (_, index) => index + 1),
    );
  });

  it('جرد البنود مطابق للمصدر: 165 بندًا موزعة كما في الصور', () => {
    const actual = Object.fromEntries(
      unit2Lesson5Questions.map((question) => [question.n, question.items.length]),
    );
    expect(actual).toEqual(SOURCE_ITEM_COUNTS);
    expect(unit2Lesson5SubItemCount).toBe(165);
    expect(Object.values(SOURCE_ITEM_COUNTS).reduce((sum, count) => sum + count, 0)).toBe(165);
  });

  it('علامات الترقيم المتداخل محفوظة حرفيًا (3، 4، 6، 18، 30، 31، 39)', () => {
    for (const [n, labels] of Object.entries(SOURCE_LABELS)) {
      expect(unit2Lesson5Questions.find((question) => question.n === Number(n))?.items.map((item) => item.label))
        .toEqual(labels);
    }
  });

  it('السؤال 1 سؤال واحد بعشرة بنود (لا يُحسب سؤالين)', () => {
    const first = unit2Lesson5Questions[0];
    expect(first.items).toHaveLength(10);
    expect(first.items.map((item) => item.label)).toEqual([
      '①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩',
    ]);
    expect(unit2Lesson5Data.steps.filter((step) => step.id === 'q-1')).toHaveLength(1);
  });

  it('لكل بند: جواب، تعليل، خطوتان على الأقل، وتحقّق مستقل', () => {
    const missing: string[] = [];
    for (const question of unit2Lesson5Questions) {
      for (const item of question.items) {
        const where = `Q${question.n} ${item.label}`;
        if (!item.answer && !item.answerText) missing.push(`${where}: بلا جواب`);
        if (!item.reason?.trim()) missing.push(`${where}: بلا تعليل`);
        if (!item.steps || item.steps.length < 2) missing.push(`${where}: خطوات أقل من اثنتين`);
        if (!item.check?.trim()) missing.push(`${where}: بلا تحقّق`);
      }
    }
    expect(missing).toEqual([]);
  });

  it('لكل سؤال: شرح تفكير، تلميح، ونتيجة (وشارح من المنصة)', () => {
    const gaps = unit2Lesson5Questions
      .filter((question) => !question.think?.trim() || !question.hint?.trim() || !question.result?.trim())
      .map((question) => question.n);
    expect(gaps).toEqual([]);
  });

  it('لا يظهر جواب البند قبل طلب الطالب: الحل داخل لوحة الكشف فقط', () => {
    const leaked: string[] = [];
    for (const step of unit2Lesson5Data.steps) {
      const source = step.blocks.find((block) => block.id.startsWith('source-'));
      for (const item of source?.subItems ?? []) {
        if (item.explanation) leaked.push(`${step.id}/${item.label}: explanation ظاهر دائمًا`);
        if (!item.working || item.working.length < 2) leaked.push(`${step.id}/${item.label}: لا خطوات في لوحة الكشف`);
      }
    }
    expect(leaked).toEqual([]);
  });
});

describe('تمارين الوحدة الثانية — سلامة العرض الرياضي', () => {
  it('كل صيغة رياضية في الدرس تُفسَّر بلا أخطاء (KaTeX)', () => {
    const failures: string[] = [];
    auditMath({ questions: unit2Lesson5Questions, lesson: unit2Lesson5Data }, 'lesson5', failures);
    expect(failures).toEqual([]);
  });

  it('لا TeX خام ولا محارف تحكّم في نصوص الأسئلة', () => {
    const bad = unit2Lesson5Questions.filter((question) =>
      /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(`${question.stem}${question.think}${question.hint}`),
    );
    expect(bad.map((question) => question.n)).toEqual([]);
  });
});

describe('تمارين الوحدة الثانية — وسم المصدر بلا أرقام صفحات مختلقة', () => {
  it('كل خطوة تحمل وسم «السؤال N» ولا تحمل رقم صفحة', () => {
    for (const step of unit2Lesson5Data.steps) {
      expect(step.sourcePages).toEqual([]);
      expect(step.sourceLabel).toBe(`السؤال ${step.id.replace('q-', '')}`);
      for (const block of step.blocks) {
        expect(block.sourceRef.page).toBe(0);
        expect(block.sourceRef.display).toContain(`السؤال ${step.id.replace('q-', '')}`);
      }
    }
    expect(unit2Lesson5Data.sourcePages).toEqual([]);
  });

  it('وسم الدرس نفسه يذكر عدد الأسئلة بدل الصفحات', () => {
    expect(unit2Lesson5Data.sourceLabel).toContain('39');
    expect(unit2Lesson5Data.teacherArea!.teachingNotes.join(' ')).toContain('لا تحمل أرقام صفحات');
  });
});

describe('تمارين الوحدة الثانية — التحقّق السريع التفاعلي', () => {
  const probes = unit2Lesson5Data.steps.flatMap((step) =>
    step.blocks
      .filter((block) => block.interactiveType === 'practice-check')
      .map((block) => ({ stepId: step.id, block })),
  );

  it('يوجد تحقّق سريع في الأسئلة المعلنة فقط، بلا تكرار', () => {
    expect(probes.map((probe) => probe.stepId)).toEqual(
      Object.keys(PROBE_ANSWERS).map((n) => `q-${n}`),
    );
  });

  it('كل تحقّق ثلاث اختيارات متمايزة وجواب واحد صحيح في الموضع المعلن', () => {
    for (const { stepId, block } of probes) {
      const questions = (block.interactiveData as { questions: { choices: string[]; correctIndex: number }[] })
        .questions;
      expect(questions, stepId).toHaveLength(1);
      const [question] = questions;
      expect(question.choices, stepId).toHaveLength(3);
      expect(new Set(question.choices).size, stepId).toBe(3);
      const expected = PROBE_ANSWERS[Number(stepId.replace('q-', ''))];
      expect(question.correctIndex, stepId).toBe(expected.index);
      expect(question.choices[question.correctIndex], stepId).toBe(expected.answer);
    }
  });

  it('التصحيح لا يظهر قبل الضغط على «تحقّق»: البيانات لا تحمل العلم في النص', () => {
    for (const { block } of probes) {
      expect(block.content).toContain('تحقّق');
      expect(block.content).not.toMatch(/الإجابة الصحيحة هي/);
    }
  });
});

describe('تمارين الوحدة الثانية — مساحة المعلّم', () => {
  const teacherArea = unit2Lesson5Data.teacherArea!;

  it('تحتوي أهدافًا وأخطاء شائعة ومعالجات وإرشادات تقويم', () => {
    expect(teacherArea.objectives.length).toBeGreaterThanOrEqual(4);
    expect(teacherArea.commonMistakes.length).toBeGreaterThanOrEqual(5);
    expect(teacherArea.remediation.length).toBeGreaterThanOrEqual(4);
    expect(teacherArea.teachingNotes.length).toBeGreaterThanOrEqual(4);
    expect(teacherArea.assessmentGuidance.length).toBeGreaterThanOrEqual(3);
  });

  it('مفاتيح الإجابة تغطي البنود الـ165 موزّعة على المحطات الثماني', () => {
    expect(teacherArea.answerKeys).toHaveLength(unit2Lesson5Stations.length);
    expect(teacherArea.answerKeys.map((group) => group.items.length)).toEqual(STATION_ITEM_COUNTS);
    expect(teacherArea.answerKeys.reduce((sum, group) => sum + group.items.length, 0)).toBe(165);
    expect(STATION_ITEM_COUNTS.reduce((sum, count) => sum + count, 0)).toBe(165);
  });

  it('لكل مفتاح إجابة جواب ظاهر (LaTeX أو نصّي)', () => {
    const empty = teacherArea.answerKeys.flatMap((group) =>
      group.items.filter((item) => !item.answer?.trim() && !item.answerText?.trim()).map((item) => item.ref),
    );
    expect(empty).toEqual([]);
  });

  it('الحلول التفصيلية في مساحة المعلّم تساوي عدد البنود', () => {
    expect(teacherArea.solutions).toHaveLength(165);
    expect(unit2Lesson5TeacherSolutions).toHaveLength(165);
  });

  it('محطات التصفح تغطي الأسئلة 1–39 بلا فراغ أو تداخل', () => {
    expect(unit2Lesson5Stations[0].from).toBe(1);
    expect(unit2Lesson5Stations[unit2Lesson5Stations.length - 1].to).toBe(39);
    unit2Lesson5Stations.slice(1).forEach((station, index) => {
      expect(station.from).toBe(unit2Lesson5Stations[index].to + 1);
    });
  });
});

describe('تمارين الوحدة الثانية — جرد المصدر الداخلي', () => {
  // المسار نسبي إلى جذر المشروع (vitest يعمل من الجذر)؛ قراءة الملف بـ fs تتفادى
  // إعداد resolveJsonModule داخل بيئة jsdom.
  const audit = JSON.parse(
    readFileSync('src/data/unit2/lesson05.source-audit.json', 'utf-8'),
  ) as {
    questionCount: number;
    subItemCount: number;
    pageNumbering: { found: boolean };
    questionOne: { images: number; items: number };
    files: { question: string }[];
    sourceNotes: { question: number }[];
  };

  it('سجل التدقيق الداخلي مطابق للدرس (39 سؤالًا، 165 بندًا، صورتان للسؤال 1)', () => {
    expect(audit.questionCount).toBe(39);
    expect(audit.subItemCount).toBe(165);
    expect(audit.questionOne).toMatchObject({ images: 2, items: 10 });
    expect(audit.pageNumbering.found).toBe(false);
    expect(audit.files).toHaveLength(39);
    expect(new Set(audit.files.map((file) => file.question)).size).toBe(39);
  });

  it('كل نقطة مصدر موثّقة تقابل سؤالًا موجودًا', () => {
    const numbers = new Set(unit2Lesson5Questions.map((question) => question.n));
    for (const note of audit.sourceNotes) expect(numbers.has(note.question), String(note.question)).toBe(true);
  });

  it('لا يُعرض جرد المصدر للطالب داخل واجهة الدرس', () => {
    const studentFacing = JSON.stringify(unit2Lesson5Data.steps).concat(
      JSON.stringify(unit2Lesson5Data.description),
    );
    expect(studentFacing).not.toContain('lesson05.source-audit');
    expect(studentFacing).not.toContain('sha256');
  });
});

describe('تمارين الوحدة الثانية — التكامل مع بنك الاختبارات', () => {
  const definition = getTestsByType('lesson').find((entry) => entry.lessonId === 'u2-lesson-5');

  it('اختبار الدرس الخامس مسجّل باسم الدرس و20 سؤالًا', () => {
    expect(definition).toBeDefined();
    expect(definition?.id).toBe('u2-test-lesson-5');
    const resolved = resolveTest('u2-test-lesson-5')!;
    expect(resolved.questionCount).toBe(20);
    expect(resolved.questions.every((question) => question.primaryLessonId === 'u2-lesson-5')).toBe(true);
  });

  it('خطة المفاهيم تطابق التوزيع الفعلي للأسئلة', () => {
    const resolved = resolveTest('u2-test-lesson-5')!;
    const planned = resolved.blueprint!.concepts.reduce((sum, concept) => sum + concept.questionCount, 0);
    expect(planned).toBe(resolved.questionCount);
    for (const concept of resolved.blueprint!.concepts) {
      const actual = resolved.questions.filter((question) =>
        question.curriculumRefs.some((ref) => ref.conceptId === concept.conceptId),
      ).length;
      expect(actual, concept.conceptId).toBe(concept.questionCount);
    }
  });
});
