import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../app/App';
import { curriculum, getLessonById } from '../data/curriculum';
import { lesson02Data } from '../data/unit1/lesson02';
import { lesson01Data } from '../data/unit1/lesson01';
import { FinalAssessment, normalizeAnswer } from '../components/assessment/FinalAssessment';
import { FractionMultiplyExplorer } from '../components/interactive/FractionMultiplyExplorer';
import { SignProductExplorer } from '../components/interactive/SignProductExplorer';
import { DistributiveExpander } from '../components/interactive/DistributiveExpander';
import { PracticeCheck } from '../components/interactive/PracticeCheck';
import { TeacherArea } from '../components/teacher/TeacherArea';

const flat = (l = lesson02Data) => l.steps.flatMap((s) => s.blocks);

describe('Lesson 2 — الضرب (Pages 8, 9, 10, 11)', () => {
  beforeEach(() => {
    window.location.hash = '';
    sessionStorage.clear();
  });

  /* ------------------------- Registry & structure ------------------------ */
  describe('Curriculum registry', () => {
    it('registers Lesson 2 alongside Lesson 1 in Unit 1 without breaking Lesson 1', () => {
      const unit1 = curriculum[0];
      // الوحدة تنمو مع الدروس الجديدة؛ المهم بقاء الدرسين 1 و 2 مسجّلين وبالترتيب.
      expect(unit1.lessons.map((l) => l.id).slice(0, 2)).toEqual(['lesson-1', 'lesson-2']);
      expect(getLessonById('unit-1', 'lesson-1')).toBeDefined();
      expect(getLessonById('unit-1', 'lesson-2')).toBeDefined();
    });

    it('Lesson 2 has the correct title, number and source pages', () => {
      expect(lesson02Data.title).toBe('الضرب');
      expect(lesson02Data.number).toBe(2);
      expect(lesson02Data.sourcePages).toEqual([8, 9, 10, 11]);
    });

    it('Lesson 2 uses meaningful multi-step structure', () => {
      expect(lesson02Data.steps.length).toBeGreaterThanOrEqual(7);
    });
  });

  /* ---------------------------- Source fidelity -------------------------- */
  describe('Source fidelity', () => {
    it('Step 1 keeps the نشاط with all four cases and the "give a rule" item', () => {
      const step1 = lesson02Data.steps[0];
      expect(step1.sourcePages).toContain(8);
      const act = step1.blocks.find((b) => b.title.includes('احسب الناتج'));
      expect(act?.subItems?.length).toBe(4);
      expect(step1.blocks.some((b) => b.title.includes('أعطِ قاعدة'))).toBe(true);
    });

    it('Step 2 keeps the multiplication property and the candy example (= 1/2)', () => {
      const step2 = lesson02Data.steps[1];
      const rule = step2.blocks.find((b) => b.type === 'learn');
      expect(rule?.subItems?.some((s) => s.math?.includes('\\frac{a \\times c}{b \\times d}'))).toBe(true);
      const candy = step2.blocks.find((b) => b.title.includes('الحلوى'));
      expect(candy?.mathFormula).toContain('\\frac{1}{2}');
    });

    it('Step 3 keeps صيغ مبسّطة, the bc/6h note, and the literal multiplication example', () => {
      const step3 = lesson02Data.steps[2];
      expect(step3.blocks.some((b) => b.title.includes('صيغ مبسّطة'))).toBe(true);
      expect(flat().some((b) => b.content?.includes('bc') || b.content?.includes('6h'))).toBe(true);
      const ex = step3.blocks.find((b) => b.title.includes('أنجز'));
      expect(ex?.subItems?.some((s) => s.math?.includes('18x'))).toBe(true);
    });

    it('Step 4 keeps the sign-of-product rule with both parity cases', () => {
      const step4 = lesson02Data.steps[3];
      const rule = step4.blocks.find((b) => b.title.includes('كيف تعرف إشارة'));
      expect(rule?.subItems?.length).toBe(2);
    });

    it('Step 5 keeps the distributive property and expands A, B, C correctly', () => {
      const step5 = lesson02Data.steps[4];
      expect(flat(lesson02Data).some((b) => b.subItems?.some((s) => s.math?.includes('a \\times (x + y) = ax + ay')))).toBe(true);
      const ex = step5.blocks.find((b) => b.title.includes('انشر'));
      expect(ex?.subItems?.some((s) => s.math?.includes('-12 - 15x'))).toBe(true);
      expect(ex?.subItems?.some((s) => s.math?.includes('-15 + 20y'))).toBe(true);
      expect(ex?.subItems?.some((s) => s.math?.includes('20 - 12z'))).toBe(true);
    });

    it('Step 6 keeps factoring (hx±hy) and the 2x - 5x = -3x example', () => {
      expect(flat().some((b) => b.subItems?.some((s) => s.math?.includes('h \\times (x + y)')))).toBe(true);
      expect(flat().some((b) => b.subItems?.some((s) => s.math?.includes('-3x')))).toBe(true);
    });

    it('Step 7 (تحقق من فهمك) keeps all four exercise groups', () => {
      const step7 = lesson02Data.steps[6];
      const titles = step7.blocks.map((b) => b.title);
      expect(titles.some((t) => t.includes('أوجد إشارة'))).toBe(true);
      expect(titles.some((t) => t.includes('دون إنجاز الحساب'))).toBe(true);
      expect(titles.some((t) => t.includes('احسب ذهنيًا'))).toBe(true);
      expect(titles.some((t) => t.includes('احسب يدويًا'))).toBe(true);
      expect(titles.some((t) => t.includes('مصطلحات'))).toBe(true);
    });

    it('Step 8 (تدرّب) keeps exercise ④ COMPLETE with 5 confirmed sub-items', () => {
      const step8 = lesson02Data.steps[7];
      const ex4 = step8.blocks.find((b) => b.title.includes('عبّر بصيغة'));
      expect(ex4).toBeDefined();
      expect(ex4?.subItems?.length).toBe(5);
      // Fractions now render inline within the Arabic phrase (item.text).
      expect(ex4?.subItems?.[0].text).toContain('\\frac{7}{12}');
      expect(ex4?.subItems?.[3].solution).toContain('30');
      expect(ex4?.subItems?.[4].solution).toContain('-\\frac{180}{7}');
      expect(ex4?.verifyNote).toBeUndefined();
      expect(ex4?.subItems?.every((s) => !s.verifyNote)).toBe(true);
    });

    it('Step 7 keeps the manual subtraction check', () => {
      const step7 = lesson02Data.steps[6];
      const hasSub = step7.blocks.some((b) =>
        b.subItems?.some((s) => (s.math || s.solution || '').includes('(-8.2) - (-4.5)')),
      );
      expect(hasSub).toBe(true);
    });

    it('Step 8 keeps the sign-corrected literal product 60x', () => {
      const step8 = lesson02Data.steps[7];
      const hasFix = step8.blocks.some((b) =>
        b.subItems?.some((s) => (s.solution || '').includes('-(-4 \\times 15x) = 60x')),
      );
      expect(hasFix).toBe(true);
    });

    it('Step 8 keeps Bassem\'s flawed calculation with the correct result 15/8', () => {
      const step8 = lesson02Data.steps[7];
      const basem = step8.blocks.find((b) => b.title.includes('باسم'));
      expect(basem?.mathFormula).toContain('\\frac{15}{2}');
      expect(basem?.subItems?.[0].solution).toContain('\\frac{15}{8}');
      expect(basem?.content).toContain('ما رأيك بهذا الحساب؟');
    });

    it('exposes verifyNote flags where the image was not fully legible', () => {
      const notes = flat().filter((b) => b.verifyNote).length;
      expect(notes).toBeGreaterThan(0);
    });
  });

  /* ------------------------------ Lesson flow ---------------------------- */
  describe('Lesson flow (one step at a time)', () => {
    it('renders only the current step and advances with Next', () => {
      window.location.hash = '#/unit/unit-1/lesson/lesson-2';
      render(<App />);
      expect(screen.getByText(/الخطوة 1 من 8/)).toBeInTheDocument();
      expect(screen.queryByText(/الخطوة 2 من 8/)).not.toBeInTheDocument();

      fireEvent.click(screen.getByLabelText('الخطوة التالية'));
      expect(screen.getByText(/الخطوة 2 من 8/)).toBeInTheDocument();
    });

    it('last step leads to the comprehensive assessment (not straight completion)', () => {
      window.location.hash = '#/unit/unit-1/lesson/lesson-2/8';
      render(<App />);
      expect(screen.getByText(/الخطوة 8 من 8/)).toBeInTheDocument();
      const goBtn = screen.getByLabelText('الانتقال إلى الاختبار الشامل');
      expect(goBtn).toBeInTheDocument();
      fireEvent.click(goBtn);
      expect(screen.getAllByText(/الاختبار الشامل/).length).toBeGreaterThanOrEqual(1);
    });

    it('does not leak teacher answer keys into the student lesson view', () => {
      window.location.hash = '#/unit/unit-1/lesson/lesson-2/8';
      render(<App />);
      expect(screen.queryByText(/مفاتيح الإجابة/)).not.toBeInTheDocument();
    });
  });

  /* --------------------------- Final assessment -------------------------- */
  describe('Final assessment', () => {
    it('exists with questions and a pass threshold', () => {
      expect(lesson02Data.finalAssessment).toBeDefined();
      expect(lesson02Data.finalAssessment!.questions.length).toBe(10);
      expect(lesson02Data.finalAssessment!.passThreshold).toBe(70);
    });

    it('every question links back to a valid lesson step and has an explanation', () => {
      lesson02Data.finalAssessment!.questions.forEach((q) => {
        expect(q.explanation.length).toBeGreaterThan(0);
        expect(q.relatedStepIndex).toBeGreaterThanOrEqual(0);
        expect(q.relatedStepIndex).toBeLessThan(lesson02Data.steps.length);
      });
    });

    it('normalizeAnswer tolerates spacing, unicode minus and parentheses', () => {
      expect(normalizeAnswer('  -3/5 ')).toBe(normalizeAnswer('−3 / 5'));
      expect(normalizeAnswer('(-15/2)')).toBe('-15/2');
      expect(normalizeAnswer('6x')).toBe(normalizeAnswer('6 × x'));
    });

    it('scores answers, shows the result and supports review navigation', () => {
      const onGoToStep = vi.fn();
      const { container } = render(
        <FinalAssessment
          assessment={lesson02Data.finalAssessment!}
          onExit={() => {}}
          onGoToStep={onGoToStep}
        />
      );
      // Answer the first (mcq) question correctly: choice 'a' = -3/5.
      const firstChoice = container.querySelectorAll('.aq-choice')[0] as HTMLElement;
      fireEvent.click(firstChoice);

      // Advance to the last question.
      for (let i = 0; i < 9; i++) {
        fireEvent.click(screen.getByText('التالي'));
      }
      fireEvent.click(screen.getByText(/إنهاء الاختبار/));

      // Results view with a score line and review section.
      expect(screen.getByText(/مراجعة الأسئلة/)).toBeInTheDocument();
      expect(screen.getByText('1 / 10')).toBeInTheDocument();

      // Clicking a review link navigates to the related lesson step.
      fireEvent.click(screen.getAllByText('مراجعة الشرح في الدرس')[0]);
      expect(onGoToStep).toHaveBeenCalled();
    });
  });

  /* ------------------------------ Teacher area --------------------------- */
  describe('Teacher area (password gate: somer173)', () => {
    it('shows the gate and rejects an incorrect password', () => {
      render(<TeacherArea onNavigateHome={() => {}} />);
      expect(screen.getByText('مساحة المدرّس')).toBeInTheDocument();
      fireEvent.change(screen.getByLabelText('كلمة المرور'), { target: { value: 'wrong' } });
      fireEvent.click(screen.getByText('دخول'));
      expect(screen.getByText(/كلمة المرور غير صحيحة/)).toBeInTheDocument();
      // The gated teacher content (objectives) must not be revealed.
      expect(screen.queryByText(/أهداف الدرس/)).not.toBeInTheDocument();
    });

    it('grants access with the correct password and reveals answer keys', () => {
      render(<TeacherArea onNavigateHome={() => {}} />);
      fireEvent.change(screen.getByLabelText('كلمة المرور'), { target: { value: 'somer173' } });
      fireEvent.click(screen.getByText('دخول'));
      expect(screen.getByText(/مفاتيح الإجابة/)).toBeInTheDocument();
      expect(screen.getByText(/أهداف الدرس/)).toBeInTheDocument();
      expect(screen.getByText(/الأخطاء الشائعة/)).toBeInTheDocument();
    });

    it('is reachable via the #/teacher route', () => {
      window.location.hash = '#/teacher';
      render(<App />);
      expect(screen.getAllByText('مساحة المدرّس').length).toBeGreaterThanOrEqual(1);
    });
  });

  /* --------------------------- Interactive demos ------------------------- */
  describe('Interactive components', () => {
    it('FractionMultiplyExplorer renders KaTeX output and readout chips', () => {
      const { container } = render(<FractionMultiplyExplorer />);
      expect(container.querySelector('.katex')).toBeInTheDocument();
      expect(screen.getByText(/البسط × البسط/)).toBeInTheDocument();
    });

    it('SignProductExplorer reveals sign based on count of negatives', () => {
      render(<SignProductExplorer initial={[-24, -33.3, -20, -3, 20.87, -5]} />);
      fireEvent.click(screen.getByText('اكشف الإشارة'));
      expect(screen.getByText(/عدد الأعداد السالبة/)).toBeInTheDocument();
      // 5 negatives (odd) -> negative product.
      expect(screen.getByText('سالبة')).toBeInTheDocument();
    });

    it('DistributiveExpander walks through distribute → simplify stages', () => {
      render(<DistributiveExpander />);
      fireEvent.click(screen.getByText(/وزّع العامل/));
      expect(screen.getByText(/ضرب كل حدٍّ داخل القوس/)).toBeInTheDocument();
    });

    it('PracticeCheck gives calm compact feedback after تحقق', () => {
      const { container } = render(
        <PracticeCheck
          questions={[
            { prompt: 'ما ناتج نشر $3 \\times (x + 2)$؟', choices: ['3x + 2', '3x + 6'], correctIndex: 1, explain: 'نوزّع.' },
          ]}
        />
      );
      const choices = container.querySelectorAll('.pc-choice');
      fireEvent.click(choices[1]);
      fireEvent.click(screen.getByText('تحقّق'));
      expect(screen.getByText('أحسنت')).toBeInTheDocument();
    });
  });

  /* --------------------------- Lesson 1 regression ----------------------- */
  describe('Lesson 1 regression', () => {
    it('Lesson 1 still has 6 steps and no forced assessment', () => {
      expect(lesson01Data.steps.length).toBe(6);
      expect(lesson01Data.finalAssessment).toBeUndefined();
    });

    it('Lesson 1 still completes directly on the last step', () => {
      window.location.hash = '#/unit/unit-1/lesson/lesson-1/6';
      render(<App />);
      const completeBtn = screen.getByLabelText('إتمام الدرس');
      fireEvent.click(completeBtn);
      expect(screen.getByText(/مبارك! أتممت بنجاح/)).toBeInTheDocument();
    });
  });
});
