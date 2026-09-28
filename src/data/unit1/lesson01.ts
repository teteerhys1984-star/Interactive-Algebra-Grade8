import type { FinalAssessment, TeacherArea } from '../assessment';

export interface SourceRef {
  page: number;
  section: string;
  item?: string;
}

export interface LessonStep {
  id: string;
  title: string;
  subtitle?: string;
  sourcePages: number[];
  blocks: ContentBlock[];
}

export type BlockType =
  | 'activity'
  | 'learn'
  | 'knowledge'
  | 'check'
  | 'practice'
  | 'tip'
  | 'example'
  | 'interactive-exercise'
  | 'mcq'
  | 'fill-blank'
  | 'word-problem'
  | 'teach' // شرح موسّع بأسلوب المعلّم (محتوى إضافي حول المصدر)
  | 'insight' // بصيرة رياضية / لماذا تعمل القاعدة
  | 'mistake'; // مقارنة صواب/خطأ

export interface ContentBlock {
  id: string;
  type: BlockType;
  title: string;
  sourceRef: SourceRef;
  content: string; // Markdown / MathText text
  mathFormula?: string;
  explanation?: string;
  subItems?: {
    label?: string;
    text: string;
    math?: string;
    solution?: string;
    explanation?: string;
    verifyNote?: string;
  }[];
  interactiveType?: string;
  interactiveData?: any;
  /**
   * When true, this block is added pedagogical explanation authored by the
   * platform (a teacher-style aid) rather than verbatim textbook source. The
   * UI tags it as «شرح الأستاذ» so source fidelity stays transparent.
   */
  authored?: boolean;
  /** Optional note shown when a source item could not be read with certainty. */
  verifyNote?: string;
}

export interface LessonData {
  id: string;
  number: number;
  unitId: string;
  unitTitle: string;
  title: string;
  description: string;
  sourcePages: number[];
  steps: LessonStep[];
  /** Optional comprehensive final assessment (introduced with Lesson 2). */
  finalAssessment?: FinalAssessment;
  /** Optional teacher-facing resources gated behind a password. */
  teacherArea?: TeacherArea;
}

export const lesson01Data: LessonData = {
  id: 'lesson-1',
  number: 1,
  unitId: 'unit-1',
  unitTitle: 'الوحدة الأولى: الأعداد العادية والعمليات عليها',
  title: 'الجمع والطرح',
  description: 'قواعد وطرائق جمع وطرح الكسور العادية ذات المقامات المتساوية أو المختلفة وإنجاز سلاسل العمليات.',
  sourcePages: [5, 6, 7],
  steps: [
    {
      id: 'step-1',
      title: 'نشاط: تمديد القواعد لتشمل الكسور',
      subtitle: 'استكشاف طرائق جمع وطرح الكسور وتوحيد المقامات',
      sourcePages: [5],
      blocks: [
        {
          id: 'p5-act-header',
          type: 'activity',
          title: 'نشاط: تمديد القواعد التي عُرضت في الصف السابع لتشمل الكسور',
          sourceRef: { page: 5, section: 'نشاط', item: 'المدخل' },
          content: 'في هذا النشاط نستعيد القواعد الأساسية لجمع وطرح الأعداد ونمددها لتشمل الكسور العادية ذات المقامات المتساوية والمختلفة.',
        },
        {
          id: 'p5-act-1',
          type: 'activity',
          title: '1. المقامات متساوية',
          sourceRef: { page: 5, section: 'نشاط 1', item: 'المقامات متساوية' },
          content: 'قام كلّ من الطالبين باسم وهاشم بجمع الكسرين $\\frac{-9}{7}$ و $\\frac{5}{7}$.',
          subItems: [
            {
              label: 'حل باسم',
              text: 'عزل الإشارة السالبة ومقارنة القيم المطلقة:',
              math: '-\\frac{9}{7} + \\frac{5}{7} = -\\left(\\frac{9}{7}\\right) + \\frac{5}{7} = -\\left(\\frac{9}{7} - \\frac{5}{7}\\right) = -\\frac{4}{7}',
              explanation: 'إذ إنّ $\\frac{9}{7} > \\frac{5}{7}$ فإنّ $-\\frac{9}{7} + \\frac{5}{7} = -\\frac{4}{7}$',
            },
            {
              label: 'حل هاشم',
              text: 'الاحتفاظ بالمقام المشترك وجمع البسطين مباشرة:',
              math: '\\frac{-9}{7} + \\frac{5}{7} = \\frac{-9 + 5}{7} = \\frac{-4}{7} = -\\frac{4}{7}',
              explanation: 'جمع البسطين مع الإشارة فوق المقام المشترك: $-9 + 5 = -4$.',
            },
            {
              label: 'اشرح الطريقة التي اتبعها كل منهما لحساب المجموع',
              text: 'كلا الطالبين وصل إلى الناتج الصحيح $-\\frac{4}{7}$ بطريقة رياضية سليمة: باسم طبّق قاعدة جمع عددين مختلفين بالإشارة بإخراج إشارة الأكبر قيمة مطلقة، بينما هاشم جمع البسطين مباشرة فوق المقام المشترك $7$.',
            },
          ],
        },
        {
          id: 'p5-act-2',
          type: 'activity',
          title: '2. واحد من المقامات مضاعف لبقية المقامات',
          sourceRef: { page: 5, section: 'نشاط 2', item: 'مضاعف المقامات' },
          content: 'انسخ، ثمّ أكمل:',
          mathFormula: '-\\frac{1}{2} + \\frac{5}{8} = \\frac{\\dots}{8} + \\frac{5}{8} = \\frac{\\dots}{8} = \\dots',
          explanation: 'بضرب بسط ومقام الكسر الأول بالعدد $4$ يصبح $-\\frac{4}{8}$، ثم نجمع: $-\\frac{4}{8} + \\frac{5}{8} = \\frac{1}{8}$.',
          interactiveType: 'fill-blank',
          interactiveData: {
            prompt: 'أكمل الفراغات الآتية:',
            expression: '-\\frac{1}{2} + \\frac{5}{8} = \\frac{[ -4 ]}{8} + \\frac{5}{8} = \\frac{[ 1 ]}{8}',
            solution: '-\\frac{1}{2} + \\frac{5}{8} = \\frac{-4}{8} + \\frac{5}{8} = \\frac{1}{8}',
          },
        },
        {
          id: 'p5-tip-1',
          type: 'tip',
          title: 'إضاءة: توحيد المقامات',
          sourceRef: { page: 5, section: 'إضاءة', item: 'مفهوم توحيد المقامات' },
          content: 'عندما نكتب الكسرين $-\\frac{1}{2}$ و $\\frac{5}{8}$ بمقام مشترك $8$، نقول إننا **وحّدنا مقامي الكسرين**، ويتم ذلك بضرب كلّ من بسط ومقام الكسر الأول بالعدد $4$.',
        },
        {
          id: 'p5-act-3',
          type: 'activity',
          title: '3. كيفما كانت المقامات',
          sourceRef: { page: 5, section: 'نشاط 3', item: 'كيفما كانت المقامات' },
          content: 'وحّد مقامي الكسرين $-\\frac{1}{2}$ و $\\frac{5}{3}$، ثمّ احسب $-\\frac{1}{2} + \\frac{5}{3}$ بصيغة كسر.',
          subItems: [
            {
              label: 'مضاعفات العدد 2',
              text: 'مضاعفات العدد 2 هي:',
              math: '2 , 4 , 6 , 8 , 10 , 12 , 14 , 16 , 18 , \\dots',
            },
            {
              label: 'مضاعفات العدد 3',
              text: 'مضاعفات العدد 3 هي:',
              math: '3 , 6 , 9 , 12 , 15 , 18 , 21 , \\dots',
            },
            {
              label: 'خطوات الحساب',
              text: 'أصغر مضاعف مشترك للعددين $2$ و $3$ هو $6$:',
              math: '-\\frac{1}{2} + \\frac{5}{3} = -\\frac{1 \\times 3}{2 \\times 3} + \\frac{5 \\times 2}{3 \\times 2} = -\\frac{3}{6} + \\frac{10}{6} = \\frac{-3 + 10}{6} = \\frac{7}{6}',
            },
          ],
        },
      ],
    },
    {
      id: 'step-2',
      title: 'تعلم: خاصة 1 — المقامات متساوية',
      subtitle: 'قاعدة جمع وطرح الكسور ذات المقامات المتساوية مع أمثلة تطبيقية',
      sourcePages: [5, 6],
      blocks: [
        {
          id: 'p5-learn-rule1',
          type: 'learn',
          title: 'تعلم — خاصة 1',
          sourceRef: { page: 5, section: 'تعلم', item: 'خاصة 1' },
          content: 'لجمع (أو طرح) كسور عادية ذات مقامات متساوية، **نجمع (أو نطرح) بسوط هذه الكسور ونحتفظ بالمقام المشترك**.',
          subItems: [
            {
              label: 'صيغة الجمع',
              text: 'جمع كسرين لهما نفس المقام $b$:',
              math: '\\frac{a}{b} + \\frac{c}{b} = \\frac{a + c}{b}',
            },
            {
              label: 'صيغة الطرح',
              text: 'طرح كسرين لهما نفس المقام $b$:',
              math: '\\frac{a}{b} - \\frac{c}{b} = \\frac{a - c}{b}',
            },
          ],
        },
        {
          id: 'p6-example-1',
          type: 'example',
          title: 'مثال 1 (خاصة 1)',
          sourceRef: { page: 6, section: 'أمثلة خاصة 1', item: 'مثال 1' },
          content: 'حساب مجموع كسرين ذوي مقام متساوٍ:',
          mathFormula: '\\frac{-7}{3} + \\frac{0.5}{3} = \\frac{-7 + 0.5}{3} = \\frac{-6.5}{3}',
          explanation: 'المقام المشترك هو $3$. نجمع البسطين: $-7 + 0.5 = -6.5$.',
        },
        {
          id: 'p6-example-2',
          type: 'example',
          title: 'مثال 2 (خاصة 1)',
          sourceRef: { page: 6, section: 'أمثلة خاصة 1', item: 'مثال 2' },
          content: 'حساب فرق كسرين ذوي مقام متساوٍ:',
          mathFormula: '\\frac{1}{5} - \\frac{3}{5} = \\frac{1 - 3}{5} = \\frac{-2}{5} = -\\frac{2}{5}',
          explanation: 'المقام المشترك هو $5$. نطرح البسطين: $1 - 3 = -2$.',
        },
      ],
    },
    {
      id: 'step-3',
      title: 'تعلم: خاصة 2 — المقامات مختلفة',
      subtitle: 'قاعدة توحيد المقامات لجمع وطرح الكسور المختلفة المقامات مع أمثلة الكتاب',
      sourcePages: [6],
      blocks: [
        {
          id: 'p6-learn-rule2',
          type: 'learn',
          title: 'خاصة 2',
          sourceRef: { page: 6, section: 'تعلم', item: 'خاصة 2' },
          content: 'لجمع (أو طرح) كسور عادية ذات مقامات مختلفة، **نوحد مقاماتها، ثم نجري العمليات وفق الخاصة 1**.',
        },
        {
          id: 'p6-example-3',
          type: 'example',
          title: 'مثال 1 (خاصة 2)',
          sourceRef: { page: 6, section: 'أمثلة خاصة 2', item: 'مثال 1' },
          content: 'جمع كسرين بمقامين مختلفين:',
          mathFormula: '\\frac{5}{6} + \\frac{3}{4} = \\frac{10}{12} + \\frac{9}{12} = \\frac{10 + 9}{12} = \\frac{19}{12}',
          explanation: '$12$ هو مضاعف مشترك للعددين $6$ و $4$ فهو مقام مشترك للكسرين. استبدلنا، بكلّ كسر، كسراً يساويه مقامه يساوي $12$.',
        },
        {
          id: 'p6-example-4',
          type: 'example',
          title: 'مثال 2 (خاصة 2)',
          sourceRef: { page: 6, section: 'أمثلة خاصة 2', item: 'مثال 2' },
          content: 'طرح كسر من عدد عشري:',
          mathFormula: '-2.5 - \\frac{1}{3} = -\\frac{5}{2} - \\frac{1}{3} = -\\frac{15}{6} - \\frac{2}{6} = \\frac{-17}{6} = -\\frac{17}{6}',
          explanation: '$6$ هو مضاعف مشترك للعددين $2$ و $3$ فهو مقام مشترك للكسرين. استبدلنا، بكلّ كسر، كسراً يساويه مقامه $6$.',
        },
        {
          id: 'p6-example-5',
          type: 'example',
          title: 'مثال 3 (خاصة 2)',
          sourceRef: { page: 6, section: 'أمثلة خاصة 2', item: 'مثال 3' },
          content: 'لإنجاز العملية $\\frac{1}{2} + \\frac{3}{4}$:',
          mathFormula: '\\frac{1}{2} + \\frac{3}{4} = \\frac{2}{4} + \\frac{3}{4} = \\frac{5}{4}',
          explanation: 'نلاحظ أنّ $4$ هو مقام مشترك للكسرين لأن $4$ مضاعف للعدد $2$.',
        },
      ],
    },
    {
      id: 'step-4',
      title: 'اكتساب معارف: سلسلة من عمليات الجمع والطرح',
      subtitle: 'كيف ننجز سلسلة من العمليات باختيار المقام المشترك الأصغر والاختصار',
      sourcePages: [6, 7],
      blocks: [
        {
          id: 'p6-knowledge-header',
          type: 'knowledge',
          title: 'اكتساب معارف',
          sourceRef: { page: 6, section: 'اكتساب معارف', item: 'القاعدة المنهجية' },
          content: '### كيف ننجز سلسلة من عمليات الجمع والطرح؟\nلإنجاز سلسلة من عمليات الجمع والطرح على كسور عادية، **يفضّل أن نبدأ بإجراء العمليات على الكسور ذات المقامات المتساوية** أو توحيد المقامات وفق أصغر مضاعف مشترك.',
        },
        {
          id: 'p6-knowledge-example',
          type: 'example',
          title: 'مثال اكتساب معارف (الصفحتان 6 و 7)',
          sourceRef: { page: 6, section: 'اكتساب معارف', item: 'مثال A' },
          content: 'أنجز حساب $A = \\frac{5}{3} - \\frac{7}{6} + \\frac{3}{8}$ ، بصيغة كسر عادي.',
          subItems: [
            {
              label: 'ملاحظة المقامات',
              text: 'العدد $6$ مضاعف للعدد $3$، فلنوحّد مقامات الكسور الثلاثة، يكفي إيجاد مضاعف للعددين $6$ و $8$.',
            },
            {
              label: 'مضاعفات العدد 6',
              text: 'مضاعفات العدد 6 هي:',
              math: '6 , 12 , 18 , 24 , 30 , \\dots',
            },
            {
              label: 'مضاعفات العدد 8',
              text: 'مضاعفات العدد 8 هي:',
              math: '8 , 16 , 24 , \\dots',
            },
            {
              label: 'المقام المشترك الأصغر',
              text: '$24$ هو أصغر مضاعف مشترك للعددين $6$ و $8$.',
            },
            {
              label: 'تنفيذ الحساب والاختصار (صفحة 7)',
              text: 'تحويل الكسور إلى المقام المشترك $24$ وإجراء العمليات:',
              math: 'A = \\frac{40}{24} - \\frac{28}{24} + \\frac{9}{24} = \\frac{40 - 28 + 9}{24} = \\frac{21}{24} = \\frac{3 \\times 7}{3 \\times 8} = \\frac{7}{8}',
              explanation: 'نلاحظ اختصار العدد $3$ المشترك بين البسط والمقام لنصل إلى أبسط صورة $\\frac{7}{8}$.',
            },
          ],
        },
      ],
    },
    {
      id: 'step-5',
      title: 'تحقق من فهمك',
      subtitle: 'تمارين تطبيقية تفاعلية لاختبار استيعاب قواعد الجمع والطرح والمضاعفات',
      sourcePages: [7],
      blocks: [
        {
          id: 'p7-check-1',
          type: 'check',
          title: '1. انسخ وأكمل',
          sourceRef: { page: 7, section: 'تحقق من فهمك', item: '1' },
          content: 'انسخ وأكمل:',
          mathFormula: '\\frac{5}{9} + \\frac{1}{3} = \\frac{5}{9} + \\frac{\\dots}{9} = \\frac{\\dots}{9}',
          explanation: 'نوحد المقامات بجعل مقام الكسر الثاني $9$ بضرب البسط والمقام بالعدد $3$:\n$$\\frac{5}{9} + \\frac{3}{9} = \\frac{8}{9}$$',
          interactiveType: 'fill-blank',
          interactiveData: {
            prompt: 'أكمل الفراغات:',
            expression: '\\frac{5}{9} + \\frac{1}{3} = \\frac{5}{9} + \\frac{[ 3 ]}{9} = \\frac{[ 8 ]}{9}',
            solution: '\\frac{5}{9} + \\frac{3}{9} = \\frac{8}{9}',
          },
        },
        {
          id: 'p7-check-2',
          type: 'check',
          title: '2. احسب الناتج في كلّ حالة بصيغة كسر عادي',
          sourceRef: { page: 7, section: 'تحقق من فهمك', item: '2' },
          content: 'احسب الناتج في كلّ حالة من الحالات الآتية بصيغة كسر عادي:',
          subItems: [
            {
              label: '①',
              text: 'حساب المجموع:',
              math: '\\frac{-7}{5} + \\frac{-3}{5}',
              solution: '\\frac{-7 + (-3)}{5} = \\frac{-10}{5} = -2',
              explanation: 'المقامات متساوية: $-7 + (-3) = -10$، وبالقسمة على $5$ الناتج $-2$.',
            },
            {
              label: '②',
              text: 'حساب الفرق:',
              math: '\\frac{4}{7} - \\frac{9.1}{7}',
              solution: '\\frac{4 - 9.1}{7} = \\frac{-5.1}{7} = -\\frac{51}{70}',
              explanation: 'المقامات متساوية: $4 - 9.1 = -5.1$، وللتخلص من الفاصلة نضرب بـ $10$ فنحصل على $-\\frac{51}{70}$.',
            },
            {
              label: '③',
              text: 'حساب المجموع:',
              math: '-\\frac{4}{3} + \\frac{5}{3}',
              solution: '\\frac{-4 + 5}{3} = \\frac{1}{3}',
              explanation: 'المقامات متساوية: $-4 + 5 = 1$، الناتج $\\frac{1}{3}$.',
            },
            {
              label: '④',
              text: 'حساب المجموع:',
              math: '\\frac{13}{-6} + \\frac{-5}{6}',
              solution: '-\\frac{13}{6} - \\frac{5}{6} = \\frac{-13 - 5}{6} = \\frac{-18}{6} = -3',
              explanation: 'نكتب $\\frac{13}{-6}$ بصيغة $-\\frac{13}{6}$ ثم نجمع: $\\frac{-18}{6} = -3$.',
            },
            {
              label: '⑤',
              text: 'حساب سلسلة العمليات:',
              math: '\\frac{4}{1.2} - \\frac{5.3}{1.2} - \\frac{0.7}{1.2}',
              solution: '\\frac{4 - 5.3 - 0.7}{1.2} = \\frac{-2}{1.2} = -\\frac{20}{12} = -\\frac{5}{3}',
              explanation: 'المقامات متساوية ($1.2$). البسط: $4 - 5.3 - 0.7 = -2$. نضرب بـ $10$ ثم نختصر على $4$: $-\\frac{5}{3}$.',
            },
            {
              label: '⑥',
              text: 'حساب المجموع:',
              math: '-\\frac{6}{7} + \\frac{21.3}{35}',
              solution: '-\\frac{30}{35} + \\frac{21.3}{35} = \\frac{-30 + 21.3}{35} = \\frac{-8.7}{35} = -\\frac{87}{350}',
              explanation: 'المقام المشترك $35$ ($7 \\times 5 = 35$). الكسر الأول يصبح $-\\frac{30}{35}$. الناتج $-\\frac{8.7}{35} = -\\frac{87}{350}$.',
            },
          ],
        },
        {
          id: 'p7-check-3',
          type: 'check',
          title: '3. كتابة طلائع المضاعفات',
          sourceRef: { page: 7, section: 'تحقق من فهمك', item: '3' },
          content: 'اكتب طلائع مضاعفات العدد $6$، ثمّ طلائع مضاعفات العدد $8$.',
          subItems: [
            {
              label: 'طلائع مضاعفات العدد 6',
              text: 'المضاعفات الأولى للعدد 6:',
              math: '6 , 12 , 18 , 24 , 30 , 36 , 42 , 48 , \\dots',
            },
            {
              label: 'طلائع مضاعفات العدد 8',
              text: 'المضاعفات الأولى للعدد 8:',
              math: '8 , 16 , 24 , 32 , 40 , 48 , 56 , \\dots',
            },
            {
              label: 'المضاعفات المشتركة',
              text: 'أصغر مضاعف مشترك هو $24$، والمضاعف المشترك التالي هو $48$.',
            },
          ],
        },
      ],
    },
    {
      id: 'step-6',
      title: 'تدرب',
      subtitle: 'تمارين تدريبية شاملة على الجمع والطرح والاختصار والمسائل الواقعية',
      sourcePages: [7],
      blocks: [
        {
          id: 'p7-practice-1',
          type: 'practice',
          title: '1. انسخ وأكمل',
          sourceRef: { page: 7, section: 'تدرب', item: '1' },
          content: 'انسخ وأكمل:',
          subItems: [
            {
              label: '①',
              text: 'إكمال العملية الأولى:',
              math: '\\frac{5}{8} - \\frac{1}{6} = \\frac{\\dots}{24} - \\frac{\\dots}{24} = \\frac{\\dots}{\\dots}',
              solution: '\\frac{5}{8} - \\frac{1}{6} = \\frac{15}{24} - \\frac{4}{24} = \\frac{11}{24}',
              explanation: 'ضربنا كسر $\\frac{5}{8}$ في $3$ ليصبح $\\frac{15}{24}$، وكسر $\\frac{1}{6}$ في $4$ ليصبح $\\frac{4}{24}$.',
            },
            {
              label: '②',
              text: 'إكمال العملية الثانية:',
              math: '\\frac{5}{3} - \\frac{7}{4} = \\frac{\\dots}{12} - \\frac{\\dots}{12} = \\frac{\\dots}{12}',
              solution: '\\frac{5}{3} - \\frac{7}{4} = \\frac{20}{12} - \\frac{21}{12} = \\frac{-1}{12} = -\\frac{1}{12}',
              explanation: 'المقام المشترك $12$. $\\frac{5 \\times 4}{3 \\times 4} = \\frac{20}{12}$ و $\\frac{7 \\times 3}{4 \\times 3} = \\frac{21}{12}$. $20 - 21 = -1$.',
            },
          ],
        },
        {
          id: 'p7-practice-2',
          type: 'practice',
          title: '2. احسب بصيغة كسر عادي',
          sourceRef: { page: 7, section: 'تدرب', item: '2' },
          content: 'احسب بصيغة كسر عادي:',
          subItems: [
            {
              label: '①',
              text: 'حساب المجموع:',
              math: '\\frac{7}{4} + \\frac{2}{9}',
              solution: '\\frac{7 \\times 9}{36} + \\frac{2 \\times 4}{36} = \\frac{63}{36} + \\frac{8}{36} = \\frac{71}{36}',
              explanation: 'المقام المشترك الأصغر لـ $4$ و $9$ هو $36$.',
            },
            {
              label: '②',
              text: 'حساب المجموع:',
              math: '-\\frac{5}{8} + \\frac{1}{12}',
              solution: '-\\frac{15}{24} + \\frac{2}{24} = \\frac{-15 + 2}{24} = -\\frac{13}{24}',
              explanation: 'المقام المشترك الأصغر لـ $8$ و $12$ هو $24$.',
            },
            {
              label: '③',
              text: 'حساب الفرق:',
              math: '\\frac{7}{9} - \\frac{5.1}{6}',
              solution: '\\frac{14}{18} - \\frac{15.3}{18} = \\frac{14 - 15.3}{18} = \\frac{-1.3}{18} = -\\frac{13}{180}',
              explanation: 'المقام المشترك الأصغر لـ $9$ و $6$ هو $18$. البسط: $14 - 15.3 = -1.3$. نضرب بـ $10$ للتخلص من الفاصلة.',
            },
          ],
        },
        {
          id: 'p7-practice-3',
          type: 'practice',
          title: '3. احسب بصيغة كسر، ثمّ اختصر ما حصلت عليه إن أمكن',
          sourceRef: { page: 7, section: 'تدرب', item: '3' },
          content: 'احسب بصيغة كسر، ثمّ اختصر ما حصلت عليه، إن أمكن. (لاحظ أنّ عدداً $x$ يكتب $\\frac{x}{1}$)',
          subItems: [
            {
              label: '①',
              text: 'حساب المجموع:',
              math: '\\frac{5}{3} + \\frac{-13}{3}',
              solution: '\\frac{5 - 13}{3} = \\frac{-8}{3} = -\\frac{8}{3}',
              explanation: 'المقامات متساوية: $5 + (-13) = -8$. الكسر في أبسط صورة.',
            },
            {
              label: '②',
              text: 'حساب المجموع:',
              math: '-\\frac{4}{7} + \\frac{12}{7}',
              solution: '\\frac{-4 + 12}{7} = \\frac{8}{7}',
              explanation: 'المقامات متساوية: $-4 + 12 = 8$. الكسر في أبسط صورة.',
            },
            {
              label: '③',
              text: 'حساب الفرق:',
              math: '-\\frac{4}{5} - \\frac{-3}{5}',
              solution: '\\frac{-4 - (-3)}{5} = \\frac{-4 + 3}{5} = -\\frac{1}{5}',
              explanation: 'طرح السالب يتحول إلى جمع: $-4 + 3 = -1$.',
            },
            {
              label: '④',
              text: 'حساب المجموع:',
              math: '\\frac{-13}{9} + \\frac{27}{9}',
              solution: '\\frac{-13 + 27}{9} = \\frac{14}{9}',
              explanation: 'المقامات متساوية: $-13 + 27 = 14$.',
            },
            {
              label: '⑤',
              text: 'سلسلة عمليات ذات مقامات متساوية:',
              math: '\\frac{22}{15} - \\frac{8}{15} + \\frac{7}{15}',
              solution: '\\frac{22 - 8 + 7}{15} = \\frac{21}{15} = \\frac{3 \\times 7}{3 \\times 5} = \\frac{7}{5}',
              explanation: 'البسط: $22 - 8 + 7 = 21$. نختصر بالقسمة على $3$ فنحصل على $\\frac{7}{5}$.',
            },
            {
              label: '⑥',
              text: 'سلسلة عمليات ذات مقامات متساوية:',
              math: '-\\frac{1}{4} - \\frac{5}{4} + \\frac{3}{4}',
              solution: '\\frac{-1 - 5 + 3}{4} = \\frac{-3}{4} = -\\frac{3}{4}',
              explanation: 'البسط: $-1 - 5 + 3 = -3$. الناتج $-\\frac{3}{4}$.',
            },
            {
              label: '⑦',
              text: 'جمع عدد صحيح مع كسر:',
              math: '-6 + \\frac{3}{5}',
              solution: '-\\frac{6 \\times 5}{1 \\times 5} + \\frac{3}{5} = -\\frac{30}{5} + \\frac{3}{5} = \\frac{-30 + 3}{5} = -\\frac{27}{5}',
              explanation: 'نكتب $-6$ بصيغة $-\\frac{30}{5}$، ثم نجمع: $\\frac{-30 + 3}{5} = -\\frac{27}{5}$.',
            },
          ],
        },
        {
          id: 'p7-practice-4',
          type: 'word-problem',
          title: '4. مسألة تطبيقية: خلط العصير',
          sourceRef: { page: 7, section: 'تدرب', item: '4' },
          content: 'خلطت زينة $\\frac{3}{5}$ الليتر من عصير التفاح مع $\\frac{6}{5}$ الليتر من عصير العنب لملء وعاء سعته ليتران.\n\n**كم ليتراً من عصير الموز تحتاج زينة إضافته؟**',
          interactiveType: 'juice-mixer',
          interactiveData: {
            apple: { fraction: '\\frac{3}{5}', value: 0.6, label: 'عصير التفاح' },
            grape: { fraction: '\\frac{6}{5}', value: 1.2, label: 'عصير العنب' },
            totalCapacity: 2,
            bananaNeeded: { fraction: '\\frac{1}{5}', value: 0.2, label: 'عصير الموز' },
          },
          subItems: [
            {
              label: 'الخطوة 1: مجموع عصيري التفاح والعنب',
              text: 'حساب كمية العصير المضاف حتى الآن:',
              math: '\\frac{3}{5} + \\frac{6}{5} = \\frac{3 + 6}{5} = \\frac{9}{5}',
              explanation: 'وضعَت زينة $\\frac{9}{5}$ لتر (أي $1.8$ لتر) من العصير.',
            },
            {
              label: 'الخطوة 2: التعبير عن سعة الوعاء بكسر',
              text: 'سعة الوعاء الكلية هي $2$ لتر، وبتحويلها لكسر مقامه $5$:',
              math: '2 = \\frac{2 \\times 5}{1 \\times 5} = \\frac{10}{5}',
            },
            {
              label: 'الخطوة 3: حساب كمية عصير الموز المطلوبة',
              text: 'طرح الكمية المضافة من سعة الوعاء الكلية:',
              math: '2 - \\frac{9}{5} = \\frac{10}{5} - \\frac{9}{5} = \\frac{10 - 9}{5} = \\frac{1}{5}',
              explanation: 'تحتاج زينة إلى إضافة $\\frac{1}{5}$ لتر (أي $0.2$ لتر = $200$ مل) من عصير الموز لملء الوعاء بالكامل.',
            },
          ],
        },
      ],
    },
  ],
};
