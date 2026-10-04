import { curriculum } from '../curriculum';
import { lessonBlueprints } from './blueprints';
import { lesson1TestQuestions } from './unit1/lesson-1';
import { lesson2TestQuestions } from './unit1/lesson-2';
import { lesson3TestQuestions } from './unit1/lesson-3';
import { lesson4TestQuestions } from './unit1/lesson-4';
import { unit1TestQuestions } from './unit1/unit-1';
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
