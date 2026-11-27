import type { LessonTestBlueprint } from '../types';

/**
 * مخطط اختبار الدرس الثالث من الوحدة الرابعة («اصطناع معادلة»، ص75–77).
 */
export const unit4Lesson3Blueprint: LessonTestBlueprint = {
  lessonId: 'u4-lesson-3',
  sourceSteps: ['step-1', 'step-2', 'step-3', 'step-4', 'step-5', 'step-6'],
  concepts: [
    {
      conceptId: 'u4l3-model-two-expressions',
      title: 'تعبيران للكمّية نفسها أساسًا لكتابة المعادلة',
      questionCount: 5,
      skills: [
        'تحويل نصّ إلى مساواة بين تعبيرين',
        'الحكم على صحّة تخمين في سياق',
        'تشخيص تعبير خاطئ في نموذج',
      ],
    },
    {
      conceptId: 'u4l3-choose-unknown',
      title: 'اختيار المجهول والتعبير عن الكمّيات الأخرى بدلالته',
      questionCount: 5,
      skills: [
        'تمثيل كمّية بدلالة مجهول واحد',
        'ترجمة علاقة مقارنة («يزيد بـ»، «مثلي»)',
        'اختيار المجهول الأبسط',
      ],
    },
    {
      conceptId: 'u4l3-two-state-table',
      title: 'تنظيم معطيات مسألة ذات حالتين في جدول',
      questionCount: 3,
      skills: [
        'ملء جدول قبل/بعد',
        'تطبيق التغيّر على الجهة الصحيحة',
        'كتابة المعادلة من الجدول',
      ],
    },
    {
      conceptId: 'u4l3-mixed-quantities',
      title: 'مسائل الخلط: كمّيتان بسعرين ومجموع معروف',
      questionCount: 4,
      skills: [
        'التعبير عن الكمّية المتمّمة',
        'بناء معادلة الثمن الكلّي',
        'حلّ المعادلة وتأويل النتيجة',
      ],
    },
    {
      conceptId: 'u4l3-capacity-model',
      title: 'مسائل السعة والعبوات بتعبيرين للعدد نفسه',
      questionCount: 2,
      skills: [
        'بناء تعبيرين لعدد الأقراص',
        'التمييز بين عدد العبوات وسعتها',
      ],
    },
    {
      conceptId: 'u4l3-interpret-and-check',
      title: 'تأويل الحلّ والتحقّق في نصّ المسألة',
      questionCount: 1,
      skills: [
        'التحقّق في السياق',
        'الإجابة بالكمّية المطلوبة مع وحدتها',
      ],
    },
  ],
  difficultyPlan: { basic: 6, intermediate: 7, advanced: 4, reasoning: 3 },
  questionTypePlan: {
    'single-choice': 8,
    numeric: 5,
    'true-false': 2,
    'multi-select': 2,
    'error-analysis': 2,
    ordering: 1,
  },
  commonMistakes: [
    'تسمية مجهولين لمعادلة واحدة ثم عدم القدرة على الحلّ.',
    'قلب علاقة «الفتيات مثلي الفتيان» في مسألة الحالتين.',
    'تطبيق التغيّر على الجهتين معًا في مسألة قبل/بعد.',
    'نسيان أن العددين المبيعين مجموعهما العدد الكلّي في مسألة الخلط.',
    'الإجابة بقيمة المجهول بينما السؤال يطلب كمّية أخرى أو وحدة معيّنة.',
  ],
};
