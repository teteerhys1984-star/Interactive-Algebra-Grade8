import React, { useState } from 'react';
import { ContentBlock } from '../../data/unit1/lesson01';
import { Math } from '../math/Math';
import { MathText } from '../math/MathText';
import { MultipleChoiceQuestion } from '../interactive/MultipleChoiceQuestion';
import { FillInBlanksQuestion } from '../interactive/FillInBlanksQuestion';
import { IntruderFinderQuestion } from '../interactive/IntruderFinderQuestion';
import { JuiceVisualizer } from '../interactive/JuiceVisualizer';
import { FractionMultiplyExplorer } from '../interactive/FractionMultiplyExplorer';
import { SignProductExplorer } from '../interactive/SignProductExplorer';
import { DistributiveExpander } from '../interactive/DistributiveExpander';
import { PracticeCheck } from '../interactive/PracticeCheck';
import {
  Sparkles,
  BookOpen,
  HelpCircle,
  Lightbulb,
  CheckCircle,
  PenTool,
  Compass,
  Eye,
  RefreshCw,
  GraduationCap,
  Brain,
  Scale,
  AlertCircle,
} from 'lucide-react';

interface SourceContentBlockProps {
  block: ContentBlock;
}

export const SourceContentBlock: React.FC<SourceContentBlockProps> = ({ block }) => {
  const [revealedSolutions, setRevealedSolutions] = useState<Record<number, boolean>>({});

  const toggleSubItemSolution = (idx: number) => {
    setRevealedSolutions((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const getBlockIcon = (type: string) => {
    switch (type) {
      case 'activity':
        return <Compass size={20} style={{ color: 'var(--color-primary-600)' }} />;
      case 'learn':
        return <Sparkles size={20} style={{ color: 'var(--color-teal-600)' }} />;
      case 'knowledge':
        return <BookOpen size={20} style={{ color: '#8b5cf6' }} />;
      case 'check':
        return <HelpCircle size={20} style={{ color: 'var(--color-amber-600)' }} />;
      case 'practice':
        return <PenTool size={20} style={{ color: 'var(--color-emerald-600)' }} />;
      case 'tip':
        return <Lightbulb size={20} style={{ color: 'var(--color-amber-500)' }} />;
      case 'teach':
        return <GraduationCap size={20} style={{ color: '#0ea5e9' }} />;
      case 'insight':
        return <Brain size={20} style={{ color: '#8b5cf6' }} />;
      case 'mistake':
        return <Scale size={20} style={{ color: 'var(--color-rose-600)' }} />;
      case 'example':
        return <PenTool size={20} style={{ color: 'var(--color-teal-600)' }} />;
      case 'interactive-exercise':
        return <Sparkles size={20} style={{ color: '#0ea5e9' }} />;
      default:
        return <CheckCircle size={20} style={{ color: 'var(--color-primary-600)' }} />;
    }
  };

  const getBlockClass = (type: string) => {
    switch (type) {
      case 'activity':
        return 'activity-block';
      case 'learn':
        return 'learn-block';
      case 'knowledge':
        return 'knowledge-block';
      case 'check':
        return 'check-block';
      case 'practice':
        return 'practice-block';
      case 'tip':
        return 'tip-block';
      case 'teach':
        return 'teach-block';
      case 'insight':
        return 'insight-block';
      case 'mistake':
        return 'mistake-block';
      case 'example':
        return 'example-block';
      case 'interactive-exercise':
        return 'interactive-block';
      default:
        return '';
    }
  };

  const formatSourceRef = (ref: { page: number; section: string; item?: string }) => {
    if (ref.item) {
      return `صفحة ${ref.page} • ${ref.section} • ${ref.item}`;
    }
    return `صفحة ${ref.page} • ${ref.section}`;
  };

  return (
    <article className={`source-content-block ${getBlockClass(block.type)}`}>
      <div className="block-header">
        <div className="block-title-group">
          <div className="block-icon">{getBlockIcon(block.type)}</div>
          <h3 className="block-title">{block.title}</h3>
        </div>
        {block.authored ? (
          <span className="source-ref-tag authored-tag" title="شرح إضافي من المنصة (ليس من نص الكتاب)">
            شرح الأستاذ
          </span>
        ) : (
          <span className="source-ref-tag" title="مرجع الكتاب المدرسي الأصلي">
            {formatSourceRef(block.sourceRef)}
          </span>
        )}
      </div>

      {block.verifyNote && (
        <div className="verify-note">
          <AlertCircle size={16} />
          <span>{block.verifyNote}</span>
        </div>
      )}

      {block.content && (
        <div className="block-body-text" style={{ fontSize: '1.025rem', marginBottom: '1rem' }}>
          <MathText text={block.content} />
        </div>
      )}

      {block.mathFormula && (
        <div style={{ margin: '1rem 0' }}>
          <Math math={block.mathFormula} display />
        </div>
      )}

      {block.explanation && (
        <div className="feedback-box info" style={{ margin: '1rem 0' }}>
          <MathText text={block.explanation} />
        </div>
      )}

      {/* Interactive elements if specified */}
      {block.interactiveType === 'mcq' && block.interactiveData && (
        <MultipleChoiceQuestion options={block.interactiveData.options} />
      )}

      {block.interactiveType === 'fill-blank' && block.interactiveData && (
        <FillInBlanksQuestion
          prompt={block.interactiveData.prompt}
          expression={block.interactiveData.expression}
          solution={block.interactiveData.solution}
        />
      )}

      {block.interactiveType === 'intruder-finder' && block.interactiveData && (
        <IntruderFinderQuestion lists={block.interactiveData.lists} />
      )}

      {block.interactiveType === 'juice-mixer' && <JuiceVisualizer />}

      {block.interactiveType === 'fraction-multiply' && (
        <FractionMultiplyExplorer initial={block.interactiveData?.initial} />
      )}

      {block.interactiveType === 'sign-product' && (
        <SignProductExplorer initial={block.interactiveData?.initial} />
      )}

      {block.interactiveType === 'distributive' && (
        <DistributiveExpander initial={block.interactiveData?.initial} />
      )}

      {block.interactiveType === 'practice-check' && block.interactiveData?.questions && (
        <PracticeCheck questions={block.interactiveData.questions} />
      )}

      {/* Sub-items (exercises, worked examples, rules) */}
      {block.subItems && block.subItems.length > 0 && (
        <div className="solver-steps">
          {block.subItems.map((item, idx) => {
            const isRevealed = revealedSolutions[idx];
            return (
              <div key={idx} className="step-card">
                {item.label && (
                  <div className="step-header-mini">
                    <span className="step-badge-mini">{idx + 1}</span>
                    <MathText text={item.label} />
                  </div>
                )}
                <div style={{ fontSize: '0.95rem', color: 'var(--color-slate-800)' }}>
                  <MathText text={item.text} />
                </div>
                {item.math && (
                  <div style={{ margin: '0.75rem 0' }}>
                    <Math math={item.math} display />
                  </div>
                )}
                {item.explanation && (
                  <div style={{ fontSize: '0.9rem', color: 'var(--color-slate-600)', marginTop: '0.5rem' }}>
                    <MathText text={item.explanation} />
                  </div>
                )}
                {item.verifyNote && (
                  <div className="verify-note">
                    <AlertCircle size={16} />
                    <span>{item.verifyNote}</span>
                  </div>
                )}
                {item.solution && (
                  <div style={{ marginTop: '0.75rem' }}>
                    <button
                      className="reveal-btn"
                      onClick={() => toggleSubItemSolution(idx)}
                    >
                      {isRevealed ? (
                        <>
                          <RefreshCw size={14} />
                          <span>إخفاء الحل</span>
                        </>
                      ) : (
                        <>
                          <Eye size={14} />
                          <span>إظهار الحل والخطوات</span>
                        </>
                      )}
                    </button>
                    {isRevealed && (
                      <div className="solution-panel">
                        <div className="solution-panel-header">
                          <CheckCircle size={16} />
                          <span>خطوات الحل والنتيجة:</span>
                        </div>
                        <Math math={item.solution} display />
                        {item.explanation && (
                          <div style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
                            <MathText text={item.explanation} />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </article>
  );
};

export default SourceContentBlock;
