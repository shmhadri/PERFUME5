import { useState } from 'react';
import { Star, Plus, Minus, Eye, Check, Heart, PackageCheck } from 'lucide-react';
import { MAX_QTY_PER_ITEM, formatPrice } from '../lib/utils';

export default function ProductCard({
  product,
  isFavorite,
  onToggleFavorite,
  onAddToCart,
  onOpenModal
}) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = (e) => {
    e.stopPropagation();
    onAddToCart(product, quantity);
    setAdded(true);
    setQuantity(1);
    setTimeout(() => setAdded(false), 1500);
  };

  const openModal = () => onOpenModal(product);

  return (
    <article className="product-card">
      {/* Image Wrap */}
      <div
        className="card-image-wrap"
        role="button"
        tabIndex={0}
        aria-label={`عرض تفاصيل ${product.name}`}
        onClick={openModal}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openModal();
          }
        }}
      >
        <img
          src={product.image}
          alt={product.name}
          className="card-image"
          loading="lazy"
          decoding="async"
          width="640"
          height="640"
        />
        {product.badge && <span className="card-badge">{product.badge}</span>}

        <button
          type="button"
          className={`card-fav-btn ${isFavorite ? 'active' : ''}`}
          aria-label={isFavorite ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
          aria-pressed={isFavorite}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(product);
          }}
        >
          <Heart size={17} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Content Wrap */}
      <div className="card-content">
        <div className="card-meta-row">
          <span className="card-category">{product.category}</span>
          <span className="card-rating">
            <Star size={13} fill="var(--gold-primary)" aria-hidden="true" />
            <strong>{product.rating}</strong>
            <span className="card-rating-count">({product.reviewsCount})</span>
          </span>
        </div>

        <h3 className="card-title">
          <button type="button" className="card-title-btn" onClick={openModal}>
            {product.name}
          </button>
        </h3>

        <p className="card-subtitle">{product.subtitle}</p>

        {/* What is inside the box */}
        <ul className="card-includes">
          {product.includes.map((entry) => (
            <li key={entry}>
              <PackageCheck size={13} className="text-gold-primary" aria-hidden="true" />
              <span>{entry}</span>
            </li>
          ))}
        </ul>

        {/* Footer Row */}
        <div className="card-footer">
          <div className="price-wrap">
            <span className="price-label">السعر شامل التغليف</span>
            <div>
              <span className="price-amount">{formatPrice(product.price)}</span>
              <span className="price-currency">ر.س</span>
            </div>
          </div>

          <div className="qty-controls" aria-label="الكمية">
            <button
              type="button"
              className="qty-btn"
              onClick={(e) => {
                e.stopPropagation();
                setQuantity((q) => Math.max(1, q - 1));
              }}
              disabled={quantity <= 1}
              aria-label="إنقاص الكمية"
            >
              <Minus size={13} />
            </button>
            <span className="qty-value">{quantity}</span>
            <button
              type="button"
              className="qty-btn"
              onClick={(e) => {
                e.stopPropagation();
                setQuantity((q) => Math.min(MAX_QTY_PER_ITEM, q + 1));
              }}
              disabled={quantity >= MAX_QTY_PER_ITEM}
              aria-label="زيادة الكمية"
            >
              <Plus size={13} />
            </button>
          </div>
        </div>

        <div className="card-actions">
          <button
            type="button"
            className="icon-button"
            aria-label={`عرض تفاصيل ${product.name}`}
            onClick={openModal}
          >
            <Eye size={16} />
          </button>

          <button type="button" className={`btn-add-cart ${added ? 'is-added' : ''}`} onClick={handleAdd}>
            {added ? (
              <>
                <Check size={16} aria-hidden="true" />
                <span>تمت الإضافة</span>
              </>
            ) : (
              <>
                <Plus size={16} aria-hidden="true" />
                <span>إضافة للسلة</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
