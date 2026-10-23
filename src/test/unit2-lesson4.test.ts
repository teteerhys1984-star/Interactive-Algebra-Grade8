import { describe, expect, it } from 'vitest';
import { getLessonById, getUnitById } from '../data/curriculum';
import { unit2Lesson4Data, unit2Lesson4Steps } from '../data/unit2/lesson04';
import { lessonConceptProfiles } from '../data/tests/concepts';
import { unit2Lesson4Blueprint } from '../data/tests/blueprints/unit2-lesson-4';
import { getTestsByType, resolveTest, getQuestionById } from '../data/tests/registry';
import { LESSON_TEST_QUESTION_COUNT } from '../data/tests/policy';
import { UNIT2_DIFFICULTY_BLUEPRINT } from '../data/tests/unit2/unit-2';
import type { QuestionDifficulty, TestQuestion } from '../data/tests/types';

/**
 * الدرس الرابع من الوحدة الثانية: «الجذور التربيعية» (الصفحات 35–37)، واختباره،
 * واختبار الوحدة الثانية كاملًا. تُحسب مفاتيح الإجابات الرقمية بـ Math مستقلًا
 * عن البيانات، وتُقارن المفاتيح غير الرقمية بقيمها المعلنة هنا.
 */

const LESSON_ID = 'u2-lesson-4';

const difficultyCounts = (questions: readonly TestQuestion[]): Record<QuestionDifficulty, number> =>
  questions.reduce(
    (counts, question) => ({ ...counts, [question.difficulty]: counts[question.difficulty] + 1 }),
    { basic: 0, intermediate: 0, advanced: 0, reasoning: 0 } as Record<QuestionDifficulty, number>,
  );

const parseAccepted = (value: string): number => {
  if (value.includes('/')) {
    const [top, bottom] = value.split('/').map(Number);
    return top / bottom;
  }
  return Number(value);
};

/** القيمة الحسابية لكل سؤال رقمي، محسوبة مستقلًا عن مفتاح البيانات. */
const COMPUTED_NUMERIC: Record<string, () => number> = {
  // اختبار الدرس الرابع
  'u2-l4-01': () => Math.sqrt(169),
  'u2-l4-04': () => Math.sqrt(1089),
  'u2-l4-07': () => Math.sqrt(25 * 49),
  'u2-l4-09': () => Math.sqrt(121 / 4),
  'u2-l4-11': () => Math.pow(Math.sqrt(2), 8),
  'u2-l4-19': () => Number(Math.sqrt(40).toFixed(2)),
  // اختبار الوحدة الثانية
  'u2-unit-01': () => Math.log10(1e6),
  'u2-unit-03': () => Math.pow(10, -3),
  'u2-unit-05': () => Math.log10(1e4),
  'u2-unit-07': () => Math.log10(0.0001),
  'u2-unit-09': () => Math.floor(Math.log10(3500000)),
  'u2-unit-11': () => Math.log10(2.5e-3 / 25),
  'u2-unit-14': () => 3 + 5,
  'u2-unit-16': () => 7 - 4,
  'u2-unit-18': () => 3 * -2,
  'u2-unit-21': () => -6,
  'u2-unit-22': () => 2 * 4,
  'u2-unit-24': () => Math.floor(Math.log10(0.0047)),
  'u2-unit-27': () => Math.pow(5, 3),
  'u2-unit-29': () => 1 / 8,
  'u2-unit-32': () => Math.pow(-2, 5),
  'u2-unit-33': () => 4 + -6,
  'u2-unit-36': () => 2 - 7,
  'u2-unit-37': () => Math.pow(3, 3),
  'u2-unit-40': () => Math.sqrt(256),
  'u2-unit-42': () => Math.sqrt(0.25),
  'u2-unit-45': () => 8 * 2,
  'u2-unit-47': () => Math.sqrt(49 / 16),
  'u2-unit-49': () => Math.pow(Math.sqrt(5), 4),
  'u2-unit-51': () => Math.sqrt(98 / 2),
  'u2-unit-52': () => Number(Math.sqrt(20).toFixed(1)),
};

/** المفاتيح غير الرقمية: الخيار الصحيح، أو قيمة الصواب/الخطأ، أو الترتيب، أو الأزواج. */
const EXPECTED_KEYS: Record<string, unknown> = {
  // اختبار الدرس الرابع
  'u2-l4-02': false,
  'u2-l4-03': 'b',
  'u2-l4-05': false,
  'u2-l4-06': 'a',
  'u2-l4-08': ['A', 'C'],
  'u2-l4-10': 'a',
  'u2-l4-12': true,
  'u2-l4-13': ['b', 'd', 'c', 'a'],
  'u2-l4-14': { A: 'r1', B: 'r2', C: 'r3', D: 'r4' },
  'u2-l4-15': 'b',
  'u2-l4-16': 'b',
  'u2-l4-17': 'a',
  'u2-l4-18': 'a',
  'u2-l4-20': ['A', 'C'],
  // اختبار الوحدة الثانية
  'u2-unit-02': 'b',
  'u2-unit-04': false,
  'u2-unit-06': ['b', 'd', 'c', 'a'],
  'u2-unit-08': 'a',
  'u2-unit-10': false,
  'u2-unit-12': 'a',
  'u2-unit-13': ['A', 'C'],
  'u2-unit-15': 'a',
  'u2-unit-17': false,
  'u2-unit-19': false,
  'u2-unit-20': 'a',
  'u2-unit-23': { A: 'r1', B: 'r2', C: 'r3', D: 'r4' },
  'u2-unit-25': ['A', 'D'],
  'u2-unit-26': 'a',
  'u2-unit-28': false,
  'u2-unit-30': 'c',
  'u2-unit-31': false,
  'u2-unit-34': 'a',
  'u2-unit-35': ['A', 'C'],
  'u2-unit-38': 'a',
  'u2-unit-39': 'a',
  'u2-unit-41': false,
  'u2-unit-43': 'c',
  'u2-unit-44': true,
  'u2-unit-46': 'a',
  'u2-unit-48': false,
  'u2-unit-50': 'a',
};

/** مفتاح السؤال كما يُخزَّن: الصواب/الخطأ، أو الخيار الواحد، أو مجموعة الخيارات، أو الترتيب، أو الأزواج. */
function storedKey(question: TestQuestion): unknown {
  switch (question.type) {
    case 'true-false': return question.correctAnswer;
    case 'single-choice':
    case 'error-analysis': return question.correctOptionId;
    case 'multi-select': return [...question.correctOptionIds].sort();
    case 'ordering': return question.correctOrder;
    case 'matching': return question.correctPairs;
    default: return undefined;
  }
}

const sortedIfArray = (value: unknown): unknown => (Array.isArray(value) ? [...value].sort() : value);

describe('الدرس الرابع — التسجيل والبنية', () => {
  it('مسجّل في المنهج بعنوانه ومصادر صفحاته 35–37 وبعد الدرس الثالث مباشرة', () => {
    const unit = getUnitById('unit-2')!;
    expect(unit.lessons.map((lesson) => lesson.id)).toEqual(['u2-lesson-1', 'u2-lesson-2', 'u2-lesson-3', LESSON_ID, 'u2-lesson-5']);
    expect(unit.lessons.filter((lesson) => lesson.id === LESSON_ID)).toHaveLength(1);

    expect(getLessonById('unit-2', LESSON_ID)).toBe(unit2Lesson4Data);
    expect(unit2Lesson4Data.number).toBe(4);
    expect(unit2Lesson4Data.unitId).toBe('unit-2');
    expect(unit2Lesson4Data.title).toBe('الجذور التربيعية');
    expect(unit2Lesson4Data.sourcePages).toEqual([35, 36, 37]);
    expect(unit.sourcePages).toEqual([25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37]);
  });

  it('خطواته الخمس عشرة لها معرّفات فريدة وصفحات مصدر ضمن 35–37', () => {
    expect(unit2Lesson4Steps).toHaveLength(15);
    const ids = unit2Lesson4Steps.map((step) => step.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const step of unit2Lesson4Steps) {
      expect(step.sourcePages.length, step.id).toBeGreaterThan(0);
      expect(step.sourcePages.every((page) => page >= 35 && page <= 37), step.id).toBe(true);
    }
  });

  it('منطقة المعلّم مربوطة وتحوي الأهداف والأخطاء الشائعة ومفاتيح الإجابة', () => {
    const area = unit2Lesson4Data.teacherArea!;
    expect(area.objectives.length).toBeGreaterThan(0);
    expect(area.commonMistakes.length).toBeGreaterThan(0);
    expect(area.answerKeys.length).toBeGreaterThan(0);
    expect(area.solutions?.length ?? 0).toBeGreaterThan(0);
  });
});

describe('اختبار الدرس الرابع', () => {
  const resolved = resolveTest('u2-test-lesson-4')!;

  it('مسجّل مرة واحدة بعشرين سؤالًا، وأسئلته تنتمي إلى الدرس الرابع فقط', () => {
    expect(getTestsByType('lesson').filter((test) => test.lessonId === LESSON_ID)).toHaveLength(1);
    expect(resolved.questionCount).toBe(LESSON_TEST_QUESTION_COUNT);
    expect(resolved.questions.every((question) => question.primaryLessonId === LESSON_ID)).toBe(true);
    expect(resolved.questions.every((question) => question.id.startsWith('u2-l4-'))).toBe(true);
  });

  it('يطابق مخطط الدرس: عدد الأسئلة لكل مفهوم، والصعوبة، وأنواع الأسئلة', () => {
    const blueprint = unit2Lesson4Blueprint;
    const byConcept = resolved.questions.reduce<Record<string, number>>((counts, question) => {
      const concept = question.curriculumRefs.find((ref) => ref.lessonId === LESSON_ID)!.conceptId;
      counts[concept] = (counts[concept] ?? 0) + 1;
      return counts;
    }, {});
    for (const concept of blueprint.concepts) {
      expect(byConcept[concept.conceptId], concept.conceptId).toBe(concept.questionCount);
    }
    const catalog = lessonConceptProfiles.find((profile) => profile.lessonId === LESSON_ID)!.concepts;
    expect(Object.keys(byConcept).sort()).toEqual(catalog.map((concept) => concept.id).sort());

    expect(difficultyCounts(resolved.questions)).toEqual(blueprint.difficultyPlan);

    const byType = resolved.questions.reduce<Record<string, number>>((counts, question) => {
      counts[question.type] = (counts[question.type] ?? 0) + 1;
      return counts;
    }, {});
    expect(byType).toEqual(blueprint.questionTypePlan);
  });

  it('معرّفات الأسئلة فريدة ولا تتكرر في بنك الأسئلة كله', () => {
    expect(new Set(resolved.questions.map((question) => question.id)).size).toBe(resolved.questions.length);
    expect(resolved.questions.every((question) => getQuestionById(question.id) === question)).toBe(true);
  });

  it('مفاتيح الإجابة غير الرقمية تطابق القيم المعلنة', () => {
    for (const question of resolved.questions) {
      if (question.type === 'numeric') continue;
      expect(sortedIfArray(storedKey(question)), question.id).toEqual(sortedIfArray(EXPECTED_KEYS[question.id]));
    }
  });

  it('مفاتيح الإجابة الرقمية تطابق الحساب المستقل', () => {
    const numeric = resolved.questions.filter((question) => question.type === 'numeric');
    expect(numeric.map((question) => question.id).sort()).toEqual(Object.keys(COMPUTED_NUMERIC)
      .filter((id) => id.startsWith('u2-l4-')).sort());
    for (const question of numeric) {
      if (question.type !== 'numeric') continue;
      const expected = COMPUTED_NUMERIC[question.id]();
      const accepted = question.acceptedAnswers.map(parseAccepted);
      expect(accepted.some((value) => Math.abs(value - expected) < 1e-6), question.id).toBe(true);
    }
  });
});

describe('اختبار الوحدة الثانية (52 سؤالًا)', () => {
  const unitTest = resolveTest('u2-test-unit-2')!;

  it('مسجّل مرة واحدة كاختبار وحدة، ضمن المدى 50–60 سؤالًا', () => {
    expect(getTestsByType('unit').filter((test) => test.unitId === 'unit-2')).toHaveLength(1);
    expect(unitTest.questionCount).toBeGreaterThanOrEqual(50);
    expect(unitTest.questionCount).toBeLessThanOrEqual(60);
    expect(unitTest.questionCount).toBe(52);
    expect(unitTest.questions.every((question) => question.id.startsWith('u2-unit-'))).toBe(true);
  });

  it('يغطي الدروس الأربعة بالتساوي: 13 سؤالًا لكل درس، كما هو معلن', () => {
    const counts = unitTest.questions.reduce<Record<string, number>>((acc, question) => {
      acc[question.primaryLessonId] = (acc[question.primaryLessonId] ?? 0) + 1;
      return acc;
    }, {});
    expect(counts).toEqual({ 'u2-lesson-1': 13, 'u2-lesson-2': 13, 'u2-lesson-3': 13, 'u2-lesson-4': 13 });
    expect(unitTest.coverageBlueprint).toEqual(counts);
  });

  it('توزيع الصعوبة مطابق للمعلن: 16 أساسي، 18 متوسط، 11 متقدم، 7 تفكير', () => {
    expect(UNIT2_DIFFICULTY_BLUEPRINT).toEqual({ basic: 16, intermediate: 18, advanced: 11, reasoning: 7 });
    expect(difficultyCounts(unitTest.questions)).toEqual(UNIT2_DIFFICULTY_BLUEPRINT);
  });

  it('يغطي الأنماط السبعة للأسئلة، ولا يتكرر فيه معرّف أو نص سؤال', () => {
    expect(new Set(unitTest.questions.map((question) => question.type)).size).toBe(7);
    expect(new Set(unitTest.questions.map((question) => question.id)).size).toBe(unitTest.questions.length);
    const prompts = unitTest.questions.map((question) => question.prompt.replace(/\s+/g, ' ').trim());
    expect(new Set(prompts).size).toBe(prompts.length);
  });

  it('كل سؤال يرتبط بمفهوم موجود في دروسه، ولا يوجد سؤال بلا حل', () => {
    for (const question of unitTest.questions) {
      expect(question.curriculumRefs.length, question.id).toBeGreaterThan(0);
      expect(question.solution.steps.length, question.id).toBeGreaterThanOrEqual(2);
      expect(question.solution.finalAnswer.trim(), question.id).not.toBe('');
      expect(question.solution.explanation.trim(), question.id).not.toBe('');
    }
  });

  it('مفاتيح الإجابة غير الرقمية تطابق القيم المعلنة', () => {
    for (const question of unitTest.questions) {
      if (question.type === 'numeric') continue;
      expect(sortedIfArray(storedKey(question)), question.id).toEqual(sortedIfArray(EXPECTED_KEYS[question.id]));
    }
  });

  it('مفاتيح الإجابة الرقمية تطابق الحساب المستقل', () => {
    const numeric = unitTest.questions.filter((question) => question.type === 'numeric');
    for (const question of numeric) {
      if (question.type !== 'numeric') continue;
      const computed = COMPUTED_NUMERIC[question.id];
      expect(computed, `missing computed check for ${question.id}`).toBeDefined();
      const expected = computed();
      const accepted = question.acceptedAnswers.map(parseAccepted);
      expect(accepted.some((value) => Math.abs(value - expected) < 1e-6), question.id).toBe(true);
    }
  });
});
