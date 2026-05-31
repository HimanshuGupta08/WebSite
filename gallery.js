/**
 * ═══════════════════════════════════════════════════════════
 * MI LIFESTYLE PARTNER — Dynamic Gallery
 * ═══════════════════════════════════════════════════════════
 *
 * HOW TO ADD PRODUCTS:
 * ─────────────────────────────────────────────────────────
 * OPTION A — products.json (Recommended):
 *   Create a file called "products.json" in your repository root.
 *   The gallery will automatically load images from it.
 *   Format:
 *   [
 *     { "file": "personal-care-shampoo.jpg", "name": "Herbal Shampoo", "category": "personal" },
 *     { "file": "health-supplement.jpg",     "name": "Vita Plus",      "category": "health"   },
 *     ...
 *   ]
 *   Categories: personal | health | body | agro | home | nutrition
 *
 * OPTION B — Image filename convention (auto-detect):
 *   Place images in images/products/ folder.
 *   Name them with a category prefix:
 *     personal-*.jpg / health-*.jpg / body-*.jpg
 *     agro-*.jpg     / home-*.jpg   / nutrition-*.jpg
 *   The script will derive names from filenames automatically.
 *
 * OPTION C — GitHub API (auto-scan, no JSON needed):
 *   Set GITHUB_OWNER and GITHUB_REPO below.
 *   The gallery uses GitHub's API to list all files in
 *   images/products/ automatically — no manual updates needed!
 * ─────────────────────────────────────────────────────────
 */

// ══════════════════════════════════════════════════════════
//  ▼▼▼  CONFIGURE THESE FOR YOUR GITHUB REPOSITORY  ▼▼▼
// ══════════════════════════════════════════════════════════
const GITHUB_OWNER  = 'HimanshuGupta08 ';  // e.g. 'john-doe'
const GITHUB_REPO   = 'Wellify';        // e.g. 'mi-partner-site'
const GITHUB_BRANCH = 'main';                  // or 'master'
const IMAGES_DIR    = 'images/products';       // folder inside your repo
// ══════════════════════════════════════════════════════════

const CATEGORY_MAP = {
  personal:  { label: 'Personal Care', emoji: '🌿' },
  health:    { label: 'Health Care',   emoji: '💊' },
  body:      { label: 'Body Care',     emoji: '✨' },
  agro:      { label: 'Agro Care',     emoji: '🌾' },
  home:      { label: 'Home Care',     emoji: '🏠' },
  nutrition: { label: 'Nutrition',     emoji: '🥗' },
};

const SUPPORTED_EXTS = ['jpg','jpeg','png','gif','webp','avif','svg'];

let allProducts   = [];
let filteredProducts = [];
let currentFilter = 'all';
let currentSearch = '';
let lightboxIndex = 0;

// ── Derive category from filename ──────────────────────────
function detectCategory(filename) {
  const lower = filename.toLowerCase();
  for (const cat of Object.keys(CATEGORY_MAP)) {
    if (lower.startsWith(cat) || lower.includes(`_${cat}`) || lower.includes(`-${cat}`)) {
      return cat;
    }
  }
  return 'personal'; // default
}

// ── Pretty-print filename → product name ──────────────────
function fileToName(filename) {
  return filename
    .replace(/\.[^.]+$/, '')               // strip extension
    .replace(/[-_]/g, ' ')                 // dashes/underscores → spaces
    .replace(/\b\w/g, c => c.toUpperCase()) // Title Case
    .replace(/^(Personal|Health|Body|Agro|Home|Nutrition)\s*/i, ''); // strip category prefix
}

// ── Raw GitHub URL ─────────────────────────────────────────
function rawUrl(filename) {
  return `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}/${IMAGES_DIR}/${filename}`;
}

// ── Load from products.json (if present) ──────────────────
async function loadFromJson() {
  try {
    const res = await fetch('products.json');
    if (!res.ok) throw new Error('no json');
    const data = await res.json();
    return data.map(p => ({
      file: p.file,
      name: p.name || fileToName(p.file),
      category: p.category || detectCategory(p.file),
      src: rawUrl(p.file),
      local: `${IMAGES_DIR}/${p.file}`,
    }));
  } catch {
    return null;
  }
}

// ── Auto-scan via GitHub API ───────────────────────────────
async function loadFromGitHubAPI() {
  const apiUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${IMAGES_DIR}?ref=${GITHUB_BRANCH}`;
  try {
    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error(`GitHub API ${res.status}`);
    const files = await res.json();
    if (!Array.isArray(files)) throw new Error('unexpected response');

    return files
      .filter(f => {
        const ext = f.name.split('.').pop().toLowerCase();
        return f.type === 'file' && SUPPORTED_EXTS.includes(ext);
      })
      .map(f => ({
        file: f.name,
        name: fileToName(f.name),
        category: detectCategory(f.name),
        src: f.download_url || rawUrl(f.name),
        local: `${IMAGES_DIR}/${f.name}`,
      }));
  } catch (err) {
    console.warn('GitHub API load failed:', err.message);
    return null;
  }
}

// ── Fallback: demo placeholder cards ──────────────────────
function loadDemoProducts() {
  const demos = [
    { file: 'personal-herbal-shampoo.jpg',  name: 'Herbal Shampoo',        category: 'personal'  },
    { file: 'personal-night-repair-cream.jpg', name: 'Night Repair Cream', category: 'personal'  },
    { file: 'personal-body-butter.jpg',     name: 'Body Butter Cream',     category: 'personal'  },
    { file: 'health-herbal-supplement.jpg', name: 'Herbal Supplement',     category: 'health'    },
    { file: 'health-vita-capsules.jpg',     name: 'Vita Capsules',         category: 'health'    },
    { file: 'body-lotion.jpg',              name: 'Nourishing Body Lotion', category: 'body'     },
    { file: 'body-vital-supplement.jpg',    name: 'Vital Supplement',      category: 'body'      },
    { file: 'agro-crop-enhancer.jpg',       name: 'Organic Crop Enhancer', category: 'agro'      },
    { file: 'agro-soil-health.jpg',         name: 'Soil Health Solution',  category: 'agro'      },
    { file: 'home-floor-cleaner.jpg',       name: 'Floor Cleaner',         category: 'home'      },
    { file: 'home-dishwash-liquid.jpg',     name: 'Dishwashing Liquid',    category: 'home'      },
    { file: 'home-laundry-detergent.jpg',   name: 'Laundry Detergent',     category: 'home'      },
    { file: 'nutrition-protein-powder.jpg', name: 'Protein Powder',        category: 'nutrition' },
    { file: 'nutrition-vitamins.jpg',       name: 'Daily Vitamins',        category: 'nutrition' },
    { file: 'nutrition-herbal-mix.jpg',     name: 'Herbal Mix',            category: 'nutrition' },
  ];
  return demos.map(p => ({ ...p, src: null, local: `${IMAGES_DIR}/${p.file}`, isDemo: true }));
}

// ── Render product card ────────────────────────────────────
function renderCard(product, index) {
  const cat = CATEGORY_MAP[product.category] || CATEGORY_MAP.personal;
  const card = document.createElement('div');
  card.className = 'product-card';
  card.dataset.category = product.category;
  card.dataset.index = index;

  if (product.isDemo) {
    card.innerHTML = `
      <div class="product-img-wrap demo-placeholder">
        <div class="demo-icon">${cat.emoji}</div>
      </div>
      <div class="product-info">
        <div class="product-cat-badge">${cat.emoji} ${cat.label}</div>
        <h3 class="product-name">${product.name}</h3>
        <p class="product-demo-note">Add image to <code>${product.local}</code></p>
        <a href="contact.html" class="product-enquire">Enquire →</a>
      </div>`;
  } else {
    card.innerHTML = `
      <div class="product-img-wrap" data-src="${product.src || product.local}">
        <img
          src="${product.src || product.local}"
          alt="${product.name}"
          loading="lazy"
          onerror="this.parentElement.classList.add('img-error'); this.style.display='none'; this.parentElement.innerHTML='<div class=\\'img-fallback\\'>${cat.emoji}</div>'"
        />
        <div class="product-overlay">
          <button class="overlay-view" data-index="${index}">🔍 View</button>
        </div>
      </div>
      <div class="product-info">
        <div class="product-cat-badge">${cat.emoji} ${cat.label}</div>
        <h3 class="product-name">${product.name}</h3>
        <a href="contact.html" class="product-enquire">Enquire →</a>
      </div>`;
  }

  card.querySelector('.overlay-view, .product-img-wrap')?.addEventListener('click', (e) => {
    if (!product.isDemo) openLightbox(index);
  });

  return card;
}

// ── Apply filters & search ─────────────────────────────────
function applyFilters() {
  const grid   = document.getElementById('productGrid');
  const empty  = document.getElementById('emptyState');
  const counter = document.getElementById('totalCount');

  filteredProducts = allProducts.filter(p => {
    const matchCat  = currentFilter === 'all' || p.category === currentFilter;
    const matchSearch = !currentSearch || p.name.toLowerCase().includes(currentSearch);
    return matchCat && matchSearch;
  });

  // Rebuild grid
  grid.innerHTML = '';
  filteredProducts.forEach((p, i) => {
    const card = renderCard(p, allProducts.indexOf(p));
    card.classList.add('reveal');
    grid.appendChild(card);
    setTimeout(() => card.classList.add('visible'), i * 40);
  });

  counter.textContent = `${filteredProducts.length} product${filteredProducts.length !== 1 ? 's' : ''} found`;
  empty.style.display = filteredProducts.length === 0 ? 'block' : 'none';
}

// ── Lightbox ───────────────────────────────────────────────
function openLightbox(index) {
  lightboxIndex = index;
  const product = allProducts[index];
  const lb = document.getElementById('lightbox');
  const img = document.getElementById('lightboxImg');
  const cap = document.getElementById('lightboxCaption');

  img.src = product.src || product.local;
  img.alt = product.name;
  cap.textContent = product.name + ' — ' + (CATEGORY_MAP[product.category]?.label || '');
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}

function navigateLightbox(dir) {
  let newIndex = lightboxIndex + dir;
  if (newIndex < 0) newIndex = allProducts.length - 1;
  if (newIndex >= allProducts.length) newIndex = 0;
  openLightbox(newIndex);
}

// ── Bootstrap ──────────────────────────────────────────────
async function init() {
  const loading = document.getElementById('loadingState');

  // 1. Try products.json
  let products = await loadFromJson();

  // 2. Try GitHub API
  if (!products) products = await loadFromGitHubAPI();

  // 3. Demo fallback
  if (!products || products.length === 0) {
    products = loadDemoProducts();
    document.getElementById('totalCount').textContent = 'Demo mode — configure GITHUB_OWNER & GITHUB_REPO in gallery.js';
  }

  allProducts = products;
  loading.style.display = 'none';
  applyFilters();
}

// ── Event listeners ─────────────────────────────────────────
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    applyFilters();
  });
});

document.getElementById('searchInput').addEventListener('input', (e) => {
  currentSearch = e.target.value.toLowerCase().trim();
  applyFilters();
});

document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
document.getElementById('lightboxOverlay').addEventListener('click', closeLightbox);
document.getElementById('lightboxPrev').addEventListener('click', () => navigateLightbox(-1));
document.getElementById('lightboxNext').addEventListener('click', () => navigateLightbox(1));

document.addEventListener('keydown', (e) => {
  const lb = document.getElementById('lightbox');
  if (!lb.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') navigateLightbox(-1);
  if (e.key === 'ArrowRight') navigateLightbox(1);
});

// ── URL param: pre-select category ────────────────────────
const urlParams = new URLSearchParams(window.location.search);
const catParam  = urlParams.get('cat');
if (catParam && CATEGORY_MAP[catParam]) {
  currentFilter = catParam;
  document.querySelectorAll('.filter-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.filter === catParam);
  });
}

// ── Start ──────────────────────────────────────────────────
init();
