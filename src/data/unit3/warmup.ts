import type { ContentBlock, LessonData, LessonStep } from '../unit1/lesson01';

/**
 * الوحدة الثالثة (الحساب بالرموز) — الصفحة 46: «انطلاقة نشطة».
 *
 * ملاحظة هوية مهمة:
 *   • «انطلاقة نشطة» هي الصفحة التمهيدية للوحدة الثالثة (صفحة 46)، وليست اسم الدرس الأول.
 *   • الاسم الرسمي للدرس الأول هو «نظير المجموع ونظير الفرق» (صفحات 47–49).
 *   • يُبنى محتوى الصفحة 46 هنا مرّة واحدة بترتيب الكتاب وترقيمه ①–⑨، فيُستعمل
 *     في بطاقة الانطلاقة النشطة للوحدة (`#/unit/unit-3/warmup`) وفي القسم التمهيدي
 *     المميّز في مطلع الدرس الأول دون أي تكرار أو اختلاف في النص.
 */

const tex = String.raw;

export function buildUnit3WarmupSteps(mode: 'standalone' | 'lesson-entry'): LessonStep[] {
  const stepPrefix = mode === 'standalone' ? 'warmup-' : '';
  const step1Title =
    mode === 'standalone'
      ? 'معنى الكلمات والأسئلة ① — ④: التعويض وترجمة العبارات'
      : 'تمهيد الوحدة — انطلاقة نشطة (1): معنى الكلمات والأسئلة ① — ④';
  const step2Title =
    mode === 'standalone'
      ? 'الأسئلة ⑤ — ⑨: صيغ المستطيل والاختزال والنشر'
      : 'تمهيد الوحدة — انطلاقة نشطة (2): الأسئلة ⑤ — ⑨ والربط بالدرس';

  const introContent =
    mode === 'standalone'
      ? tex`هذه الصفحة هي «انطلاقة نشطة» التمهيدية للوحدة الثالثة (الحساب بالرموز — صفحة 46)، ومهمّتها تهيئتك قبل الدخول في الدرس الأول «نظير المجموع ونظير الفرق». ستستعيد فيها معنى الحرف بوصفه رمزًا لعدد، وحساب قيمة عبارة حرفية بالتعويض، وترجمة الجمل والرسوم الهندسية إلى عبارات رمزية، واختزال الحدود المتشابهة ونشر جداء بسيط.`
      : tex`نبدأ بالصفحة التمهيدية للوحدة «انطلاقة نشطة» (صفحة 46) تهيئةً لدرسنا الرسمي «نظير المجموع ونظير الفرق». هذا القسم تمهيد استرجاعي للعمل بالرموز الحرفية قبل الانتقال في الخطوة 3 إلى نشاط الدرس وخواصه في الصفحة 47.`;

  const bridgeContent =
    mode === 'standalone'
      ? tex`أتممت تمارين «انطلاقة نشطة» التمهيدية للتعامل مع الرموز $x, y, a, b, z$. الخطوة التالية في الوحدة هي الدرس الأول: «نظير المجموع ونظير الفرق» بدءًا من الصفحة 47، وفيه ستتعلّم كيف تتعامل مع إشارة الناقص عندما تسبق قوسًا يضمّ مجموعًا أو فرقًا مثل $-(a + b)$ و$-(a - b)$.`
      : tex`أنهيت القسم التمهيدي «انطلاقة نشطة» (صفحة 46): تعاملت مع الحروف كأعداد، واختزلت $5x + x = 6x$ و$5a - a = 4a$، ونشرت $7(z + 2) = 7z + 14$. في الخطوة التالية ندخل مباشرةً في صلب الدرس الأول «نظير المجموع ونظير الفرق» (صفحة 47): ماذا يحدث لعبارة مثل $a + b$ أو $a - b$ عندما تسبق قوسَها إشارةُ ناقص؟`;

  const step1Blocks: ContentBlock[] = [
    {
      id: 'p46-warmup-banner',
      type: 'teach',
      authored: true,
      title: '🎯 تمهيد الوحدة (انطلاقة نشطة) — مدخل إلى «نظير المجموع ونظير الفرق»',
      sourceRef: { page: 46, section: 'شرح المنصة' },
      content: introContent,
    },
    {
      id: 'p46-word-meaning',
      type: 'tip',
      title: '💡 معنى الكلمات:',
      sourceRef: { page: 46, section: 'انطلاقة نشطة', item: 'معنى الكلمات' },
      content: '',
      subItems: [
        {
          label: '•',
          text: tex`الحساب الرمزي يعني أن نعمل مع العبارات التي تحوي الحروف $x, y, a, b, \dots$`,
        },
        {
          label: '•',
          text: 'كلّ حرف من تلك الحروف يرمز إلى عدد (أسميناه رمزاً)',
        },
      ],
    },
    {
      id: 'p46-instruction',
      type: 'activity',
      title: 'في كلّ مما يلي، هناك واحدة فقط من الإجابات ① و ② و ③ مقترحة صحيحة، أشر إليها:',
      sourceRef: { page: 46, section: 'انطلاقة نشطة', item: 'تعليمة' },
      content: 'اختر الإجابة الصحيحة في كلّ بند من البنود التسعة بترتيب الكتاب، واقرأ تعليل صحّة الخيار أو خطئه.',
    },
    {
      id: 'p46-item-1',
      type: 'mcq',
      title: tex`① في حالة $x = 3$ ، قيمة العبارة $5x - 1$ تساوي`,
      sourceRef: { page: 46, section: 'انطلاقة نشطة', item: '①' },
      content: tex`في حالة $x = 3$ ، قيمة العبارة $5x - 1$ تساوي`,
      interactiveType: 'mcq',
      interactiveData: {
        options: [
          {
            id: '1',
            label: '①',
            text: '7',
            isCorrect: false,
            explanation: tex`غير صحيحة: $5x$ تعني $5 \times x$ لا $5 + x$؛ فالتعويض يعطي $5 \times 3 - 1 = 14$ وليس $5 + 3 - 1 = 7$.`,
          },
          {
            id: '2',
            label: '②',
            text: '10',
            isCorrect: false,
            explanation: tex`غير صحيحة: الأولوية للضرب قبل الطرح، فلا نطرح $3 - 1$ أولًا لنحصل على $5 \times 2 = 10$.`,
          },
          {
            id: '3',
            label: '③',
            text: '14',
            isCorrect: true,
            explanation: tex`صحيحة: نعوّض $x = 3$ فنحصل على $5 \times 3 - 1 = 15 - 1 = 14$.`,
          },
        ],
      },
    },
    {
      id: 'p46-item-2',
      type: 'mcq',
      title: tex`② في حالة $x = 5$ ، قيمة العبارة $-3x + 7$ تساوي`,
      sourceRef: { page: 46, section: 'انطلاقة نشطة', item: '②' },
      content: tex`في حالة $x = 5$ ، قيمة العبارة $-3x + 7$ تساوي`,
      verifyNote:
        'ملاحظة المصدر: الخيارات الثلاثة المطبوعة عبارات حرفية تُقارن قيمتها العددية بقيمة $-3x + 7$ في حالة $x = 5$ تحديدًا؛ عند $x = 5$ تكون $-3(5) + 7 = -8$، والخيار ① وحده يعطي $2(5 - 9) = -8$ (وهو تساوٍ عددي عند $x = 5$ لا تطابق حرفي لكل قيم $x$).',
      interactiveType: 'mcq',
      interactiveData: {
        options: [
          {
            id: '1',
            label: '①',
            text: '2(x - 9)',
            isCorrect: true,
            explanation: tex`صحيحة في حالة $x = 5$: قيمة $-3x + 7$ هي $-3 \times 5 + 7 = -15 + 7 = -8$، وعند تعويض $x = 5$ في $2(x - 9)$ نحصل على $2(5 - 9) = 2 \times (-4) = -8$ أيضًا. (انتبه: العبارتان متساويتا القيمة عند $x = 5$ تحديدًا وليستا متطابقتين لكل $x$).`,
          },
          {
            id: '2',
            label: '②',
            text: '2x - 9',
            isCorrect: false,
            explanation: tex`غير صحيحة: عند $x = 5$ تكون $2x - 9 = 2 \times 5 - 9 = 10 - 9 = 1$، بينما قيمة $-3x + 7$ عند $x = 5$ هي $-8$.`,
          },
          {
            id: '3',
            label: '③',
            text: '2(9 - x)',
            isCorrect: false,
            explanation: tex`غير صحيحة: عند $x = 5$ تكون $2(9 - x) = 2(9 - 5) = 8$، وهي نظير الناتج المطلوب $-8$ في الإشارة.`,
          },
        ],
      },
    },
    {
      id: 'p46-item-3',
      type: 'mcq',
      title: tex`③ جُمِعَ العدد $2$ مع جداء ضرب $x$ بالعدد $4$ فكان الناتج`,
      sourceRef: { page: 46, section: 'انطلاقة نشطة', item: '③' },
      content: tex`جُمِعَ العدد $2$ مع جداء ضرب $x$ بالعدد $4$ فكان الناتج`,
      interactiveType: 'mcq',
      interactiveData: {
        options: [
          {
            id: '1',
            label: '①',
            text: '(2 + 4)x',
            isCorrect: false,
            explanation: tex`غير صحيحة: $(2 + 4)x = 6x$ تعني ضرب $x$ بمجموع العددين $2$ و$4$.`,
          },
          {
            id: '2',
            label: '②',
            text: '2(4 + x)',
            isCorrect: false,
            explanation: tex`غير صحيحة: $2(4 + x)$ تعني ضرب العدد $2$ بمجموع $4$ و$x$.`,
          },
          {
            id: '3',
            label: '③',
            text: '2 + 4x',
            isCorrect: true,
            explanation: tex`صحيحة: جداء ضرب $x$ بالعدد $4$ هو $4x$، وجمعه مع العدد $2$ يعطي $2 + 4x$.`,
          },
        ],
      },
    },
    {
      id: 'p46-item-4',
      type: 'mcq',
      title: tex`④ ضُرِبَ العدد $2$ بمجموع العددين $x$ و $4$ فكان الناتج`,
      sourceRef: { page: 46, section: 'انطلاقة نشطة', item: '④' },
      content: tex`ضُرِبَ العدد $2$ بمجموع العددين $x$ و $4$ فكان الناتج`,
      interactiveType: 'mcq',
      interactiveData: {
        options: [
          {
            id: '1',
            label: '①',
            text: '(2 + 4)x',
            isCorrect: false,
            explanation: tex`غير صحيحة: هنا جُمع $2$ و$4$ ثم ضُرب الناتج في $x$ بدل جمع $x$ و$4$.`,
          },
          {
            id: '2',
            label: '②',
            text: '2(4 + x)',
            isCorrect: true,
            explanation: tex`صحيحة: مجموع العددين $x$ و$4$ يُحفظ بين قوسين $(4 + x)$، ثم يُضرب بالعدد $2$ فنحصل على $2(4 + x)$.`,
          },
          {
            id: '3',
            label: '③',
            text: '2 + 4x',
            isCorrect: false,
            explanation: tex`غير صحيحة: $2 + 4x$ تمثّل جمع $2$ مع $4x$ لا ضرب $2$ بالمجموع.`,
          },
        ],
      },
    },
  ];

  const step2Blocks: ContentBlock[] = [
    {
      id: 'p46-rect-visual',
      type: 'activity',
      title: 'الشكل المرفق للبندين ⑤ و ⑥: مستطيل بعداه $9\\text{ cm}$ و $x\\text{ cm}$',
      sourceRef: { page: 46, section: 'انطلاقة نشطة', item: 'شكل المستطيل' },
      content: tex`تأمّل المستطيل المرسوم جانب البندين ⑤ و⑥ في الكتاب: طوله $9\text{ cm}$ وعرضه $x\text{ cm}$.`,
      interactiveType: 'warmup-rectangle-svg',
    },
    {
      id: 'p46-item-5',
      type: 'mcq',
      title: '⑤ يعطى محيط المستطيل المرسوم جانباً بالصيغة',
      sourceRef: { page: 46, section: 'انطلاقة نشطة', item: '⑤' },
      content: 'يعطى محيط المستطيل المرسوم جانباً بالصيغة',
      interactiveType: 'mcq',
      interactiveData: {
        options: [
          {
            id: '1',
            label: '①',
            text: '2x + 9',
            isCorrect: false,
            explanation: tex`غير صحيحة: ضُرب العرض $x$ وحده في $2$ ولم يُضرب الطول $9$ في $2$.`,
          },
          {
            id: '2',
            label: '②',
            text: '2(x + 9)',
            isCorrect: true,
            explanation: tex`صحيحة: محيط المستطيل يساوي ضعفي مجموع البعدين، أي $2(x + 9)$.`,
          },
          {
            id: '3',
            label: '③',
            text: '2 \\times 9 + x',
            isCorrect: false,
            explanation: tex`غير صحيحة: ضُرب الطول $9$ وحده في $2$ وأُضيف $x$ مرّة واحدة فقط.`,
          },
        ],
      },
    },
    {
      id: 'p46-item-6',
      type: 'mcq',
      title: '⑥ تُعطى مساحة سطح هذا المستطيل بالصيغة .',
      sourceRef: { page: 46, section: 'انطلاقة نشطة', item: '⑥' },
      content: 'تُعطى مساحة سطح هذا المستطيل بالصيغة .',
      interactiveType: 'mcq',
      interactiveData: {
        options: [
          {
            id: '1',
            label: '①',
            text: 'x + 9',
            isCorrect: false,
            explanation: tex`غير صحيحة: $x + 9$ هو نصف المحيط (مجموع البعدين) لا المساحة.`,
          },
          {
            id: '2',
            label: '②',
            text: '2 \\times 9 \\times x',
            isCorrect: false,
            explanation: tex`غير صحيحة: مساحة المستطيل تساوي الطول مضروبًا بالعرض دون الضرب في $2$.`,
          },
          {
            id: '3',
            label: '③',
            text: '9x',
            isCorrect: true,
            explanation: tex`صحيحة: مساحة سطح المستطيل تساوي جداء بعديه $9 \times x = 9x$.`,
          },
        ],
      },
    },
    {
      id: 'p46-item-7',
      type: 'mcq',
      title: tex`⑦ يرمز $x$ إلى عدد. الصيغة المختزلة للعبارة $5x + x$ هي`,
      sourceRef: { page: 46, section: 'انطلاقة نشطة', item: '⑦' },
      content: tex`يرمز $x$ إلى عدد. الصيغة المختزلة للعبارة $5x + x$ هي`,
      interactiveType: 'mcq',
      interactiveData: {
        options: [
          {
            id: '1',
            label: '①',
            text: '5x',
            isCorrect: false,
            explanation: tex`غير صحيحة: الحدّ $x$ معامله $1$ (أي $1x$)، فلا يُهمل عند الجمع.`,
          },
          {
            id: '2',
            label: '②',
            text: '6x',
            isCorrect: true,
            explanation: tex`صحيحة: $5x + x = 5x + 1x = (5 + 1)x = 6x$.`,
          },
          {
            id: '3',
            label: '③',
            text: '5x^2',
            isCorrect: false,
            explanation: tex`غير صحيحة: الأسّ $x^2$ ينتج من الضرب $x \times x$ لا من جمع الحدود المتشابهة.`,
          },
        ],
      },
    },
    {
      id: 'p46-item-8',
      type: 'mcq',
      title: tex`⑧ يرمز $a$ إلى عدد. الصيغة المختزلة للعبارة $5a - a$ هي ........`,
      sourceRef: { page: 46, section: 'انطلاقة نشطة', item: '⑧' },
      content: tex`يرمز $a$ إلى عدد. الصيغة المختزلة للعبارة $5a - a$ هي ........`,
      interactiveType: 'mcq',
      interactiveData: {
        options: [
          {
            id: '1',
            label: '①',
            text: '5',
            isCorrect: false,
            explanation: tex`غير صحيحة: طرح $a$ من $5a$ لا يحذف الرمز $a$ ليبقى $5$؛ فـ $5a$ تعني $a + a + a + a + a$.`,
          },
          {
            id: '2',
            label: '②',
            text: '5 - 2a',
            isCorrect: false,
            explanation: tex`غير صحيحة: الحدّان $5a$ و$-a$ متشابهان يُختزلان إلى حدّ واحد في $a$.`,
          },
          {
            id: '3',
            label: '③',
            text: '4a',
            isCorrect: true,
            explanation: tex`صحيحة: $5a - a = 5a - 1a = (5 - 1)a = 4a$.`,
          },
        ],
      },
    },
    {
      id: 'p46-item-9',
      type: 'mcq',
      title: tex`⑨ يرمز $z$ إلى عدد. بعد نشر الجداء $7(z + 2)$ نحصل على ........`,
      sourceRef: { page: 46, section: 'انطلاقة نشطة', item: '⑨' },
      content: tex`يرمز $z$ إلى عدد. بعد نشر الجداء $7(z + 2)$ نحصل على ........`,
      interactiveType: 'mcq',
      interactiveData: {
        options: [
          {
            id: '1',
            label: '①',
            text: '7z + 2',
            isCorrect: false,
            explanation: tex`غير صحيحة: ضُرب العدد $7$ بالحدّ الأول $z$ فقط ونُسي ضربه بالحدّ الثاني $2$.`,
          },
          {
            id: '2',
            label: '②',
            text: '7z + 14',
            isCorrect: true,
            explanation: tex`صحيحة: نوزّع الضرب على الجمع $7(z + 2) = 7 \times z + 7 \times 2 = 7z + 14$.`,
          },
          {
            id: '3',
            label: '③',
            text: 'z + 14',
            isCorrect: false,
            explanation: tex`غير صحيحة: ضُرب العدد $7$ بالعدد $2$ فقط ولم يُضرب بالحدّ الأول $z$.`,
          },
        ],
      },
    },
    {
      id: 'p46-warmup-bridge',
      type: 'insight',
      authored: true,
      title: '💡 من «انطلاقة نشطة» إلى الدرس الأول: «نظير المجموع ونظير الفرق»',
      sourceRef: { page: 46, section: 'شرح المنصة' },
      content: bridgeContent,
    },
  ];

  return [
    {
      id: `${stepPrefix}step-1`,
      title: step1Title,
      subtitle: 'في كلّ مما يلي، هناك واحدة فقط من الإجابات ① و ② و ③ مقترحة صحيحة، أشر إليها:',
      sourcePages: [46],
      blocks: step1Blocks,
    },
    {
      id: `${stepPrefix}step-2`,
      title: step2Title,
      subtitle: 'محيط المستطيل ومساحته، اختزال الحدود المتشابهة، ونشر الجداء',
      sourcePages: [46],
      blocks: step2Blocks,
    },
  ];
}

export const unit3WarmupData: LessonData = {
  id: 'warmup',
  number: 0,
  unitId: 'unit-3',
  unitTitle: 'الوحدة الثالثة: الحساب بالرموز',
  title: 'انطلاقة نشطة',
  description:
    'تمهيد الوحدة الثالثة (الصفحة 46): معنى الحساب الرمزي، حساب قيمة عبارة حرفية بالتعويض، صيغتا محيط المستطيل ومساحته، واختزال ونشر عبارات بسيطة قبل الدرس الأول «نظير المجموع ونظير الفرق».',
  sourcePages: [46],
  steps: buildUnit3WarmupSteps('standalone'),
};
