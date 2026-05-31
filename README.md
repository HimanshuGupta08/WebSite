# Mi Lifestyle Partner Website

A complete 4-page distributor/partner website for **Mi Lifestyle Marketing**, designed for hosting on **GitHub Pages**.

---

## 📁 File Structure

```
mi-partner-site/
├── index.html          ← Home / Landing Page
├── about.html          ← About Page
├── gallery.html        ← Products Gallery (Dynamic)
├── contact.html        ← Contact Us Page
│
├── style.css           ← Global shared styles
├── home.css            ← Home page styles
├── about.css           ← About page styles
├── gallery.css         ← Gallery page styles
├── contact.css         ← Contact page styles
│
├── main.js             ← Shared JS (navbar, scroll reveal)
├── gallery.js          ← Dynamic gallery logic
├── contact.js          ← Contact form validation
│
├── products.json       ← Product list for the gallery
│
└── images/
    └── products/       ← ← ← DROP YOUR PRODUCT IMAGES HERE
```

---

## 🚀 GitHub Pages Setup

1. **Create a new repository** on GitHub (e.g. `mi-partner-site`)
2. **Upload all files** from this folder to the repository root
3. Go to **Settings → Pages**
4. Under **Source**, select `main` branch → `/ (root)` → Save
5. Your site will be live at: `https://YOUR_USERNAME.github.io/mi-partner-site/`

---

## 🖼️ Adding Products to the Gallery

### Method 1 — products.json (Recommended)
Edit `products.json` and list your products:
```json
[
  { "file": "personal-shampoo.jpg", "name": "Herbal Shampoo", "category": "personal" },
  { "file": "health-vitamins.jpg",  "name": "Daily Vitamins", "category": "health"   }
]
```
Then place the image files in `images/products/`.

**Categories:** `personal` | `health` | `body` | `agro` | `home` | `nutrition`

### Method 2 — GitHub API Auto-Scan (Zero maintenance!)
Edit `gallery.js` and set your details at the top:
```js
const GITHUB_OWNER  = 'your-github-username';
const GITHUB_REPO   = 'mi-partner-site';
const GITHUB_BRANCH = 'main';
```
Then just drop images into `images/products/` — the gallery auto-detects them using GitHub's API. **Name files with a category prefix** for auto-categorisation:
- `personal-face-wash.jpg`
- `health-capsules.jpg`
- `body-lotion.jpg`
- `agro-soil-solution.jpg`
- `home-cleaner.jpg`
- `nutrition-protein.jpg`

### Method 3 — Manual filename naming
Any name works. If no category prefix is found, it defaults to "Personal Care".

---

## ✉️ Contact Form Setup

The contact form supports **Formspree** (free, no backend needed):

1. Go to [formspree.io](https://formspree.io) and create a free account
2. Create a new form — you'll get a Form ID like `xaybcdeg`
3. Edit `contact.js` and set:
```js
const FORMSPREE_ID = 'xaybcdeg';
```
4. Form submissions will be emailed to your registered address

---

## ✏️ Customisation Checklist

Replace all placeholder text before going live:

- [ ] `Your City, Your State, India` → Your actual address
- [ ] `+91 XXXXX XXXXX` → Your phone number  
- [ ] `your@email.com` → Your email address
- [ ] Social media links in footer (`href="#"` → real URLs)
- [ ] WhatsApp link in contact.html (`91XXXXXXXXXX` → your number)
- [ ] `GITHUB_OWNER` and `GITHUB_REPO` in `gallery.js`
- [ ] Formspree ID in `contact.js`

---

## 🎨 Design Notes

- **Color scheme:** Deep charcoal + premium gold — matches Mi Lifestyle's premium brand identity
- **Fonts:** Playfair Display (headings) + Cormorant Garamond (accents) + DM Sans (body)
- **Fully responsive** for mobile, tablet and desktop
- **Dark luxury aesthetic** with subtle grid overlays and gradient accents

---

*This site is an independent partner/distributor website. All Mi Lifestyle product trademarks belong to Mi Lifestyle Marketing Global Private Limited.*
