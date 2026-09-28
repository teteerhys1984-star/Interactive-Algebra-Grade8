import { LessonData } from './lesson01';

/**
 * الدرس الثاني: الضرب — كتاب الجبر للصف الثامن (الصفحات 8، 9، 10، 11).
 *
 * مبدأ العمل:
 *  - المحتوى المنقول حرفيًا من الكتاب المدرسي هو المرجع (authored غير مضبوط أو غير موجود).
 *  - الكتل المعلَّمة بـ authored:true هي شرح موسّع بأسلوب المعلّم حول المصدر، وليست
 *    من نص الكتاب، ويظهر عليها في الواجهة وسم «شرح الأستاذ».
 *  - أي بند لم يُقرأ من الصورة بثقة كاملة وُضع عليه verifyNote: «يُرجى التحقق من الصورة الأصلية».
 */
export const lesson02Data: LessonData = {
  id: 'lesson-2',
  number: 2,
  unitId: 'unit-1',
  unitTitle: 'الوحدة الأولى: الأعداد العادية والعمليات عليها',
  title: 'الضرب',
  description:
    'قاعدة ضرب الكسور العادية والأعداد، إشارة الجداء، ضرب المقادير الحرفية، النشر والخاصة التوزيعية، والتحليل، مع تحقق وتدرّب واختبار شامل.',
  sourcePages: [8, 9, 10, 11],
  steps: [
    /* ================================================================== */
    /* الخطوة 1 — نشاط (صفحة 8)                                            */
    /* ================================================================== */
    {
      id: 'step-1',
      title: 'نشاط: تمديد قاعدة الضرب لتشمل الكسور',
      subtitle: 'استكشاف قاعدة ضرب كسرين عاديين عبر أربع حالات مختلفة الإشارات',
      sourcePages: [8],
      blocks: [
        {
          id: 'l2-p8-intro',
          type: 'teach',
          authored: true,
          title: 'قبل أن نبدأ: ماذا سنتعلّم في هذا الدرس؟',
          sourceRef: { page: 8, section: 'مدخل الأستاذ' },
          content:
            'تعلّمنا في الدرس السابق **الجمع والطرح** على الكسور. في هذا الدرس ننتقل إلى **الضرب**. الفكرة المركزية بسيطة وجميلة: لضرب كسرين نضرب البسط في البسط والمقام في المقام مباشرةً — دون توحيد المقامات. سنكتشف هذه القاعدة بأنفسنا في النشاط الآتي، ثم نتعلّم إشارة الجداء، وضرب المقادير الحرفية، والنشر والتحليل.',
        },
        {
          id: 'l2-p8-act-header',
          type: 'activity',
          title: 'نشاط: تمديد الأعداد العادية بالقاعدة',
          sourceRef: { page: 8, section: 'نشاط', item: 'المدخل' },
          content:
            'تمديد الأعداد العادية بالقاعدة $\\frac{a}{b} \\times \\frac{c}{d} = \\frac{a \\times c}{b \\times d}$.',
        },
        {
          id: 'l2-p8-act-1',
          type: 'activity',
          title: '1. احسب الناتج ثم تحقق بالكسور العشرية',
          sourceRef: { page: 8, section: 'نشاط', item: '1' },
          content:
            'في كلّ من الحالات الآتية، احسب الناتج مستعملاً العمليات على الكسور العادية، ثمّ تحقق باستعمال العمليات على الكسور العشرية.',
          subItems: [
            {
              label: '①',
              text: 'الحالة الأولى:',
              math: '\\frac{3}{4} \\times \\frac{7}{5}',
              solution: '\\frac{3}{4} \\times \\frac{7}{5} = \\frac{3 \\times 7}{4 \\times 5} = \\frac{21}{20}',
              explanation:
                'بالكسور العشرية: $0.75 \\times 1.4 = 1.05 = \\frac{21}{20}$، فالناتجان متطابقان.',
            },
            {
              label: '②',
              text: 'الحالة الثانية:',
              math: '\\frac{-3}{4} \\times \\frac{7}{5}',
              solution: '\\frac{-3}{4} \\times \\frac{7}{5} = \\frac{-3 \\times 7}{4 \\times 5} = \\frac{-21}{20} = -\\frac{21}{20}',
              explanation:
                'موجب في سالب يعطي سالبًا. بالعشري: $(-0.75) \\times 1.4 = -1.05$.',
            },
            {
              label: '③',
              text: 'الحالة الثالثة:',
              math: '\\frac{3}{4} \\times \\frac{-7}{-5}',
              solution: '\\frac{3}{4} \\times \\frac{-7}{-5} = \\frac{3}{4} \\times \\frac{7}{5} = \\frac{21}{20}',
              explanation:
                'الكسر $\\frac{-7}{-5}$ يساوي $\\frac{7}{5}$ (سالب على سالب = موجب)، فالناتج $\\frac{21}{20}$.',
            },
            {
              label: '④',
              text: 'الحالة الرابعة:',
              math: '\\frac{3}{-4} \\times \\left(-\\frac{7}{5}\\right)',
              solution: '\\frac{3}{-4} \\times \\left(-\\frac{7}{5}\\right) = \\left(-\\frac{3}{4}\\right) \\times \\left(-\\frac{7}{5}\\right) = \\frac{21}{20}',
              explanation:
                'سالب في سالب = موجب، فالناتج $\\frac{21}{20}$.',
            },
          ],
        },
        {
          id: 'l2-p8-act-2',
          type: 'activity',
          title: '2. أعطِ قاعدة لضرب كسرين عاديين',
          sourceRef: { page: 8, section: 'نشاط', item: '2' },
          content:
            'أعطِ قاعدة لضرب كسرين عاديين. (لاحظ من الحالات السابقة أنّ البسط يُضرب في البسط، والمقام في المقام، وأنّ إشارة الناتج تتبع قاعدة ضرب الإشارات.)',
        },
        {
          id: 'l2-p8-explorer',
          type: 'interactive-exercise',
          authored: true,
          title: 'مختبر تفاعلي: اكتشف قاعدة ضرب الكسور',
          sourceRef: { page: 8, section: 'شرح الأستاذ', item: 'محاكاة' },
          content:
            'غيّر بسطَي ومقامَي الكسرين وإشارتيهما، ولاحظ كيف يتشكّل الناتج من ضرب البسطين وضرب المقامين، ثم كيف يُختصر. حاول أن تكتشف القاعدة بنفسك قبل قراءة «تعلّم».',
          interactiveType: 'fraction-multiply',
          interactiveData: {
            initial: { n1: 3, d1: 4, n2: 7, d2: 5 },
          },
        },
      ],
    },

    /* ================================================================== */
    /* الخطوة 2 — تعلّم: خاصة ضرب الكسور + أمثلة (صفحة 8)                   */
    /* ================================================================== */
    {
      id: 'step-2',
      title: 'تعلّم: خاصة ضرب كسرين عاديين',
      subtitle: 'القاعدة الأساسية مع أمثلة الكتاب المحلولة والاختصار قبل الضرب',
      sourcePages: [8],
      blocks: [
        {
          id: 'l2-p8-learn-rule',
          type: 'learn',
          title: 'تعلّم — خاصة',
          sourceRef: { page: 8, section: 'تعلّم', item: 'خاصة' },
          content:
            'جداء ضرب كسرين عاديين هو كسر، بسطه يساوي جداء ضرب البسطين، ومقامه يساوي جداء ضرب المقامين.',
          subItems: [
            {
              label: 'القاعدة العامة',
              text: 'حيث $b \\neq 0$ و $d \\neq 0$:',
              math: '\\frac{a}{b} \\times \\frac{c}{d} = \\frac{a \\times c}{b \\times d}',
            },
            {
              label: 'حالة خاصة: ضرب عدد في كسر',
              text: 'العدد الصحيح $h$ يُكتب $\\frac{h}{1}$، ومنه:',
              math: 'h \\times \\frac{c}{d} = \\frac{h \\times c}{d}',
            },
          ],
        },
        {
          id: 'l2-p8-insight-why',
          type: 'insight',
          authored: true,
          title: 'لماذا نضرب البسط في البسط والمقام في المقام؟',
          sourceRef: { page: 8, section: 'شرح الأستاذ', item: 'البصيرة' },
          content:
            'فكّر في $\\frac{3}{4} \\times \\frac{2}{3}$ على أنّها «$\\frac{3}{4}$ من $\\frac{2}{3}$». تقسيم قطعة إلى $3$ أجزاء ثم أخذ جزأين يعطي $\\frac{2}{3}$، ثم أخذ ثلاثة أرباع ذلك يقسّم كل جزء ثانيةً إلى $4$. عدد القطع الصغيرة في الأسفل هو $4 \\times 3$ (المقامان)، وعدد ما أخذناه في الأعلى هو $3 \\times 2$ (البسطان). لذلك: بسط × بسط، ومقام × مقام.',
        },
        {
          id: 'l2-p8-example-1',
          type: 'example',
          title: 'مثال 1',
          sourceRef: { page: 8, section: 'أمثلة', item: 'مثال 1' },
          content: 'ضرب كسرين بإشارتين مختلفتين:',
          mathFormula: '\\frac{-5}{7} \\times \\frac{3}{4} = \\frac{-5 \\times 3}{7 \\times 4} = \\frac{-15}{28} = -\\frac{15}{28}',
          explanation: 'نضرب البسط في البسط ($-5 \\times 3 = -15$) والمقام في المقام ($7 \\times 4 = 28$).',
        },
        {
          id: 'l2-p8-example-2',
          type: 'example',
          title: 'مثال 2',
          sourceRef: { page: 8, section: 'أمثلة', item: 'مثال 2' },
          content: 'ضرب عدد صحيح في كسر (الحالة الخاصة):',
          mathFormula: '-2 \\times \\frac{-5}{7} = \\frac{-2 \\times (-5)}{7} = \\frac{10}{7}',
          explanation: 'نكتب $-2 = \\frac{-2}{1}$، وسالب في سالب يعطي موجبًا: $-2 \\times (-5) = 10$.',
        },
        {
          id: 'l2-p8-example-3',
          type: 'example',
          title: 'مثال 3 (مع الإشارة والاختصار)',
          sourceRef: { page: 8, section: 'أمثلة', item: 'مثال 3' },
          content: 'لإنجاز العملية $\\frac{-1}{2} \\times \\frac{4}{-5}$:',
          subItems: [
            {
              label: 'الخطوة 1: إشارة الجداء',
              text: 'نضع أولاً إشارة الجداء (جداء ضرب عددين سالبين عددٌ موجب).',
            },
            {
              label: 'الخطوة 2: لا نغفل الاختصار',
              text: 'ثم نضرب مع الاختصار:',
              math: '\\frac{-1}{2} \\times \\frac{4}{-5} = \\frac{1}{2} \\times \\frac{4}{5} = \\frac{1 \\times \\overset{2}{\\cancel{4}}}{\\underset{1}{\\cancel{2}} \\times 5} = \\frac{2}{5}',
            },
          ],
        },
        {
          id: 'l2-p8-example-4',
          type: 'example',
          title: 'مثال 4 (الحساب بعد الاختصار)',
          sourceRef: { page: 8, section: 'أمثلة', item: 'مثال 4' },
          content: 'نختصر قبل إتمام الضرب لتبسيط الحساب:',
          mathFormula: '\\frac{2}{15} \\times \\frac{-21}{14} = -\\frac{2 \\times 21}{15 \\times 14} = -\\frac{\\cancel{2} \\times \\cancel{3} \\times 7}{\\cancel{3} \\times 5 \\times \\cancel{2} \\times 7} = -\\frac{1}{5}',
          explanation:
            'نحلّل الأعداد إلى عواملها ($21 = 3 \\times 7$، $15 = 3 \\times 5$، $14 = 2 \\times 7$)، ثم نختصر العوامل المشتركة $2$ و $3$ و $7$ فيبقى $-\\frac{1}{5}$.',
        },
        {
          id: 'l2-p8-example-5',
          type: 'example',
          title: 'مثال 5 (مسألة الحلوى)',
          sourceRef: { page: 8, section: 'أمثلة', item: 'مثال 5' },
          content:
            'أكلتَ ثلاثة أرباع قطعة من الحلوى، وكانت تلك القطعة ثُلثَي قالب. أكلتَ إذن نصف قالب الحلوى.',
          mathFormula: '\\frac{3}{4} \\times \\frac{2}{3} = \\frac{\\cancel{3} \\times 2}{4 \\times \\cancel{3}} = \\frac{2}{4} = \\frac{1}{2}',
          explanation: 'نختصر العامل $3$ من البسط والمقام، فيبقى $\\frac{2}{4} = \\frac{1}{2}$: أي نصف قالب.',
        },
        {
          id: 'l2-p8-tip-simplify',
          type: 'tip',
          authored: true,
          title: 'نصيحة الأستاذ: اختصر قبل أن تضرب',
          sourceRef: { page: 8, section: 'شرح الأستاذ', item: 'نصيحة' },
          content:
            'الاختصار قبل الضرب يجعل الأعداد صغيرة وسهلة. مثلًا في $\\frac{2}{15} \\times \\frac{21}{14}$ لو ضربنا مباشرةً لحصلنا على $\\frac{42}{210}$ ثم اختصرنا بصعوبة، أمّا الاختصار المبكّر للعوامل المشتركة فيوصلنا فورًا إلى $\\frac{1}{5}$.',
        },
      ],
    },

    /* ================================================================== */
    /* الخطوة 3 — اكتساب معارف: صيغ مبسطة + ضرب المقادير الحرفية (صفحة 9)  */
    /* ================================================================== */
    {
      id: 'step-3',
      title: 'اكتساب معارف: صيغ مبسّطة وضرب المقادير الحرفية',
      subtitle: 'كتابة الجداءات بصيغة مبسّطة، وكيفية إنجاز ضرب فيه حرف',
      sourcePages: [9],
      blocks: [
        {
          id: 'l2-p9-simplified-forms',
          type: 'knowledge',
          title: 'صيغ مبسّطة',
          sourceRef: { page: 9, section: 'صيغ مبسطة' },
          content:
            'يُكتب $(-4) \\times (-6)$ بالصيغة $-6 \\times (-4)$، ويُكتب $(-6) \\times 4$ و $(-4) \\times 6$ بالصيغتين $-6 \\times 4$ و $-4 \\times 6$.',
          verifyNote:
            'الترتيب الدقيق للأعداد داخل هذا البند (صيغ مبسّطة) عند حافة الوضوح في الصورة — يُرجى التحقق من الصورة الأصلية.',
        },
        {
          id: 'l2-p9-tip-letter',
          type: 'tip',
          title: 'ملاحظة: حذف إشارة الضرب مع الحرف',
          sourceRef: { page: 9, section: 'صيغ مبسطة', item: 'ملاحظة' },
          content:
            'قد لا نكتب الإشارة $\\times$ عندما يكون أحد المضروبين حرفًا، مثلًا $b \\times c$ يُكتب $bc$، و $6 \\times h$ يُكتب $6h$.',
        },
        {
          id: 'l2-p9-knowledge-header',
          type: 'knowledge',
          title: 'اكتساب معارف — كيف ننجز عملية ضرب؟',
          sourceRef: { page: 9, section: 'اكتساب معارف', item: 'كيف ننجز عملية ضرب؟' },
          content:
            'لإنجاز جداء من النمط $-5 \\times 4x$، نجري أولاً ضرب المعاملات العددية $-5$ و $4$، ثم نكتب الحرف $x$.',
        },
        {
          id: 'l2-p9-example-letters',
          type: 'example',
          title: 'مثال: أنجز كلاً من العمليات الآتية',
          sourceRef: { page: 9, section: 'اكتساب معارف', item: 'مثال' },
          content:
            'ننجز كلّ جداء بضرب المعاملات العددية أولاً ثم إلحاق الحرف، مع التقيّد بقاعدة ضرب الإشارات.',
          subItems: [
            {
              label: '1',
              text: 'الجداء الأول $(-3x) \\times (-6)$:',
              math: '(-3) \\times (-6) = 18 \\;\\Rightarrow\\; (-3x) \\times (-6) = 18x',
              explanation: 'نضرب المعاملين العدديين مع قاعدة الإشارات ($-3 \\times -6 = 18$)، ثم نضع الرمز $x$.',
            },
            {
              label: '2',
              text: 'الجداء الثاني $-(-2) \\times 3 \\times (-7y)$:',
              math: '-(-2) \\times 3 \\times (-7) = -42 \\;\\Rightarrow\\; -(-2) \\times 3 \\times (-7y) = -42y',
              explanation: 'نضرب المعاملات العددية مع قاعدة الإشارات فنحصل على $-42$، ثم نضع الرمز $y$.',
            },
            {
              label: '3',
              text: 'الجداء الثالث $-(5 \\times 4z)$:',
              math: '-(5 \\times 4) = -20 \\;\\Rightarrow\\; -(5 \\times 4z) = -20z',
              explanation: 'نضرب المعاملات العددية مع قاعدة الإشارات فنحصل على $-20$، ثم نضع الرمز $z$.',
            },
          ],
        },
        {
          id: 'l2-p9-teach-method',
          type: 'teach',
          authored: true,
          title: 'شرح الأستاذ: خطوتان دائمًا',
          sourceRef: { page: 9, section: 'شرح الأستاذ' },
          content:
            'أي جداء فيه حرف نعالجه بخطوتين ثابتتين: **(1)** اضرب الأعداد وحدها وحدّد الإشارة بعناية، **(2)** ألحق الحرف (أو الحروف) بالناتج. الحرف مجرد «راكب» لا يشارك في الحساب العددي. تذكّر أن $-(5 \\times 4z)$ تعني أنّ الإشارة السالبة تضرب كامل الجداء $5 \\times 4z$.',
        },
      ],
    },

    /* ================================================================== */
    /* الخطوة 4 — إشارة الجداء (صفحة 9)                                    */
    /* ================================================================== */
    {
      id: 'step-4',
      title: 'إشارة الجداء',
      subtitle: 'كيف نعرف إشارة جداء عدة أعداد دون إتمام الحساب',
      sourcePages: [9],
      blocks: [
        {
          id: 'l2-p9-sign-rule',
          type: 'learn',
          title: 'كيف تعرف إشارة جداء؟',
          sourceRef: { page: 9, section: 'اكتساب معارف', item: 'كيف تعرف إشارة جداء؟' },
          content: 'عند ضرب عدة أعداد مغايرة للصفر:',
          subItems: [
            {
              label: 'عدد الأعداد السالبة زوجي',
              text: 'إذا كان عدد الأعداد السالبة زوجيًا، كان الجداء موجبًا.',
            },
            {
              label: 'عدد الأعداد السالبة فردي',
              text: 'إذا كان عدد الأعداد السالبة فرديًا، كان الجداء سالبًا.',
            },
          ],
        },
        {
          id: 'l2-p9-sign-example',
          type: 'example',
          title: 'مثال: إشارة الجداء',
          sourceRef: { page: 9, section: 'اكتساب معارف', item: 'مثال الإشارة' },
          content: 'نَعُدّ الأعداد السالبة فقط:',
          subItems: [
            {
              label: 'جداء إشارته سالبة',
              text: 'فيه خمسة أعداد سالبة (عددٌ فردي):',
              math: '(-24) \\times (-33.3) \\times (-20) \\times (-3) \\times (20.87) \\times (-5)',
              explanation: 'الأعداد السالبة: $-24,\\ -33.3,\\ -20,\\ -3,\\ -5$ وعددها $5$ (فردي) فالجداء سالب.',
            },
            {
              label: 'جداء إشارته موجبة',
              text: 'فيه عددان سالبان (عددٌ زوجي):',
              math: '(-3) \\times (-4) \\times (2) \\times 5 \\times 3',
              explanation: 'الأعداد السالبة: $-3,\\ -4$ وعددها $2$ (زوجي) فالجداء موجب.',
            },
          ],
        },
        {
          id: 'l2-p9-sign-explorer',
          type: 'interactive-exercise',
          authored: true,
          title: 'مختبر تفاعلي: توقّع إشارة الجداء',
          sourceRef: { page: 9, section: 'شرح الأستاذ', item: 'محاكاة' },
          content:
            'بدّل إشارات الأعداد، ثم توقّع إشارة الجداء قبل أن تكشفها. المختبر يعُدّ الأعداد السالبة ويوضّح لماذا كانت الإشارة موجبة أو سالبة.',
          interactiveType: 'sign-product',
          interactiveData: {
            initial: [-24, -33.3, -20, -3, 20.87, -5],
          },
        },
        {
          id: 'l2-p9-sign-insight',
          type: 'insight',
          authored: true,
          title: 'لماذا الزوجي موجب والفردي سالب؟',
          sourceRef: { page: 9, section: 'شرح الأستاذ', item: 'البصيرة' },
          content:
            'كل سالبَين متجاورَين يُلغيان إشارتيهما ($- \\times - = +$). فإذا كان عدد السوالب زوجيًا انطفأت كلها بأزواج وبقيت الإشارة موجبة، وإذا كان فرديًا بقي سالبٌ واحد بلا شريك فتكون الإشارة سالبة. القيَم العددية لا تؤثّر في الإشارة إطلاقًا.',
        },
      ],
    },

    /* ================================================================== */
    /* الخطوة 5 — النشر والخاصة التوزيعية (صفحة 10)                        */
    /* ================================================================== */
    {
      id: 'step-5',
      title: 'كيف ننشر عبارة ونبسّطها؟ (الخاصة التوزيعية)',
      subtitle: 'توزيع الضرب على الجمع والطرح مع أمثلة الكتاب',
      sourcePages: [10],
      blocks: [
        {
          id: 'l2-p10-expand-box',
          type: 'learn',
          title: 'نشر: توزيع الضرب على الجمع',
          sourceRef: { page: 10, section: 'كيف ننشر عبارة ونبسطها؟' },
          content: 'في هذا النشر نعتمد على ما يسمّى الخاصة التوزيعية (توزيع الضرب على الجمع).',
          subItems: [
            {
              label: 'نشر على مجموع',
              text: 'ضرب عدد في مجموع:',
              math: 'a \\times (x + y) = ax + ay',
            },
            {
              label: 'نشر على فرق',
              text: 'ضرب عدد في فرق:',
              math: 'a \\times (x - y) = ax - ay',
            },
          ],
        },
        {
          id: 'l2-p10-teach-distribute',
          type: 'teach',
          authored: true,
          title: 'شرح الأستاذ: ماذا يعني «التوزيع»؟',
          sourceRef: { page: 10, section: 'شرح الأستاذ' },
          content:
            'النشر يعني أن العامل خارج القوس «يزور» كل حدٍّ داخل القوس ويضربه على حدة. انتبه جيدًا للإشارات: إذا كان العامل سالبًا فإنه يقلب إشارة كل حدٍّ يضربه. لهذا $-5 \\times (-4y)$ ينتج $+20y$ وليس $-20y$.',
        },
        {
          id: 'l2-p10-expand-example',
          type: 'example',
          title: 'مثال: انشر ثم أنجز العمليات',
          sourceRef: { page: 10, section: 'مثال النشر' },
          content: 'ننشر كلّ عبارة بتوزيع العامل على حدَّي القوس مع مراعاة الإشارات:',
          subItems: [
            {
              label: '①',
              text: 'العبارة $A = -3 \\times (4 + 5x)$:',
              math: 'A = -3 \\times (4 + 5x) = (-3) \\times 4 + (-3) \\times 5x = -12 - 15x',
            },
            {
              label: '②',
              text: 'العبارة $B = -5 \\times (3 - 4y)$:',
              math: 'B = -5 \\times (3 - 4y) = -5 \\times 3 - (-5) \\times 4y = -15 + 20y',
            },
            {
              label: '③',
              text: 'العبارة $C = -4 \\times (-5 + 3z)$:',
              math: 'C = -4 \\times (-5 + 3z) = (-4) \\times (-5) + (-4) \\times 3z = 20 - 12z',
            },
          ],
        },
        {
          id: 'l2-p10-expand-interactive',
          type: 'interactive-exercise',
          authored: true,
          title: 'مختبر تفاعلي: انشر خطوة بخطوة',
          sourceRef: { page: 10, section: 'شرح الأستاذ', item: 'محاكاة' },
          content:
            'اختر قيم العامل والحدَّين داخل القوس، وشاهد كيف يتوزّع الضرب على كل حدٍّ وكيف تتحدّد إشارة كل ناتج.',
          interactiveType: 'distributive',
          interactiveData: {
            initial: { a: -3, x: 4, y: 5, op: '+', varName: 'x' },
          },
        },
      ],
    },

    /* ================================================================== */
    /* الخطوة 6 — التحليل (صفحة 10)                                        */
    /* ================================================================== */
    {
      id: 'step-6',
      title: 'كيف نحلّل عبارة ونبسّطها؟ (التحليل)',
      subtitle: 'إخراج العامل المشترك — العملية العكسية للنشر',
      sourcePages: [10],
      blocks: [
        {
          id: 'l2-p10-factor-box',
          type: 'learn',
          title: 'تحليل: إخراج العامل المشترك',
          sourceRef: { page: 10, section: 'كيف نحلل عبارة ونبسطها؟' },
          content: 'التحليل هو العملية العكسية للنشر: نُخرج العامل المشترك $h$ خارج القوس.',
          subItems: [
            {
              label: 'تحليل مجموع',
              text: 'مجموع فيه عامل مشترك:',
              math: 'hx + hy = h \\times (x + y)',
            },
            {
              label: 'تحليل فرق',
              text: 'فرق فيه عامل مشترك:',
              math: 'hx - hy = h \\times (x - y)',
            },
          ],
        },
        {
          id: 'l2-p10-factor-example',
          type: 'example',
          title: 'مثال: حلّل العبارة ثم بسّطها',
          sourceRef: { page: 10, section: 'مثال التحليل' },
          content: 'حلّل العبارة $A = 2x - 5x$، ثمّ بسّطها.',
          subItems: [
            {
              label: 'التحليل',
              text: 'العامل المشترك هو $x$:',
              math: '2x - 5x = 2 \\times x - 5 \\times x = (2 - 5) \\times x',
            },
            {
              label: 'التبسيط',
              text: 'ثم نبسّط الناتج:',
              math: 'A = (2 - 5) \\times x = -3x',
            },
          ],
        },
        {
          id: 'l2-p10-factor-insight',
          type: 'insight',
          authored: true,
          title: 'النشر والتحليل: طريقان متعاكسان',
          sourceRef: { page: 10, section: 'شرح الأستاذ', item: 'البصيرة' },
          content:
            'النشر يفتح القوس: $h(x + y) \\rightarrow hx + hy$. والتحليل يعيد القوس: $hx + hy \\rightarrow h(x + y)$. إن حلّلت عبارةً ثم نشرتها عدت إلى نقطة البداية تمامًا. لتتحقق من تحليلك، انشر ناتجك ويجب أن تعود إلى العبارة الأصلية.',
        },
        {
          id: 'l2-p10-factor-check',
          type: 'interactive-exercise',
          authored: true,
          title: 'تمرين تفاعلي: طابِق النشر بالتحليل',
          sourceRef: { page: 10, section: 'شرح الأستاذ', item: 'تمرين' },
          content:
            'أمامك عبارات؛ اختر الشكل المكافئ لكلٍّ منها (منشورًا أو محلَّلًا) ثم اضغط «تحقق». الملاحظات هادئة ومختصرة تساعدك على التعلّم.',
          interactiveType: 'practice-check',
          interactiveData: {
            questions: [
              {
                prompt: 'ما ناتج نشر $3 \\times (x + 2)$؟',
                choices: ['3x + 2', '3x + 6', 'x + 6', '3x + 5'],
                correctIndex: 1,
                explain: 'نوزّع: $3 \\times x + 3 \\times 2 = 3x + 6$.',
              },
              {
                prompt: 'ما تحليل العبارة $5a + 5b$؟',
                choices: ['5(a + b)', '5a + b', '10(a + b)', 'a(5 + b)'],
                correctIndex: 0,
                explain: 'العامل المشترك $5$: $5a + 5b = 5(a + b)$.',
              },
              {
                prompt: 'بسّط $7x - 2x$ بالتحليل.',
                choices: ['9x', '5x', '5', '14x'],
                correctIndex: 1,
                explain: '$7x - 2x = (7 - 2)x = 5x$.',
              },
            ],
          },
        },
      ],
    },

    /* ================================================================== */
    /* الخطوة 7 — تحقق من فهمك (صفحتا 10 و 11)                             */
    /* ================================================================== */
    {
      id: 'step-7',
      title: 'تحقق من فهمك',
      subtitle: 'إشارة الجداء وحسابه، والحساب الذهني واليدوي',
      sourcePages: [10, 11],
      blocks: [
        {
          id: 'l2-p10-check-1',
          type: 'check',
          title: '① أوجد إشارة كل جداء ثمّ احسبه',
          sourceRef: { page: 10, section: 'تحقق من فهمك', item: '①' },
          content: 'أوجد إشارة كل جداء ثمّ احسبه.',
          subItems: [
            {
              label: '①',
              text: 'الجداء الأول:',
              math: '\\frac{5}{-4} \\times \\frac{-9}{13}',
              solution: '\\frac{5}{-4} \\times \\frac{-9}{13} = \\frac{5}{4} \\times \\frac{9}{13} = \\frac{45}{52}',
              explanation: 'سالب في سالب = موجب. الناتج $+\\frac{45}{52}$.',
            },
            {
              label: '②',
              text: 'الجداء الثاني:',
              math: '\\frac{-25}{11} \\times \\frac{9}{4}',
              solution: '\\frac{-25}{11} \\times \\frac{9}{4} = \\frac{-25 \\times 9}{11 \\times 4} = -\\frac{225}{44}',
              explanation: 'سالب في موجب = سالب. الناتج $-\\frac{225}{44}$.',
            },
            {
              label: '③',
              text: 'الجداء الثالث:',
              math: '\\frac{0}{7} \\times \\frac{-3}{4}',
              solution: '\\frac{0}{7} \\times \\frac{-3}{4} = \\frac{0 \\times (-3)}{7 \\times 4} = \\frac{0}{28} = 0',
              explanation: 'أي عدد مضروب في صفر يساوي صفرًا.',
            },
          ],
        },
        {
          id: 'l2-p10-check-2',
          type: 'check',
          title: '② أعطِ إشارة الجداء دون إنجاز الحساب',
          sourceRef: { page: 10, section: 'تحقق من فهمك', item: '②' },
          content: 'أعطِ إشارة الجداء دون إنجاز الحساب (نَعُدّ الأعداد السالبة فقط).',
          subItems: [
            {
              label: '①',
              text: 'الجداء الأول:',
              math: '-4 \\times 4 \\times 7.4',
              solution: '\\text{عدد السوالب} = 1 \\;(\\text{فردي}) \\Rightarrow \\text{الإشارة سالبة}',
              explanation: 'فيه عدد سالب واحد ($-4$)، والعدد فردي فالجداء سالب.',
            },
            {
              label: '②',
              text: 'الجداء الثاني:',
              math: '-2 \\times (-21.4) \\times (-10)',
              solution: '\\text{عدد السوالب} = 3 \\;(\\text{فردي}) \\Rightarrow \\text{الإشارة سالبة}',
              explanation: 'فيه ثلاثة أعداد سالبة، والعدد فردي فالجداء سالب.',
            },
            {
              label: '③',
              text: 'الجداء الثالث:',
              math: '-2 \\, (-1.55) \\times (-2) \\times 77 \\times 18 \\times (-0.14)(-0.12)',
              solution: '\\text{عدد السوالب} = 5 \\;(\\text{فردي}) \\Rightarrow \\text{الإشارة سالبة}',
              explanation: 'الأعداد السالبة: $-2,\\ -1.55,\\ -2,\\ -0.14,\\ -0.12$ وعددها $5$ (فردي) فالجداء سالب.',
              verifyNote:
                'تركيب هذا الجداء وعدد أقواسه دقيق ومزدحم في الصورة — يُرجى التحقق من الصورة الأصلية للأعداد بالضبط.',
            },
          ],
        },
        {
          id: 'l2-p11-check-mental',
          type: 'check',
          title: '③ احسب ذهنيًا',
          sourceRef: { page: 11, section: 'تحقق من فهمك', item: '③' },
          content: 'احسب ذهنيًا (دون كتابة العمليات).',
          subItems: [
            {
              label: '①',
              text: 'اضرب:',
              math: '(-5) \\times 5',
              solution: '(-5) \\times 5 = -25',
              explanation: 'سالب في موجب = سالب.',
            },
            {
              label: '②',
              text: 'اضرب:',
              math: '4 \\times (-12)',
              solution: '4 \\times (-12) = -48',
              explanation: 'موجب في سالب = سالب.',
            },
            {
              label: '③',
              text: 'اضرب:',
              math: '(-9) \\times (-6)',
              solution: '(-9) \\times (-6) = 54',
              explanation: 'سالب في سالب = موجب.',
            },
          ],
        },
        {
          id: 'l2-p11-check-manual',
          type: 'check',
          title: '④ احسب يدويًا',
          sourceRef: { page: 11, section: 'تحقق من فهمك', item: '④' },
          content: 'احسب يدويًا (دون استعمال الآلة الحاسبة).',
          subItems: [
            {
              label: '①',
              text: 'اضرب:',
              math: '(-2.4) \\times (-5.5)',
              solution: '(-2.4) \\times (-5.5) = 13.2',
              explanation: 'سالب في سالب = موجب: $2.4 \\times 5.5 = 13.2$.',
            },
            {
              label: '②',
              text: 'احسب الفرق:',
              math: '(-8.2) - (-4.5)',
              solution: '(-8.2) - (-4.5) = -8.2 + 4.5 = -3.7',
              explanation: 'طرح السالب يتحوّل إلى جمع.',
            },
            {
              label: '③',
              text: 'اضرب:',
              math: '(-8.2) \\times (-4.5)',
              solution: '(-8.2) \\times (-4.5) = 36.9',
              explanation: 'سالب في سالب = موجب: $8.2 \\times 4.5 = 36.9$.',
            },
          ],
        },
        {
          id: 'l2-p11-terms',
          type: 'tip',
          title: 'مصطلحات',
          sourceRef: { page: 11, section: 'مصطلحات' },
          content:
            'الحساب اليدوي هو الحساب بإجراء العمليات المناسبة دون استعمال الآلة الحاسبة. الحساب الذهني هو الحساب بإجراء العمليات المناسبة ذهنيًا دون كتابة العمليات.',
        },
      ],
    },

    /* ================================================================== */
    /* الخطوة 8 — تدرّب (صفحة 11)                                          */
    /* ================================================================== */
    {
      id: 'step-8',
      title: 'تدرّب',
      subtitle: 'تمارين تدريبية شاملة على الضرب والاختصار والجداءات الحرفية',
      sourcePages: [11],
      blocks: [
        {
          id: 'l2-p11-practice-1',
          type: 'practice',
          title: '① احسب كلّ جداء بأبسط صيغة ممكنة',
          sourceRef: { page: 11, section: 'تدرّب', item: '①' },
          content: 'فيما يلي احسب كلّ جداء بأبسط صيغة ممكنة:',
          subItems: [
            {
              label: '①',
              text: 'الجداء الأول:',
              math: '\\frac{1}{3} \\times \\frac{12}{7}',
              solution: '\\frac{1}{3} \\times \\frac{12}{7} = \\frac{12}{21} = \\frac{4}{7}',
              explanation: 'نختصر بالقسمة على $3$: $\\frac{12}{21} = \\frac{4}{7}$.',
            },
            {
              label: '②',
              text: 'الجداء الثاني:',
              math: '\\frac{-2}{5} \\times \\frac{10}{3}',
              solution: '\\frac{-2}{5} \\times \\frac{10}{3} = \\frac{-20}{15} = -\\frac{4}{3}',
              explanation: 'نختصر بالقسمة على $5$: $\\frac{-20}{15} = -\\frac{4}{3}$.',
            },
            {
              label: '③',
              text: 'الجداء الثالث:',
              math: '\\frac{3}{-14} \\times \\frac{-7}{2}',
              solution: '\\frac{3}{-14} \\times \\frac{-7}{2} = \\frac{3}{14} \\times \\frac{7}{2} = \\frac{21}{28} = \\frac{3}{4}',
              explanation: 'سالب في سالب = موجب، ثم نختصر بالقسمة على $7$: $\\frac{21}{28} = \\frac{3}{4}$.',
            },
          ],
        },
        {
          id: 'l2-p11-practice-2',
          type: 'practice',
          title: '② أنجز كلاً من الجداءات الآتية',
          sourceRef: { page: 11, section: 'تدرّب', item: '②' },
          content: 'أنجز كلاً من الجداءات الآتية (اضرب المعاملات ثم ألحق الحرف).',
          subItems: [
            {
              label: '①',
              text: 'الجداء الأول:',
              math: '5y \\times (-8)',
              solution: '5y \\times (-8) = -40y',
              explanation: '$5 \\times (-8) = -40$، ثم نضع $y$.',
            },
            {
              label: '②',
              text: 'الجداء الثاني:',
              math: '(-7) \\times z \\times 3',
              solution: '(-7) \\times z \\times 3 = -21z',
              explanation: '$-7 \\times 3 = -21$، ثم نضع $z$.',
            },
            {
              label: '③',
              text: 'الجداء الثالث:',
              math: '-(-4 \\times 15x)',
              solution: '-(-4 \\times 15x) = 60x',
              explanation: '$-4 \\times 15 = -60$، والإشارة السالبة أمام الجداء تقلب الناتج إلى $+60x$.',
            },
          ],
        },
        {
          id: 'l2-p11-practice-3',
          type: 'practice',
          title: '③ احسب بأبسط صيغة مع مراعاة أنّ a = a/1',
          sourceRef: { page: 11, section: 'تدرّب', item: '③' },
          content: 'فيما يلي احسب كلّ جداء بأبسط صيغة ممكنة مع مراعاة أنّ $a = \\frac{a}{1}$:',
          subItems: [
            {
              label: '①',
              text: 'الجداء الأول:',
              math: '7 \\times \\frac{3}{8}',
              solution: '7 \\times \\frac{3}{8} = \\frac{7 \\times 3}{8} = \\frac{21}{8}',
              explanation: 'نكتب $7 = \\frac{7}{1}$: $\\frac{7 \\times 3}{1 \\times 8} = \\frac{21}{8}$.',
            },
            {
              label: '②',
              text: 'الجداء الثاني:',
              math: '\\frac{9}{16} \\times (-8)',
              solution: '\\frac{9}{16} \\times (-8) = \\frac{-72}{16} = -\\frac{9}{2}',
              explanation: 'نختصر بالقسمة على $8$: $\\frac{-72}{16} = -\\frac{9}{2}$.',
            },
            {
              label: '③',
              text: 'الجداء الثالث:',
              math: '\\frac{3}{10} \\times 50',
              solution: '\\frac{3}{10} \\times 50 = \\frac{150}{10} = 15',
              explanation: '$\\frac{3 \\times 50}{10} = \\frac{150}{10} = 15$.',
            },
            {
              label: '④',
              text: 'الجداء الرابع:',
              math: '-15 \\times \\frac{-2}{5}',
              solution: '-15 \\times \\frac{-2}{5} = \\frac{30}{5} = 6',
              explanation: 'سالب في سالب = موجب: $\\frac{15 \\times 2}{5} = \\frac{30}{5} = 6$.',
            },
          ],
        },
        {
          id: 'l2-p11-practice-4',
          type: 'practice',
          title: '④ عبّر بصيغة كسر عادي أو بصيغة عدد صحيح عمّا يلي',
          sourceRef: { page: 11, section: 'تدرّب', item: '④' },
          content: 'عبّر بصيغة كسر عادي أو بصيغة عدد صحيح عمّا يلي.',
          subItems: [
            {
              label: '①',
              text: '$\\frac{7}{12}$ من العدد $18$',
              solution: '\\frac{7}{12} \\times 18 = \\frac{7 \\times 18}{12} = \\frac{126}{12} = \\frac{21}{2}',
              explanation: 'نكتب $18 = \\frac{18}{1}$ ونضرب ثم نختصر بالقسمة على $6$.',
            },
            {
              label: '②',
              text: '$\\frac{7}{12}$ من الكسر $\\frac{5}{14}$',
              solution: '\\frac{7}{12} \\times \\frac{5}{14} = \\frac{35}{168} = \\frac{5}{24}',
              explanation: 'نختصر العامل $7$: $\\frac{7 \\times 5}{12 \\times 14} = \\frac{5}{24}$.',
            },
            {
              label: '③',
              text: '$-\\frac{2}{3}$ من الكسر $\\frac{9}{4}$',
              solution: '-\\frac{2}{3} \\times \\frac{9}{4} = -\\frac{18}{12} = -\\frac{3}{2}',
              explanation: 'سالب في موجب = سالب، ونختصر بالقسمة على $6$.',
            },
            {
              label: '④',
              text: '$\\frac{5}{2}$ من $\\frac{2}{3}$ العدد $18$',
              solution: '\\frac{2}{3} \\times 18 = 12, \\quad \\frac{5}{2} \\times 12 = 30',
              explanation: 'نحسب أولاً $\\frac{2}{3}$ من $18$ وهو $12$، ثم $\\frac{5}{2}$ من $12$ وهو $30$.',
            },
            {
              label: '⑤',
              text: '$\\frac{2}{5}$ من $\\frac{-25}{7}$ من العدد $18$',
              solution: '\\frac{-25}{7} \\times 18 = \\frac{-450}{7}, \\quad \\frac{2}{5} \\times \\frac{-450}{7} = \\frac{-900}{35} = -\\frac{180}{7}',
              explanation: 'نحسب $\\frac{-25}{7}$ من $18$، ثم $\\frac{2}{5}$ من الناتج، فنحصل على $-\\frac{180}{7}$.',
            },
          ],
        },
        {
          id: 'l2-p11-practice-5',
          type: 'practice',
          title: '⑤ ما رأيك بحساب باسم؟',
          sourceRef: { page: 11, section: 'تدرّب', item: '⑤' },
          content:
            'حسب باسم جداء ضرب الكسرين $\\frac{3}{4}$ و $\\frac{5}{2}$ كما يلي. ما رأيك بهذا الحساب؟',
          mathFormula: '\\frac{3}{4} \\times \\frac{5}{2} = \\frac{3}{4} \\times \\frac{10}{4} = \\frac{30}{4} = \\frac{15}{2}',
          subItems: [
            {
              label: 'الرأي والتصويب',
              text: 'حساب باسم خاطئ:',
              solution: '\\frac{3}{4} \\times \\frac{5}{2} = \\frac{3 \\times 5}{4 \\times 2} = \\frac{15}{8}',
              explanation:
                'ضرب الكسور لا يحتاج توحيد المقامات. وحّد باسم المقام فحوّل $\\frac{5}{2}$ إلى $\\frac{10}{4}$ (وهذا صحيح كقيمة)، لكنه بعدها ضرب البسط في البسط والمقام في المقام، فحصل على مقام $16$ ثم اختصره خطأً. الناتج الصحيح هو $\\frac{15}{8}$ وليس $\\frac{15}{2}$.',
            },
          ],
        },
      ],
    },
  ],

  /* ==================================================================== */
  /* الاختبار الشامل النهائي (أسئلة أصيلة تختبر مفاهيم الدرس)              */
  /* ==================================================================== */
  finalAssessment: {
    title: 'الاختبار الشامل — درس الضرب',
    description:
      'عشرة أسئلة أصيلة تقيس فهمك لضرب الكسور والأعداد، وإشارة الجداء، وضرب المقادير الحرفية، والنشر والتحليل. أجب بهدوء؛ ستظهر النتيجة والمراجعة في النهاية.',
    passThreshold: 70,
    questions: [
      {
        id: 'q1',
        type: 'mcq',
        concept: 'ضرب كسرين واختصار',
        relatedStepIndex: 1,
        prompt: 'ما ناتج الجداء الآتي بأبسط صورة؟',
        math: '\\frac{-2}{3} \\times \\frac{9}{10}',
        choices: [
          { id: 'a', text: '-\\frac{3}{5}' },
          { id: 'b', text: '\\frac{3}{5}' },
          { id: 'c', text: '-\\frac{18}{30}' },
          { id: 'd', text: '-\\frac{5}{3}' },
        ],
        correctId: 'a',
        answerDisplay: '-\\frac{2}{3} \\times \\frac{9}{10} = \\frac{-18}{30} = -\\frac{3}{5}',
        explanation:
          'سالب في موجب = سالب. نضرب: $\\frac{-2 \\times 9}{3 \\times 10} = \\frac{-18}{30}$، ثم نختصر بالقسمة على $6$ فنحصل على $-\\frac{3}{5}$. البديل $-\\frac{18}{30}$ صحيح القيمة لكنه غير مختصر.',
      },
      {
        id: 'q2',
        type: 'numeric',
        concept: 'ضرب كسرين واختصار',
        relatedStepIndex: 1,
        prompt: 'احسب الجداء الآتي بأبسط صورة (اكتب الناتج على شكل كسر مثل ‎-1/6‎):',
        math: '\\frac{4}{9} \\times \\frac{-3}{8}',
        acceptedAnswers: ['-1/6'],
        answerDisplay: '\\frac{4}{9} \\times \\frac{-3}{8} = \\frac{-12}{72} = -\\frac{1}{6}',
        explanation:
          'نضرب: $\\frac{4 \\times (-3)}{9 \\times 8} = \\frac{-12}{72}$، ثم نختصر بالقسمة على $12$ فنحصل على $-\\frac{1}{6}$.',
        hint: 'اختصر العوامل المشتركة قبل الضرب: $4$ مع $8$، و $3$ مع $9$.',
      },
      {
        id: 'q3',
        type: 'method-select',
        concept: 'إشارة الجداء',
        relatedStepIndex: 3,
        prompt: 'ما إشارة الجداء الآتي دون إتمام الحساب؟',
        math: '(-2) \\times (-5) \\times (-1) \\times 3',
        choices: [
          { id: 'a', text: '\\text{موجبة}' },
          { id: 'b', text: '\\text{سالبة}' },
          { id: 'c', text: '\\text{صفر}' },
          { id: 'd', text: '\\text{لا يمكن تحديدها}' },
        ],
        correctId: 'b',
        answerDisplay: '\\text{عدد السوالب} = 3 \\;(\\text{فردي}) \\Rightarrow \\text{سالبة}',
        explanation: 'الأعداد السالبة هي $-2, -5, -1$ وعددها $3$ (فردي)، فالجداء سالب.',
      },
      {
        id: 'q4',
        type: 'numeric',
        concept: 'ضرب عدد في كسر',
        relatedStepIndex: 1,
        prompt: 'احسب بأبسط صورة (اكتب الناتج على شكل كسر):',
        math: '6 \\times \\frac{-5}{4}',
        acceptedAnswers: ['-15/2'],
        answerDisplay: '6 \\times \\frac{-5}{4} = \\frac{-30}{4} = -\\frac{15}{2}',
        explanation:
          'نكتب $6 = \\frac{6}{1}$: $\\frac{6 \\times (-5)}{4} = \\frac{-30}{4}$، ثم نختصر بالقسمة على $2$ فنحصل على $-\\frac{15}{2}$.',
      },
      {
        id: 'q5',
        type: 'mcq',
        concept: 'ضرب المقادير الحرفية',
        relatedStepIndex: 2,
        prompt: 'بسّط الجداء الآتي:',
        math: '-3x \\times (-2)',
        choices: [
          { id: 'a', text: '6x' },
          { id: 'b', text: '-6x' },
          { id: 'c', text: '-5x' },
          { id: 'd', text: '6' },
        ],
        correctId: 'a',
        answerDisplay: '-3x \\times (-2) = (-3 \\times -2)\\,x = 6x',
        explanation: 'نضرب المعاملين: $-3 \\times -2 = 6$ (سالب في سالب = موجب)، ثم نلحق الحرف $x$.',
      },
      {
        id: 'q6',
        type: 'transformation',
        concept: 'النشر (الخاصة التوزيعية)',
        relatedStepIndex: 4,
        prompt: 'انشر العبارة الآتية (اكتب الناتج مثل ‎-6-8x‎):',
        math: '-2 \\times (3 + 4x)',
        acceptedAnswers: ['-6-8x'],
        answerDisplay: '-2 \\times (3 + 4x) = -6 - 8x',
        explanation:
          'نوزّع العامل $-2$ على الحدَّين: $-2 \\times 3 = -6$ و $-2 \\times 4x = -8x$، فالناتج $-6 - 8x$.',
        hint: 'العامل السالب يقلب إشارة كل حدٍّ داخل القوس.',
      },
      {
        id: 'q7',
        type: 'error-analysis',
        concept: 'النشر (إشارات)',
        relatedStepIndex: 4,
        prompt: 'كتب طالب النشر الآتي. أين الخطأ وما الصواب؟',
        math: '-5 \\times (2 - 3y) = -10 - 15y',
        choices: [
          { id: 'a', text: '\\text{لا خطأ، الناتج صحيح}' },
          { id: 'b', text: '\\text{الصواب } -10 + 15y' },
          { id: 'c', text: '\\text{الصواب } 10 - 15y' },
          { id: 'd', text: '\\text{الصواب } -10 - 8y' },
        ],
        correctId: 'b',
        answerDisplay: '-5 \\times (2 - 3y) = -10 + 15y',
        explanation:
          'الحدّ الثاني: $-5 \\times (-3y) = +15y$ (سالب في سالب = موجب)، فالناتج الصحيح $-10 + 15y$. أخطأ الطالب في إشارة الحد الثاني.',
      },
      {
        id: 'q8',
        type: 'mcq',
        concept: 'التحليل (العامل المشترك)',
        relatedStepIndex: 5,
        prompt: 'حلّل العبارة الآتية بإخراج العامل المشترك:',
        math: '7a + 7b',
        choices: [
          { id: 'a', text: '7(a + b)' },
          { id: 'b', text: '7a + b' },
          { id: 'c', text: '14(a + b)' },
          { id: 'd', text: 'a(7 + b)' },
        ],
        correctId: 'a',
        answerDisplay: '7a + 7b = 7(a + b)',
        explanation: 'العامل المشترك هو $7$. بإخراجه: $7a + 7b = 7 \\times (a + b)$. تحقّق بالنشر لتعود إلى الأصل.',
      },
      {
        id: 'q9',
        type: 'numeric',
        concept: 'التحليل والتبسيط',
        relatedStepIndex: 5,
        prompt: 'بسّط العبارة الآتية بالتحليل (اكتب الناتج مثل ‎-5x‎):',
        math: '4x - 9x',
        acceptedAnswers: ['-5x'],
        answerDisplay: '4x - 9x = (4 - 9)x = -5x',
        explanation: 'العامل المشترك $x$: $4x - 9x = (4 - 9)x = -5x$.',
      },
      {
        id: 'q10',
        type: 'mcq',
        concept: 'إشارة ضرب كسرين',
        relatedStepIndex: 3,
        prompt: 'إذا ضربنا كسرًا سالبًا في كسرٍ سالبٍ آخر، فإنّ إشارة الناتج تكون:',
        choices: [
          { id: 'a', text: '\\text{موجبة}' },
          { id: 'b', text: '\\text{سالبة}' },
          { id: 'c', text: '\\text{صفر}' },
          { id: 'd', text: '\\text{تعتمد على القيمة}' },
        ],
        correctId: 'a',
        answerDisplay: '(-)\\times(-) = (+)',
        explanation: 'سالب في سالب يعطي موجبًا دائمًا، بغضّ النظر عن القيَم العددية.',
      },
    ],
  },

  /* ==================================================================== */
  /* مساحة المدرّس (خلف بوابة كلمة مرور)                                   */
  /* ==================================================================== */
  teacherArea: {
    objectives: [
      'أن يطبّق الطالب قاعدة ضرب كسرين عاديين: بسط × بسط ومقام × مقام.',
      'أن يحدّد إشارة الجداء اعتمادًا على عدد الأعداد السالبة (زوجي/فردي).',
      'أن يُنجز ضرب المقادير الحرفية بضرب المعاملات العددية ثم إلحاق الحرف.',
      'أن ينشر عبارة باستعمال الخاصة التوزيعية مع الانتباه للإشارات.',
      'أن يحلّل عبارة بإخراج العامل المشترك، ويدرك أنّ التحليل عكس النشر.',
      'أن يميّز بين الحساب اليدوي والحساب الذهني.',
    ],
    commonMistakes: [
      {
        mistake: 'توحيد المقامات قبل ضرب الكسور (كما في حساب باسم بالتمرين الأخير).',
        correction: 'ضرب الكسور لا يحتاج توحيد المقامات؛ نضرب البسط في البسط والمقام في المقام مباشرةً.',
      },
      {
        mistake: 'الخطأ في إشارة الحد الثاني عند نشر عامل سالب، مثل كتابة $-5(2-3y)=-10-15y$.',
        correction: 'العامل السالب يقلب إشارة كل حدٍّ: $-5 \\times (-3y) = +15y$، فالصواب $-10+15y$.',
      },
      {
        mistake: 'إهمال الاختصار وترك الناتج بصيغة غير مبسّطة مثل $\\frac{-18}{30}$.',
        correction: 'نطلب دائمًا أبسط صورة: $\\frac{-18}{30} = -\\frac{3}{5}$.',
      },
      {
        mistake: 'الخلط في عدّ الأعداد السالبة عند تحديد الإشارة.',
        correction: 'نعُدّ الأعداد السالبة فقط: زوجيّها موجب وفرديّها سالب، والقيَم لا تؤثّر.',
      },
    ],
    remediation: [
      'للطالب الذي يخطئ في الإشارات: تدريب مركّز على قاعدة ضرب الإشارات ثم على مختبر «توقّع إشارة الجداء» في الخطوة 4.',
      'لمن يخلط النشر بالتحليل: استخدم المختبر التفاعلي في الخطوتين 5 و 6، واطلب التحقق بالنشر بعد كل تحليل.',
      'لمن ينسى الاختصار: اطلب دائمًا كتابة الناتج بأبسط صورة، ومقارنة الطريقة قبل/بعد الاختصار (مثال الخطوة 2).',
    ],
    teachingNotes: [
      'ابدأ بالنشاط (الخطوة 1) واترك الطلاب يكتشفون القاعدة قبل عرض «تعلّم».',
      'اربط مسألة الحلوى ($\\frac{3}{4} \\times \\frac{2}{3} = \\frac{1}{2}$) بمعنى «كسر من كسر» لترسيخ الحدس.',
      'شدّد على الخطوتين في ضرب المقادير الحرفية: احسب الأعداد أولًا، ثم ألحق الحرف.',
    ],
    assessmentGuidance: [
      'الاختبار الشامل مكوّن من 10 أسئلة، ونسبة النجاح المقترحة 70٪ (7 من 10).',
      'الأسئلة أصيلة لا تكرّر تمارين الكتاب؛ تغطّي جميع مفاهيم الدرس: الضرب، الإشارة، الحروف، النشر، التحليل.',
      'استخدم صفحة المراجعة النهائية لتحديد المفاهيم التي تحتاج معالجة لدى كل طالب عبر الروابط إلى خطوات الدرس.',
    ],
    answerKeys: [
      {
        section: 'تحقق من فهمك ① — إشارة الجداء وحسابه',
        source: 'الصفحة 10',
        items: [
          { ref: '①', answer: '\\frac{5}{-4} \\times \\frac{-9}{13} = +\\frac{45}{52}' },
          { ref: '②', answer: '\\frac{-25}{11} \\times \\frac{9}{4} = -\\frac{225}{44}' },
          { ref: '③', answer: '\\frac{0}{7} \\times \\frac{-3}{4} = 0' },
        ],
      },
      {
        section: 'تحقق من فهمك ② — إشارة الجداء دون حساب',
        source: 'الصفحة 10',
        items: [
          { ref: '①', answer: '\\text{سالبة (سالب واحد)}' },
          { ref: '②', answer: '\\text{سالبة (ثلاثة سوالب)}' },
          { ref: '③', answer: '\\text{سالبة (خمسة سوالب)}', note: 'تركيب البند دقيق في الصورة — يُرجى التحقق من الصورة الأصلية.' },
        ],
      },
      {
        section: 'تحقق من فهمك ③ و ④ — ذهني ويدوي',
        source: 'الصفحة 11',
        items: [
          { ref: '③①', answer: '(-5) \\times 5 = -25' },
          { ref: '③②', answer: '4 \\times (-12) = -48' },
          { ref: '③③', answer: '(-9) \\times (-6) = 54' },
          { ref: '④①', answer: '(-2.4) \\times (-5.5) = 13.2' },
          { ref: '④②', answer: '(-8.2) - (-4.5) = -3.7' },
          { ref: '④③', answer: '(-8.2) \\times (-4.5) = 36.9' },
        ],
      },
      {
        section: 'تدرّب ① — أبسط صيغة',
        source: 'الصفحة 11',
        items: [
          { ref: '①', answer: '\\frac{1}{3} \\times \\frac{12}{7} = \\frac{4}{7}' },
          { ref: '②', answer: '\\frac{-2}{5} \\times \\frac{10}{3} = -\\frac{4}{3}' },
          { ref: '③', answer: '\\frac{3}{-14} \\times \\frac{-7}{2} = \\frac{3}{4}' },
        ],
      },
      {
        section: 'تدرّب ② — جداءات حرفية',
        source: 'الصفحة 11',
        items: [
          { ref: '①', answer: '5y \\times (-8) = -40y' },
          { ref: '②', answer: '(-7) \\times z \\times 3 = -21z' },
          { ref: '③', answer: '-(-4 \\times 15x) = 60x' },
        ],
      },
      {
        section: 'تدرّب ③ — مع a = a/1',
        source: 'الصفحة 11',
        items: [
          { ref: '①', answer: '7 \\times \\frac{3}{8} = \\frac{21}{8}' },
          { ref: '②', answer: '\\frac{9}{16} \\times (-8) = -\\frac{9}{2}' },
          { ref: '③', answer: '\\frac{3}{10} \\times 50 = 15' },
          { ref: '④', answer: '-15 \\times \\frac{-2}{5} = 6' },
        ],
      },
      {
        section: 'تدرّب ④ — كسر من عدد/كسر',
        source: 'الصفحة 11',
        items: [
          { ref: '①', answer: '\\frac{7}{12} \\times 18 = \\frac{21}{2}' },
          { ref: '②', answer: '\\frac{7}{12} \\times \\frac{5}{14} = \\frac{5}{24}' },
          { ref: '③', answer: '-\\frac{2}{3} \\times \\frac{9}{4} = -\\frac{3}{2}' },
          { ref: '④', answer: '\\frac{2}{3} \\times 18 = 12, \\quad \\frac{5}{2} \\times 12 = 30' },
          { ref: '⑤', answer: '\\frac{-25}{7} \\times 18 = \\frac{-450}{7}, \\quad \\frac{2}{5} \\times \\frac{-450}{7} = -\\frac{180}{7}' },
        ],
      },
      {
        section: 'تدرّب ⑤ — حساب باسم',
        source: 'الصفحة 11',
        items: [
          { ref: '⑤', answer: '\\frac{3}{4} \\times \\frac{5}{2} = \\frac{15}{8}', note: 'الحساب المعروض خاطئ؛ الصواب 15/8 لأنّ الضرب لا يتطلّب توحيد المقامات.' },
        ],
      },
      {
        section: 'مفتاح الاختبار الشامل',
        source: 'أسئلة أصيلة',
        items: [
          { ref: 'س1', answer: '-\\frac{3}{5}' },
          { ref: 'س2', answer: '-\\frac{1}{6}' },
          { ref: 'س3', answer: '\\text{سالبة}' },
          { ref: 'س4', answer: '-\\frac{15}{2}' },
          { ref: 'س5', answer: '6x' },
          { ref: 'س6', answer: '-6 - 8x' },
          { ref: 'س7', answer: '-10 + 15y' },
          { ref: 'س8', answer: '7(a + b)' },
          { ref: 'س9', answer: '-5x' },
          { ref: 'س10', answer: '\\text{موجبة}' },
        ],
      },
    ],
  },
};

export default lesson02Data;
