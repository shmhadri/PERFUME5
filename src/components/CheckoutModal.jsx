import { useEffect, useRef, useState } from 'react';
import { X, CheckCircle, MessageCircle, ShieldCheck } from 'lucide-react';
import useOverlay from '../hooks/useOverlay';
import { WHATSAPP_DISPLAY } from '../data/products';
import { buildWhatsAppOrderUrl, formatPrice, isValidSaudiPhone } from '../lib/utils';

const CITIES = [
  'الرياض',
  'جدة',
  'مكة المكرمة',
  'المدينة المنورة',
  'الدمام',
  'الخبر',
  'الظهران',
  'الطائف',
  'بريدة',
  'أبها',
  'خميس مشيط',
  'تبوك',
  'حائل',
  'نجران',
  'جازان',
  'الأحساء',
  'ينبع',
  'مدينة أخرى'
];

const PAYMENT_METHODS = [
  { id: 'transfer', title: 'تحويل بنكي' },
  { id: 'stcpay', title: 'STC Pay' },
  { id: 'cod', title: 'الدفع عند الاستلام' }
];

const EMPTY_FORM = {
  name: '',
  phone: '',
  city: 'الرياض',
  address: '',
  notes: '',
  paymentMethod: 'transfer'
};

export default function CheckoutModal({ isOpen, onClose, cartDetails, onClearCart }) {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [whatsAppUrl, setWhatsAppUrl] = useState('');
  const cardRef = useRef(null);

  useOverlay(isOpen && Boolean(cartDetails), onClose, cardRef);

  // Start from a clean slate every time the checkout is reopened.
  useEffect(() => {
    if (isOpen) {
      setOrderComplete(false);
      setOrderId('');
      setWhatsAppUrl('');
      setErrors({});
    }
  }, [isOpen]);

  if (!isOpen || !cartDetails) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
  };

  const validate = () => {
    const nextErrors = {};
    if (formData.name.trim().length < 3) nextErrors.name = 'الرجاء إدخال الاسم الكامل (3 أحرف على الأقل)';
    if (!isValidSaudiPhone(formData.phone)) nextErrors.phone = 'رقم جوال سعودي غير صحيح، مثال: 0551234567';
    if (formData.address.trim().length < 6) nextErrors.address = 'الرجاء كتابة الحي والعنوان التفصيلي';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const newId = `TOLA-${Math.floor(100000 + Math.random() * 900000)}`;
    const paymentLabel = PAYMENT_METHODS.find((m) => m.id === formData.paymentMethod)?.title || '';
    const url = buildWhatsAppOrderUrl({
      orderId: newId,
      cartDetails,
      customer: formData,
      paymentLabel
    });

    // Opened straight from the click so the browser does not block it.
    window.open(url, '_blank', 'noopener');

    setOrderId(newId);
    setWhatsAppUrl(url);
    setOrderComplete(true);
    onClearCart();
  };

  const handleClose = () => {
    if (orderComplete) setFormData(EMPTY_FORM);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div
        className="modal-card modal-card-single"
        role="dialog"
        aria-modal="true"
        aria-label="إتمام الطلب"
        tabIndex={-1}
        ref={cardRef}
        onClick={(e) => e.stopPropagation()}
      >

        <button type="button" className="modal-close-btn" onClick={handleClose} aria-label="إغلاق">
          <X size={18} />
        </button>

        {orderComplete ? (
          <div className="checkout-success">
            <CheckCircle size={64} className="text-gold-primary" aria-hidden="true" />

            <h2 className="modal-title">تم تجهيز طلبك! 👑</h2>

            <p className="checkout-order-id">
              رقم الطلب: <strong className="text-gold-light">#{orderId}</strong>
            </p>

            <p className="checkout-note">
              فُتحت نافذة الواتساب بتفاصيل طلبك — اضغط <strong>إرسال</strong> هناك ليصلنا الطلب.
              إذا لم تُفتح النافذة، استخدم الزر بالأسفل.
            </p>

            <div className="checkout-summary-box">
              <div className="checkout-summary-title">ملخص الطلب:</div>
              <div className="checkout-summary-list">
                <div><strong>الاسم:</strong> {formData.name}</div>
                <div><strong>رقم الجوال:</strong> {formData.phone}</div>
                <div><strong>المدينة والحي:</strong> {formData.city} - {formData.address}</div>
                <div><strong>المبلغ الإجمالي:</strong> {formatPrice(cartDetails.total)} ر.س</div>
              </div>
            </div>

            <div className="checkout-success-actions">
              <a className="btn-primary btn-gold" href={whatsAppUrl} target="_blank" rel="noopener noreferrer">
                <MessageCircle size={18} aria-hidden="true" />
                <span>إرسال الطلب على الواتساب</span>
              </a>

              <button type="button" className="btn-primary btn-outline-gold" onClick={handleClose}>
                إغلاق
              </button>
            </div>
          </div>
        ) : (
          <div className="checkout-body">

            <div className="checkout-head">
              <h2 className="modal-title">بيانات التوصيل</h2>
              <p className="modal-desc">
                عبّئ بياناتك وسيتم تحويلك إلى الواتساب ({WHATSAPP_DISPLAY}) مع تفاصيل طلبك جاهزة للإرسال.
              </p>
            </div>

            <form onSubmit={handleSubmitOrder} noValidate>

              <div className="checkout-fields">
                <div className="form-field">
                  <label htmlFor="co-name">الاسم الكامل *</label>
                  <input
                    id="co-name"
                    maxLength={60}
                    type="text"
                    name="name"
                    className="search-input"
                    placeholder="مثال: عبدالملك العتيبي"
                    value={formData.name}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.name)}
                  />
                  {errors.name && <span className="field-error">{errors.name}</span>}
                </div>

                <div className="form-grid-2">
                  <div className="form-field">
                    <label htmlFor="co-phone">رقم الجوال *</label>
                    <input
                      id="co-phone"
                      maxLength={15}
                      type="tel"
                      name="phone"
                      inputMode="tel"
                      className="search-input"
                      placeholder="05XXXXXXXX"
                      value={formData.phone}
                      onChange={handleChange}
                      aria-invalid={Boolean(errors.phone)}
                    />
                    {errors.phone && <span className="field-error">{errors.phone}</span>}
                  </div>

                  <div className="form-field">
                    <label htmlFor="co-city">المدينة *</label>
                    <select
                      id="co-city"
                      name="city"
                      className="search-input"
                      value={formData.city}
                      onChange={handleChange}
                    >
                      {CITIES.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-field">
                  <label htmlFor="co-address">الحي والعنوان التفصيلي *</label>
                  <input
                    id="co-address"
                    maxLength={160}
                    type="text"
                    name="address"
                    className="search-input"
                    placeholder="الحي، اسم الشارع، أقرب معلم..."
                    value={formData.address}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.address)}
                  />
                  {errors.address && <span className="field-error">{errors.address}</span>}
                </div>

                <div className="form-field">
                  <label htmlFor="co-notes">ملاحظات على الطلب (اختياري)</label>
                  <input
                    id="co-notes"
                    maxLength={200}
                    type="text"
                    name="notes"
                    className="search-input"
                    placeholder="مثال: أرفق بطاقة إهداء باسم..."
                    value={formData.notes}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Preferred payment method — settled on WhatsApp */}
              <div className="modal-field">
                <span className="modal-field-label">طريقة الدفع المفضلة:</span>
                <div className="payment-grid">
                  {PAYMENT_METHODS.map((method) => (
                    <button
                      type="button"
                      key={method.id}
                      className={`vol-btn vol-btn-lg ${formData.paymentMethod === method.id ? 'active' : ''}`}
                      aria-pressed={formData.paymentMethod === method.id}
                      onClick={() => setFormData((current) => ({ ...current, paymentMethod: method.id }))}
                    >
                      {method.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Order total lines */}
              <div className="checkout-totals">
                {cartDetails.cartItems.map((item) => (
                  <div className="summary-row" key={item.cartItemId}>
                    <span>{item.name} × {item.quantity}</span>
                    <span>{formatPrice(item.price * item.quantity)} ر.س</span>
                  </div>
                ))}
                {cartDetails.discountAmount > 0 && (
                  <div className="summary-row summary-discount">
                    <span>خصم الكوبون:</span>
                    <span>-{formatPrice(cartDetails.discountAmount)} ر.س</span>
                  </div>
                )}
                <div className="summary-row">
                  <span>الشحن:</span>
                  <span>{cartDetails.shippingFee === 0 ? 'مجاني' : `${formatPrice(cartDetails.shippingFee)} ر.س`}</span>
                </div>
                <div className="summary-row total">
                  <span>الإجمالي:</span>
                  <span>{formatPrice(cartDetails.total)} ر.س</span>
                </div>
              </div>

              <button type="submit" className="btn-primary btn-whatsapp btn-block btn-lg">
                <MessageCircle size={20} aria-hidden="true" />
                <span>إتمام الطلب عبر الواتساب ({formatPrice(cartDetails.total)} ر.س)</span>
              </button>

              <p className="checkout-secure">
                <ShieldCheck size={14} aria-hidden="true" />
                <span>لا نطلب أي بيانات بنكية في الموقع — يتم الاتفاق على الدفع مباشرة معك في الواتساب.</span>
              </p>

            </form>

          </div>
        )}

      </div>
    </div>
  );
}
