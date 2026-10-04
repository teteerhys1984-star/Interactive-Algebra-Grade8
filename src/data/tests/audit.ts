import { gradeQuestion, isAnswerProvided, scoreTest } from './scoring';
import { getTestsByType, questionBank, testDefinitions, resolveTest } from './registry';
import type { AnswerMap, QuestionAnswer, TestQuestion } from './types';

const LESSON_IDS = new Set(['lesson-1', 'lesson-2', 'lesson-3', 'lesson-4']);
const EXPECTED_UNIT_BLUEPRINT: Record<string, number> = {
  'lesson-1': 13,
  'lesson-2': 14,
  'lesson-3': 15,
  'lesson-4': 18,
};

function correctAnswerFor(question: TestQuestion): QuestionAnswer {
  switch (question.type) {
    case 'single-choice':
    case 'error-analysis': return question.correctOptionId;
    case 'true-false': return question.correctAnswer;
    case 'numeric': return question.acceptedAnswers[0] ?? '';
    case 'multi-select': return question.correctOptionIds;
    case 'ordering': return question.correctOrder;
    case 'matching': return question.correctPairs;
  }
}

function hasUniqueIds(ids: string[]): boolean {
  return new Set(ids).size === ids.length;
}

/**
 * Content-integrity checks for the curated question bank. This deliberately
 * complements (rather than replaces) a human curriculum/math review.
 */
export function auditTestBank(): string[] {
  const issues: string[] = [];
  const lessonTests = getTestsByType('lesson');
  const unitTests = getTestsByType('unit');
  const comprehensiveTests = getTestsByType('comprehensive');

  if (lessonTests.length !== 4) issues.push(`Expected 4 lesson tests; found ${lessonTests.length}.`);
  if (new Set(lessonTests.map((test) => test.lessonId)).size !== 4
    || lessonTests.some((test) => !test.lessonId || !LESSON_IDS.has(test.lessonId))) {
    issues.push('Lesson tests must map one-to-one to Lessons 1–4.');
  }
  if (unitTests.length !== 1) issues.push(`Expected 1 unit test; found ${unitTests.length}.`);
  if (comprehensiveTests.length !== 0) issues.push('Comprehensive tests should remain absent until populated.');
  if (questionBank.length !== 140) issues.push(`Expected 140 questions in the bank; found ${questionBank.length}.`);

  const questionIds = questionBank.map((question) => question.id);
  if (!hasUniqueIds(questionIds)) issues.push('Question IDs are not globally unique.');

  const promptOwners = new Map<string, string>();
  for (const question of questionBank) {
    const normalizedPrompt = question.prompt.normalize('NFKC').replace(/\s+/g, ' ').trim();
    const previous = promptOwners.get(normalizedPrompt);
    if (previous) issues.push(`Duplicate prompt on ${previous} and ${question.id}.`);
    else promptOwners.set(normalizedPrompt, question.id);

    if (!question.prompt.trim()) issues.push(`${question.id}: prompt is empty.`);
    if (!Number.isFinite(question.points) || question.points <= 0) issues.push(`${question.id}: points must be positive.`);
    if (question.solution.steps.length < 2 || question.solution.steps.some((step) => !step.trim())) {
      issues.push(`${question.id}: worked solution needs at least two non-empty steps.`);
    }
    if (!question.solution.finalAnswer.trim()) issues.push(`${question.id}: final answer is empty.`);
    if (!question.solution.explanation.trim()) issues.push(`${question.id}: conceptual explanation is empty.`);
    if (!LESSON_IDS.has(question.primaryLessonId)) issues.push(`${question.id}: unknown primary lesson.`);
    if (!question.curriculumRefs.some((reference) => reference.lessonId === question.primaryLessonId)) {
      issues.push(`${question.id}: curriculum references omit its primary lesson.`);
    }
    for (const reference of question.curriculumRefs) {
      if (!LESSON_IDS.has(reference.lessonId) || !reference.conceptId.trim()) {
        issues.push(`${question.id}: invalid curriculum reference.`);
      }
    }

    if (!gradeQuestion(question, correctAnswerFor(question))) {
      issues.push(`${question.id}: its configured correct answer does not pass the scoring engine.`);
    }
    if (!isAnswerProvided(question, correctAnswerFor(question))) {
      issues.push(`${question.id}: its configured correct answer is treated as unanswered.`);
    }

    switch (question.type) {
      case 'single-choice':
      case 'error-analysis': {
        const optionIds = question.options.map((option) => option.id);
        if (optionIds.length < 2 || !hasUniqueIds(optionIds)) issues.push(`${question.id}: invalid choice IDs.`);
        if (!optionIds.includes(question.correctOptionId)) issues.push(`${question.id}: correct option is missing.`);
        break;
      }
      case 'true-false':
        break;
      case 'numeric':
        if (question.acceptedAnswers.length === 0) issues.push(`${question.id}: no accepted numeric answer.`);
        if (!question.answerFormat.trim()) issues.push(`${question.id}: answer format is missing.`);
        break;
      case 'multi-select': {
        const optionIds = question.options.map((option) => option.id);
        if (optionIds.length < 2 || !hasUniqueIds(optionIds)) issues.push(`${question.id}: invalid multi-select option IDs.`);
        if (question.correctOptionIds.length === 0 || !hasUniqueIds(question.correctOptionIds)) {
          issues.push(`${question.id}: invalid correct multi-select set.`);
        }
        if (question.correctOptionIds.some((id) => !optionIds.includes(id))) {
          issues.push(`${question.id}: correct multi-select option is missing.`);
        }
        break;
      }
      case 'ordering': {
        const itemIds = question.items.map((item) => item.id);
        if (!hasUniqueIds(itemIds) || !hasUniqueIds(question.correctOrder)) {
          issues.push(`${question.id}: ordering IDs are not unique.`);
        }
        if (itemIds.length !== question.correctOrder.length
          || itemIds.some((id) => !question.correctOrder.includes(id))) {
          issues.push(`${question.id}: correct ordering is not a permutation of its items.`);
        }
        break;
      }
      case 'matching': {
        const leftIds = question.leftItems.map((item) => item.id);
        const rightIds = question.rightItems.map((item) => item.id);
        const answerKeys = Object.keys(question.correctPairs);
        const answerValues = Object.values(question.correctPairs);
        if (!hasUniqueIds(leftIds) || !hasUniqueIds(rightIds)) issues.push(`${question.id}: matching IDs are not unique.`);
        if (!hasUniqueIds(answerValues)) issues.push(`${question.id}: matching answer reuses a right-side item.`);
        if (leftIds.length !== answerKeys.length || leftIds.some((id) => !answerKeys.includes(id))) {
          issues.push(`${question.id}: matching key set does not cover the left side.`);
        }
        if (answerValues.some((id) => !rightIds.includes(id))) issues.push(`${question.id}: matching answer references a missing right-side item.`);
        break;
      }
    }
  }

  const registeredQuestionIds = new Set<string>();
  for (const definition of testDefinitions) {
    if (!hasUniqueIds(definition.questionIds)) issues.push(`${definition.id}: duplicate question ID in test definition.`);
    const resolved = resolveTest(definition);
    if (!resolved) {
      issues.push(`${definition.id}: could not resolve every question ID.`);
      continue;
    }
    if (resolved.questionCount !== definition.questionIds.length) {
      issues.push(`${definition.id}: resolved question count differs from its ID list.`);
    }
    if (definition.type === 'lesson' && resolved.questionCount !== 20) {
      issues.push(`${definition.id}: lesson test should contain exactly 20 questions.`);
    }
    if (definition.type === 'lesson' && definition.lessonId) {
      for (const question of resolved.questions) {
        if (question.primaryLessonId !== definition.lessonId) {
          issues.push(`${question.id}: primary lesson does not match ${definition.id}.`);
        }
      }
    }
    for (const id of definition.questionIds) registeredQuestionIds.add(id);

    if (definition.type === 'unit') {
      if (resolved.questionCount !== 60) issues.push(`${definition.id}: unit test should contain exactly 60 questions.`);
      for (const [lessonId, expectedCount] of Object.entries(EXPECTED_UNIT_BLUEPRINT)) {
        if (definition.coverageBlueprint?.[lessonId] !== expectedCount) {
          issues.push(`${definition.id}: metadata blueprint for ${lessonId} should be ${expectedCount}.`);
        }
      }
      const actualBlueprint = resolved.questions.reduce<Record<string, number>>((counts, question) => {
        counts[question.primaryLessonId] = (counts[question.primaryLessonId] ?? 0) + 1;
        return counts;
      }, {});
      for (const [lessonId, expectedCount] of Object.entries(EXPECTED_UNIT_BLUEPRINT)) {
        if (actualBlueprint[lessonId] !== expectedCount) {
          issues.push(`${definition.id}: expected ${expectedCount} primary questions for ${lessonId}; found ${actualBlueprint[lessonId] ?? 0}.`);
        }
      }
      for (const difficulty of ['basic', 'intermediate', 'advanced', 'reasoning'] as const) {
        const count = resolved.questions.filter((question) => question.difficulty === difficulty).length;
        const expected = { basic: 18, intermediate: 21, advanced: 12, reasoning: 9 }[difficulty];
        if (count !== expected) issues.push(`${definition.id}: expected ${expected} ${difficulty} questions; found ${count}.`);
      }

      const allCorrectAnswers: AnswerMap = Object.fromEntries(
        resolved.questions.map((question) => [question.id, correctAnswerFor(question)]),
      );
      const perfectScore = scoreTest(resolved.questions, allCorrectAnswers);
      if (perfectScore.correctCount !== 60 || perfectScore.incorrectCount !== 0 || perfectScore.unansweredCount !== 0) {
        issues.push(`${definition.id}: all configured answers do not produce a perfect score.`);
      }
    }
  }

  if (registeredQuestionIds.size !== questionBank.length) {
    issues.push('Registered tests and the central question bank do not contain the same question set.');
  }

  return issues;
}
