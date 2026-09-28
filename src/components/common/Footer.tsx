import React from 'react';
import { Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="app-footer">
      <div className="footer-inner">
        <div className="footer-instructor">
          المهندس سومر شاهين: 0930215022
        </div>
        <p className="footer-copy">
          منصة الجبر التفاعلية — الصف الثامن • المنهاج المدرسي السوري
        </p>
        <a className="footer-teacher-link" href="#/teacher" title="مساحة المدرّس (تتطلب كلمة مرور)">
          <Lock size={13} />
          <span>مساحة المدرّس</span>
        </a>
      </div>
    </footer>
  );
};

export default Footer;
