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

const unit2Lesson1Concepts: CurriculumConcept[] = [
  {
    id: 'u2l1-power-meaning',
    title: 'معنى القوة 10^n للأس الموجب والصفر',
    skills: ['power-meaning-repeated-product', 'zero-and-first-power'],
    taughtInSteps: ['step-1', 'step-2', 'step-3'],
    sourcePages: [26],
    commonMistakes: ['كتابة 10^3 على أنها 10×3 بدلًا من تكرار الضرب.'],
  },
  {
    id: 'u2l1-negative-powers',
    title: 'القوة السالبة للعدد 10 مقلوب القوة الموجبة',
    skills: ['negative-power-reciprocal', 'negative-power-is-not-negative', 'power-ordering'],
    taughtInSteps: ['step-4'],
    sourcePages: [26, 27],
    commonMistakes: ['اعتبار 10^{-3} عددًا سالبًا لأن الأس سالب.'],
  },
  {
    id: 'u2l1-power-to-decimal',
    title: 'الانتقال من قوة العدد 10 إلى الشكل العشري',
    skills: ['power-to-decimal', 'decimal-place-direction'],
    taughtInSteps: ['step-6', 'step-9', 'step-11'],
    sourcePages: [27, 28],
    commonMistakes: ['نقل الفاصلة في الاتجاه الخاطئ عند الانتقال إلى الشكل العشري.'],
  },
  {
    id: 'u2l1-decimal-to-power',
    title: 'الانتقال من العدد العشري إلى قوة العدد 10',
    skills: ['decimal-to-power', 'product-of-powers-of-ten'],
    taughtInSteps: ['step-9', 'step-12'],
    sourcePages: [28],
  },
  {
    id: 'u2l1-standard-form',
    title: 'الصيغة المعيارية a×10^n',
    skills: ['standard-form-exponent', 'standard-form-coefficient'],
    taughtInSteps: ['step-5', 'step-10', 'step-13'],
    sourcePages: [27, 28],
    commonMistakes: ['ترك أكثر من خانة غير صفرية قبل الفاصلة في الصيغة المعيارية.'],
  },
  {
    id: 'u2l1-exponent-conversion',
    title: 'تحويل عدد من صيغة معيارية إلى صيغة بأس آخر',
    skills: ['exponent-conversion'],
    taughtInSteps: ['step-7'],
    sourcePages: [27],
    commonMistakes: ['نسيان إشارة الأس السالب عند جمع الأسس.'],
  },
  {
    id: 'u2l1-application',
    title: 'تطبيق على أعداد كبيرة من الواقع',
    skills: ['standard-form-application'],
    taughtInSteps: ['step-13'],
    sourcePages: [28],
  },
];

const unit2Lesson2Concepts: CurriculumConcept[] = [
  {
    id: 'u2l2-product-rule',
    title: 'قاعدة الضرب: جمع الأسين',
    skills: ['product-rule-add-exponents', 'product-rule-unknown-exponent', 'product-rule-not-multiply'],
    taughtInSteps: ['step-1', 'step-3', 'step-4'],
    sourcePages: [29],
    commonMistakes: ['ضرب الأسين بدل جمعهما في قاعدة الضرب: $10^{3}\\times10^{2}=10^{6}$.'],
  },
  {
    id: 'u2l2-quotient-rule',
    title: 'قاعدة القسمة: طرح الأسين',
    skills: ['quotient-rule-subtract-exponents', 'quotient-rule-negative-result'],
    taughtInSteps: ['step-2', 'step-3', 'step-4'],
    sourcePages: [29],
    commonMistakes: ['طرح أس البسط من أس المقام في القسمة: $\\frac{10^{5}}{10^{2}}=10^{-3}$.'],
  },
  {
    id: 'u2l2-power-rule',
    title: 'قاعدة قوة القوة: ضرب الأسين',
    skills: ['power-of-power-multiply-exponents', 'power-of-power-negative-exponent'],
    taughtInSteps: ['step-2', 'step-3', 'step-4'],
    sourcePages: [29],
    commonMistakes: ['جمع الأسين في قوة القوة: $(10^{3})^{2}=10^{5}$.'],
  },
  {
    id: 'u2l2-reciprocal-rule',
    title: 'قاعدة المقلوب: تغيير إشارة الأس',
    skills: ['reciprocal-sign-change', 'reciprocal-of-negative-power'],
    taughtInSteps: ['step-3', 'step-4'],
    sourcePages: [29],
    commonMistakes: ['إبقاء إشارة الأس في المقلوب: $\\frac{1}{10^{-3}}=10^{-3}$.'],
  },
  {
    id: 'u2l2-scientific-calc',
    title: 'الحساب مع أعداد بصيغة a×10^n',
    skills: ['scientific-multiply-coefficients', 'scientific-add-unify-power', 'scientific-standardize-result'],
    taughtInSteps: ['step-5', 'step-6'],
    sourcePages: [29, 30],
    commonMistakes: ['جمع أعداد بصيغة $a\\times10^{n}$ بجمع الأسس بدل توحيد القوة أولًا.'],
  },
  {
    id: 'u2l2-bounding',
    title: 'حصر العدد بين قوتين متتاليتين',
    skills: ['bounding-consecutive-powers', 'bounding-from-standard-form'],
    taughtInSteps: ['step-7'],
    sourcePages: [30],
    commonMistakes: ['اختيار الأس الخطأ في الحصر بعدّ الأرقام بدل قراءة الصيغة المعيارية.'],
  },
  {
    id: 'u2l2-integrated',
    title: 'تطبيق متكامل: اختيار القاعدة المناسبة',
    skills: ['choose-rule-by-operation', 'same-power-different-expressions', 'rule-generalization'],
    taughtInSteps: ['step-8', 'step-9', 'step-10', 'step-11'],
    sourcePages: [29, 30, 31],
  },
];

const unit2Lesson3Concepts: CurriculumConcept[] = [
  {
    id: 'u2l3-power-meaning',
    title: 'معنى القوة وكتابتها على شكل جداء عوامل',
    skills: ['power-as-repeated-product', 'base-and-exponent-roles', 'product-to-power-notation'],
    taughtInSteps: ['step-1', 'step-3'],
    sourcePages: [32],
    commonMistakes: ['قراءة 5^{3} على أنها 5\\times3 بدلًا من 5\\times5\\times5.'],
  },
  {
    id: 'u2l3-special-powers',
    title: 'الحالات الخاصة: الأس صفر وقوى الواحد والصفر',
    skills: ['zero-exponent-is-one', 'one-power-and-zero-power'],
    taughtInSteps: ['step-3'],
    sourcePages: [32],
    commonMistakes: ['اعتبار 12^{0} مساويًا للصفر، أو إغفال شرط n>0 في 0^{n}.'],
  },
  {
    id: 'u2l3-negative-exponent',
    title: 'القوة ذات الأس السالب مقلوب القوة الموجبة',
    skills: ['negative-exponent-reciprocal', 'reciprocal-of-power-notation'],
    taughtInSteps: ['step-2', 'step-5'],
    sourcePages: [32],
    commonMistakes: ['اعتبار 3^{-2} عددًا سالبًا يساوي -9.'],
  },
  {
    id: 'u2l3-sign-of-power',
    title: 'إشارة قوة عدد سالب حسب زوجية الأس',
    skills: ['even-exponent-positive', 'odd-exponent-negative', 'sign-with-negative-base'],
    taughtInSteps: ['step-4', 'step-5'],
    sourcePages: [32],
    commonMistakes: ['كتابة (-7)^{3} = 343 بإغفال الإشارة.'],
  },
  {
    id: 'u2l3-product-rule',
    title: 'قاعدة جداء قوتين: جمع الأسين',
    skills: ['product-rule-add-exponents', 'product-rule-not-multiply', 'product-rule-with-negative-exponents'],
    taughtInSteps: ['step-2', 'step-6'],
    sourcePages: [32],
    commonMistakes: ['ضرب الأسين بدل جمعهما: 3^{2}\\times3^{5} = 3^{10}.'],
  },
  {
    id: 'u2l3-product-power-rule',
    title: 'قاعدة قوة الجداء: توزيع الأس على العاملين',
    skills: ['power-of-product-distribute', 'same-exponent-different-bases'],
    taughtInSteps: ['step-2', 'step-6'],
    sourcePages: [32],
    commonMistakes: ['تطبيق قاعدة جمع الأسين على أساسين مختلفين: 5^{3}\\times2^{3} = 10^{6}.'],
  },
  {
    id: 'u2l3-quotient-rule',
    title: 'قاعدة خارج قسمة قوتين: طرح الأسين',
    skills: ['quotient-rule-subtract-exponents', 'quotient-rule-order-of-subtraction', 'quotient-to-single-power'],
    taughtInSteps: ['step-2', 'step-7'],
    sourcePages: [32, 33],
    commonMistakes: ['طرح أس البسط من أس المقام: \\frac{5^{9}}{5^{6}} = 5^{-3}.'],
  },
  {
    id: 'u2l3-quotient-power-rule',
    title: 'قاعدة قوة الخارج: رفع البسط والمقام',
    skills: ['power-of-quotient-distribute', 'fraction-raised-to-power'],
    taughtInSteps: ['step-7'],
    sourcePages: [33],
    commonMistakes: ['رفع البسط وحده أو المقام وحده عند حساب (\\frac{2}{3})^{4}.'],
  },
  {
    id: 'u2l3-operations-priority',
    title: 'أولويات العمليات: القوى ثم الضرب والقسمة ثم الجمع والطرح',
    skills: ['power-before-multiplication', 'parentheses-change-order', 'evaluate-expression-correctly'],
    taughtInSteps: ['step-8', 'step-9', 'step-10'],
    sourcePages: [33],
    commonMistakes: ['حساب 6\\times2^{2} بالضرب أولًا فيكون الناتج 144 بدل 24.'],
  },
  {
    id: 'u2l3-applied-powers',
    title: 'توظيف القوى في مسائل تطبيقية وحجم المكعب',
    skills: ['cube-volume-with-powers', 'unit-conversion-dm3-cm3', 'scaling-with-powers'],
    taughtInSteps: ['step-15'],
    sourcePages: [34],
    commonMistakes: ['نسيان التحويل بين dm^{3} و cm^{3} عند حساب الحجم بالسنتيمترات المكعبة.'],
  },
];

const unit2Lesson4Concepts: CurriculumConcept[] = [
  {
    id: 'u2l4-root-definition',
    title: 'تعريف الجذر التربيعي للعدد الموجب',
    skills: ['root-as-inverse-of-square', 'root-is-nonnegative', 'perfect-square-recognition'],
    taughtInSteps: ['step-1', 'step-2'],
    sourcePages: [35],
    commonMistakes: ['كتابة $\\sqrt{25} = \\pm5$، والجذر التربيعي للعدد الموجب عدد موجب فقط.'],
  },
  {
    id: 'u2l4-negative-zero',
    title: 'العدد السالب والصفر والعدد غير المربع',
    skills: ['negative-has-no-square-root', 'square-root-of-zero', 'non-square-root-kept-as-symbol'],
    taughtInSteps: ['step-3', 'step-10'],
    sourcePages: [35, 37],
    commonMistakes: ['اعتبار أن للعدد $-25$ جذرًا تربيعيًا، أو حساب $\\sqrt{5}$ كعدد صحيح.'],
  },
  {
    id: 'u2l4-product-rule',
    title: 'الجذر التربيعي لجداء عددين موجبين',
    skills: ['sqrt-of-product', 'sqrt-product-used-in-reverse', 'no-distribution-over-sum'],
    taughtInSteps: ['step-4'],
    sourcePages: [36],
    commonMistakes: ['توزيع الجذر على الجمع: $\\sqrt{9+16} = 3+4$ والصواب $5$.'],
  },
  {
    id: 'u2l4-quotient-rule',
    title: 'الجذر التربيعي لنسبة عددين موجبين',
    skills: ['sqrt-of-quotient', 'simplify-fraction-under-root'],
    taughtInSteps: ['step-5'],
    sourcePages: [36],
    commonMistakes: ['أخذ جذر البسط وحده: $\\sqrt{\\frac{9}{25}} = \\frac{9}{5}$.'],
  },
  {
    id: 'u2l4-power-rules',
    title: 'قوّة الجذر وجذر قوّة أسها زوجي',
    skills: ['power-of-sqrt-equals-sqrt-of-power', 'sqrt-of-even-power'],
    taughtInSteps: ['step-6', 'step-7'],
    sourcePages: [36],
    commonMistakes: ['اعتبار $\\sqrt{x^{2}} = x$ لكل $x$، مع أن $\\sqrt{(-3)^{2}} = 3$.'],
  },
  {
    id: 'u2l4-simplify',
    title: 'تبسيط الجذور بإخراج العامل المربع الكامل',
    skills: ['largest-square-factor', 'simplified-radical-form'],
    taughtInSteps: ['step-8', 'step-14'],
    sourcePages: [37],
    commonMistakes: ['تبسيط $\\sqrt{50}$ بإخراج 2 كأنه عامل مربع.'],
  },
  {
    id: 'u2l4-area-calc',
    title: 'مساحة المربع وطول ضلعه والآلة الحاسبة',
    skills: ['side-from-area', 'calculator-approximation', 'round-to-hundredth'],
    taughtInSteps: ['step-9', 'step-11', 'step-13', 'step-15'],
    sourcePages: [37],
    commonMistakes: ['نسيان وحدة الطول بعد حساب الجذر، فالمساحة تُقاس بـ cm² والطول بـ cm.'],
  },
];


const unit2Lesson5Concepts: CurriculumConcept[] = [
  {
    id: 'u2l5-standard-form',
    title: 'الصيغة المعيارية وشرط 1 ≤ a < 10',
    skills: ['standard-form-exponent', 'standard-form-recognition', 'rewrite-with-requested-exponent'],
    taughtInSteps: ['q-1', 'q-3', 'q-15', 'q-16', 'q-26', 'q-27', 'q-37'],
    sourcePages: [],
    commonMistakes: ['اعتبار $42.6\times10^{3}$ صيغة معيارية، مع أن المعامل يجب أن يكون بين 1 و10.'],
  },
  {
    id: 'u2l5-power-rules',
    title: 'قواعد قوى العدد 10 (الضرب والقسمة وقوة القوة)',
    skills: ['product-of-powers', 'quotient-of-powers', 'power-of-a-power', 'power-of-a-variable'],
    taughtInSteps: ['q-10', 'q-11', 'q-12', 'q-13', 'q-25', 'q-31'],
    sourcePages: [],
    commonMistakes: ['جمع الأسس في القسمة، أو جمعها في قوة القوة بدل ضربها.'],
  },
  {
    id: 'u2l5-order-of-operations',
    title: 'أولويات العمليات وإشارة القوة',
    skills: ['priorities-with-powers', 'sign-of-power', 'parentheses-effect'],
    taughtInSteps: ['q-8', 'q-14', 'q-19', 'q-20', 'q-21', 'q-22'],
    sourcePages: [],
    commonMistakes: ['اعتبار $-2^{4}=16$، والصحيح $-16$ لأن الإشارة خارج القوة.'],
  },
  {
    id: 'u2l5-addition-subtraction',
    title: 'جمع وطرح أعداد بصيغة a × 10^p',
    skills: ['unify-exponent', 'add-coefficients', 'subtract-coefficients'],
    taughtInSteps: ['q-17', 'q-18', 'q-28', 'q-29', 'q-39'],
    sourcePages: [],
    commonMistakes: ['جمع الأسس عند الجمع: $3\times10^{5}+4\times10^{5}\to7\times10^{10}$.'],
  },
  {
    id: 'u2l5-decimal-conversion',
    title: 'التحويل بين الكتابة العشرية وقوى العدد 10',
    skills: ['decimal-to-power', 'compare-negative-exponents', 'equivalent-forms'],
    taughtInSteps: ['q-6', 'q-9', 'q-34', 'q-35', 'q-38'],
    sourcePages: [],
    commonMistakes: ['الظن أن $10^{-5}>10^{-2}$ لأن 5 أكبر من 2.'],
  },
  {
    id: 'u2l5-applications',
    title: 'تطبيقات المساحة والحجم والوحدات',
    skills: ['side-from-area', 'edge-from-volume', 'unit-conversion', 'calculator-approximation'],
    taughtInSteps: ['q-5', 'q-7', 'q-23', 'q-24', 'q-30', 'q-32', 'q-33', 'q-36'],
    sourcePages: [],
    commonMistakes: ['نسيان تحويل الوحدة بعد حساب الجذر، فيبقى الجواب بالمتر والمطلوب بالسنتيمتر.'],
  },
  {
    id: 'u2l5-mixed-review',
    title: 'مراجعة مختلطة لأعداد بصيغ متعددة',
    skills: ['mixed-notation-review', 'match-number-to-standard-form'],
    taughtInSteps: ['q-2', 'q-4'],
    sourcePages: [],
    commonMistakes: ['مقارنة المعاملات دون الانتباه إلى اختلاف الأسس.'],
  },
];

export const unit3Lesson1Concepts: CurriculumConcept[] = [
  {
    id: 'u3l1-opposite-of-sum',
    title: 'نظير المجموع وحذف قوس مسبوق بناقص لمجموع',
    skills: [
      'opposite-of-sum-rule',
      'remove-minus-parentheses-sum',
      'table-conjecture-sum',
    ],
    taughtInSteps: ['step-3', 'step-4', 'step-5', 'step-6', 'step-8', 'step-10'],
    sourcePages: [47, 48, 49],
    commonMistakes: ['تغيير إشارة الحدّ الأول فقط وكتابة $-(a + b) = -a + b$.'],
  },
  {
    id: 'u3l1-opposite-of-difference',
    title: 'نظير الفرق وحذف قوس مسبوق بناقص لفرق',
    skills: [
      'opposite-of-difference-rule',
      'remove-minus-parentheses-difference',
      'both-negative-inside-brackets',
    ],
    taughtInSteps: ['step-3', 'step-4', 'step-5', 'step-6', 'step-8'],
    sourcePages: [47, 48, 49],
    commonMistakes: ['إبقاء الحدّ الثاني سالبًا في $-(a - b)$ بدل قلبه إلى $+b$.'],
  },
  {
    id: 'u3l1-directed-number-line',
    title: 'تمثيل النظير ومجموع النظيرين على المستقيم الموجه',
    skills: [
      'number-line-opposite-placement',
      'sign-of-minus-a-for-negative-a',
      'sum-sign-by-distance-from-origin',
    ],
    taughtInSteps: ['step-4'],
    sourcePages: [47],
    commonMistakes: ['الظن أن الرمز $-a$ يقع دائمًا على يسار المبدأ $O$ حتى عندما يكون $a$ سالبًا.'],
  },
  {
    id: 'u3l1-multiterm-and-quadratic',
    title: 'نظير مجموع جبري متعدد الحدود أو يحوي قوى',
    skills: [
      'opposite-of-trinomial',
      'opposite-of-quadratic-expression',
      'combine-after-removing-brackets',
    ],
    taughtInSteps: ['step-6', 'step-10', 'step-13'],
    sourcePages: [48, 49],
    commonMistakes: ['تغيير إشارة حدّين فقط ونسيان الحدّ الثالث في ثلاثي الحدود.'],
  },
  {
    id: 'u3l1-opposite-evaluation-and-proof',
    title: 'التعويض العددي وموازنة العبارات المتعاكسة والنتيجة المؤكّدة',
    skills: [
      'evaluate-opposite-expressions',
      'numerical-check-vs-symbolic-certainty',
    ],
    taughtInSteps: ['step-7', 'step-9'],
    sourcePages: [48, 49],
    commonMistakes: ['إغفال قوسي العدد السالب عند التعويض في عبارة من الشكل $a - b - c$.'],
  },
  {
    id: 'u3l1-numerical-shortcut-and-cycle',
    title: 'توظيف النظير لاختصار الحساب العددي وتتبّع المخططات الدائرية',
    skills: [
      'deduce-opposite-series-without-computing',
      'algebraic-cycle-tracking',
    ],
    taughtInSteps: ['step-11', 'step-12'],
    sourcePages: [49],
    commonMistakes: ['نسيان قلب إشارة الثابت عند خطوة «نكتب النظير» في سلسلة الانتقالات.'],
  },
  {
    id: 'u3l1-sign-error-diagnosis',
    title: 'تشخيص الأخطاء الشائعة في حذف الأقواس والإشارات',
    skills: [
      'diagnose-second-term-sign-error',
      'distinguish-minus-parentheses-from-plus-or-product',
    ],
    taughtInSteps: ['step-5', 'step-8', 'step-10', 'step-13'],
    sourcePages: [48, 49],
    commonMistakes: ['الخلط بين حذف قوس مسبوق بناقص $-(x + 3)$ ونشر جداء أو حذف قوس مسبوق بزائد.'],
  },
];

export const unit3Lesson2Concepts: CurriculumConcept[] = [
  {
    id: 'u3l2-situation-to-expression',
    title: 'تحويل الموقف العددي إلى عبارة جمع وطرح وحساب الرصيد',
    skills: ['situation-to-signed-expression', 'grouped-transactions-equivalence'],
    taughtInSteps: ['step-1'],
    sourcePages: [50],
    commonMistakes: ['عكس إشارة الدخل/الصرف في الموقف المالي (طرح المكافأة أو إضافة الثمن).'],
  },
  {
    id: 'u3l2-plus-parentheses-rule',
    title: 'حذف القوس المسبوق بالإشارة + (بما فيها الزائد الضمني)',
    skills: ['remove-plus-parentheses', 'implicit-plus-at-start'],
    taughtInSteps: ['step-2', 'step-3'],
    sourcePages: [50],
    commonMistakes: ['قلب إشارات حدود قوس مسبوق بزائد: كتابة $a + (b - c) = a - b - c$.'],
  },
  {
    id: 'u3l2-minus-parentheses-rule',
    title: 'حذف القوس المسبوق بالإشارة −: جمع نظير محتواه',
    skills: ['remove-minus-parentheses', 'subtract-as-adding-opposite'],
    taughtInSteps: ['step-2', 'step-3', 'step-4'],
    sourcePages: [50, 51],
    commonMistakes: ['إبقاء إشارات حدود قوس مسبوق بناقص: كتابة $7 - (3 - 5) = 7 - 3 - 5$.'],
  },
  {
    id: 'u3l2-evaluate-without-brackets',
    title: 'الكتابة دون أقواس وحساب القيمة (أعداد صحيحة وعشرية وكسرية)',
    skills: ['evaluate-decimal-chains', 'evaluate-fraction-chains', 'evaluate-with-leading-minus'],
    taughtInSteps: ['step-5', 'step-6'],
    sourcePages: [51],
    commonMistakes: ['نسيان حدّ عند نقل محتويات القوس أو خلط المقامات في السلسلة الكسرية.'],
  },
  {
    id: 'u3l2-verify-identity-numerically',
    title: 'اختبار المساواة بالتعويض عند x = 1: تجربة عددية مقابل برهان رمزي',
    skills: ['substitution-check-at-x1', 'numeric-test-vs-symbolic-proof'],
    taughtInSteps: ['step-5', 'step-8'],
    sourcePages: [51],
    commonMistakes: ['اعتبار تطابق الطرفين عند قيمة واحدة برهانًا للمطابقة لكل قيم x.'],
  },
  {
    id: 'u3l2-bracket-simplification',
    title: 'تبسيط العبارات متعددة الأقواس: الحذف وجمع الحدود المتشابهة',
    skills: ['simplify-two-parenthesis-expressions', 'simplify-with-substitution', 'track-simplification-stages'],
    taughtInSteps: ['step-4', 'step-7', 'step-8'],
    sourcePages: [50, 51],
    commonMistakes: ['في عبارة بها قوسان مختلفا الإشارة، قلب حدود قوس واحد وترك الثاني (أو العكس).'],
  },
];

export const unit3Lesson3Concepts: CurriculumConcept[] = [
  {
    id: 'u3l3-area-expression-modeling',
    title: 'التعبير عن مساحة سطح مركّب بدلالة متغيّرين والحكم على الصيغ المكافئة',
    skills: ['area-two-variable-decomposition', 'decide-equivalent-area-expression', 'area-evaluation'],
    taughtInSteps: ['step-1'],
    sourcePages: [52],
    commonMistakes: ['قبول كل عبارة تساوي المساحة عدديًا على أنها قراءة من الشكل، أو قبول $2(x + y) + 8x$ بدل $10x - 8y$.'],
  },
  {
    id: 'u3l3-like-terms-reduction',
    title: 'اختزال العبارات بجمع الحدود المتشابهة',
    skills: ['identify-like-terms', 'combine-coefficients', 'order-by-descending-degree'],
    taughtInSteps: ['step-2', 'step-5'],
    sourcePages: [52, 53],
    commonMistakes: ['جمع حدود غير متشابهة مثل $2x^2 + 3x = 5x^2$، أو نسيان أن معامل $x$ هو $1$.'],
  },
  {
    id: 'u3l3-monomial-product',
    title: 'ضرب الحدود: المعاملات والرموز وقاعدة الإشارات',
    skills: ['multiply-monomials', 'sign-of-product', 'multiply-powers-same-base'],
    taughtInSteps: ['step-3', 'step-5'],
    sourcePages: [52, 53],
    commonMistakes: ['نسيان جمع الأسّين عند ضرب الرمز في نفسه: كتابة $5x \times 5x = 25x$ بدل $25x^2$.'],
  },
  {
    id: 'u3l3-expand-and-remove-brackets',
    title: 'النشر وحذف الأقواس في العبارات ذات المعاملات',
    skills: ['distribute-coefficient', 'expand-two-bracket-expression', 'remove-minus-bracket'],
    taughtInSteps: ['step-2', 'step-3', 'step-6', 'step-7'],
    sourcePages: [52, 53],
    commonMistakes: ['توزيع العدد على الحد الأول فقط: $3(5x - 1) = 15x - 1$، أو ترك إشارة الحد الأخير دون قلب داخل قوس مسبوق بناقص.'],
  },
  {
    id: 'u3l3-evaluate-reduced',
    title: 'حساب قيمة عبارة مختزلة عند قيم عددية',
    skills: ['substitute-positive-integers', 'substitute-negative-and-fraction', 'zero-of-expression'],
    taughtInSteps: ['step-4', 'step-8'],
    sourcePages: [53],
    commonMistakes: ['إغفال الأقواس عند تربيع عدد سالب، أو الخلط بين $(-x)^2$ و$-x^2$.'],
  },
  {
    id: 'u3l3-simplify-then-operate',
    title: 'تركيب العبارات: A + B و A − B وترتيب خطوات الاختزال',
    skills: ['add-subtract-expressions', 'track-simplification-order', 'diagnose-reduction-errors'],
    taughtInSteps: ['step-7', 'step-9'],
    sourcePages: [53],
    commonMistakes: ['حساب $A - B$ كأنها $A + B$ بنسيان قلب إشارات حدود $B$ كلها.'],
  },
];

export const lessonConceptProfiles: readonly LessonConceptProfile[] = [
  { lessonId: 'lesson-1', unitId: 'unit-1', lessonTitle: 'الجمع والطرح', concepts: lesson1Concepts },
  { lessonId: 'lesson-2', unitId: 'unit-1', lessonTitle: 'الضرب', concepts: lesson2Concepts },
  { lessonId: 'lesson-3', unitId: 'unit-1', lessonTitle: 'القسمة', concepts: lesson3Concepts },
  { lessonId: 'lesson-4', unitId: 'unit-1', lessonTitle: 'تمارين الوحدة الأولى', concepts: lesson4Concepts },
  { lessonId: 'u2-lesson-1', unitId: 'unit-2', lessonTitle: 'قوى العدد 10', concepts: unit2Lesson1Concepts },
  { lessonId: 'u2-lesson-2', unitId: 'unit-2', lessonTitle: 'قواعد قوى العدد 10', concepts: unit2Lesson2Concepts },
  { lessonId: 'u2-lesson-3', unitId: 'unit-2', lessonTitle: 'قوى صحيحة لعدد نسبي', concepts: unit2Lesson3Concepts },
  { lessonId: 'u2-lesson-4', unitId: 'unit-2', lessonTitle: 'الجذور التربيعية', concepts: unit2Lesson4Concepts },
  { lessonId: 'u2-lesson-5', unitId: 'unit-2', lessonTitle: 'تمارين ومسائل الوحدة الثانية', concepts: unit2Lesson5Concepts },
  { lessonId: 'u3-lesson-1', unitId: 'unit-3', lessonTitle: 'نظير المجموع ونظير الفرق', concepts: unit3Lesson1Concepts },
  { lessonId: 'u3-lesson-2', unitId: 'unit-3', lessonTitle: 'حذف الأقواس', concepts: unit3Lesson2Concepts },
  { lessonId: 'u3-lesson-3', unitId: 'unit-3', lessonTitle: 'اختزال عبارة رمزية', concepts: unit3Lesson3Concepts },
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
