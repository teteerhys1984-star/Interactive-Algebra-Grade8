import React, { useState } from 'react';
import { useHashRoute } from './useHashRoute';
import { curriculum, getUnitById, getLessonById } from '../data/curriculum';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { CourseHome } from './CourseHome';
import { UnitOverview } from './UnitOverview';
import { LessonExperience } from '../components/lesson/LessonExperience';
import { TeacherArea } from '../components/teacher/TeacherArea';
import { TestsArea } from '../components/tests/TestsArea';
import { TestRunner } from '../components/tests/TestRunner';
import { TestSolutionsArea } from '../components/tests/TestSolutionsArea';
import { TestSolutions } from '../components/tests/TestSolutions';
import { resolveTest } from '../data/tests/registry';

export const App: React.FC = () => {
  const { route, navigate } = useHashRoute();
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  const activeUnit = route.unitId ? getUnitById(route.unitId) : curriculum[0];
  const activeLesson =
    route.view === 'lesson' && route.unitId && route.lessonId
      ? getLessonById(route.unitId, route.lessonId)
      : undefined;

  const handleNavigateHome = () => {
    navigate('/');
    setIsDrawerOpen(false);
  };

  const handleNavigateUnit = () => {
    if (activeUnit) {
      navigate(`/unit/${activeUnit.id}`);
    } else {
      navigate('/');
    }
    setIsDrawerOpen(false);
  };

  const handleNavigateTests = () => {
    navigate('/tests');
    setIsDrawerOpen(false);
  };
  const handleStartTest = (testId: string) => navigate(`/tests/run/${testId}`);
  const handleOpenTestSolutions = (testId: string) => navigate(`/tests/solutions/${testId}`);
  const currentTest = route.testId ? resolveTest(route.testId) : undefined;

  return (
    <div className="app-container">
      <Header
        onNavigateHome={handleNavigateHome}
        onNavigateUnit={route.view === 'lesson' ? handleNavigateUnit : undefined}
        onNavigateTests={handleNavigateTests}
        unitTitle={route.view === 'lesson' && activeUnit ? activeUnit.title : undefined}
        lessonTitle={route.view === 'lesson' && activeLesson ? activeLesson.title : undefined}
        onToggleDrawer={route.view === 'lesson' ? () => setIsDrawerOpen(!isDrawerOpen) : undefined}
      />

      <div className="main-content">
        {route.view === 'home' && <CourseHome />}

        {route.view === 'unit' && activeUnit && <UnitOverview unit={activeUnit} />}

        {route.view === 'lesson' && activeLesson && (
          <LessonExperience
            lesson={activeLesson}
            initialStep={route.stepIndex ?? 0}
            onNavigateBack={handleNavigateUnit}
            isDrawerOpen={isDrawerOpen}
            onCloseDrawer={() => setIsDrawerOpen(false)}
          />
        )}

        {((route.view === 'unit' && !activeUnit) || (route.view === 'lesson' && !activeLesson)) && (
          <main className="catalog-view" dir="rtl">
            <div className="catalog-inner">
              <div className="lesson-empty-state" style={{ marginTop: '3rem' }}>
                <h1 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                  هذا المحتوى غير متاح
                </h1>
                <p>تعذّر العثور على الوحدة أو الدرس المطلوب ضمن المنهاج المسجّل.</p>
                <a className="catalog-back-link" href="#/" style={{ marginTop: '1.25rem' }}>
                  العودة إلى الوحدات
                </a>
              </div>
            </div>
          </main>
        )}

        {route.view === 'teacher' && (
          <TeacherArea onNavigateHome={handleNavigateHome} />
        )}

        {route.view === 'tests' && <TestsArea onStartTest={handleStartTest} />}

        {route.view === 'test-runner' && currentTest && (
          <TestRunner
            key={currentTest.id}
            test={currentTest}
            onReturnToTests={handleNavigateTests}
            onOpenSolutions={() => handleOpenTestSolutions(currentTest.id)}
          />
        )}

        {route.view === 'test-solutions' && !route.testId && (
          <TestSolutionsArea onSelectTest={handleOpenTestSolutions} />
        )}

        {route.view === 'test-solutions' && currentTest && (
          <TestSolutions
            key={currentTest.id}
            test={currentTest}
            onReturnToSolutions={() => navigate('/tests/solutions')}
            onReturnToTests={handleNavigateTests}
          />
        )}

        {((route.view === 'test-runner' || (route.view === 'test-solutions' && route.testId)) && !currentTest) && (
          <main className="test-empty-state" role="alert" dir="rtl">
            <h1>الاختبار غير متاح</h1>
            <p>تعذّر العثور على الاختبار المطلوب.</p>
            <button type="button" className="test-button test-button-primary" onClick={handleNavigateTests}>
              العودة إلى مساحة الاختبارات
            </button>
          </main>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default App;
