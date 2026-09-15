/* =========================================================
   Ziro Content Management System
   Password: zatheer
   ========================================================= */

const LUMINA_DEFAULTS = {
  site: {
    name: "Ziro Devices",
    tagline: "Premium laptops designed in California. Est. 2018."
  },
  hero: {
    badge: "New 2025 collection",
    title: "Precision crafted",
    accent: "laptops",
    titleEnd: "for visionaries.",
    description: "Engineered with aerospace-grade materials and the latest silicon. Experience performance without compromise.",
    btnPrimary: "Shop now",
    btnOutline: "Explore Gaming"
  },
  featured: [
    { tag: "New", name: "Ziro Pro 16", spec: "M3 Max · 32GB · 1TB SSD", price: "2499", image: "" },
    { tag: "Bestseller", name: "Ziro Air 13", spec: "M3 · 16GB · 512GB SSD", price: "1299", image: "" },
    { tag: "Gaming", name: "Ziro Blade 15", spec: "RTX 4070 · 32GB · 1TB SSD", price: "2199", image: "" },
    { tag: "Ultra", name: "Ziro Book 15", spec: "Intel Core 7 · 16GB · 1TB SSD", price: "1799", image: "" }
  ],
  ultrabooks: [
    { tag: "Bestseller", tagClass: "bestseller", name: "Ziro Air 13", spec: "M3 · 16GB · 512GB SSD", desc: "1.2 kg · 18-hour battery · Liquid Retina", price: "1299", color: "silver", image: "" },
    { tag: "New", tagClass: "new", name: "Ziro Air 14", spec: "M3 Pro · 18GB · 1TB SSD", desc: "1.4 kg · 20-hour battery · Mini-LED", price: "1799", color: "space-gray", image: "" },
    { tag: "Ultra", tagClass: "", name: "Ziro Book 13", spec: "Intel Core Ultra 7 · 16GB · 512GB", desc: "1.1 kg · 16-hour battery · OLED", price: "1149", color: "midnight", image: "" },
    { tag: "Popular", tagClass: "", name: "Ziro Slim 15", spec: "Ryzen AI 9 · 32GB · 1TB SSD", desc: "1.5 kg · 19-hour battery · 3K OLED", price: "1599", color: "gold", image: "" },
    { tag: "Value", tagClass: "", name: "Ziro Air SE", spec: "M2 · 8GB · 256GB SSD", desc: "1.25 kg · 15-hour battery · Retina", price: "999", color: "silver", image: "" },
    { tag: "New", tagClass: "new", name: "Ziro Pro Air 14", spec: "M3 Max · 36GB · 1TB SSD", desc: "1.55 kg · 22-hour battery · XDR", price: "2499", color: "space-gray", image: "" }
  ],
  gaming: [
    { tag: "Hot", tagClass: "hot", name: "Ziro Blade 15", spec: "RTX 4070 · 32GB · 1TB SSD", desc: "240Hz QHD · MUX Switch · 2.1 kg", price: "2199", rtx: true, image: "" },
    { tag: "New", tagClass: "new", name: "Ziro Storm 16", spec: "RTX 4080 · 32GB · 2TB SSD", desc: "240Hz Mini-LED · Liquid Metal · 2.4 kg", price: "2999", rtx: false, image: "" },
    { tag: "Compact", tagClass: "", name: "Ziro Pulse 14", spec: "RTX 4060 · 16GB · 1TB SSD", desc: "165Hz QHD · 1.7 kg · 90Wh", price: "1699", rtx: true, image: "" },
    { tag: "Flagship", tagClass: "hot", name: "Ziro Titan 17", spec: "RTX 4090 · 64GB · 4TB SSD", desc: "240Hz 4K Mini-LED · 2.9 kg", price: "4499", rtx: false, image: "" },
    { tag: "Value", tagClass: "", name: "Ziro Aero 15", spec: "RTX 4050 · 16GB · 512GB SSD", desc: "144Hz FHD · 2.0 kg · RGB", price: "1299", rtx: true, image: "" },
    { tag: "New", tagClass: "new", name: "Ziro Forge 16", spec: "RTX 4070 · 32GB · 1TB SSD", desc: "165Hz QHD+ · Nebula RGB · 2.3 kg", price: "2399", rtx: false, image: "" }
  ],

  contact: {
    phone: "+1 (800) 555-8642",
    email: "support@zirodevices.com",
    addressLine1: "850 Market Street",
    addressLine2: "Suite 400",
    city: "San Francisco, CA 94102",
    country: "United States",
    phoneHours: "Mon–Fri 8am–8pm PT\nSat–Sun 9am–5pm PT",
    emailNote: "We reply within 4 hours\non business days"
  },
  whyLumina: {
    title: "Why Ziro",
    subtitle: "We blend classic craftsmanship with futuristic innovation."
  }
};

function getContent() {
  try {
    const saved = localStorage.getItem('lumina_cms_content');
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...LUMINA_DEFAULTS, ...parsed };
    }
  } catch (e) {}
  return JSON.parse(JSON.stringify(LUMINA_DEFAULTS));
}

function saveContent(data) {
  localStorage.setItem('lumina_cms_content', JSON.stringify(data));
}

function formatPrice(p) {
  const n = parseInt(String(p).replace(/[^0-9]/g, ''), 10) || 0;
  return n.toLocaleString('en-US');
}

function resetToDefaults() {
  localStorage.removeItem('lumina_cms_content');
  return JSON.parse(JSON.stringify(LUMINA_DEFAULTS));
}
