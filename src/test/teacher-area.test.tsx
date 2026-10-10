import { beforeEach, describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { TeacherArea } from '../components/teacher/TeacherArea';

const SECTION_PROGRESS = 'lesson4-teacher-section-progress';

const unlockTeacherArea = () => {
  render(<TeacherArea onNavigateHome={() => {}} />);
  fireEvent.change(screen.getByLabelText('كلمة المرور'), { target: { value: 'somer173' } });
  fireEvent.click(screen.getByRole('button', { name: 'دخول' }));
};

const openLesson4 = () => {
  unlockTeacherArea();
  fireEvent.click(screen.getByRole('button', { name: /الدرس 4:/ }));
};

const selectLesson4Section = (section: number) => {
  fireEvent.click(screen.getByRole('button', { name: new RegExp(`القسم ${section}:`) }));
};

const displayedKeyRefs = () =>
  Array.from(document.querySelectorAll('.ta-key-ref')).map((ref) => ref.textContent);

describe('Lesson 4 Teacher Area sections', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('starts Lesson 4 on the teacher overview', () => {
    openLesson4();

    expect(screen.getByTestId(SECTION_PROGRESS)).toHaveTextContent('1 / 8');
    expect(screen.getByRole('heading', { name: 'تمارين الوحدة الأولى' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'أهداف الدرس' })).toBeInTheDocument();
    expect(screen.queryByText('Q1', { exact: true })).not.toBeInTheDocument();
  });

  it.each([
    [2, 1, 10],
    [3, 11, 20],
    [4, 21, 30],
    [5, 31, 40],
    [6, 41, 47],
  ])('shows only the intended detailed-solution range in section %i', (section, from, to) => {
    openLesson4();
    selectLesson4Section(section);

    expect(screen.getByTestId(SECTION_PROGRESS)).toHaveTextContent(`${section} / 8`);
    expect(displayedKeyRefs()).toEqual(
      Array.from({ length: to - from + 1 }, (_, index) => `Q${from + index}`),
    );
  });

  it('makes the Final Test key separately reachable', () => {
    openLesson4();
    selectLesson4Section(7);

    expect(screen.getByTestId(SECTION_PROGRESS)).toHaveTextContent('7 / 8');
    expect(screen.getAllByText('مفتاح الاختبار الختامي').length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText('f1', { exact: true })).toBeInTheDocument();
    expect(screen.queryByText('Q1', { exact: true })).not.toBeInTheDocument();
  });

  it('makes all teaching guidance separately reachable', () => {
    openLesson4();
    selectLesson4Section(8);

    expect(screen.getByTestId(SECTION_PROGRESS)).toHaveTextContent('8 / 8');
    expect(screen.getByRole('heading', { name: 'الأخطاء الشائعة وتصويبها' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'اقتراحات المعالجة' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'ملاحظات تدريسية' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'إرشادات التقويم' })).toBeInTheDocument();
    expect(screen.queryByText('Q1', { exact: true })).not.toBeInTheDocument();
  });

  it('navigates with Previous and Next without moving outside sections 1–8', () => {
    openLesson4();

    const previous = screen.getByRole('button', { name: 'القسم السابق' });
    const next = screen.getByRole('button', { name: 'القسم التالي' });
    expect(previous).toBeDisabled();
    expect(next).not.toBeDisabled();

    fireEvent.click(next);
    expect(screen.getByTestId(SECTION_PROGRESS)).toHaveTextContent('2 / 8');
    expect(screen.getByText('Q1', { exact: true })).toBeInTheDocument();

    fireEvent.click(previous);
    expect(screen.getByTestId(SECTION_PROGRESS)).toHaveTextContent('1 / 8');

    selectLesson4Section(8);
    expect(screen.getByTestId(SECTION_PROGRESS)).toHaveTextContent('8 / 8');
    expect(screen.getByRole('button', { name: 'القسم التالي' })).toBeDisabled();

    fireEvent.click(screen.getByRole('button', { name: 'القسم التالي' }));
    expect(screen.getByTestId(SECTION_PROGRESS)).toHaveTextContent('8 / 8');
  });

  it('resets Lesson 4 to the overview when switching back to it', () => {
    openLesson4();
    selectLesson4Section(5);
    expect(screen.getByTestId(SECTION_PROGRESS)).toHaveTextContent('5 / 8');

    fireEvent.click(screen.getByRole('button', { name: /الدرس 2: الضرب/ }));
    fireEvent.click(screen.getByRole('button', { name: /الدرس 4:/ }));

    expect(screen.getByTestId(SECTION_PROGRESS)).toHaveTextContent('1 / 8');
    expect(screen.getByRole('heading', { name: 'أهداف الدرس' })).toBeInTheDocument();
  });

  it('keeps Lessons 2 and 3 in their unchanged, single-page Teacher Area view', () => {
    unlockTeacherArea();

    expect(screen.getByRole('heading', { name: 'أهداف الدرس' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'مفاتيح الإجابة (الكتاب + الاختبار)' })).toBeInTheDocument();
    expect(screen.queryByTestId(SECTION_PROGRESS)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /الدرس 3:/ }));

    expect(screen.getByRole('heading', { name: 'أهداف الدرس' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'مفاتيح الإجابة (الكتاب + الاختبار)' })).toBeInTheDocument();
    expect(screen.queryByTestId(SECTION_PROGRESS)).not.toBeInTheDocument();
  });
});
