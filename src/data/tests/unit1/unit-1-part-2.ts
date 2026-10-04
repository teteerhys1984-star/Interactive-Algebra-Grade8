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

export const unit1QuestionsPart2: TestQuestion[] = [
  singleChoice({
    ...q(
      'u1-unit-21',
      'أي تعبير مبسّط يكافئ $-\\frac{3}{4}(8x-12)$؟',
      'intermediate', 'lesson-2', [ref('lesson-2', 'distribution-with-negative-factor')],
      ['نوزّع $-\\frac{3}{4}$ على الحدّين: $-\\frac{3}{4}(8x)+(-\\frac{3}{4})(-12)$.', 'نحسب المعاملين: $-6x+9$.'],
      '$-6x+9$',
      'عند توزيع عامل سالب على مجموع، تتأثر إشارة كل حدّ على حدة.',
      '-\\frac{3}{4}(8x-12)',
    ),
    options: [
      { id: 'a', label: '$-6x+9$' },
      { id: 'b', label: '$-6x-9$' },
      { id: 'c', label: '$6x+9$' },
      { id: 'd', label: '$-\\frac{3}{4}(8x)-12$' },
    ],
    correctOptionId: 'a',
  }),

  errorAnalysis({
    ...q(
      'u1-unit-22',
      'ادّعى طالب أن $-6y+9=-3(2y+3)$. حدّد التصحيح الذي يبيّن موضع الخطأ.',
      'intermediate', 'lesson-2', [ref('lesson-2', 'factoring-negative-common-factor')],
      ['نختبر التوزيع في الطرف المقترح: $-3(2y+3)=-6y-9$، وليس $-6y+9$.', 'للحصول على $+9$ نحتاج إلى الحد $-3$ داخل القوس: $-3(2y-3)=-6y+9$.'],
      'الصيغة الصحيحة هي $-6y+9=-3(2y-3)$.',
      'عند إخراج عامل مشترك سالب، يجب أن تتوافق إشارتا الحدّين بعد إعادة التوزيع.',
    ),
    options: [
      { id: 'a', label: 'الصواب $-3(2y-3)$؛ فالتوزيع يعطي $-6y+9$.' },
      { id: 'b', label: 'المساواة صحيحة لأن $-3$ عامل مشترك موجب.' },
      { id: 'c', label: 'الصواب $3(2y+3)$.' },
      { id: 'd', label: 'لا يمكن تحليل $-6y+9$ إلى عاملين.' },
    ],
    correctOptionId: 'a',
  }),

  numeric({
    ...q(
      'u1-unit-23',
      'احسب بدقة: $\\left(-\\frac{2}{3}\\times\\frac{9}{10}\\right)\\div\\frac{3}{5}$.',
      'advanced', 'lesson-2', [ref('lesson-2', 'fraction-product'), ref('lesson-3', 'division-by-fraction')],
      ['نحسب الجداء داخل القوس: $-\\frac{2}{3}\\times\\frac{9}{10}=-\\frac{18}{30}=-\\frac{3}{5}$.', 'القسمة على $\\frac{3}{5}$ تعني الضرب بمقلوبه: $-\\frac{3}{5}\\times\\frac{5}{3}$.', 'الناتج $-1$.'],
      '$-1$',
      'ننجز ما داخل القوس أولًا، ثم نحوّل القسمة على كسر إلى ضرب بمقلوبه.',
      '(-\\frac{2}{3}\\times\\frac{9}{10})\\div\\frac{3}{5}',
    ),
    acceptedAnswers: ['-1'],
    answerFormat: 'عدد صحيح',
  }),

  errorAnalysis({
    ...q(
      'u1-unit-24',
      'بسّط طالب $3(x-2)-2(x+1)$ فكتب $3x-6-2x+2=x-4$. ما التصويب الصحيح؟',
      'advanced', 'lesson-2', [ref('lesson-2', 'distribution-and-signs'), ref('lesson-2', 'collecting-like-terms')],
      ['التوزيع الأول صحيح: $3(x-2)=3x-6$.', 'في التوزيع الثاني يجب أن يكون $-2(x+1)=-2x-2$، لأن $-2$ يضرب الحدّين.', 'نجمع: $3x-2x-6-2=x-8$.'],
      'الناتج الصحيح $x-8$.',
      'الخطأ هو تغيير إشارة الحد الثابت أثناء توزيع العامل السالب.',
      '3(x-2)-2(x+1)',
    ),
    options: [
      { id: 'a', label: '$x-8$؛ لأن $-2(x+1)=-2x-2$.' },
      { id: 'b', label: '$x-4$؛ الحل المعروض صحيح.' },
      { id: 'c', label: '$5x-8$؛ نجمع معاملي $x$.' },
      { id: 'd', label: '$x+8$؛ نغيّر إشارة الثابتين.' },
    ],
    correctOptionId: 'a',
  }),

  ordering({
    ...q(
      'u1-unit-25',
      'رتّب خطوات تبسيط $\\left(\\frac{3}{4}x-\\frac{1}{2}x\\right)\\times(-8)$.',
      'advanced', 'lesson-2', [ref('lesson-2', 'fraction-times-literal-expression'), ref('lesson-1', 'subtracting-fraction-coefficients')],
      ['نوحّد معاملي $x$ إلى مقام $4$: $\\frac{3}{4}x-\\frac{2}{4}x$.', 'نطرح المعاملين: $\\frac{1}{4}x$.', 'نضرب في $-8$: $-8\\times\\frac{1}{4}x=-2x$.'],
      '$-2x$',
      'نجمع حدود المتغير بطرح المعاملين أولًا، ثم ننفّذ الضرب الخارجي.',
      '(\\frac{3}{4}x-\\frac{1}{2}x)\\times(-8)',
    ),
    items: [
      { id: 'multiply', label: 'ضرب الناتج في $-8$: $-8\\times\\frac{1}{4}x=-2x$.' },
      { id: 'common', label: 'توحيد المقام: $\\frac{3}{4}x-\\frac{2}{4}x$.' },
      { id: 'subtract', label: 'طرح المعاملين والإبقاء على $x$: $\\frac{1}{4}x$.' },
    ],
    correctOrder: ['common', 'subtract', 'multiply'],
  }),

  singleChoice({
    ...q(
      'u1-unit-26',
      'يريد طالب التحقق مما إذا كان $5(u-2)+3u$ يساوي $8u-10$ لكل قيمة لـ$u$. أي طريقة تبرّر الحكم العام؟',
      'reasoning', 'lesson-2', [ref('lesson-2', 'equivalent-algebraic-expressions'), ref('lesson-2', 'distribution-and-like-terms')],
      ['نوزّع ونجمّع: $5(u-2)+3u=5u-10+3u=8u-10$.', 'وصلنا إلى التعبير نفسه من دون اختيار قيمة خاصة لـ$u$.'],
      'الطريقة الكافية هي النشر ثم جمع الحدود المتشابهة؛ والمساواة صحيحة لكل $u$.',
      'التعويض بقيمة واحدة يختبر حالة واحدة فقط، أما التبسيط الرمزي فيثبت التكافؤ العام.',
    ),
    options: [
      { id: 'a', label: 'نشر الطرف الأيسر وجمع الحدود المتشابهة؛ فينتج $8u-10$.' },
      { id: 'b', label: 'التعويض بـ$u=0$ وحده يثبت المساواة لكل القيم.' },
      { id: 'c', label: 'حذف الأقواس دون ضرب $5$ في $-2$.' },
      { id: 'd', label: 'تغيير إشارة $-10$ إلى $+10$.' },
    ],
    correctOptionId: 'a',
  }),

  multiSelect({
    ...q(
      'u1-unit-27',
      'اختر كل تعبير يكافئ $-2(3a-4)+a$.',
      'reasoning', 'lesson-2', [ref('lesson-2', 'distribution-and-like-terms'), ref('lesson-2', 'equivalent-expressions')],
      ['نوزّع: $-2(3a-4)+a=-6a+8+a$.', 'نجمع الحدود المتشابهة: $-5a+8$.', 'وبإعادة ترتيب أو إخراج السالب نحصل على $8-5a$ و$-(5a-8)$.'],
      'الصيغ الصحيحة هي $-5a+8$ و$8-5a$ و$-(5a-8)$.',
      'تغيير ترتيب الجمع أو إخراج عامل $-1$ لا يغيّر قيمة التعبير.',
    ),
    options: [
      { id: 'a', label: '$-5a+8$' },
      { id: 'b', label: '$8-5a$' },
      { id: 'c', label: '$-(5a-8)$' },
      { id: 'd', label: '$-5a-8$' },
    ],
    correctOptionIds: ['a', 'b', 'c'],
  }),

  singleChoice({
    ...q(
      'u1-unit-28',
      'العدد العشري $0.4$ يساوي $\\frac{2}{5}$. ما مقلوبه؟',
      'basic', 'lesson-3', [ref('lesson-3', 'reciprocal-of-decimal-fraction')],
      ['نكتب $0.4=\\frac{4}{10}=\\frac{2}{5}$.', 'المقلوب يبدّل البسط والمقام، فيكون $\\frac{5}{2}$.'],
      '$\\frac{5}{2}$',
      'نحوّل العدد العشري إلى كسر مبسّط ثم نبدّل البسط والمقام لإيجاد المقلوب.',
    ),
    options: [
      { id: 'a', label: '$\\frac{2}{5}$' },
      { id: 'b', label: '$\\frac{5}{2}$' },
      { id: 'c', label: '$-\\frac{5}{2}$' },
      { id: 'd', label: '$\\frac{4}{5}$' },
    ],
    correctOptionId: 'b',
  }),

  numeric({
    ...q(
      'u1-unit-29',
      'احسب بدقة $1.2\\div0.3$.',
      'basic', 'lesson-3', [ref('lesson-3', 'decimal-division'), ref('lesson-1', 'exact-rational-calculation')],
      ['نحوّل العددين العشريين إلى أعشار: $1.2=\\frac{12}{10}$ و$0.3=\\frac{3}{10}$.', 'نقسم: $\\frac{12}{10}\\div\\frac{3}{10}=\\frac{12}{10}\\times\\frac{10}{3}=4$.'],
      '$4$',
      'يمكن قسمة عددين عشريين بتحويلهما إلى كسور دقيقة ثم الضرب في مقلوب المقسوم عليه.',
    ),
    acceptedAnswers: ['4'],
    answerFormat: 'عدد صحيح',
  }),

  trueFalse({
    ...q(
      'u1-unit-30',
      'إذا كان $b\\ne0$ و$\\frac{a}{b}=c$، فإن $a=b\\times c$.',
      'basic', 'lesson-3', [ref('lesson-3', 'division-as-inverse-of-multiplication')],
      ['المساواة $\\frac{a}{b}=c$ تعني أن $a$ مقسومًا على $b$ يساوي $c$.', 'نضرب الطرفين في $b$ غير الصفري فنحصل على $a=bc$.'],
      'العبارة صحيحة.',
      'القسمة والضرب عمليتان عكسيتان؛ نتحقق من خارج القسمة بإعادة الضرب في المقسوم عليه.',
    ),
    correctAnswer: true,
  }),

  numeric({
    ...q(
      'u1-unit-31',
      'احسب $\\frac{5}{8}\\div5$ بأبسط صورة.',
      'basic', 'lesson-3', [ref('lesson-3', 'division-by-integer')],
      ['نحوّل القسمة على $5$ إلى ضرب بمقلوبه: $\\frac{5}{8}\\times\\frac{1}{5}$.', 'نختصر العامل $5$، فيبقى $\\frac{1}{8}$.'],
      '$\\frac{1}{8}$',
      'القسمة على عدد صحيح غير صفري تعني الضرب في مقلوبه.',
    ),
    acceptedAnswers: ['1/8'],
    answerFormat: 'كسر عادي',
  }),

  multiSelect({
    ...q(
      'u1-unit-32',
      'اختر كل خارج قسمة يساوي $\\frac{3}{2}$.',
      'intermediate', 'lesson-3', [ref('lesson-3', 'equivalent-quotients'), ref('lesson-1', 'equivalent-fractions')],
      ['في (أ): $\\frac{3}{4}\\div\\frac{1}{2}=\\frac{3}{4}\\times2=\\frac{3}{2}$.', 'في (ب) الإشارتان سالبتان، والنسبة نفسها: $(-\\frac{3}{4})\\div(-\\frac{1}{2})=\\frac{3}{2}$.', 'في (ج): $\\frac{3}{5}\\div\\frac{2}{5}=\\frac{3}{2}$.', 'أما (د) فيساوي $3$ لا $\\frac{3}{2}$.'],
      'الاختيارات الصحيحة هي (أ)، (ب)، (ج).',
      'قد تنتج القيمة نفسها من كسور مختلفة؛ نتحقق من كل خارج بتحويل القسمة إلى ضرب بالمقلوب.',
    ),
    options: [
      { id: 'a', label: '$\\frac{3}{4}\\div\\frac{1}{2}$' },
      { id: 'b', label: '$(-\\frac{3}{4})\\div(-\\frac{1}{2})$' },
      { id: 'c', label: '$\\frac{3}{5}\\div\\frac{2}{5}$' },
      { id: 'd', label: '$\\frac{3}{2}\\div\\frac{1}{2}$' },
    ],
    correctOptionIds: ['a', 'b', 'c'],
  }),

  numeric({
    ...q(
      'u1-unit-33',
      'احسب بدقة: $\\frac{3}{4}\\div0.5-20\\%$.',
      'intermediate', 'lesson-3', [ref('lesson-3', 'division-before-subtraction'), ref('lesson-4', 'percent-to-fraction-conversion'), ref('lesson-1', 'fraction-subtraction')],
      ['ننجز القسمة أولًا: $\\frac{3}{4}\\div0.5=\\frac{3}{4}\\div\\frac{1}{2}=\\frac{3}{2}$.', 'نحوّل $20\\%$ إلى $\\frac{1}{5}$.', 'نطرح: $\\frac{3}{2}-\\frac{1}{5}=\\frac{15}{10}-\\frac{2}{10}=\\frac{13}{10}$.'],
      '$\\frac{13}{10}$',
      'ننفّذ القسمة قبل الطرح، ثم نمثّل العدد العشري والنسبة المئوية بكسور دقيقة.',
    ),
    acceptedAnswers: ['13/10'],
    answerFormat: 'كسر عادي أو عدد عشري مكافئ',
  }),

  matching({
    ...q(
      'u1-unit-34',
      'طابق كل وصف مع النموذج الرياضي الذي يمثّله.',
      'intermediate', 'lesson-3', [ref('lesson-3', 'division-modeling'), ref('lesson-2', 'fraction-of-quantity'), ref('lesson-4', 'remainder-context')],
      ['(أ) عدد المقاطع بطول $0.15$ متر في شريط طوله $x$ متر: $x\\div0.15$.', '(ب) أخذ $35\\%$ من طول مقداره $x$: $0.35x$.', '(ج) نطرح قطعة طولها $\\frac{1}{4}$ متر من شريط طوله $x$ متر، ثم نأخذ نصف الباقي: $\\frac{1}{2}(x-\\frac{1}{4})$.'],
      'أ ↔ النموذج ر2، ب ↔ ر3، ج ↔ ر1.',
      'نحوّل كلمات «كم مجموعة؟» إلى قسمة، وكلمة «من» إلى ضرب، ونحسب الجزء الباقي قبل أخذ نصفه.',
    ),
    leftItems: [
      { id: 'a', label: 'أ: كم مقطعًا بطول $0.15$ متر في شريط طوله $x$ متر؟' },
      { id: 'b', label: 'ب: $35\\%$ من طول مقداره $x$.' },
      { id: 'c', label: 'ج: نصف الباقي بعد إزالة قطعة طولها $\\frac{1}{4}$ متر من شريط طوله $x$ متر.' },
    ],
    rightItems: [
      { id: 'r1', label: '$\\frac{1}{2}(x-\\frac{1}{4})$' },
      { id: 'r2', label: '$x\\div0.15$' },
      { id: 'r3', label: '$0.35x$' },
    ],
    correctPairs: { a: 'r2', b: 'r3', c: 'r1' },
  }),

  errorAnalysis({
    ...q(
      'u1-unit-35',
      'لإيجاد $\\frac{1}{\\left(\\frac{1}{4}+\\frac{1}{2}\\right)}$ كتب طالب $\\frac{1}{\\frac{1}{4}}+\\frac{1}{\\frac{1}{2}}=4+2=6$. ما الخطأ؟',
      'intermediate', 'lesson-3', [ref('lesson-3', 'complex-fraction-and-order-of-operations')],
      ['يجب حساب المقام كاملًا أولًا: $\\frac{1}{4}+\\frac{1}{2}=\\frac{3}{4}$.', 'بعدها نقسم: $1\\div\\frac{3}{4}=1\\times\\frac{4}{3}=\\frac{4}{3}$.', 'لا يجوز توزيع المقلوب على جمع المقام.'],
      'الناتج الصحيح $\\frac{4}{3}$؛ لا يساوي $6$.',
      'القسمة على مجموع تُجرى بعد حساب المجموع، ولا تتوزع على حدّيه.',
    ),
    options: [
      { id: 'a', label: 'حُسب مقلوب كل حد قبل جمعهما؛ الصواب جمع المقام أولًا ثم أخذ مقلوبه، والناتج $\\frac{4}{3}$.' },
      { id: 'b', label: 'الحل صحيح لأن مقلوب المجموع يساوي مجموع المقلوبين.' },
      { id: 'c', label: 'يجب طرح الحدين، والناتج $4$.' },
      { id: 'd', label: 'المقام يساوي $\\frac{1}{8}$، والناتج $8$.' },
    ],
    correctOptionId: 'a',
  }),

  numeric({
    ...q(
      'u1-unit-36',
      'احسب $(-\\frac{3}{4})\\div150\\%$ بأبسط صورة.',
      'intermediate', 'lesson-3', [ref('lesson-3', 'signed-fraction-division'), ref('lesson-4', 'percent-as-divisor')],
      ['نحوّل $150\\%$ إلى $\\frac{3}{2}$.', 'نضرب بمقلوبه: $-\\frac{3}{4}\\times\\frac{2}{3}$.', 'نختصر فنحصل على $-\\frac{1}{2}$.'],
      '$-\\frac{1}{2}$',
      'نسبة مئوية أكبر من $100\\%$ قد تكون مقسومًا عليه؛ نحوّلها إلى كسر قبل تطبيق قاعدة القسمة.',
    ),
    acceptedAnswers: ['-1/2'],
    answerFormat: 'كسر عادي',
  }),

  ordering({
    ...q(
      'u1-unit-37',
      'رتّب خطوات حساب $\\frac{5}{6}\\div\\frac{1}{3}\\times\\frac{2}{5}$ وفق ترتيب العمليات.',
      'advanced', 'lesson-3', [ref('lesson-3', 'left-to-right-division-and-multiplication'), ref('lesson-2', 'fraction-product')],
      ['للقسمة والضرب الأولوية نفسها، فنبدأ من اليسار: $\\frac{5}{6}\\div\\frac{1}{3}=\\frac{5}{6}\\times3=\\frac{5}{2}$.', 'نضرب الناتج في العامل الأخير: $\\frac{5}{2}\\times\\frac{2}{5}$.', 'نختصر فنحصل على $1$.'],
      '$1$',
      'القسمة والضرب متساويان في الأولوية؛ عند تتابعهما بلا أقواس نحسب من اليسار إلى اليمين.',
      '\\frac{5}{6}\\div\\frac{1}{3}\\times\\frac{2}{5}',
    ),
    items: [
      { id: 'finish', label: 'الاختصار لإيجاد الناتج النهائي $1$.' },
      { id: 'first', label: 'البدء من اليسار: $\\frac{5}{6}\\div\\frac{1}{3}=\\frac{5}{2}$.' },
      { id: 'last', label: 'ضرب الناتج بالعامل الأخير: $\\frac{5}{2}\\times\\frac{2}{5}$.' },
    ],
    correctOrder: ['first', 'last', 'finish'],
  }),

  errorAnalysis({
    ...q(
      'u1-unit-38',
      'قال طالب إن $\\frac{7}{12}\\div\\frac{7}{12}=\\frac{7}{12}$ لأن «قسمة العدد على نفسه لا تغيّره». ما التصحيح؟',
      'advanced', 'lesson-3', [ref('lesson-3', 'quotient-of-equal-nonzero-numbers'), ref('lesson-1', 'equivalent-fractions')],
      ['القسمة على العدد نفسه غير الصفري تعطي $1$، لا العدد نفسه.', 'بالضرب في المقلوب: $\\frac{7}{12}\\div\\frac{7}{12}=\\frac{7}{12}\\times\\frac{12}{7}=1$.', 'الخاصية التي لا تغيّر العدد هي القسمة على $1$، لا القسمة على العدد نفسه.'],
      'الناتج الصحيح $1$.',
      'يجب التمييز بين قسمة عدد على واحد، وقسمة عدد على نفسه.',
    ),
    options: [
      { id: 'a', label: 'الناتج $1$؛ فكل عدد غير صفري مقسوم على نفسه يساوي واحدًا.' },
      { id: 'b', label: 'الناتج $\\frac{7}{12}$؛ القسمة على العدد نفسه لا تغيّره.' },
      { id: 'c', label: 'الناتج $0$؛ طرح العدد من نفسه.' },
      { id: 'd', label: 'الناتج $\\frac{49}{144}$؛ نضرب الكسرين.' },
    ],
    correctOptionId: 'a',
  }),

  singleChoice({
    ...q(
      'u1-unit-39',
      'إذا كان $q=\\frac{2}{3}\\div40\\%$، فما مقلوب $q$؟',
      'advanced', 'lesson-3', [ref('lesson-3', 'reciprocal-of-quotient'), ref('lesson-4', 'percent-as-fraction')],
      ['$40\\%=\\frac{2}{5}$.', 'إذن $q=\\frac{2}{3}\\div\\frac{2}{5}=\\frac{2}{3}\\times\\frac{5}{2}=\\frac{5}{3}$.', 'مقلوب $q$ هو $\\frac{3}{5}$.'],
      'مقلوب $q$ هو $\\frac{3}{5}$.',
      'نحسب الخارج بدقة أولًا، ثم نبدّل بسطه ومقامه لإيجاد مقلوبه.',
    ),
    options: [
      { id: 'a', label: '$\\frac{5}{3}$' },
      { id: 'b', label: '$\\frac{3}{5}$' },
      { id: 'c', label: '$\\frac{2}{5}$' },
      { id: 'd', label: '$\\frac{5}{2}$' },
    ],
    correctOptionId: 'b',
  }),

  trueFalse({
    ...q(
      'u1-unit-40',
      'إذا كانت $b,c,d$ غير صفرية، فإن $\\left(\\frac{a}{b}\\right)\\div\\left(\\frac{c}{d}\\right)=\\left(\\frac{a}{b}\\right)\\times\\left(\\frac{d}{c}\\right)$.',
      'reasoning', 'lesson-3', [ref('lesson-3', 'general-division-rule')],
      ['مقلوب المقسوم عليه $\\frac{c}{d}$ هو $\\frac{d}{c}$.', 'نحوّل القسمة إلى ضرب: $\\frac{a}{b}\\times\\frac{d}{c}$.'],
      'العبارة صحيحة ما دام المقسوم عليه غير صفري.',
      'قاعدة القسمة على كسر هي الضرب في مقلوبه؛ ويلزم أن يكون مقام كل كسر ومقسوم عليه غير صفر.',
    ),
    correctAnswer: true,
  }),

  numeric({
    ...q(
      'u1-unit-41',
      'أوجد $x$ إذا كان $\\frac{7}{10}\\div x=\\frac{14}{15}$.',
      'reasoning', 'lesson-3', [ref('lesson-3', 'unknown-divisor'), ref('lesson-1', 'equivalent-fractions')],
      ['من $a\\div x=b$ نحصل على $x=a\\div b$، لذا $x=\\frac{7}{10}\\div\\frac{14}{15}$.', 'نضرب بالمقلوب: $\\frac{7}{10}\\times\\frac{15}{14}$.', 'بالاختصار $x=\\frac{3}{4}$. والتحقق: $\\frac{7}{10}\\div\\frac{3}{4}=\\frac{14}{15}$.'],
      '$\\frac{3}{4}$',
      'نبحث عن المقسوم عليه بقسمة المقسوم على خارج القسمة، ثم نتحقق بالتعويض.',
    ),
    acceptedAnswers: ['3/4'],
    answerFormat: 'كسر عادي',
  }),

  multiSelect({
    ...q(
      'u1-unit-42',
      'إذا كان $b\\ne0$ و$c\\ne0$، فاختر كل صيغة مكافئة لـ$\\frac{a}{b}\\div c$.',
      'reasoning', 'lesson-3', [ref('lesson-3', 'division-by-integer-equivalence'), ref('lesson-2', 'fraction-multiplication')],
      ['القسمة على $c$ تكافئ الضرب في $\\frac{1}{c}$.', 'إذن $\\frac{a}{b}\\div c=\\frac{a}{b}\\times\\frac{1}{c}$.', 'وبضرب المقام في $c$ نحصل أيضًا على $\\frac{a}{bc}$.'],
      'الصيغتان الصحيحتان هما $\\frac{a}{b}\\times\\frac{1}{c}$ و$\\frac{a}{bc}$.',
      'لأن $c$ غير صفري، يمكن تمثيل القسمة عليه بالضرب في مقلوبه أو بضمّه إلى مقام الكسر.',
    ),
    options: [
      { id: 'a', label: '$\\frac{a}{b}\\times\\frac{1}{c}$' },
      { id: 'b', label: '$\\frac{a}{bc}$' },
      { id: 'c', label: '$\\frac{a}{b}\\times c$' },
      { id: 'd', label: '$\\frac{a}{b/c}$' },
    ],
    correctOptionIds: ['a', 'b'],
  }),
];
