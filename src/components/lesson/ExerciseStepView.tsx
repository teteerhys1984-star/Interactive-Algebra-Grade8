import React, { useState } from 'react';
import { ContentBlock, LessonStep } from '../../data/unit1/lesson01';
import { SourceContentBlock } from './SourceContentBlock';
import { MathText } from '../math/MathText';
import { Math } from '../math/Math';
import { BookOpen, Brain, Lightbulb, PenTool, Search, CheckCircle2, ChevronDown } from 'lucide-react';

interface ExerciseStepViewProps {
  step: LessonStep;
  stepIndex: number;
}

/**
 * Presentation-only layout for grouped exercise steps (Lesson 4).
 *
 * It re-uses the exact same content blocks and the same Math/MathText
 * rendering as the default renderer — nothing in the data is rewritten.
 * The only job of this component is the visual/educational hierarchy:
 * source → reasoning → hint (reveal) → try it → solution (reveal) → result.
 */

/** Splits a line that contains literal "\n" escape sequences coming from data. */
const toParagraphs = (content: string): string[] =>
  content
    .split(/\\n|\n/)
    .map((part) => part.trim())
    .filter(Boolean);

const BlockText: React.FC<{ content: string }> = ({ content }) => (
  <>
    {toParagraphs(content).map((paragraph, index) => (
      <p key={index} className="exercise-paragraph">
        <MathText text={paragraph} />
      </p>
    ))}
  </>
);

const isInteractive = (block?: ContentBlock) =>
  !!block && (!!block.interactiveType || (!!block.subItems && block.subItems.length > 0));

export const ExerciseStepView: React.FC<ExerciseStepViewProps> = ({ step, stepIndex }) => {
  const [hintOpen, setHintOpen] = useState(false);
  const [solutionOpen, setSolutionOpen] = useState(false);

  const find = (prefix: string) => step.blocks.find((block) => block.id.startsWith(`${prefix}-`));
  const sourceBlock = find('source');
  const thinkBlock = find('think');
  const hintBlock = find('hint');
  const solutionBlock = find('solution');
  const resultBlock = find('result');

  const knownIds = new Set(
    [sourceBlock, thinkBlock, hintBlock, solutionBlock, resultBlock]
      .filter(Boolean)
      .map((block) => (block as ContentBlock).id),
  );
  const extraBlocks = step.blocks.filter((block) => !knownIds.has(block.id));

  const hintId = `${step.id}-hint-panel`;
  const solutionId = `${step.id}-solution-panel`;

  return (
    <div className="exercise-view">
      {/* 1) من الكتاب — source material, kept verbatim and visually distinct */}
      {sourceBlock && (
        <section className="exercise-section exercise-source" aria-labelledby={`${step.id}-src`}>
          <h3 className="exercise-section-title" id={`${step.id}-src`}>
            <BookOpen size={18} aria-hidden="true" />
            <span>من الكتاب</span>
            <span className="exercise-section-tag source-tag">
              نص المصدر • صفحة {sourceBlock.sourceRef.page}
            </span>
          </h3>
          <div className="exercise-section-body">
            <SourceContentBlock block={sourceBlock} hideHeader dedupeMath />
          </div>
        </section>
      )}

      {/* 2) كيف نفكر؟ — authored reasoning */}
      {thinkBlock && (
        <section className="exercise-section exercise-think" aria-labelledby={`${step.id}-think`}>
          <h3 className="exercise-section-title" id={`${step.id}-think`}>
            <Brain size={18} aria-hidden="true" />
            <span>كيف نفكر؟</span>
            <span className="exercise-section-tag authored-tag">شرح الأستاذ</span>
          </h3>
          <div className="exercise-section-body">
            <BlockText content={thinkBlock.content} />
          </div>
        </section>
      )}

      {/* 3) تلميح — collapsible, never exposes the full solution */}
      {hintBlock && (
        <section className="exercise-section exercise-hint">
          <button
            type="button"
            className={`exercise-disclosure hint-disclosure${hintOpen ? ' open' : ''}`}
            onClick={() => setHintOpen((open) => !open)}
            aria-expanded={hintOpen}
            aria-controls={hintId}
          >
            <Lightbulb size={18} aria-hidden="true" />
            <span className="exercise-disclosure-label">تلميح</span>
            <span className="exercise-disclosure-state">{hintOpen ? 'إخفاء التلميح' : 'أظهر التلميح'}</span>
            <ChevronDown size={16} className="exercise-chevron" aria-hidden="true" />
          </button>
          {hintOpen && (
            <div className="exercise-section-body exercise-reveal" id={hintId}>
              <BlockText content={hintBlock.content} />
            </div>
          )}
        </section>
      )}

      {/* 4) جرّب بنفسك — only when a real interaction already exists */}
      {(isInteractive(sourceBlock) || extraBlocks.some(isInteractive)) && (
        <section className="exercise-section exercise-practice" aria-labelledby={`${step.id}-try`}>
          <h3 className="exercise-section-title" id={`${step.id}-try`}>
            <PenTool size={18} aria-hidden="true" />
            <span>جرّب بنفسك</span>
          </h3>
          <div className="exercise-section-body">
            {extraBlocks.map((block) => (
              <SourceContentBlock key={block.id} block={block} />
            ))}
            {!extraBlocks.length && (
              <p className="exercise-paragraph exercise-muted">
                استعن بالشكل المرافق أعلاه، ثم دوّن خطواتك قبل كشف الحل.
              </p>
            )}
          </div>
        </section>
      )}

      {!isInteractive(sourceBlock) &&
        extraBlocks.length > 0 &&
        !extraBlocks.some(isInteractive) &&
        extraBlocks.map((block) => <SourceContentBlock key={block.id} block={block} />)}
      {/* 5) الحل خطوة بخطوة — hidden until requested */}
      {solutionBlock && (
        <section className="exercise-section exercise-solution">
          <button
            type="button"
            className={`exercise-disclosure solution-disclosure${solutionOpen ? ' open' : ''}`}
            onClick={() => setSolutionOpen((open) => !open)}
            aria-expanded={solutionOpen}
            aria-controls={solutionId}
          >
            <Search size={18} aria-hidden="true" />
            <span className="exercise-disclosure-label">الحل خطوة بخطوة</span>
            <span className="exercise-disclosure-state">
              {solutionOpen ? 'إخفاء الحل' : 'أظهر الحل'}
            </span>
            <ChevronDown size={16} className="exercise-chevron" aria-hidden="true" />
          </button>
          {solutionOpen && (
            <div className="exercise-section-body exercise-reveal" id={solutionId}>
              <BlockText content={solutionBlock.content} />
              {solutionBlock.mathFormula && (
                <div className="exercise-math-display">
                  <Math math={solutionBlock.mathFormula} display />
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {/* 6) النتيجة — always visible, verified value untouched */}
      {resultBlock && (
        <section className="exercise-section exercise-result" aria-labelledby={`${step.id}-result`}>
          <h3 className="exercise-section-title" id={`${step.id}-result`}>
            <CheckCircle2 size={18} aria-hidden="true" />
            <span>النتيجة</span>
            <span className="exercise-section-tag authored-tag">تحقق المنصة</span>
          </h3>
          <div className="exercise-section-body">
            <BlockText content={resultBlock.content} />
          </div>
        </section>
      )}

      <p className="exercise-footnote">
        التمرين رقم {stepIndex + 1} — النص الأصلي من الكتاب، والشرح والتلميح والحل من إعداد المنصة.
      </p>
    </div>
  );
};

export default ExerciseStepView;
