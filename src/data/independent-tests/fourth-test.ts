import type { IndependentTest } from './types';

/**
 * الاختبار الرابع — نقل حرفي لورقة «ورقة عمل — الأعداد العادية والعمليات عليها».
 *
 * نُقلت الورقة كما وردت: السؤال الأول (اختيار من متعدد، 20 درجة)، والثاني
 * (صح/خطأ، 20 درجة)، والثالث (مسائل حسابية، 40 درجة)، والرابع (مسألة كلامية،
 * 20 درجة)، والمجموع 100 درجة، مع عنوان الورقة والصف والفصل والموضوعة.
 *
 * ما لم يُنقل: سطر إعداد المدرس واسمه، وترويسة الاسم/الدرجة/الصف الإدارية،
 * والتذييل والزخارف والإطارات.
 *
 * ملاحظة موثقة (دون تغيير نص المصدر): في السؤال الأول الخياران الأول
 * (9/-7) والثاني (-9/7) متكافئان رياضيًّا، وكلاهما يساوي مقلوب -7/9؛ نُقل
 * الخياران كما هما في المصدر ولم يُوحَّد بينهما.
 */
export const fourthIndependentTest: IndependentTest = {
  id: 'independent-test-4',
  title: 'الاختبار الرابع',
  subtitle: 'ورقة عمل — الأعداد العادية والعمليات عليها — الصف الثامن الأساسي — الفصل الأول',
  description:
    'ورقة عمل في الأعداد العادية والعمليات عليها للصف الثامن الأساسي (الفصل الأول). المجموع 100 درجة.',
  sections: [
    {
      id: 'section-1',
      heading: 'السؤال الأول',
      title: '',
      pointsLabel: '20 درجة',
      blocks: [
        {
          id: 'question-1',
          heading: 'اختر الإجابة الصحيحة مما يأتي',
          items: [
            {
              id: 'q1-1',
              number: '١',
              kind: 'choice',
              prompt: 'مقلوب العدد $-\\dfrac{7}{9}$ هو:',
              choices: [
                { id: 'a', label: '$\\dfrac{9}{-7}$' },
                { id: 'b', label: '$-\\dfrac{9}{7}$' },
                { id: 'c', label: '$\\dfrac{7}{9}$' },
              ],
            },
            {
              id: 'q1-2',
              number: '٢',
              kind: 'choice',
              prompt: 'قيمة $-\\dfrac{5}{8}$ من العدد $64$ تساوي:',
              choices: [
                { id: 'a', label: '$-40$' },
                { id: 'b', label: '$40$' },
                { id: 'c', label: '$-25$' },
              ],
            },
            {
              id: 'q1-3',
              number: '٣',
              kind: 'choice',
              prompt: 'ناتج $\\left(-\\dfrac{4}{7}\\right) \\div \\left(-\\dfrac{2}{9}\\right)$ هو:',
              choices: [
                { id: 'a', label: '$\\dfrac{18}{7}$' },
                { id: 'b', label: '$-\\dfrac{18}{7}$' },
                { id: 'c', label: '$\\dfrac{9}{7}$' },
              ],
            },
            {
              id: 'q1-4',
              number: '٤',
              kind: 'choice',
              prompt: 'ناتج $(-5) \\times (-8) \\times (-2)$ هو:',
              choices: [
                { id: 'a', label: '$-80$' },
                { id: 'b', label: '$80$' },
                { id: 'c', label: '$-20$' },
              ],
            },
            {
              id: 'q1-5',
              number: '٥',
              kind: 'choice',
              prompt: 'أبسط صورة للعبارة $14x - 6x + 8x$ هي:',
              choices: [
                { id: 'a', label: '$16x$' },
                { id: 'b', label: '$8x$' },
                { id: 'c', label: '$4x$' },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'section-2',
      heading: 'السؤال الثاني',
      title: '',
      pointsLabel: '20 درجة',
      blocks: [
        {
          id: 'question-2',
          heading: 'أجب بكلمة (صح) أو (خطأ)',
          items: [
            {
              id: 'q2-1',
              number: '١',
              kind: 'true-false',
              prompt: 'تحليل العبارة $18x - 12$ هو $6(3x - 2)$.',
            },
            {
              id: 'q2-2',
              number: '٢',
              kind: 'true-false',
              prompt: 'حاصل ضرب عددين مختلفي الإشارة هو عدد سالب.',
            },
            {
              id: 'q2-3',
              number: '٣',
              kind: 'true-false',
              prompt: 'مقلوب العدد $-\\dfrac{3}{5}$ هو $\\dfrac{5}{-3}$.',
            },
            {
              id: 'q2-4',
              number: '٤',
              kind: 'true-false',
              prompt: 'إذا كان $\\dfrac{x}{18} = \\dfrac{7}{9}$، فإن $x = 14$.',
            },
            {
              id: 'q2-5',
              number: '٥',
              kind: 'true-false',
              prompt: 'عند قسمة عدد موجب على عدد سالب يكون الناتج موجبًا.',
            },
          ],
        },
      ],
    },
    {
      id: 'section-3',
      heading: 'السؤال الثالث',
      title: '',
      pointsLabel: '40 درجة',
      blocks: [
        {
          id: 'question-3',
          heading: 'أوجد ناتج ما يأتي بأبسط صورة ممكنة',
          items: [
            {
              id: 'q3-1',
              number: '١',
              kind: 'free',
              prompt: 'اختزل العبارة الجبرية:',
              math: 'A = 6(4x - 3) - 5(2x + 7) + 4',
            },
            {
              id: 'q3-2',
              number: '٢',
              kind: 'free',
              prompt: 'احسب:',
              math: 'B = \\dfrac{7}{8} \\times (-24) + \\dfrac{5}{6}',
            },
            {
              id: 'q3-3',
              number: '٣',
              kind: 'free',
              prompt: 'احسب بأبسط صورة:',
              math: 'C = \\left(\\dfrac{5}{6} - \\dfrac{3}{4}\\right) \\div \\left(\\dfrac{7}{8} - \\dfrac{1}{2}\\right)',
            },
            {
              id: 'q3-4',
              number: '٤',
              kind: 'free',
              prompt: 'احسب مع مراعاة أولوية العمليات:',
              math: 'D = \\dfrac{5}{7} - \\dfrac{3}{4} \\div \\left(-\\dfrac{6}{11}\\right)',
            },
          ],
        },
      ],
    },
    {
      id: 'section-4',
      heading: 'السؤال الرابع',
      title: '',
      pointsLabel: '20 درجة',
      blocks: [
        {
          id: 'question-4',
          heading: 'حل المسألة الآتية',
          items: [
            {
              id: 'q4',
              kind: 'free',
              prompt:
                'في مدرسة، عدد الطلاب الذين يدرسون اللغة الإنجليزية $\\dfrac{3}{5}$ من العدد الكلي للطلاب. ثم تبيّن أن $\\dfrac{2}{7}$ من هؤلاء الطلاب يشاركون في الأنشطة الثقافية. إذا كان عدد طلاب المدرسة $70$ طالبًا؛',
              partsLabel: 'أوجد:',
              parts: [
                { id: 'q4-1', number: '١', prompt: 'عدد الطلاب الذين يدرسون اللغة الإنجليزية.' },
                { id: 'q4-2', number: '٢', prompt: 'عدد الطلاب المشاركين في الأنشطة الثقافية.' },
                {
                  id: 'q4-3',
                  number: '٣',
                  prompt:
                    'نسبة الطلاب الذين لا يدرسون اللغة الإنجليزية إلى العدد الكلي، معبّرًا عنها بالنسبة المئوية.',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export default fourthIndependentTest;
