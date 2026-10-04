import React from 'react';

interface TestAreaNavProps {
  active: 'tests' | 'solutions';
}

export const TestAreaNav: React.FC<TestAreaNavProps> = ({ active }) => (
  <nav className="test-area-nav" aria-label="التنقل في مساحة الاختبارات">
    <a href="#/tests" aria-current={active === 'tests' ? 'page' : undefined}>الاختبارات</a>
    <a href="#/tests/solutions" aria-current={active === 'solutions' ? 'page' : undefined}>حلول الاختبارات</a>
  </nav>
);
