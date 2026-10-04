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

export const unit1QuestionsPart1: TestQuestion[] = [
  singleChoice({
    ...q(
      'u1-unit-01',
      'بدأ مؤشر مختبر عند $-\\frac{7}{18}$ من تدريج مرجعي، ثم تحرّك بمقدار $\\frac{13}{24}$ إلى الأعلى. ما موضعه النهائي؟',
      'basic', 'lesson-1', [ref('lesson-1', 'signed-unlike-denominator-addition'), ref('lesson-4', 'measurement-context')],
      ['المقام المشترك الأصغر هو $72$: $-\\frac{7}{18}=-\\frac{28}{72}$ و$\\frac{13}{24}=\\frac{39}{72}$.', 'نجمع البسطين: $\\frac{-28+39}{72}=\\frac{11}{72}$.'],
      '$\\frac{11}{72}$ من التدريج المرجعي',
      'الحركة إلى الأعلى موجبة؛ نوحّد المقامين مع الحفاظ على إشارة القراءة السالبة.',
      '-\\frac{7}{18}+\\frac{13}{24}',
    ),
    options: [
      { id: 'a', label: '$-\\frac{11}{72}$' },
      { id: 'b', label: '$\\frac{11}{72}$' },
      { id: 'c', label: '$\\frac{6}{42}$' },
      { id: 'd', label: '$\\frac{1}{2}$' },
    ],
    correctOptionId: 'b',
  }),

  numeric({
    ...q(
      'u1-unit-02',
      'اكتب الناتج بأبسط صورة: $\\frac{5}{8}-\\frac{1}{6}$.',
      'basic', 'lesson-1', [ref('lesson-1', 'unlike-denominator-subtraction')],
      ['المقام المشترك الأصغر هو $24$.', 'نحوّل: $\\frac{5}{8}=\\frac{15}{24}$ و$\\frac{1}{6}=\\frac{4}{24}$.', 'نطرح: $\\frac{15-4}{24}=\\frac{11}{24}$.'],
      '$\\frac{11}{24}$',
      'نوحّد المقامات قبل الطرح، ونبقي المقام المشترك كما هو.',
      '\\frac{5}{8}-\\frac{1}{6}',
    ),
    acceptedAnswers: ['11/24'],
    answerFormat: 'كسر عادي',
  }),

  trueFalse({
    ...q(
      'u1-unit-03',
      'المساواة $\\frac{4}{9}+\\frac{1}{6}=\\frac{11}{18}$ صحيحة.',
      'basic', 'lesson-1', [ref('lesson-1', 'common-denominator-addition')],
      ['نحوّل إلى مقام $18$: $\\frac{4}{9}=\\frac{8}{18}$ و$\\frac{1}{6}=\\frac{3}{18}$.', 'المجموع $\\frac{8+3}{18}=\\frac{11}{18}$.'],
      'العبارة صحيحة.',
      'التحويلان متكافئان ثم نجمع البسطين لأن المقام أصبح واحدًا.',
    ),
    correctAnswer: true,
  }),

  multiSelect({
    ...q(
      'u1-unit-04',
      'لحساب $\\frac{3}{10}+\\frac{7}{12}$ اختيرت طريقتان بمقامين مشتركين مختلفين. اختر كل سطر تحويل صحيح.',
      'intermediate', 'lesson-1', [ref('lesson-1', 'equivalent-fractions'), ref('lesson-1', 'common-denominator')],
      ['على المقام $60$: $\\frac{3}{10}=\\frac{18}{60}$ و$\\frac{7}{12}=\\frac{35}{60}$.', 'وعلى المقام $120$: $\\frac{3}{10}=\\frac{36}{120}$ و$\\frac{7}{12}=\\frac{70}{120}$.', 'كلتا الطريقتين تعطيان $\\frac{53}{60}$ بعد الجمع والاختصار.'],
      'التحويلان الصحيحان هما (أ) و(ب)، وكلاهما يؤدي إلى $\\frac{53}{60}$.',
      'ليس المقام المشترك الوحيد هو الأصغر؛ أي مضاعف مشترك صالح إذا ضُرب البسط والمقام بالعامل نفسه.',
      '\\frac{3}{10}+\\frac{7}{12}',
    ),
    options: [
      { id: 'a', label: '$\\frac{18}{60}+\\frac{35}{60}$' },
      { id: 'b', label: '$\\frac{36}{120}+\\frac{70}{120}$' },
      { id: 'c', label: '$\\frac{3}{60}+\\frac{7}{60}$' },
      { id: 'd', label: '$\\frac{36}{120}+\\frac{35}{120}$' },
    ],
    correctOptionIds: ['a', 'b'],
  }),

  ordering({
    ...q(
      'u1-unit-05',
      'رتّب مراحل حساب $\\frac{5}{6}-(-\\frac{1}{4})+\\frac{1}{3}$.',
      'intermediate', 'lesson-1', [ref('lesson-1', 'signed-fractions'), ref('lesson-1', 'operation-chain')],
      ['نحوّل طرح السالب إلى جمع: $\\frac{5}{6}+\\frac{1}{4}+\\frac{1}{3}$.', 'المقام المشترك $12$: $\\frac{10}{12}+\\frac{3}{12}+\\frac{4}{12}$.', 'نجمع البسوط فنحصل على $\\frac{17}{12}$.'],
      '$\\frac{17}{12}$',
      'نحافظ على ترتيب العمليات وإشاراتها، ثم نوحّد المقامات ونجمع.',
      '\\frac{5}{6}-(-\\frac{1}{4})+\\frac{1}{3}',
    ),
    items: [
      { id: 'sum', label: 'جمع البسوط للحصول على $\\frac{17}{12}$.' },
      { id: 'sign', label: 'تحويل طرح السالب إلى جمع: $\\frac{5}{6}+\\frac{1}{4}+\\frac{1}{3}$.' },
      { id: 'common', label: 'توحيد المقامات إلى $12$: $\\frac{10}{12}+\\frac{3}{12}+\\frac{4}{12}$.' },
    ],
    correctOrder: ['sign', 'common', 'sum'],
  }),

  matching({
    ...q(
      'u1-unit-06',
      'طابق كل عمليّة مع أصغر مقام مشترك يلزم لتحويل كسورها قبل الجمع أو الطرح.',
      'intermediate', 'lesson-1', [ref('lesson-1', 'least-common-multiple'), ref('lesson-1', 'common-denominator')],
      ['(أ) المقامان $5$ و$3$؛ أصغر مضاعف مشترك $15$.', '(ب) المقامان $8$ و$6$؛ أصغر مضاعف مشترك $24$.', '(ج) المقامان $10$ و$5$؛ أصغر مضاعف مشترك $10$.'],
      'أ ↔ $15$، ب ↔ $24$، ج ↔ $10$.',
      'نختار أصغر مضاعف مشترك للمقامين كي تكون الكسور المكافئة سهلة الحساب.',
    ),
    leftItems: [
      { id: 'a', label: 'أ: $\\frac{2}{5}+\\frac{1}{3}$' },
      { id: 'b', label: 'ب: $\\frac{7}{8}-\\frac{1}{6}$' },
      { id: 'c', label: 'ج: $-\\frac{3}{10}+\\frac{4}{5}$' },
    ],
    rightItems: [
      { id: 'r1', label: '$10$' },
      { id: 'r2', label: '$24$' },
      { id: 'r3', label: '$15$' },
    ],
    correctPairs: { a: 'r3', b: 'r2', c: 'r1' },
  }),

  numeric({
    ...q(
      'u1-unit-07',
      'كان خزان تجريبي ممتلئًا بمقدار $\\frac{5}{6}$ من سعته. سُحب $\\frac{1}{4}$ من سعته ثم أُضيف إليه $\\frac{1}{3}$ من سعته. ما الكسر الذي يمثّل مستوى الخزان الآن؟',
      'intermediate', 'lesson-1', [ref('lesson-1', 'fraction-chain-context'), ref('lesson-4', 'applied-operations')],
      ['نكتب التغيرات بالترتيب: $\\frac{5}{6}-\\frac{1}{4}+\\frac{1}{3}$.', 'المقام المشترك $12$: $\\frac{10}{12}-\\frac{3}{12}+\\frac{4}{12}$.', 'الناتج $\\frac{11}{12}$.'],
      '$\\frac{11}{12}$ من السعة',
      'الكمية المسحوبة تُطرح، والمضافة تُجمع؛ ولأن كل مقدار من السعة نفسها يمكن جمع كسوره.',
    ),
    acceptedAnswers: ['11/12'],
    answerFormat: 'كسر عادي',
  }),

  errorAnalysis({
    ...q(
      'u1-unit-08',
      'كتب طالب $\\frac{2}{5}+\\frac{1}{3}=\\frac{4}{15}+\\frac{5}{15}=\\frac{3}{5}$. أين الخطأ؟',
      'advanced', 'lesson-1', [ref('lesson-1', 'equivalent-fraction-conversion')],
      ['المقام المشترك $15$ صحيح، لكن تحويل $\\frac{2}{5}$ غير صحيح: ضُرب مقامه في $3$ بينما ضُرب بسطه في $2$.', 'الصواب $\\frac{2}{5}=\\frac{6}{15}$.', 'إذن المجموع $\\frac{6}{15}+\\frac{5}{15}=\\frac{11}{15}$.'],
      'الخطأ في تكوين الكسر المكافئ؛ الناتج الصحيح $\\frac{11}{15}$.',
      'للحفاظ على قيمة الكسر، يجب ضرب البسط والمقام بالعامل نفسه.',
      '\\frac{2}{5}+\\frac{1}{3}',
    ),
    options: [
      { id: 'a', label: 'تحويل $\\frac{2}{5}$ خاطئ؛ الصواب $\\frac{6}{15}$، والمجموع $\\frac{11}{15}$.' },
      { id: 'b', label: 'الخطأ في جمع البسطين؛ الصواب $\\frac{7}{15}$.' },
      { id: 'c', label: 'المقام المشترك يجب أن يكون $8$.' },
      { id: 'd', label: 'الحل صحيح لأن $\\frac{4}{15}=\\frac{2}{5}$.' },
    ],
    correctOptionId: 'a',
  }),

  singleChoice({
    ...q(
      'u1-unit-09',
      'أي مقارنة دقيقة بين $\\frac{7}{12}$ و$\\frac{4}{7}$؟',
      'reasoning', 'lesson-1', [ref('lesson-1', 'common-denominator'), ref('lesson-4', 'exact-fraction-comparison')],
      ['المقام المشترك $84$: $\\frac{7}{12}=\\frac{49}{84}$ و$\\frac{4}{7}=\\frac{48}{84}$.', 'بما أن $49>48$، فإن $\\frac{7}{12}>\\frac{4}{7}$.'],
      '$\\frac{7}{12}>\\frac{4}{7}$',
      'التوحيد إلى مقام مشترك يتيح مقارنة البسطين دون الاعتماد على تقريب عشري.',
    ),
    options: [
      { id: 'a', label: '$\\frac{7}{12}<\\frac{4}{7}$' },
      { id: 'b', label: '$\\frac{7}{12}=\\frac{4}{7}$' },
      { id: 'c', label: '$\\frac{7}{12}>\\frac{4}{7}$' },
      { id: 'd', label: 'لا يمكن مقارنة الكسرين.' },
    ],
    correctOptionId: 'c',
  }),

  multiSelect({
    ...q(
      'u1-unit-10',
      'اختر كل تعبير يساوي $\\frac{1}{2}$.',
      'intermediate', 'lesson-1', [ref('lesson-1', 'equivalent-fractions'), ref('lesson-1', 'fraction-subtraction')],
      ['(أ) $\\frac{7}{12}-\\frac{1}{12}=\\frac{6}{12}=\\frac{1}{2}$.', '(ب) $\\frac{3}{4}-\\frac{1}{4}=\\frac{1}{2}$.', '(ج) $\\frac{2}{3}-\\frac{1}{6}=\\frac{4}{6}-\\frac{1}{6}=\\frac{1}{2}$.', '(د) $\\frac{5}{6}-\\frac{1}{4}=\\frac{10}{12}-\\frac{3}{12}=\\frac{7}{12}$.'],
      'التعابير الصحيحة هي (أ)، (ب)، (ج).',
      'قد تنتج القيمة نفسها من عمليات مختلفة؛ نتحقق من كل تعبير بحسابه لا بمظهره.',
    ),
    options: [
      { id: 'a', label: '(أ) $\\frac{7}{12}-\\frac{1}{12}$' },
      { id: 'b', label: '(ب) $\\frac{3}{4}-\\frac{1}{4}$' },
      { id: 'c', label: '(ج) $\\frac{2}{3}-\\frac{1}{6}$' },
      { id: 'd', label: '(د) $\\frac{5}{6}-\\frac{1}{4}$' },
    ],
    correctOptionIds: ['a', 'b', 'c'],
  }),

  numeric({
    ...q(
      'u1-unit-11',
      'أوجد $x$ إذا كان $\\frac{2}{3}+\\frac{3}{4}-x=\\frac{5}{6}$.',
      'advanced', 'lesson-1', [ref('lesson-1', 'unknown-subtrahend-in-fraction-chain'), ref('lesson-1', 'common-denominator')],
      ['نجمع الحدين المعروفين: $\\frac{2}{3}+\\frac{3}{4}=\\frac{8}{12}+\\frac{9}{12}=\\frac{17}{12}$.', 'تصبح المعادلة $\\frac{17}{12}-x=\\frac{5}{6}$، لذا $x=\\frac{17}{12}-\\frac{5}{6}$.', 'نوحّد المقام: $x=\\frac{17}{12}-\\frac{10}{12}=\\frac{7}{12}$.'],
      '$\\frac{7}{12}$',
      'لإيجاد المطروح نطرح الناتج من العدد الذي كان يُطرح منه، بعد حساب الجزء المعروف.',
    ),
    acceptedAnswers: ['7/12'],
    answerFormat: 'كسر عادي',
  }),

  errorAnalysis({
    ...q(
      'u1-unit-12',
      'حوّل طالب $-\\frac{3}{4}-\\frac{1}{2}$ إلى $-\\frac{3}{4}+\\frac{1}{2}=-\\frac{1}{4}$. ما التصويب؟',
      'advanced', 'lesson-1', [ref('lesson-1', 'signs-in-subtraction')],
      ['الحد الثاني موجب، وطرحه يعني إضافة مقابله السالب: $-\\frac{3}{4}-\\frac{1}{2}=-\\frac{3}{4}+(-\\frac{1}{2})$.', 'نوحّد المقام إلى $4$: $-\\frac{3}{4}-\\frac{2}{4}=-\\frac{5}{4}$.'],
      'الناتج الصحيح $-\\frac{5}{4}$؛ لا يتحول طرح عدد موجب إلى جمعه.',
      'الطالب غيّر إشارة العملية دون تغيير إشارة العدد؛ الطرح من عدد سالب يزيد القيمة المطلقة السالبة.',
      '-\\frac{3}{4}-\\frac{1}{2}',
    ),
    options: [
      { id: 'a', label: 'الصواب $-\\frac{5}{4}$؛ نجمع مقدارين سالبين.' },
      { id: 'b', label: 'الصواب $-\\frac{1}{4}$؛ طرح الموجب يصبح جمعًا موجبًا.' },
      { id: 'c', label: 'الصواب $\\frac{5}{4}$؛ سالب ناقص موجب موجب.' },
      { id: 'd', label: 'الصواب $-\\frac{1}{2}$؛ نحذف الكسر الأول.' },
    ],
    correctOptionId: 'a',
  }),

  singleChoice({
    ...q(
      'u1-unit-13',
      'قارورة تحتوي الآن على $\\frac{5}{12}$ لتر، والهدف أن تصبح نصف لتر. ما المقدار الذي يلزم إضافته؟',
      'reasoning', 'lesson-1', [ref('lesson-1', 'fraction-difference'), ref('lesson-4', 'quantity-comparison')],
      ['نكتب نصف لتر على مقام $12$: $\\frac{1}{2}=\\frac{6}{12}$.', 'الفرق هو $\\frac{6}{12}-\\frac{5}{12}=\\frac{1}{12}$.'],
      '$\\frac{1}{12}$ لتر',
      'نبحث عن الفرق بين الهدف والكمية الحالية، لا عن مجموعهما.',
    ),
    options: [
      { id: 'a', label: '$\\frac{1}{12}$ لتر' },
      { id: 'b', label: '$\\frac{11}{12}$ لتر' },
      { id: 'c', label: '$\\frac{5}{24}$ لتر' },
      { id: 'd', label: '$\\frac{1}{2}$ لتر' },
    ],
    correctOptionId: 'a',
  }),

  singleChoice({
    ...q(
      'u1-unit-14',
      'طُبّق على رسم هندسي عامل تصغير مقداره $\\frac{7}{15}$، ثم طُبّق عليه عامل تصغير ثانٍ مقداره $\\frac{5}{14}$. ما حاصل ضرب عاملي التصغير في أبسط صورة؟',
      'basic', 'lesson-2', [ref('lesson-2', 'fraction-product-and-cancellation'), ref('lesson-4', 'measurement-context')],
      ['نضرب: $\\frac{7}{15}\\times\\frac{5}{14}$.', 'نختصر $7$ مع $14$ إلى $1$ و$2$، و$5$ مع $15$ إلى $1$ و$3$.', 'الناتج $\\frac{1}{6}$.'],
      '$\\frac{1}{6}$',
      'اختيار عوامل الاختصار بين بسط ومقام يسهّل ضرب الكسور.',
      '\\frac{7}{15}\\times\\frac{5}{14}',
    ),
    options: [
      { id: 'a', label: '$\\frac{1}{6}$' },
      { id: 'b', label: '$\\frac{1}{3}$' },
      { id: 'c', label: '$\\frac{5}{6}$' },
      { id: 'd', label: '$\\frac{1}{2}$' },
    ],
    correctOptionId: 'a',
  }),

  numeric({
    ...q(
      'u1-unit-15',
      'تحتاج كل بطاقة إرشاد إلى $\\frac{3}{7}$ متر من الشريط. صُنعت $14$ بطاقة، ويمكن إعادة استخدام مترين من شريط قديم. كم مترًا من الشريط الجديد يلزم؟',
      'basic', 'lesson-2', [ref('lesson-2', 'integer-times-fraction-in-context'), ref('lesson-1', 'subtracting-reused-quantity')],
      ['نحسب الشريط اللازم لكل البطاقات: $14\\times\\frac{3}{7}=\\frac{42}{7}=6$ أمتار.', 'نطرح الشريط المعاد استخدامه: $6-2=4$ أمتار من الشريط الجديد.'],
      '$4$ أمتار',
      'نحسب الحاجة الكلية بالضرب أولًا، ثم نطرح المقدار المتوفر الذي سيُعاد استخدامه.',
    ),
    acceptedAnswers: ['4'],
    answerFormat: 'عدد صحيح من الأمتار',
  }),

  trueFalse({
    ...q(
      'u1-unit-16',
      'حاصل ضرب $\\frac{0}{7}$ في أي كسر عادي يساوي صفرًا.',
      'basic', 'lesson-2', [ref('lesson-2', 'zero-factor-property'), ref('lesson-3', 'zero-in-products-and-quotients')],
      ['$\\frac{0}{7}=0$.', 'ضرب الصفر بأي عدد عادي يعطي صفرًا.'],
      'العبارة صحيحة.',
      'إذا كان أحد عوامل الجداء صفرًا، فالجداء كله يساوي صفرًا.',
    ),
    correctAnswer: true,
  }),

  numeric({
    ...q(
      'u1-unit-17',
      'تُظهر شاشة آلة أن $\\frac{2}{3}$ من دفعة مجهولة يساوي $18$ وحدة. ما حجم الدفعة كاملة؟',
      'basic', 'lesson-2', [ref('lesson-2', 'inverse-of-fraction-of-quantity'), ref('lesson-4', 'applied-equation')],
      ['لنرمز إلى الدفعة الكاملة بـ$x$؛ لدينا $\\frac{2}{3}x=18$.', 'نضرب الطرفين في مقلوب $\\frac{2}{3}$، أي $\\frac{3}{2}$.', 'إذن $x=18\\times\\frac{3}{2}=27$ وحدة.'],
      '$27$ وحدة',
      'إذا عُرف جزء كسري من كمية، نسترجع الكمية الكاملة بالقسمة على ذلك الكسر.',
    ),
    acceptedAnswers: ['27'],
    answerFormat: 'عدد صحيح',
  }),

  multiSelect({
    ...q(
      'u1-unit-18',
      'اختر كل كتابة مكافئة للجداء $-\\frac{2}{5}\\times\\frac{15x}{4}$.',
      'intermediate', 'lesson-2', [ref('lesson-2', 'fraction-times-literal-expression'), ref('lesson-1', 'equivalent-fraction-forms')],
      ['نضرب المعاملين: $-\\frac{2\\times15}{5\\times4}x=-\\frac{30}{20}x$.', 'نختصر $\\frac{30}{20}=\\frac{3}{2}$، فتكون الصورة $-\\frac{3}{2}x$.', 'وهذه تساوي أيضًا $-1.5x$ و$-\\frac{6}{4}x$.'],
      'الصيغ الصحيحة: $-\\frac{3}{2}x$، $-1.5x$، و$-\\frac{6}{4}x$.',
      'نضرب المعاملات ونحتفظ بالمتغير، ثم نختار أي صورة عددية مكافئة للمعامل.',
      '-\\frac{2}{5}\\times\\frac{15x}{4}',
    ),
    options: [
      { id: 'a', label: '$-\\frac{3}{2}x$' },
      { id: 'b', label: '$-1.5x$' },
      { id: 'c', label: '$\\frac{3}{2}x$' },
      { id: 'd', label: '$-\\frac{6}{4}x$' },
    ],
    correctOptionIds: ['a', 'b', 'd'],
  }),

  ordering({
    ...q(
      'u1-unit-19',
      'رتّب خطوات تبسيط $(-\\frac{3}{4}\\times\\frac{8}{9})+\\frac{1}{3}$.',
      'intermediate', 'lesson-2', [ref('lesson-2', 'fraction-product'), ref('lesson-1', 'fraction-addition')],
      ['نحسب الجداء: $-\\frac{3}{4}\\times\\frac{8}{9}=-\\frac{2}{3}$.', 'نكتب الجمع: $-\\frac{2}{3}+\\frac{1}{3}$.', 'نجمع البسطين: $-\\frac{1}{3}$.'],
      '$-\\frac{1}{3}$',
      'ترتيب العمليات يقتضي إجراء الضرب أولًا، ثم جمع الكسرين.',
      '(-\\frac{3}{4}\\times\\frac{8}{9})+\\frac{1}{3}',
    ),
    items: [
      { id: 'sum', label: 'جمع الكسرين: $-\\frac{2}{3}+\\frac{1}{3}=-\\frac{1}{3}$.' },
      { id: 'product', label: 'حساب الجداء: $-\\frac{3}{4}\\times\\frac{8}{9}=-\\frac{2}{3}$.' },
      { id: 'rewrite', label: 'استبدال الجداء المحسوب في التعبير قبل الجمع.' },
    ],
    correctOrder: ['product', 'rewrite', 'sum'],
  }),

  matching({
    ...q(
      'u1-unit-20',
      'طابق كل تعبير جبري مع صورته المبسطة بعد النشر وجمع الحدود المتشابهة.',
      'intermediate', 'lesson-2', [ref('lesson-2', 'distribution-and-like-terms')],
      ['(أ) $4(3y-2)+5y=12y-8+5y=17y-8$.', '(ب) $-2(a+4)+a=-2a-8+a=-a-8$.', '(ج) $3m-2(m-5)=3m-2m+10=m+10$.'],
      'أ ↔ $17y-8$، ب ↔ $-a-8$، ج ↔ $m+10$.',
      'ننشر العامل أولًا ثم نجمع الحدود المتشابهة مع المحافظة على الإشارات.',
    ),
    leftItems: [
      { id: 'a', label: 'أ: $4(3y-2)+5y$' },
      { id: 'b', label: 'ب: $-2(a+4)+a$' },
      { id: 'c', label: 'ج: $3m-2(m-5)$' },
    ],
    rightItems: [
      { id: 'r1', label: '$m+10$' },
      { id: 'r2', label: '$17y-8$' },
      { id: 'r3', label: '$-a-8$' },
    ],
    correctPairs: { a: 'r2', b: 'r3', c: 'r1' },
  }),
];
