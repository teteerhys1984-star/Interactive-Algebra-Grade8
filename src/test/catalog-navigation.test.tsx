import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../app/App';
import { UnitOverview } from '../app/UnitOverview';
import { curriculum, type UnitData } from '../data/curriculum';
import type { LessonData } from '../data/unit1/lesson01';
import { getUnitAccent } from '../components/catalog/catalogAccents';

/**
 * Catalog & navigation regression suite.
 *
 * Every assertion is derived from the live curriculum registry (never a
 * hardcoded unit/lesson count), so the suite keeps passing when new
 * units or lessons are registered through the normal workflow.
 */

const allLessons = () => curriculum.flatMap((u) => u.lessons.map((l) => ({ unit: u, lesson: l })));

describe('platform catalog navigation (home → unit → lesson)', () => {
  beforeEach(() => {
    window.location.hash = '';
    window.sessionStorage.clear();
  });

  it('home renders the platform hero with the exact platform title (RTL)', () => {
    const { container } = render(<App />);
    const heroTitle = screen.getByRole('heading', { level: 1, name: 'الجبر التفاعلي — الصف الثامن' });
    expect(heroTitle).toBeInTheDocument();
    expect(container.querySelector('.catalog-view')).toHaveAttribute('dir', 'rtl');
  });

  it('home shows one card per registered unit, in registry order, with exact titles and entry actions', () => {
    render(<App />);

    const unitLinks = screen.getAllByRole('link', { name: /دخول إلى الوحدة/ });
    expect(unitLinks).toHaveLength(curriculum.length);

    curriculum.forEach((unit, index) => {
      const link = unitLinks[index];
      expect(link).toHaveAttribute('href', `#/unit/${unit.id}`);
      const card = link.closest('article');
      expect(card).not.toBeNull();
      expect(card!.querySelector('.unit-card-title')?.textContent).toBe(unit.title);
      expect(card!.querySelector('.unit-emblem-num')?.textContent).toBe(String(unit.number));
    });
  });

  it('home shows no lesson cards, no lesson links, and no lesson CTAs', () => {
    const { container } = render(<App />);

    expect(container.querySelector('.lesson-card')).toBeNull();
    expect(container.querySelector('.test-card')).toBeNull();
    expect(screen.queryByRole('link', { name: /ابدأ الدرس/ })).toBeNull();
    expect(screen.queryByRole('link', { name: /ابدأ الانطلاقة/ })).toBeNull();

    const allHrefs = Array.from(container.querySelectorAll('.catalog-view a')).map((a) => a.getAttribute('href'));
    expect(allHrefs.every((href) => href == null || !href.includes('/lesson/') && !href.includes('/warmup'))).toBe(true);

    // No registered lesson title may appear as a standalone title on the home page.
    allLessons().forEach(({ lesson }) => {
      expect(screen.queryByText(lesson.title, { selector: '.lesson-card-title, .unit-card-title' })).toBeNull();
    });
  });

  it('unit card click navigates to the unit landing page', async () => {
    const user = userEvent.setup();
    render(<App />);

    const firstUnit = curriculum[0];
    const unitLinks = screen.getAllByRole('link', { name: /دخول إلى الوحدة/ });
    await user.click(unitLinks[0]);

    await waitFor(() => expect(window.location.hash).toBe(`#/unit/${firstUnit.id}`));
    await waitFor(() =>
      expect(screen.getByRole('heading', { level: 1, name: firstUnit.title })).toBeInTheDocument()
    );
  });

  it('every unit page shows only its own registered lessons, in registry order, with working entry actions', () => {
    for (const unit of curriculum) {
      window.location.hash = `#/unit/${unit.id}`;
      const { container, unmount } = render(<App />);

      // Header shows the exact registered unit number + title.
      expect(screen.getByRole('heading', { level: 1, name: unit.title })).toBeInTheDocument();
      expect(container.querySelector('.unit-hero-emblem .unit-emblem-num')?.textContent).toBe(String(unit.number));

      // Back-to-catalog affordances exist and point at the catalog.
      expect(screen.getByRole('link', { name: /العودة إلى الوحدات/ })).toHaveAttribute('href', '#/');
      const breadcrumb = screen.getByRole('navigation', { name: 'مسار التنقل' });
      expect(breadcrumb.querySelector('a')).toHaveAttribute('href', '#/');

      // Lesson links match this unit's registry exactly (order, title, route).
      const lessonLinks = screen.getAllByRole('link', { name: /ابدأ الدرس/ });
      expect(lessonLinks).toHaveLength(unit.lessons.length);
      unit.lessons.forEach((lesson, index) => {
        expect(lessonLinks[index]).toHaveAttribute('href', `#/unit/${unit.id}/lesson/${lesson.id}`);
        const card = lessonLinks[index].closest('article');
        expect(card!.querySelector('.lesson-card-title')?.textContent).toBe(lesson.title);
        expect(card!.querySelector('.lesson-num-badge')?.textContent).toContain(`الدرس ${lesson.number}`);
      });

      // The unit's launchpad (warmup) keeps its existing route.
      expect(screen.getByRole('link', { name: /ابدأ الانطلاقة النشطة/ }))
        .toHaveAttribute('href', `#/unit/${unit.id}/warmup`);

      // No lesson from any OTHER unit may leak onto this page.
      curriculum
        .filter((other) => other.id !== unit.id)
        .flatMap((other) => other.lessons)
        .forEach((foreign) => {
          expect(screen.queryByText(foreign.title, { selector: '.lesson-card-title' })).toBeNull();
        });
      expect(container.querySelectorAll('.lesson-card')).toHaveLength(unit.lessons.length + 1 /* warmup */);

      unmount();
    }
  });

  it('lesson card click opens the existing lesson experience', async () => {
    const user = userEvent.setup();
    const unit = curriculum[0];
    const lesson = unit.lessons[0];
    window.location.hash = `#/unit/${unit.id}`;
    render(<App />);

    const lessonLinks = screen.getAllByRole('link', { name: /ابدأ الدرس/ });
    await user.click(lessonLinks[0]);

    await waitFor(() =>
      expect(window.location.hash).toBe(`#/unit/${unit.id}/lesson/${lesson.id}`)
    );
    await waitFor(() =>
      expect(screen.getByText(new RegExp(`الخطوة 1 من ${lesson.steps.length}`))).toBeInTheDocument()
    );
  });

  it('a unit with no registered lessons gets a deliberate empty state (never fabricated cards)', () => {
    const emptyWarmup: LessonData = {
      id: 'warmup',
      number: 0,
      unitId: 'unit-empty',
      unitTitle: 'وحدة تجريبية فارغة',
      title: 'انطلاقة نشطة',
      description: 'وصف تشخيصي تجريبي.',
      sourcePages: [1],
      steps: [],
    };
    const emptyUnit: UnitData = {
      id: 'unit-empty',
      number: 99,
      title: 'وحدة تجريبية فارغة',
      description: 'وحدة بلا دروس مسجلة.',
      sourcePages: [1],
      warmup: emptyWarmup,
      lessons: [],
    };

    const { container } = render(<UnitOverview unit={emptyUnit} />);
    expect(screen.getByText('دروس هذه الوحدة قيد الإعداد')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /ابدأ الدرس/ })).toBeNull();
    // No fabricated lesson cards: only the real registered launchpad renders.
    expect(container.querySelectorAll('.lesson-card')).toHaveLength(1);
    expect(container.querySelector('.lesson-card.is-warmup')).not.toBeNull();
  });

  it('accents cycle for any unit count (no hardcoded unit total)', () => {
    const first = getUnitAccent(1);
    const second = getUnitAccent(2);
    expect(second.main).not.toBe(first.main);
    // Cycles safely far beyond the current curriculum size.
    expect(getUnitAccent(5).main).toBe(first.main);
    expect(getUnitAccent(99).main).toBeDefined();
  });

  it('unknown unit / lesson routes render a deliberate not-available state instead of a blank page', () => {
    window.location.hash = '#/unit/unit-does-not-exist';
    const { unmount } = render(<App />);
    expect(screen.getByText('هذا المحتوى غير متاح')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /العودة إلى الوحدات/ })).toBeInTheDocument();
    unmount();

    window.location.hash = '#/unit/unit-1/lesson/lesson-does-not-exist';
    render(<App />);
    expect(screen.getByText('هذا المحتوى غير متاح')).toBeInTheDocument();
  });

  it('legacy lesson routes and student areas keep resolving after the redesign', () => {
    // Direct deep links to existing lessons must keep working.
    const { lesson } = { lesson: allLessons()[0] };
    window.location.hash = `#/unit/${lesson.unit.id}/lesson/${lesson.lesson.id}/1`;
    const { unmount } = render(<App />);
    expect(
      screen.getByText(new RegExp(`الخطوة 1 من ${lesson.lesson.steps.length}`))
    ).toBeInTheDocument();
    unmount();

    // Teacher gate entry, test area, and solutions area routes remain intact.
    window.location.hash = '#/teacher';
    const second = render(<App />);
    expect(screen.getByLabelText('كلمة المرور')).toBeInTheDocument();
    second.unmount();

    window.location.hash = '#/tests';
    const third = render(<App />);
    expect(screen.getByRole('heading', { name: 'الاختبارات' })).toBeInTheDocument();
    third.unmount();
  });
});
