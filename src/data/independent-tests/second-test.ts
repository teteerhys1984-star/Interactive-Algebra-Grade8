import type { IndependentTest } from './types';

/**
 * الاختبار الثاني — نسخة منقولة من ورقة الاختبار المطبوعة (صفحة أولى: أقسام
 * «أولاً» و«ثانياً» و«ثالثاً»، وصفحة ثانية: «رابعاً» و«خامساً»).
 *
 * ما نُقل: نصوص الأسئلة والأعداد والكسور والأسس والمعطيات والخيارات والدرجات،
 * والرسمان الهندسيان (المثلث MNA والمثلث المتساوي الساقين ABC)، مع إعادة إنشاء
 * الرسم بـ SVG داخل المنصة كما في الاختبار الأول.
 * ما لم يُنقل: اسم الأستاذ وعبارة «مع تمنياتي بالتوفيق والنجاح»، وترويسة
 * الاسم/الدرجة/الصف، والزخارف والإطارات.
 *
 * ملاحظتان موثقتان تحتاجان مراجعة بشرية (لم يُغيَّر نص المصدر):
 *  1. السؤال الأول مطبوع «مقلوب سدس العدد $-24$» وخياراته $-8, -\tfrac18, +\tfrac18$؛
 *     سدس $-24$ هو $-4$ ومقلوبه $-\tfrac14$ وهو غير موجود في الخيارات، بينما
 *     $-\tfrac18$ هو مقلوب سدس $-48$. فالتعارض في المصدر نفسه، ونُقل النص كما هو.
 *  2. السؤال الرابع مطبوع بثلاث صيغ متقاربة في اللفظ («صورة» و«صورتها»)، ونُقلت
 *     الخيارات حرفيًّا بترتيبها المطبوع.
 */
export const secondIndependentTest: IndependentTest = {
  id: 'independent-test-2',
  title: 'الاختبار الثاني',
  subtitle: 'جبر + هندسة — الصف الثامن الأساسي',
  description:
    'اختبار يجمع بين الجبر (القوى والأسس والصيغة المعيارية والمقلوب والنظير والعبارات الجبرية) والهندسة (التطابق والانسحاب والتناظر المركزي والمعيّن والمساحات).',
  sections: [
    {
      id: 'section-1',
      heading: 'أولاً',
      title: 'اختر الإجابة الصحيحة',
      pointsLabel: '10 درجات لكل سؤال',
      blocks: [
        {
          id: 'question-1',
          heading: 'السؤال الأول',
          items: [
            {
              id: 'q1-1',
              number: '١',
              kind: 'choice',
              prompt: 'مقلوب سدس العدد $-24$ :',
              choices: [
                { id: 'a', label: '$-8$' },
                { id: 'b', label: '$-\\dfrac{1}{8}$' },
                { id: 'c', label: '$+\\dfrac{1}{8}$' },
              ],
            },
            {
              id: 'q1-2',
              number: '٢',
              kind: 'choice',
              prompt: 'مقلوب نظير العدد $10$ هو:',
              choices: [
                { id: 'a', label: '$-\\dfrac{1}{10}$' },
                { id: 'b', label: '$-10$' },
                { id: 'c', label: '$\\dfrac{1}{10}$' },
              ],
            },
            {
              id: 'q1-3',
              number: '٣',
              kind: 'choice',
              prompt: 'ليس من حالات تطابق المثلثات:',
              choices: [
                { id: 'a', label: 'تساوي الاضلاع' },
                { id: 'b', label: 'تساوي الزوايا' },
                { id: 'c', label: 'تساوي ضلع وزاويتين' },
              ],
            },
            {
              id: 'q1-4',
              number: '٤',
              kind: 'choice',
              prompt:
                '$MNPQ$ متوازي أضلاع وفق الانسحاب من $N$ إلى $M$ :',
              choices: [
                { id: 'a', label: '$P$ صورة $Q$' },
                { id: 'b', label: '$Q$ صورة $M$' },
                { id: 'c', label: '$P$ صورتها $Q$' },
              ],
            },
            {
              id: 'q1-5',
              number: '٥',
              kind: 'choice',
              prompt:
                'الصيغة المعيارية للعدد $0.00051 \\times 10^{-1}$ هي:',
              choices: [
                { id: 'a', label: '$5.1 \\times 10^{-5}$' },
                { id: 'b', label: '$5.1 \\times 10^{-4}$' },
                { id: 'c', label: '$5.1 \\times 10^{+4}$' },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'section-2',
      heading: 'ثانياً',
      title: 'ضع إشارة (صح) أمام العبارة الصحيحة وإشارة (خطأ) أمام العبارة المغلوطة',
      pointsLabel: '10 درجات لكل سؤال',
      blocks: [
        {
          id: 'question-2',
          heading: 'السؤال الثاني',
          items: [
            {
              id: 'q2-1',
              number: '١',
              kind: 'true-false',
              prompt: 'مقلوب $10^{-2}$ هو $10^{+2}$.',
            },
            {
              id: 'q2-2',
              number: '٢',
              kind: 'true-false',
              prompt: 'مقلوب أي عدد غير معدوم هو عدد أصغر منه.',
            },
            {
              id: 'q2-3',
              number: '٣',
              kind: 'true-false',
              prompt: 'نصف الخُمسين يساوي ثلاثة أخماس الثلث.',
            },
            {
              id: 'q2-4',
              number: '٤',
              kind: 'true-false',
              prompt: 'صورة مستقيمين متوازيين هما مستقيمان متعامدان.',
            },
            {
              id: 'q2-5',
              number: '٥',
              kind: 'true-false',
              prompt:
                'يتطابق مثلثان إذا تساوت قياس زوايا المثلث الأول مع قياسات زوايا المثلث الثاني.',
            },
          ],
        },
      ],
    },
    {
      id: 'section-3',
      heading: 'ثالثاً',
      title: 'اكتب بأبسط صيغة لستة تمارين فقط من التمارين التالية',
      pointsLabel: '20 درجة لكل تمرين',
      blocks: [
        {
          id: 'exercise-1',
          heading: 'التمرين الأول',
          items: [
            { id: 'ex1-1', number: '١', kind: 'free', math: '\\dfrac{10^{-1} \\times 10^{-5}}{10^{-9} \\times 10^{-9}}' },
            { id: 'ex1-2', number: '٢', kind: 'free', math: '2.3 \\times 10^{-2} \\times 3 \\times 10^{+4}' },
            { id: 'ex1-3', number: '٣', kind: 'free', math: '\\left(10^{-3}\\right)^{+4} \\times 10^{-5} \\times \\dfrac{1}{10^{-2}}' },
            { id: 'ex1-4', number: '٤', kind: 'free', math: '7.9 \\times 10^{-9} + 1400 \\times 10^{-12}' },
            { id: 'ex1-5', number: '٥', kind: 'free', math: '1 + \\dfrac{1}{2} \\times 5 \\div \\dfrac{2}{5}' },
            { id: 'ex1-6', number: '٦', kind: 'free', math: '\\dfrac{10^{5} \\times 10^{8}}{\\left(10^{4}\\right)^{4}}' },
            { id: 'ex1-7', number: '٧', kind: 'free', math: '\\dfrac{0.75 \\times 10^{12} \\times 4 \\times 10^{-5}}{0.0005 \\times 10^{+5}}' },
            { id: 'ex1-8', number: '٨', kind: 'free', math: '\\dfrac{0.4}{0.3} \\times \\dfrac{-9}{16}' },
          ],
        },
      ],
    },
    {
      id: 'section-4',
      heading: 'رابعاً',
      title: 'أجب عن أربع أسئلة فقط من أصل خمسة',
      pointsLabel: '70 درجة لكل تمرين',
      blocks: [
        {
          id: 'problem-1',
          heading: 'المسألة الأولى',
          items: [
            {
              id: 'pb1-1',
              kind: 'free',
              prompt:
                'سافر شادي بسيارته فقطع مسافة $253\\,km$ توقف في استراحة ثم تابع سفره فقطع مسافة $167198\\,m$ والمطلوب:',
              partsLabel: 'والمطلوب:',
              parts: [
                { id: 'pb1-1-a', number: '١', prompt: 'احسب المسافة التي قطعها شادي مقدرة بالـ $m$.' },
                { id: 'pb1-1-b', number: '٢', prompt: 'احسب الناتج بالشكل $a \\times 10^{3}$.' },
                { id: 'pb1-1-c', number: '٣', prompt: 'اكتب الناتج بالصيغة المعيارية.' },
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
                'اشترت ماري بربع ما تملك هدايا وثلث ما تملك ألعاب وبقي معها $500$ ل.س.',
              partsLabel: 'والمطلوب:',
              parts: [
                { id: 'pb2-1-a', number: '١', prompt: 'احسب المبلغ الذي كان مع ماري قبل الشراء.' },
              ],
            },
          ],
        },
        {
          id: 'problem-3',
          heading: 'المسألة الثالثة',
          items: [
            {
              id: 'pb3-1',
              kind: 'free',
              prompt:
                'ارسم صورة $N$ في الشكل المرسوم جانبًا وفق الانسحاب $T_{M \\to A}$ ثم سمِّ الشكل الناتج واحسب محيطه.',
              figure: 'mna-right-triangle',
            },
          ],
        },
        {
          id: 'problem-4',
          heading: 'المسألة الرابعة',
          items: [
            {
              id: 'pb4-1',
              kind: 'free',
              prompt: 'احسب قيمة $A = \\dfrac{a+b}{c}$ إذا علمت:',
              math: 'a = -1 \\quad,\\quad b = \\dfrac{1}{3} \\quad,\\quad c = \\dfrac{2}{5}',
            },
          ],
        },
        {
          id: 'problem-5',
          heading: 'المسألة الخامسة',
          items: [
            {
              id: 'pb5-1',
              kind: 'free',
              prompt:
                'أنشئ صورة المثلث $ABC$ وفق انسحاب أفقي إلى اليمين بمقدار $4$ سم، وبرأيك هل مساحة الشكل الناتج تساوي مساحة المثلث الأصلي؟ (علل إجابتك)، ثم اذكر أربعة من خصائص الانسحاب.',
              figure: 'abc-translation',
            },
          ],
        },
      ],
    },
    {
      id: 'section-5',
      heading: 'خامساً',
      title: 'حل المسألة التالية',
      pointsLabel: '100 علامة',
      blocks: [
        {
          id: 'problem-6',
          heading: 'المسألة الهندسية',
          items: [
            {
              id: 'pb6-1',
              kind: 'free',
              prompt:
                '$ABC$ متساوي الساقين، $AH$ ارتفاع، $C\\widehat{A}H = B\\widehat{A}H$، $HC = HB$، $O$ منتصف $AH$.',
              figure: 'abc-isosceles',
              partsLabel: 'المطلوب:',
              parts: [
                { id: 'pb6-1-a', number: '١', prompt: 'أثبت تطابق المثلثين $AOM$ و $AON$.' },
                { id: 'pb6-1-b', number: '٢', prompt: 'استنتج أن $MON$ مثلث متساوي الساقين.' },
                { id: 'pb6-1-c', number: '٣', prompt: 'ارسم $O\'$ نظيرة $O$ بالنسبة إلى $H$.' },
                { id: 'pb6-1-d', number: '٤', prompt: 'أثبت أن $OCO\'B$ معيّن.' },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export default secondIndependentTest;
