import React, { useState, useEffect } from 'react';
import { LessonData } from '../../data/unit1/lesson01';
import { LessonSidebar } from './LessonSidebar';
import { LessonDrawer } from './LessonDrawer';
import { StepRenderer } from './StepRenderer';
import { StepNavigator } from './StepNavigator';
import { CompletionState } from './CompletionState';

interface LessonExperienceProps {
  lesson: LessonData;
  initialStep?: number;
  onNavigateBack: () => void;
  isDrawerOpen?: boolean;
  onCloseDrawer?: () => void;
}

export const LessonExperience: React.FC<LessonExperienceProps> = ({
  lesson,
  initialStep = 0,
  onNavigateBack,
  isDrawerOpen = false,
  onCloseDrawer = () => {},
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(initialStep);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isLessonCompleted, setIsLessonCompleted] = useState<boolean>(false);

  // Sync initialStep when it changes
  useEffect(() => {
    if (initialStep >= 0 && initialStep < lesson.steps.length) {
      setCurrentStepIndex(initialStep);
      setIsLessonCompleted(false);
    }
  }, [initialStep, lesson.steps.length]);

  // Mark current step as completed when viewed
  useEffect(() => {
    if (!completedSteps.includes(currentStepIndex)) {
      setCompletedSteps((prev) => [...prev, currentStepIndex]);
    }
    // Scroll viewport to top on step change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStepIndex]);

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
      setIsLessonCompleted(false);
    }
  };

  const handleNext = () => {
    if (currentStepIndex < lesson.steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      setIsLessonCompleted(true);
    }
  };

  const handleComplete = () => {
    setIsLessonCompleted(true);
  };

  const handleSelectStep = (index: number) => {
    setCurrentStepIndex(index);
    setIsLessonCompleted(false);
  };

  const handleRestart = () => {
    setCurrentStepIndex(0);
    setIsLessonCompleted(false);
  };

  const currentStep = lesson.steps[currentStepIndex];
  const isLastStep = currentStepIndex === lesson.steps.length - 1;

  return (
    <div className="lesson-layout">
      {/* Sidebar for desktop */}
      <LessonSidebar
        lesson={lesson}
        currentStepIndex={currentStepIndex}
        completedSteps={completedSteps}
        onSelectStep={handleSelectStep}
      />

      {/* Drawer for mobile */}
      <LessonDrawer
        isOpen={isDrawerOpen}
        onClose={onCloseDrawer}
        lesson={lesson}
        currentStepIndex={currentStepIndex}
        completedSteps={completedSteps}
        onSelectStep={handleSelectStep}
      />

      {/* Main Viewport */}
      <main className="lesson-viewport">
        {isLessonCompleted ? (
          <CompletionState
            lessonTitle={lesson.title}
            onRestart={handleRestart}
            onBackToUnit={onNavigateBack}
          />
        ) : (
          <>
            <StepRenderer
              step={currentStep}
              stepIndex={currentStepIndex}
              totalSteps={lesson.steps.length}
            />

            <StepNavigator
              currentStepIndex={currentStepIndex}
              totalSteps={lesson.steps.length}
              onPrev={handlePrev}
              onNext={handleNext}
              onComplete={handleComplete}
              isLastStep={isLastStep}
            />
          </>
        )}
      </main>
    </div>
  );
};

export default LessonExperience;
