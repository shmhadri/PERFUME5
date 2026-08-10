import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { FAQS } from '../data/products';

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="faq-section" id="faq-section">
      <div className="section-header">
        <span className="hero-badge">
          <HelpCircle size={14} className="text-gold-primary" aria-hidden="true" />
          <span>الأسئلة الشائعة</span>
        </span>
        <h2 className="section-title">
          كل ما تود معرفته قبل <span className="text-gold-gradient">إتمام طلبك</span>
        </h2>
      </div>

      <div className="faq-list">
        {FAQS.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={faq.q} className={`faq-item ${isOpen ? 'open' : ''}`}>
              <h3>
                <button
                  type="button"
                  className="faq-question"
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${index}`}
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                >
                  <span>{faq.q}</span>
                  <ChevronDown size={18} className="faq-chevron" aria-hidden="true" />
                </button>
              </h3>
              <div id={`faq-panel-${index}`} className="faq-answer" hidden={!isOpen}>
                <p>{faq.a}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
