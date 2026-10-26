import { errorAnalysis, matching, multiSelect, numeric, singleChoice, trueFalse } from '../builders';
import type { TestQuestion } from '../types';

/**
 * اختبار مستقل من إعداد المنصة، مبني على مطالب ص58–60 وقيمها وأمثلتها.
 * التنسيق والمشتتات مؤلَّفة، وليس فيها مسائل من خارج مصدر الدرس لملء العدد.
 */
const tex = String.raw;
const q = (id: string, prompt: string, difficulty: TestQuestion['difficulty'], conceptId: string,
  steps: string[], finalAnswer: string, explanation: string) => ({
  id, prompt, points: 1, difficulty, primaryLessonId: 'u3-lesson-5',
  curriculumRefs: [{ lessonId: 'u3-lesson-5', conceptId }],
  solution: { steps, finalAnswer, explanation },
});

export const unit3Lesson5TestQuestions: TestQuestion[] = [
  numeric({
    ...q('u3-l5-01', tex`في نشاط ص58، احسب $(3x+1)(x+2)$ عند $x=0$.`, 'basic', 'u3l5-substitution-counterexample',
      [tex`$3(0)+1=1$ و$0+2=2$.`, tex`الجداء $1\times2=2$.`], tex`$2$`, 'نعوّض القيمة في كل عامل ثم نضرب.'),
    acceptedAnswers: ['2'], answerFormat: 'عدد صحيح',
  }),
  singleChoice({
    ...q('u3-l5-02', tex`في سؤال الاختبار الثاني المطبوع، كم تساوي عبارة السؤال $x^2+6x+2$ عند $x=1$؟`, 'basic', 'u3l5-substitution-counterexample',
      [tex`نعوّض $x=1$ في العبارة المطبوعة في السؤال.`, tex`$1^2+6(1)+2=1+6+2=9$.`], tex`الخيار أ: $9$`,
      tex`عبارة السؤال بلا معامل 3، على خلاف طرف مساواة الطالب الأصلي.`),
    options: [{ id: 'a', label: '$9$' }, { id: 'b', label: '$11$' }, { id: 'c', label: '$12$' }, { id: 'd', label: '$7$' }], correctOptionId: 'a',
  }),
  singleChoice({
    ...q('u3-l5-03', tex`في مساواة الطالب الأصلية، ما قيمة الطرف $3x^2+6x+2$ عند $x=1$؟`, 'basic', 'u3l5-substitution-counterexample',
      [tex`$3(1)^2+6(1)+2=3+6+2$.`, tex`المجموع $11$.`], tex`الخيار ب: $11$`,
      tex`هذا الطرف مختلف عن عبارة السؤال المطبوع $x^2+6x+2$ التي تعطي 9.`),
    options: [{ id: 'a', label: '$9$' }, { id: 'b', label: '$11$' }, { id: 'c', label: '$12$' }, { id: 'd', label: '$13$' }], correctOptionId: 'b',
  }),
  trueFalse({
    ...q('u3-l5-04', tex`تساوي طرفي مساواة الطالب عند $x=0$ وحده يثبت صحتها لكل قيم $x$.`, 'reasoning', 'u3l5-substitution-counterexample',
      [tex`عند $x=0$ يساوي الطرفان 2.`, tex`عند $x=1$ يساوي الجداء 12 والطرف الأصلي 11؛ إذن ليست مطابقة.`],
      'خطأ؛ توافق قيمة واحدة لا يثبت المساواة العامة.', 'القيمة التي يختلف عندها الطرفان مثال معاكس.'), correctAnswer: false,
  }),
  singleChoice({
    ...q('u3-l5-05', tex`ما النشر المختزل الصحيح للجداء $(3x+1)(x+2)$ في بند «بدورك»؟`, 'intermediate', 'u3l5-correct-expansion',
      [tex`نوزّع فنحصل على $3x^2+6x+x+2$.`, tex`نجمع $6x+x=7x$.`], tex`الخيار ج: $3x^2+7x+2$`, 'كل حد في القوس الأول يُضرب في كل حد من الثاني.'),
    options: [
      { id: 'a', label: '$3x^2+6x+2$' }, { id: 'b', label: '$x^2+7x+2$' },
      { id: 'c', label: '$3x^2+7x+2$' }, { id: 'd', label: '$3x^2+6x+1$' },
    ], correctOptionId: 'c',
  }),
  errorAnalysis({
    ...q('u3-l5-06', tex`كتب الطالب $(3x+1)(x+2)=3x^2+6x+2$. ما الحد الذي أغفله في النشر؟`, 'advanced', 'u3l5-correct-expansion',
      [tex`الجداءات الأربعة هي $3x^2$ و$6x$ و$x$ و$2$.`, tex`الحد $1\times x=x$ مفقود في النتيجة المقترحة.`],
      tex`الخيار أ: الحد $1\times x=x$`, 'إغفال هذا الحد يعطي معامل 6 بدل 7 للحد الخطي.'),
    options: [
      { id: 'a', label: tex`الحد $1\times x=x$` }, { id: 'b', label: tex`الحد $3x\times2=6x$` },
      { id: 'c', label: tex`الحد $1\times2=2$` }, { id: 'd', label: tex`الحد $3x\times x=3x^2$` },
    ], correctOptionId: 'a',
  }),
  numeric({
    ...q('u3-l5-07', tex`في مثال «تعلّم»، احسب الطرف $x^2-3x-(x+2x^2)$ عند $x=1$.`, 'basic', 'u3l5-substitution-counterexample',
      [tex`نعوّض: $1-3-(1+2)$.`, tex`$1-3-3=-5$.`], tex`$-5$`, 'نحسب ما داخل القوس ثم نطرح قيمته.'),
    acceptedAnswers: ['-5'], answerFormat: 'عدد صحيح',
  }),
  singleChoice({
    ...q('u3-l5-08', tex`في المثال نفسه، ما قيمة الطرف الذي كتبه الطالب $3x^2-4x$ عند $x=1$؟`, 'basic', 'u3l5-substitution-counterexample',
      [tex`نعوّض: $3(1)^2-4(1)$.`, tex`$3-4=-1$.`], tex`الخيار د: $-1$`, 'يختلف عن الطرف الآخر الذي يساوي −5 عند القيمة نفسها.'),
    options: [{ id: 'a', label: '$-5$' }, { id: 'b', label: '$1$' }, { id: 'c', label: '$7$' }, { id: 'd', label: '$-1$' }], correctOptionId: 'd',
  }),
  trueFalse({
    ...q('u3-l5-09', tex`اختلاف الطرفين عند $x=1$ في مثال «تعلّم» يكفي لنقض صحة تلك المساواة لكل قيم $x$.`, 'intermediate', 'u3l5-substitution-counterexample',
      [tex`عند $x=1$ الطرفان $-5$ و$-1$.`, 'المساواة المدّعى صحتها لكل القيم تفشل عند هذه القيمة.'],
      'صحيح؛ هذه القيمة مثال معاكس.', 'مثال معاكس واحد يكفي لنقض ادعاء عام.'), correctAnswer: true,
  }),
  singleChoice({
    ...q('u3-l5-10', tex`في مثال ص59، ما الصورة المختزلة لـ $A=(x+1)(x+5)-6x$؟`, 'basic', 'u3l5-efficient-evaluation',
      [tex`$A=x^2+5x+x+5-6x$.`, tex`معامل $x$ يساوي $5+1-6=0$.`], tex`الخيار ب: $x^2+5$`,
      'السطر المطبوع ذو إشارة الطرح الزائدة موثّق، والنتيجة النهائية المطبوعة صحيحة.'),
    options: [{ id: 'a', label: '$x^2-5$' }, { id: 'b', label: '$x^2+5$' }, { id: 'c', label: '$x^2+6x+5$' }, { id: 'd', label: '$x^2-6x+5$' }], correctOptionId: 'b',
  }),
  numeric({
    ...q('u3-l5-11', tex`احسب $A=x^2+5$ عند $x=-30$ كما في المثال المحلول.`, 'intermediate', 'u3l5-efficient-evaluation',
      [tex`$(-30)^2=900$.`, tex`$900+5=905$.`], tex`$905$`, 'تربيع العدد السالب بين قوسين يعطي عددًا موجبًا.'),
    acceptedAnswers: ['905'], answerFormat: 'عدد صحيح',
  }),
  numeric({
    ...q('u3-l5-12', tex`في تنبيه ص59، احسب $x^2+5(x-20)(x^2-x+5)$ عند $x=20$.`, 'intermediate', 'u3l5-efficient-evaluation',
      [tex`$x-20=0$ فينعدم الجداء $5(x-20)(x^2-x+5)$.`, tex`تبقى $20^2=400$.`], tex`$400$`, 'في هذه العبارة يكون التعويض قبل النشر أسهل.'),
    acceptedAnswers: ['400'], answerFormat: 'عدد صحيح',
  }),
  singleChoice({
    ...q('u3-l5-13', tex`اختزل $Z=3(5x-1)-4(-2x+3)$ من «تحقّق من فهمك».`, 'intermediate', 'u3l5-evaluate-z-b',
      [tex`$3(5x-1)=15x-3$ و$-4(-2x+3)=8x-12$.`, tex`المجموع $23x-15$.`], tex`الخيار ج: $23x-15$`, 'نحمل إشارة −4 إلى الحدين داخل القوس.'),
    options: [{ id: 'a', label: '$7x-15$' }, { id: 'b', label: '$23x+9$' }, { id: 'c', label: '$23x-15$' }, { id: 'd', label: '$7x+9$' }], correctOptionId: 'c',
  }),
  numeric({
    ...q('u3-l5-14', tex`في تمرين $Z$، احسب $23x-15$ عند $x=\frac{15}{23}$.`, 'intermediate', 'u3l5-evaluate-z-b',
      [tex`$23\times\frac{15}{23}=15$.`, tex`إذن $23x-15=15-15=0$.`], tex`$0$`,
      'اختزال التعبير يسهّل التعويض بالكسر.'),
    acceptedAnswers: ['0'], answerFormat: 'عدد صحيح',
  }),
  singleChoice({
    ...q('u3-l5-15', tex`ما الصورة المختزلة للعبارة $B=x(-x+3)-3(x^2+2x)$؟`, 'advanced', 'u3l5-evaluate-z-b',
      [tex`ننشر: $B=-x^2+3x-3x^2-6x$.`, tex`نجمع الحدود المتشابهة: $B=-4x^2-3x$.`],
      tex`الخيار د: $-4x^2-3x$`, 'نوزّع −3 على حدّي القوس ثم نجمع معاملات الحدود المتشابهة.'),
    options: [
      { id: 'a', label: '$-4x^2+9x$' }, { id: 'b', label: '$2x^2-3x$' },
      { id: 'c', label: '$-4x^2+3x$' }, { id: 'd', label: '$-4x^2-3x$' },
    ], correctOptionId: 'd',
  }),
  matching({
    ...q('u3-l5-16', tex`طابق القيمتين الأوليين المطلوبتين في تمرين $B=-4x^2-3x$ مع نتيجتيهما.`, 'intermediate', 'u3l5-evaluate-z-b',
      [tex`عند $x=-1$: $-4+3=-1$.`, tex`وعند $x=2$: $-16-6=-22$.`],
      tex`$-1\to-1$ و$2\to-22$.`, 'نربّع قيمة x أولًا ثم نحسب كل حد بإشارته.'),
    leftItems: [{ id: 'l1', label: '$x=-1$' }, { id: 'l2', label: '$x=2$' }],
    rightItems: [{ id: 'r1', label: '$-22$' }, { id: 'r2', label: '$-1$' }],
    correctPairs: { l1: 'r2', l2: 'r1' },
  }),
  numeric({
    ...q('u3-l5-17', tex`في الحالة الثالثة من تمرين $B$، احسب $-4x^2-3x$ عند $x=-1{,}5$.`, 'advanced', 'u3l5-evaluate-z-b',
      [tex`$(-1.5)^2=2.25$، والحد الأول $-4(2.25)=-9$.`, tex`الحد الثاني $-3(-1.5)=4.5$، والمجموع $-4.5$.`], tex`$-4.5$`, 'يمكن كتابة النتيجة ككسر −9/2.'),
    acceptedAnswers: ['-4.5', '-9/2'], answerFormat: 'عدد عشري أو كسر',
  }),
  singleChoice({
    ...q('u3-l5-18', tex`للمتوازي في ص60 أبعاد $x$ و$x+3$ و$x+5$. ما مساحة أوجهه الستة بعد الاختزال؟`, 'advanced', 'u3l5-prism-surface',
      [tex`$S=2[x(x+3)+x(x+5)+(x+3)(x+5)]$.`, tex`بعد النشر $S=2(3x^2+16x+15)=6x^2+32x+30$.`],
      tex`الخيار ب: $6x^2+32x+30$`, 'هناك ثلاثة أزواج من الأوجه المتقابلة المتساوية.'),
    options: [
      { id: 'a', label: '$3x^2+16x+15$' }, { id: 'b', label: '$6x^2+32x+30$' },
      { id: 'c', label: '$6x^2+16x+30$' }, { id: 'd', label: '$x^2+8x+15$' },
    ], correctOptionId: 'b',
  }),
  numeric({
    ...q('u3-l5-19', tex`ما مساحة السطح الكلي لمتوازي المستطيلات المرسوم في ص60 عند $x=5$ بالسنتيمتر المربع؟`, 'reasoning', 'u3l5-prism-surface',
      [tex`الأبعاد تصبح $5$ و$8$ و$10$ سم.`, tex`$S=2(5\times8+5\times10+8\times10)=2(170)=340$.`],
      tex`$340$ سم²`, 'نجمع المساحات المختلفة الثلاث ونضاعفها للأوجه المقابلة.'),
    acceptedAnswers: ['340'], answerFormat: 'عدد بالسنتيمتر المربع',
  }),
  multiSelect({
    ...q('u3-l5-20', 'من بين إنجازات حسان ووضاح ولينا في ص60، أيّها يبرهن المساواة لكل قيم x؟ اختر كل الإجابات الصحيحة.', 'reasoning', 'u3l5-proof-methods',
      ['حسان حسب الطرفين عند قيمة واحدة؛ ذلك لا يبرهن الصحة العامة.', 'وضاح نشر رمزيًا؛ ولينا وزّعت الحدود بالأسهم، وكلتاهما تصل إلى الطرف الآخر لجميع القيم.'],
      'الخياران ب ود: نشر وضاح الرمزي، ونشر لينا بالأسهم.', 'البرهان بالتوزيع لا يعتمد على قيمة معينة للرمز.'),
    options: [
      { id: 'a', label: 'اختبار حسان عند قيمة واحدة فقط' },
      { id: 'b', label: 'نشر وضاح الرمزي' },
      { id: 'c', label: 'استنتاج حسان العام من الاختبار وحده' },
      { id: 'd', label: 'نشر لينا بالأسهم' },
    ], correctOptionIds: ['b', 'd'],
  }),
];
