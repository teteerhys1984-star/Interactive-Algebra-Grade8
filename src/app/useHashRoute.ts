import { useState, useEffect, useCallback } from 'react';

export interface RouteState {
  view: 'home' | 'unit' | 'lesson' | 'teacher' | 'tests' | 'test-runner' | 'test-solutions' | 'independent-tests' | 'temp' | 'temp-grade6' | 'temp-grade4';
  unitId?: string;
  lessonId?: string;
  stepIndex?: number;
  testId?: string;
  /** 1-based page index for the TEMP book readers (Grade 6, Grade 4). */
  tempPage?: number;
}

export function parseHash(hash: string): RouteState {
  const clean = hash.replace(/^#\/?/, '').trim();
  if (!clean) return { view: 'home' };

  const parts = clean.split('/').filter(Boolean);

  // Lesson step indexes arrive 1-based from the URL; invalid values (/0,
  // non-numeric) are constrained to step 1 here, and LessonExperience clamps
  // oversized indexes (e.g. /99) against the actual lesson length.
  const toStepIndex = (raw?: string): number => {
    if (!raw) return 0;
    const parsed = parseInt(raw, 10) - 1;
    return isNaN(parsed) || parsed < 0 ? 0 : parsed;
  };

  if (parts[0] === 'independent-tests') return { view: 'independent-tests' };

  // Student Test Area: catalog, attempts, and independently browsable worked solutions.
  if (parts[0] === 'tests') {
    if (parts[1] === 'run' && parts[2]) return { view: 'test-runner', testId: parts[2] };
    if (parts[1] === 'solutions') return { view: 'test-solutions', testId: parts[2] };
    return { view: 'tests' };
  }

  // Pattern: #/teacher — teacher area (password gated)
  if (parts[0] === 'teacher') return { view: 'teacher' };

  // TEMP (temporary addition): #/temp landing, #/temp/grade6[/:page] and
  // #/temp/grade4[/:page] book readers.
  // Fully isolated from the Grade 8 curriculum; safe to delete later.
  if (parts[0] === 'temp') {
    if (parts[1] === 'grade6') {
      const page = parts[2] ? parseInt(parts[2], 10) : 1;
      return { view: 'temp-grade6', tempPage: isNaN(page) ? 1 : page };
    }
    if (parts[1] === 'grade4') {
      const page = parts[2] ? parseInt(parts[2], 10) : 1;
      return { view: 'temp-grade4', tempPage: isNaN(page) ? 1 : page };
    }
    return { view: 'temp' };
  }

  if (parts[0] === 'unit' && parts[1]) {
    const unitId = parts[1];
    if (parts[2] === 'warmup') {
      return { view: 'lesson', unitId, lessonId: 'warmup', stepIndex: toStepIndex(parts[3]) };
    }
    if (parts[2] === 'lesson' && parts[3]) {
      const lessonId = parts[3];
      return { view: 'lesson', unitId, lessonId, stepIndex: toStepIndex(parts[4]) };
    }
    return { view: 'unit', unitId };
  }

  if (parts[0] === 'lesson' && parts[1]) {
    const lessonId = parts[1];
    return { view: 'lesson', unitId: 'unit-1', lessonId, stepIndex: toStepIndex(parts[2]) };
  }

  if (parts[0] === 'warmup') {
    return { view: 'lesson', unitId: 'unit-1', lessonId: 'warmup', stepIndex: toStepIndex(parts[1]) };
  }

  return { view: 'home' };
}

export function useHashRoute() {
  const [route, setRoute] = useState<RouteState>(() => parseHash(window.location.hash));

  useEffect(() => {
    const handleHashChange = () => setRoute(parseHash(window.location.hash));
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = useCallback((to: string) => {
    const clean = to.startsWith('#') ? to : `#${to.startsWith('/') ? '' : '/'}${to}`;
    window.location.hash = clean;
  }, []);

  return { route, navigate };
}
