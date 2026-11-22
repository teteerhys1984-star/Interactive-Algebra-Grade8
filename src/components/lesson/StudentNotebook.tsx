import React from 'react';
import {
  NotebookPen,
  BookOpenText,
  Scale,
  Sigma,
  ListOrdered,
  PencilLine,
  AlertTriangle,
  ClipboardList,
  Printer,
  ArrowRight,
} from 'lucide-react';
import type {
  StudentNotebookData,
  NotebookSection,
  NotebookEntry,
  NotebookSectionKind,
} from '../../data/notebooks/types';
import { MathText } from '../math/MathText';

/**
 * «دفتر الطالب» — عرض مرجعي منظم للقواعد والتعريفات والأمثلة النموذجية
 * والتمارين المطلوب تدوينها. ليس ملخصًا للدرس ولا نسخة من أنشطته التفاعلية:
 * المحتوى مؤلف ومراجع لكل درس على حدة في `src/data/notebooks/`.
 *
 * العرض حالة حصرية ضمن `LessonExperience` (نمط `notebook`)، والدفتر ليس خطوة
 * ولا يدخل في حساب التقدم. الطباعة معزولة: تُضاف class على body أثناء هذا
 * العرض فقط، وكل قواعد `@media print` في `notebook.css` مشروطة بها.
 */

const SECTION_META: Record<
  NotebookSectionKind,
  { icon: React.ComponentType<{ size?: number | string }>; accent: string; defaultTitle: string }
> = {
  definitions: { icon: BookOpenText, accent: 'notebook-accent-blue', defaultTitle: 'التعريفات والمصطلحات' },
  rules: { icon: Scale, accent: 'notebook-accent-teal', defaultTitle: 'القواعد والخواص' },
  formulas: { icon: Sigma, accent: 'notebook-accent-violet', defaultTitle: 'الصيغ والعلاقات' },
  procedures: { icon: ListOrdered, accent: 'notebook-accent-sky', defaultTitle: 'خطوات الحل المنهجية' },
  'worked-examples': { icon: PencilLine, accent: 'notebook-accent-emerald', defaultTitle: 'أمثلة نموذجية محلولة' },
  cautions: { icon: AlertTriangle, accent: 'notebook-accent-rose', defaultTitle: 'تنبيهات وأخطاء شائعة' },
  'exercises-to-copy': { icon: ClipboardList, accent: 'notebook-accent-amber', defaultTitle: 'تمارين للتدوين' },
};

const ORIGIN_LABEL: Record<string, string> = {
  book: 'من الكتاب',
  adapted: 'معاد صياغته عن',
  platform: 'من إعداد المنصة',
};

const refPageLabel = (ref: { page: number; display?: string }): string =>
  ref.display ? ref.display : `ص${ref.page}`;

const SourceBadges: React.FC<{ entry: NotebookEntry }> = ({ entry }) => (
  <div className="notebook-entry-sources">
    {entry.sources.map((source, index) => {
      const pages = (source.refs ?? []).map(refPageLabel);
      const label =
        source.origin === 'platform'
          ? ORIGIN_LABEL.platform
          : `${ORIGIN_LABEL[source.origin]}: ${pages.join('، ')}`;
      return (
        <span
          key={index}
          className={`notebook-source-badge notebook-origin-${source.origin}`}
          title={source.note}
        >
          {label}
        </span>
      );
    })}
    {entry.sources.some((s) => s.note) && (
      <span className="notebook-source-note">
        {entry.sources.map((s) => s.note).filter(Boolean).join(' • ')}
      </span>
    )}
  </div>
);

const NotebookEntryCard: React.FC<{ entry: NotebookEntry }> = ({ entry }) => (
  <article className="notebook-entry" data-entry-id={entry.id}>
    {entry.title && (
      <h4 className="notebook-entry-title">
        <MathText text={entry.title} />
      </h4>
    )}
    {entry.text && (
      <div className="notebook-entry-text">
        <MathText text={entry.text} />
      </div>
    )}
    {entry.math && (
      <div className="notebook-entry-math">
        <MathText text={entry.math} display />
      </div>
    )}
    {entry.steps && entry.steps.length > 0 && (
      <ol className="notebook-entry-steps">
        {entry.steps.map((step, index) => (
          <li key={index}>
            <MathText text={step} />
          </li>
        ))}
      </ol>
    )}
    <SourceBadges entry={entry} />
  </article>
);

const NotebookSectionCard: React.FC<{ section: NotebookSection }> = ({ section }) => {
  const meta = SECTION_META[section.kind];
  const Icon = meta.icon;
  return (
    <section
      className={`notebook-section ${meta.accent}`}
      data-section-id={section.id}
      data-section-kind={section.kind}
      aria-labelledby={`notebook-section-${section.id}`}
    >
      <header className="notebook-section-header">
        <span className="notebook-section-icon" aria-hidden="true">
          <Icon size={18} />
        </span>
        <h3 id={`notebook-section-${section.id}`} className="notebook-section-title">
          {section.title || meta.defaultTitle}
        </h3>
        {section.derivedFrom && (
          <span
            className="notebook-derived-tag"
            title="يتزامن هذا السجل تلقائيًا مع محطات الدرس وأرقام تمارينه وصفحاته"
          >
            مطابق لمحطات الدرس
          </span>
        )}
      </header>
      <div className="notebook-section-body">
        {section.entries.map((entry) => (
          <NotebookEntryCard key={entry.id} entry={entry} />
        ))}
      </div>
    </section>
  );
};

interface StudentNotebookProps {
  notebook: StudentNotebookData;
  lessonTitle: string;
  unitTitle: string;
  /** العودة إلى آخر خطوة كان الطالب عندها (لا إلى بداية الدرس). */
  onBack: () => void;
}

export const StudentNotebook: React.FC<StudentNotebookProps> = ({
  notebook,
  lessonTitle,
  unitTitle,
  onBack,
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="student-notebook" data-testid="student-notebook" dir="rtl">
      <div className="notebook-toolbar">
        <button type="button" className="nav-action-btn prev-btn" onClick={onBack} aria-label="العودة إلى الدرس">
          <ArrowRight size={18} />
          <span>العودة إلى الدرس</span>
        </button>
        <button
          type="button"
          className="nav-action-btn notebook-print-btn"
          onClick={handlePrint}
          aria-label="طباعة دفتر الطالب"
        >
          <Printer size={18} />
          <span>طباعة الدفتر</span>
        </button>
      </div>

      <header className="notebook-header">
        <span className="notebook-header-icon" aria-hidden="true">
          <NotebookPen size={26} />
        </span>
        <div>
          <span className="unit-badge">{unitTitle}</span>
          <h2 className="notebook-title">
            <MathText text={notebook.title} />
          </h2>
          <p className="notebook-subtitle">
            مادة مرجعية للتدوين والرجوع — درس «{lessonTitle}»
          </p>
        </div>
      </header>

      <div className="notebook-sections">
        {notebook.sections.map((section) => (
          <NotebookSectionCard key={section.id} section={section} />
        ))}
      </div>

      <footer className="notebook-footer">
        <span>
          مراجعة تربوية: {notebook.review.date} — <MathText text={notebook.review.note} />
        </span>
      </footer>
    </div>
  );
};

export default StudentNotebook;
