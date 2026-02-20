# Library Auto-Generation Workflow

سیستم خودکار برای تولید و بروزرسانی فایل `library.json` بر اساس فایل‌های درون پوشه `downloads/`

## نحوه کار

### 1. **Workflow خودکار (GitHub Actions)**

هر بار که کدی به شاخه `main` push شود:

- اسکریپت `generate-library.js` خودکار اجرا می‌شود
- پوشه `downloads/` اسکن شده و تمام فایل PDF ها شناسایی می‌شوند
- فایل `library.json` خودکار بروزرسانی می‌شود
- تغییرات خودکار commit و push می‌شوند
- سپس deploy به GitHub Pages انجام می‌شود

### 2. **اجرای دستی**

اگر بخواهید library.json را دستی بروزرسانی کنید:

```bash
npm run generate-library
```

یا اگر Node.js را نصب ندارید:

```bash
node scripts/generate-library.js
```

## ساختار پوشه downloads/

```graph
assets/downloads/
├── 7/          (پایه هفتم)
│   ├── 1/      (فصل 1)
│   │   ├── کاربرگ علوم هفتم فصل (1).pdf
│   │   └── روبیک جامع هفتم - فصل (1).pdf
│   ├── 2/      (فصل 2)
│   │   └── ...
│   └── ...
├── 8/          (پایه هشتم)
│   └── ...
└── 9/          (پایه نهم)
    └── ...
```

## ساختار library.json

نتیجه `library.json` شامل:

- **videos**: فیلم‌های آموزشی (به صورت دستی اضافه می‌شوند)
- **notes**: یادداشت‌ها و کاربرگ‌ها (خودکار تولید می‌شوند)

هر یادداشت دارای:

- `id`: شناسه منحصربفرد
- `title`: عنوان فایل
- `grade`: پایه تحصیلی (7، 8، 9)
- `chapter`: شماره فصل
- `file`: مسیر نسبی فایل
- `level`: سطح (تمرینی یا مفاهیمی)

## قوانین نامگذاری فایل

بهتر است فایل‌های PDF را با یکی از این الگوها نام‌گذاری کنید:

```list
کاربرگ علوم [پایه] فصل ([عدد]).pdf
روبیک جامع [پایه] - فصل ([عدد]).pdf
```

مثال:

- `کاربرگ علوم هفتم فصل (1).pdf`
- `روبیک جامع هشتم - فصل (5).pdf`

## فایل‌های مربوطه

- `scripts/generate-library.js` - اسکریپت تولید library.json
- `.github/workflows/static.yml` - GitHub Actions workflow
- `package.json` - تنظیمات npm

## نکات مهم

1. **videos** به صورت دستی در library.json اضافه/تغییر می‌شوند و توسط اسکریپت حفظ می‌شوند
2. **notes** کاملاً خودکار تولید می‌شوند بر اساس محتویات پوشه downloads/
3. اگر فایلی از downloads/ حذف شود، در نسخه بعدی اسکریپت نیز حذف می‌شود

## مثال اجرای دستی

```bash
# نصب dependencies (اختیاری، چون فقط Node.js داخلی استفاده می‌شود)
npm install

# تولید library.json
npm run generate-library

# یا بدون npm
node scripts/generate-library.js
```

خروجی مثال:

```text
🔍 Scanning downloads directory...
📝 Found 45 note files
✅ Successfully generated library.json
   - Videos: 3
   - Notes: 45
   File: assets/content/library.json
```
