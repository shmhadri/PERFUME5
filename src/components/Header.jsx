import { useEffect, useState } from 'react';
import { ShoppingBag, Search, Sparkles, Award, MessageCircle, Heart, X } from 'lucide-react';
import { whatsAppInquiryUrl } from '../lib/utils';

export default function Header({
  searchQuery,
  setSearchQuery,
  cartCount,
  favoritesCount,
  onOpenCart,
  onShowFavorites,
  onSelectCategory
}) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* Announcement Bar */}
      <div className="top-bar">
        <Sparkles size={14} className="text-gold-light" aria-hidden="true" />
        <span>توصيل مجاني لجميع مناطق المملكة للطلبات الأكثر من 250 ر.س + تغليف هدايا مجاني</span>
        <span className="hidden-mobile">| 👑 الطلب والتأكيد مباشرة عبر الواتساب</span>
      </div>

      {/* Main Navbar */}
      <header className={`header-nav ${isScrolled ? 'scrolled' : ''}`}>
        <div className="header-container">

          {/* Logo & Brand */}
          <button
            type="button"
            className="logo-brand"
            onClick={() => onSelectCategory('all')}
            aria-label="تولاتي — الصفحة الرئيسية"
          >
            <span className="logo-icon">
              <Award size={24} aria-hidden="true" />
            </span>
            <span>
              <span className="logo-text text-gold-gradient">تولاتي</span>
              <span className="logo-sub">TOLATY LUXURY TOLAS</span>
            </span>
          </button>

          {/* Search Box */}
          <div className="search-wrapper">
            <label htmlFor="site-search" className="sr-only">
              البحث في المتجر
            </label>
            <input
              id="site-search"
              type="search"
              className="search-input"
              placeholder="ابحث عن دهن عود، مسك، ورد طائفي..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery ? (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => setSearchQuery('')}
                aria-label="مسح البحث"
              >
                <X size={16} />
              </button>
            ) : (
              <Search className="search-icon-btn" size={18} aria-hidden="true" />
            )}
          </div>

          {/* Navigation Actions */}
          <div className="nav-actions">
            <a
              className="btn-primary btn-whatsapp btn-compact hidden-mobile"
              href={whatsAppInquiryUrl()}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle size={16} aria-hidden="true" />
              <span>اطلب عبر الواتساب</span>
            </a>

            <button
              type="button"
              className="icon-button"
              onClick={onShowFavorites}
              aria-label={`المفضلة (${favoritesCount} منتج)`}
            >
              <Heart size={19} className="text-gold-primary" aria-hidden="true" />
              {favoritesCount > 0 && <span className="cart-badge">{favoritesCount}</span>}
            </button>

            <button
              type="button"
              className="cart-button"
              onClick={onOpenCart}
              aria-label={`فتح السلة (${cartCount} منتج)`}
            >
              <ShoppingBag size={20} className="text-gold-primary" aria-hidden="true" />
              <span className="hidden-mobile">السلة</span>
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>
          </div>

        </div>
      </header>
    </>
  );
}
