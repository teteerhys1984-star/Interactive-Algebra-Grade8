import { describe, it, expect } from 'vitest';
import { lesson01Data } from '../data/unit1/lesson01';
import { warmupData } from '../data/unit1/warmup';

describe('Authoritative Source-Fidelity Audit', () => {
  describe('Lesson 1 (Pages 5, 6, 7)', () => {
    it('verifies Lesson 1 title is "الجمع والطرح"', () => {
      expect(lesson01Data.title).toBe('الجمع والطرح');
      expect(lesson01Data.number).toBe(1);
    });

    it('verifies Step 1 covers Page 5 Activity (باسم، هاشم، توحيد المقامات)', () => {
      const step1 = lesson01Data.steps[0];
      expect(step1.sourcePages).toContain(5);

      const blockTitles = step1.blocks.map((b) => b.title);
      expect(blockTitles).toContain('1. المقامات متساوية');
      expect(blockTitles).toContain('2. واحد من المقامات مضاعف لبقية المقامات');
      expect(blockTitles).toContain('3. كيفما كانت المقامات');

      // Check Bassem and Hashem methods
      const act1Block = step1.blocks.find((b) => b.title === '1. المقامات متساوية');
      expect(act1Block?.subItems?.some((s) => s.label === 'حل باسم')).toBe(true);
      expect(act1Block?.subItems?.some((s) => s.label === 'حل هاشم')).toBe(true);
      expect(act1Block?.subItems?.some((s) => s.label?.includes('اشرح الطريقة'))).toBe(true);
    });

    it('verifies Step 2 covers Page 5 Property 1 and Page 6 Examples', () => {
      const step2 = lesson01Data.steps[1];
      expect(step2.blocks.some((b) => b.title === 'تعلم — خاصة 1')).toBe(true);
      expect(step2.blocks.some((b) => b.title === 'مثال 1 (خاصة 1)')).toBe(true);
      expect(step2.blocks.some((b) => b.title === 'مثال 2 (خاصة 1)')).toBe(true);
    });

    it('verifies Step 3 covers Page 6 Property 2 and all 3 Examples', () => {
      const step3 = lesson01Data.steps[2];
      expect(step3.blocks.some((b) => b.title === 'خاصة 2')).toBe(true);
      expect(step3.blocks.some((b) => b.title === 'مثال 1 (خاصة 2)')).toBe(true);
      expect(step3.blocks.some((b) => b.title === 'مثال 2 (خاصة 2)')).toBe(true);
      expect(step3.blocks.some((b) => b.title === 'مثال 3 (خاصة 2)')).toBe(true);
    });

    it('verifies Step 4 covers Knowledge Acquisition (سلسلة العمليات ومثال A)', () => {
      const step4 = lesson01Data.steps[3];
      expect(step4.blocks.some((b) => b.title === 'اكتساب معارف')).toBe(true);
      expect(step4.blocks.some((b) => b.title?.includes('مثال اكتساب معارف'))).toBe(true);

      const exBlock = step4.blocks.find((b) => b.title?.includes('مثال اكتساب معارف'));
      expect(exBlock?.subItems?.some((s) => s.label === 'مضاعفات العدد 6')).toBe(true);
      expect(exBlock?.subItems?.some((s) => s.label === 'مضاعفات العدد 8')).toBe(true);
      expect(exBlock?.subItems?.some((s) => s.label === 'المقام المشترك الأصغر')).toBe(true);
    });

    it('verifies Step 5 covers Page 7 "تحقق من فهمك" (Exercises 1, 2, 3)', () => {
      const step5 = lesson01Data.steps[4];
      expect(step5.sourcePages).toContain(7);
      expect(step5.blocks.some((b) => b.title?.includes('1. انسخ وأكمل'))).toBe(true);
      expect(step5.blocks.some((b) => b.title?.includes('2. احسب الناتج'))).toBe(true);
      expect(step5.blocks.some((b) => b.title?.includes('3. كتابة طلائع المضاعفات'))).toBe(true);

      // Verify Exercise 2 has all 6 sub-items
      const ex2 = step5.blocks.find((b) => b.title?.includes('2. احسب الناتج'));
      expect(ex2?.subItems?.length).toBe(6);
    });

    it('verifies Step 6 covers Page 7 "تدرب" (Exercises 1, 2, 3, 4)', () => {
      const step6 = lesson01Data.steps[5];
      expect(step6.sourcePages).toContain(7);
      expect(step6.blocks.some((b) => b.title?.includes('1. انسخ وأكمل'))).toBe(true);
      expect(step6.blocks.some((b) => b.title?.includes('2. احسب بصيغة كسر عادي'))).toBe(true);
      expect(step6.blocks.some((b) => b.title?.includes('3. احسب بصيغة كسر، ثمّ اختصر'))).toBe(true);
      expect(step6.blocks.some((b) => b.title?.includes('4. مسألة تطبيقية: خلط العصير'))).toBe(true);

      // Verify Exercise 3 has all 7 sub-items
      const ex3 = step6.blocks.find((b) => b.title?.includes('3. احسب بصيغة كسر'));
      expect(ex3?.subItems?.length).toBe(7);
    });
  });

  describe('Active Launchpad (Pages 3 & 4)', () => {
    it('verifies Launchpad covers all 12 exercises from Pages 3-4', () => {
      const allBlocks = warmupData.steps.flatMap((s) => s.blocks);
      const exNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

      exNumbers.forEach((num) => {
        const found = allBlocks.some((b) => b.sourceRef.item?.startsWith(`${num}`) || b.title?.startsWith(`${num}.`));
        expect(found).toBe(true);
      });
    });

    it('verifies Archimedes history math problem (Exercise 12) is included', () => {
      const allBlocks = warmupData.steps.flatMap((s) => s.blocks);
      const archimedes = allBlocks.find((b) => b.title?.includes('أرخميدس'));
      expect(archimedes).toBeDefined();
      expect(archimedes?.content).toContain('287');
      expect(archimedes?.content).toContain('75');
    });
  });
});
