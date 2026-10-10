import { unit2Lesson4TeacherSolutions } from './lesson04TeacherSolutions';
import type { ContentBlock, LessonData, LessonStep } from '../unit1/lesson01';
import type { TeacherArea } from '../assessment';

/**
 * الوحدة الثانية — الدرس الرابع: الجذور التربيعية.
 * المصدر: صفحات 35–37 من كتاب الرياضيات السوري للصف الثامن (نشاط إيجاد الجذر
 * التربيعي لعدد موجب، والتعريف، والنتيجتان، وخواص الجذور التربيعية الأربع، ومثال
 * تبسيط الجذور، ومثال الآلة الحاسبة، و«تحقّق من فهمك»، و«تدرّب»).
 *
 * كل نص مأخوذ من الكتاب يحمل sourceRef للصفحة والبند. أي شرح أو تلميح أو تفاعل
 * مضاف من المنصة موسوم بـ«شرح الأستاذ» ولا يُنسب إلى الكتاب.
 * البنود التي تعذّر قراءتها بثقة تامة من صورة الصفحة تحمل verifyNote يبدأ بـ«ملاحظة المصدر».
 */

const src = (page: number, section: string, item?: string) => ({ page, section, item });

const teach = (id: string, page: number, title: string, content: string, mathFormula?: string): ContentBlock => ({
  id,
  type: 'teach',
  authored: true,
  title: `🧠 ${title}`,
  sourceRef: src(page, 'شرح المنصة'),
  content,
  mathFormula,
});

const insight = (id: string, page: number, title: string, content: string, mathFormula?: string): ContentBlock => ({
  id,
  type: 'insight',
  authored: true,
  title: `💡 ${title}`,
  sourceRef: src(page, 'شرح المنصة'),
  content,
  mathFormula,
});

const mistake = (id: string, page: number, title: string, content: string, mathFormula?: string): ContentBlock => ({
  id,
  type: 'mistake',
  authored: true,
  title: `⚠️ ${title}`,
  sourceRef: src(page, 'شرح المنصة'),
  content,
  mathFormula,
});

const example = (
  id: string,
  page: number,
  item: string | undefined,
  title: string,
  content: string,
  mathFormula?: string,
  solution?: string,
  verifyNote?: string,
): ContentBlock => ({
  id,
  type: 'example',
  title,
  sourceRef: src(page, 'مثال من الكتاب', item),
  content,
  mathFormula,
  explanation: solution,
  verifyNote,
});

/** ملاحظة المصدر للعدد العشري في مثال √0.0256: الفاصلة تظهر في الصورة كنقطة وسطية. */
const DECIMAL_SCAN_NOTE =
  'ملاحظة المصدر: يطبع الكتاب الفاصلة العشرية نقطة وسطية (0·0256 و0·16)، وتؤكد الصورة أن الحساب الوارد فيه هو √256 ÷ √10000 = 16 ÷ 100 = 0·16، أي أن القيمة 0.16. تعرض المنصة الفاصلة العشرية بالنقطة "."، والقيمة نفسها. تحقّقت المنصة أن 0.16 × 0.16 = 0.0256.';


const steps: LessonStep[] = [
  // ──────────────── الجزء الأول: النشاط والتعريف (الصفحة 35) ────────────────
  {
    id: 'step-1',
    title: 'نشاط: مربعات الأعداد',
    subtitle: 'نعلم أن $a^{2} = a\\times a$ يسمى $a^{2}$ مربع العدد $a$. املأ الجداول بأعداد مناسبة.',
    sourcePages: [35],
    groupId: 'g-root-activity',
    groupTitle: 'الجزء الأول: النشاط والتعريف — الجذر التربيعي لعدد موجب',
    blocks: [
      {
        id: 'p35-activity-intro',
        type: 'activity',
        title: '📖 نشاط: إيجاد الجذر التربيعي لعدد موجب',
        sourceRef: src(35, 'نشاط'),
        content:
          'نعلم أنّ $a^{2} = a\\times a$ يسمى $a^{2}$ مربع العدد $a$. املأ الجداول الآتية بأعداد مناسبة.',
      },
      {
        id: 'p35-activity-table',
        type: 'interactive-exercise',
        title: '🧮 جداول المربعات: املأ الخانات الفارغة',
        sourceRef: src(35, 'شرح المنصة'),
        authored: true,
        content:
          'الجداول الثلاثة هي جداول الكتاب نفسها، والخانات المظللة مطبوعة فيه. اكتب مربع كل عدد في الخانة الفارغة، ثم اضغط «تحقّق من الخانات».',
        interactiveType: 'square-table',
      },
      mistake(
        'p35-activity-mistake',
        35,
        'خطأ شائع: حساب المربع بضرب العدد في 2',
        'الطالب الذي يكتب $3^{2} = 6$ يضرب العدد في 2 بدل ضربه في نفسه. تذكّر: $3^{2} = 3\\times3 = 9$.',
      ),
    ],
  },
  {
    id: 'step-2',
    title: 'تعريف: الجذر التربيعي للعدد الموجب',
    subtitle: 'ما العدد الموجب الذي مربعه يساوي $a$؟ ونرمزه $\\sqrt{a}$',
    sourcePages: [35],
    groupId: 'g-root-activity',
    groupTitle: 'الجزء الأول: النشاط والتعريف — الجذر التربيعي لعدد موجب',
    blocks: [
      {
        id: 'p35-def-root',
        type: 'learn',
        title: '📘 تعريف الجذر التربيعي للعدد الموجب',
        sourceRef: src(35, 'تعلم', 'تعريف'),
        content:
          'الجذر التربيعي للعدد الموجب $a$ هو العدد الموجب $b$ الذي مربعه يساوي $a$، ونرمزه $\\sqrt{a}$، ويُقرأ «الجذر التربيعي للعدد $a$».',
        mathFormula: '\\sqrt{a} = b \\qquad b^{2} = a \\qquad b \\geq 0',
      },
      example(
        'p35-ex-144',
        35,
        undefined,
        'مثال: √144 = 12',
        'نتحقّق من أن $\\sqrt{144} = 12$ لأن $12^{2} = 144$.',
        '\\sqrt{144} = 12 \\qquad (12)^{2} = 144',
      ),
      example(
        'p35-ex-361',
        35,
        undefined,
        'مثال: √361 = 19',
        'نتحقّق من أن $\\sqrt{361} = 19$ لأن $19^{2} = 361$.',
        '\\sqrt{361} = 19 \\qquad (19)^{2} = 361',
      ),
      {
        id: 'p35-root-explorer',
        type: 'interactive-exercise',
        title: '🧪 استوديو الجذر التربيعي',
        sourceRef: src(35, 'شرح المنصة'),
        authored: true,
        content:
          'أدخل عددًا موجبًا أو صفرًا، وانظر إلى جذره التربيعي، ثم تحقّق أن مربع الجذر يساوي العدد نفسه. جرّب عددًا ليس مربعًا كاملًا مثل 5 لترى أن جذره يُكتب بالرمز فقط.',
        interactiveType: 'square-root-explorer',
        interactiveData: { mode: 'root', initialValue: 16 },
      },
      insight(
        'p35-def-insight',
        35,
        'لماذا نقول «الجذر الموجب»؟',
        'الجذر التربيعي للعدد الموجب عدد موجب فقط، لأن التعريف يشترط $b \\geq 0$. لذلك $\\sqrt{25} = 5$ وليس $-5$، مع أن $(-5)^{2} = 25$ أيضًا.',
      ),
    ],
  },
  {
    id: 'step-3',
    title: 'نتائج: العدد السالب، والصفر، والعدد 3',
    subtitle: 'متى يكون للعدد جذر تربيعي؟',
    sourcePages: [35],
    groupId: 'g-root-activity',
    groupTitle: 'الجزء الأول: النشاط والتعريف — الجذر التربيعي لعدد موجب',
    blocks: [
      {
        id: 'p35-def-negative',
        type: 'learn',
        title: '📘 مثال: العدد −25 ليس له جذر تربيعي',
        sourceRef: src(35, 'تعلم', 'مثال'),
        content:
          'العدد $-25$ ليس له جذر تربيعي، لأنه لا يوجد عدد مربعه يساوي $-25$، فمربع أي عدد غير سالب.',
        mathFormula: '\\sqrt{-25}',
      },
      {
        id: 'p35-def-zero',
        type: 'learn',
        title: '📘 الجذر التربيعي للعدد صفر',
        sourceRef: src(35, 'تعلم', 'مثال'),
        content: 'للعدد صفر جذر تربيعي هو صفر.',
        mathFormula: '\\sqrt{0} = 0',
      },
      {
        id: 'p35-def-three',
        type: 'learn',
        title: '📘 الجذر التربيعي للعدد 3',
        sourceRef: src(35, 'تعلم', 'مثال'),
        content: 'الجذر التربيعي للعدد $3$ هو $\\sqrt{3}$.',
        mathFormula: '\\sqrt{3}',
      },
      {
        id: 'p35-results',
        type: 'knowledge',
        title: 'نتائج',
        sourceRef: src(35, 'نتائج'),
        content: 'من التعريف نستنتج النتيجتين الآتيتين:',
        subItems: [
          { label: '1)', text: 'ليس للعدد السالب جذر تربيعي.' },
          { label: '2)', text: 'الجذر التربيعي للعدد صفر هو صفر.' },
        ],
      },
    ],
  },

  // ──────────────── الجزء الثاني: خواص الجذور التربيعية (الصفحة 36) ────────────────
  {
    id: 'step-4',
    title: 'الجذر التربيعي لجداء عددين موجبين',
    subtitle: 'خاصية الجداء: $\\sqrt{a\\times b} = \\sqrt{a}\\times\\sqrt{b}$',
    sourcePages: [36],
    groupId: 'g-root-properties',
    groupTitle: 'الجزء الثاني: خواص الجذور التربيعية',
    blocks: [
      {
        id: 'p36-rule-product-title',
        type: 'learn',
        title: '1. الجذر التربيعي لجداء عددين موجبين',
        sourceRef: src(36, 'خواص الجذور التربيعية', '1'),
        content: 'نتأمل المثال الآتي قبل صياغة القاعدة:',
      },
      example(
        'p36-ex-9x4',
        36,
        'مثال ①',
        'مثال: √9 × √4 = √36',
        'نلاحظ أن $\\sqrt{9}\\times\\sqrt{4} = 3\\times2 = 6$، ويمكن تعميم ذلك.',
        '\\sqrt{9\\times4} = \\sqrt{36} = 6 \\qquad \\sqrt{9}\\times\\sqrt{4} = 3\\times2 = 6',
      ),
      {
        id: 'p36-rule-product',
        type: 'learn',
        title: 'قاعدة الجداء',
        sourceRef: src(36, 'خواص الجذور التربيعية', '1'),
        content: 'إذا كان $a \\geq 0$ و$b \\geq 0$ فإن:',
        mathFormula: '\\sqrt{a\\times b} = \\sqrt{a}\\times\\sqrt{b}',
      },
      {
        id: 'p36-rule-product-many',
        type: 'learn',
        title: 'تعميم القاعدة على أكثر من عددين',
        sourceRef: src(36, 'خواص الجذور التربيعية', '1'),
        content: 'إذا كانت $a$، و$b$، و…، و$e$ أعدادًا موجبة فإن:',
        mathFormula:
          '\\sqrt{a\\times b\\times\\cdots\\times e} = \\sqrt{a}\\times\\sqrt{b}\\times\\cdots\\times\\sqrt{e}',
      },
      example(
        'p36-ex-36x16',
        36,
        'مثال ①',
        'مثال: √(36 × 16)',
        'نطبّق القاعدة: $\\sqrt{36\\times16} = \\sqrt{36}\\times\\sqrt{16} = 6\\times4 = 24$.',
        '\\sqrt{36\\times16} = \\sqrt{36}\\times\\sqrt{16} = 6\\times4 = 24',
      ),
      example(
        'p36-ex-9x16',
        36,
        'مثال ①',
        'مثال: √(9 × 16)',
        'نطبّق القاعدة: $\\sqrt{9\\times16} = \\sqrt{9}\\times\\sqrt{16} = 3\\times4 = 12$.',
        '\\sqrt{9\\times16} = \\sqrt{9}\\times\\sqrt{16} = 3\\times4 = 12',
      ),
      example(
        'p36-ex-2x8',
        36,
        'مثال ②',
        'مثال: √2 × √8 = √16',
        'يمكن أيضًا استعمال القاعدة بالعكس: نجمع الجذرين في جذر واحد للجداء.',
        '\\sqrt{2}\\times\\sqrt{8} = \\sqrt{2\\times8} = \\sqrt{16} = 4',
      ),
      {
        id: 'p36-product-studio',
        type: 'interactive-exercise',
        title: '🧪 استوديو الجذور: جداء عددين',
        sourceRef: src(36, 'شرح المنصة'),
        authored: true,
        content: 'اختر العددين $a$ و$b$، وقارن بين الطرف الأيسر والطرف الأيمن للقاعدة.',
        interactiveType: 'root-rules-studio',
        interactiveData: { rules: ['product'] },
      },
      insight(
        'p36-product-insight',
        36,
        'لماذا تصح القاعدة؟',
        'ليكن $x = \\sqrt{a}\\times\\sqrt{b}$. عندئذ $x \\geq 0$ و$x^{2} = (\\sqrt{a})^{2}(\\sqrt{b})^{2} = a\\times b$. وبحسب تعريف الجذر التربيعي للعدد الموجب فإن $x = \\sqrt{a\\times b}$.',
      ),
      mistake(
        'p36-product-mistake',
        36,
        'خطأ شائع: الجذر لا يُوزَّع على الجمع',
        'كثيرًا ما يُكتب $\\sqrt{9+16} = \\sqrt{9}+\\sqrt{16} = 3+4 = 7$. والصواب $\\sqrt{25} = 5$. القاعدة تخص الجداء فقط: $\\sqrt{a\\times b} = \\sqrt{a}\\times\\sqrt{b}$ وليس $\\sqrt{a+b} = \\sqrt{a}+\\sqrt{b}$.',
      ),
    ],
  },
  {
    id: 'step-5',
    title: 'الجذر التربيعي لنسبة عددين موجبين',
    subtitle: 'خاصية النسبة: $\\sqrt{\\frac{a}{b}} = \\frac{\\sqrt{a}}{\\sqrt{b}}$',
    sourcePages: [36],
    groupId: 'g-root-properties',
    groupTitle: 'الجزء الثاني: خواص الجذور التربيعية',
    blocks: [
      {
        id: 'p36-rule-quotient-title',
        type: 'learn',
        title: '2. الجذر التربيعي لنسبة عددين موجبين',
        sourceRef: src(36, 'خواص الجذور التربيعية', '2'),
        content: 'نتأمل المثال الآتي قبل صياغة القاعدة:',
      },
      example(
        'p36-ex-16-4',
        36,
        'مثال',
        'مثال: √(16 / 4) = √4 = 2',
        'نلاحظ أن $\\frac{\\sqrt{16}}{\\sqrt{4}} = \\frac{4}{2} = 2$، ويمكن تعميم ذلك.',
        '\\sqrt{\\frac{16}{4}} = \\sqrt{4} = 2 \\qquad \\frac{\\sqrt{16}}{\\sqrt{4}} = \\frac{4}{2} = 2',
      ),
      {
        id: 'p36-rule-quotient',
        type: 'learn',
        title: 'قاعدة النسبة',
        sourceRef: src(36, 'خواص الجذور التربيعية', '2'),
        content: 'إذا كان $a \\geq 0$ و$b > 0$ فإن:',
        mathFormula: '\\sqrt{\\frac{a}{b}} = \\frac{\\sqrt{a}}{\\sqrt{b}}',
      },
      example(
        'p36-ex-decimal',
        36,
        'مثال',
        'مثال: √0.0256 = 0.16',
        'نكتب البسط والمقام جذرين لعددين صحيحين: $\\sqrt{256} = 16$ و$\\sqrt{10000} = 100$.',
        '\\sqrt{0.0256} = \\frac{\\sqrt{256}}{\\sqrt{10000}} = \\frac{16}{100} = 0.16',
        undefined,
        DECIMAL_SCAN_NOTE,
      ),
      example(
        'p36-ex-6-22',
        36,
        'مثال',
        'مثال: √6 / √22',
        'نجمع الجذرين في جذر واحد للنسبة، ثم نبسّط الكسر داخل الجذر بالاختصار بالعدد 2.',
        '\\frac{\\sqrt{6}}{\\sqrt{22}} = \\sqrt{\\frac{6}{22}} = \\sqrt{\\frac{3}{11}}',
      ),
      {
        id: 'p36-quotient-studio',
        type: 'interactive-exercise',
        title: '🧪 استوديو الجذور: نسبة عددين',
        sourceRef: src(36, 'شرح المنصة'),
        authored: true,
        content: 'اختر العددين $a$ و$b$، ولاحظ أن الجذر التربيعي للنسبة يساوي نسبة الجذرين.',
        interactiveType: 'root-rules-studio',
        interactiveData: { rules: ['quotient'] },
      },
      mistake(
        'p36-quotient-mistake',
        36,
        'خطأ شائع: جذر البسط وحده',
        'الطالب الذي يكتب $\\sqrt{\\frac{9}{25}} = \\frac{9}{5}$ أخذ جذر المقام فقط. الصواب: $\\sqrt{\\frac{9}{25}} = \\frac{\\sqrt{9}}{\\sqrt{25}} = \\frac{3}{5}$.',
      ),
    ],
  },
  {
    id: 'step-6',
    title: 'قوّة جذر تربيعي لعدد موجب',
    subtitle: 'القاعدة: $\\left(\\sqrt{b}\\right)^{n} = \\sqrt{b^{n}}$ حيث $n$ عدد طبيعي',
    sourcePages: [36],
    groupId: 'g-root-properties',
    groupTitle: 'الجزء الثاني: خواص الجذور التربيعية',
    blocks: [
      {
        id: 'p36-rule-power-title',
        type: 'learn',
        title: '3. قوّة جذر تربيعي لعدد موجب',
        sourceRef: src(36, 'خواص الجذور التربيعية', '3'),
        content: 'نتأمل المثال الآتي:',
      },
      example(
        'p36-ex-power-sqrt2',
        36,
        'مثال',
        'مثال: (√2)⁶',
        '$8 = \\sqrt{2^{6}} = \\sqrt{64} = 8$، ويمكن تعميم ذلك.',
        '\\left(\\sqrt{2}\\right)^{6} = \\sqrt{2}\\times\\sqrt{2}\\times\\sqrt{2}\\times\\sqrt{2}\\times\\sqrt{2}\\times\\sqrt{2} = 8',
        undefined,
        'ملاحظة المصدر: في صورة الصفحة 36 توجد كلمة غير مقروءة قبل عبارة «حظ أن 8 = √2⁶ = √64 = 8» (يظهر مكانها رمز فارغ في الصورة)، ولذلك لم تُكتب في النص. يُرجى صورة أوضح لهذا الموضع.',
      ),
      {
        id: 'p36-rule-power',
        type: 'learn',
        title: 'قاعدة قوّة الجذر',
        sourceRef: src(36, 'خواص الجذور التربيعية', '3'),
        content: 'إذا كان $b \\geq 0$ فإن، حيث $n$ عدد طبيعي:',
        mathFormula: '\\left(\\sqrt{b}\\right)^{n} = \\sqrt{b^{n}}',
      },
      example(
        'p36-ex-power-sqrt3',
        36,
        'مثال',
        'مثال: (√3)⁴',
        'نطبّق القاعدة: $\\left(\\sqrt{3}\\right)^{4} = \\sqrt{3^{4}} = \\sqrt{81} = 9$.',
        '\\left(\\sqrt{3}\\right)^{4} = \\sqrt{3^{4}} = \\sqrt{81} = 9',
      ),
      {
        id: 'p36-power-studio',
        type: 'interactive-exercise',
        title: '🧪 استوديو الجذور: قوّة الجذر',
        sourceRef: src(36, 'شرح المنصة'),
        authored: true,
        content: 'اختر الأساس $b$ والأس $n$، وقارن بين $\\left(\\sqrt{b}\\right)^{n}$ و$\\sqrt{b^{n}}$.',
        interactiveType: 'root-rules-studio',
        interactiveData: { rules: ['power'] },
      },
    ],
  },
  {
    id: 'step-7',
    title: 'الجذر التربيعي لقوّة أسها عدد زوجي طبيعي',
    subtitle: 'القاعدة: $\\sqrt{b^{n}} = b^{\\frac{n}{2}}$ عندما يكون $n$ زوجيًا',
    sourcePages: [36],
    groupId: 'g-root-properties',
    groupTitle: 'الجزء الثاني: خواص الجذور التربيعية',
    blocks: [
      {
        id: 'p36-rule-even-title',
        type: 'learn',
        title: '4. الجذر التربيعي لقوّة أسها عدد زوجي طبيعي',
        sourceRef: src(36, 'خواص الجذور التربيعية', '4'),
        content: 'إذا كان $b > 0$ فإن، حيث $n$ عدد طبيعي زوجي:',
        mathFormula: '\\sqrt{b^{n}} = b^{\\frac{n}{2}}',
      },
      example(
        'p36-ex-even-power',
        36,
        'مثال',
        'مثال: $\\left(\\sqrt{3}\\right)^{4} = 3^{\\frac{4}{2}}$',
        'نكتب الأس $\\frac{4}{2} = 2$ فيصبح الناتج $3^{2}$.',
        '\\left(\\sqrt{3}\\right)^{4} = 3^{\\frac{4}{2}} = 3^{2} = 9',
      ),
      insight(
        'p36-even-insight',
        36,
        'لماذا نقسم الأس على 2؟',
        'لأن $b^{n} = \\left(b^{\\frac{n}{2}}\\right)^{2}$، والعدد $b^{\\frac{n}{2}}$ موجب عندما $b > 0$، فهو الجذر الموجب للعدد $b^{n}$.',
      ),
      mistake(
        'p36-even-mistake',
        36,
        'خطأ شائع: √(x²) = x لكل عدد x',
        'القاعدة تعطي $\\sqrt{x^{2}} = |x|$. مثلًا $\\sqrt{(-3)^{2}} = \\sqrt{9} = 3$ وليس $-3$، لأن الجذر التربيعي دائمًا موجب أو صفر.',
        '\\sqrt{(-3)^{2}} = \\sqrt{9} = 3',
      ),
      {
        id: 'p36-even-studio',
        type: 'interactive-exercise',
        title: '🧪 استوديو الجذور: جذر قوّة أسها زوجي',
        sourceRef: src(36, 'شرح المنصة'),
        authored: true,
        content: 'اختر الأساس $b$ والأس الزوجي $n$، وتحقّق أن $\\sqrt{b^{n}} = b^{\\frac{n}{2}}$.',
        interactiveType: 'root-rules-studio',
        interactiveData: { rules: ['even-power'] },
      },
    ],
  },

  // ──────────────── الجزء الثالث: التبسيط والآلة الحاسبة (الصفحة 37) ────────────────
  {
    id: 'step-8',
    title: 'مثال: تبسيط الجذور √8 و√50 و√27',
    subtitle: 'نُخرج من الجذر عاملًا مربعًا كاملًا، ثم نستعمل خاصية الجداء',
    sourcePages: [37],
    groupId: 'g-simplify',
    groupTitle: 'الجزء الثالث: تبسيط الجذور وتطبيقاتها',
    blocks: [
      {
        id: 'p37-simplify-example',
        type: 'example',
        title: 'مثال: بسّط الجذور الآتية',
        sourceRef: src(37, 'مثال'),
        content: 'بسّط الجذور الآتية: $\\sqrt{27}$، $\\sqrt{50}$، $\\sqrt{8}$.',
        mathFormula: '\\sqrt{27}, \\qquad \\sqrt{50}, \\qquad \\sqrt{8}',
        subItems: [
          {
            label: '√8',
            text: 'نكتب 8 جداء عددين أحدهما مربع كامل (4):',
            math: '\\sqrt{8} = \\sqrt{4\\times2} = \\sqrt{4}\\times\\sqrt{2} = 2\\sqrt{2}',
          },
          {
            label: '√50',
            text: 'نكتب 50 جداء 25 في 2:',
            math: '\\sqrt{50} = \\sqrt{25\\times2} = \\sqrt{25}\\times\\sqrt{2} = 5\\sqrt{2}',
          },
          {
            label: '√27',
            text: 'نكتب 27 جداء 9 في 3:',
            math: '\\sqrt{27} = \\sqrt{9\\times3} = \\sqrt{9}\\times\\sqrt{3} = 3\\sqrt{3}',
          },
        ],
      },
      teach(
        'p37-simplify-teach',
        37,
        'شرح المنصة: كيف نختار العامل المربع؟',
        'نبحث عن أكبر عدد مربع كامل يقسم العدد، مثل 4 أو 9 أو 25، ثم نستعمل خاصية الجداء $\\sqrt{a\\times b} = \\sqrt{a}\\times\\sqrt{b}$ لإخراج جذر ذلك المربع. مثلًا: $\\sqrt{50}$، أكبر مربع يقسم 50 هو 25.',
      ),
      {
        id: 'p37-simplify-studio',
        type: 'interactive-exercise',
        title: '🧪 مبسّط الجذور',
        sourceRef: src(37, 'شرح المنصة'),
        authored: true,
        content: 'أدخل عددًا صحيحًا موجبًا لترى أكبر عامل مربع فيه، ثم الصيغة المبسطة لجذره.',
        interactiveType: 'square-root-simplifier',
        interactiveData: { initialValue: 50 },
      },
    ],
  },
  {
    id: 'step-9',
    title: 'الآلة الحاسبة: مربع مساحته 8 cm²',
    subtitle: 'من المساحة إلى طول الضلع بالحاسبة',
    sourcePages: [37],
    groupId: 'g-simplify',
    groupTitle: 'الجزء الثالث: تبسيط الجذور وتطبيقاتها',
    blocks: [
      {
        id: 'p37-calc-symbol',
        type: 'learn',
        title: 'الرمز √ على الآلة الحاسبة',
        sourceRef: src(37, 'الآلة الحاسبة'),
        content:
          '(في بعض الآلات الحاسبة، يكتب العدد ثم الزر $\\sqrt{\\ }$) الرمز $\\sqrt{\\ }$ في آلة حاسبة، يعمل على إيجاد العدد الموجب الذي عُلِم مربعه (أو قيمة تقريبية له).',
      },
      example(
        'p37-area-8',
        37,
        'مثال',
        'مثال: مربع مساحته 8 cm²',
        'إذا رمزنا إلى طول ضلع هذا المربع بالرمز $x$ مقدّرًا بالسنتيمتر، كان $x^{2} = 8$.',
        'x^{2} = 8',
      ),
      example(
        'p37-area-calc',
        37,
        'مثال',
        'نتيجة الآلة الحاسبة: x ≈ 2.8',
        'نضغط على أزرار الآلة الحاسبة وفق النسق $\\sqrt{\\ } \\; 8 \\; =$، فنجد على الشاشة 2.828427125، إذن $x \\approx 2.8$. يُسمّى العدد $x$ «الجذر التربيعي للعدد 8»، ويُرمز إليه بالرمز $\\sqrt{8}$.',
        '\\sqrt{8} \\approx 2.828427125 \\qquad x \\approx 2.8',
      ),
      {
        id: 'p37-area-studio',
        type: 'interactive-exercise',
        title: '🧪 حساب طول الضلع من المساحة',
        sourceRef: src(37, 'شرح المنصة'),
        authored: true,
        content: 'أدخل مساحة المربع بالسنتيمتر المربع، وانظر إلى طول ضلعه مقرّبًا لأقرب جزء من عشرة.',
        interactiveType: 'square-root-explorer',
        interactiveData: { mode: 'area', initialValue: 8 },
      },
    ],
  },

  // ──────────────── الجزء الرابع: تحقّق من فهمك وتدرّب (الصفحتان 37) ────────────────
  {
    id: 'step-10',
    title: 'تحقّق من فهمك ①: الجذور التربيعية لأعداد',
    subtitle: 'اكتب الجذور التربيعية للأعداد 196، 64، 1، 0، 5',
    sourcePages: [37],
    groupId: 'g-check-train',
    groupTitle: 'الجزء الرابع: تحقّق من فهمك وتدرّب',
    blocks: [
      {
        id: 'p37-check-1',
        type: 'practice',
        title: '① اكتب الجذور التربيعية للأعداد الآتية',
        sourceRef: src(37, 'تحقّق من فهمك', '①'),
        content: 'اكتب الجذر التربيعي لكل عدد من الأعداد: 196، 64، 1، 0، 5.',
        subItems: [
          {
            label: '196',
            text: 'العدد مربع كامل',
            math: '\\sqrt{196} = 14',
            solution: '\\sqrt{196} = 14 \\qquad 14^{2} = 196',
          },
          {
            label: '64',
            text: 'العدد مربع كامل',
            math: '\\sqrt{64} = 8',
            solution: '\\sqrt{64} = 8 \\qquad 8^{2} = 64',
          },
          {
            label: '1',
            text: 'العدد مربع كامل',
            math: '\\sqrt{1} = 1',
            solution: '\\sqrt{1} = 1 \\qquad 1^{2} = 1',
          },
          {
            label: '0',
            text: 'جذر الصفر',
            math: '\\sqrt{0} = 0',
            solution: '\\sqrt{0} = 0 \\qquad 0^{2} = 0',
          },
          {
            label: '5',
            text: 'العدد ليس مربعًا كاملًا',
            math: '\\sqrt{5}',
            solution: '\\sqrt{5}',
            explanation: 'لا يوجد عدد صحيح مربعه 5 لأن $2^{2} = 4$ و$3^{2} = 9$، لذلك يبقى الجذر بالصيغة $\\sqrt{5}$.',
          },
        ],
      },
    ],
  },
  {
    id: 'step-11',
    title: 'تحقّق من فهمك ②: طول ضلع أرض مربعة',
    subtitle: 'أرض مربعة الشكل مساحتها 225، احسب طول ضلعها',
    sourcePages: [37],
    groupId: 'g-check-train',
    groupTitle: 'الجزء الرابع: تحقّق من فهمك وتدرّب',
    blocks: [
      {
        id: 'p37-check-2',
        type: 'check',
        title: '② أرض مربعة الشكل مساحتها 225',
        sourceRef: src(37, 'تحقّق من فهمك', '②'),
        content: 'أرض مربعة الشكل مساحتها 225 احسب طول ضلعها.',
        explanation: 'إذا رمزنا إلى طول الضلع بـ $x$ فإن $x^{2} = 225$، إذن $x = \\sqrt{225} = 15$ لأن $15^{2} = 225$.',
      },
    ],
  },
  {
    id: 'step-12',
    title: 'تحقّق من فهمك ③: حساب ناتج الأعداد',
    subtitle: 'احسب ناتج كل من الأعداد الآتية',
    sourcePages: [37],
    groupId: 'g-check-train',
    groupTitle: 'الجزء الرابع: تحقّق من فهمك وتدرّب',
    blocks: [
      {
        id: 'p37-check-3',
        type: 'practice',
        title: '③ احسب ناتج كل من الأعداد الآتية',
        sourceRef: src(37, 'تحقّق من فهمك', '③'),
        content: 'احسب ناتج كل من الأعداد الآتية:',
        subItems: [
          {
            label: '①',
            text: 'نسبة جذرين',
            math: '\\frac{\\sqrt{72}}{\\sqrt{32}}',
            solution: '\\frac{\\sqrt{72}}{\\sqrt{32}} = \\sqrt{\\frac{72}{32}} = \\sqrt{\\frac{9}{4}} = \\frac{3}{2}',
          },
          {
            label: '②',
            text: 'قوّة جذر تربيعي',
            math: '\\left(\\sqrt{5}\\right)^{6}',
            solution: '\\left(\\sqrt{5}\\right)^{6} = \\sqrt{5^{6}} = \\sqrt{15\\,625} = 125',
            explanation: 'يمكن أيضًا: $\\left(\\sqrt{5}\\right)^{6} = 5^{3} = 125$.',
          },
          {
            label: '③',
            text: 'جذر جداء قوتين',
            math: '\\sqrt{\\left(3\\right)^{6}\\times\\left(5\\right)^{4}}',
            solution:
              '\\sqrt{3^{6}\\times5^{4}} = \\sqrt{3^{6}}\\times\\sqrt{5^{4}} = 3^{3}\\times5^{2} = 27\\times25 = 675',
          },
        ],
      },
    ],
  },

  // ──────────────── التدريب (الصفحة 37) ────────────────
  {
    id: 'step-13',
    title: 'تدرّب ①: طول ضلع مربع من مساحته',
    subtitle: 'احسب طول ضلع المربع الذي مساحته 1 cm² و4 cm² و36 cm²',
    sourcePages: [37],
    groupId: 'g-check-train',
    groupTitle: 'الجزء الرابع: تحقّق من فهمك وتدرّب',
    blocks: [
      {
        id: 'p37-train-1',
        type: 'practice',
        title: '① احسب طول ضلع المربع',
        sourceRef: src(37, 'تدرّب', '①'),
        content: 'احسب طول ضلع مربع مساحته',
        subItems: [
          {
            label: '①',
            text: 'مساحته 1 cm²',
            math: '\\sqrt{1} = 1\\ \\text{cm}',
            solution: 'طول الضلع $x$ يحقق $x^{2} = 1$، إذن $x = \\sqrt{1} = 1\\ \\text{cm}$ لأن $1^{2} = 1$.',
          },
          {
            label: '②',
            text: 'مساحته 4 cm²',
            math: '\\sqrt{4} = 2\\ \\text{cm}',
            solution: 'طول الضلع $x$ يحقق $x^{2} = 4$، إذن $x = \\sqrt{4} = 2\\ \\text{cm}$ لأن $2^{2} = 4$.',
          },
          {
            label: '③',
            text: 'مساحته 36 cm²',
            math: '\\sqrt{36} = 6\\ \\text{cm}',
            solution: 'طول الضلع $x$ يحقق $x^{2} = 36$، إذن $x = \\sqrt{36} = 6\\ \\text{cm}$ لأن $6^{2} = 36$.',
          },
        ],
      },
    ],
  },
  {
    id: 'step-14',
    title: 'تدرّب ②: تبسيط الجذور',
    subtitle: 'بسّط الجذور الآتية: √75، √32، √108',
    sourcePages: [37],
    groupId: 'g-check-train',
    groupTitle: 'الجزء الرابع: تحقّق من فهمك وتدرّب',
    blocks: [
      {
        id: 'p37-train-2',
        type: 'practice',
        title: '② بسّط الجذور الآتية',
        sourceRef: src(37, 'تدرّب', '②'),
        content: 'بسّط الجذور الآتية: $\\sqrt{75}$، $\\sqrt{32}$، $\\sqrt{108}$.',
        subItems: [
          {
            label: '√75',
            text: 'أكبر مربع يقسم 75 هو 25',
            math: '\\sqrt{75} = 5\\sqrt{3}',
            solution: '\\sqrt{75} = \\sqrt{25\\times3} = \\sqrt{25}\\times\\sqrt{3} = 5\\sqrt{3}',
          },
          {
            label: '√32',
            text: 'أكبر مربع يقسم 32 هو 16',
            math: '\\sqrt{32} = 4\\sqrt{2}',
            solution: '\\sqrt{32} = \\sqrt{16\\times2} = \\sqrt{16}\\times\\sqrt{2} = 4\\sqrt{2}',
          },
          {
            label: '√108',
            text: 'أكبر مربع يقسم 108 هو 36',
            math: '\\sqrt{108} = 6\\sqrt{3}',
            solution: '\\sqrt{108} = \\sqrt{36\\times3} = \\sqrt{36}\\times\\sqrt{3} = 6\\sqrt{3}',
          },
        ],
      },
      {
        id: 'p37-train-2-studio',
        type: 'interactive-exercise',
        title: '🧪 تحقّق من تبسيطك',
        sourceRef: src(37, 'شرح المنصة'),
        authored: true,
        content: 'جرّب الأعداد الثلاثة في مبسّط الجذور، وقارن الصيغة الناتجة بما كتبته.',
        interactiveType: 'square-root-simplifier',
        interactiveData: { initialValue: 75 },
      },
    ],
  },
  {
    id: 'step-15',
    title: 'تدرّب ③: مساحة مربع تساوي 30 cm²',
    subtitle: 'ليكن $S$ طول ضلع المربع بالسنتيمترات',
    sourcePages: [37],
    groupId: 'g-check-train',
    groupTitle: 'الجزء الرابع: تحقّق من فهمك وتدرّب',
    blocks: [
      {
        id: 'p37-train-3',
        type: 'practice',
        title: '③ مساحة مربع تساوي 30 cm²',
        sourceRef: src(37, 'تدرّب', '③'),
        content: 'مساحة مربع تساوي $30\\ \\text{cm}^{2}$، ويرمز $S$ إلى طول ضلعه مقاسًا بالسنتيمترات.',
        subItems: [
          {
            label: '1.',
            text: 'هل $S$ عدد صحيح؟',
            math: 'S = \\sqrt{30}',
            solution: '$S = \\sqrt{30}$، والعدد 30 ليس مربعًا كاملًا، لذلك $S$ ليس عددًا صحيحًا.',
            explanation: 'العدد الصحيح الذي مربعه أقرب إلى 30 من الأسفل هو 5 لأن $5^{2} = 25$، ومن الأعلى هو 6 لأن $6^{2} = 36$، ولا يوجد عدد صحيح مربعه 30.',
          },
          {
            label: '2.',
            text: 'احصر $S$ بين عددين صحيحين متتاليين.',
            math: '5 < S < 6',
            solution: '$5^{2} = 25 < 30 < 36 = 6^{2}$، وبأخذ الجذر الموجب لكل طرف: $5 < \\sqrt{30} < 6$.',
          },
          {
            label: '3.',
            text: 'استخدم آلتك الحاسبة لحساب $S$ مقرّبًا لأقرب جزء من مئة.',
            math: 'S \\approx 5.48',
            solution: '$\\sqrt{30} \\approx 5.477225575$، ومقرّبًا لأقرب جزء من مئة: $S \\approx 5.48\\ \\text{cm}$.',
          },
        ],
      },
    ],
  },
];

const teacherArea: TeacherArea = {
  objectives: [
    'فهم الجذر التربيعي للعدد الموجب $a$ بوصفه العدد الموجب $b$ الذي مربعه يساوي $a$، وكتابته بالرمز $\\sqrt{a}$.',
    'معرفة أن العدد السالب ليس له جذر تربيعي، وأن جذر الصفر يساوي صفرًا.',
    'تطبيق خاصيتي الجداء والنسبة: $\\sqrt{a\\times b} = \\sqrt{a}\\times\\sqrt{b}$ و$\\sqrt{\\frac{a}{b}} = \\frac{\\sqrt{a}}{\\sqrt{b}}$.',
    'حساب قوّة الجذر $\\left(\\sqrt{b}\\right)^{n} = \\sqrt{b^{n}}$ وجذر قوّة أسها زوجي $\\sqrt{b^{n}} = b^{\\frac{n}{2}}$.',
    'تبسيط الجذور بإخراج العامل المربع الكامل، واستعمال الآلة الحاسبة لتقدير الجذر مقرّبًا.',
  ],
  commonMistakes: [
    {
      mistake: 'اعتبار $\\sqrt{25} = \\pm 5$ أو أن للعدد السالب جذرًا تربيعيًا: $\\sqrt{-25} = -5$.',
      correction: 'الجذر التربيعي للعدد الموجب عدد موجب فقط: $\\sqrt{25} = 5$، والعدد السالب ليس له جذر تربيعي.',
    },
    {
      mistake: 'توزيع الجذر على الجمع: $\\sqrt{9+16} = 3+4 = 7$.',
      correction: 'القاعدة للجداء والنسبة فقط: $\\sqrt{9+16} = \\sqrt{25} = 5$.',
    },
    {
      mistake: 'أخذ جذر البسط وحده في النسبة: $\\sqrt{\\frac{9}{25}} = \\frac{9}{5}$.',
      correction: '$\\sqrt{\\frac{9}{25}} = \\frac{\\sqrt{9}}{\\sqrt{25}} = \\frac{3}{5}$.',
    },
    {
      mistake: 'اعتبار $\\sqrt{x^{2}} = x$ لكل عدد $x$.',
      correction: '$\\sqrt{(-3)^{2}} = \\sqrt{9} = 3$، لأن الجذر التربيعي موجب أو صفر.',
    },
    {
      mistake: 'تبسيط $\\sqrt{50}$ بإخراج 2 كأنه عامل مربع: $\\sqrt{50} = 2\\sqrt{25} = 10$.',
      correction: '$\\sqrt{50} = \\sqrt{25\\times2} = 5\\sqrt{2}$، والعامل المربع الذي يُخرج هو 25.',
    },
    {
      mistake: 'اعتبار $\\left(\\sqrt{3}\\right)^{2} = 6$ بضرب الأس في العدد.',
      correction: '$\\left(\\sqrt{3}\\right)^{2} = \\sqrt{3}\\times\\sqrt{3} = 3$، لأن $\\sqrt{3}\\times\\sqrt{3} = \\sqrt{9} = 3$.',
    },
  ],
  remediation: [
    'ابدأ بجداول المربعات في الخطوة الأولى: اطلب من الطالب أن يملأ الخانات الفارغة ذهنيًا قبل التحقّق، ثم اعرض الصلة العكسية بين المربع والجذر.',
    'استعمل مستكشف الجذر التربيعي: أدخل عددًا مربعًا كاملًا ثم عددًا ليس مربعًا كاملًا، واطلب من الطالب أن يفسّر الفرق بين النتيجتين.',
    'قبل قاعدة الجداء، اطلب حساب $\\sqrt{4\\times9}$ بطريقتين، ثم اعرض أن النتيجتين متساويتان. كرّر ذلك مع النسبة قبل الانتقال إلى القوى.',
    'في تبسيط الجذور اعتمد مبدأ «أكبر مربع يقسم العدد»، واكتب كل خطوة بالقاعدة المستعملة، وتحقّق من الناتج بتربيعه.',
    'لتصحيح خطأ $\\sqrt{x^{2}} = x$، أعطِ الطالب قيمة سالبة، مثل $x = -4$، واطلب حساب الطرفين.',
  ],
  teachingNotes: [
    'النشاط (الصفحة 35) مقصود به الاستنتاج: الطالب يملأ الجداول ثم يلاحظ أن الجذر هو العدد الذي يعطي المربع المطلوب. لا تُقدّم التعريف قبل إتمام الجدول.',
    'تعريف الجذر يشترط أن يكون العدد الناتج موجبًا أو صفرًا؛ لذلك نصف الجذر التربيعي بأنه «الجذر الموجب». الخاصية نفسها تُستعمل في تبسيط الجذور وحساب المساحات.',
    'الأمثلة في الصفحة 36 تقدّم كل خاصية من خلال مثال عددي قبل صياغتها؛ اطلب من الطالب أن يحسب المثال أولًا، ثم يذكر القاعدة التي تفسّر النتيجة.',
    'مثال $\\sqrt{0.0256}$ يتطلب التعامل مع عدد عشري داخل الجذر؛ وقد وُضعت ملاحظة المصدر لأن الفاصلة العشرية في صورة الكتاب غير مقروءة بثقة تامة.',
    'مثال الآلة الحاسبة في الصفحة 37 يربط الجذر بمساحة المربع: $x^{2} = 8$ ثم $x = \\sqrt{8}$. أكّد للطلاب أن الآلة تعطي قيمة تقريبية، وأن الصيغة الدقيقة هي $\\sqrt{8}$.',
    'في التدرّب ③ الأرقام صغيرة نسبيًا والنتيجة تقريبية: $\\sqrt{30} \\approx 5.48$، واطلب من الطلاب التحقّق بتربيع 5.48 والتأكد من أنه قريب من 30.',
  ],
  assessmentGuidance: [
    'اطلب من الطالب كتابة الجذر التربيعي لعدد مربع كامل، ثم لعدد ليس مربعًا كاملًا، واشرح الفرق بين الكتابتين.',
    'في الخواص الأربع، قيّم اختيار القاعدة لا الحساب فقط: اعرض عبارات مثل $\\sqrt{4\\times9}$ و$\\sqrt{4+9}$، واطلب تحديد ما يصح منها.',
    'في التبسيط، لا تكتفِ بالناتج النهائي؛ اطلب من الطالب أن يكتب العامل المربع الذي اختاره، ثم يتحقّق بتربيع الجذر الناتج.',
    'خصّص سؤالًا قصيرًا عن إشارة الجذر: $\\sqrt{x^{2}}$ عندما $x$ سالب، فهو أكثر موضع يتكرر فيه الخطأ.',
    'في مسائل المساحة اطلب وحدة الطول بعد حساب الجذر، فالمساحة بوحدة $\\text{cm}^{2}$ والطول بوحدة $\\text{cm}$.',
  ],
  answerKeys: [
    {
      section: 'تعريف الجذر التربيعي وأمثلته — الصفحة 35',
      source: 'الصفحة 35 • تعلم • مثال',
      items: [
        { ref: '√144', answer: '12', note: 'لأن 12 × 12 = 144' },
        { ref: '√361', answer: '19', note: 'لأن $19^{2} = 361$' },
        { ref: '√−25', answer: 'غير معرّف (لا جذر تربيعي)', note: 'لا يوجد عدد مربعه $-25$' },
        { ref: '√0', answer: '0', note: 'الجذر التربيعي للصفر هو صفر' },
      ],
    },
    {
      section: 'خواص الجذور التربيعية — الصفحة 36',
      source: 'الصفحة 36 • خواص الجذور التربيعية',
      items: [
        { ref: '√9×√4', answer: '6', note: '$\\sqrt{36}=6$ و$3\\times2=6$' },
        { ref: '√(36×16)', answer: '24', note: '$6\\times4 = 24$' },
        { ref: '√(9×16)', answer: '12', note: '$3\\times4 = 12$' },
        { ref: '√2×√8', answer: '4', note: '$\\sqrt{16} = 4$' },
        { ref: '√(16/4)', answer: '2', note: '$\\frac{4}{2}=2$' },
        { ref: '√0.0256', answer: '0.16', note: 'ملاحظة المصدر: قراءة الفاصلة من الصورة' },
        { ref: '√6/√22', answer: '\\sqrt{\\frac{3}{11}}', note: 'اختصار $\\frac{6}{22}=\\frac{3}{11}$' },
        { ref: '(√2)⁶', answer: '8', note: '$\\sqrt{2^{6}} = \\sqrt{64} = 8$' },
        { ref: '(√3)⁴', answer: '9', note: '$\\sqrt{3^{4}} = \\sqrt{81} = 9$' },
        { ref: '(√3)⁴ (زوجي)', answer: '9', note: '$3^{\\frac{4}{2}} = 3^{2} = 9$' },
      ],
    },
    {
      section: 'تبسيط الجذور — الصفحة 37',
      source: 'الصفحة 37 • مثال',
      items: [
        { ref: '√8', answer: '2\\sqrt{2}', note: '$\\sqrt{4\\times2}$' },
        { ref: '√50', answer: '5\\sqrt{2}', note: '$\\sqrt{25\\times2}$' },
        { ref: '√27', answer: '3\\sqrt{3}', note: '$\\sqrt{9\\times3}$' },
        { ref: 'x²=8', answer: 'x \\approx 2.8', note: 'الآلة تعطي 2.828427125' },
      ],
    },
    {
      section: 'تحقّق من فهمك — الصفحة 37',
      source: 'الصفحة 37 • تحقّق من فهمك',
      items: [
        { ref: '① 196، 64، 1، 0، 5', answer: '14,\\; 8,\\; 1,\\; 0,\\; \\sqrt{5}', note: 'مربعات كاملة ثم العدد 5' },
        { ref: '② مساحة 225', answer: '15', note: '$15^{2} = 225$' },
        { ref: '③ √72/√32', answer: '\\frac{3}{2}', note: '$\\frac{72}{32} = \\frac{9}{4}$' },
        { ref: '③ (√5)⁶', answer: '125', note: '$5^{3}$' },
        { ref: '③ √(3⁶×5⁴)', answer: '675', note: '$3^{3}\\times5^{2}$' },
      ],
    },
    {
      section: 'تدرّب — الصفحة 37',
      source: 'الصفحة 37 • تدرّب',
      items: [
        { ref: '① مساحة 1، 4، 36 cm²', answer: '1 cm، 2 cm، 6 cm', note: 'الجذر التربيعي للمساحة' },
        { ref: '② √75، √32، √108', answer: '5\\sqrt{3},\\; 4\\sqrt{2},\\; 6\\sqrt{3}', note: 'العامل المربع: 25 و16 و36' },
        { ref: '③ S عدد صحيح؟', answer: 'لا', note: '30 ليس مربعًا كاملًا' },
        { ref: '③ احصر S', answer: '5 < S < 6', note: '$25 < 30 < 36$' },
        { ref: '③ S لأقرب جزء من مئة', answer: '5.48', note: '$\\sqrt{30} \\approx 5.477$' },
      ],
    },
  ],
  solutions: unit2Lesson4TeacherSolutions,
};

export const unit2Lesson4Steps: LessonStep[] = steps;

export const unit2Lesson4Data: LessonData = {
  id: 'u2-lesson-4',
  number: 4,
  unitId: 'unit-2',
  unitTitle: 'الوحدة الثانية: قوى الأعداد العادية',
  title: 'الجذور التربيعية',
  description:
    'الجذر التربيعي للعدد الموجب وتعريفه، ونتيجتا العدد السالب والصفر، وخواص الجذور التربيعية في الجداء والنسبة وقوة الجذر، وتبسيط الجذور، واستعمال الآلة الحاسبة في حساب طول ضلع مربع من مساحته.',
  sourcePages: [35, 36, 37],
  steps,
  teacherArea,
};
