import React from 'react';
import { ArrowLeft, BookOpenCheck, ClipboardCheck, Clock3 } from 'lucide-react';
import { getTestsByType } from '../../data/tests/registry';
import type { TestDefinition } from '../../data/tests/types';
import { TestAreaNav } from './TestAreaNav';

interface TestSolutionsAreaProps {
  onSelectTest: (testId: string) => void;
}

const SolutionTestCard: React.FC<{
  test: TestDefinition;
  onSelect: () => void;
}> = ({ test, onSelect }) => (
  <article className="test-card">
    <div className="test-card-meta">
      <span className="test-meta-chip"><ClipboardCheck size={14} aria-hidden="true" />{test.questionIds.length} حلًا</span>
      <span className="test-meta-chip"><Clock3 size={14} aria-hidden="true" />منهجية خطوة بخطوة</span>
    </div>
    <div>
      <h3>{test.title}</h3>
      <p>{test.coverageLabel}</p>
    </div>
    <button type="button" className="test-button" onClick={onSelect}>
      <BookOpenCheck size={17} aria-hidden="true" />
      <span>عرض الحلول الكاملة</span>
      <ArrowLeft size={17} aria-hidden="true" />
    </button>
  </article>
);

const SolutionSection: React.FC<{
  title: string;
  tests: TestDefinition[];
  onSelectTest: (testId: string) => void;
}> = ({ title, tests, onSelectTest }) => {
  if (tests.length === 0) return null;
  return (
    <section className="test-list-section" aria-label={title}>
      <h2 className="test-section-title">{title}</h2>
      <div className="test-card-list">
        {tests.map((test) => (
          <SolutionTestCard key={test.id} test={test} onSelect={() => onSelectTest(test.id)} />
        ))}
      </div>
    </section>
  );
};

export const TestSolutionsArea: React.FC<TestSolutionsAreaProps> = ({ onSelectTest }) => {
  const lessonTests = getTestsByType('lesson');
  const unitTests = getTestsByType('unit');
  const comprehensiveTests = getTestsByType('comprehensive');

  return (
    <main className="tests-area" dir="rtl">
      <header className="test-area-hero">
        <p className="test-eyebrow">مرجع تعلّم مستقل للطالب</p>
        <h1>حلول الاختبارات</h1>
        <p>راجع الحلول الكاملة لأي اختبار، سواء خضته أم لا. تتضمن كل مسألة خطوات الحساب أو التحليل، والنتيجة النهائية، وسبب اختيار الطريقة.</p>
      </header>

      <TestAreaNav active="solutions" />

      <SolutionSection title="حلول اختبارات الدروس" tests={lessonTests} onSelectTest={onSelectTest} />
      <SolutionSection title="حلول اختبارات الوحدات" tests={unitTests} onSelectTest={onSelectTest} />
      <SolutionSection title="حلول الاختبارات الشاملة" tests={comprehensiveTests} onSelectTest={onSelectTest} />

      {lessonTests.length === 0 && unitTests.length === 0 && comprehensiveTests.length === 0 && (
        <div className="test-empty-state">
          <BookOpenCheck size={28} aria-hidden="true" />
          <h2>لا توجد حلول متاحة حاليًا</h2>
          <p>ستظهر الحلول هنا عند إضافة الاختبارات.</p>
        </div>
      )}
    </main>
  );
};
