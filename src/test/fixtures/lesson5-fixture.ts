import {
  errorAnalysis,
  matching,
  multiSelect,
  numeric,
  ordering,
  singleChoice,
  trueFalse,
} from '../../data/tests/builders';
import type { CurriculumLessonRef } from '../../data/tests/lessonTests';
import type { LessonConceptProfile } from '../../data/tests/concepts';
import { LESSON_TEST_QUESTION_COUNT, RECOMMENDED_LESSON_DIFFICULTY_PROFILE } from '../../data/tests/policy';
import { createTestBankSnapshot, type TestBankSnapshot } from '../../data/tests/audit';
import type {
  LessonTestBlueprint,
  QuestionDifficulty,
  TestDefinition,
  TestQuestion,
  TestQuestionType,
} from '../../data/tests/types';

/**
 * FIXTURE ONLY — never rendered to students and never registered in the app.
 *
 * It simulates "a Lesson 5 was added to the curriculum" so the regression tests
 * can prove two behaviours without touching the shipped bank:
 *   1. with no test registered, the audit fails naming the lesson;
 *   2. with a complete 20-question test, blueprint, and concept profile, the
 *      audit passes and the Test Area lists the lesson automatically.
 *
 * The questions are arithmetically real (every key is verifiable) but the topic
 * is fictional, and the whole file lives under `src/test`.
 */

export const FIXTURE_UNIT_ID = 'unit-1';
export const FIXTURE_LESSON_ID = 'lesson-5';
export const FIXTURE_TEST_ID = 'fixture-test-lesson-5';

export const fixtureLessonRef: CurriculumLessonRef = {
  unitId: FIXTURE_UNIT_ID,
  unitTitle: 'الأعداد العادية والعمليات عليها',
  lessonId: FIXTURE_LESSON_ID,
  lessonTitle: 'الكسور العشرية (درس تجريبي)',
};

export const fixtureConceptProfile: LessonConceptProfile = {
  lessonId: FIXTURE_LESSON_ID,
  unitId: FIXTURE_UNIT_ID,
  lessonTitle: fixtureLessonRef.lessonTitle,
  concepts: [
    {
      id: 'l5-decimal-to-fraction',
      title: 'التحويل بين العدد العشري والكسر العادي',
      skills: ['fixture-decimal-to-fraction'],
      taughtInSteps: ['step-1'],
      sourcePages: [25],
    },
    {
      id: 'l5-decimal-add-subtract',
      title: 'جمع الكسور العشرية وطرحها بمحاذاة المنازل',
      skills: ['fixture-decimal-addition'],
      taughtInSteps: ['step-2'],
      sourcePages: [26],
    },
    {
      id: 'l5-decimal-multiply',
      title: 'ضرب الكسور العشرية وتحديد منازل الناتج',
      skills: ['fixture-decimal-multiplication'],
      taughtInSteps: ['step-3'],
      sourcePages: [27],
    },
    {
      id: 'l5-decimal-word-problems',
      title: 'مسائل لفظية بالكسور العشرية',
      skills: ['fixture-decimal-word-problem'],
      taughtInSteps: ['step-4'],
      sourcePages: [28],
    },
  ],
};

const fields = (
  id: string,
  prompt: string,
  difficulty: QuestionDifficulty,
  conceptId: string,
  steps: string[],
  finalAnswer: string,
  explanation: string,
  math?: string,
) => ({
  id,
  prompt,
  math,
  points: 1,
  difficulty,
  primaryLessonId: FIXTURE_LESSON_ID,
  curriculumRefs: [{ lessonId: FIXTURE_LESSON_ID, conceptId }],
  solution: { steps, finalAnswer, explanation },
});

export const fixtureQuestions: TestQuestion[] = [
  // --- l5-decimal-to-fraction (5) -------------------------------------------
  numeric({
    ...fields(
      'fixture-l5-01',
      'اكتب العدد العشري $0.75$ على صورة كسر عادي بأبسط صورة.',
      'basic', 'fixture-decimal-to-fraction',
      ['نكتب العدد على مقام $100$: $0.75=\\frac{75}{100}$.', 'نختصر بالقسمة على $25$ فنحصل على $\\frac{3}{4}$.'],
      '$\\frac{3}{4}$',
      'منزلتان عشريتان تعنيان مقامًا $100$، ثم نختصر الكسر.',
    ),
    acceptedAnswers: ['3/4'],
    answerFormat: 'كسر عادي',
  }),
  numeric({
    ...fields(
      'fixture-l5-02',
      'اكتب الكسر $\\frac{7}{8}$ على صورة عدد عشري.',
      'intermediate', 'fixture-decimal-to-fraction',
      ['نبحث عن كسر مكافئ مقامه قوة للعشرة: $\\frac{7}{8}=\\frac{875}{1000}$.', 'نقرأ البسط بحسب المنازل: $0.875$.'],
      '$0.875$',
      'التحويل إلى مقام $1000$ يجعل قراءة العدد العشري مباشرة.',
      '\\frac{7}{8}',
    ),
    acceptedAnswers: ['0.875'],
    answerFormat: 'عدد عشري',
  }),
  singleChoice({
    ...fields(
      'fixture-l5-03',
      'أي كسر عادي يساوي $0.6$؟',
      'basic', 'fixture-decimal-to-fraction',
      ['نكتب $0.6=\\frac{6}{10}$.', 'نختصر بالقسمة على $2$ فنحصل على $\\frac{3}{5}$.'],
      '$\\frac{3}{5}$',
      'منزلة عشرية واحدة تعني مقامًا $10$، ثم نختصر.',
    ),
    options: [
      { id: 'a', label: '$\\frac{3}{5}$' },
      { id: 'b', label: '$\\frac{6}{100}$' },
      { id: 'c', label: '$\\frac{1}{6}$' },
      { id: 'd', label: '$\\frac{5}{3}$' },
    ],
    correctOptionId: 'a',
  }),
  trueFalse({
    ...fields(
      'fixture-l5-04',
      'العبارة الآتية صحيحة: $0.25=\\frac{1}{4}$.',
      'basic', 'fixture-decimal-to-fraction',
      ['نكتب $0.25=\\frac{25}{100}$.', 'نختصر بالقسمة على $25$ فنحصل على $\\frac{1}{4}$.'],
      'العبارة صحيحة؛ لأن $0.25=\\frac{25}{100}=\\frac{1}{4}$.',
      'الاختصار لا يغيّر قيمة الكسر.',
    ),
    correctAnswer: true,
  }),
  multiSelect({
    ...fields(
      'fixture-l5-05',
      'اختر كل كتابة صحيحة للعدد $1.5$ على صورة كسر عادي.',
      'intermediate', 'fixture-decimal-to-fraction',
      ['$1.5=\\frac{15}{10}$ لأن منزلة عشرية واحدة تعني مقامًا $10$.', 'بعد الاختصار $\\frac{15}{10}=\\frac{3}{2}$.'],
      'الكتابتان الصحيحتان هما (أ) و(ب).',
      'الكسر غير الاختصاري والاختصاري يمثّلان العدد نفسه.',
      undefined,
    ),
    options: [
      { id: 'a', label: '$\\frac{3}{2}$' },
      { id: 'b', label: '$\\frac{15}{10}$' },
      { id: 'c', label: '$\\frac{1}{5}$' },
      { id: 'd', label: '$\\frac{5}{1}$' },
    ],
    correctOptionIds: ['a', 'b'],
    sourceTopics: ['التحويل بين العدد العشري والكسر العادي'],
  }),

  // --- l5-decimal-add-subtract (5) ------------------------------------------
  numeric({
    ...fields(
      'fixture-l5-06',
      'احسب ناتج الجمع: $0.4+0.35$.',
      'basic', 'fixture-decimal-addition',
      ['نساوي المنازل: $0.40+0.35$.', 'نجمع المنازل: $0.40+0.35=0.75$.'],
      '$0.75$',
      'محاذاة الفاصلة العشرية تمنع جمع منازل مختلفة.',
      '0.4+0.35',
    ),
    acceptedAnswers: ['0.75', '3/4'],
    answerFormat: 'عدد عشري',
  }),
  numeric({
    ...fields(
      'fixture-l5-07',
      'احسب ناتج الطرح: $2.5-1.875$.',
      'advanced', 'fixture-decimal-addition',
      ['نساوي المنازل: $2.500-1.875$.', 'نطرح: $2.500-1.875=0.625$.'],
      '$0.625$',
      'إضافة الأصفار لا تغيّر القيمة وتسمح بالطرح منزلًا بمنزل.',
      '2.5-1.875',
    ),
    acceptedAnswers: ['0.625', '5/8'],
    answerFormat: 'عدد عشري',
  }),
  singleChoice({
    ...fields(
      'fixture-l5-08',
      'أي نتيجة تمثّل $3.2-1.45$؟',
      'intermediate', 'fixture-decimal-addition',
      ['نساوي المنازل: $3.20-1.45$.', 'نطرح فنحصل على $1.75$.'],
      '$1.75$',
      'الطرح يتم بعد محاذاة المنازل العشرية.',
      '3.2-1.45',
    ),
    options: [
      { id: 'a', label: '$1.75$' },
      { id: 'b', label: '$1.85$' },
      { id: 'c', label: '$2.25$' },
      { id: 'd', label: '$1.25$' },
    ],
    correctOptionId: 'a',
  }),
  ordering({
    ...fields(
      'fixture-l5-09',
      'رتّب خطوات حساب $1.25+0.4$ بطريقة صحيحة.',
      'intermediate', 'fixture-decimal-addition',
      ['نحاذي الفاصلة العشرية في العددين.', 'نضيف صفرًا لتساوي المنازل: $1.25+0.40$.', 'نجمع المنازل من اليمين: $1.25+0.40=1.65$.', 'نضع الفاصلة في الناتج بالمكان نفسه.'],
      '$1.65$',
      'المحاذاة ثم توحيد المنازل ثم الجمع.',
      '1.25+0.4',
    ),
    items: [
      { id: 'place', label: 'وضع الفاصلة العشرية في الناتج.' },
      { id: 'align', label: 'محاذاة الفاصلة العشرية في العددين.' },
      { id: 'add', label: 'جمع المنازل من اليمين إلى اليسار.' },
      { id: 'pad', label: 'إضافة صفر لتساوي المنازل: $0.40$.' },
    ],
    correctOrder: ['align', 'pad', 'add', 'place'],
  }),
  errorAnalysis({
    ...fields(
      'fixture-l5-10',
      'حسب طالب $2.4-0.65$ فكتب $2.25$. أي تشخيص يحدّد الخطأ بدقة؟',
      'advanced', 'fixture-decimal-addition',
      ['الطالب طرح $0.65$ من $2.40$ دون محاذاة المنازل، فطرح $6$ من $4$ في منزلة خاطئة.', 'الطرح الصحيح: $2.40-0.65=1.75$.'],
      'الصواب $1.75$؛ سبب الخطأ إهمال محاذاة المنازل العشرية.',
      'قبل الطرح نساوي عدد المنازل العشرية بإضافة الأصفار.',
      '2.4-0.65',
    ),
    options: [
      { id: 'a', label: 'أهمل محاذاة المنازل؛ الصواب $1.75$.' },
      { id: 'b', label: 'أخطأ في الإشارة؛ الصواب $3.05$.' },
      { id: 'c', label: 'لا يوجد خطأ في الحل.' },
      { id: 'd', label: 'أخطأ في الاختصار؛ الصواب $2.15$.' },
    ],
    correctOptionId: 'a',
  }),

  // --- l5-decimal-multiply (5) ----------------------------------------------
  numeric({
    ...fields(
      'fixture-l5-11',
      'احسب ناتج الضرب: $0.5\\times0.4$.',
      'basic', 'fixture-decimal-multiplication',
      ['نضرب دون الفاصلة: $5\\times4=20$.', 'مجموع المنازل العشرية منزلتان، إذن الناتج $0.20=0.2$.'],
      '$0.2$',
      'عدد منازل الناتج يساوي مجموع منازل العاملين.',
      '0.5\\times0.4',
    ),
    acceptedAnswers: ['0.2', '1/5'],
    answerFormat: 'عدد عشري',
  }),
  numeric({
    ...fields(
      'fixture-l5-12',
      'احسب: $1.5\\times\\frac{2}{3}$.',
      'intermediate', 'fixture-decimal-multiplication',
      ['نحوّل $1.5$ إلى كسر: $1.5=\\frac{3}{2}$.', 'نضرب: $\\frac{3}{2}\\times\\frac{2}{3}=1$.'],
      '$1$',
      'تحويل العشري إلى كسر يسمح بالاختصار قبل الضرب.',
      '1.5\\times\\frac{2}{3}',
    ),
    acceptedAnswers: ['1'],
    answerFormat: 'عدد صحيح',
  }),
  singleChoice({
    ...fields(
      'fixture-l5-13',
      'أي عدد يساوي $0.25\\times0.4$؟',
      'advanced', 'fixture-decimal-multiplication',
      ['نضرب $25\\times4=100$.', 'مجموع المنازل ثلاث، إذن الناتج $0.100=0.1$.'],
      '$0.1$',
      'عدّ المنازل العشرية يحدد موضع الفاصلة في الناتج.',
      '0.25\\times0.4',
    ),
    options: [
      { id: 'a', label: '$0.1$' },
      { id: 'b', label: '$1$' },
      { id: 'c', label: '$0.01$' },
      { id: 'd', label: '$10$' },
    ],
    correctOptionId: 'a',
  }),
  trueFalse({
    ...fields(
      'fixture-l5-14',
      'العبارة الآتية صحيحة: $0.3\\times0.3=0.9$.',
      'intermediate', 'fixture-decimal-multiplication',
      ['نضرب $3\\times3=9$.', 'مجموع المنازل منزلتان، إذن الناتج $0.09$ لا $0.9$.'],
      'العبارة خاطئة؛ لأن $0.3\\times0.3=0.09$.',
      'إهمال عدّ المنازل العشرية يزيح الفاصلة منزلًا واحدة.',
      '0.3\\times0.3',
    ),
    correctAnswer: false,
  }),
  multiSelect({
    ...fields(
      'fixture-l5-15',
      'اختر كل جداء ناتجه أصغر تمامًا من $1$.',
      'reasoning', 'fixture-decimal-multiplication',
      ['$0.5\\times0.5=0.25$ و$2\\times0.4=0.8$ و$0.9\\times0.9=0.81$، وكلها أصغر من $1$.', '$1.5\\times0.8=1.2$ أكبر من $1$ فيُستبعد.'],
      'الجداءات المطلوبة هي (أ) و(ب) و(د).',
      'الضرب في عدد أصغر من واحد يُصغّر الناتج، والضرب في عدد أكبر من واحد يكبّره.',
    ),
    options: [
      { id: 'a', label: '$0.5\\times0.5$' },
      { id: 'b', label: '$2\\times0.4$' },
      { id: 'c', label: '$1.5\\times0.8$' },
      { id: 'd', label: '$0.9\\times0.9$' },
    ],
    correctOptionIds: ['a', 'b', 'd'],
  }),

  // --- l5-decimal-word-problems (5) -----------------------------------------
  numeric({
    ...fields(
      'fixture-l5-16',
      'اشترى طالب قلمًا بثمن $2.5$ وحدة ودفترًا بثمن $3.75$ وحدة. ما مجموع الثمنين؟',
      'intermediate', 'fixture-decimal-word-problem',
      ['نحاذي المنازل: $2.50+3.75$.', 'نجمع: $2.50+3.75=6.25$ وحدة.'],
      '$6.25$ وحدة',
      'المجموع الكلي هو جمع الثمنين بعد محاذاة المنازل.',
    ),
    acceptedAnswers: ['6.25', '25/4'],
    answerFormat: 'عدد عشري',
  }),
  singleChoice({
    ...fields(
      'fixture-l5-17',
      'قطعة قماش طولها $4.5$ متر، قُصّ منها $1.25$ متر ثم $0.75$ متر. أي قيمة تمثّل الباقي؟',
      'reasoning', 'fixture-decimal-word-problem',
      ['مجموع المقصوص: $1.25+0.75=2$ متر.', 'الباقي: $4.5-2=2.5$ متر.'],
      '$2.5$ متر',
      'الباقي هو الطول الأصلي ناقص مجموع ما قُصّ.',
    ),
    options: [
      { id: 'a', label: '$2.5$ متر' },
      { id: 'b', label: '$3.5$ متر' },
      { id: 'c', label: '$1.5$ متر' },
      { id: 'd', label: '$6.5$ متر' },
    ],
    correctOptionId: 'a',
  }),
  trueFalse({
    ...fields(
      'fixture-l5-18',
      'العبارة الآتية صحيحة: شراء $3$ قطع ثمن الواحدة منها $1.25$ وحدة يكلّف $3.75$ وحدة.',
      'reasoning', 'fixture-decimal-word-problem',
      ['نضرب العدد في الثمن: $3\\times1.25$.', '$3\\times1.25=3.75$ وحدة.'],
      'العبارة صحيحة؛ لأن $3\\times1.25=3.75$.',
      'الثمن الكلي هو ثمن القطعة مضروبًا في عدد القطع.',
    ),
    correctAnswer: true,
  }),
  ordering({
    ...fields(
      'fixture-l5-19',
      'رتّب خطوات حل المسألة: «مع أحمد $10$ وحدات، اشترى $4$ أقلام ثمن الواحد $1.75$ وحدة، فكم بقي معه؟»',
      'advanced', 'fixture-decimal-word-problem',
      ['نقرأ المعطيات ونحدد المطلوب.', 'نحسب ثمن الأقلام: $4\\times1.75=7$ وحدات.', 'نطرح الثمن من المبلغ: $10-7=3$ وحدات.', 'نكتب الجواب بوحدة مناسبة.'],
      '$3$ وحدات',
      'الفهم ثم حساب الكلفة ثم الطرح ثم صياغة الجواب.',
    ),
    items: [
      { id: 'answer', label: 'كتابة الجواب بوحدة مناسبة.' },
      { id: 'read', label: 'قراءة المعطيات وتحديد المطلوب.' },
      { id: 'subtract', label: 'طرح الكلفة من المبلغ: $10-7$.' },
      { id: 'multiply', label: 'حساب كلفة الأقلام: $4\\times1.75$.' },
    ],
    correctOrder: ['read', 'multiply', 'subtract', 'answer'],
  }),
  matching({
    ...fields(
      'fixture-l5-20',
      'طابق كل عدد عشري مع الكسر العادي المبسّط المساوي له.',
      'basic', 'fixture-decimal-word-problem',
      ['$0.2=\\frac{2}{10}=\\frac{1}{5}$.', '$0.75=\\frac{75}{100}=\\frac{3}{4}$ و$0.125=\\frac{125}{1000}=\\frac{1}{8}$.'],
      'أ ↔ $\\frac{1}{5}$، ب ↔ $\\frac{3}{4}$، ج ↔ $\\frac{1}{8}$.',
      'التحويل ثم الاختصار يعطي الكسر بأبسط صورة.',
    ),
    leftItems: [
      { id: 'l1', label: '$0.2$' },
      { id: 'l2', label: '$0.75$' },
      { id: 'l3', label: '$0.125$' },
    ],
    rightItems: [
      { id: 'r1', label: '$\\frac{1}{8}$' },
      { id: 'r2', label: '$\\frac{3}{4}$' },
      { id: 'r3', label: '$\\frac{1}{5}$' },
    ],
    correctPairs: { l1: 'r3', l2: 'r2', l3: 'r1' },
  }),
];

export const fixtureBlueprint: LessonTestBlueprint = {
  lessonId: FIXTURE_LESSON_ID,
  sourceSteps: ['step-1', 'step-2', 'step-3', 'step-4'],
  concepts: [
    {
      conceptId: 'l5-decimal-to-fraction',
      title: 'التحويل بين العدد العشري والكسر العادي',
      questionCount: 5,
      skills: ['تحويل عدد عشري إلى كسر', 'تحويل كسر إلى عدد عشري'],
    },
    {
      conceptId: 'l5-decimal-add-subtract',
      title: 'جمع الكسور العشرية وطرحها بمحاذاة المنازل',
      questionCount: 5,
      skills: ['محاذاة المنازل العشرية', 'تشخيص خطأ في الطرح'],
    },
    {
      conceptId: 'l5-decimal-multiply',
      title: 'ضرب الكسور العشرية وتحديد منازل الناتج',
      questionCount: 5,
      skills: ['عدّ منازل الناتج', 'مقارنة جداء بالواحد'],
    },
    {
      conceptId: 'l5-decimal-word-problems',
      title: 'مسائل لفظية بالكسور العشرية',
      questionCount: 5,
      skills: ['ترجمة مسألة إلى عملية', 'ترتيب خطوات الحل'],
    },
  ],
  difficultyPlan: { ...RECOMMENDED_LESSON_DIFFICULTY_PROFILE },
  questionTypePlan: fixtureTypePlan(),
  commonMistakes: ['إهمال محاذاة المنازل العشرية.', 'نسيان عدّ منازل الناتج في الضرب.'],
};

function fixtureTypePlan(): Partial<Record<TestQuestionType, number>> {
  return fixtureQuestions.reduce<Partial<Record<TestQuestionType, number>>>((plan, question) => {
    plan[question.type] = (plan[question.type] ?? 0) + 1;
    return plan;
  }, {});
}

export const fixtureTestDefinition: TestDefinition = {
  id: FIXTURE_TEST_ID,
  type: 'lesson',
  unitId: FIXTURE_UNIT_ID,
  lessonId: FIXTURE_LESSON_ID,
  title: 'اختبار الدرس الخامس (تجريبي): الكسور العشرية',
  description: 'اختبار تجريبي يثبت أن إضافة درس جديد مع اختبار كامل تمرّ من التدقيق تلقائيًا.',
  questionIds: fixtureQuestions.map((question) => question.id),
  difficultyLabel: 'متدرّج: أساسي، متوسط، متقدم، وتفكير',
  coverageLabel: 'التحويل، الجمع والطرح، الضرب، والمسائل اللفظية',
  estimatedMinutes: 25,
  blueprint: fixtureBlueprint,
};

export interface FixtureSnapshotOptions {
  /** Register the fixture test (and its questions) for the new lesson. */
  withTest?: boolean;
  /** Register the fixture concept profile for the new lesson. */
  withConcepts?: boolean;
  /** Register the fixture blueprint for the new lesson. */
  withBlueprint?: boolean;
  /** Declare the unit test's coverage of the new lesson as pending. */
  withPendingUnitCoverage?: boolean;
}

/**
 * The real bank plus a fictional Lesson 5. The unit test does not cover the new
 * lesson, so `withPendingUnitCoverage` models the deliberate deferral a
 * maintainer declares instead of silently ignoring the gap.
 */
export function snapshotWithFixtureLesson(options: FixtureSnapshotOptions = {}): TestBankSnapshot {
  const {
    withTest = true,
    withConcepts = true,
    withBlueprint = true,
    withPendingUnitCoverage = true,
  } = options;
  const base = createTestBankSnapshot();

  const definitions = withPendingUnitCoverage
    ? base.definitions.map((definition) => (definition.type === 'unit'
      ? {
        ...definition,
        pendingLessonCoverage: [
          ...(definition.pendingLessonCoverage ?? []),
          {
            lessonId: FIXTURE_LESSON_ID,
            reason: 'سيُحدَّث اختبار الوحدة وفق blueprint جديد بعد مراجعة الدرس',
            trackedBy: 'lesson-5-unit-test-followup',
          },
        ],
      }
      : definition))
    : [...base.definitions];

  return {
    ...base,
    lessons: [...base.lessons, fixtureLessonRef],
    definitions: [...definitions, ...(withTest ? [fixtureTestDefinition] : [])],
    questions: [...base.questions, ...(withTest ? fixtureQuestions : [])],
    conceptProfiles: withConcepts
      ? [...base.conceptProfiles, fixtureConceptProfile]
      : base.conceptProfiles,
    blueprints: withBlueprint
      ? { ...base.blueprints, [FIXTURE_LESSON_ID]: fixtureBlueprint }
      : base.blueprints,
  };
}

/** Sanity guard for the fixture itself: it must look exactly like a real lesson test. */
export const fixtureIsWellFormed = fixtureQuestions.length === LESSON_TEST_QUESTION_COUNT
  && fixtureTestDefinition.questionIds.length === LESSON_TEST_QUESTION_COUNT;
