import { Award, Phone, MapPin, Truck, MessageCircle } from 'lucide-react';
import { WHATSAPP_DISPLAY } from '../data/products';
import { whatsAppInquiryUrl } from '../lib/utils';

const PAYMENTS = ['تحويل بنكي', 'STC Pay', 'الدفع عند الاستلام'];

export default function Footer({ onSelectCategory, onNavigate }) {
  const quickLinks = [
    { label: 'الرئيسية', action: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
    { label: 'بوكسات الإهداء', action: () => { onSelectCategory('boxes'); onNavigate('products-section'); } },
    { label: 'العطور النسائية', action: () => { onSelectCategory('women'); onNavigate('products-section'); } },
    { label: 'العطور الرجالية', action: () => { onSelectCategory('men'); onNavigate('products-section'); } },
    { label: 'الأسئلة الشائعة', action: () => onNavigate('faq-section') }
  ];

  return (
    <footer className="site-footer">
      <div className="footer-inner">

        <div className="footer-grid">

          {/* Brand Info */}
          <div>
            <div className="logo-brand footer-brand">
              <span className="logo-icon">
                <Award size={22} aria-hidden="true" />
              </span>
              <span>
                <span className="logo-text text-gold-gradient">تولاتي</span>
                <span className="logo-sub">TOLATY PERFUME BOXES</span>
              </span>
            </div>

            <p className="footer-about">
              متجر سعودي متخصص في بوكسات وأطقم العطور الجاهزة للإهداء. تولات عطرية مركّزة للرجال
              والنساء بتغليف أنيق، والطلب يتم مباشرة عبر الواتساب خلال دقائق.
            </p>

            <div className="footer-social">
              <a
                href={whatsAppInquiryUrl()}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="واتساب"
              >
                <MessageCircle size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="footer-heading">روابط سريعة</h3>
            <ul className="footer-links">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <button type="button" onClick={link.action}>
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Support & Contact */}
          <div>
            <h3 className="footer-heading">التواصل والطلب</h3>
            <ul className="footer-contact">
              <li>
                <Phone size={16} className="text-gold-primary" aria-hidden="true" />
                <a href={whatsAppInquiryUrl()} target="_blank" rel="noopener noreferrer">
                  واتساب: {WHATSAPP_DISPLAY}
                </a>
              </li>
              <li>
                <MapPin size={16} className="text-gold-primary" aria-hidden="true" />
                <span>المملكة العربية السعودية</span>
              </li>
              <li>
                <Truck size={16} className="text-gold-primary" aria-hidden="true" />
                <span>شحن لجميع مناطق المملكة</span>
              </li>
            </ul>
          </div>

          {/* Payment badges */}
          <div>
            <h3 className="footer-heading">طرق الدفع</h3>
            <div className="footer-payments">
              {PAYMENTS.map((payment) => (
                <span key={payment}>{payment}</span>
              ))}
            </div>
            <p className="footer-payments-note">
              يتم الاتفاق على طريقة الدفع معك مباشرة في الواتساب بعد إرسال الطلب.
            </p>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="footer-bottom">
          جميع الحقوق محفوظة © {new Date().getFullYear()} لـ <strong>متجر تولاتي (TOLATY)</strong>.
        </div>

      </div>
    </footer>
  );
}
