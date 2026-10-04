import React from 'react';
import { BookOpen, ClipboardCheck, GraduationCap } from 'lucide-react';

interface HeaderProps {
  onNavigateHome?: () => void;
  onNavigateUnit?: () => void;
  onNavigateTests?: () => void;
  unitTitle?: string;
  lessonTitle?: string;
  onToggleDrawer?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onNavigateHome,
  onNavigateUnit,
  onNavigateTests,
  unitTitle,
  lessonTitle,
  onToggleDrawer,
}) => {
  return (
    <header className="app-header">
      <div className="header-inner">
        <div className="brand-section">
          <a
            href="#/"
            className="brand-link"
            onClick={(e) => {
              if (onNavigateHome) {
                e.preventDefault();
                onNavigateHome();
              }
            }}
          >
            <div className="brand-logo-icon">
              <span>٨</span>
            </div>
          </a>
          <div className="brand-text">
            <h1>منصة الجبر التفاعلية — الصف الثامن</h1>
            <p>المنهاج المدرسي السوري للرياضيات</p>
          </div>
        </div>

        <div className="header-nav-actions">
          {onToggleDrawer && (
            <button
              className="mobile-drawer-toggle"
              onClick={onToggleDrawer}
              aria-label="فتح قائمة الدرس"
            >
              <BookOpen size={18} />
              <span>فهرس الخطوات</span>
            </button>
          )}

          {onNavigateTests && (
            <button
              type="button"
              className="nav-btn header-test-nav"
              onClick={onNavigateTests}
              aria-label="فتح مساحة الاختبارات"
            >
              <ClipboardCheck size={17} aria-hidden="true" />
              <span>الاختبارات</span>
            </button>
          )}

          {unitTitle && (
            <button
              className="nav-btn"
              onClick={onNavigateUnit}
              title="العودة إلى الوحدة"
            >
              <span>{unitTitle}</span>
              {lessonTitle && <span>/ {lessonTitle}</span>}
            </button>
          )}

          <div className="header-instructor-badge">
            <GraduationCap size={18} className="icon" />
            <span>المهندس سومر شاهين: 0930215022</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
