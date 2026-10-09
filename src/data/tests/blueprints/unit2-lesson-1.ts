import type { LessonTestBlueprint } from '../types';

/**
 * مخطط اختبار الدرس الأول من الوحدة الثانية (قوى العدد 10).
 * مُعدّ من الدرس نفسه (صفحات 26–28): نشاط السُّلّم، والتعريفان، ومثال 10^-6،
 * والصيغة المعيارية، والتحويل بين الصيغ، وتحقّق من فهمك، وتدرّب 1–4.
 */
export const unit2Lesson1Blueprint: LessonTestBlueprint = {
  lessonId: 'u2-lesson-1',
  sourceSteps: [
    'step-1', 'step-2', 'step-3', 'step-4', 'step-5', 'step-6', 'step-7',
    'step-8', 'step-9', 'step-10', 'step-11', 'step-12', 'step-13',
  ],
  concepts: [
    {
      conceptId: 'u2l1-power-meaning',
      title: 'معنى القوة 10^n للأس الموجب والصفر',
      questionCount: 3,
      skills: ['معنى القوة تكرار الضرب', 'القيمة 10^0 و10^1'],
    },
    {
      conceptId: 'u2l1-negative-powers',
      title: 'القوة السالبة للعدد 10 مقلوب القوة الموجبة',
      questionCount: 6,
      skills: ['تحويل 10^{-n} إلى كسر وإلى عدد عشري', 'مقارنة قوى سالبة وموجبة', 'تبرير أن القوة السالبة ليست عددًا سالبًا'],
    },
    {
      conceptId: 'u2l1-power-to-decimal',
      title: 'الانتقال من قوة العدد 10 إلى الشكل العشري',
      questionCount: 3,
      skills: ['كتابة 10^n بالصيغة العشرية', 'تحديد اتجاه الفاصلة حسب إشارة الأس'],
    },
    {
      conceptId: 'u2l1-decimal-to-power',
      title: 'الانتقال من العدد العشري إلى قوة العدد 10',
      questionCount: 2,
      skills: ['كتابة العدد بدلالة قوة للعدد 10', 'جمع الأسس عند ضرب قوى العدد 10'],
    },
    {
      conceptId: 'u2l1-standard-form',
      title: 'الصيغة المعيارية a×10^n',
      questionCount: 3,
      skills: ['تحديد الأس عند كتابة العدد بالصيغة المعيارية', 'تحديد العدد a بين 1 و10'],
    },
    {
      conceptId: 'u2l1-exponent-conversion',
      title: 'تحويل عدد من صيغة معيارية إلى صيغة بأس آخر',
      questionCount: 2,
      skills: ['استعمال 10^x×10^y=10^{x+y}', 'تبديل الأس مع تعويض الجزء المقابل في a'],
    },
    {
      conceptId: 'u2l1-application',
      title: 'تطبيق على أعداد كبيرة من الواقع',
      questionCount: 1,
      skills: ['ترجمة عبارة لفظية (مليار) إلى قوة للعدد 10 والصيغة المعيارية'],
    },
  ],
  difficultyPlan: { basic: 6, intermediate: 7, advanced: 4, reasoning: 3 },
  questionTypePlan: {
    'single-choice': 4,
    numeric: 8,
    'true-false': 3,
    'multi-select': 1,
    ordering: 1,
    matching: 1,
    'error-analysis': 2,
  },
  commonMistakes: [
    'اعتبار $10^{-3}$ عددًا سالبًا لأن الأس سالب.',
    'كتابة $10^3$ على أنها $10\\times3$ بدلًا من تكرار الضرب.',
    'نقل الفاصلة في الاتجاه الخاطئ عند الانتقال إلى الشكل العشري.',
    'ترك أكثر من خانة غير صفرية قبل الفاصلة في الصيغة المعيارية.',
    'نسيان إشارة الأس السالب عند جمع الأسس.',
  ],
};
