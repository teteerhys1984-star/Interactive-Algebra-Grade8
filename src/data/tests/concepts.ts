/**
 * Curriculum concept catalog for the test system.
 *
 * Every concept below is a topic that is *actually taught* in its lesson: it
 * points at the lesson steps (`LessonStep.id`) and textbook pages that teach it.
 * The audit verifies both, so a concept cannot exist here unless the lesson
 * really contains it.
 *
 * Purpose (source traceability):
 *  - each test question declares `curriculumRefs[].conceptId`, which is either a
 *    concept id or one of the concept's `skills` (micro-skill) ids;
 *  - a question whose concept id resolves to nothing is reported as suspicious
 *    instead of silently passing, so out-of-lesson questions get reviewed;
 *  - blueprints and coverage reports are computed from this catalog.
 *
 * Rule for maintainers: never invent a concept to make a question valid. If a
 * question cannot be attached to a concept below, the question is off-lesson and
 * must be rewritten (or the lesson content re-read, because the concept may be
 * taught somewhere that is not catalogued yet).
 */

export interface CurriculumConcept {
  id: string;
  /** Arabic title of the topic as taught in the lesson. */
  title: string;
  /**
   * Micro-skills assessed by test questions. A question may reference either the
   * concept id or one of these ids.
   */
  skills: string[];
  /** `LessonStep.id` values of the steps that teach this concept. */
  taughtInSteps: string[];
  /** Textbook pages covered by `taughtInSteps`. */
  sourcePages: number[];
  /** Misconceptions the lesson explicitly addresses for this concept. */
  commonMistakes?: string[];
}

export interface LessonConceptProfile {
  lessonId: string;
  unitId: string;
  lessonTitle: string;
  concepts: CurriculumConcept[];
}

const lesson1Concepts: CurriculumConcept[] = [
  {
    id: 'l1-equal-denominators',
    title: 'خاصة 1: جمع وطرح كسور مقاماتها متساوية',
    skills: [
      'same-denominator-addition',
      'same-denominator-subtraction',
    ],
    taughtInSteps: ['step-1', 'step-2'],
    sourcePages: [5, 6],
    commonMistakes: ['جمع المقامات مع البسطين بدل إبقاء المقام كما هو.'],
  },
  {
    id: 'l1-unlike-denominators',
    title: 'خاصة 2: توحيد المقامات قبل الجمع أو الطرح',
    skills: [
      'unlike-denominator-signed-addition',
      'equivalent-fractions',
      'equivalence-in-subtraction',
      'error-adding-denominators',
      'unlike-denominator-subtraction',
      'signed-unlike-denominator-addition',
      'common-denominator-addition',
      'equivalent-fraction-conversion',
      'equivalent-fraction-forms',
      'fraction-equivalence',
      'fraction-addition',
      'fraction-subtraction',
      'fraction-difference',
    ],
    taughtInSteps: ['step-1', 'step-3'],
    sourcePages: [5, 6],
    commonMistakes: ['ضرب البسط وحده عند تحويل الكسر إلى المقام المشترك.'],
  },
  {
    id: 'l1-common-denominator-choice',
    title: 'اختيار المقام المشترك: المضاعفات والمقام المشترك الأصغر',
    skills: [
      'common-denominator',
      'least-common-multiple',
    ],
    taughtInSteps: ['step-4', 'step-5'],
    sourcePages: [6, 7],
  },
  {
    id: 'l1-operation-chains',
    title: 'سلسلة من عمليات الجمع والطرح وترتيب إنجازها',
    skills: [
      'addition-subtraction-chain',
      'three-term-fraction-chain',
      'left-to-right-add-subtract',
      'operation-order-in-fraction-chain',
      'operation-chain',
      'fraction-chain-context',
    ],
    taughtInSteps: ['step-4', 'step-5', 'step-6'],
    sourcePages: [6, 7],
    commonMistakes: ['إدخال قوس يغيّر إشارة الحد الأخير في السلسلة.'],
  },
  {
    id: 'l1-signed-fractions',
    title: 'الإشارات في جمع الكسور وطرحها وطرح عدد سالب',
    skills: [
      'signed-fractions',
      'subtracting-negative-fraction',
      'signs-in-addition-subtraction',
      'signs-in-subtraction',
      'subtracting-fraction-coefficients',
      'subtracting-reused-quantity',
    ],
    taughtInSteps: ['step-1', 'step-2', 'step-6'],
    sourcePages: [5, 6, 7],
    commonMistakes: ['اعتبار طرح كسر سالب طرحًا عاديًا بدل تحويله إلى جمع.'],
  },
  {
    id: 'l1-missing-term',
    title: 'إيجاد الحد الناقص في مساواة (انسخ وأكمل)',
    skills: [
      'missing-addend',
      'unknown-subtrahend-in-fraction-chain',
    ],
    taughtInSteps: ['step-5', 'step-6'],
    sourcePages: [7],
  },
  {
    id: 'l1-word-problems',
    title: 'مسائل لفظية على الكسور: الباقي والمجموع',
    skills: [
      'fraction-word-problem',
      'multi-step-fraction-context',
    ],
    taughtInSteps: ['step-6'],
    sourcePages: [7],
    commonMistakes: ['جمع المقدارين بدل حساب المتبقي منهما.'],
  },
  {
    id: 'l1-mixed-practice',
    title: 'تمارين مختلطة: ربط كل عملية بناتجها المبسّط',
    skills: [
      'fraction-operation-matching',
      'signed-fraction-context',
      'exact-rational-calculation',
      'fraction-simplification',
    ],
    taughtInSteps: ['step-5', 'step-6'],
    sourcePages: [7],
  },
];

const lesson2Concepts: CurriculumConcept[] = [
  {
    id: 'l2-fraction-times-fraction',
    title: 'خاصة ضرب كسرين عاديين: بسط × بسط ومقام × مقام',
    skills: [
      'fraction-multiplication-and-cancellation',
      'fraction-products',
      'multi-factor-product',
      'fraction-of-a-fraction',
      'fraction-product',
      'fraction-multiplication',
      'zero-factor-property',
    ],
    taughtInSteps: ['step-1', 'step-2'],
    sourcePages: [8],
  },
  {
    id: 'l2-cancellation',
    title: 'الاختصار بين البسط والمقام قبل إنجاز الضرب',
    skills: [
      'cross-cancellation',
      'fraction-product-and-cancellation',
    ],
    taughtInSteps: ['step-2', 'step-8'],
    sourcePages: [8, 11],
    commonMistakes: ['اختصار عددين في البسط معًا بدل اختصار بسط مع مقام.'],
  },
  {
    id: 'l2-fraction-times-whole',
    title: 'ضرب كسر في عدد صحيح (a = a/1) وكسر من كمية',
    skills: [
      'integer-times-fraction',
      'fraction-times-whole-number-context',
      'fraction-of-quantity',
      'repeated-fraction-product-context',
      'integer-times-fraction-in-context',
      'multiplication-by-integer',
      'fraction-times-decimal',
      'inverse-of-fraction-of-quantity',
    ],
    taughtInSteps: ['step-3', 'step-8'],
    sourcePages: [9, 11],
  },
  {
    id: 'l2-sign-of-product',
    title: 'إشارة الجداء: عدد العوامل السالبة زوجي أم فردي',
    skills: [
      'sign-of-product',
      'parity-of-negative-factors',
    ],
    taughtInSteps: ['step-4', 'step-7'],
    sourcePages: [9, 10],
    commonMistakes: ['إهمال عدد العوامل السالبة عند تحديد إشارة الناتج.'],
  },
  {
    id: 'l2-literal-multiplication',
    title: 'ضرب المقادير الحرفية وإبقاء الحرف في الناتج',
    skills: [
      'multiplying-literal-expressions',
      'multiplying-algebraic-factors',
      'fraction-times-literal-expression',
      'literal-products',
      'multiplication-of-literal-expressions',
    ],
    taughtInSteps: ['step-3', 'step-8'],
    sourcePages: [9, 11],
    commonMistakes: ['إسقاط الحرف من الناتج بعد ضرب المعاملات.'],
  },
  {
    id: 'l2-distributive-expansion',
    title: 'النشر: توزيع الضرب على الجمع والطرح ثم جمع الحدود المتشابهة',
    skills: [
      'distributive-property',
      'distributing-negative-factor',
      'expand-and-collect-like-terms',
      'multiply-then-combine-like-terms',
      'distribution-and-like-terms',
      'distribution-with-negative-factor',
      'distribution-and-signs',
      'collecting-like-terms',
      'like-terms',
      'equivalent-algebraic-expressions',
      'equivalent-expressions',
    ],
    taughtInSteps: ['step-5', 'step-8'],
    sourcePages: [10, 11],
    commonMistakes: ['عدم توزيع العامل السالب على الحد الثاني داخل القوس.'],
  },
  {
    id: 'l2-factorization',
    title: 'التحليل: إخراج العامل المشترك',
    skills: [
      'common-factor-factorization',
      'equivalent-factorizations',
      'expand-factor-equivalence',
      'factoring-negative-common-factor',
    ],
    taughtInSteps: ['step-6', 'step-8'],
    sourcePages: [10, 11],
    commonMistakes: ['إخراج العامل المشترك من حد واحد فقط وترك الحد الآخر.'],
  },
];

const lesson3Concepts: CurriculumConcept[] = [
  {
    id: 'l3-reciprocal',
    title: 'مقلوب عدد عادي: تبديل البسط والمقام دون تغيير الإشارة',
    skills: [
      'reciprocal-of-fraction',
      'reciprocal-of-negative-fraction',
      'reciprocal-product-definition',
      'zero-has-no-reciprocal',
      'reciprocal-of-quotient',
      'reciprocal-of-decimal-fraction',
    ],
    taughtInSteps: ['step-1', 'step-4'],
    sourcePages: [12, 13],
    commonMistakes: ['تغيير إشارة الكسر عند كتابته مقلوبًا.'],
  },
  {
    id: 'l3-division-by-reciprocal',
    title: 'القسمة هي الضرب بمقلوب المقسوم عليه',
    skills: [
      'division-by-reciprocal',
      'division-and-simplification',
      'division-and-reduction',
      'signed-division',
      'which-number-to-invert',
      'division-by-fraction',
      'general-division-rule',
      'signed-fraction-division',
      'equivalent-quotients',
      'left-to-right-division-and-multiplication',
      'division-by-integer',
      'division-by-integer-equivalence',
      'quotient-of-equal-nonzero-numbers',
    ],
    taughtInSteps: ['step-2', 'step-5'],
    sourcePages: [12, 13, 14],
    commonMistakes: ['قلب المقسوم بدل المقسوم عليه.'],
  },
  {
    id: 'l3-division-meaning',
    title: 'معنى القسمة: القياس والعملية العكسية للضرب',
    skills: [
      'division-as-measuring',
      'inverse-operation-to-find-dividend',
      'division-as-inverse-of-multiplication',
      'division-modeling',
      'unknown-divisor',
    ],
    taughtInSteps: ['step-2', 'step-3'],
    sourcePages: [12],
  },
  {
    id: 'l3-sign-of-quotient',
    title: 'إشارة خارج القسمة',
    skills: [
      'sign-of-quotient',
    ],
    taughtInSteps: ['step-4', 'step-10'],
    sourcePages: [12, 13, 16],
  },
  {
    id: 'l3-opposite-vs-reciprocal',
    title: 'الفرق بين النظير الجمعي والمقلوب',
    skills: [
      'opposite-versus-reciprocal',
      'opposite-and-reciprocal',
    ],
    taughtInSteps: ['step-7', 'step-9'],
    sourcePages: [15, 16],
    commonMistakes: ['الخلط بين النظير (تغيير الإشارة) والمقلوب (تبديل البسط والمقام).'],
  },
  {
    id: 'l3-zero-in-division',
    title: 'الصفر في القسمة: صفر ÷ عدد = صفر، والقسمة على صفر غير معرّفة',
    skills: [
      'zero-dividend-versus-divisor',
      'zero-in-products-and-quotients',
    ],
    taughtInSteps: ['step-7'],
    sourcePages: [15],
    commonMistakes: ['اعتبار القسمة على صفر مساوية لصفر.'],
  },
  {
    id: 'l3-exact-vs-approximate',
    title: 'القيمة التامة مقابل القيمة التقريبية واستعمال الآلة الحاسبة',
    skills: [
      'exact-and-approximate-quotient',
      'decimal-division',
      'division-by-decimal',
    ],
    taughtInSteps: ['step-3', 'step-8'],
    sourcePages: [12, 15],
  },
  {
    id: 'l3-order-of-operations',
    title: 'مراعاة الأولويات في عبارة تضم قسمة وجمعًا أو طرحًا',
    skills: [
      'order-of-operations',
      'division-before-subtraction',
    ],
    taughtInSteps: ['step-6'],
    sourcePages: [14],
    commonMistakes: ['إنجاز الجمع قبل القسمة خلافًا لترتيب العمليات.'],
  },
  {
    id: 'l3-compound-expressions',
    title: 'العبارات المركّبة والكسور المركّبة',
    skills: [
      'compound-fraction-and-division',
      'nested-division',
      'complex-fraction-and-order-of-operations',
    ],
    taughtInSteps: ['step-8', 'step-10'],
    sourcePages: [15, 16],
  },
];

const lesson4Concepts: CurriculumConcept[] = [
  {
    id: 'l4-fraction-arithmetic-review',
    title: 'مراجعة العمليات على الكسور مع مراعاة الأولويات',
    skills: [
      'fraction-product-before-addition',
      'subtract-then-divide-context',
      'fraction-of-gap-and-addition',
      'applied-operations',
      'exact-fraction-comparison',
      'quantity-comparison',
      'remainder-context',
    ],
    taughtInSteps: ['exercise-10', 'exercise-13', 'exercise-43'],
    sourcePages: [17, 18, 24],
  },
  {
    id: 'l4-expand-and-factor',
    title: 'النشر والتحليل وتبسيط العبارات الجبرية',
    skills: [
      'distribution-and-like-terms',
      'expand-and-simplify',
      'factor-and-verify',
      'distributive-error-analysis',
      'fractional-coefficients-and-like-terms',
      'fractional-like-terms-and-substitution',
      'substitution-with-percent-and-negative-fraction',
    ],
    taughtInSteps: ['exercise-14', 'exercise-39', 'exercise-40', 'exercise-41'],
    sourcePages: [18, 23],
    commonMistakes: ['جمع حدود غير متشابهة بعد النشر.'],
  },
  {
    id: 'l4-percent-change',
    title: 'النسبة المئوية للتغير: زيادة ونقصان من المقدار الأصلي',
    skills: [
      'percent-change-from-original',
      'percent-decrease-and-remainder',
      'percent-discount-context',
      'complementary-percent-parts',
      'reverse-percentage-change',
      'percent-to-fraction-conversion',
      'percent-as-fraction',
      'ratio-to-percent',
      'percent-of-rational-quantity',
      'area-and-percent-remainder',
    ],
    taughtInSteps: ['exercise-30', 'exercise-37', 'exercise-38'],
    sourcePages: [21, 23],
    commonMistakes: ['حساب النسبة من الباقي بدل المقدار الأصلي.'],
  },
  {
    id: 'l4-successive-percent-changes',
    title: 'التغيرات المتتابعة وعوامل الضرب المركّبة',
    skills: [
      'successive-percent-changes',
      'successive-percent-factor-composition',
      'successive-dimension-percent-factors',
      'compare-opposite-percentage-changes',
      'percent-change-in-geometric-expression',
    ],
    taughtInSteps: ['exercise-37', 'exercise-38'],
    sourcePages: [23],
    commonMistakes: ['جمع نسبتين متتابعتين بدل ضرب عامليهما.'],
  },
  {
    id: 'l4-percent-algebraic-models',
    title: 'النسب المئوية في النمذجة الجبرية للمواقف',
    skills: [
      'percent-discount-and-fixed-fee-modeling',
      'combine-percent-and-like-terms',
      'distributing-a-percentage',
      'percent-as-algebraic-multiplier',
      'percent-in-fraction-operation',
      'integrated-fraction-and-percent-models',
      'percent-as-divisor',
    ],
    taughtInSteps: ['exercise-38', 'exercise-42'],
    sourcePages: [23],
  },
  {
    id: 'l4-rates-and-measurement',
    title: 'المعدلات والكسور من كمية وتحويل الوحدات والمساحات',
    skills: [
      'fractional-unit-rate-and-conversion',
      'scale-unit-rate-with-fractions',
      'rectangular-area-with-rational-dimensions',
      'measurement-context',
      'measurement-and-percent',
      'percentage-and-unit-conversion',
    ],
    taughtInSteps: ['exercise-15', 'exercise-33', 'exercise-34', 'exercise-35'],
    sourcePages: [18, 22],
  },
  {
    id: 'l4-fractional-equations',
    title: 'معادلات بسيطة بمعاملات كسرية',
    skills: [
      'fraction-coefficient-equation',
      'applied-equation',
      'multi-step-fractional-equation',
      'reverse-percentage-and-division',
    ],
    taughtInSteps: ['exercise-44', 'exercise-45', 'exercise-46'],
    sourcePages: [24],
  },
];

export const lessonConceptProfiles: readonly LessonConceptProfile[] = [
  { lessonId: 'lesson-1', unitId: 'unit-1', lessonTitle: 'الجمع والطرح', concepts: lesson1Concepts },
  { lessonId: 'lesson-2', unitId: 'unit-1', lessonTitle: 'الضرب', concepts: lesson2Concepts },
  { lessonId: 'lesson-3', unitId: 'unit-1', lessonTitle: 'القسمة', concepts: lesson3Concepts },
  { lessonId: 'lesson-4', unitId: 'unit-1', lessonTitle: 'تمارين الوحدة الأولى', concepts: lesson4Concepts },
];

export function conceptProfileForLesson(lessonId: string): LessonConceptProfile | undefined {
  return lessonConceptProfiles.find((profile) => profile.lessonId === lessonId);
}

/**
 * Resolves a question's `conceptId` reference: it may name a catalogued concept
 * directly or one of that concept's micro-skills.
 */
export function resolveConceptReference(
  lessonId: string,
  conceptId: string,
  profiles: readonly LessonConceptProfile[] = lessonConceptProfiles,
): CurriculumConcept | undefined {
  const profile = profiles.find((entry) => entry.lessonId === lessonId);
  if (!profile) return undefined;
  return profile.concepts.find(
    (concept) => concept.id === conceptId || concept.skills.includes(conceptId),
  );
}

/** Every reference id (concept ids plus micro-skill ids) accepted for a lesson. */
export function conceptReferenceIdsForLesson(
  lessonId: string,
  profiles: readonly LessonConceptProfile[] = lessonConceptProfiles,
): Set<string> {
  const profile = profiles.find((entry) => entry.lessonId === lessonId);
  if (!profile) return new Set();
  return new Set(profile.concepts.flatMap((concept) => [concept.id, ...concept.skills]));
}

/** Titles of the concepts a question is built from (explicit metadata wins). */
export function sourceTopicsForQuestion(
  question: { sourceTopics?: string[]; curriculumRefs: { lessonId: string; conceptId: string }[] },
  profiles: readonly LessonConceptProfile[] = lessonConceptProfiles,
): string[] {
  if (question.sourceTopics && question.sourceTopics.length > 0) return [...question.sourceTopics];
  const titles = question.curriculumRefs
    .map((reference) => resolveConceptReference(reference.lessonId, reference.conceptId, profiles))
    .filter((concept): concept is CurriculumConcept => concept !== undefined)
    .map((concept) => concept.title);
  return [...new Set(titles)];
}
