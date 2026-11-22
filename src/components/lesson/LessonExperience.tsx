import React, { useState, useEffect } from 'react';
import { LessonData } from '../../data/unit1/lesson01';
import { LessonSidebar } from './LessonSidebar';
import { LessonDrawer } from './LessonDrawer';
import { StepRenderer } from './StepRenderer';
import { StepNavigator } from './StepNavigator';
import { CompletionState } from './CompletionState';
import { FinalAssessment } from '../assessment/FinalAssessment';
import { StudentNotebook } from './StudentNotebook';
import { getNotebook } from '../../data/notebooks';

/**
 * حالة عرض الدرس — اتحاد مميز (discriminated union) يضمن تنافر الحالات الأربع
 * بنيويًا: لا يمكن مثلًا عرض الدفتر فوق الاختبار الشامل. تحل محل الأعلام
 * المنفصلة السابقة (showAssessment / isLessonCompleted).
 * الدفتر ليس خطوة: لا يدخل في completedSteps ولا في حساب التقدم.
 */
type LessonView =
  | { mode: 'step'; index: number }
  | { mode: 'assessment' }
  | { mode: 'notebook' }
  | { mode: 'completed' };

interface LessonExperienceProps {
  lesson: LessonData;
  initialStep?: number;
  /** Reports every step change (next, prev, outline, restart) so the URL hash can stay in sync. */
  onStepChange?: (stepIndex: number) => void;
  onNavigateBack: () => void;
  isDrawerOpen?: boolean;
  onCloseDrawer?: () => void;
}

export const LessonExperience: React.FC<LessonExperienceProps> = ({
  lesson,
  initialStep = 0,
  onStepChange,
  onNavigateBack,
  isDrawerOpen = false,
  onCloseDrawer = () => {},
}) => {
  // Constrain any step index (deep links like /0 or /99, non-numeric, browser
  // back/forward) to a step that actually exists in this lesson.
  const clampStep = (index: number) => Math.max(0, Math.min(index, lesson.steps.length - 1));

  const [view, setView] = useState<LessonView>(() => ({ mode: 'step', index: clampStep(initialStep) }));
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  // Last step the student actually stood on — keeps LessonProgress wording and
  // the "back from notebook/assessment" target stable while a non-step view
  // (assessment / notebook / completed) is showing.
  const [lastStepIndex, setLastStepIndex] = useState<number>(() => clampStep(initialStep));

  const hasAssessment = !!lesson.finalAssessment;
  // الدفتر اختياري ومرتبطة بمعرف الدرس عبر سجل مستقل؛ الدروس بلا دفتر لا
  // يظهر لها عنصر «دفتر الطالب» ولا يتغير شيء في واجهتها.
  const notebook = getNotebook(lesson.unitId, lesson.id);
  const hasNotebook = !!notebook;

  // Sync with the URL-driven step (deep links, browser back/forward), clamping
  // invalid indexes to a valid step. Also resets any non-step view (assessment,
  // notebook, completion) — a URL-driven step change always returns to steps.
  useEffect(() => {
    const clamped = clampStep(initialStep);
    setView({ mode: 'step', index: clamped });
    setLastStepIndex(clamped);
    // clampStep depends only on lesson.steps.length, which is in the deps.
  }, [initialStep, lesson.steps.length]);

  // Mark current step as completed when viewed (step mode only — the notebook
  // is not a step and never counts toward progress), then scroll to top.
  useEffect(() => {
    if (view.mode !== 'step') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (!completedSteps.includes(view.index)) {
      setCompletedSteps((prev) => [...prev, view.index]);
    }
    setLastStepIndex(view.index);
    // Scroll viewport to top on step change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [view]);

  // Print isolation: the body class exists ONLY while the notebook view is
  // showing, so every `@media print` rule in notebook.css (all scoped under
  // body.student-notebook-open) can never match any other screen.
  useEffect(() => {
    if (view.mode !== 'notebook') return;
    document.body.classList.add('student-notebook-open');
    return () => document.body.classList.remove('student-notebook-open');
  }, [view.mode]);

  // Single entry point for every user-driven step change: updates local state
  // and mirrors the step into the URL hash (via onStepChange).
  const goToStep = (index: number) => {
    const clamped = clampStep(index);
    setView({ mode: 'step', index: clamped });
    setLastStepIndex(clamped);
    onStepChange?.(clamped);
  };

  const currentStepIndex = view.mode === 'step' ? view.index : lastStepIndex;

  const handlePrev = () => {
    if (view.mode === 'step' && view.index > 0) {
      goToStep(view.index - 1);
    }
  };

  const handleNext = () => {
    if (view.mode !== 'step') return;
    if (view.index < lesson.steps.length - 1) {
      goToStep(view.index + 1);
    } else if (hasAssessment) {
      setView({ mode: 'assessment' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setView({ mode: 'completed' });
    }
  };

  // Last-step primary action.
  const handleComplete = () => {
    if (hasAssessment) {
      setView({ mode: 'assessment' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setView({ mode: 'completed' });
    }
  };

  const handleSelectStep = (index: number) => {
    goToStep(index);
  };

  const handleSelectAssessment = () => {
    setView({ mode: 'assessment' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectNotebook = () => {
    setView({ mode: 'notebook' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoToStepFromAssessment = (index: number) => {
    goToStep(index);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRestart = () => {
    goToStep(0);
  };

  const currentStep = lesson.steps[currentStepIndex];

  // Presentation-only grouping info for the current step (no flow change).
  const currentGroup = (() => {
    if (!currentStep?.groupId || !currentStep.groupTitle) return undefined;
    const indices = lesson.steps
      .map((step, index) => ({ step, index }))
      .filter(({ step }) => step.groupId === currentStep.groupId)
      .map(({ index }) => index);
    return {
      title: currentStep.groupTitle,
      positionInGroup: indices.indexOf(currentStepIndex) + 1,
      groupSize: indices.length,
      completedInGroup: indices.filter((i) => completedSteps.includes(i)).length,
    };
  })();
  const isLastStep = currentStepIndex === lesson.steps.length - 1;
  const completeLabel = hasAssessment ? 'الانتقال إلى الاختبار الشامل' : 'إتمام الدرس';

  return (
    <div className="lesson-layout" data-lesson-id={lesson.id}>
      {/* Sidebar for desktop */}
      <LessonSidebar
        lesson={lesson}
        currentStepIndex={currentStepIndex}
        completedSteps={completedSteps}
        onSelectStep={handleSelectStep}
        hasAssessment={hasAssessment}
        assessmentActive={view.mode === 'assessment'}
        onSelectAssessment={handleSelectAssessment}
        hasNotebook={hasNotebook}
        notebookActive={view.mode === 'notebook'}
        onSelectNotebook={handleSelectNotebook}
      />

      {/* Drawer for mobile */}
      <LessonDrawer
        isOpen={isDrawerOpen}
        onClose={onCloseDrawer}
        lesson={lesson}
        currentStepIndex={currentStepIndex}
        completedSteps={completedSteps}
        onSelectStep={handleSelectStep}
        hasAssessment={hasAssessment}
        assessmentActive={view.mode === 'assessment'}
        onSelectAssessment={handleSelectAssessment}
        hasNotebook={hasNotebook}
        notebookActive={view.mode === 'notebook'}
        onSelectNotebook={handleSelectNotebook}
      />

      {/* Main Viewport */}
      <main className="lesson-viewport">
        {view.mode === 'completed' ? (
          <CompletionState
            lessonTitle={lesson.title}
            onRestart={handleRestart}
            onBackToUnit={onNavigateBack}
          />
        ) : view.mode === 'assessment' && lesson.finalAssessment ? (
          <FinalAssessment
            assessment={lesson.finalAssessment}
            onExit={() => setView({ mode: 'completed' })}
            onGoToStep={handleGoToStepFromAssessment}
          />
        ) : view.mode === 'notebook' && notebook ? (
          <StudentNotebook
            notebook={notebook}
            lessonTitle={lesson.title}
            unitTitle={lesson.unitTitle}
            onBack={() => goToStep(lastStepIndex)}
          />
        ) : (
          <>
            <StepRenderer
              step={currentStep}
              stepIndex={currentStepIndex}
              totalSteps={lesson.steps.length}
              group={currentGroup}
            />

            <StepNavigator
              currentStepIndex={currentStepIndex}
              totalSteps={lesson.steps.length}
              onPrev={handlePrev}
              onNext={handleNext}
              onComplete={handleComplete}
              isLastStep={isLastStep}
              completeLabel={completeLabel}
              nextGroupTitle={
                currentGroup && lesson.steps[currentStepIndex + 1]?.groupId !== currentStep.groupId
                  ? lesson.steps[currentStepIndex + 1]?.groupTitle
                  : undefined
              }
            />
          </>
        )}
      </main>
    </div>
  );
};

export default LessonExperience;
