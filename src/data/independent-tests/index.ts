import type { IndependentTest } from './types';
import { firstIndependentTest } from './first-test';
import { secondIndependentTest } from './second-test';

/**
 * سجل الاختبارات المستقلة المتاحة في منطقة «اختبارات مستقلة».
 *
 * القائمة في ملف مستقل حتى لا يعتمد أي اختبار على ملف الاختبار الآخر،
 * فإضافة اختبار ثالث لاحقًا تعني سطرًا واحدًا هنا فقط.
 */
export const independentTests: IndependentTest[] = [firstIndependentTest, secondIndependentTest];

export const findIndependentTest = (id: string): IndependentTest | undefined =>
  independentTests.find((test) => test.id === id);

export { firstIndependentTest, secondIndependentTest };

export default independentTests;
