import React from 'react';
import { ArrowLeft, BookOpenCheck, ClipboardCheck, Clock3 } from 'lucide-react';
import { getTestsByType } from '../../data/tests/registry';
import type { TestDefinition } from '../../data/tests/types';
import { TestAreaNav } from './TestAreaNav';

interface TestsAreaProps {
  onStartTest: (testId: string) => void;
}

const TestCard: React.FC<{
  test: TestDefinition;
  onStart: () => void;
}> = ({ test, onStart }) => (
  <article className="test-card">
    <div className="test-card-meta">
      <span className="test-meta-chip"><ClipboardCheck size={14} aria-hidden="true" />{test.questionIds.length} سؤالًا</span>
      <span className="test-meta-chip"><Clock3 size={14} aria-hidden="true" />نحو {test.estimatedMinutes} دقيقة</span>
    </div>
    <div>
      <h3>{test.title}</h3>
      <p>{test.description}</p>
    </div>
    <p className="test-card-coverage">التغطية: {test.coverageLabel}</p>
    <button type="button" className="test-button test-button-primary" onClick={onStart}>
      <span>بدء الاختبار</span>
      <ArrowLeft size={17} aria-hidden="true" />
    </button>
  </article>
);

const TestSection: React.FC<{
  title: string;
  intro: string;
  tests: TestDefinition[];
  onStartTest: (testId: string) => void;
}> = ({ title, intro, tests, onStartTest }) => {
  if (tests.length === 0) return null;
  return (
    <section className="test-list-section" aria-label={title}>
      <h2 className="test-section-title">{title}</h2>
      <p className="test-section-intro">{intro}</p>
      <div className="test-card-list">
        {tests.map((test) => (
          <TestCard key={test.id} test={test} onStart={() => onStartTest(test.id)} />
        ))}
      </div>
    </section>
  );
};

export const TestsArea: React.FC<TestsAreaProps> = ({ onStartTest }) => {
  const lessonTests = getTestsByType('lesson');
  const unitTests = getTestsByType('unit');
  const comprehensiveTests = getTestsByType('comprehensive');

  return (
    <main className="tests-area" dir="rtl">
      <header className="test-area-hero">
        <p className="test-eyebrow">مساحة الطالب المستقلة</p>
        <h1>الاختبارات</h1>
        <p>اختر اختبارًا للدرس أو للوحدة. لا يظهر التصحيح أو الحل أثناء المحاولة؛ تُعرض النتيجة الإجمالية بعد التسليم فقط، وتبقى الحلول الكاملة في قسمها المستقل.</p>
      </header>

      <TestAreaNav active="tests" />

      <TestSection
        title="اختبارات الدروس"
        intro="أربعة اختبارات مستقلة، عشرون سؤالًا في كل اختبار، مع تدرّج في الصعوبة وتنوّع في أنماط الأسئلة."
        tests={lessonTests}
        onStartTest={onStartTest}
      />
      <TestSection
        title="اختبارات الوحدات"
        intro="اختبار الوحدة الأولى يضم ستين سؤالًا جديدًا بتوزيع موضوعي متوازن وأسئلة تربط مفاهيم الدروس."
        tests={unitTests}
        onStartTest={onStartTest}
      />
      <TestSection
        title="اختبارات شاملة"
        intro="اختبارات تجمع وحدات متعددة."
        tests={comprehensiveTests}
        onStartTest={onStartTest}
      />

      {lessonTests.length === 0 && unitTests.length === 0 && comprehensiveTests.length === 0 && (
        <div className="test-empty-state">
          <BookOpenCheck size={28} aria-hidden="true" />
          <h2>لا توجد اختبارات متاحة حاليًا</h2>
          <p>ستظهر الاختبارات هنا عند إضافتها.</p>
        </div>
      )}
    </main>
  );
};
