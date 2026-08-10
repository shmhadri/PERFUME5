import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import FeaturesSection from './components/FeaturesSection';
import ReviewsSection from './components/ReviewsSection';
import FaqSection from './components/FaqSection';
import Footer from './components/Footer';
import FloatingActions from './components/FloatingActions';

import { PRODUCTS, CATEGORIES, SORT_OPTIONS } from './data/products';
import useLocalStorage from './hooks/useLocalStorage';
import {
  MAX_QTY_PER_ITEM, formatPrice, productCount, sanitizeCart, sanitizeFavorites
} from './lib/utils';
import { Sparkles, CheckCircle2, Heart, SlidersHorizontal } from 'lucide-react';

export default function App() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState('featured');
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  const [cartItems, setCartItems] = useLocalStorage('tolaty:cart', [], sanitizeCart);
  const [favorites, setFavorites] = useLocalStorage('tolaty:favorites', [], sanitizeFavorites);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [checkoutDetails, setCheckoutDetails] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const toastTimer = useRef(null);

  // Toast Notification helper — a new toast always replaces the pending one.
  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMessage(''), 3000);
  }, []);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  // Filter products by category, favorites and search
  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const matched = PRODUCTS.filter((product) => {
      const matchesCategory = activeCategory === 'all' || product.categorySlug === activeCategory;
      const matchesFavorites = !onlyFavorites || favorites.includes(product.id);
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.subtitle.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.includes.some((entry) => entry.toLowerCase().includes(query));
      return matchesCategory && matchesFavorites && matchesSearch;
    });

    const sorters = {
      featured: () => 0,
      best: (a, b) => Number(b.isBestSeller) - Number(a.isBestSeller) || b.reviewsCount - a.reviewsCount,
      rating: (a, b) => b.rating - a.rating || b.reviewsCount - a.reviewsCount,
      'price-asc': (a, b) => a.price - b.price,
      'price-desc': (a, b) => b.price - a.price
    };

    return [...matched].sort(sorters[sortKey] || sorters.featured);
  }, [activeCategory, searchQuery, sortKey, onlyFavorites, favorites]);

  // Add to cart (immutably — never mutate the item already in state)
  const handleAddToCart = useCallback(
    (product, quantity = 1) => {
      setCartItems((current) => {
        const existing = current.find((item) => item.cartItemId === product.id);
        if (existing) {
          return current.map((item) =>
            item.cartItemId === product.id
              ? { ...item, quantity: Math.min(MAX_QTY_PER_ITEM, item.quantity + quantity) }
              : item
          );
        }
        return [
          ...current,
          {
            cartItemId: product.id,
            id: product.id,
            name: product.name,
            image: product.image,
            price: product.price,
            quantity
          }
        ];
      });

      showToast(`تمت إضافة ${product.name} إلى السلة 👑`);
    },
    [setCartItems, showToast]
  );

  const handleToggleFavorite = useCallback(
    (product) => {
      setFavorites((current) => {
        const isFavorite = current.includes(product.id);
        showToast(
          isFavorite
            ? `تمت إزالة ${product.name} من المفضلة`
            : `تمت إضافة ${product.name} إلى المفضلة ❤️`
        );
        return isFavorite ? current.filter((id) => id !== product.id) : [...current, product.id];
      });
    },
    [setFavorites, showToast]
  );

  // Cart Qty updates
  const handleUpdateQty = useCallback(
    (cartItemId, delta) => {
      setCartItems((current) =>
        current
          .map((item) =>
            item.cartItemId === cartItemId
              ? { ...item, quantity: Math.min(MAX_QTY_PER_ITEM, item.quantity + delta) }
              : item
          )
          .filter((item) => item.quantity > 0)
      );
    },
    [setCartItems]
  );

  // Remove single item
  const handleRemoveCartItem = useCallback(
    (cartItemId) => {
      setCartItems((current) => current.filter((item) => item.cartItemId !== cartItemId));
      showToast('تم حذف المنتج من السلة');
    },
    [setCartItems, showToast]
  );

  // Proceed from Cart to Checkout
  const handleProceedToCheckout = useCallback((details) => {
    setCheckoutDetails(details);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  }, []);

  const handleClearCart = useCallback(() => setCartItems([]), [setCartItems]);

  const totalCartItemsCount = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);
  const cartSubtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const scrollToId = useCallback((id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const scrollToProducts = useCallback(() => scrollToId('products-section'), [scrollToId]);

  const resetFilters = () => {
    setActiveCategory('all');
    setSearchQuery('');
    setOnlyFavorites(false);
  };

  return (
    <div className="app-root">

      {/* Toast Alert */}
      <div className="toast-region" role="status" aria-live="polite">
        {toastMessage && (
          <div className="toast-msg">
            <CheckCircle2 size={18} />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>

      {/* Header */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        cartCount={totalCartItemsCount}
        favoritesCount={favorites.length}
        onOpenCart={() => setIsCartOpen(true)}
        onShowFavorites={() => {
          setOnlyFavorites(true);
          setActiveCategory('all');
          scrollToProducts();
        }}
        onSelectCategory={(slug) => {
          setActiveCategory(slug);
          setOnlyFavorites(false);
        }}
      />

      {/* Hero Banner */}
      <Hero onExploreClick={scrollToProducts} />

      {/* Categories Bar */}
      <nav className="categories-bar" aria-label="تصفية حسب الفئة">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.slug}
            type="button"
            className={`category-tab ${activeCategory === cat.slug && !onlyFavorites ? 'active' : ''}`}
            aria-pressed={activeCategory === cat.slug && !onlyFavorites}
            onClick={() => {
              setActiveCategory(cat.slug);
              setOnlyFavorites(false);
            }}
          >
            {cat.name}
          </button>
        ))}

        <button
          type="button"
          className={`category-tab category-tab-fav ${onlyFavorites ? 'active' : ''}`}
          aria-pressed={onlyFavorites}
          onClick={() => setOnlyFavorites((v) => !v)}
        >
          <Heart size={14} fill={onlyFavorites ? 'currentColor' : 'none'} />
          <span>المفضلة {favorites.length > 0 ? `(${favorites.length})` : ''}</span>
        </button>
      </nav>

      {/* Main Products Grid */}
      <section className="products-container" id="products-section">

        <div className="section-header">
          <span className="hero-badge">
            <Sparkles size={14} className="text-gold-primary" />
            <span>بوكسات وأطقم عطرية جاهزة للإهداء</span>
          </span>
          <h2 className="section-title">
            اختر بوكسك من <span className="text-gold-gradient">تشكيلة تولاتي</span>
          </h2>
          <p className="section-desc">
            كل بوكس معبأ بعناية في تغليف أنيق يصلح للإهداء المباشر، وسعره شامل التغليف.
          </p>
        </div>

        {/* Results count + sorting */}
        <div className="products-toolbar">
          <span className="results-count">
            عرض <strong>{filteredProducts.length}</strong> من أصل {productCount(PRODUCTS.length)}
            {searchQuery.trim() && <> لنتائج البحث «{searchQuery.trim()}»</>}
          </span>

          <label className="sort-control">
            <SlidersHorizontal size={15} className="text-gold-primary" />
            <span className="sort-label">ترتيب حسب:</span>
            <select
              className="sort-select"
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value)}
              aria-label="ترتيب المنتجات"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.key} value={option.key}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="empty-state">
            <p className="empty-state-title">
              {onlyFavorites ? 'لا توجد منتجات في قائمة المفضلة بعد' : 'لا توجد منتجات مطابقة لكلمة البحث'}
            </p>
            <p>
              {onlyFavorites
                ? 'اضغط على القلب في أي منتج لإضافته إلى مفضلتك والرجوع إليه لاحقاً'
                : 'جرب البحث عن «بوكس»، «رجالي»، أو اختر فئة أخرى من الأعلى'}
            </p>
            <button type="button" className="btn-primary btn-outline-gold" onClick={resetFilters}>
              إعادة ضبط الفلاتر
            </button>
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isFavorite={favorites.includes(product.id)}
                onToggleFavorite={handleToggleFavorite}
                onAddToCart={handleAddToCart}
                onOpenModal={setSelectedProduct}
              />
            ))}
          </div>
        )}

      </section>

      {/* Features & Guarantees */}
      <FeaturesSection />

      {/* Customer Testimonials */}
      <ReviewsSection />

      {/* Frequently asked questions */}
      <FaqSection />

      {/* Footer */}
      <Footer onSelectCategory={setActiveCategory} onNavigate={scrollToId} />

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          isFavorite={favorites.includes(selectedProduct.id)}
          onToggleFavorite={handleToggleFavorite}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={handleProceedToCheckout}
        onContinueShopping={() => {
          setIsCartOpen(false);
          scrollToProducts();
        }}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartDetails={checkoutDetails}
        onClearCart={handleClearCart}
      />

      {/* WhatsApp + back to top shortcuts */}
      <FloatingActions />

      {/* Sticky mobile cart bar */}
      {totalCartItemsCount > 0 && (
        <button type="button" className="mobile-cart-bar" onClick={() => setIsCartOpen(true)}>
          <span>عرض السلة ({totalCartItemsCount})</span>
          <span className="mobile-cart-total">{formatPrice(cartSubtotal)} ر.س</span>
        </button>
      )}

    </div>
  );
}
