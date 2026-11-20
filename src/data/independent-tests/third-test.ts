import type { IndependentTest } from './types';

/**
 * الاختبار الثالث — نقل حرفي لورقة «ورقة عمل — الوحدة الأولى: هندسة».
 *
 * نُقلت الأسئلة الخمسة، وخيارات السؤال الأول بترتيب a ثم b ثم c، وفراغات
 * السؤال الثاني، ورسوم الأسئلة الهندسية الثلاثة إلى SVG مخصص في مكوّن الرسوم
 * المعتمد. لم تُنقل الترويسة الإدارية أو اسم المدرّس أو رقم الهاتف أو الزخارف.
 */
export const thirdIndependentTest: IndependentTest = {
  id: 'independent-test-3',
  title: 'الاختبار الثالث',
  subtitle: 'ورقة عمل - الوحدة الأولى هندسة — الصف الثامن الأساسي',
  description: 'ورقة عمل في الهندسة للصف الثامن الأساسي.',
  sections: [
    {
      id: 'section-1',
      heading: 'الأسئلة',
      title: '',
      blocks: [
        {
          id: 'question-1',
          heading: 'السؤال الأول:',
          instruction: 'اختر الإجابة الصحيحة في كل مما يلي:',
          items: [
            {
              id: 'q1-1',
              number: '١',
              kind: 'choice',
              prompt:
                'ليكن $P$ محيط مثلث يساوي $24\\,\\text{cm}$، فتكون $P\\prime$ محيط صورة هذا المثلث وفق انسحاب:',
              choices: [
                { id: 'a', displayLabel: 'a)', label: '$24\\,\\text{cm}$' },
                { id: 'b', displayLabel: 'b)', label: '$12\\,\\text{cm}$' },
                { id: 'c', displayLabel: 'c)', label: '$48\\,\\text{cm}$' },
              ],
            },
            {
              id: 'q1-2',
              number: '٢',
              kind: 'choice',
              prompt: 'دائرة $(C)$ نصف قطرها $4\\,\\text{cm}$، فصورتها وفق أي انسحاب هي:',
              choices: [
                { id: 'a', displayLabel: 'a)', label: 'دائرة نصف قطرها $8\\,\\text{cm}$' },
                { id: 'b', displayLabel: 'b)', label: 'دائرة نصف قطرها $4\\,\\text{cm}$' },
                { id: 'c', displayLabel: 'c)', label: 'قطعة مستقيمة قطرها $4\\,\\text{cm}$' },
              ],
            },
            {
              id: 'q1-3',
              number: '٣',
              kind: 'choice',
              prompt:
                'إذا كان $[AC]$ و $[BD]$ قطرين متناصفين ومتعامدين في رباعي، كان الرباعي:',
              choices: [
                { id: 'a', displayLabel: 'a)', label: 'مستطيلاً' },
                { id: 'b', displayLabel: 'b)', label: 'معيناً' },
                { id: 'c', displayLabel: 'c)', label: 'شبه منحرف' },
              ],
            },
            {
              id: 'q1-4',
              number: '٤',
              kind: 'choice',
              prompt:
                'A و B نقطتان من المستوى، وصورتاهما وفق انسحاب $T$ هما $A\\prime$ و $B\\prime$ على الترتيب، إذا كان $AB = 5\\,\\text{cm}$ فإن طول $[A\\prime B\\prime]$ يساوي:',
              choices: [
                { id: 'a', displayLabel: 'a)', label: '$2.5\\,\\text{cm}$' },
                { id: 'b', displayLabel: 'b)', label: '$10\\,\\text{cm}$' },
                { id: 'c', displayLabel: 'c)', label: '$5\\,\\text{cm}$' },
              ],
            },
          ],
        },
        {
          id: 'question-2',
          heading: 'السؤال الثاني:',
          instruction: 'أكمل العبارات الآتية لتكون صحيحة:',
          items: [
            {
              id: 'q2-1',
              number: '١',
              kind: 'free',
              prompt: 'الانسحاب يحافظ على استقامة النقاط و ........................ و ........................ .',
            },
            {
              id: 'q2-2',
              number: '٢',
              kind: 'free',
              prompt:
                'من حالات تطابق مثلثين تساوي ........................ و ........................ المجاورتين له في المثلث الأول مع ........................ مقابلتها في المثلث الآخر.',
            },
            {
              id: 'q2-3',
              number: '٣',
              kind: 'free',
              prompt: 'إذا تعامد قطرا المستطيل كان ........................ .',
            },
            {
              id: 'q2-4',
              number: '٤',
              kind: 'free',
              prompt: 'صورة قطعة مستقيمة وفق انسحاب هي ........................ .',
            },
          ],
        },
        {
          id: 'question-3',
          heading: 'السؤال الثالث:',
          items: [
            {
              id: 'q3',
              kind: 'free',
              prompt:
                'ليكن $ABC$ مثلثاً متساوي الساقين رأسه الأساسي $A$ ($AB = AC$). نرسم من $B$ الارتفاع $[BH]$ المتعلق بالضلع $[AC]$، ونرسم من $C$ الارتفاع $[CK]$ المتعلق بالضلع $[AB]$،',
              figure: 'worksheet3-abc-altitudes',
              partsLabel: 'والمطلوب:',
              parts: [
                { id: 'q3-1', number: '١', prompt: 'أثبت أن المثلثين القائمين $BHC$ و $CKB$ طبوقان.' },
                { id: 'q3-2', number: '٢', prompt: 'استنتج أن: $BH = CK$.' },
              ],
            },
          ],
        },
        {
          id: 'question-4',
          heading: 'السؤال الرابع:',
          items: [
            {
              id: 'q4',
              kind: 'free',
              prompt:
                'ليكن $ABCD$ مستطيلاً قطراه $[AC]$ و $[BD]$ يتقاطعان في النقطة $O$،',
              figure: 'worksheet3-abcd-diagonals',
              partsLabel: 'والمطلوب:',
              parts: [
                { id: 'q4-1', number: '١', prompt: 'أثبت أن المثلثين $AOD$ و $BOC$ طبوقان.' },
                {
                  id: 'q4-2',
                  number: '٢',
                  prompt:
                    'أثبت أن المثلثين $ABC$ و $DCB$ طبوقان، واستنتج أن قطري المستطيل متساويان ($AC = BD$).',
                },
              ],
            },
          ],
        },
        {
          id: 'question-5',
          heading: 'السؤال الخامس:',
          items: [
            {
              id: 'q5',
              kind: 'free',
              prompt:
                'ليكن $ABC$ مثلثاً متساوي الأضلاع. نمدد الضلع $[AB]$ من جهة $B$ بمقدار $BD = AB$، ونمدد الضلع $[BC]$ من جهة $C$ بمقدار $CE = BC$،',
              figure: 'worksheet3-abce-extensions',
              partsLabel: 'والمطلوب:',
              parts: [
                { id: 'q5-1', number: '١', prompt: 'أثبت أن المثلثين $CBD$ و $ACE$ طبوقان.' },
                { id: 'q5-2', number: '٢', prompt: 'استنتج أن: $CD = AE$.' },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export default thirdIndependentTest;
