import React from 'react';
import { BookOpen, ClipboardCheck, Compass, ChevronLeft, Layers } from 'lucide-react';
import type { LessonData } from '../../data/unit1/lesson01';
import { accentStyle, getUnitAccent } from './catalogAccents';

interface LessonCardProps {
  /** Owning unit id — used to build the existing lesson route. */
  unitId: string;
  /** Registered lesson metadata from the curriculum registry. */
  lesson: LessonData;
  /** Unit number drives the accent so cards match their unit header. */
  unitNumber: number;
  /** Renders the launchpad (warmup) variant of the card. */
  isWarmup?: boolean;
}

/**
 * Catalog entry card for one registered lesson (or the unit launchpad).
 * Subordinate to unit cards: same product family, quieter surfaces.
 */
export const LessonCard: React.FC<LessonCardProps> = ({ unitId, lesson, unitNumber, isWarmup = false }) => {
  const accent = getUnitAccent(unitNumber);
  const lessonUrl = isWarmup
    ? `#/unit/${unitId}/warmup`
    : `#/unit/${unitId}/lesson/${lesson.id}`;

  return (
    <article
      className={`lesson-card${isWarmup ? ' is-warmup' : ''}`}
      style={accentStyle(accent) as React.CSSProperties}
    >
      <div className="lesson-card-top">
        {isWarmup ? (
          <span className="lesson-num-badge warmup-badge">
            <Compass size={14} aria-hidden="true" />
            <span>انطلاقة نشطة</span>
          </span>
        ) : (
          <span className="lesson-num-badge">
            <BookOpen size={14} aria-hidden="true" />
            <span>الدرس {lesson.number}</span>
          </span>
        )}
        <span className="lesson-pages">الصفحات {lesson.sourcePages.join('، ')}</span>
      </div>

      <h3 className="lesson-card-title">{lesson.title}</h3>
      <p className="lesson-card-desc">{lesson.description}</p>

      <div className="lesson-card-meta">
        <span className="lesson-meta-chip">
          <Layers size={13} aria-hidden="true" />
          {lesson.steps.length} خطوات تفاعلية
        </span>
        {lesson.finalAssessment && (
          <span className="lesson-meta-chip">
            <ClipboardCheck size={13} aria-hidden="true" />
            تقويم ختامي
          </span>
        )}
      </div>

      <a className={`lesson-cta${isWarmup ? ' is-warmup' : ''}`} href={lessonUrl}>
        <span>{isWarmup ? 'ابدأ الانطلاقة النشطة' : 'ابدأ الدرس'}</span>
        <ChevronLeft size={17} aria-hidden="true" />
      </a>
    </article>
  );
};

export default LessonCard;
