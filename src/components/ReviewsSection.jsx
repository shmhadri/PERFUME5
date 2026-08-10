import { Star, Quote, CheckCircle } from 'lucide-react';

const REVIEWS = [
  {
    name: 'سليمان الحربي',
    city: 'الرياض',
    rating: 5,
    comment:
      'طلبت الطقم الرجالي وثباته ممتاز، ليجيند خصوصاً يدوم معي طول الدوام. الطلب عن طريق الواتساب كان سريع وسهل.',
    product: 'ليجيند & وان مليون'
  },
  {
    name: 'د. هند المطيري',
    city: 'جدة',
    rating: 5,
    comment:
      'البوكس النسائي وصلني بتغليف نظيف ومرتب، والعبوات حجمها ممتاز للشنطة. أهديته لأختي وعجبها كثير.',
    product: 'بوكس العطور النسائية'
  },
  {
    name: 'فيصل الغامدي',
    city: 'الدمام',
    rating: 5,
    comment:
      'أخذت البوكس الكامل بمعطر الجسم والمرطب، القيمة ممتازة مقابل 99 ريال. التوصيل كان خلال 48 ساعة.',
    product: 'بوكس التدليل الكامل'
  }
];

export default function ReviewsSection() {
  return (
    <section className="reviews-section">

      <div className="section-header">
        <h2 className="section-title">
          آراء وثقة عملائنا في <span className="text-gold-gradient">تولاتي</span>
        </h2>
        <p className="section-desc">
          تقييمات من عملاء استلموا بوكساتهم العطرية وأعادوا الطلب مرة أخرى
        </p>
      </div>

      <div className="reviews-grid">
        {REVIEWS.map((review) => (
          <figure key={review.name} className="glass-panel review-card">
            <Quote size={28} className="text-gold-primary review-quote" aria-hidden="true" />

            <div className="review-stars" aria-label={`التقييم ${review.rating} من 5`}>
              {Array.from({ length: review.rating }, (_, i) => (
                <Star key={i} size={15} fill="var(--gold-primary)" aria-hidden="true" />
              ))}
            </div>

            <blockquote>«{review.comment}»</blockquote>

            <figcaption className="review-footer">
              <div>
                <span className="review-name">
                  {review.name}
                  <CheckCircle size={14} className="text-gold-primary" aria-label="مشتري موثق" />
                </span>
                <span className="review-city">{review.city}</span>
              </div>

              <span className="review-product">{review.product}</span>
            </figcaption>
          </figure>
        ))}
      </div>

    </section>
  );
}
