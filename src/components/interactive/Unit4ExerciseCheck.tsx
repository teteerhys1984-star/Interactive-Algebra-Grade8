import React, { useState } from 'react';
import { CheckCircle2, RotateCcw, XCircle } from 'lucide-react';
import { MathText } from '../math/MathText';
import {
  gradeCycleNodes,
  gradeLinearEquation,
  gradeLinearExpression,
  gradeRationalInput,
  type GradeFailureReason,
} from '../../data/unit4/lesson04Grading';
import {
  Unit4ExercisesFigure,
  type Unit4ExerciseFigureId,
} from '../lesson/Unit4ExercisesFigures';

export interface Unit4RationalFieldSpec {
  id: string;
  label?: string;
  prefixLatex?: string;
  suffixText?: string;
  placeholder?: string;
  expected: string;
  variable?: string;
}

export interface Unit4ExprFieldSpec {
  id: string;
  label?: string;
  prefixLatex?: string;
  placeholder?: string;
  expectedExpr: string;
  variable?: string;
}

export interface Unit4CheckSubItemSpec {
  id: string;
  /** Sub-question number displayed in the BLUE sub-question badge (omitted for single-part main questions). */
  subNumber?: string;
  prompt: string;
  figureId?: Unit4ExerciseFigureId;
  revealFigureOnCorrect?: Unit4ExerciseFigureId;
  kind: 'mcq' | 'rational' | 'linear-expr' | 'linear-eq' | 'cycle';
  /** For kind === 'mcq' */
  choices?: { badge: string; text: string }[];
  correctChoiceIndex?: number;
  /** For kind === 'rational' */
  rationalFields?: Unit4RationalFieldSpec[];
  /** For kind === 'linear-expr' */
  exprFields?: Unit4ExprFieldSpec[];
  /** For kind === 'linear-eq' */
  acceptedEquations?: string[];
  equationPlaceholder?: string;
  equationVariable?: string;
  /** For kind === 'cycle' — order: [top, right, bottom, left] */
  expectedCycleNodes?: [string, string, string, string];
  cycleDiagramTitle?: string;
  cycleOps?: {
    bottomToLeft: string;
    leftToTop: string;
    topToRight: string;
    fourthOp: string;
    fourthDirection: 'bottom-to-right' | 'right-to-bottom';
  };
  successFeedback: string;
  errorFeedback: string;
}

export interface Unit4ExerciseCheckData {
  mainNumber: number;
  subtitle?: string;
  instruction?: string;
  items: Unit4CheckSubItemSpec[];
}

interface Unit4ExerciseCheckProps {
  data: Unit4ExerciseCheckData;
}

function diagnosticMessage(reason: GradeFailureReason | undefined, fallback: string, variable?: string): string {
  switch (reason) {
    case 'empty':
      return 'يرجى إدخال الإجابة في الحقل المخصّص قبل الضغط على «تحقّق».';
    case 'wrong-variable':
      return variable
        ? `انتبه لرمز المجهول المستعمل في هذا البند: المجهول هنا هو $${variable}$.`
        : 'استخدم رمز المجهول المحدّد في نص السؤال.';
    case 'invalid-number':
      return 'أدخل عدداً صحيحاً أو عشرياً أو كسراً عادياً بصيغة سليمة (مثل $-7$ أو $29/5$ أو $-13/3$).';
    case 'missing-equals':
      return 'المطلوب كتابة معادلة تحوي إشارة المساواة $=$ بين طرفين.';
    case 'unexpected-equals':
      return 'المطلوب كتابة عبارة جبرية بدلالة المتغير فقط من دون إشارة $=$.';
    case 'already-solved':
      return 'كتبتَ قيمة المجهول مباشرة؛ المطلوب أولاً صياغة المعادلة التي تعبّر عن النص قبل حلّها.';
    case 'nonlinear':
      return 'انتبه: العبارة أو المعادلة هنا من الدرجة الأولى (خطية) ولا تحوي جداء المتغير بنفسه أو القسمة عليه.';
    case 'not-in-variable':
      return 'يجب أن تتضمن المعادلة المجهول المطلوب بحيث لا ينعدم معامله بين الطرفين.';
    case 'invalid-expression':
      return 'تحقّق من سلامة الأقواس والعمليات الحسابية في العبارة المكتوبة.';
    default:
      return fallback;
  }
}

const SingleSubItemVerifier: React.FC<{
  item: Unit4CheckSubItemSpec;
  mainNumber: number;
}> = ({ item, mainNumber }) => {
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [eqValue, setEqValue] = useState<string>('');
  const [cycleValues, setCycleValues] = useState<[string, string, string, string]>(['', '', '', '']);
  const [checkedState, setCheckedState] = useState<{
    checked: boolean;
    ok: boolean;
    message: string;
    fieldStatus?: Record<string, boolean>;
    cycleStatus?: boolean[];
  }>({ checked: false, ok: false, message: '' });

  const resetCheckOnEdit = () => {
    if (checkedState.checked) {
      setCheckedState({ checked: false, ok: false, message: '' });
    }
  };

  const handleVerify = () => {
    if (item.kind === 'mcq') {
      if (selectedChoice === null) {
        setCheckedState({
          checked: true,
          ok: false,
          message: 'اختر إحدى الإجابات المقترحة أولاً ثم اضغط على «تحقّق».',
        });
        return;
      }
      const ok = selectedChoice === item.correctChoiceIndex;
      setCheckedState({
        checked: true,
        ok,
        message: ok ? item.successFeedback : item.errorFeedback,
      });
      return;
    }

    if (item.kind === 'rational' && item.rationalFields) {
      const status: Record<string, boolean> = {};
      let firstReason: GradeFailureReason | undefined;
      let firstVar: string | undefined;
      let allOk = true;
      for (const f of item.rationalFields) {
        const res = gradeRationalInput(fieldValues[f.id] ?? '', f.expected, {
          variable: f.variable,
        });
        status[f.id] = res.ok;
        if (!res.ok) {
          allOk = false;
          if (!firstReason) {
            firstReason = res.reason;
            firstVar = f.variable;
          }
        }
      }
      setCheckedState({
        checked: true,
        ok: allOk,
        fieldStatus: status,
        message: allOk
          ? item.successFeedback
          : firstReason && firstReason !== 'wrong-value'
            ? diagnosticMessage(firstReason, item.errorFeedback, firstVar)
            : item.errorFeedback,
      });
      return;
    }

    if (item.kind === 'linear-expr' && item.exprFields) {
      const status: Record<string, boolean> = {};
      let firstReason: GradeFailureReason | undefined;
      let firstVar: string | undefined;
      let allOk = true;
      for (const f of item.exprFields) {
        const v = f.variable ?? 'x';
        const res = gradeLinearExpression(fieldValues[f.id] ?? '', f.expectedExpr, v);
        status[f.id] = res.ok;
        if (!res.ok) {
          allOk = false;
          if (!firstReason) {
            firstReason = res.reason;
            firstVar = v;
          }
        }
      }
      setCheckedState({
        checked: true,
        ok: allOk,
        fieldStatus: status,
        message: allOk
          ? item.successFeedback
          : firstReason && firstReason !== 'wrong-value'
            ? diagnosticMessage(firstReason, item.errorFeedback, firstVar)
            : item.errorFeedback,
      });
      return;
    }

    if (item.kind === 'linear-eq' && item.acceptedEquations) {
      const v = item.equationVariable ?? 'x';
      const res = gradeLinearEquation(eqValue, item.acceptedEquations, v, {
        forbidIsolatedVariable: true,
      });
      setCheckedState({
        checked: true,
        ok: res.ok,
        message: res.ok
          ? item.successFeedback
          : res.reason && res.reason !== 'wrong-value'
            ? diagnosticMessage(res.reason, item.errorFeedback, v)
            : item.errorFeedback,
      });
      return;
    }

    if (item.kind === 'cycle' && item.expectedCycleNodes) {
      const res = gradeCycleNodes(cycleValues, item.expectedCycleNodes);
      let msg = item.errorFeedback;
      if (res.ok) msg = item.successFeedback;
      else if (res.hasEmpty) msg = 'املأ الخانات الأربع جميعها في المخطط قبل الضغط على «تحقّق».';
      else if (res.hasInvalid) msg = 'أدخل أعداداً صحيحة أو كسوراً سليمة في كل خانة من الخانات الأربع.';
      setCheckedState({
        checked: true,
        ok: res.ok,
        cycleStatus: res.cellOk,
        message: msg,
      });
    }
  };

  const handleReset = () => {
    setSelectedChoice(null);
    setFieldValues({});
    setEqValue('');
    setCycleValues(['', '', '', '']);
    setCheckedState({ checked: false, ok: false, message: '' });
  };

  const cycleLabels = ['الخانة العليا', 'الخانة اليمنى', 'الخانة السفلى', 'الخانة اليسرى'];

  return (
    <div
      className={`u4-ex-subcard${item.subNumber ? ' u4-ex-subcard--sub' : ' u4-ex-subcard--single'}`}
      data-testid={`u4-q${mainNumber}-item-${item.id}`}
    >
      <div className="u4-ex-subcard-head">
        {item.subNumber && (
          <span
            className="u4-sub-num-badge"
            data-number-role="sub"
            aria-label={`الفرع ${item.subNumber} من السؤال ${mainNumber}`}
          >
            {item.subNumber}
          </span>
        )}
        <div className="u4-ex-subcard-prompt">
          <MathText text={item.prompt} />
        </div>
      </div>

      {item.figureId && <Unit4ExercisesFigure figureId={item.figureId} />}

      {/* MCQ Options */}
      {item.kind === 'mcq' && item.choices && (
        <div className="u4-ex-choices" role="radiogroup" aria-label={item.prompt}>
          {item.choices.map((ch, idx) => {
            const isSelected = selectedChoice === idx;
            let stateCls = '';
            if (checkedState.checked) {
              if (checkedState.ok && isSelected) stateCls = ' is-correct';
              else if (!checkedState.ok && isSelected) stateCls = ' is-wrong';
            } else if (isSelected) {
              stateCls = ' is-selected';
            }
            return (
              <button
                key={idx}
                type="button"
                role="radio"
                aria-checked={isSelected}
                className={`u4-ex-choice-btn${stateCls}`}
                onClick={() => {
                  setSelectedChoice(idx);
                  resetCheckOnEdit();
                }}
              >
                <span className="u4-ex-choice-num">{ch.badge}</span>
                <span className="u4-ex-choice-label">
                  <MathText text={ch.text} />
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Rational Fields */}
      {item.kind === 'rational' && item.rationalFields && (
        <div className="u4-ex-fields">
          {item.rationalFields.map((field) => {
            const status = checkedState.fieldStatus?.[field.id];
            const statusCls =
              status === undefined ? '' : status ? ' is-correct' : ' is-wrong';
            return (
              <label key={field.id} className="u4-ex-field-row">
                {field.label && (
                  <span className="u4-ex-field-label">
                    <MathText text={field.label} />
                  </span>
                )}
                <span className="u4-ex-input-group">
                  {field.prefixLatex && (
                    <span className="u4-ex-prefix" dir="ltr">
                      <MathText text={`$${field.prefixLatex}$`} />
                    </span>
                  )}
                  <input
                    type="text"
                    dir="ltr"
                    inputMode="text"
                    className={`u4-ex-input${statusCls}`}
                    placeholder={field.placeholder ?? 'أدخل القيمة'}
                    aria-label={field.label ?? item.prompt}
                    value={fieldValues[field.id] ?? ''}
                    onChange={(e) => {
                      setFieldValues((prev) => ({ ...prev, [field.id]: e.target.value }));
                      resetCheckOnEdit();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleVerify();
                    }}
                  />
                  {field.suffixText && (
                    <span className="u4-ex-suffix">
                      <MathText text={field.suffixText} />
                    </span>
                  )}
                </span>
              </label>
            );
          })}
        </div>
      )}

      {/* Linear Algebraic Expression Fields */}
      {item.kind === 'linear-expr' && item.exprFields && (
        <div className="u4-ex-fields">
          {item.exprFields.map((field) => {
            const status = checkedState.fieldStatus?.[field.id];
            const statusCls =
              status === undefined ? '' : status ? ' is-correct' : ' is-wrong';
            return (
              <label key={field.id} className="u4-ex-field-row">
                {field.label && (
                  <span className="u4-ex-field-label">
                    <MathText text={field.label} />
                  </span>
                )}
                <span className="u4-ex-input-group">
                  {field.prefixLatex && (
                    <span className="u4-ex-prefix" dir="ltr">
                      <MathText text={`$${field.prefixLatex}$`} />
                    </span>
                  )}
                  <input
                    type="text"
                    dir="ltr"
                    className={`u4-ex-input u4-ex-input--wide${statusCls}`}
                    placeholder={field.placeholder ?? 'مثال: 2x + 3'}
                    aria-label={field.label ?? item.prompt}
                    value={fieldValues[field.id] ?? ''}
                    onChange={(e) => {
                      setFieldValues((prev) => ({ ...prev, [field.id]: e.target.value }));
                      resetCheckOnEdit();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleVerify();
                    }}
                  />
                </span>
              </label>
            );
          })}
        </div>
      )}

      {/* Linear Equation Field */}
      {item.kind === 'linear-eq' && (
        <div className="u4-ex-fields">
          <label className="u4-ex-field-row">
            <span className="u4-ex-field-label">المعادلة:</span>
            <input
              type="text"
              dir="ltr"
              className={`u4-ex-input u4-ex-input--wide${
                !checkedState.checked ? '' : checkedState.ok ? ' is-correct' : ' is-wrong'
              }`}
              placeholder={item.equationPlaceholder ?? 'اكتب المعادلة بدلالة x'}
              aria-label={item.prompt}
              value={eqValue}
              onChange={(e) => {
                setEqValue(e.target.value);
                resetCheckOnEdit();
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleVerify();
              }}
            />
          </label>
        </div>
      )}

      {/* Interactive 4-Node Cycle Diagram Fill-In (Q19) */}
      {item.kind === 'cycle' && item.cycleOps && (
        <div className="u4-cycle-widget" dir="ltr" aria-label={item.cycleDiagramTitle ?? item.prompt}>
          <div className="u4-cycle-diamond">
            {/* Top circle */}
            <div className="u4-cycle-slot u4-cycle-slot--top">
              <input
                type="text"
                dir="ltr"
                className={`u4-cycle-input${
                  checkedState.cycleStatus
                    ? checkedState.cycleStatus[0]
                      ? ' is-correct'
                      : ' is-wrong'
                    : ''
                }`}
                aria-label={`${item.cycleDiagramTitle ?? ''} — ${cycleLabels[0]}`}
                placeholder="؟"
                value={cycleValues[0]}
                onChange={(e) => {
                  const next = [...cycleValues] as [string, string, string, string];
                  next[0] = e.target.value;
                  setCycleValues(next);
                  resetCheckOnEdit();
                }}
              />
            </div>

            {/* Upper operations row */}
            <div className="u4-cycle-op u4-cycle-op--ul">{item.cycleOps.leftToTop} ↗</div>
            <div className="u4-cycle-op u4-cycle-op--ur">↘ {item.cycleOps.topToRight}</div>

            {/* Left & Right circles */}
            <div className="u4-cycle-slot u4-cycle-slot--left">
              <input
                type="text"
                dir="ltr"
                className={`u4-cycle-input${
                  checkedState.cycleStatus
                    ? checkedState.cycleStatus[3]
                      ? ' is-correct'
                      : ' is-wrong'
                    : ''
                }`}
                aria-label={`${item.cycleDiagramTitle ?? ''} — ${cycleLabels[3]}`}
                placeholder="؟"
                value={cycleValues[3]}
                onChange={(e) => {
                  const next = [...cycleValues] as [string, string, string, string];
                  next[3] = e.target.value;
                  setCycleValues(next);
                  resetCheckOnEdit();
                }}
              />
            </div>

            <div className="u4-cycle-slot u4-cycle-slot--right">
              <input
                type="text"
                dir="ltr"
                className={`u4-cycle-input${
                  checkedState.cycleStatus
                    ? checkedState.cycleStatus[1]
                      ? ' is-correct'
                      : ' is-wrong'
                    : ''
                }`}
                aria-label={`${item.cycleDiagramTitle ?? ''} — ${cycleLabels[1]}`}
                placeholder="؟"
                value={cycleValues[1]}
                onChange={(e) => {
                  const next = [...cycleValues] as [string, string, string, string];
                  next[1] = e.target.value;
                  setCycleValues(next);
                  resetCheckOnEdit();
                }}
              />
            </div>

            {/* Lower operations row */}
            <div className="u4-cycle-op u4-cycle-op--ll">↖ {item.cycleOps.bottomToLeft}</div>
            <div className="u4-cycle-op u4-cycle-op--lr">
              {item.cycleOps.fourthDirection === 'bottom-to-right'
                ? `${item.cycleOps.fourthOp} ↗`
                : `↙ ${item.cycleOps.fourthOp}`}
            </div>

            {/* Bottom circle */}
            <div className="u4-cycle-slot u4-cycle-slot--bottom">
              <input
                type="text"
                dir="ltr"
                className={`u4-cycle-input${
                  checkedState.cycleStatus
                    ? checkedState.cycleStatus[2]
                      ? ' is-correct'
                      : ' is-wrong'
                    : ''
                }`}
                aria-label={`${item.cycleDiagramTitle ?? ''} — ${cycleLabels[2]}`}
                placeholder="؟"
                value={cycleValues[2]}
                onChange={(e) => {
                  const next = [...cycleValues] as [string, string, string, string];
                  next[2] = e.target.value;
                  setCycleValues(next);
                  resetCheckOnEdit();
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="u4-ex-actions">
        <button type="button" className="u4-ex-check-btn" onClick={handleVerify}>
          تحقّق
        </button>
        {checkedState.checked && (
          <button type="button" className="u4-ex-reset-btn" onClick={handleReset}>
            <RotateCcw size={15} />
            <span>إعادة المحاولة</span>
          </button>
        )}
      </div>

      {/* Feedback */}
      {checkedState.checked && (
        <div
          className={`u4-ex-feedback ${checkedState.ok ? 'is-success' : 'is-error'}`}
          role="status"
        >
          {checkedState.ok ? <CheckCircle2 size={19} /> : <XCircle size={19} />}
          <div className="u4-ex-feedback-body">
            <strong>{checkedState.ok ? 'إجابة صحيحة! ' : 'راجع إجابتك: '}</strong>
            <MathText text={checkedState.message} />
            {checkedState.ok && item.revealFigureOnCorrect && (
              <div style={{ marginTop: '0.75rem' }}>
                <Unit4ExercisesFigure figureId={item.revealFigureOnCorrect} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const Unit4ExerciseCheck: React.FC<Unit4ExerciseCheckProps> = ({ data }) => {
  return (
    <section
      className="u4-ex-verifier"
      aria-label={`التحقق التفاعلي للسؤال ${data.mainNumber}`}
    >
      <header className="u4-ex-verifier-header">
        <span
          className="u4-main-num-badge"
          data-number-role="main"
          aria-label={`السؤال الرئيسي ${data.mainNumber}`}
        >
          {data.mainNumber}
        </span>
        <div className="u4-ex-verifier-titles">
          <h4 className="u4-ex-verifier-title">
            تحقّق من إجابتك — السؤال {data.mainNumber}
            {data.subtitle ? `: ${data.subtitle}` : ''}
          </h4>
          {data.instruction && (
            <p className="u4-ex-verifier-sub">
              <MathText text={data.instruction} />
            </p>
          )}
        </div>
      </header>

      <div className="u4-ex-subcards-list">
        {data.items.map((item) => (
          <SingleSubItemVerifier key={item.id} item={item} mainNumber={data.mainNumber} />
        ))}
      </div>
    </section>
  );
};
