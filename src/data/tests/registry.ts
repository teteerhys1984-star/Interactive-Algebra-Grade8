import { curriculum } from '../curriculum';
import { lessonBlueprints } from './blueprints';
import { lesson1TestQuestions } from './unit1/lesson-1';
import { lesson2TestQuestions } from './unit1/lesson-2';
import { lesson3TestQuestions } from './unit1/lesson-3';
import { lesson4TestQuestions } from './unit1/lesson-4';
import { unit1TestQuestions } from './unit1/unit-1';
import { unit2Lesson1TestQuestions } from './unit2/lesson-1';
import { unit2Lesson2TestQuestions } from './unit2/lesson-2';
import { unit2Lesson3TestQuestions } from './unit2/lesson-3';
import { unit2Lesson4TestQuestions } from './unit2/lesson-4';
import { unit2Lesson5TestQuestions } from './unit2/lesson-5';
import { unit2TestQuestions, UNIT2_DIFFICULTY_BLUEPRINT } from './unit2/unit-2';
import { unit3Lesson1TestQuestions } from './unit3/lesson-1';
import { unit3Lesson2TestQuestions } from './unit3/lesson-2';
import type { ResolvedTest, TestDefinition, TestQuestion, TestType } from './types';

const lessonDefinitions: TestDefinition[] = [
  {
    id: 'u1-test-lesson-1',
    type: 'lesson',
    unitId: 'unit-1',
    lessonId: 'lesson-1',
    title: 'اختبار الدرس الأول: الجمع والطرح',
    description: 'اختبر فهمك للكسور المتكافئة، وتوحيد المقامات، والجمع والطرح، والإشارات.',
    questionIds: lesson1TestQuestions.map((question) => question.id),
    difficultyLabel: 'متدرّج: أساسي، متوسط، متقدم، وتفكير',
    coverageLabel: 'جمع وطرح الكسور، الإشارات، وتوحيد المقامات',
    estimatedMinutes: 25,
    blueprint: lessonBlueprints['lesson-1'],
  },
  {
    id: 'u1-test-lesson-2',
    type: 'lesson',
    unitId: 'unit-1',
    lessonId: 'lesson-2',
    title: 'اختبار الدرس الثاني: الضرب',
    description: 'تدرب على ضرب الكسور والأعداد الجبرية، والاختصار، والنشر والتحليل.',
    questionIds: lesson2TestQuestions.map((question) => question.id),
    difficultyLabel: 'متدرّج: أساسي، متوسط، متقدم، وتفكير',
    coverageLabel: 'ضرب الكسور، الإشارات، خاصية التوزيع، والحدود المتشابهة',
    estimatedMinutes: 25,
    blueprint: lessonBlueprints['lesson-2'],
  },
  {
    id: 'u1-test-lesson-3',
    type: 'lesson',
    unitId: 'unit-1',
    lessonId: 'lesson-3',
    title: 'اختبار الدرس الثالث: القسمة',
    description: 'راجع المقلوب، والقسمة على كسر، والإشارات، وترتيب العمليات والكسور المركبة.',
    questionIds: lesson3TestQuestions.map((question) => question.id),
    difficultyLabel: 'متدرّج: أساسي، متوسط، متقدم، وتفكير',
    coverageLabel: 'القسمة على الكسور، المقلوب، ترتيب العمليات، والصفر',
    estimatedMinutes: 25,
    blueprint: lessonBlueprints['lesson-3'],
  },
  {
    id: 'u1-test-lesson-4',
    type: 'lesson',
    unitId: 'unit-1',
    lessonId: 'lesson-4',
    title: 'اختبار الدرس الرابع: تمارين الوحدة الأولى',
    description: 'اختبار مستقل بأسئلة جديدة يدمج مفاهيم تمارين الوحدة الأولى الأربعة.',
    questionIds: lesson4TestQuestions.map((question) => question.id),
    difficultyLabel: 'متدرّج: أساسي، متوسط، متقدم، وتفكير',
    coverageLabel: 'تطبيقات ومسائل تكاملية من دروس الوحدة الأربعة',
    estimatedMinutes: 25,
    blueprint: lessonBlueprints['lesson-4'],
  },
  {
    id: 'u2-test-lesson-1',
    type: 'lesson',
    unitId: 'unit-2',
    lessonId: 'u2-lesson-1',
    title: 'اختبار الدرس الأول: قوى العدد 10',
    description: 'اختبر فهمك لقوى العدد 10 بأسس موجبة وسالبة، والانتقال إلى الشكل العشري، والصيغة المعيارية.',
    questionIds: unit2Lesson1TestQuestions.map((question) => question.id),
    difficultyLabel: 'متدرّج: أساسي، متوسط، متقدم، وتفكير',
    coverageLabel: 'قوى العدد 10، القوة السالبة، الشكل العشري، والصيغة المعيارية',
    estimatedMinutes: 25,
    blueprint: lessonBlueprints['u2-lesson-1'],
  },
  {
    id: 'u2-test-lesson-2',
    type: 'lesson',
    unitId: 'unit-2',
    lessonId: 'u2-lesson-2',
    title: 'اختبار الدرس الثاني: قواعد قوى العدد 10',
    description: 'اختبر فهمك للقواعد الأربع لقوى العدد 10، وللحساب مع أعداد بصيغة a×10^n، ولحصر العدد بين قوتين متتاليتين.',
    questionIds: unit2Lesson2TestQuestions.map((question) => question.id),
    difficultyLabel: 'متدرّج: أساسي، متوسط، متقدم، وتفكير',
    coverageLabel: 'الضرب، القسمة، قوة القوة، المقلوب، الحساب بالصيغة المعيارية، والحصر',
    estimatedMinutes: 25,
    blueprint: lessonBlueprints['u2-lesson-2'],
  },
  {
    id: 'u2-test-lesson-3',
    type: 'lesson',
    unitId: 'unit-2',
    lessonId: 'u2-lesson-3',
    title: 'اختبار الدرس الثالث: قوى صحيحة لعدد نسبي',
    description: 'اختبر فهمك لمعنى القوة وحالاتها الخاصة، والقوة السالبة، وقواعد حساب القوى الأربع، وأولويات العمليات، وتطبيقها على حجم المكعب.',
    questionIds: unit2Lesson3TestQuestions.map((question) => question.id),
    difficultyLabel: 'متدرّج: أساسي، متوسط، متقدم، وتفكير',
    coverageLabel: 'القوة السالبة، إشارة القوة، قواعد الضرب والقسمة وقوة الجداء وقوة الخارج، أولويات العمليات، وتطبيقات الحجم',
    estimatedMinutes: 25,
    blueprint: lessonBlueprints['u2-lesson-3'],
  },
  {
    id: 'u2-test-lesson-4',
    type: 'lesson',
    unitId: 'unit-2',
    lessonId: 'u2-lesson-4',
    title: 'اختبار الدرس الرابع: الجذور التربيعية',
    description: 'اختبر فهمك لتعريف الجذر التربيعي، والعدد السالب والصفر، وخاصيتي الجداء والنسبة، وقوة الجذر، وتبسيط الجذور، وحساب طول ضلع المربع.',
    questionIds: unit2Lesson4TestQuestions.map((question) => question.id),
    difficultyLabel: 'متدرّج: أساسي، متوسط، متقدم، وتفكير',
    coverageLabel: 'تعريف الجذر، العدد السالب والصفر، جذر الجداء والنسبة، قوة الجذر، التبسيط، ومساحة المربع',
    estimatedMinutes: 25,
    blueprint: lessonBlueprints['u2-lesson-4'],
  },
  {
    id: 'u2-test-lesson-5',
    type: 'lesson',
    unitId: 'unit-2',
    lessonId: 'u2-lesson-5',
    title: 'اختبار الدرس الخامس: تمارين ومسائل الوحدة الثانية',
    description: 'اختبر فهمك لأسئلة الوحدة الثانية: الصيغة المعيارية، وقواعد قوى العدد 10، وأولويات العمليات، والتحويلات، والتطبيقات الهندسية.',
    questionIds: unit2Lesson5TestQuestions.map((question) => question.id),
    difficultyLabel: 'متدرّج: أساسي، متوسط، متقدم، وتفكير',
    coverageLabel: 'الصيغة المعيارية، قواعد القوى، أولويات العمليات، الجمع والطرح بصيغة a×10^n، التحويلات، وتطبيقات المساحة والحجم',
    estimatedMinutes: 25,
    blueprint: lessonBlueprints['u2-lesson-5'],
  },
  {
    id: 'u3-test-lesson-1',
    type: 'lesson',
    unitId: 'unit-3',
    lessonId: 'u3-lesson-1',
    title: 'اختبار الدرس الأول: نظير المجموع ونظير الفرق',
    description: 'اختبر فهمك لنظير المجموع ونظير الفرق، والتمثيل على المستقيم الموجه، وحذف الأقواس المسبوقة بناقص، وتوظيف النظير في التبسيط والحساب.',
    questionIds: unit3Lesson1TestQuestions.map((question) => question.id),
    difficultyLabel: 'متدرّج: أساسي، متوسط، متقدم، وتفكير',
    coverageLabel: 'نظير المجموع، نظير الفرق، المستقيم الموجه، حذف الأقواس، الموازنة العددية والرمزية، والمخططات التحويلية',
    estimatedMinutes: 25,
    blueprint: lessonBlueprints['u3-lesson-1'],
  },
  {
    id: 'u3-test-lesson-2',
    type: 'lesson',
    unitId: 'unit-3',
    lessonId: 'u3-lesson-2',
    title: 'اختبار الدرس الثاني: حذف الأقواس',
    description: 'اختبر فهمك لحذف الأقواس المسبوقة بإشارة زائد (بما فيها الزائد الضمني) وبإشارة ناقص (جمع النظير)، والكتابة دون أقواس وحساب القيمة على أعداد صحيحة وعشرية وكسرية، واختبار المساوات بالتعويض عند x = 1، وتبسيط العبارات متعددة الأقواس.',
    questionIds: unit3Lesson2TestQuestions.map((question) => question.id),
    difficultyLabel: 'متدرّج: أساسي، متوسط، متقدم، وتفكير',
    coverageLabel: 'حذف الأقواس المسبوقة بـ + و −، التقييم العددي (صحيح/عشري/كسري)، اختبار المساواة بالتعويض، تبسيط العبارات متعددة الأقواس',
    estimatedMinutes: 25,
    blueprint: lessonBlueprints['u3-lesson-2'],
  },
];

const unitDefinitions: TestDefinition[] = [
  {
    id: 'u1-test-unit-1',
    type: 'unit',
    unitId: 'unit-1',
    title: 'اختبار الوحدة الأولى: الأعداد العادية والعمليات عليها',
    description: 'ستون سؤالًا جديدًا بتغطية متوازنة، تجمع بين الحساب الدقيق والتطبيق والتحليل عبر الدروس الأربعة.',
    questionIds: unit1TestQuestions.map((question) => question.id),
    difficultyLabel: '18 أساسي • 21 متوسط • 12 متقدم • 9 تفكير',
    coverageLabel: 'الدروس 1–4، مع أسئلة تكاملية تربط بين أكثر من مفهوم',
    estimatedMinutes: 70,
    coverageBlueprint: {
      'lesson-1': 13,
      'lesson-2': 14,
      'lesson-3': 15,
      'lesson-4': 18,
    },
    difficultyBlueprint: { basic: 18, intermediate: 21, advanced: 12, reasoning: 9 },
  },
  {
    id: 'u2-test-unit-2',
    type: 'unit',
    unitId: 'unit-2',
    title: 'اختبار الوحدة الثانية: قوى الأعداد العادية والجذور التربيعية',
    description: 'اثنان وخمسون سؤالًا جديدًا بتغطية متوازنة لدروس الوحدة الأربعة: قوى العدد 10، وقواعدها، والقوى الصحيحة لعدد نسبي، والجذور التربيعية.',
    questionIds: unit2TestQuestions.map((question) => question.id),
    difficultyLabel: '16 أساسي • 18 متوسط • 11 متقدم • 7 تفكير',
    coverageLabel: 'الدروس 1–4 بالتساوي، مع أسئلة تكاملية تربط بين القوى والجذور',
    estimatedMinutes: 60,
    coverageBlueprint: {
      'u2-lesson-1': 13,
      'u2-lesson-2': 13,
      'u2-lesson-3': 13,
      'u2-lesson-4': 13,
    },
    difficultyBlueprint: UNIT2_DIFFICULTY_BLUEPRINT,
    // درس التمارين (u2-lesson-5) أُضيف إلى المنهاج باختباره المستقل، ولم يُوسَّع
    // اختبار الوحدة بعد. الإعلان هنا يجعل الفجوة مرئية في التدقيق بدل أن تكون صامتة،
    // ويمنع إضافة أسئلة الوحدة تلقائيًا دون مراجعة تربوية.
    pendingLessonCoverage: [
      {
        lessonId: 'u2-lesson-5',
        reason: 'اختبار الوحدة الثانية (52 سؤالًا) بُني قبل إضافة درس التمارين، وتوسيعه قرار تربوي منفصل يُراجع لاحقًا.',
        trackedBy: 'PR: Add Unit 2 Exercise Lesson — 39 Questions with Detailed Solutions',
      },
    ],
  },
];

/** Reserved for future assessments; the catalog hides this category while empty. */
const comprehensiveDefinitions: TestDefinition[] = [];

/** Curriculum order of lessons, so the catalog lists lesson tests in reading order. */
const curriculumLessonOrder: string[] = curriculum.flatMap((unit) => unit.lessons.map((lesson) => lesson.id));

export const testDefinitions: TestDefinition[] = [
  ...lessonDefinitions,
  ...unitDefinitions,
  ...comprehensiveDefinitions,
];

export const questionBank: readonly TestQuestion[] = [
  ...lesson1TestQuestions,
  ...lesson2TestQuestions,
  ...lesson3TestQuestions,
  ...lesson4TestQuestions,
  ...unit2Lesson1TestQuestions,
  ...unit2Lesson2TestQuestions,
  ...unit2Lesson3TestQuestions,
  ...unit2Lesson4TestQuestions,
  ...unit2Lesson5TestQuestions,
  ...unit3Lesson1TestQuestions,
  ...unit3Lesson2TestQuestions,
  ...unit2TestQuestions,
  ...unit1TestQuestions,
];

const definitionsById = new Map(testDefinitions.map((definition) => [definition.id, definition]));
const questionsById = new Map(questionBank.map((question) => [question.id, question]));

export function getTestDefinition(testId: string): TestDefinition | undefined {
  return definitionsById.get(testId);
}

export function getTestsByType(type: TestType): TestDefinition[] {
  const tests = testDefinitions.filter((test) => test.type === type);
  if (type !== 'lesson') return tests;

  // Lesson tests follow the curriculum, so a newly registered lesson test lands
  // next to its lesson in the Test Area without any component change.
  const position = (test: TestDefinition): number => {
    const index = test.lessonId ? curriculumLessonOrder.indexOf(test.lessonId) : -1;
    return index === -1 ? Number.MAX_SAFE_INTEGER : index;
  };
  return [...tests].sort((a, b) => position(a) - position(b));
}

export function resolveTest(testOrId: string | TestDefinition): ResolvedTest | undefined {
  const definition = typeof testOrId === 'string' ? getTestDefinition(testOrId) : testOrId;
  if (!definition) return undefined;

  const questions = definition.questionIds
    .map((questionId) => questionsById.get(questionId))
    .filter((question): question is TestQuestion => question !== undefined);

  if (questions.length !== definition.questionIds.length) return undefined;

  return {
    ...definition,
    questions,
    questionCount: questions.length,
  };
}

export function getQuestionById(questionId: string): TestQuestion | undefined {
  return questionsById.get(questionId);
}
