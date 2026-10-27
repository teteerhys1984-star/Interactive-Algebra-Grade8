import type { IndependentTest } from './types';

/**
 * الاختبار الأول — نسخة منقولة من ورقة الاختبار المطبوعة (صورتان: صفحة الأسئلة
 * الجبرية وصفحة المسألتين).
 *
 * ما نُقل: نصوص الأسئلة والأعداد والكسور والأسس والرموز والمعطيات والخيارات
 * والدرجات، والرسم الهندسي للمسألة الثانية.
 * ما لم يُنقل: اسم الأستاذ وأرقام التواصل واسم المدرسة والشعار والترويسة
 * والتذييل وعبارات «يتبع» و«انتهت الأسئلة» والزخارف والإطارات.
 */
export const firstIndependentTest: IndependentTest = {
  id: 'independent-test-1',
  title: 'الاختبار الأول',
  subtitle: 'جبر + هندسة — الصف الثامن الأساسي',
  description:
    'اختبار يجمع بين الجبر (الأعداد والقوى والكسور والعبارات الجبرية والمعادلات) والهندسة (التطابق والانسحاب والتناظر المركزي والمساحات).',
  sections: [
    {
      id: 'section-1',
      heading: 'أولاً',
      title: 'أجب عن السؤالين الأولين',
      pointsLabel: '12 درجة لكل سؤال',
      blocks: [
        {
          id: 'question-1',
          heading: 'السؤال الأول',
          instruction:
            'في ما يلي هناك إجابة صحيحة واحدة فقط من ثلاثة إجابات مقترحة، انقلها إلى ورقة إجابتك.',
          items: [
            {
              id: 'q1-1',
              number: '١',
              kind: 'choice',
              prompt: 'العدد $(0.01)^{-1}$ يساوي:',
              choices: [
                { id: 'a', label: '$10^{2}$' },
                { id: 'b', label: '$10^{-2}$' },
                { id: 'c', label: '$10$' },
              ],
            },
            {
              id: 'q1-2',
              number: '٢',
              kind: 'choice',
              prompt: 'سدس العدد $\\dfrac{18}{5}$ يساوي:',
              choices: [
                { id: 'a', label: '$0.9$' },
                { id: 'b', label: '$2.4$' },
                { id: 'c', label: '$0.6$' },
              ],
            },
            {
              id: 'q1-3',
              number: '٣',
              kind: 'choice',
              prompt:
                'الدائرة $C$ مركزها $O$ قطرها $6\\,\\text{cm}$ و $C\'$ دائرة مركزها $O\'$ وهي صورة الدائرة $C$ وفق الانسحاب، فإن مساحة الدائرة $C\'$ هي:',
              choices: [
                { id: 'a', label: '$36\\pi\\,\\text{cm}^{2}$' },
                { id: 'b', label: '$9\\pi\\,\\text{cm}^{2}$' },
                { id: 'c', label: '$12\\pi\\,\\text{cm}^{2}$' },
              ],
            },
            {
              id: 'q1-4',
              number: '٤',
              kind: 'choice',
              prompt: 'يُكتب العدد $67 \\times 10^{4}$ بالصيغة $b \\times 10^{7}$ كما يلي:',
              choices: [
                { id: 'a', label: '$0.067 \\times 10^{7}$' },
                { id: 'b', label: '$0.67 \\times 10^{7}$' },
                { id: 'c', label: '$0.0067 \\times 10^{7}$' },
              ],
            },
          ],
        },
        {
          id: 'question-2',
          heading: 'السؤال الثاني',
          instruction: 'ضع كلمة (صح) أو (خطأ) أمام كل عبارة مما يلي:',
          items: [
            {
              id: 'q2-1',
              number: '١',
              kind: 'true-false',
              prompt: 'نظير مقلوب العدد $\\dfrac{15}{21}$ هو $-\\dfrac{5}{7}$.',
            },
            {
              id: 'q2-2',
              number: '٢',
              kind: 'true-false',
              prompt:
                'إذا كانت $B$ صورة $A$ وفق الانسحاب الذي ينقل $C$ إلى $A$ فإن $B$ نظيرة $C$ بالنسبة إلى $A$.',
            },
            {
              id: 'q2-3',
              number: '٣',
              kind: 'true-false',
              prompt:
                'إذا كان $x = \\dfrac{4}{7}$ و $y = -\\dfrac{7}{4}$ فإن $2 - xy = 3$.',
            },
            {
              id: 'q2-4',
              number: '٤',
              kind: 'true-false',
              prompt: 'صورتا مستقيمين متقاطعين هما مستقيمان متعامدان.',
            },
          ],
        },
      ],
    },
    {
      id: 'section-2',
      heading: 'ثانياً',
      title: 'أجب عن التمارين الثلاثة الآتية',
      pointsLabel: '46 درجة',
      blocks: [
        {
          id: 'exercise-1',
          heading: 'التمرين الأول',
          instruction:
            'أنجز العمليات الحسابية الآتية موضحاً خطوات الحل بالتفصيل واختزل الناتج إن أمكن:',
          items: [
            {
              id: 'ex1-1',
              number: '١',
              kind: 'free',
              math: '1 - \\dfrac{-5 - \\dfrac{13}{4}}{2 + \\dfrac{7}{2}}',
            },
            {
              id: 'ex1-2',
              number: '٢',
              kind: 'free',
              math: '\\left(-6 + \\dfrac{8}{3}\\right)\\left(6 - \\dfrac{3}{4}\\right)',
            },
          ],
        },
        {
          id: 'exercise-2',
          heading: 'التمرين الثاني',
          items: [
            {
              id: 'ex2-1',
              kind: 'free',
              prompt: 'لدينا العدد:',
              math: 'A = \\dfrac{35 \\times 10^{5} \\times 25 \\times 10^{0}}{10^{-3} \\times 0.07 \\times 10^{7}}',
              note: 'المطلوب: جد ناتج العدد $A$ ثم اكتبه بالصيغة المعيارية.',
            },
          ],
        },
        {
          id: 'exercise-3',
          heading: 'التمرين الثالث',
          items: [
            {
              id: 'ex3-1',
              kind: 'free',
              prompt: 'لتكن لدينا العبارة الجبرية:',
              math: 'A = \\dfrac{3}{4}\\left(\\dfrac{16}{9}x - \\dfrac{8}{3}\\right)',
              partsLabel: 'والمطلوب:',
              parts: [
                {
                  id: 'ex3-1-a',
                  number: '١',
                  prompt: 'انشر العبارة $A$ واختزلها.',
                },
                {
                  id: 'ex3-1-b',
                  number: '٢',
                  prompt: 'استنتج حل المعادلة $A = 0$ ثم حل المعادلة $A = \\dfrac{5}{3}x$.',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'section-3',
      heading: 'ثالثاً',
      title: 'حل المسألتين الآتيتين',
      pointsLabel: '50 درجة',
      blocks: [
        {
          id: 'problem-1',
          heading: 'المسألة الأولى',
          items: [
            {
              id: 'pb1-1',
              kind: 'free',
              prompt:
                'تقدّم لإمتحان مادة الرياضيات في مسابقة الأولمبياد العلمي السوري $69$ طالبة وعدد من الطلاب الذكور. إذا علمت أن ثلثي عدد الطالبات نلن درجة النجاح في حين بلغ عدد الطلاب الذكور الناجحين $24$ طالباً وهم يشكلون نسبة ثلاثة أخماس من عدد جميع الطلاب الذكور المتقدمين للامتحان.',
              partsLabel: 'المطلوب:',
              parts: [
                {
                  id: 'pb1-1-a',
                  number: '١',
                  prompt: 'ما عدد الطالبات اللاتي نلن درجة النجاح؟',
                },
                {
                  id: 'pb1-1-b',
                  number: '٢',
                  prompt:
                    'إذا علمت أن سُبع عدد الطلبة من الناجحين والناجحات نال الدرجة العظمى في الامتحان، جد عدد هؤلاء الطلبة.',
                },
              ],
            },
          ],
        },
        {
          id: 'problem-2',
          heading: 'المسألة الثانية',
          items: [
            {
              id: 'pb2-1',
              kind: 'free',
              prompt:
                'في الشكل المجاور $MBND$ متوازي أضلاع مركزه $O$ فيه $MB = 5$ و $NC = 3$ و $AD = 4$ و $BC \\perp DC$ و $DA \\perp AB$، علماً أن النقاط $A, M, B$ على استقامة واحدة وكذلك النقاط $D, N, C$ على استقامة واحدة.',
              figure: 'mbnd-parallelogram',
              partsLabel: 'والمطلوب:',
              parts: [
                {
                  id: 'pb2-1-a',
                  number: '١',
                  prompt: 'أثبت أن المثلثين $MBD$ و $BDN$ طبوقان.',
                },
                {
                  id: 'pb2-1-b',
                  number: '٢',
                  prompt: 'أثبت أن $\\widehat{AMD} = \\widehat{BNC}$.',
                },
                {
                  id: 'pb2-1-c',
                  number: '٣',
                  prompt: 'أثبت تطابق المثلثين $BNC$ و $AMD$ ثم استنتج طول $AM$.',
                },
                {
                  id: 'pb2-1-d',
                  number: '٤',
                  prompt: 'أثبت أن الرباعي $ABCD$ مستطيل واحسب مساحته.',
                },
                {
                  id: 'pb2-1-e',
                  number: '٥',
                  prompt:
                    'هل المثلث $BNC$ صورة المثلث $AMD$ وفق الانسحاب الذي ينقل $B$ إلى $M$؟ أم هو نظيره بالنسبة للنقطة $O$؟',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

/** كل الاختبارات المستقلة المتاحة حاليًا في المنطقة. */
export const independentTests: IndependentTest[] = [firstIndependentTest];

export const findIndependentTest = (id: string): IndependentTest | undefined =>
  independentTests.find((test) => test.id === id);

export default independentTests;
