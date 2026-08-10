import { ShieldCheck, Gift, MessageCircle, Truck, Sparkles } from 'lucide-react';

const FEATURES = [
  {
    Icon: Gift,
    title: 'بوكسات جاهزة للإهداء',
    desc: 'كل بوكس يصلك بتغليف أنيق مرتب، تقدر تهديه مباشرة دون أي تجهيز إضافي.'
  },
  {
    Icon: ShieldCheck,
    title: 'عطور مركّزة وثابتة',
    desc: 'مستخلصات عطرية عالية التركيز بثبات يدوم طوال اليوم وعبوات محكمة تمنع التسريب.'
  },
  {
    Icon: MessageCircle,
    title: 'الطلب عبر الواتساب',
    desc: 'اختر منتجك وحدّد الكمية، وسيصلنا طلبك كاملاً على الواتساب لتأكيده خلال دقائق.'
  },
  {
    Icon: Truck,
    title: 'شحن سريع ومحمي',
    desc: 'توصيل خلال 24-48 ساعة للمدن الرئيسية، ومجاناً للطلبات فوق 250 ر.س.'
  }
];

export default function FeaturesSection() {
  return (
    <section className="features-section">
      <div className="features-inner">

        <div className="section-header">
          <span className="hero-badge">
            <Sparkles size={14} className="text-gold-primary" aria-hidden="true" />
            <span>لماذا يختار عملاؤنا متجر «تولاتي»؟</span>
          </span>
          <h2 className="section-title">تجربة شراء بسيطة وهدية مضمونة</h2>
        </div>

        <div className="features-grid">
          {FEATURES.map(({ Icon, title, desc }) => (
            <div key={title} className="glass-panel feature-card">
              <span className="feature-icon">
                <Icon size={30} className="text-gold-primary" aria-hidden="true" />
              </span>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
