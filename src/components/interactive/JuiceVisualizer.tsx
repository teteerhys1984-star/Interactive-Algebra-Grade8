import React, { useState } from 'react';
import { Math } from '../math/Math';
import { Beaker, Plus, Check } from 'lucide-react';

export const JuiceVisualizer: React.FC = () => {
  const [addedBanana, setAddedBanana] = useState<boolean>(false);

  // Total beaker capacity = 2 Liters (10/5 L)
  // Apple = 3/5 L (0.6 L = 30%)
  // Grape = 6/5 L (1.2 L = 60%)
  // Banana = 1/5 L (0.2 L = 10%)

  const applePct = 30;
  const grapePct = 60;
  const bananaPct = addedBanana ? 10 : 0;

  return (
    <div className="juice-visualizer">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
        <Beaker size={24} style={{ color: 'var(--color-amber-600)' }} />
        <h3 style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--color-slate-900)' }}>
          محاكي خلط العصير التفاعلي
        </h3>
      </div>

      <p style={{ fontSize: '0.95rem', color: 'var(--color-slate-700)', marginBottom: '1rem' }}>
        خلطت زينة <Math math="\frac{3}{5}" /> اللتر عصير تفاح مع <Math math="\frac{6}{5}" /> اللتر عصير عنب لملء وعاء سعته <Math math="2" /> لتران.
      </p>

      <div className="beaker-container">
        {/* Beaker Diagram */}
        <div className="beaker">
          <div className="beaker-markings">
            <span className="beaker-mark">2 لتر (سعة الوعاء)</span>
            <span className="beaker-mark">1.5 لتر</span>
            <span className="beaker-mark">1 لتر</span>
            <span className="beaker-mark">0.5 لتر</span>
          </div>

          <div className="juice-layer juice-apple" style={{ height: `${applePct}%` }}>
            عصير التفاح (3/5)
          </div>
          <div className="juice-layer juice-grape" style={{ height: `${grapePct}%` }}>
            عصير العنب (6/5)
          </div>
          {addedBanana && (
            <div className="juice-layer juice-banana" style={{ height: `${bananaPct}%` }}>
              عصير الموز (1/5)
            </div>
          )}
        </div>

        {/* Breakdown Panel */}
        <div style={{ flex: 1, minWidth: '260px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ padding: '0.75rem', background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontWeight: 700, color: '#ef4444' }}>🍎 عصير التفاح:</span>{' '}
              <Math math="\frac{3}{5}" /> لتر = <Math math="0.6" /> لتر
            </div>

            <div style={{ padding: '0.75rem', background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontWeight: 700, color: '#8b5cf6' }}>🍇 عصير العنب:</span>{' '}
              <Math math="\frac{6}{5}" /> لتر = <Math math="1.2" /> لتر
            </div>

            <div style={{ padding: '0.75rem', background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontWeight: 700, color: '#0f766e' }}>📊 المجموع الحالي:</span>{' '}
              <Math math="\frac{3}{5} + \frac{6}{5} = \frac{9}{5} = 1.8" /> لتر
            </div>

            <div style={{ padding: '0.75rem', background: '#fffbeb', borderRadius: '8px', border: '1px solid #fde68a' }}>
              <span style={{ fontWeight: 700, color: '#d97706' }}>🍌 الكمية المتبقية لملء الوعاء:</span>{' '}
              <Math math="2 - \frac{9}{5} = \frac{10}{5} - \frac{9}{5} = \frac{1}{5}" /> لتر
            </div>

            <button
              className="reveal-btn"
              style={{
                backgroundColor: addedBanana ? 'var(--color-emerald-600)' : 'var(--color-amber-500)',
                color: '#fff',
                justifyContent: 'center',
                padding: '0.75rem 1rem',
              }}
              onClick={() => setAddedBanana(!addedBanana)}
            >
              {addedBanana ? (
                <>
                  <Check size={18} />
                  <span>تمت إضافة عصير الموز (الوعاء ممتلئ تماماً!)</span>
                </>
              ) : (
                <>
                  <Plus size={18} />
                  <span>أضف $\frac{1}{5}$ لتر عصير موز لملء الوعاء</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JuiceVisualizer;
