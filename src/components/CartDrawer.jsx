import { useRef, useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowLeft, Tag, Truck } from 'lucide-react';
import { PROMO_CODES } from '../data/products';
import useOverlay from '../hooks/useOverlay';
import { formatPrice } from '../lib/utils';

const FREE_SHIPPING_THRESHOLD = 250;
const SHIPPING_FEE = 25;

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQty,
  onRemoveItem,
  onProceedToCheckout,
  onContinueShopping
}) {
  const [promoInput, setPromoInput] = useState('');
  const [activePromo, setActivePromo] = useState(null);
  const [promoError, setPromoError] = useState('');
  const [giftWrap, setGiftWrap] = useState(true);
  const drawerRef = useRef(null);

  useOverlay(isOpen, onClose, drawerRef);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const discountAmount = activePromo ? Math.round((subtotal * activePromo.discountPercent) / 100) : 0;
  const payable = subtotal - discountAmount;
  const shippingFee = payable >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_FEE;
  const total = Math.max(0, payable + shippingFee);

  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - payable);
  const shippingProgress = Math.min(100, (payable / FREE_SHIPPING_THRESHOLD) * 100);

  const handleApplyPromo = () => {
    setPromoError('');
    const code = promoInput.trim().toUpperCase();
    if (PROMO_CODES[code]) {
      setActivePromo({ ...PROMO_CODES[code], code });
      setPromoInput('');
    } else {
      setPromoError('كود الخصم غير صحيح (جرب TOLA10 أو ROYAL20)');
    }
  };

  return (
    <div className="cart-drawer-overlay" onClick={onClose}>
      <div
        className="cart-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="سلة المشتريات"
        tabIndex={-1}
        ref={drawerRef}
        onClick={(e) => e.stopPropagation()}
      >

        {/* Header */}
        <div className="drawer-header">
          <h2 className="drawer-title">
            <ShoppingBag className="text-gold-primary" size={22} aria-hidden="true" />
            <span>سلة المشتريات ({itemCount})</span>
          </h2>
          <button type="button" className="icon-button" onClick={onClose} aria-label="إغلاق السلة">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="drawer-body">
          {cartItems.length === 0 ? (
            <div className="empty-state">
              <ShoppingBag size={48} className="text-gold-primary empty-state-icon" aria-hidden="true" />
              <p className="empty-state-title">سلتك فارغة حالياً</p>
              <p>اختر بوكسك المفضل وأضفه إلى السلة لإتمام الطلب</p>
              <button type="button" className="btn-primary btn-outline-gold" onClick={onContinueShopping}>
                تصفّح البوكسات
              </button>
            </div>
          ) : (
            <>
              {/* Free shipping progress */}
              <div className="shipping-progress">
                <p className="shipping-progress-text">
                  <Truck size={15} className="text-gold-primary" aria-hidden="true" />
                  {remainingForFreeShipping > 0 ? (
                    <span>
                      تبقّى <strong>{formatPrice(remainingForFreeShipping)} ر.س</strong> للحصول على شحن مجاني
                    </span>
                  ) : (
                    <span>مبروك! طلبك مؤهل للشحن المجاني 🎉</span>
                  )}
                </p>
                <div
                  className="shipping-progress-track"
                  role="progressbar"
                  aria-valuenow={Math.round(shippingProgress)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="التقدم نحو الشحن المجاني"
                >
                  <span className="shipping-progress-bar" style={{ width: `${shippingProgress}%` }} />
                </div>
              </div>

              {cartItems.map((item) => (
                <div key={item.cartItemId} className="cart-item-card">
                  <img src={item.image} alt="" className="cart-item-img" loading="lazy" />

                  <div className="cart-item-info">
                    <div className="cart-item-title">{item.name}</div>
                    <div className="cart-item-vol">
                      {formatPrice(item.price)} ر.س للقطعة
                    </div>
                    <div className="cart-item-price">
                      {formatPrice(item.price * item.quantity)} ر.س
                    </div>
                  </div>

                  <div className="cart-item-controls">
                    <button
                      type="button"
                      className="cart-item-remove"
                      onClick={() => onRemoveItem(item.cartItemId)}
                      aria-label={`حذف ${item.name} من السلة`}
                    >
                      <Trash2 size={15} />
                    </button>

                    <div className="qty-controls">
                      <button
                        type="button"
                        className="qty-btn"
                        onClick={() => onUpdateQty(item.cartItemId, -1)}
                        aria-label="إنقاص الكمية"
                      >
                        −
                      </button>
                      <span className="qty-value">{item.quantity}</span>
                      <button
                        type="button"
                        className="qty-btn"
                        onClick={() => onUpdateQty(item.cartItemId, 1)}
                        aria-label="زيادة الكمية"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Free Velvet Pouch Option */}
              <div className="gift-wrap-row">
                <input
                  type="checkbox"
                  id="giftWrap"
                  checked={giftWrap}
                  onChange={(e) => setGiftWrap(e.target.checked)}
                />
                <label htmlFor="giftWrap">إضافة تغليف هدايا فاخر مجاناً 🎁</label>
              </div>

              {/* Promo Code Input */}
              <div className="promo-row">
                <div className="promo-input-group">
                  <label htmlFor="promo-code" className="sr-only">
                    كود الخصم
                  </label>
                  <input
                    id="promo-code"
                    type="text"
                    className="search-input"
                    placeholder="كود الخصم (TOLA10)"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleApplyPromo()}
                  />
                  <button type="button" className="btn-primary btn-outline-gold btn-compact" onClick={handleApplyPromo}>
                    تطبيق
                  </button>
                </div>

                {activePromo && (
                  <p className="promo-success">
                    <Tag size={12} aria-hidden="true" />
                    <span>تم تطبيق {activePromo.label}</span>
                    <button type="button" className="promo-remove" onClick={() => setActivePromo(null)}>
                      إلغاء
                    </button>
                  </p>
                )}
                {promoError && <p className="promo-error">{promoError}</p>}
              </div>
            </>
          )}
        </div>

        {/* Footer Summary */}
        {cartItems.length > 0 && (
          <div className="drawer-footer">
            <div className="summary-row">
              <span>المجموع الفرعي:</span>
              <span>{formatPrice(subtotal)} ر.س</span>
            </div>

            {discountAmount > 0 && (
              <div className="summary-row summary-discount">
                <span>خصم الكوبون:</span>
                <span>-{formatPrice(discountAmount)} ر.س</span>
              </div>
            )}

            <div className="summary-row">
              <span>التوصيل المحمي:</span>
              <span>{shippingFee === 0 ? 'مجاني 🚛' : `${formatPrice(shippingFee)} ر.س`}</span>
            </div>

            <div className="summary-row total">
              <span>الإجمالي النهائي:</span>
              <span>{formatPrice(total)} ر.س</span>
            </div>

            <button
              type="button"
              className="btn-primary btn-gold btn-block"
              onClick={() =>
                onProceedToCheckout({ cartItems, subtotal, discountAmount, shippingFee, total, giftWrap })
              }
            >
              <span>متابعة إتمام الطلب</span>
              <ArrowLeft size={18} aria-hidden="true" />
            </button>

            <p className="drawer-note">يتم تأكيد الطلب وإرساله عبر الواتساب في الخطوة التالية</p>
          </div>
        )}

      </div>
    </div>
  );
}
