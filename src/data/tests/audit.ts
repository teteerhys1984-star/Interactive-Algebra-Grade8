import { curriculum } from '../curriculum';
import { lessonConceptProfiles, resolveConceptReference, sourceTopicsForQuestion } from './concepts';
import type { LessonConceptProfile } from './concepts';
import { lessonBlueprints } from './blueprints';
import {
  curriculumLessonRefs,
  lessonsMissingTests,
  orphanLessonTests,
  type CurriculumLessonRef,
} from './lessonTests';
import { questionBank, testDefinitions } from './registry';
import {
  LESSON_TEST_QUESTION_COUNT,
  MAX_LESSON_CONCEPT_SHARE,
  MAX_LESSON_TYPE_SHARE,
  MIN_LESSON_QUESTION_TYPES,
  RECOMMENDED_LESSON_DIFFICULTY_PROFILE,
} from './policy';
import { gradeQuestion, isAnswerProvided, scoreTest } from './scoring';
import { checkSolutionConsistency } from './solutionConsistency';
import type {
  AnswerMap,
  LessonTestBlueprint,
  QuestionAnswer,
  QuestionDifficulty,
  ResolvedTest,
  TestDefinition,
  TestQuestion,
  TestQuestionType,
} from './types';

/**
 * Completeness and content audit of the test system.
 *
 * Everything is derived from data — the curriculum decides which lessons need a
 * test, the registry decides which tests exist, and the concept catalog decides
 * what a lesson actually teaches. No lesson count, question-bank size, or lesson
 * id list is hardcoded here, so adding Lesson 5 (or Lesson 9) needs no change to
 * this file: it either passes or fails with a message naming the lesson.
 *
 * The audit is pure over a {@link TestBankSnapshot}, which lets the regression
 * tests inject a fixture lesson (with or without a test) and observe both the
 * failure and the fix.
 */

export interface TestBankSnapshot {
  /** Lessons that must own a test, from the curriculum. */
  lessons: readonly CurriculumLessonRef[];
  definitions: readonly TestDefinition[];
  questions: readonly TestQuestion[];
  conceptProfiles: readonly LessonConceptProfile[];
  blueprints: Readonly<Record<string, LessonTestBlueprint>>;
  /** `lessonId → (stepId → source pages)`, used to verify concept traceability. */
  lessonSteps: ReadonlyMap<string, ReadonlyMap<string, readonly number[]>>;
}

export interface AuditReport {
  /** Blocking problems: the test system is incomplete or inconsistent. */
  errors: string[];
  /** Non-blocking problems that should be fixed or explicitly justified. */
  warnings: string[];
  /** Items a human reviewer should look at (provenance, coverage, paraphrases). */
  reviewNotes: string[];
  /** Question ids whose link to lesson content could not be resolved. */
  suspiciousQuestions: string[];
  summary: {
    curriculumLessons: number;
    lessonTests: number;
    unitTests: number;
    comprehensiveTests: number;
    questionBankSize: number;
    questionsPerLessonTest: Record<string, number>;
  };
}

function lessonStepIndex(): Map<string, Map<string, readonly number[]>> {
  const index = new Map<string, Map<string, readonly number[]>>();
  for (const unit of curriculum) {
    for (const lesson of unit.lessons) {
      const steps = new Map<string, readonly number[]>();
      for (const step of lesson.steps) steps.set(step.id, step.sourcePages);
      index.set(lesson.id, steps);
    }
  }
  return index;
}

export function createTestBankSnapshot(overrides: Partial<TestBankSnapshot> = {}): TestBankSnapshot {
  return {
    lessons: overrides.lessons ?? curriculumLessonRefs(),
    definitions: overrides.definitions ?? testDefinitions,
    questions: overrides.questions ?? questionBank,
    conceptProfiles: overrides.conceptProfiles ?? lessonConceptProfiles,
    blueprints: overrides.blueprints ?? lessonBlueprints,
    lessonSteps: overrides.lessonSteps ?? lessonStepIndex(),
  };
}

interface ReportSink {
  errors: string[];
  warnings: string[];
  reviewNotes: string[];
  suspiciousQuestions: string[];
}

const createSink = (): ReportSink => ({ errors: [], warnings: [], reviewNotes: [], suspiciousQuestions: [] });

function hasUniqueIds(ids: string[]): boolean {
  return new Set(ids).size === ids.length;
}

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

/** Placeholder / filler text that must never reach a curated question. */
const PLACEHOLDER_PATTERN = /\b(TODO|TBD|FIXME|LOREM|IPSUM|PLACEHOLDER|PLACE\s*HOLDER|XXX|N\/A|\?\?\?)\b/i;
const FILLER_PROMPT_PATTERN = /^(question|سؤال|س)\s*\d+\s*[:.!?]?\s*$/i;

function placeholderHits(text: string): string[] {
  const hits: string[] = [];
  const placeholder = text.match(PLACEHOLDER_PATTERN);
  if (placeholder) hits.push(placeholder[0]);
  return hits;
}

/** Digit- and LaTeX-insensitive shape of a prompt, used to catch near-duplicates. */
function promptSkeleton(prompt: string): string {
  return prompt
    .normalize('NFKC')
    .replace(/\\frac\{[^{}]*\}\{[^{}]*\}/g, 'FRAC')
    .replace(/\\[a-zA-Z]+/g, '')
    .replace(/[٠-٩۰-۹0-9]+/g, '#')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function allQuestionText(question: TestQuestion): string {
  const parts: string[] = [question.prompt, question.math ?? '', ...question.solution.steps,
    question.solution.finalAnswer, question.solution.explanation];
  switch (question.type) {
    case 'single-choice':
    case 'error-analysis':
    case 'multi-select':
      parts.push(...question.options.map((option) => option.label));
      break;
    case 'ordering':
      parts.push(...question.items.map((item) => item.label));
      break;
    case 'matching':
      parts.push(
        ...question.leftItems.map((item) => item.label),
        ...question.rightItems.map((item) => item.label),
      );
      break;
    case 'numeric':
      parts.push(question.answerFormat, ...question.acceptedAnswers);
      break;
    case 'true-false':
      break;
  }
  return parts.join(' \n ');
}

function resolveDefinition(
  definition: TestDefinition,
  questionsById: ReadonlyMap<string, TestQuestion>,
): ResolvedTest | undefined {
  const questions: TestQuestion[] = [];
  for (const id of definition.questionIds) {
    const question = questionsById.get(id);
    if (!question) return undefined;
    questions.push(question);
  }
  return { ...definition, questions, questionCount: questions.length };
}

function countsOf<T extends string>(values: T[]): Record<string, number> {
  return values.reduce<Record<string, number>>((counts, value) => {
    counts[value] = (counts[value] ?? 0) + 1;
    return counts;
  }, {});
}

// ---------------------------------------------------------------------------
// 1. Lesson coverage: every curriculum lesson owns exactly one lesson test
// ---------------------------------------------------------------------------

function auditLessonCoverage(snapshot: TestBankSnapshot, report: ReportSink): void {
  const lessonTests = snapshot.definitions.filter((definition) => definition.type === 'lesson');
  const lessonsById = new Map(snapshot.lessons.map((lesson) => [lesson.lessonId, lesson]));

  for (const missing of lessonsMissingTestsIn(snapshot)) {
    report.errors.push(`Missing test for lesson: ${missing.lessonId}`);
  }

  for (const lesson of snapshot.lessons) {
    const owned = lessonTests.filter((definition) => definition.lessonId === lesson.lessonId);
    if (owned.length > 1) {
      report.errors.push(
        `Lesson ${lesson.lessonId} has ${owned.length} lesson tests (${owned.map((t) => t.id).join(', ')}); it must have exactly one.`,
      );
    }
    const blueprint = snapshot.blueprints[lesson.lessonId];
    if (owned.length > 0 && !blueprint) {
      report.errors.push(`Missing test blueprint for lesson: ${lesson.lessonId}`);
    }
    if (blueprint && blueprint.lessonId !== lesson.lessonId) {
      report.errors.push(`Blueprint for ${lesson.lessonId} declares lessonId "${blueprint.lessonId}".`);
    }
  }

  for (const definition of lessonTests) {
    if (!definition.lessonId) {
      report.errors.push(`${definition.id}: lesson test without a lessonId.`);
      continue;
    }
    if (!lessonsById.has(definition.lessonId)) {
      report.errors.push(`${definition.id}: references lesson "${definition.lessonId}", which is not in the curriculum.`);
    }
  }
}

function lessonsMissingTestsIn(snapshot: TestBankSnapshot): CurriculumLessonRef[] {
  const tested = new Set(
    snapshot.definitions
      .filter((definition) => definition.type === 'lesson' && definition.lessonId)
      .map((definition) => definition.lessonId as string),
  );
  return snapshot.lessons.filter((lesson) => !tested.has(lesson.lessonId));
}

// ---------------------------------------------------------------------------
// 2. Concept catalog: concepts must be real lesson content
// ---------------------------------------------------------------------------

function auditConceptCatalog(snapshot: TestBankSnapshot, report: ReportSink): void {
  for (const profile of snapshot.conceptProfiles) {
    const steps = snapshot.lessonSteps.get(profile.lessonId);
    const seenConcepts = new Set<string>();
    const seenSkills = new Map<string, string>();

    for (const concept of profile.concepts) {
      if (seenConcepts.has(concept.id)) {
        report.errors.push(`${profile.lessonId}: duplicate concept id "${concept.id}".`);
      }
      seenConcepts.add(concept.id);

      for (const skill of concept.skills) {
        const owner = seenSkills.get(skill);
        if (owner) {
          report.errors.push(`${profile.lessonId}: skill "${skill}" is claimed by both "${owner}" and "${concept.id}".`);
        }
        seenSkills.set(skill, concept.id);
      }

      if (!concept.title.trim()) report.errors.push(`${profile.lessonId}/${concept.id}: concept title is empty.`);
      if (concept.taughtInSteps.length === 0) {
        report.errors.push(`${profile.lessonId}/${concept.id}: concept is not linked to any lesson step.`);
      }

      // Traceability: the declared steps and pages must exist in the lesson.
      if (steps) {
        const availablePages = new Set<number>();
        for (const stepId of concept.taughtInSteps) {
          const pages = steps.get(stepId);
          if (!pages) {
            report.errors.push(`${profile.lessonId}/${concept.id}: step "${stepId}" does not exist in the lesson.`);
            continue;
          }
          for (const page of pages) availablePages.add(page);
        }
        for (const page of concept.sourcePages) {
          if (!availablePages.has(page)) {
            report.errors.push(
              `${profile.lessonId}/${concept.id}: page ${page} is not taught in steps ${concept.taughtInSteps.join(', ')}.`,
            );
          }
        }
      }
    }
  }
}

// ---------------------------------------------------------------------------
// 3. Questions: identity, solution, provenance, placeholders, gradeability
// ---------------------------------------------------------------------------

function auditQuestions(snapshot: TestBankSnapshot, report: ReportSink): void {
  const seenIds = new Map<string, number>();
  const promptOwners = new Map<string, string>();
  const skeletonOwners = new Map<string, string>();
  const lessonIds = new Set(snapshot.lessons.map((lesson) => lesson.lessonId));

  for (const question of snapshot.questions) {
    if (!question.id.trim()) {
      report.errors.push('A question is missing its id.');
      continue;
    }
    seenIds.set(question.id, (seenIds.get(question.id) ?? 0) + 1);

    if (!question.prompt.trim()) report.errors.push(`${question.id}: prompt is empty.`);
    if (FILLER_PROMPT_PATTERN.test(question.prompt.trim())) {
      report.errors.push(`${question.id}: prompt is generic filler ("${question.prompt.trim()}").`);
    }
    if (!Number.isFinite(question.points) || question.points <= 0) {
      report.errors.push(`${question.id}: points must be positive.`);
    }

    const text = allQuestionText(question);
    for (const hit of placeholderHits(text)) {
      report.errors.push(`${question.id}: contains placeholder text "${hit}".`);
    }

    if (question.solution.steps.length < 2 || question.solution.steps.some((step) => !step.trim())) {
      report.errors.push(`${question.id}: worked solution needs at least two non-empty steps.`);
    }
    if (!question.solution.finalAnswer.trim()) report.errors.push(`${question.id}: final answer is empty.`);
    if (!question.solution.explanation.trim()) report.errors.push(`${question.id}: conceptual explanation is empty.`);

    const consistency = checkSolutionConsistency(question);
    if (consistency.status === 'contradiction') {
      report.errors.push(`${question.id}: solution contradicts its answer key — ${consistency.detail}`);
    } else if (consistency.status === 'review') {
      report.reviewNotes.push(`${question.id}: ${consistency.detail}`);
    }

    if (!lessonIds.has(question.primaryLessonId)) {
      report.errors.push(`${question.id}: unknown primary lesson "${question.primaryLessonId}".`);
    }
    if (!question.curriculumRefs.some((reference) => reference.lessonId === question.primaryLessonId)) {
      report.errors.push(`${question.id}: curriculum references omit its primary lesson.`);
    }

    for (const reference of question.curriculumRefs) {
      if (!lessonIds.has(reference.lessonId)) {
        report.errors.push(`${question.id}: curriculum reference points at unknown lesson "${reference.lessonId}".`);
        continue;
      }
      if (!reference.conceptId.trim()) {
        report.errors.push(`${question.id}: curriculum reference has an empty concept id.`);
        continue;
      }
      const concept = resolveConceptReference(reference.lessonId, reference.conceptId, snapshot.conceptProfiles);
      if (!concept) {
        report.suspiciousQuestions.push(question.id);
        report.warnings.push(
          `${question.id}: "${reference.conceptId}" is not a catalogued concept of ${reference.lessonId} — off-lesson question?`,
        );
      }
    }

    if (question.sourceTopics && question.sourceTopics.length > 0) {
      const knownTitles = new Set(
        question.curriculumRefs.flatMap((reference) => {
          const profile = snapshot.conceptProfiles.find((entry) => entry.lessonId === reference.lessonId);
          return (profile?.concepts ?? []).map((concept) => concept.title);
        }),
      );
      for (const topic of question.sourceTopics) {
        if (!knownTitles.has(topic)) {
          report.warnings.push(`${question.id}: sourceTopics entry "${topic}" is not a concept title of the referenced lessons.`);
        }
      }
    }

    if (!gradeQuestion(question, correctAnswerFor(question))) {
      report.errors.push(`${question.id}: its configured correct answer does not pass the scoring engine.`);
    }
    if (!isAnswerProvided(question, correctAnswerFor(question))) {
      report.errors.push(`${question.id}: its configured correct answer is treated as unanswered.`);
    }

    auditQuestionShape(question, report);

    const normalizedPrompt = question.prompt.normalize('NFKC').replace(/\s+/g, ' ').trim();
    const previousPrompt = promptOwners.get(normalizedPrompt);
    if (previousPrompt) {
      report.errors.push(`Duplicate prompt on ${previousPrompt} and ${question.id}.`);
    } else {
      promptOwners.set(normalizedPrompt, question.id);
    }

    const skeleton = promptSkeleton(question.prompt);
    const previousSkeleton = skeletonOwners.get(skeleton);
    if (previousSkeleton) {
      report.errors.push(`Near-duplicate question: ${previousSkeleton} and ${question.id} only differ by their numbers.`);
    } else {
      skeletonOwners.set(skeleton, question.id);
    }
  }

  for (const [id, count] of seenIds) {
    if (count > 1) report.errors.push(`Duplicate question id "${id}" appears ${count} times in the bank.`);
  }
}

function auditQuestionShape(question: TestQuestion, report: ReportSink): void {
  switch (question.type) {
    case 'single-choice':
    case 'error-analysis': {
      const optionIds = question.options.map((option) => option.id);
      if (optionIds.length < 2 || !hasUniqueIds(optionIds)) report.errors.push(`${question.id}: invalid choice IDs.`);
      if (question.options.some((option) => !option.label.trim())) report.errors.push(`${question.id}: an option label is empty.`);
      if (!optionIds.includes(question.correctOptionId)) report.errors.push(`${question.id}: correct option is missing.`);
      break;
    }
    case 'true-false':
      break;
    case 'numeric':
      if (question.acceptedAnswers.length === 0) report.errors.push(`${question.id}: no accepted numeric answer.`);
      if (!question.answerFormat.trim()) report.errors.push(`${question.id}: answer format is missing.`);
      break;
    case 'multi-select': {
      const optionIds = question.options.map((option) => option.id);
      if (optionIds.length < 2 || !hasUniqueIds(optionIds)) report.errors.push(`${question.id}: invalid multi-select option IDs.`);
      if (question.correctOptionIds.length === 0 || !hasUniqueIds(question.correctOptionIds)) {
        report.errors.push(`${question.id}: invalid correct multi-select set.`);
      }
      if (question.correctOptionIds.some((id) => !optionIds.includes(id))) {
        report.errors.push(`${question.id}: correct multi-select option is missing.`);
      }
      break;
    }
    case 'ordering': {
      const itemIds = question.items.map((item) => item.id);
      if (!hasUniqueIds(itemIds) || !hasUniqueIds(question.correctOrder)) {
        report.errors.push(`${question.id}: ordering IDs are not unique.`);
      }
      if (itemIds.length !== question.correctOrder.length
        || itemIds.some((id) => !question.correctOrder.includes(id))) {
        report.errors.push(`${question.id}: correct ordering is not a permutation of its items.`);
      }
      break;
    }
    case 'matching': {
      const leftIds = question.leftItems.map((item) => item.id);
      const rightIds = question.rightItems.map((item) => item.id);
      const answerKeys = Object.keys(question.correctPairs);
      const answerValues = Object.values(question.correctPairs);
      if (!hasUniqueIds(leftIds) || !hasUniqueIds(rightIds)) report.errors.push(`${question.id}: matching IDs are not unique.`);
      if (!hasUniqueIds(answerValues)) report.errors.push(`${question.id}: matching answer reuses a right-side item.`);
      if (leftIds.length !== answerKeys.length || leftIds.some((id) => !answerKeys.includes(id))) {
        report.errors.push(`${question.id}: matching key set does not cover the left side.`);
      }
      if (answerValues.some((id) => !rightIds.includes(id))) {
        report.errors.push(`${question.id}: matching answer references a missing right-side item.`);
      }
      break;
    }
  }
}

// ---------------------------------------------------------------------------
// 4. Lesson tests: 20 questions, blueprint fidelity, balance, variety
// ---------------------------------------------------------------------------

function auditLessonTests(
  snapshot: TestBankSnapshot,
  resolvedByDefinition: Map<string, ResolvedTest>,
  report: ReportSink,
): void {
  for (const definition of snapshot.definitions.filter((entry) => entry.type === 'lesson')) {
    const resolved = resolvedByDefinition.get(definition.id);
    if (!resolved) {
      report.errors.push(`${definition.id}: could not resolve every question ID.`);
      continue;
    }
    if (resolved.questionCount !== LESSON_TEST_QUESTION_COUNT) {
      report.errors.push(
        `${definition.id}: lesson test must contain exactly ${LESSON_TEST_QUESTION_COUNT} questions; found ${resolved.questionCount}.`,
      );
    }

    const lessonId = definition.lessonId;
    if (!lessonId) continue;

    for (const question of resolved.questions) {
      if (question.primaryLessonId !== lessonId) {
        report.errors.push(`${question.id}: primary lesson does not match ${definition.id}.`);
      }
      for (const reference of question.curriculumRefs) {
        if (reference.lessonId !== lessonId) {
          report.errors.push(
            `${question.id}: a lesson test question may only reference its own lesson (found ${reference.lessonId}).`,
          );
        }
      }
    }

    auditDifficultyVariety(definition.id, resolved.questions, report);

    const blueprint = snapshot.blueprints[lessonId];
    if (blueprint) auditBlueprint(definition.id, lessonId, blueprint, resolved.questions, snapshot, report);
  }
}

function auditDifficultyVariety(testId: string, questions: readonly TestQuestion[], report: ReportSink): void {
  const typeCounts = countsOf(questions.map((question) => question.type));
  const distinctTypes = Object.keys(typeCounts).length;
  if (distinctTypes < MIN_LESSON_QUESTION_TYPES) {
    report.warnings.push(`${testId}: only ${distinctTypes} question types; use at least ${MIN_LESSON_QUESTION_TYPES}.`);
  }
  for (const [type, count] of Object.entries(typeCounts)) {
    if (questions.length > 0 && count / questions.length > MAX_LESSON_TYPE_SHARE) {
      report.warnings.push(`${testId}: ${count}/${questions.length} questions are "${type}".`);
    }
  }
}

function auditBlueprint(
  testId: string,
  lessonId: string,
  blueprint: LessonTestBlueprint,
  questions: readonly TestQuestion[],
  snapshot: TestBankSnapshot,
  report: ReportSink,
): void {
  const profile = snapshot.conceptProfiles.find((entry) => entry.lessonId === lessonId);
  const conceptIdOf = (question: TestQuestion): string | undefined => {
    for (const reference of question.curriculumRefs) {
      const concept = resolveConceptReference(reference.lessonId, reference.conceptId, snapshot.conceptProfiles);
      if (concept) return concept.id;
    }
    return undefined;
  };

  const actualConceptCounts = countsOf(
    questions.map(conceptIdOf).filter((id): id is string => id !== undefined),
  );

  const plannedConcepts = new Set<string>();
  let plannedTotal = 0;
  for (const entry of blueprint.concepts) {
    plannedConcepts.add(entry.conceptId);
    plannedTotal += entry.questionCount;
    const catalogued = profile?.concepts.find((concept) => concept.id === entry.conceptId);
    if (!catalogued) {
      report.errors.push(`${testId}: blueprint concept "${entry.conceptId}" is not catalogued for ${lessonId}.`);
    } else if (catalogued.title !== entry.title) {
      report.errors.push(`${testId}: blueprint title for "${entry.conceptId}" differs from the concept catalog.`);
    }
    if (entry.questionCount <= 0) {
      report.errors.push(`${testId}: blueprint concept "${entry.conceptId}" must keep at least one question.`);
    }
    if (entry.skills.length === 0) {
      report.errors.push(`${testId}: blueprint concept "${entry.conceptId}" declares no skills.`);
    }
    const actual = actualConceptCounts[entry.conceptId] ?? 0;
    if (actual !== entry.questionCount) {
      report.errors.push(
        `${testId}: blueprint plans ${entry.questionCount} questions for "${entry.conceptId}"; the test has ${actual}.`,
      );
    }
  }

  if (plannedTotal !== questions.length) {
    report.errors.push(
      `${testId}: blueprint plans ${plannedTotal} questions but the test has ${questions.length}.`,
    );
  }
  for (const conceptId of Object.keys(actualConceptCounts)) {
    if (!plannedConcepts.has(conceptId)) {
      report.errors.push(`${testId}: questions assess "${conceptId}", which the blueprint does not cover.`);
    }
  }

  // Balanced coverage: one concept must not dominate the test.
  for (const [conceptId, count] of Object.entries(actualConceptCounts)) {
    if (questions.length > 0 && count / questions.length > MAX_LESSON_CONCEPT_SHARE) {
      report.errors.push(
        `${testId}: concept "${conceptId}" holds ${count}/${questions.length} questions; coverage must stay balanced.`,
      );
    }
  }

  auditPlan(testId, 'difficulty', blueprint.difficultyPlan, countsOf(questions.map((q) => q.difficulty)), questions.length, report);
  auditPlan(testId, 'question type', blueprint.questionTypePlan, countsOf(questions.map((q) => q.type)), questions.length, report);

  const deviates = (Object.keys(RECOMMENDED_LESSON_DIFFICULTY_PROFILE) as QuestionDifficulty[])
    .some((difficulty) => blueprint.difficultyPlan[difficulty] !== RECOMMENDED_LESSON_DIFFICULTY_PROFILE[difficulty]);
  if (deviates && !blueprint.deviationRationale) {
    report.warnings.push(
      `${testId}: difficulty plan deviates from the recommended 6/7/4/3 profile without a documented rationale.`,
    );
  }

  if (blueprint.commonMistakes.length === 0) {
    report.warnings.push(`${testId}: blueprint lists no common mistakes for ${lessonId}.`);
  }
}

function auditPlan(
  testId: string,
  label: string,
  plan: Partial<Record<string, number>>,
  actual: Record<string, number>,
  total: number,
  report: ReportSink,
): void {
  const plannedTotal = Object.values(plan).reduce<number>((sum, count) => sum + (count ?? 0), 0);
  if (plannedTotal !== total) {
    report.errors.push(`${testId}: ${label} plan adds up to ${plannedTotal} but the test has ${total} questions.`);
  }
  const keys = new Set([...Object.keys(plan), ...Object.keys(actual)]);
  for (const key of keys) {
    const planned = plan[key] ?? 0;
    const found = actual[key] ?? 0;
    if (planned !== found) {
      report.errors.push(`${testId}: ${label} plan expects ${planned} "${key}"; the test has ${found}.`);
    }
  }
}

// ---------------------------------------------------------------------------
// 5. Unit tests: never auto-extended, but a new lesson must not go unnoticed
// ---------------------------------------------------------------------------

function auditUnitTests(
  snapshot: TestBankSnapshot,
  resolvedByDefinition: Map<string, ResolvedTest>,
  report: ReportSink,
): void {
  for (const definition of snapshot.definitions.filter((entry) => entry.type === 'unit')) {
    const resolved = resolvedByDefinition.get(definition.id);
    if (!resolved) {
      report.errors.push(`${definition.id}: could not resolve every question ID.`);
      continue;
    }

    const unitLessons = snapshot.lessons.filter((lesson) => lesson.unitId === definition.unitId);
    const coveredByQuestions = countsOf(resolved.questions.map((question) => question.primaryLessonId));

    for (const question of resolved.questions) {
      if (!unitLessons.some((lesson) => lesson.lessonId === question.primaryLessonId)) {
        report.errors.push(
          `${question.id}: primary lesson "${question.primaryLessonId}" is not part of ${definition.unitId}.`,
        );
      }
    }

    // A lesson added to the unit is detected here; the unit test is updated
    // deliberately (blueprint) or the deferral is declared explicitly.
    for (const lesson of unitLessons) {
      const covered = (coveredByQuestions[lesson.lessonId] ?? 0) > 0
        || (definition.coverageBlueprint?.[lesson.lessonId] ?? 0) > 0;
      if (covered) continue;
      const pending = definition.pendingLessonCoverage?.find((entry) => entry.lessonId === lesson.lessonId);
      if (pending) {
        if (!pending.reason.trim() || !pending.trackedBy.trim()) {
          report.errors.push(`${definition.id}: pending coverage for ${lesson.lessonId} needs a reason and a tracker.`);
        }
        report.warnings.push(
          `${definition.id}: ${lesson.lessonId} is not covered yet (${pending.reason}; tracked by ${pending.trackedBy}).`,
        );
      } else {
        report.errors.push(
          `${definition.id}: does not cover ${lesson.lessonId}; extend its coverageBlueprint or declare it in pendingLessonCoverage with a reason.`,
        );
      }
    }

    for (const entry of definition.pendingLessonCoverage ?? []) {
      if (!unitLessons.some((lesson) => lesson.lessonId === entry.lessonId)) {
        report.errors.push(`${definition.id}: pending coverage names "${entry.lessonId}", which is not in ${definition.unitId}.`);
      }
      if ((coveredByQuestions[entry.lessonId] ?? 0) > 0) {
        report.warnings.push(`${definition.id}: ${entry.lessonId} is covered now; drop it from pendingLessonCoverage.`);
      }
    }

    // Declared metadata is verified against the questions — no duplicated constants.
    if (definition.coverageBlueprint) {
      const plannedTotal = Object.values(definition.coverageBlueprint)
        .reduce((sum, count) => sum + count, 0);
      if (plannedTotal !== resolved.questionCount) {
        report.errors.push(
          `${definition.id}: coverageBlueprint adds up to ${plannedTotal} but the test has ${resolved.questionCount} questions.`,
        );
      }
      for (const [lessonId, expected] of Object.entries(definition.coverageBlueprint)) {
        const found = coveredByQuestions[lessonId] ?? 0;
        if (found !== expected) {
          report.errors.push(`${definition.id}: expected ${expected} primary questions for ${lessonId}; found ${found}.`);
        }
      }
    }
    if (definition.difficultyBlueprint) {
      auditPlan(
        definition.id,
        'difficulty',
        definition.difficultyBlueprint,
        countsOf(resolved.questions.map((question) => question.difficulty)),
        resolved.questionCount,
        report,
      );
    }

    const answers: AnswerMap = Object.fromEntries(
      resolved.questions.map((question) => [question.id, correctAnswerFor(question)]),
    );
    const perfectScore = scoreTest(resolved.questions, answers);
    if (
      perfectScore.correctCount !== resolved.questionCount
      || perfectScore.incorrectCount !== 0
      || perfectScore.unansweredCount !== 0
    ) {
      report.errors.push(`${definition.id}: all configured answers do not produce a perfect score.`);
    }
  }
}

// ---------------------------------------------------------------------------
// 6. Registry ↔ bank consistency
// ---------------------------------------------------------------------------

function auditRegistryConsistency(
  snapshot: TestBankSnapshot,
  resolvedByDefinition: Map<string, ResolvedTest>,
  report: ReportSink,
): void {
  const definitionIds = snapshot.definitions.map((definition) => definition.id);
  if (!hasUniqueIds(definitionIds)) report.errors.push('Test definitions do not have unique ids.');

  const registered = new Set<string>();
  for (const definition of snapshot.definitions) {
    if (!hasUniqueIds(definition.questionIds)) {
      report.errors.push(`${definition.id}: duplicate question ID in test definition.`);
    }
    if (definition.questionIds.length === 0) {
      report.errors.push(`${definition.id}: test definition has no questions.`);
    }
    const resolved = resolvedByDefinition.get(definition.id);
    if (!resolved) {
      report.errors.push(`${definition.id}: could not resolve every question ID.`);
      continue;
    }
    if (resolved.questionCount !== definition.questionIds.length) {
      report.errors.push(`${definition.id}: resolved question count differs from its ID list.`);
    }
    if (!definition.title.trim() || !definition.description.trim() || !definition.coverageLabel.trim()) {
      report.errors.push(`${definition.id}: title, description, and coverage label are all required.`);
    }
    if (!Number.isFinite(definition.estimatedMinutes) || definition.estimatedMinutes <= 0) {
      report.errors.push(`${definition.id}: estimatedMinutes must be positive.`);
    }
    for (const id of definition.questionIds) registered.add(id);
  }

  const bankIds = new Set(snapshot.questions.map((question) => question.id));
  for (const id of registered) {
    if (!bankIds.has(id)) report.errors.push(`Registered question "${id}" is missing from the question bank.`);
  }
  for (const id of bankIds) {
    if (!registered.has(id)) report.errors.push(`Question "${id}" exists in the bank but is registered in no test.`);
  }

  for (const stale of orphanLessonTestsIn(snapshot)) {
    report.errors.push(`${stale.id}: registered for lesson "${stale.lessonId}", which the curriculum no longer contains.`);
  }
}

function orphanLessonTestsIn(snapshot: TestBankSnapshot): TestDefinition[] {
  const known = new Set(snapshot.lessons.map((lesson) => lesson.lessonId));
  return snapshot.definitions.filter(
    (definition) => definition.type === 'lesson' && !!definition.lessonId && !known.has(definition.lessonId),
  );
}

// ---------------------------------------------------------------------------
// Entry points
// ---------------------------------------------------------------------------

export function runTestBankAudit(snapshot: TestBankSnapshot = createTestBankSnapshot()): AuditReport {
  const report = createSink();
  const questionsById = new Map(snapshot.questions.map((question) => [question.id, question]));
  const resolvedByDefinition = new Map<string, ResolvedTest>();
  for (const definition of snapshot.definitions) {
    const resolved = resolveDefinition(definition, questionsById);
    if (resolved) resolvedByDefinition.set(definition.id, resolved);
  }

  auditLessonCoverage(snapshot, report);
  auditConceptCatalog(snapshot, report);
  auditQuestions(snapshot, report);
  auditLessonTests(snapshot, resolvedByDefinition, report);
  auditUnitTests(snapshot, resolvedByDefinition, report);
  auditRegistryConsistency(snapshot, resolvedByDefinition, report);

  // Coverage review: concepts taught but not assessed by their lesson test.
  for (const profile of snapshot.conceptProfiles) {
    const test = snapshot.definitions.find(
      (definition) => definition.type === 'lesson' && definition.lessonId === profile.lessonId,
    );
    const resolved = test ? resolvedByDefinition.get(test.id) : undefined;
    if (!resolved) continue;
    const assessed = new Set<string>();
    for (const question of resolved.questions) {
      for (const reference of question.curriculumRefs) {
        const concept = resolveConceptReference(reference.lessonId, reference.conceptId, snapshot.conceptProfiles);
        if (concept) assessed.add(concept.id);
      }
    }
    for (const concept of profile.concepts) {
      if (!assessed.has(concept.id)) {
        report.reviewNotes.push(`${profile.lessonId}: concept "${concept.title}" is taught but not assessed by its lesson test.`);
      }
    }
  }

  const lessonTests = snapshot.definitions.filter((definition) => definition.type === 'lesson');
  return {
    errors: report.errors,
    warnings: report.warnings,
    reviewNotes: report.reviewNotes,
    suspiciousQuestions: [...new Set(report.suspiciousQuestions)],
    summary: {
      curriculumLessons: snapshot.lessons.length,
      lessonTests: lessonTests.length,
      unitTests: snapshot.definitions.filter((definition) => definition.type === 'unit').length,
      comprehensiveTests: snapshot.definitions.filter((definition) => definition.type === 'comprehensive').length,
      questionBankSize: snapshot.questions.length,
      questionsPerLessonTest: Object.fromEntries(
        lessonTests.map((definition) => [definition.id, definition.questionIds.length]),
      ),
    },
  };
}

/** Blocking issues only — the historical shape of the audit, kept for callers and CI. */
export function auditTestBank(snapshot: TestBankSnapshot = createTestBankSnapshot()): string[] {
  return runTestBankAudit(snapshot).errors;
}

/** Convenience re-export so callers can reach both helpers from one module. */
export { lessonsMissingTests, orphanLessonTests };
export type { TestQuestionType };

/** Provenance helper kept next to the audit that consumes it. */
export function questionSourceTopics(question: TestQuestion, snapshot: TestBankSnapshot = createTestBankSnapshot()): string[] {
  return sourceTopicsForQuestion(question, snapshot.conceptProfiles);
}
