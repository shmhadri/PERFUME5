import { PRODUCTS, WHATSAPP_NUMBER } from '../data/products';

export const MAX_QTY_PER_ITEM = 20;

const PRODUCT_BY_ID = new Map(PRODUCTS.map((product) => [product.id, product]));

function clampQuantity(value) {
  const quantity = Math.floor(Number(value));
  if (!Number.isFinite(quantity) || quantity < 1) return 1;
  return Math.min(MAX_QTY_PER_ITEM, quantity);
}

/**
 * localStorage is user-editable, so a stored cart is treated as a list of
 * "product id + wanted quantity" only. Names, images and prices always come
 * from the catalogue, which keeps a tampered cart from producing a fake total
 * in the WhatsApp order message.
 */
export function sanitizeCart(stored) {
  if (!Array.isArray(stored)) return [];

  const seen = new Set();
  return stored.reduce((cart, entry) => {
    const product = PRODUCT_BY_ID.get(entry?.cartItemId ?? entry?.id);
    if (!product || seen.has(product.id)) return cart;
    seen.add(product.id);
    cart.push({
      cartItemId: product.id,
      id: product.id,
      name: product.name,
      image: product.image,
      price: product.price,
      quantity: clampQuantity(entry?.quantity)
    });
    return cart;
  }, []);
}

/** Same idea for favourites: keep only ids that still exist in the catalogue. */
export function sanitizeFavorites(stored) {
  if (!Array.isArray(stored)) return [];
  return [...new Set(stored.filter((id) => PRODUCT_BY_ID.has(id)))];
}

/** Arabic-friendly price formatting: keeps western digits, adds thousand separators. */
export function formatPrice(value) {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(Math.round(value));
}

/**
 * Arabic counted-noun agreement for "منتج":
 * 1 → منتج واحد، 2 → منتجان، 3-10 → منتجات، otherwise → منتج.
 */
export function productCount(n) {
  if (n === 1) return 'منتج واحد';
  if (n === 2) return 'منتجان';
  if (n >= 3 && n <= 10) return `${n} منتجات`;
  return `${n} منتج`;
}

/** Saudi mobile numbers: 05XXXXXXXX or +9665XXXXXXXX. */
export function isValidSaudiPhone(phone) {
  const digits = String(phone).replace(/[\s-]/g, '');
  return /^(?:\+?966|0)5\d{8}$/.test(digits);
}

/**
 * Formats the whole order as a WhatsApp message and returns the wa.me link.
 * This is the final step of checkout — the order is handed over on WhatsApp.
 */
export function buildWhatsAppOrderUrl({ orderId, cartDetails, customer, paymentLabel }) {
  const { cartItems, subtotal, discountAmount, shippingFee, total, giftWrap } = cartDetails;

  const lines = [
    'السلام عليكم 👋',
    'أرغب في تأكيد الطلب التالي من متجر تولاتي:',
    '',
    `🧾 رقم الطلب: ${orderId}`,
    '',
    '🛍️ المنتجات:'
  ];

  cartItems.forEach((item, index) => {
    lines.push(`${index + 1}) ${item.name}`);
    lines.push(`   الكمية: ${item.quantity} × ${formatPrice(item.price)} ر.س = ${formatPrice(item.price * item.quantity)} ر.س`);
  });

  lines.push('');
  lines.push(`💵 المجموع الفرعي: ${formatPrice(subtotal)} ر.س`);
  if (discountAmount > 0) lines.push(`🎟️ الخصم: -${formatPrice(discountAmount)} ر.س`);
  lines.push(`🚚 الشحن: ${shippingFee === 0 ? 'مجاني' : `${formatPrice(shippingFee)} ر.س`}`);
  lines.push(`✅ الإجمالي: ${formatPrice(total)} ر.س`);
  if (giftWrap) lines.push('🎁 مع تغليف هدايا');

  lines.push('');
  lines.push('👤 بيانات التوصيل:');
  lines.push(`الاسم: ${customer.name}`);
  lines.push(`الجوال: ${customer.phone}`);
  lines.push(`المدينة: ${customer.city}`);
  lines.push(`الحي / العنوان: ${customer.address}`);
  lines.push(`طريقة الدفع المفضلة: ${paymentLabel}`);
  if (customer.notes.trim()) lines.push(`ملاحظات: ${customer.notes.trim()}`);

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;
}

/** Quick "ask about this product" link used on product cards and the footer. */
export function whatsAppInquiryUrl(productName) {
  const text = productName
    ? `السلام عليكم 👋 أرغب بالاستفسار عن: ${productName}`
    : 'السلام عليكم 👋 أرغب بالاستفسار عن منتجات متجر تولاتي';
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}
