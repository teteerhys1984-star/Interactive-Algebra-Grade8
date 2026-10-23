import type { ContentBlock, LessonData, LessonStep } from '../unit1/lesson01';
import type { TeacherArea } from '../assessment';
import { unit2Lesson5Questions, type ExerciseQuestion } from './lesson05Questions';
import { unit2Lesson5TeacherSolutions } from './lesson05TeacherSolutions';
import { stationOf, unit2Lesson5Stations } from './lesson05Stations';

/**
 * الوحدة الثانية — الدرس الخامس: تمارين ومسائل الوحدة الثانية (39 سؤالًا).
 *
 * هذا الدرس ليس درسًا نظريًا جديدًا: إنه ورشة تدريب تجمع أسئلة الوحدة كما وردت
 * في صور المصدر، بالترتيب نفسه، مع حلول تفصيلية لكل بند فرعي.
 *
 * بنية كل خطوة (سؤال) تتبع نمط دروس التمارين المعتمد في المشروع:
 *   source → think → hint → (تحقّق سريع) → solution → insight/mistake → result
 * ويعرض `ExerciseStepView` هذه الأقسام بالترتيب نفسه في الدروس 1–4.
 *
 * ملاحظة توثيق: الصور المجموعة لا تحمل أرقام صفحات مطبوعة، فحقل `sourcePages`
 * فارغ في كل خطوة، و`sourceLabel` يحمل الوسم الحقيقي («السؤال N»). لا يُخترع رقم
 * صفحة، وتظهر هذه الملاحظة في مساحة المعلّم.
 */

const SOURCE_SECTION = 'تمارين ومسائل الوحدة الثانية';

const sourceRef = (n: number, item?: string) => ({
  page: 0,
  section: SOURCE_SECTION,
  item: item ?? `السؤال ${n}`,
  display: `تمارين الوحدة الثانية • السؤال ${n}${item ? ` • ${item}` : ''}`,
});

/* --------------------------- أدوات بناء المحتوى --------------------------- */

const inlineAnswer = (question: ExerciseQuestion, index: number): string => {
  const item = question.items[index];
  if (item.answer) return `$${item.answer}$`;
  return item.answerText ?? '';
};

/** حل السؤال كاملًا: يُبنى تلقائيًا من بنوده إن لم يُكتب حل مخصص. */
const buildSolution = (question: ExerciseQuestion): string => {
  if (question.solution) return question.solution;
  return question.items
    .map((item) => `${item.label} ${inlineAnswer(question, question.items.indexOf(item))} — ${item.reason}`)
    .join('\n');
};

const subItemsOf = (question: ExerciseQuestion) =>
  question.items.map((item) => ({
    label: item.label,
    text: item.text ?? '',
    math: item.math,
    solution: item.answer,
    solutionText: item.answerText,
    // Nothing that reveals the answer is rendered before the student asks for it:
    // the reason, the steps and the verification all live inside the reveal panel.
    working: [item.reason, ...item.steps, item.check ? `التحقق: ${item.check}` : ''].filter(Boolean),
    verifyNote: item.note,
  }));

const buildBlocks = (question: ExerciseQuestion): ContentBlock[] => {
  const blocks: ContentBlock[] = [
    {
      id: `source-${question.n}`,
      type: 'activity',
      title: `📖 السؤال ${question.n}`,
      sourceRef: sourceRef(question.n),
      content: question.stem,
      mathFormula: question.math,
      subItems: subItemsOf(question),
      verifyNote: question.verifyNote,
    },
    {
      id: `think-${question.n}`,
      type: 'teach',
      authored: true,
      title: '🧠 كيف نفكر؟',
      sourceRef: sourceRef(question.n, 'شرح المنصة'),
      content: question.think,
    },
    {
      id: `hint-${question.n}`,
      type: 'tip',
      authored: true,
      title: '💡 تلميح',
      sourceRef: sourceRef(question.n, 'تلميح المنصة'),
      content: question.hint,
    },
  ];

  const probe = quickChecks[question.n];
  if (probe) {
    blocks.push({
      id: `probe-${question.n}`,
      type: 'interactive-exercise',
      authored: true,
      title: '🧪 تحقّق سريع قبل الحل الكامل',
      sourceRef: sourceRef(question.n, 'تحقّق المنصة'),
      content: 'اختر الإجابة الصحيحة ثم اضغط «تحقّق». هذا تدريب قصير على فكرة السؤال، وليس بديلًا عن الحل التفصيلي.',
      interactiveType: 'practice-check',
      interactiveData: { questions: probe },
    });
  }

  blocks.push({
    id: `solution-${question.n}`,
    type: 'example',
    authored: true,
    title: '✏️ الحل خطوة بخطوة',
    sourceRef: sourceRef(question.n, 'حل المنصة'),
    content: buildSolution(question),
  });

  if (question.insight) {
    blocks.push({
      id: `insight-${question.n}`,
      type: 'insight',
      authored: true,
      title: '💡 ملاحظة ذكية أو طريقة بديلة',
      sourceRef: sourceRef(question.n, 'شرح المنصة'),
      content: question.insight,
    });
  }

  if (question.mistake) {
    blocks.push({
      id: `mistake-${question.n}`,
      type: 'mistake',
      authored: true,
      title: '⚠️ خطأ شائع',
      sourceRef: sourceRef(question.n, 'شرح المنصة'),
      content: question.mistake,
    });
  }

  blocks.push({
    id: `result-${question.n}`,
    type: 'check',
    authored: true,
    deferUntilSolution: true,
    title: '🎯 النتيجة والتحقق',
    sourceRef: sourceRef(question.n, 'تحقّق المنصة'),
    content: question.result,
  });

  return blocks;
};

/**
 * تحقّقات سريعة تفاعلية (اختيار من متعدد يُصحَّح بقيم محسوبة).
 * `correctIndex` مطابق لموضع الإجابة الصحيحة في `choices`، وكل القيم محسوبة
 * في الاختبارات الآلية (src/test/unit2-lesson5.test.ts).
 */
export interface QuickCheck {
  prompt: string;
  choices: string[];
  correctIndex: number;
  explain: string;
}

export const quickChecks: Record<number, QuickCheck[]> = {
  2: [
    {
      prompt: 'أي العبارات صحيحة عن $10^{-3}$؟',
      choices: ['-1\\,000', '\\frac{1}{10^{3}}', '10^{3}'],
      correctIndex: 1,
      explain: 'القوة السالبة مقلوب: $10^{-3}=\\frac{1}{10^{3}}=0.001$.',
    },
  ],
  6: [
    {
      prompt: 'أي كتابة تساوي $0.005\\,37$؟',
      choices: ['537\\times10^{-7}', '5.37\\times10^{-5}', '537\\times10^{-5}'],
      correctIndex: 2,
      explain: '$0.005\\,37=\\frac{537}{100\\,000}=537\\times10^{-5}$، وصيغتها المعيارية $5.37\\times10^{-3}$.',
    },
  ],
  9: [
    {
      prompt: 'ما قيمة الأس الناقص في $46.147\\times10^{p}=46\\,147$؟',
      choices: ['p=3', 'p=-3', 'p=2'],
      correctIndex: 0,
      explain: 'الفاصلة انتقلت ثلاث منازل نحو اليمين، فالقوة $10^{3}$.',
    },
  ],
  13: [
    {
      prompt: 'ما ناتج $\\frac{10^{-5}\\times10^{2}}{10^{-7}}$؟',
      choices: ['10^{-10}', '10^{-4}', '10^{4}'],
      correctIndex: 2,
      explain: 'البسط $10^{-3}$، والقسمة على $10^{-7}$ تعطي $10^{-3+7}=10^{4}$.',
    },
  ],
  16: [
    {
      prompt: 'ما الصيغة المعيارية لـ $3\\times10^{6}\\times6\\times10^{-4}$؟',
      choices: ['18\\times10^{2}', '1.8\\times10^{3}', '1.8\\times10^{2}'],
      correctIndex: 1,
      explain: '$3\\times6=18$ و$10^{6}\\times10^{-4}=10^{2}$، فالناتج $18\\times10^{2}=1.8\\times10^{3}$.',
    },
  ],
  21: [
    {
      prompt: 'ما ناتج $(3\\times4)^{2}+5$؟',
      choices: ['53', '144', '149'],
      correctIndex: 2,
      explain: '$3\\times4=12$ و$12^{2}=144$، ثم $144+5=149$.',
    },
  ],
  25: [
    {
      prompt: 'ما ناتج $\\left(10^{2}\\right)^{4}\\times10^{-3}$ بالشكل $10^{n}$؟',
      choices: ['10^{5}', '10^{-1}', '10^{6}'],
      correctIndex: 0,
      explain: '$(10^{2})^{4}=10^{8}$، و$10^{8}\\times10^{-3}=10^{5}$.',
    },
  ],
  27: [
    {
      prompt: 'ما الصيغة المعيارية للعدد $0.024\\times10^{-2}$؟',
      choices: ['2.4\\times10^{-3}', '2.4\\times10^{-4}', '24\\times10^{-4}'],
      correctIndex: 1,
      explain: '$0.024=2.4\\times10^{-2}$، ونجمع الأسين: $-2+(-2)=-4$.',
    },
  ],
  31: [
    {
      prompt: 'ما أبسط كتابة للمقدار $\\frac{x^{-3}}{x^{4}}$ مع $x\\neq0$؟',
      choices: ['x^{-1}', 'x^{7}', 'x^{-7}'],
      correctIndex: 2,
      explain: 'قسمة قوتين للأساس نفسه: $-3-4=-7$، فالناتج $x^{-7}$.',
    },
  ],
  35: [
    {
      prompt: 'ما قيمة الأس الناقص في $37.6\\times10^{p}=0.376$؟',
      choices: ['p=-2', 'p=2', 'p=-1'],
      correctIndex: 0,
      explain: 'الفاصلة انتقلت منزلتين نحو اليسار، أي قسمة على 100، فـ$p=-2$.',
    },
  ],
};

/* ------------------------------- الخطوات ------------------------------- */

const steps: LessonStep[] = unit2Lesson5Questions.map((question) => {
  const station = stationOf(question.n);
  return {
    id: `q-${question.n}`,
    title: `السؤال ${question.n}: ${question.title}`,
    subtitle: `من المصدر: ${SOURCE_SECTION} • ${question.items.length} ${question.items.length === 1 ? 'بند' : 'بنود'}`,
    sourcePages: [],
    sourceLabel: `السؤال ${question.n}`,
    groupId: station.id,
    groupTitle: station.title,
    blocks: buildBlocks(question),
  };
});

/* ---------------------------- مساحة المعلّم ---------------------------- */

const answerKeyItems = unit2Lesson5Questions.flatMap((question) =>
  question.items.map((item) => ({
    // A space keeps `Q3` + `1.①` distinguishable from `Q31` when parsing the number.
    ref: `Q${question.n} ${item.label}`.trim(),
    answer: item.answer ?? '',
    answerText: item.answerText,
    note: item.answerText ? undefined : item.reason,
  })),
);

const teacherArea: TeacherArea = {
  objectives: [
    'مراجعة مهارات الوحدة الثانية وتطبيقها على أسئلة الكتاب نفسها: قوى العدد 10 بقواعدها الثلاث، والصيغة المعيارية، والقوى الصحيحة للأعداد النسبية، والجذور التربيعية.',
    'بناء طلاقة في التحويل بين الكتابة العشرية والكتابة بقوى العدد 10 دون الاعتماد على الآلة.',
    'تعزيز الحسّ العددي: تقدير النتائج وحصرها والتحقق منها بطريق ثانية.',
    'تدريب الطالب على قراءة سؤال متعدد البنود وتنظيم خطواته، وعلى تصحيح حل خاطئ (السؤال 29).',
  ],
  commonMistakes: [
    {
      mistake: 'الخلط بين الضرب والجمع في القوى: $10^{6}+10^{2}=10^{8}$.',
      correction: 'الجمع يحتاج توحيد القوة ثم جمع المعاملين: $10^{6}+10^{2}=1\\,000\\,100$.',
    },
    {
      mistake: 'اعتبار كل عدد فيه $10^{n}$ في الصيغة المعيارية، مثل $0.385\\,2\\times10^{3}$.',
      correction: 'شرط الصيغة المعيارية $1\\leq a<10$؛ فـ$385.2=3.852\\times10^{2}$.',
    },
    {
      mistake: 'قراءة $12\\times10^{1}$ على أنها 120 000 (خطأ الطالب في السؤال 29).',
      correction: '$10^{1}=10$، فـ$12\\times10^{1}=120$.',
    },
    {
      mistake: 'ربط $(-a)^{n}$ بـ$-a^{n}$ دون الانتباه إلى زوجية الأس.',
      correction: '$(-2)^{4}=16$ بينما $-2^{4}=-16$، و$(-2)^{3}=-2^{3}=-8$.',
    },
    {
      mistake: 'جمع قوى الحروف في الجمع: $x^{2}+x^{2}=x^{4}$.',
      correction: '$x^{2}+x^{2}=2x^{2}$؛ الأسس تُجمع في الضرب فقط.',
    },
    {
      mistake: 'إغفال تربيع/تكعيب معامل الوحدة عند التحويل: $10\\ \\text{m}^{2}=10^{-3}\\ \\text{km}^{2}$.',
      correction: '$1\\ \\text{km}^{2}=10^{6}\\ \\text{m}^{2}$، فـ$10\\ \\text{m}^{2}=10^{-5}\\ \\text{km}^{2}$.',
    },
  ],
  remediation: [
    'ابدأ بمراجعة القواعد الثلاث لقوى العدد 10 على أمثلة صغيرة قبل الانتقال إلى الأسئلة المركبة.',
    'في أسئلة الجمع والطرح (18، 28، 39) اطلب من الطالب توحيد القوة أولًا وكتابتها صراحة قبل أي حساب.',
    'اطلب دائماً تحققاً بعدّ الأرقام: عدد أرقام العدد = عدد أرقام المعامل + الأس (تقريبًا).',
    'جرّب الحل بمسارين في السؤال الواحد (مثل 23: القسمة على $10^{6}$ أو التحويل إلى الصيغة المعيارية أولًا).',
    'خصّص وقتًا للأسئلة اللفظية (5، 34، 38) لتدريب الطالب على نقل الوصف اللفظي إلى قوة للعدد 10.',
  ],
  teachingNotes: [
    'الأسئلة مرتبة كما في المصدر؛ المحطات الثمانية تقسيم تنظيمي فقط ولا تغيّر الترتيب.',
    'الصور المجموعة لا تحمل أرقام صفحات مطبوعة؛ لذلك يُوسم كل سؤال بـ«السؤال N» بدل رقم صفحة، ولا يُختلق رقم صفحة.',
    'السؤال 1 هو سؤال واحد بعشرة بنود موزعة على صورتين (①–⑥ ثم ⑦–⑩)؛ تعامل معه كوحدة واحدة في التقويم.',
    'الأسئلة 3 و4 و6 و18 و30 و31 و39 فيها ترقيم متداخل (1. 2. 3. ثم ① ② ③)؛ حافظ على الترقيم في العرض والمناقشة.',
    'السؤال 9 ① فيه تعارض مطبوع بين المعامل والناتج؛ استعمله لدرس «لا تثق بالمساواة قبل التحقق».',
    'السؤال 29 نموذج جيد لتصحيح حل طالب: اطلب من الطلاب تحديد الخطأ في السطر الأول قبل قراءة ملاحظات المصحح.',
    'في الأسئلة التطبيقية (7، 23، 24، 33، 36) ذكّر بالوحدات: السنوات مقابل الثواني، والسنتيمتر مقابل السنتيمتر المربع.',
  ],
  assessmentGuidance: [
    'قيّم دقة الكتابة العلمية بمعيارين: صحة القيمة، وتحقّق شرط $1\\leq a<10$ في الصيغة المعيارية.',
    'في الأسئلة متعددة البنود، أعطِ درجة لكل بند بدل درجة واحدة للسؤال كي تظهر مواضع الضعف.',
    'اطلب التحقق المستقل في ثلاثة أسئلة على الأقل: 7 (بالقسمة العكسية)، 24 (بتربيع الناتج)، 36 (بضرب العدد في كتلة القنبلة).',
    'استعمل السؤال 2 كتقويم تشخيصي سريع: هو يغطي معظم أخطاء الوحدة الشائعة في صفحة واحدة.',
  ],
  answerKeys: unit2Lesson5Stations.map((station) => ({
    section: station.title,
    source: `${SOURCE_SECTION} • الأسئلة ${station.from}–${station.to}`,
    items: answerKeyItems.filter((item) => {
      const n = Number(/^Q(\d+)/.exec(item.ref)?.[1] ?? 0);
      return n >= station.from && n <= station.to;
    }),
  })),
  solutions: unit2Lesson5TeacherSolutions,
};

/* ------------------------------ بيانات الدرس ------------------------------ */

export const unit2Lesson5Data: LessonData = {
  id: 'u2-lesson-5',
  number: 5,
  unitId: 'unit-2',
  unitTitle: 'الوحدة الثانية: قوى الأعداد العادية',
  title: 'تمارين ومسائل الوحدة الثانية',
  description:
    'ورشة تدريب على أسئلة الوحدة الثانية: 39 سؤالًا أصليًا تشمل قوى العدد 10 وقواعدها، والصيغة المعيارية، والقوى الصحيحة للأعداد النسبية، والجذور التربيعية، مع حلول تفصيلية لكل بند فرعي.',
  sourcePages: [],
  sourceLabel: 'ورقة التمارين • 39 سؤالًا',
  steps,
  teacherArea,
};

export { unit2Lesson5Questions };
export type { ExerciseQuestion };
