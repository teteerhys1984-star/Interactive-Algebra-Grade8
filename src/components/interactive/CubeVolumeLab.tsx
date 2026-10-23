import React, { useId, useState } from 'react';
import { Math as Formula } from '../math/Math';
import { MathText } from '../math/MathText';
import { fractionPower, fractionTex, intPow, normalise } from './powerMath';

const tex = String.raw;

/** A genuine extra use of powers: the length and VOLUME unit factors differ. */
const Cube: React.FC<{ center: number; size: number; scaled?: boolean }> = ({ center, size, scaled = false }) => {
  const bottom = 210;
  const point = (dx: number, dy: number) => `${center + dx * size},${bottom - dy * size}`;
  return (
    <g className={scaled ? 'cube-volume-shape scaled' : 'cube-volume-shape'}>
      <polygon className="cube-face-left" points={[point(0, 0), point(-0.75, 0.4), point(-0.75, 1.25), point(0, 0.85)].join(' ')} />
      <polygon className="cube-face-right" points={[point(0, 0), point(0.75, 0.4), point(0.75, 1.25), point(0, 0.85)].join(' ')} />
      <polygon className="cube-face-top" points={[point(0, 0.85), point(-0.75, 1.25), point(0, 1.65), point(0.75, 1.25)].join(' ')} />
    </g>
  );
};

export const CubeVolumeLab: React.FC = () => {
  const id = useId();
  // Count of half-decimetres: only integers enter the exact-fraction engine.
  const [halves, setHalves] = useState(3);
  const [factor, setFactor] = useState(1);
  const edgeDm = normalise(halves, 2);
  const edgeCm = halves * 5;
  const volumeDm = fractionPower(edgeDm, 3);
  const volumeCm = intPow(edgeCm, 3);
  const newEdgeCm = edgeCm * factor;
  const newVolumeCm = intPow(newEdgeCm, 3);
  const ratio = intPow(factor, 3);

  return (
    <section className="cube-volume-lab" dir="rtl" aria-label="مختبر حجم المكعب">
      <p>غيّر طول الحرف، ثم كبّره في الأبعاد الثلاثة. الرسم يقارن الأطوال، والحساب الدقيق يقارن الحجم؛ جميع القيم من تصميم تجربة المنصة.</p>
      <div className="cube-volume-controls">
        <label htmlFor={`${id}-edge`}>طول الحرف بالديسيمتر
          <input id={`${id}-edge`} type="range" dir="ltr" min={1} max={6} step={1} value={halves}
            aria-valuetext={`${halves / 2} ديسيمتر`}
            onChange={(event) => setHalves(Math.max(1, Math.min(6, Math.round(Number(event.target.value)))))} />
        </label>
        <output htmlFor={`${id}-edge`} dir="ltr"><Formula math={tex`${fractionTex(edgeDm)}\;\text{dm}`} /></output>
      </div>
      <fieldset className="cube-volume-scales">
        <legend>عامل تكبير الحرف في الأبعاد الثلاثة</legend>
        {[1, 2, 3].map((value) => (
          <label key={value}>
            <input type="radio" name={`${id}-scale`} value={value} checked={factor === value} onChange={() => setFactor(value)} />
            <span>{value === 1 ? 'الحجم الأصلي' : value === 2 ? 'الحرف مرتان' : 'الحرف ثلاث مرات'}</span>
          </label>
        ))}
      </fieldset>
      <div className="cube-volume-visual">
        <svg viewBox="0 0 400 240" role="img" aria-label={`مقارنة مكعب حرفه ${edgeCm} سنتيمترًا بمكعب حرفه ${newEdgeCm} سنتيمترًا`}>
          <title>المكعب الأصلي والمكعب بعد تكبير الحرف</title>
          <Cube center={290} size={edgeCm * 1.1} />
          <Cube center={110} size={newEdgeCm * 1.1} scaled />
        </svg>
        <div className="cube-volume-legend"><span>الأصلي</span><span>بعد التكبير</span></div>
      </div>
      <div className="cube-volume-equations" aria-live="polite">
        <h4>1. حوّل الطول ثم كعّبه</h4>
        <Formula math={tex`s=${fractionTex(edgeDm)}\times10=${edgeCm}\;\text{cm}`} display />
        <Formula math={tex`V=${edgeCm}^3=${volumeCm}\;\text{cm}^3`} display />
        <h4>2. تحقّق بحساب الحجم قبل التحويل</h4>
        <Formula math={tex`V=\left(${fractionTex(edgeDm)}\right)^3=${fractionTex(volumeDm)}\;\text{dm}^3`} display />
        <Formula math={tex`${fractionTex(volumeDm)}\times1000=${volumeCm}\;\text{cm}^3`} display />
        <p><MathText text={tex`لأن $1\;\text{dm}^3=(10\;\text{cm})^3=1000\;\text{cm}^3$؛ الطرق تعطي الحجم نفسه.`} /></p>
        <h4>3. ماذا فعل تكبير الحرف بالحجم؟</h4>
        <p>نرمز للحجم الأصلي بـ <Formula math="V_0" />، وللحجم الجديد بـ <Formula math="V_1" />.</p>
        <Formula math={tex`V_1=(${factor}\times${edgeCm})^3=${newEdgeCm}^3=${newVolumeCm}\;\text{cm}^3`} display />
        <Formula math={tex`\frac{V_1}{V_0}=${factor}^3=${ratio}`} display />
        <p className="cube-volume-result" role="status" data-testid="cube-volume-result"
          data-volume={volumeCm} data-scaled-volume={newVolumeCm} data-ratio={ratio}>
          <MathText text={tex`الحجم الأصلي $${volumeCm}\;\text{cm}^3$، والحجم الجديد $${newVolumeCm}\;\text{cm}^3$: ${ratio} مثل الحجم الأصلي.`} />
        </p>
      </div>
      <button type="button" className="reveal-btn power-lab-reset" onClick={() => { setHalves(3); setFactor(1); }}>
        إعادة تجربة الحجم إلى البداية
      </button>
    </section>
  );
};
export default CubeVolumeLab;
