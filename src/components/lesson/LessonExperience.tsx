import React, { useState, useEffect } from 'react';
import { LessonData } from '../../data/unit1/lesson01';
import { LessonSidebar } from './LessonSidebar';
import { LessonDrawer } from './LessonDrawer';
import { StepRenderer } from './StepRenderer';
import { StepNavigator } from './StepNavigator';
import { CompletionState } from './CompletionState';
import { FinalAssessment } from '../assessment/FinalAssessment';

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

  const [currentStepIndex, setCurrentStepIndex] = useState<number>(() => clampStep(initialStep));
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isLessonCompleted, setIsLessonCompleted] = useState<boolean>(false);
  const [showAssessment, setShowAssessment] = useState<boolean>(false);

  const hasAssessment = !!lesson.finalAssessment;

  // Sync with the URL-driven step (deep links, browser back/forward), clamping
  // invalid indexes to a valid step.
  useEffect(() => {
    setCurrentStepIndex(clampStep(initialStep));
    setIsLessonCompleted(false);
    setShowAssessment(false);
    // clampStep depends only on lesson.steps.length, which is in the deps.
  }, [initialStep, lesson.steps.length]);

  // Mark current step as completed when viewed
  useEffect(() => {
    if (!completedSteps.includes(currentStepIndex)) {
      setCompletedSteps((prev) => [...prev, currentStepIndex]);
    }
    // Scroll viewport to top on step change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStepIndex]);

  // Single entry point for every user-driven step change: updates local state
  // and mirrors the step into the URL hash (via onStepChange).
  const goToStep = (index: number) => {
    const clamped = clampStep(index);
    setCurrentStepIndex(clamped);
    setIsLessonCompleted(false);
    setShowAssessment(false);
    onStepChange?.(clamped);
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      goToStep(currentStepIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentStepIndex < lesson.steps.length - 1) {
      goToStep(currentStepIndex + 1);
    } else if (hasAssessment) {
      setShowAssessment(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setIsLessonCompleted(true);
    }
  };

  // Last-step primary action.
  const handleComplete = () => {
    if (hasAssessment) {
      setShowAssessment(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setIsLessonCompleted(true);
    }
  };

  const handleSelectStep = (index: number) => {
    goToStep(index);
  };

  const handleSelectAssessment = () => {
    setShowAssessment(true);
    setIsLessonCompleted(false);
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
        assessmentActive={showAssessment}
        onSelectAssessment={handleSelectAssessment}
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
        assessmentActive={showAssessment}
        onSelectAssessment={handleSelectAssessment}
      />

      {/* Main Viewport */}
      <main className="lesson-viewport">
        {isLessonCompleted ? (
          <CompletionState
            lessonTitle={lesson.title}
            onRestart={handleRestart}
            onBackToUnit={onNavigateBack}
          />
        ) : showAssessment && lesson.finalAssessment ? (
          <FinalAssessment
            assessment={lesson.finalAssessment}
            onExit={() => setIsLessonCompleted(true)}
            onGoToStep={handleGoToStepFromAssessment}
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
