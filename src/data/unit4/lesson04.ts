import type { ContentBlock, LessonData, LessonStep, SourceRef } from '../unit1/lesson01';
import type { FinalAssessment, TeacherArea } from '../assessment';
import type { UnitTeacherSolution } from '../unit2/teacherSolutions';
import {
  unit4ExerciseQuestions,
  type Unit4ExerciseQuestionSpec,
} from './lesson04Questions';

/**
 * الدرس الرابع من الوحدة الرابعة: تمارين الوحدة الرابعة (الأسئلة 1–22).
 *
 * الصور المصدرية المرفقة تعرض الأسئلة المرقّمة 1–22 دون أرقام صفحات مطبوعة؛
 * لذلك تُعتمد دلالة `sourcePages: []` مع `sourceLabel` و `sourceRef.display`
 * أسوةً بتمارين الوحدتين الثانية والثالثة.
 *
 * يحافظ هذا الدرس على الترقيم والتسلسل الهرمي للكتاب حرفياً:
 * - 22 سؤالاً رئيسياً بالترتيب (مرقّمة بالأخضر في الواجهة).
 * - الفروع التابعة لكل سؤال رئيسي تبقى داخله (مرقّمة بالأزرق في الواجهة).
 */

type ExerciseGroup = { id: string; title: string; from: number; to: number };

export const unit4Lesson4Groups: ExerciseGroup[] = [
  { id: 'u4-g1', title: 'المحطة 1: الاختيار من متعدد ومراحل حلّ المعادلة (1–2)', from: 1, to: 2 },
  { id: 'u4-g2', title: 'المحطة 2: تشكيل المعادلات وصياغة النصوص الرياضية (3–6)', from: 3, to: 6 },
  { id: 'u4-g3', title: 'المحطة 3: المحيطات والمقارنات والأعداد المتتالية (7–11)', from: 7, to: 11 },
  { id: 'u4-g4', title: 'المحطة 4: مسائل حياتية وكسرية ومجسّمات (12–18)', from: 12, to: 18 },
  { id: 'u4-g5', title: 'المحطة 5: المخططات العددية والمساحات والتحقق من الحل (19–22)', from: 19, to: 22 },
];

const groupOf = (n: number): ExerciseGroup =>
  unit4Lesson4Groups.find((g) => n >= g.from && n <= g.to) ??
  unit4Lesson4Groups[unit4Lesson4Groups.length - 1];

const sourceRefOf = (n: number): SourceRef => ({
  page: 0,
  section: 'تمارين الوحدة الرابعة',
  item: `السؤال ${n}`,
  display: `تمارين الوحدة الرابعة • السؤال ${n}`,
});

const authoredRefOf = (n: number, section: string): SourceRef => ({
  page: 0,
  section,
  item: `السؤال ${n}`,
  display: `${section} • السؤال ${n}`,
});

function buildStep(q: Unit4ExerciseQuestionSpec): LessonStep {
  const group = groupOf(q.n);
  const blocks: ContentBlock[] = [
    {
      id: `source-${q.n}`,
      type: 'activity',
      title: q.bookSubtitle ? `السؤال ${q.n}: ${q.bookSubtitle}` : `السؤال ${q.n}: ${q.title}`,
      sourceRef: sourceRefOf(q.n),
      content: q.stem,
      interactiveType: q.figureId ? 'u4-ex-figure' : undefined,
      interactiveData: q.figureId ? { figureId: q.figureId } : undefined,
      subItems: q.subItems?.map((sub) => ({
        label: sub.label,
        text: sub.text,
        math: sub.math,
        solution: sub.solution,
        solutionText: sub.solutionText,
        working: sub.working,
        explanation: sub.explanation,
        figureId: sub.figureId,
        solutionFigureId: sub.solutionFigureId,
      })),
    },
    {
      id: `think-${q.n}`,
      type: 'teach',
      title: 'كيف نفكر؟',
      sourceRef: authoredRefOf(q.n, 'كيف نفكر'),
      authored: true,
      content: q.think,
    },
    {
      id: `hint-${q.n}`,
      type: 'tip',
      title: 'تلميح',
      sourceRef: authoredRefOf(q.n, 'تلميح'),
      authored: true,
      content: q.hint,
    },
    {
      id: `check-${q.n}`,
      type: 'interactive-exercise',
      title: `التحقق التفاعلي — السؤال ${q.n}`,
      sourceRef: authoredRefOf(q.n, 'تحقّق تفاعلي'),
      authored: true,
      content: '',
      interactiveType: 'u4-exercise-check',
      interactiveData: q.checkData,
    },
    {
      id: `solution-${q.n}`,
      type: 'example',
      title: 'الحل خطوة بخطوة',
      sourceRef: authoredRefOf(q.n, 'الحل التفصيلي'),
      authored: true,
      deferUntilSolution: true,
      content: q.solutionSteps.join('\n'),
      solutionFigureId: q.solutionFigureId,
    },
    {
      id: `insight-${q.n}`,
      type: 'insight',
      title: 'ملاحظة ذكية أو طريقة بديلة',
      sourceRef: authoredRefOf(q.n, 'بصيرة رياضية'),
      authored: true,
      deferUntilSolution: true,
      content: q.insight,
    },
    {
      id: `mistake-${q.n}`,
      type: 'mistake',
      title: 'خطأ شائع',
      sourceRef: authoredRefOf(q.n, 'خطأ شائع'),
      authored: true,
      deferUntilSolution: true,
      content: q.mistake,
    },
    {
      id: `result-${q.n}`,
      type: 'check',
      title: 'النتيجة النهائية والتحقق',
      sourceRef: authoredRefOf(q.n, 'النتيجة'),
      authored: true,
      deferUntilSolution: true,
      content: q.resultSummary,
    },
  ];

  return {
    id: `u4-l4-step-${q.n}`,
    title: `السؤال ${q.n}: ${q.bookSubtitle ?? q.title}`,
    subtitle: group.title,
    sourcePages: [],
    sourceLabel: `السؤال ${q.n}`,
    groupId: group.id,
    groupTitle: group.title,
    blocks,
  };
}

const unit4Lesson4Assessment: FinalAssessment = {
  title: 'التقويم الذاتي: تمارين الوحدة الرابعة',
  description: 'مراجعة ذاتية مركّزة لمهارات حل معادلات الدرجة الأولى وتشكيلها وتفسير حلولها هندسياً وحياتياً.',
  passThreshold: 70,
  questions: [
    {
      id: 'u4-l4-fa1',
      type: 'numeric',
      concept: 'حل معادلة خطية ذات خطوتين',
      relatedStepIndex: 1,
      prompt: 'حلّ المعادلة وأوجد قيمة $x$:',
      math: '4x - 7 = 21',
      acceptedAnswers: ['7'],
      answerDisplay: '7',
      explanation: 'نضيف $7$ إلى الطرفين فنجد $4x = 28$، ثم نقسم على $4$ فنحصل على $x = 7$.',
      hint: 'تخلّص من $-7$ أولاً بإضافة $7$ إلى الطرفين.',
    },
    {
      id: 'u4-l4-fa2',
      type: 'numeric',
      concept: 'معادلة بمعامل كسري سالب',
      relatedStepIndex: 1,
      prompt: 'حلّ المعادلة وأوجد قيمة $b$:',
      math: '-\\frac{3}{4}b + 2 = -7',
      acceptedAnswers: ['12'],
      answerDisplay: '12',
      explanation: 'نطرح $2$ فنجد $-\\frac{3}{4}b = -9$، ثم نضرب الطرفين في $-\\frac{4}{3}$ فنجد $b = 12$.',
      hint: 'اطرح $2$ من الطرفين ثم اضرب في مقلوب $-\\frac{3}{4}$.',
    },
    {
      id: 'u4-l4-fa3',
      type: 'mcq',
      concept: 'تشكيل معادلة من نص',
      relatedStepIndex: 4,
      prompt: 'أي معادلة تعبّر عن النص: «أضمر عدداً $x$، أطرح منه $6$، ثم أضرب الناتج في $3$ فأحصل على $27$»؟',
      choices: [
        { id: 'a', text: '$3x - 6 = 27$' },
        { id: 'b', text: '$3(x - 6) = 27$' },
        { id: 'c', text: '$x - 18 = 27$' },
      ],
      correctId: 'b',
      explanation: 'الطرح يسبق الضرب، لذا نضع $(x - 6)$ بين قوسين ثم نضرب في $3$: $3(x - 6) = 27$.',
      hint: 'احفظ أولوية عملية الطرح بقوسين قبل الضرب في $3$.',
    },
    {
      id: 'u4-l4-fa4',
      type: 'numeric',
      concept: 'محيطان متساويان',
      relatedStepIndex: 9,
      prompt: 'مثلث متساوي الأضلاع طول ضلعه $x + 3$ يساوي محيطه محيط مربع طول ضلعه $x + 1$. أوجد قيمة $x$.',
      acceptedAnswers: ['5'],
      answerDisplay: '5',
      explanation: '$3(x + 3) = 4(x + 1) \\implies 3x + 9 = 4x + 4 \\implies x = 5$.',
      hint: 'محيط المثلث $3(x + 3)$ ومحيط المربع $4(x + 1)$.',
    },
    {
      id: 'u4-l4-fa5',
      type: 'numeric',
      concept: 'الأعداد الصحيحة المتتالية',
      relatedStepIndex: 10,
      prompt: 'ما أصغر ثلاثة أعداد صحيحة متتالية مجموعها $126$؟',
      acceptedAnswers: ['41'],
      answerDisplay: '41',
      explanation: '$x + (x + 1) + (x + 2) = 126 \\implies 3x + 3 = 126 \\implies 3x = 123 \\implies x = 41$.',
      hint: 'اكتب المعادلة $3x + 3 = 126$.',
    },
    {
      id: 'u4-l4-fa6',
      type: 'numeric',
      concept: 'مسائل الأعمار',
      relatedStepIndex: 17,
      prompt: 'عمر أب $50$ عاماً وعمر ابنه $14$ عاماً. بعد كم سنة يصبح عمر الأب ثلاثة أمثال عمر ابنه؟',
      acceptedAnswers: ['4'],
      answerDisplay: '4',
      explanation: '$50 + x = 3(14 + x) \\implies 50 + x = 42 + 3x \\implies 2x = 8 \\implies x = 4$.',
      hint: 'أضف $x$ إلى كلٍّ من العمرين ثم اضرب عمر الابن بعد $x$ سنة في $3$.',
    },
    {
      id: 'u4-l4-fa7',
      type: 'numeric',
      concept: 'تساوي المساحات بدلالة x',
      relatedStepIndex: 19,
      prompt: 'حلّ المعادلة $2x = 30 - 3x$ وأوجد قيمة $x$.',
      acceptedAnswers: ['6'],
      answerDisplay: '6',
      explanation: 'نضيف $3x$ إلى الطرفين فنحصل على $5x = 30$، ومنه $x = 6$.',
      hint: 'اجمع الحدود التي تحوي $x$ في الطرف الأيسر.',
    },
    {
      id: 'u4-l4-fa8',
      type: 'mcq',
      concept: 'التحقق الهندسي من معقولية الحل',
      relatedStepIndex: 20,
      prompt: 'مثلث متساوي الساقين محيطه $20\\text{ cm}$ وطول قاعدته $10\\text{ cm}$. ماذا نستنتج؟',
      choices: [
        { id: 'a', text: 'طول كل ساق $5\\text{ cm}$ ولا يوجد مثل هذا المثلث لأن $5 + 5 = 10$.' },
        { id: 'b', text: 'طول كل ساق $5\\text{ cm}$ ويمكن رسم المثلث.' },
        { id: 'c', text: 'طول كل ساق $10\\text{ cm}$.' },
      ],
      correctId: 'a',
      explanation: '$2x + 10 = 20 \\implies x = 5\\text{ cm}$، لكن $5 + 5 = 10$ يخالف متراجحة المثلث فلا يتشكّل مثلث.',
      hint: 'اختبر متراجحة المثلث بعد إيجاد طول الساق.',
    },
  ],
};

const teacherSolutions: UnitTeacherSolution[] = unit4ExerciseQuestions.map((q) => {
  const grp = groupOf(q.n);
  return {
    id: `u4-l4-sol-${q.n}`,
    group: grp.title,
    blockId: `source-${q.n}`,
    source: `تمارين الوحدة الرابعة • السؤال ${q.n}`,
    problem: q.stem,
    steps: q.solutionSteps,
    finalAnswer: q.resultSummary,
    principle: q.insight,
    check: 'تم التحقق بالتعويض المباشر في المعادلة وفي شروط النص الهندسية والحياتية.',
    answerOrigin: 'مُشتقة من المنصة',
  };
});

const unit4Lesson4TeacherArea: TeacherArea = {
  objectives: [
    'حلّ معادلات الدرجة الأولى بمجهول واحد ذات معاملات صحيحة وكسرية وعشرية مع تبرير مراحل الحل.',
    'ترجمة النصوص اللفظية والأشكال الهندسية والمخططات العددية إلى معادلات خطية وحلّها.',
    'صياغة حلّ رياضي متكامل للمسائل الحياتية (اختيار المجهول، تشكيل المعادلة، الحل، التحقق، الجواب اللفظي).',
    'التحقق من معقولية الحلول الجبرية هندسياً وواقعياً (توحيد الوحدات، متراجحة المثلث، شروط الانتماء إلى قطعة مستقيمة).',
  ],
  commonMistakes: [
    {
      mistake: 'نسيان الأقواس عند مضاعفة مجموع أو فرق كما في الأسئلة 1 و5 و8 و18.',
      correction: 'إحاطة المقدار المركّب بقوسين قبل الضرب، مثل $2(x + 15)$ و $3(18 + x)$.',
    },
    {
      mistake: 'إغفال توحيد وحدات الطول بين الديسيمتر والسنتيمتر في السؤال 7.',
      correction: 'تحويل جميع الأطوال إلى وحدة واحدة ($1\\text{ dm} = 10\\text{ cm}$) قبل تشكيل المعادلة.',
    },
    {
      mistake: 'التوقف عند قيمة المجهول $x$ دون الإجابة عن المطلوب الفعلي كما في السؤال 6 (سعر بطاقة البالغ $2x = 150$).',
      correction: 'العودة دائماً إلى تعريف المجهول والسؤال الختامي في النص لصياغة جملة الجواب النهائي.',
    },
    {
      mistake: 'عدم تغيير الإشارة داخل القوس المسبوق بإشارة طرح في السؤالين 12 و22.',
      correction: 'تطبيق قاعدة حذف الأقواس بدقة: $20 - (12 - 0.5x) = 20 - 12 + 0.5x = 8 + 0.5x$.',
    },
  ],
  remediation: [
    'تدريب الطلاب على كتابة سطر صريح لتعريف المجهول والكميات المرتبطة به قبل كتابة المعادلة.',
    'المقارنة البصرية بين الحل الذهني والحل الجبري كما في بلاطتي السؤال 4 لترسيخ معنى طرح المقدار نفسه من الطرفين.',
    'إلزام الطالب بخطوة التحقق العددي والواقعي في نهاية كل مسألة (لا سيما فحص الوحدات ومتراجحة المثلث).',
  ],
  teachingNotes: [
    'يحافظ عرض التمارين على الترميز اللوني للكتاب: رقم السؤال الرئيسي بالأخضر وأرقام الفروع التابعة له بالأزرق.',
    'يُستثمر السؤال 6 لتدريب الطلاب على التحرير الرياضي السليم انطلاقاً من نقد حل التلميذ وملاحظات المصحّح.',
    'يُربط السؤال 22 بمكتسبات الوحدة الثالثة (تبسيط العبارات وحذف الأقواس) بوصفه مسألة تكاملية ختامية.',
  ],
  assessmentGuidance: [
    'تُوزّع الدرجة في المسائل الحياتية على المراحل الأربع: تعريف المجهول، صحة المعادلة، سلامة خطوات الحل، وصياغة الجواب مع التحقق.',
    'تُقبل في الأسئلة الجبرية أي عبارة أو معادلة مكافئة رياضياً للصيغة النموذجية ما دامت تحترم شروط المسألة.',
  ],
  answerKeys: unit4Lesson4Groups.map((grp) => ({
    section: grp.title,
    source: `تمارين الوحدة الرابعة • الأسئلة ${grp.from}–${grp.to}`,
    items: unit4ExerciseQuestions
      .filter((q) => q.n >= grp.from && q.n <= grp.to)
      .map((q) => ({
        ref: `Q${q.n}`,
        answer: q.teacherAnswerText ? '' : q.teacherAnswerLatex,
        answerText: q.teacherAnswerText,
      })),
  })),
  solutions: teacherSolutions,
};

export const unit4Lesson4Data: LessonData = {
  id: 'u4-lesson-4',
  unitId: 'unit-4',
  number: 4,
  title: 'تمارين الوحدة الرابعة',
  unitTitle: 'الوحدة الرابعة: معادلات من الدرجة الأولى',
  sourcePages: [],
  sourceLabel: 'تمارين الوحدة الرابعة (الأسئلة 1–22)',
  description:
    'تمارين شاملة على معادلات الدرجة الأولى بمجهول واحد (22 تمريناً ومسألة): حل المعادلات، تشكيل المعادلة من نص أو شكل هندسي، مسائل المحاصصة والأعمار والحجوم والمساحات، والتحقق من معقولية الحل.',
  steps: unit4ExerciseQuestions.map(buildStep),
  finalAssessment: unit4Lesson4Assessment,
  teacherArea: unit4Lesson4TeacherArea,
};
