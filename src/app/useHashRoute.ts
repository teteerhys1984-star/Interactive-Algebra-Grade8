import { useState, useEffect, useCallback } from 'react';

export interface RouteState {
  view: 'home' | 'unit' | 'lesson' | 'teacher' | 'tests' | 'test-runner' | 'test-solutions' | 'independent-tests';
  unitId?: string;
  lessonId?: string;
  stepIndex?: number;
  testId?: string;
}

export function parseHash(hash: string): RouteState {
  const clean = hash.replace(/^#\/?/, '').trim();
  if (!clean) return { view: 'home' };

  const parts = clean.split('/').filter(Boolean);

  if (parts[0] === 'independent-tests') return { view: 'independent-tests' };

  // Student Test Area: catalog, attempts, and independently browsable worked solutions.
  if (parts[0] === 'tests') {
    if (parts[1] === 'run' && parts[2]) return { view: 'test-runner', testId: parts[2] };
    if (parts[1] === 'solutions') return { view: 'test-solutions', testId: parts[2] };
    return { view: 'tests' };
  }

  // Pattern: #/teacher — teacher area (password gated)
  if (parts[0] === 'teacher') return { view: 'teacher' };

  if (parts[0] === 'unit' && parts[1]) {
    const unitId = parts[1];
    if (parts[2] === 'warmup') {
      const stepIndex = parts[3] ? parseInt(parts[3], 10) - 1 : 0;
      return { view: 'lesson', unitId, lessonId: 'warmup', stepIndex: isNaN(stepIndex) ? 0 : stepIndex };
    }
    if (parts[2] === 'lesson' && parts[3]) {
      const lessonId = parts[3];
      const stepIndex = parts[4] ? parseInt(parts[4], 10) - 1 : 0;
      return { view: 'lesson', unitId, lessonId, stepIndex: isNaN(stepIndex) ? 0 : stepIndex };
    }
    return { view: 'unit', unitId };
  }

  if (parts[0] === 'lesson' && parts[1]) {
    const lessonId = parts[1];
    const stepIndex = parts[2] ? parseInt(parts[2], 10) - 1 : 0;
    return { view: 'lesson', unitId: 'unit-1', lessonId, stepIndex: isNaN(stepIndex) ? 0 : stepIndex };
  }

  if (parts[0] === 'warmup') {
    const stepIndex = parts[1] ? parseInt(parts[1], 10) - 1 : 0;
    return { view: 'lesson', unitId: 'unit-1', lessonId: 'warmup', stepIndex: isNaN(stepIndex) ? 0 : stepIndex };
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
