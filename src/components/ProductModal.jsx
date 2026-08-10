import { useRef, useState } from 'react';
import {
  X, Star, ShieldCheck, Truck, PackageCheck, Plus, Minus, Check, Heart, MessageCircle
} from 'lucide-react';
import useOverlay from '../hooks/useOverlay';
import { MAX_QTY_PER_ITEM, formatPrice, whatsAppInquiryUrl } from '../lib/utils';

export default function ProductModal({ product, isFavorite, onToggleFavorite, onClose, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const cardRef = useRef(null);

  useOverlay(Boolean(product), onClose, cardRef);

  if (!product) return null;

  const totalPrice = product.price * quantity;

  const handleAdd = () => {
    onAddToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-label={product.name}
        tabIndex={-1}
        ref={cardRef}
        onClick={(e) => e.stopPropagation()}
      >

        <button type="button" className="modal-close-btn" onClick={onClose} aria-label="إغلاق النافذة">
          <X size={20} />
        </button>

        {/* Left Pane: Image */}
        <div className="modal-image-pane">
          <div className="modal-image-inner">
            <img src={product.image} alt={product.name} loading="lazy" decoding="async" />
            <p className="modal-image-note">
              <ShieldCheck size={14} aria-hidden="true" />
              <span>عبوات محكمة الإغلاق تمنع التسريب</span>
            </p>
          </div>
        </div>

        {/* Right Pane: Details */}
        <div className="modal-info-pane">

          <div className="card-meta-row">
            <span className="card-category">{product.category}</span>
            <span className="card-rating">
              <Star size={14} fill="var(--gold-primary)" aria-hidden="true" />
              <strong>{product.rating}</strong>
              <span className="card-rating-count">({product.reviewsCount} تقييم)</span>
            </span>
          </div>

          <h2 className="modal-title">{product.name}</h2>

          <p className="modal-desc">{product.description}</p>

          {/* What the box contains */}
          <div className="notes-pyramid">
            <h3 className="notes-title">
              <PackageCheck size={14} aria-hidden="true" />
              <span>محتويات البوكس</span>
            </h3>

            {product.includes.map((entry, index) => (
              <div key={entry} className="note-item">
                <span className="note-badge">{index + 1}</span>
                <span>{entry}</span>
              </div>
            ))}
          </div>

          {/* Highlights */}
          <div className="modal-specs">
            {product.highlights.map((item) => (
              <div key={item.label}>
                <ShieldCheck size={15} className="text-gold-primary" aria-hidden="true" />
                <span>{item.label}: {item.value}</span>
              </div>
            ))}
            <div>
              <Truck size={15} className="text-gold-primary" aria-hidden="true" />
              <span>شحن مجاني فوق 250 ر.س</span>
            </div>
            <div>
              <MessageCircle size={15} className="text-gold-primary" aria-hidden="true" />
              <span>
                <a href={whatsAppInquiryUrl(product.name)} target="_blank" rel="noopener noreferrer">
                  استفسر عبر الواتساب
                </a>
              </span>
            </div>
          </div>

          {/* Quantity */}
          <div className="modal-field">
            <span className="modal-field-label">الكمية:</span>
            <div className="qty-controls qty-controls-lg">
              <button
                type="button"
                className="qty-btn"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="إنقاص الكمية"
                disabled={quantity <= 1}
              >
                <Minus size={14} />
              </button>
              <span className="qty-value" aria-live="polite">{quantity}</span>
              <button
                type="button"
                className="qty-btn"
                onClick={() => setQuantity((q) => Math.min(MAX_QTY_PER_ITEM, q + 1))}
                aria-label="زيادة الكمية"
                disabled={quantity >= MAX_QTY_PER_ITEM}
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* Pricing & Add Button */}
          <div className="modal-buy-row">
            <div>
              <span className="price-label">السعر الإجمالي</span>
              <div className="modal-total">
                {formatPrice(totalPrice)} <span className="price-currency">ر.س</span>
              </div>
            </div>

            <div className="modal-buy-actions">
              <button
                type="button"
                className={`icon-button icon-button-lg ${isFavorite ? 'is-fav' : ''}`}
                onClick={() => onToggleFavorite(product)}
                aria-pressed={isFavorite}
                aria-label={isFavorite ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
              >
                <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
              </button>

              <button type="button" className="btn-primary btn-gold" onClick={handleAdd}>
                {added ? (
                  <>
                    <Check size={18} aria-hidden="true" />
                    <span>تمت الإضافة للسلة</span>
                  </>
                ) : (
                  <>
                    <Plus size={18} aria-hidden="true" />
                    <span>إضافة إلى السلة</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
