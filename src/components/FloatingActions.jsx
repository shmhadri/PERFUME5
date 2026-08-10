import { useEffect, useState } from 'react';
import { ArrowUp, MessageCircle } from 'lucide-react';
import { whatsAppInquiryUrl } from '../lib/utils';

export default function FloatingActions() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="floating-actions">
      <a
        className="floating-btn floating-whatsapp"
        href={whatsAppInquiryUrl()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="تواصل معنا عبر واتساب"
      >
        <MessageCircle size={22} />
      </a>

      {showTop && (
        <button
          type="button"
          className="floating-btn floating-top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="العودة إلى أعلى الصفحة"
        >
          <ArrowUp size={20} />
        </button>
      )}
    </div>
  );
}
