import React, { useState } from 'react';
import { useHashRoute } from './useHashRoute';
import { curriculum, getUnitById, getLessonById } from '../data/curriculum';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { CourseHome } from './CourseHome';
import { UnitOverview } from './UnitOverview';
import { LessonExperience } from '../components/lesson/LessonExperience';
import { TeacherArea } from '../components/teacher/TeacherArea';

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

  const handleSelectUnit = (unitId: string) => {
    navigate(`/unit/${unitId}`);
  };

  const handleSelectLesson = (unitId: string, lessonId: string) => {
    if (lessonId === 'warmup') {
      navigate(`/unit/${unitId}/warmup`);
    } else {
      navigate(`/unit/${unitId}/lesson/${lessonId}`);
    }
  };

  return (
    <div className="app-container">
      <Header
        onNavigateHome={handleNavigateHome}
        onNavigateUnit={route.view === 'lesson' ? handleNavigateUnit : undefined}
        unitTitle={route.view === 'lesson' && activeUnit ? activeUnit.title : undefined}
        lessonTitle={route.view === 'lesson' && activeLesson ? activeLesson.title : undefined}
        onToggleDrawer={route.view === 'lesson' ? () => setIsDrawerOpen(!isDrawerOpen) : undefined}
      />

      <div className="main-content">
        {route.view === 'home' && (
          <CourseHome
            onSelectUnit={handleSelectUnit}
            onSelectLesson={handleSelectLesson}
          />
        )}

        {route.view === 'unit' && activeUnit && (
          <UnitOverview
            unit={activeUnit}
            onNavigateHome={handleNavigateHome}
            onSelectLesson={handleSelectLesson}
          />
        )}

        {route.view === 'lesson' && activeLesson && (
          <LessonExperience
            lesson={activeLesson}
            initialStep={route.stepIndex ?? 0}
            onNavigateBack={handleNavigateUnit}
            isDrawerOpen={isDrawerOpen}
            onCloseDrawer={() => setIsDrawerOpen(false)}
          />
        )}

        {route.view === 'teacher' && (
          <TeacherArea onNavigateHome={handleNavigateHome} />
        )}
      </div>

      <Footer />
    </div>
  );
};

export default App;
