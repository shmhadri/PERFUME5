import { Sparkles, ShieldCheck, Gift, MessageCircle, ArrowLeft } from 'lucide-react';
import { whatsAppInquiryUrl } from '../lib/utils';

const TRUST_POINTS = [
  { icon: ShieldCheck, text: 'عطور مركّزة بثبات عالٍ' },
  { icon: Gift, text: 'تغليف جاهز للإهداء' },
  { icon: Sparkles, text: 'عبوات محكمة تمنع التسريب' }
];

const STATS = [
  { value: '+12,000', label: 'طلب تم شحنه' },
  { value: '4.9/5', label: 'متوسط تقييم العملاء' },
  { value: '48 ساعة', label: 'متوسط مدة التوصيل' }
];

export default function Hero({ onExploreClick }) {
  return (
    <section className="hero-section">
      <div className="hero-bg" role="presentation" />
      <div className="hero-overlay" />

      <div className="hero-content">

        <p className="hero-badge">
          <Sparkles size={16} className="text-gold-primary" aria-hidden="true" />
          <span>بوكسات عطرية جاهزة للإهداء تبدأ من 50 ر.س</span>
        </p>

        <h1 className="hero-title">
          هدية عطرية متكاملة..
          <br />
          <span className="text-gold-gradient">بتغليف يليق بالمناسبة</span>
        </h1>

        <p className="hero-subtitle">
          بوكسات تحتوي على تولات عطرية مميزة للرجال والنساء، مع معطر جسم وبلسم ومرطب شفاه في البوكس
          الكامل. اختر بوكسك، حدّد الكمية، وأكمل طلبك مباشرة عبر الواتساب.
        </p>

        <div className="hero-cta-group">
          <button type="button" className="btn-primary btn-gold" onClick={onExploreClick}>
            <span>تسوق البوكسات الآن</span>
            <ArrowLeft size={18} aria-hidden="true" />
          </button>

          <a
            className="btn-primary btn-whatsapp"
            href={whatsAppInquiryUrl()}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle size={18} aria-hidden="true" />
            <span>اطلب عبر الواتساب</span>
          </a>
        </div>

        <ul className="hero-trust">
          {TRUST_POINTS.map(({ icon: Icon, text }) => (
            <li key={text}>
              <Icon size={16} className="text-gold-primary" aria-hidden="true" />
              <span>{text}</span>
            </li>
          ))}
        </ul>

        <dl className="hero-stats">
          {STATS.map((stat) => (
            <div key={stat.label} className="hero-stat">
              <dt className="hero-stat-value">{stat.value}</dt>
              <dd className="hero-stat-label">{stat.label}</dd>
            </div>
          ))}
        </dl>

      </div>
    </section>
  );
}
