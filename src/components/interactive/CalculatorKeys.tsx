import React from 'react';
import { Calculator, BookOpen, Wand2 } from 'lucide-react';

/**
 * لوحة مفاتيح الآلة الحاسبة — الدرس 3 (الصفحتان 12 و 15).
 *
 * فصلٌ صارم بين ما هو **مطبوع في الكتاب** وما هو **إعادة بناء من المنصة**:
 *  - printedKeys: المفاتيح كما تظهر في صورة الكتاب وبترتيب ظهورها البصري نفسه،
 *    ويحمل الصف وسم «مطبوع في الكتاب».
 *  - keys: ترتيب الضغط الفعلي، ويحمل الصف وسم «إعادة بناء من المنصة» عند رفع
 *    الراية reconstructed، فلا يُنسب إلى الكتاب ترتيبٌ لم يطبعه.
 *  - screen: ما يظهر على الشاشة، مع screenSource لتحديد مصدره.
 */

export interface CalculatorKeysProps {
  /** المفاتيح كما طُبعت في صورة الكتاب (بترتيب ظهورها البصري من اليسار إلى اليمين). */
  printedKeys?: string[];
  /** ترتيب الضغط الفعلي على الآلة. */
  keys?: string[];
  /** هل صف ترتيب الضغط إعادة بناء من المنصة؟ */
  reconstructed?: boolean;
  /** ما يظهر على شاشة الآلة. */
  screen?: string;
  /** مصدر ما يظهر على الشاشة. */
  screenSource?: 'book' | 'platform';
  /** تعليق أعلى اللوحة. */
  caption?: string;
  /** ملاحظة أسفل اللوحة. */
  note?: string;
}

const KeyRow: React.FC<{ items: string[] }> = ({ items }) => (
  <div className="ck-keys" dir="ltr">
    {items.map((k, i) => (
      <span key={i} className={`ck-key ${/^[0-9.]+$/.test(k) ? 'ck-key-num' : 'ck-key-op'}`}>
        {k}
      </span>
    ))}
  </div>
);

export const CalculatorKeys: React.FC<CalculatorKeysProps> = ({
  printedKeys,
  keys,
  reconstructed = false,
  screen,
  screenSource = 'book',
  caption,
  note,
}) => (
  <div className="interactive-card ck-panel">
    <div className="ck-head">
      <Calculator size={18} />
      <span>{caption ?? 'على الآلة الحاسبة'}</span>
    </div>

    {printedKeys && printedKeys.length > 0 && (
      <div className="ck-row">
        <span className="ck-row-tag ck-tag-book">
          <BookOpen size={13} />
          <span>مطبوع في الكتاب</span>
        </span>
        <KeyRow items={printedKeys} />
        <span className="ck-row-hint">ترتيب الظهور في الصورة كما هو، دون إعادة ترتيب.</span>
      </div>
    )}

    {keys && keys.length > 0 && (
      <div className="ck-row">
        <span className={`ck-row-tag ${reconstructed ? 'ck-tag-platform' : 'ck-tag-book'}`}>
          {reconstructed ? <Wand2 size={13} /> : <BookOpen size={13} />}
          <span>{reconstructed ? 'إعادة بناء من المنصة' : 'مطبوع في الكتاب'}</span>
        </span>
        <KeyRow items={keys} />
        <span className="ck-row-hint">ترتيب الضغط الفعلي على الآلة (من اليسار إلى اليمين).</span>
      </div>
    )}

    {screen && (
      <div className="ck-screen-wrap">
        <span className="ck-screen-label">الشاشة</span>
        <span className="ck-screen" dir="ltr">
          {screen}
        </span>
        <span className={`ck-row-tag ${screenSource === 'book' ? 'ck-tag-book' : 'ck-tag-platform'}`}>
          {screenSource === 'book' ? <BookOpen size={13} /> : <Wand2 size={13} />}
          <span>{screenSource === 'book' ? 'مطبوع في الكتاب' : 'إعادة بناء من المنصة'}</span>
        </span>
      </div>
    )}

    {note && <p className="ck-note">{note}</p>}
  </div>
);

export default CalculatorKeys;
