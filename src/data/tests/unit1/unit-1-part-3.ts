import { errorAnalysis, matching, multiSelect, numeric, ordering, singleChoice, trueFalse } from '../builders';
import { questionFields } from '../questionFields';
import type { CurriculumConceptRef, TestQuestion } from '../types';

const ref = (lessonId: string, conceptId: string): CurriculumConceptRef => ({ lessonId, conceptId });
const q = (
  id: string,
  prompt: string,
  difficulty: TestQuestion['difficulty'],
  primaryLessonId: string,
  curriculumRefs: CurriculumConceptRef[],
  steps: string[],
  finalAnswer: string,
  explanation: string,
  math?: string,
) => questionFields({
  id, prompt, difficulty, primaryLessonId, curriculumRefs, math,
  solution: { steps, finalAnswer, explanation },
});

export const unit1QuestionsPart3: TestQuestion[] = [
  singleChoice({
    ...q(
      'u1-unit-43',
      'تحتوي قارورة على $\\frac{2}{3}$ لتر من محلول. نُقل إلى وعاء آخر $40\\%$ من محتواها. ما الحجم المنقول؟',
      'basic', 'lesson-4', [ref('lesson-4', 'percent-of-rational-quantity'), ref('lesson-2', 'fraction-product')],
      ['$40\\%=\\frac{40}{100}=\\frac{2}{5}$.', 'نحسب $\\frac{2}{5}$ من $\\frac{2}{3}$ بالضرب: $\\frac{2}{5}\\times\\frac{2}{3}=\\frac{4}{15}$.'],
      '$\\frac{4}{15}$ لتر',
      'كلمة «من» تعني الضرب؛ نحول النسبة المئوية إلى كسر ثم نضربها في كمية القارورة.',
    ),
    options: [
      { id: 'a', label: '$\\frac{4}{15}$ لتر' },
      { id: 'b', label: '$\\frac{2}{5}$ لتر' },
      { id: 'c', label: '$\\frac{2}{3}$ لتر' },
      { id: 'd', label: '$\\frac{8}{15}$ لتر' },
    ],
    correctOptionId: 'a',
  }),

  numeric({
    ...q(
      'u1-unit-44',
      'طول قطعة أصلية $1.2$ متر. صُغّر نموذجها إلى $75\\%$ من طولها؛ فما طول النموذج بالسنتيمتر؟',
      'basic', 'lesson-4', [ref('lesson-4', 'percentage-and-unit-conversion'), ref('lesson-2', 'fraction-times-decimal')],
      ['$75\\%=\\frac{3}{4}$. إذا كان $1.2$ متر هو الطول الأصلي، فالطول المصغّر $1.2\\times\\frac{3}{4}=0.9$ متر.', 'نحوّل إلى السنتيمتر: $0.9\\times100=90$.'],
      '$90$ سنتيمترًا',
      'نطبّق عامل التصغير أولًا على الطول الأصلي، ثم نحوّل وحدة القياس.',
    ),
    acceptedAnswers: ['90'],
    answerFormat: 'عدد صحيح',
  }),

  trueFalse({
    ...q(
      'u1-unit-45',
      'عند $x=-\\frac{3}{2}$، تكون قيمة $-\\frac{2}{3}x+\\frac{5}{6}x$ هي $-\\frac{1}{4}$.',
      'basic', 'lesson-4', [ref('lesson-4', 'fractional-like-terms-and-substitution'), ref('lesson-1', 'fraction-addition'), ref('lesson-2', 'literal-products')],
      ['نوحّد معاملي $x$: $-\\frac{2}{3}+\\frac{5}{6}=-\\frac{4}{6}+\\frac{5}{6}=\\frac{1}{6}$، فيصبح المقدار $\\frac{1}{6}x$.', 'نعوّض $x=-\\frac{3}{2}$: $\\frac{1}{6}\\times(-\\frac{3}{2})=-\\frac{3}{12}=-\\frac{1}{4}$.', 'إذن القيمة المعطاة صحيحة.'],
      'العبارة صحيحة؛ القيمة هي $-\\frac{1}{4}$.',
      'نختزل حدود المتغير أولًا، ثم نعوّض القيمة المحددة ونتحقق من الناتج.',
    ),
    correctAnswer: true,
  }),

  numeric({
    ...q(
      'u1-unit-46',
      'زاد إنتاج آلة بنسبة $40\\%$، فأصبح $56$ وحدة. ما إنتاجها قبل الزيادة؟',
      'basic', 'lesson-4', [ref('lesson-4', 'reverse-percentage-change'), ref('lesson-1', 'fraction-equivalence')],
      ['إذا كان الإنتاج الأصلي $x$، فالجديد $140\\%$ منه: $1.4x=56$.', 'عامل الزيادة $1.4=\\frac{7}{5}$، لذا $x=56\\div\\frac{7}{5}=56\\times\\frac{5}{7}=40$.'],
      '$40$ وحدة',
      'القيمة بعد الزيادة تمثل $140\\%$ من الأصل؛ نعكس عامل الضرب لإيجاد الأصل.',
    ),
    acceptedAnswers: ['40'],
    answerFormat: 'عدد صحيح',
  }),

  singleChoice({
    ...q(
      'u1-unit-47',
      'في استبيان، اختار $18$ من أصل $48$ طالبًا إجابة معينة. ما النسبة المئوية المكافئة لهذا الجزء؟',
      'basic', 'lesson-4', [ref('lesson-4', 'ratio-to-percent'), ref('lesson-1', 'fraction-simplification')],
      ['نكتب النسبة ككسر: $\\frac{18}{48}$.', 'نختصر بالقسمة على $6$: $\\frac{18}{48}=\\frac{3}{8}$.', 'نحوّل إلى نسبة مئوية: $\\frac{3}{8}=0.375=37.5\\%$.'],
      '$37.5\\%$',
      'نختصر نسبة الجزء إلى الكل أولًا، ثم نحوّلها إلى نسبة مئوية.',
    ),
    options: [
      { id: 'a', label: '$18\\%$' },
      { id: 'b', label: '$37.5\\%$' },
      { id: 'c', label: '$48\\%$' },
      { id: 'd', label: '$62.5\\%$' },
    ],
    correctOptionId: 'b',
  }),

  multiSelect({
    ...q(
      'u1-unit-48',
      'اختر كل تعبير يمثّل $80\\%$ من كمية جبرية مقدارها $x$.',
      'basic', 'lesson-4', [ref('lesson-4', 'percent-as-algebraic-multiplier'), ref('lesson-1', 'equivalent-fractions')],
      ['$80\\%=\\frac{80}{100}=\\frac{4}{5}=0.8$.', 'إذن $80\\%$ من $x$ تساوي $\\frac{4}{5}x=0.8x$.', 'كما يمكن طرح $20\\%$ من الأصل: $x-0.2x=0.8x$.'],
      'التعابير الصحيحة: $0.8x$، $\\frac{4}{5}x$، و$x-0.2x$.',
      'يمكن تمثيل النسبة بعامل ضرب، أو بطرح الجزء المكمل من الكمية الأصلية.',
    ),
    options: [
      { id: 'a', label: '$0.8x$' },
      { id: 'b', label: '$\\frac{4}{5}x$' },
      { id: 'c', label: '$x-0.2x$' },
      { id: 'd', label: '$x-0.8x$' },
    ],
    correctOptionIds: ['a', 'b', 'c'],
  }),

  numeric({
    ...q(
      'u1-unit-49',
      'اكتب $60\\%$ على صورة كسر عادي في أبسط صورة.',
      'basic', 'lesson-4', [ref('lesson-4', 'percent-to-fraction-conversion')],
      ['$60\\%=\\frac{60}{100}$.', 'نقسم البسط والمقام على $20$: $\\frac{60}{100}=\\frac{3}{5}$.'],
      '$\\frac{3}{5}$',
      'النسبة المئوية تعني عددًا من مئة، ثم نختصر الكسر الناتج.',
    ),
    acceptedAnswers: ['3/5'],
    answerFormat: 'كسر عادي مبسّط',
  }),

  ordering({
    ...q(
      'u1-unit-50',
      'رتّب خطوات حساب $\\left(\\frac{5}{6}-\\frac{1}{4}\\right)\\div15\\%$.',
      'intermediate', 'lesson-4', [ref('lesson-4', 'percent-in-fraction-operation'), ref('lesson-1', 'fraction-subtraction'), ref('lesson-3', 'division-by-fraction')],
      ['نحسب ما داخل القوس: $\\frac{5}{6}-\\frac{1}{4}=\\frac{10}{12}-\\frac{3}{12}=\\frac{7}{12}$.', 'بعد حساب القوس، نحوّل $15\\%$ إلى $\\frac{3}{20}$ ونكتب $\\frac{7}{12}\\div\\frac{3}{20}$.', 'نقسم بضرب المقلوب: $\\frac{7}{12}\\times\\frac{20}{3}=\\frac{140}{36}$.', 'نختصر الناتج إلى $\\frac{35}{9}$.'],
      '$\\frac{35}{9}$',
      'نحسب القوس أولًا، ثم نستبدل النسبة المئوية بكسر في القسمة، ونضرب بالمقلوب.',
      '(\\frac{5}{6}-\\frac{1}{4})\\div15\\%',
    ),
    items: [
      { id: 'reduce', label: 'اختصار الناتج إلى $\\frac{35}{9}$.' },
      { id: 'rewrite', label: 'بعد حساب القوس، تحويل $15\\%$ إلى $\\frac{3}{20}$ وكتابة $\\frac{7}{12}\\div\\frac{3}{20}$.' },
      { id: 'division', label: 'الضرب بالمقلوب: $\\frac{7}{12}\\times\\frac{20}{3}=\\frac{140}{36}$.' },
      { id: 'parentheses', label: 'حساب القوس: $\\frac{5}{6}-\\frac{1}{4}=\\frac{7}{12}$.' },
    ],
    correctOrder: ['parentheses', 'rewrite', 'division', 'reduce'],
  }),

  matching({
    ...q(
      'u1-unit-51',
      'طابق كل عبارة تطبيقية مع ناتجها الدقيق أو عاملها المناسب.',
      'intermediate', 'lesson-4', [ref('lesson-4', 'integrated-fraction-and-percent-models'), ref('lesson-1', 'fraction-subtraction'), ref('lesson-3', 'division-by-fraction')],
      ['(أ) $40\\%$ من $\\frac{3}{5}$: $\\frac{2}{5}\\times\\frac{3}{5}=\\frac{6}{25}$.', '(ب) $(\\frac{3}{4}-\\frac{1}{6})\\div\\frac{1}{2}=\\frac{7}{12}\\times2=\\frac{7}{6}$.', '(ج) زيادة كمية بنسبة $25\\%$ تعني عاملًا $1+\\frac{1}{4}=\\frac{5}{4}$.'],
      'أ ↔ $\\frac{6}{25}$، ب ↔ $\\frac{7}{6}$، ج ↔ $\\frac{5}{4}$.',
      'تتطلب العبارات الثلاث نمذجة مختلفة: «من» ضرب، و«الفرق مقسومًا على» طرح ثم قسمة، والزيادة عامل أكبر من الواحد.',
    ),
    leftItems: [
      { id: 'a', label: 'أ: $40\\%$ من $\\frac{3}{5}$' },
      { id: 'b', label: 'ب: $(\\frac{3}{4}-\\frac{1}{6})\\div\\frac{1}{2}$' },
      { id: 'c', label: 'ج: عامل زيادة مقدار بنسبة $25\\%$' },
    ],
    rightItems: [
      { id: 'r1', label: '$\\frac{7}{6}$' },
      { id: 'r2', label: '$\\frac{5}{4}$' },
      { id: 'r3', label: '$\\frac{6}{25}$' },
    ],
    correctPairs: { a: 'r3', b: 'r1', c: 'r2' },
  }),

  numeric({
    ...q(
      'u1-unit-52',
      'مستطيل طوله $\\frac{5}{8}$ متر وعرضه $30\\%$ من متر. ما محيطه؟',
      'intermediate', 'lesson-4', [ref('lesson-4', 'measurement-and-percent'), ref('lesson-1', 'fraction-addition'), ref('lesson-2', 'multiplication-by-integer')],
      ['$30\\%$ من متر تساوي $\\frac{3}{10}$ متر.', 'المحيط $P=2(l+w)=2(\\frac{5}{8}+\\frac{3}{10})$.', 'المقام المشترك $40$: $2(\\frac{25}{40}+\\frac{12}{40})=2\\times\\frac{37}{40}=\\frac{37}{20}$ متر.'],
      '$\\frac{37}{20}$ متر',
      'نحوّل القياس المئوي إلى كسر من المتر، ثم نجمع الضلعين المتجاورين ونضرب في اثنين.',
    ),
    acceptedAnswers: ['37/20'],
    answerFormat: 'كسر عادي',
  }),

  errorAnalysis({
    ...q(
      'u1-unit-53',
      'حاول طالب جمع الحدّين $\\frac{2}{3}x+\\frac{1}{4}x$ فكتب $\\frac{3}{7}x$ بجمع البسطين والمقامين. ما التصحيح؟',
      'intermediate', 'lesson-4', [ref('lesson-4', 'fractional-coefficients-and-like-terms'), ref('lesson-1', 'common-denominator-addition'), ref('lesson-2', 'like-terms')],
      ['المعاملان لهما المقامان $3$ و$4$، لذلك نوحّدهما إلى $12$.', '$\\frac{2}{3}x=\\frac{8}{12}x$ و$\\frac{1}{4}x=\\frac{3}{12}x$.', 'نجمع المعاملين فقط: $\\frac{8+3}{12}x=\\frac{11}{12}x$.'],
      'الصواب $\\frac{11}{12}x$؛ لا تُجمع المقامات.',
      'الحدّان متشابهان لأن كليهما يحوي $x$؛ نضيف معامليهما بعد تحويلهما إلى مقام مشترك.',
    ),
    options: [
      { id: 'a', label: '$\\frac{11}{12}x$؛ نوحّد المقامات ثم نجمع البسطين.' },
      { id: 'b', label: '$\\frac{3}{7}x$؛ الحل المعروض صحيح.' },
      { id: 'c', label: '$\\frac{2}{7}x$؛ نطرح المقامين.' },
      { id: 'd', label: '$\\frac{11}{7}x$؛ نجمع البسطين ونبقي المقام الأكبر.' },
    ],
    correctOptionId: 'a',
  }),

  numeric({
    ...q(
      'u1-unit-54',
      'إذا كان $B=150\\%x-\\frac{x}{4}$، فأوجد $B$ عندما $x=-\\frac{2}{3}$.',
      'intermediate', 'lesson-4', [ref('lesson-4', 'substitution-with-percent-and-negative-fraction'), ref('lesson-1', 'fraction-subtraction'), ref('lesson-2', 'literal-products')],
      ['نحوّل $150\\%$ إلى $\\frac{3}{2}$ ثم نعوّض: $B=\\frac{3}{2}(-\\frac{2}{3})-\\frac{-2/3}{4}$.', 'الحد الأول $-1$، والحد الثاني المطروح يساوي $-\\frac{1}{6}$.', 'إذن $B=-1-(-\\frac{1}{6})=-\\frac{5}{6}$.'],
      '$-\\frac{5}{6}$',
      'نحوّل النسبة إلى معامل، نعوّض القيمة السالبة، ثم ننتبه إلى أن طرح مقدار سالب يصبح جمعًا.',
    ),
    acceptedAnswers: ['-5/6'],
    answerFormat: 'كسر عادي',
  }),

  singleChoice({
    ...q(
      'u1-unit-55',
      'بدأت كتلتان متساويتان مقدار كل منهما $q$. زيدت الأولى بنسبة $20\\%$ وخُفّضت الثانية بنسبة $20\\%$. ما الفرق بين الكتلتين بعد التغيير؟',
      'intermediate', 'lesson-4', [ref('lesson-4', 'compare-opposite-percentage-changes'), ref('lesson-1', 'fraction-subtraction')],
      ['الأولى تصبح $1.2q$، والثانية تصبح $0.8q$.', 'الفرق $1.2q-0.8q=0.4q=\\frac{2}{5}q$.'],
      '$0.4q$ أو $\\frac{2}{5}q$',
      'نحسب كل تغيير من المقدار الأصلي نفسه، ثم نطرح القيمتين الجديدتين.',
    ),
    options: [
      { id: 'a', label: '$0.4q$' },
      { id: 'b', label: '$0.2q$' },
      { id: 'c', label: '$0.04q$' },
      { id: 'd', label: '$1.4q$' },
    ],
    correctOptionId: 'a',
  }),

  ordering({
    ...q(
      'u1-unit-56',
      'رتّب خطوات حل المعادلة $\\frac{3}{4}(x-\\frac{2}{3})=\\frac{5}{8}$.',
      'advanced', 'lesson-4', [ref('lesson-4', 'multi-step-fractional-equation'), ref('lesson-3', 'division-by-fraction'), ref('lesson-1', 'fraction-addition')],
      ['نضرب الطرفين في مقلوب $\\frac{3}{4}$، أي $\\frac{4}{3}$: $x-\\frac{2}{3}=\\frac{5}{8}\\times\\frac{4}{3}$.', 'نختصر ونحسب الطرف الأيمن: $\\frac{5}{8}\\times\\frac{4}{3}=\\frac{5}{6}$.', 'نضيف $\\frac{2}{3}$ إلى الطرفين: $x=\\frac{5}{6}+\\frac{2}{3}$.', 'نوحّد المقام: $x=\\frac{5}{6}+\\frac{4}{6}=\\frac{9}{6}=\\frac{3}{2}$.'],
      '$x=\\frac{3}{2}$',
      'نعكس العمليات بالترتيب: نلغي العامل الكسري أولًا، ثم نعزل $x$ بإضافة الحد المطروح.',
    ),
    items: [
      { id: 'add', label: 'إضافة $\\frac{2}{3}$ للطرفين: $x=\\frac{5}{6}+\\frac{2}{3}$.' },
      { id: 'inverse', label: 'الضرب في $\\frac{4}{3}$ لإلغاء العامل $\\frac{3}{4}$.' },
      { id: 'combine', label: 'توحيد المقام وإيجاد $x=\\frac{3}{2}$.' },
      { id: 'simplify', label: 'تبسيط $\\frac{5}{8}\\times\\frac{4}{3}$ إلى $\\frac{5}{6}$.' },
    ],
    correctOrder: ['inverse', 'simplify', 'add', 'combine'],
  }),

  errorAnalysis({
    ...q(
      'u1-unit-57',
      'وسّع طالب المقدار $25\\%\\left(x+8\\right)$ فكتب $0.25x+8$. ما التصحيح؟',
      'advanced', 'lesson-4', [ref('lesson-4', 'distributing-a-percentage'), ref('lesson-2', 'distributive-property')],
      ['نحوّل $25\\%$ إلى $0.25=\\frac{1}{4}$.', 'يجب ضرب العامل في كلا الحدّين: $0.25(x+8)=0.25x+0.25\\times8$.', 'الناتج الصحيح $0.25x+2$.'],
      '$0.25x+2$؛ لم يُوزّع العامل على العدد $8$.',
      'النسبة المئوية خارج القوس عامل ضرب، ولذلك تتوزّع على كل ما داخل القوس.',
    ),
    options: [
      { id: 'a', label: '$0.25x+2$؛ نضرب $0.25$ في $x$ وفي $8$.' },
      { id: 'b', label: '$0.25x+8$؛ الحل المعروض صحيح.' },
      { id: 'c', label: '$x+2$؛ نحذف عامل النسبة من حد المتغير.' },
      { id: 'd', label: '$0.25x+0.25$؛ نضرب الثابت مرة واحدة دون قيمته.' },
    ],
    correctOptionId: 'a',
  }),

  numeric({
    ...q(
      'u1-unit-58',
      'قطعة مستطيلة أبعادها $\\frac{3}{4}$ متر و$\\frac{2}{5}$ متر. أُزيل $10\\%$ من مساحتها بسبب قصّ الحواف. ما المساحة المتبقية؟',
      'advanced', 'lesson-4', [ref('lesson-4', 'area-and-percent-remainder'), ref('lesson-2', 'fraction-product'), ref('lesson-1', 'fraction-subtraction')],
      ['المساحة الأصلية $\\frac{3}{4}\\times\\frac{2}{5}=\\frac{6}{20}=\\frac{3}{10}$ م$^2$.', 'المتبقي بعد إزالة $10\\%$ هو $90\\%=\\frac{9}{10}$ من المساحة.', 'المساحة المتبقية $\\frac{9}{10}\\times\\frac{3}{10}=\\frac{27}{100}$ م$^2$.'],
      '$\\frac{27}{100}$ متر مربع',
      'نحسب المساحة أولًا، ثم نطبّق نسبة الجزء الباقي على المساحة الأصلية.',
    ),
    acceptedAnswers: ['27/100'],
    answerFormat: 'كسر عادي',
  }),

  multiSelect({
    ...q(
      'u1-unit-59',
      'مستطيل طوله $x$ وعرضه $\\frac{3}{4}x$. خُفّض العرض بنسبة $20\\%$ وبقي الطول كما هو. اختر كل تعبير يساوي المساحة الجديدة.',
      'reasoning', 'lesson-4', [ref('lesson-4', 'percent-change-in-geometric-expression'), ref('lesson-2', 'multiplication-of-literal-expressions')],
      ['العرض الجديد $80\\%$ من $\\frac{3}{4}x$: $\\frac{4}{5}\\times\\frac{3}{4}x=\\frac{3}{5}x$.', 'المساحة الجديدة تساوي $x\\times\\frac{3}{5}x=\\frac{3}{5}x^2$.', 'والصيغة العشرية المكافئة هي $0.6x^2$.'],
      'التعبيران الصحيحان: $\\frac{3}{5}x^2$ و$0.6x^2$.',
      'نعدّل العرض بعامل الباقي بعد الخفض، ثم نضربه في الطول للحصول على المساحة.',
    ),
    options: [
      { id: 'a', label: '$\\frac{3}{5}x^2$' },
      { id: 'b', label: '$0.6x^2$' },
      { id: 'c', label: '$\\frac{3}{4}x^2$' },
      { id: 'd', label: '$\\frac{1}{5}x^2$' },
    ],
    correctOptionIds: ['a', 'b'],
  }),

  numeric({
    ...q(
      'u1-unit-60',
      'في مخطط، يمثّل طول مقداره $1.5$ سم نسبة $12\\%$ من طول مسار كامل. ما طول المسار على المخطط بالسنتيمتر؟',
      'reasoning', 'lesson-4', [ref('lesson-4', 'reverse-percentage-and-division'), ref('lesson-3', 'division-by-decimal'), ref('lesson-1', 'exact-rational-calculation')],
      ['إذا رمزنا للطول الكامل بـ$x$، فإن $12\\%$ منه يساوي $1.5$: $0.12x=1.5$.', 'نقسم على $0.12$: $x=1.5\\div0.12$.', 'نحوّل إلى كسور دقيقة: $\\frac{3}{2}\\div\\frac{3}{25}=\\frac{3}{2}\\times\\frac{25}{3}=\\frac{25}{2}=12.5$.'],
      '$12.5$ سم',
      'لإيجاد الكل من جزء معلوم ونسبته، نقسم الجزء على النسبة المكتوبة كعدد عشري أو كسر.',
    ),
    acceptedAnswers: ['12.5', '25/2'],
    answerFormat: 'عدد عشري أو كسر مكافئ',
  }),
];
