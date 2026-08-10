# متجر تولاتي — Tolaty Store

متجر عربي (RTL) لبوكسات وأطقم العطور الجاهزة للإهداء. الطلب يُجمَّع في السلة ثم يُرسَل كرسالة
واتساب جاهزة إلى رقم المتجر.

## التشغيل محلياً

```bash
npm install
npm run dev      # خادم التطوير
npm run build    # بناء الإنتاج إلى مجلد dist
npm run preview  # معاينة مخرجات البناء
npm run lint     # فحص الكود
```

## ⚠️ مهم: مجلد `dist` مرفوع مع المستودع

خدمة Render الحالية حقل **Build Command** فيها فارغ، أي أنها تنشر محتوى
المستودع كما هو دون بناء. لذلك يُرفع `dist` معه.

**بعد أي تعديل على الكود، لا تنسَ:**

```bash
npm run build
git add -A && git commit -m "وصف التعديل" && git push
```

لو نسيت `npm run build` سيظل الموقع المنشور على النسخة القديمة.

### للتخلص من هذا القيد (مستحسن)

في لوحة Render → Settings → **Build Command** اكتب `npm run build`، ثم:

```bash
git rm -r --cached dist
# وأعد سطر dist إلى .gitignore
git commit -m "الاعتماد على بناء Render" && git push
```

## النشر على Render

### الطريقة الموصى بها: Blueprint

ملف [`render.yaml`](render.yaml) يحتوي كل الإعدادات. **Render لا يقرأ هذا الملف إلا عبر
Blueprint** — من لوحة التحكم: **New → Blueprint** ثم اختر المستودع.

### أو يدوياً: New → Static Site

في هذه الحالة يُتجاهل `render.yaml` تماماً ويجب إدخال القيم بنفسك:

| الحقل | القيمة |
| --- | --- |
| Build Command | `npm ci && npm run build` |
| Publish Directory | `dist` |
| Environment Variable | `NODE_VERSION` = `22.12.0` |

> Vite 8 يتطلب Node ‏`>=22.12`. لو كانت نسخة Node على Render أقدم، يفشل البناء
> ويظهر **Not Found** لأن مجلد `dist` لا يُنشأ أصلاً. الملف `.node-version` يثبّت النسخة.

### رؤوس الأمان المفعّلة

`Content-Security-Policy` (كل الموارد من نفس النطاق)، `X-Frame-Options: DENY`،
`X-Content-Type-Options: nosniff`، `Referrer-Policy`، `Permissions-Policy`،
و`Strict-Transport-Security`.

### الأصول

- الخطوط مستضافة محلياً في [`public/fonts/`](public/fonts/) — لا طلبات لجهات خارجية إطلاقاً.
- الصور بصيغة JPEG محسّنة، وصورة الغلاف لها نسخة أصغر للجوال (`hero_banner_sm.jpg`).
- عند إضافة صورة منتج جديدة: صدّرها بعرض أقصاه 760px بجودة 80 لتبقى تحت 50 كيلوبايت.

## أين أعدّل المحتوى؟

كل ما يخص المنتجات والأسعار وأرقام التواصل في ملف واحد:
[`src/data/products.js`](src/data/products.js)

- `PRODUCTS` — المنتجات: الاسم، السعر، الصورة، محتويات البوكس.
- `CATEGORIES` — فئات التصفية (يجب أن يطابق `categorySlug` في المنتجات).
- `PROMO_CODES` — أكواد الخصم.
- `WHATSAPP_NUMBER` — رقم الواتساب الذي يستقبل الطلبات (صيغة دولية بدون `+`).
- `FAQS` — الأسئلة الشائعة.

الصور في [`public/images/`](public/images/) ويُشار إليها في المنتج بالمسار `/images/اسم-الملف.png`.

## رحلة الطلب

اختيار المنتج والكمية ← السلة ← بيانات التوصيل (اسم، جوال، مدينة، حي) ← فتح الواتساب برسالة
تحتوي المنتجات والكميات والإجمالي وبيانات العميل.

السلة وقائمة المفضلة محفوظتان في `localStorage`، فلا تضيعان عند تحديث الصفحة.
