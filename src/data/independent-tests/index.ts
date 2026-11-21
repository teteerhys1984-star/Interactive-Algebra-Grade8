import type { IndependentTest } from './types';
import { firstIndependentTest } from './first-test';
import { secondIndependentTest } from './second-test';
import { thirdIndependentTest } from './third-test';
import { fourthIndependentTest } from './fourth-test';

/**
 * سجل الاختبارات المستقلة المتاحة في منطقة «اختبارات مستقلة».
 *
 * القائمة في ملف مستقل حتى لا يعتمد أي اختبار على ملف الاختبار الآخر،
 * فإضافة اختبار لاحقًا تعني سطرًا واحدًا هنا فقط.
 */
export const independentTests: IndependentTest[] = [
  firstIndependentTest,
  secondIndependentTest,
  thirdIndependentTest,
  fourthIndependentTest,
];

export const findIndependentTest = (id: string): IndependentTest | undefined =>
  independentTests.find((test) => test.id === id);

export { firstIndependentTest, secondIndependentTest, thirdIndependentTest, fourthIndependentTest };

export default independentTests;
