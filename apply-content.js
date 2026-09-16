
/* Apply CMS content to live pages — loads from Firestore */
(function () {
  function $(sel) { return document.querySelector(sel); }
  function $$(sel) { return document.querySelectorAll(sel); }

  function setProductImage(card, imageUrl) {
    if (!imageUrl || !String(imageUrl).trim()) return;
    var imgContainer = card.querySelector('.product-image');
    if (!imgContainer) return;
    imgContainer.innerHTML = '';
    imgContainer.style.background = '#f1f5f9';
    var img = document.createElement('img');
    img.src = imageUrl;
    img.alt = 'Product';
    img.style.cssText = 'width:100%;height:100%;object-fit:contain;padding:12px;display:block;';
    img.onerror = function () {
      imgContainer.innerHTML = '<div class="laptop-mini" style="width:70%;aspect-ratio:16/10;background:radial-gradient(circle at 30% 30%,#1a3450,#0a1a2b);border-radius:10px 10px 3px 3px;border:2px solid #2c3e5a;"></div>';
    };
    imgContainer.appendChild(img);
  }

  /* ========== Product Detail Modal ========== */
  function injectModalStyles() {
    if (document.getElementById('ziro-product-modal-styles')) return;
    var style = document.createElement('style');
    style.id = 'ziro-product-modal-styles';
    style.textContent = `
      #ziro-product-modal {
        position: fixed; inset: 0; z-index: 9999;
        display: flex; align-items: center; justify-content: center;
        padding: 20px;
        background: rgba(11, 30, 51, 0);
        opacity: 0; visibility: hidden;
        transition: background 0.3s ease, opacity 0.3s ease, visibility 0.3s;
      }
      #ziro-product-modal.open {
        background: rgba(11, 30, 51, 0.55);
        opacity: 1; visibility: visible;
      }
      #ziro-product-modal .ziro-modal-card {
        background: #fff;
        border-radius: 28px;
        width: 100%;
        max-width: 440px;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 32px 64px -16px rgba(0, 20, 40, 0.28), 0 12px 24px -8px rgba(0,0,0,0.12);
        transform: scale(0.92) translateY(16px);
        opacity: 0;
        transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
        position: relative;
        border: 1px solid rgba(148, 163, 184, 0.18);
      }
      #ziro-product-modal.open .ziro-modal-card {
        transform: scale(1) translateY(0);
        opacity: 1;
      }
      #ziro-product-modal .ziro-modal-close {
        position: absolute; top: 16px; right: 16px;
        width: 36px; height: 36px; border-radius: 50%;
        border: none; background: #f1f5f9; color: #334155;
        font-size: 1.25rem; line-height: 1; cursor: pointer;
        display: flex; align-items: center; justify-content: center;
        transition: background 0.2s, color 0.2s, transform 0.2s;
        z-index: 2;
      }
      #ziro-product-modal .ziro-modal-close:hover {
        background: #e2e8f0; color: #0b1e33; transform: rotate(90deg);
      }
      #ziro-product-modal .ziro-modal-image {
        width: 100%; aspect-ratio: 1.35 / 1;
        background: linear-gradient(145deg, #f0f7ff, #f8fafc);
        border-radius: 28px 28px 0 0;
        display: flex; align-items: center; justify-content: center;
        overflow: hidden; position: relative;
      }
      #ziro-product-modal .ziro-modal-image img {
        width: 100%; height: 100%; object-fit: contain; padding: 20px;
      }
      #ziro-product-modal .ziro-modal-image .laptop-mini,
      #ziro-product-modal .ziro-modal-image .laptop-mock {
        width: 68%; max-width: 240px;
      }
      #ziro-product-modal .ziro-modal-body {
        padding: 24px 28px 28px;
      }
      #ziro-product-modal .ziro-modal-tag {
        font-size: 0.72rem; font-weight: 600; text-transform: uppercase;
        letter-spacing: 0.05em; color: #2563eb; background: #dbeafe;
        padding: 4px 12px; border-radius: 40px; display: inline-block;
        margin-bottom: 12px;
      }
      #ziro-product-modal .ziro-modal-tag.bestseller { background: #fef3c7; color: #b45309; }
      #ziro-product-modal .ziro-modal-tag.new { background: #dcfce7; color: #15803d; }
      #ziro-product-modal .ziro-modal-tag.hot { background: #fee2e2; color: #b91c1c; }
      #ziro-product-modal .ziro-modal-name {
        font-family: 'Manrope', sans-serif; font-size: 1.55rem; font-weight: 700;
        color: #0b1e33; letter-spacing: -0.025em; margin-bottom: 8px; line-height: 1.25;
      }
      #ziro-product-modal .ziro-modal-spec {
        font-size: 0.95rem; color: #64748b; margin-bottom: 10px; font-weight: 500;
      }
      #ziro-product-modal .ziro-modal-desc {
        font-size: 0.92rem; color: #475569; line-height: 1.55; margin-bottom: 20px;
      }
      #ziro-product-modal .ziro-modal-price-row {
        display: flex; align-items: center; justify-content: space-between; gap: 16px;
        flex-wrap: wrap;
      }
      #ziro-product-modal .ziro-modal-price {
        font-family: 'Manrope', sans-serif; font-size: 1.6rem; font-weight: 700;
        color: #0b1e33; letter-spacing: -0.02em;
      }
      #ziro-product-modal .ziro-modal-price small {
        font-size: 0.8rem; font-weight: 400; color: #64748b; margin-left: 4px;
      }
      #ziro-product-modal .ziro-modal-cta {
        background: #2563eb; color: #fff; border: none; border-radius: 40px;
        padding: 12px 24px; font-weight: 600; font-size: 0.95rem;
        cursor: pointer; transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
        font-family: inherit;
      }
      #ziro-product-modal .ziro-modal-cta:hover {
        background: #1d4ed8;
        box-shadow: 0 10px 20px -6px rgba(37, 99, 235, 0.4);
        transform: translateY(-1px);
      }
      @media (max-width: 480px) {
        #ziro-product-modal .ziro-modal-card { max-width: 100%; border-radius: 22px; }
        #ziro-product-modal .ziro-modal-body { padding: 20px 20px 24px; }
        #ziro-product-modal .ziro-modal-name { font-size: 1.35rem; }
      }
    `;
    document.head.appendChild(style);
  }

  function createModal() {
    if (document.getElementById('ziro-product-modal')) return document.getElementById('ziro-product-modal');
    injectModalStyles();
    var modal = document.createElement('div');
    modal.id = 'ziro-product-modal';
    modal.innerHTML = `
      <div class="ziro-modal-card" role="dialog" aria-modal="true" aria-labelledby="ziro-modal-title">
        <button class="ziro-modal-close" aria-label="Close">&times;</button>
        <div class="ziro-modal-image"></div>
        <div class="ziro-modal-body">
          <span class="ziro-modal-tag"></span>
          <h2 class="ziro-modal-name" id="ziro-modal-title"></h2>
          <div class="ziro-modal-spec"></div>
          <div class="ziro-modal-desc"></div>
          <div class="ziro-modal-price-row">
            <div class="ziro-modal-price"></div>
            <button class="ziro-modal-cta">Close</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    // Close handlers
    modal.querySelector('.ziro-modal-close').addEventListener('click', closeProductModal);
    modal.querySelector('.ziro-modal-cta').addEventListener('click', closeProductModal);
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeProductModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('open')) closeProductModal();
    });

    return modal;
  }

  function openProductModal(card) {
    var modal = createModal();
    var imgWrap = modal.querySelector('.ziro-modal-image');
    var tagEl = modal.querySelector('.ziro-modal-tag');
    var nameEl = modal.querySelector('.ziro-modal-name');
    var specEl = modal.querySelector('.ziro-modal-spec');
    var descEl = modal.querySelector('.ziro-modal-desc');
    var priceEl = modal.querySelector('.ziro-modal-price');

    // Image
    var srcImg = card.querySelector('.product-image');
    imgWrap.innerHTML = '';
    if (srcImg) {
      var clone = srcImg.cloneNode(true);
      // Clean up styles that might force small size
      clone.style.cssText = 'width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:transparent;border:none;margin:0;padding:0;';
      imgWrap.appendChild(clone);
    }

    // Tag
    var tag = card.querySelector('.product-tag');
    if (tag) {
      tagEl.textContent = tag.textContent;
      tagEl.className = 'ziro-modal-tag';
      if (tag.classList.contains('bestseller')) tagEl.classList.add('bestseller');
      if (tag.classList.contains('new')) tagEl.classList.add('new');
      if (tag.classList.contains('hot')) tagEl.classList.add('hot');
      tagEl.style.display = '';
    } else {
      tagEl.style.display = 'none';
    }

    // Name
    var name = card.querySelector('h3');
    nameEl.textContent = name ? name.textContent : 'Product';

    // Spec
    var spec = card.querySelector('.product-spec');
    specEl.textContent = spec ? spec.textContent : '';
    specEl.style.display = spec && spec.textContent ? '' : 'none';

    // Desc
    var desc = card.querySelector('.product-desc');
    if (desc && desc.textContent.trim()) {
      descEl.textContent = desc.textContent;
      descEl.style.display = '';
    } else {
      descEl.textContent = '';
      descEl.style.display = 'none';
    }

    // Price
    var price = card.querySelector('.price');
    priceEl.innerHTML = price ? price.innerHTML : '';

    // Open with animation
    document.body.style.overflow = 'hidden';
    // Force reflow then add class
    modal.offsetHeight;
    modal.classList.add('open');
  }

  function closeProductModal() {
    var modal = document.getElementById('ziro-product-modal');
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  function bindDetailButtons() {
    var buttons = $$('.product-card .btn-icon');
    buttons.forEach(function (btn) {
      // Avoid double-binding
      if (btn.dataset.ziroBound) return;
      btn.dataset.ziroBound = '1';
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var card = btn.closest('.product-card');
        if (card) openProductModal(card);
      });
    });
  }

  function applyContent(content) {
    var page = document.body.dataset.page || location.pathname.split('/').pop().replace('.html', '') || 'index';

    if (page === 'index' || page === '' || page === 'index.html') {
      var h = content.hero;
      var badge = $('.hero-badge');
      if (badge) badge.textContent = h.badge;
      var h1 = $('.hero h1');
      if (h1) h1.innerHTML = h.title + ' <span class="accent">' + h.accent + '</span> ' + h.titleEnd;
      var desc = $('.hero p');
      if (desc) desc.textContent = h.description;
      var btnP = $('.btn-primary');
      if (btnP) btnP.textContent = h.btnPrimary;
      var btnO = $('.btn-outline');
      if (btnO) btnO.textContent = h.btnOutline;

      var cards = $$('.products .product-card');
      (content.featured || []).forEach(function (p, i) {
        if (!cards[i]) return;
        var tag = cards[i].querySelector('.product-tag');
        var name = cards[i].querySelector('h3');
        var spec = cards[i].querySelector('.product-spec');
        var price = cards[i].querySelector('.price');
        if (tag) tag.textContent = p.tag;
        if (name) name.textContent = p.name;
        if (spec) spec.textContent = p.spec;
        if (price) price.innerHTML = '$' + formatPrice(p.price) + ' <small>USD</small>';
        setProductImage(cards[i], p.image);
      });
    }

    if (page === 'ultrabooks') {
      var cards = $$('.product-card');
      (content.ultrabooks || []).forEach(function (p, i) {
        if (!cards[i]) return;
        var tag = cards[i].querySelector('.product-tag');
        var name = cards[i].querySelector('h3');
        var spec = cards[i].querySelector('.product-spec');
        var desc = cards[i].querySelector('.product-desc');
        var price = cards[i].querySelector('.price');
        var model = cards[i].querySelector('.laptop-screen-content .model');
        if (tag) {
          tag.textContent = p.tag;
          tag.className = 'product-tag' + (p.tagClass ? ' ' + p.tagClass : '');
        }
        if (name) name.textContent = p.name;
        if (spec) spec.textContent = p.spec;
        if (desc) desc.textContent = p.desc;
        if (price) price.innerHTML = '$' + formatPrice(p.price) + ' <small>USD</small>';
        if (model) model.textContent = (p.name || '').replace('Ziro ', '');
        setProductImage(cards[i], p.image);
      });
    }

    if (page === 'gaming') {
      var cards = $$('.product-card');
      (content.gaming || []).forEach(function (p, i) {
        if (!cards[i]) return;
        var tag = cards[i].querySelector('.product-tag');
        var name = cards[i].querySelector('h3');
        var spec = cards[i].querySelector('.product-spec');
        var desc = cards[i].querySelector('.product-desc');
        var price = cards[i].querySelector('.price');
        var model = cards[i].querySelector('.laptop-screen-content .model');
        if (tag) {
          tag.textContent = p.tag;
          tag.className = 'product-tag' + (p.tagClass ? ' ' + p.tagClass : '');
        }
        if (name) name.textContent = p.name;
        if (spec) spec.textContent = p.spec;
        if (desc) desc.textContent = p.desc;
        if (price) price.innerHTML = '$' + formatPrice(p.price) + ' <small>USD</small>';
        if (model) model.textContent = (p.name || '').replace('Ziro ', '');
        setProductImage(cards[i], p.image);
      });
    }

    if (page === 'support') {
      var c = content.contact || {};
      var phoneEl = document.querySelector('.contact-card:nth-child(1) .contact-value a') ||
                    document.querySelector('.contact-card:nth-child(1) .contact-value');
      var emailEl = document.querySelector('.contact-card:nth-child(2) .contact-value a') ||
                    document.querySelector('.contact-card:nth-child(2) .contact-value');
      var phoneSub = document.querySelector('.contact-card:nth-child(1) .contact-sub');
      var emailSub = document.querySelector('.contact-card:nth-child(2) .contact-sub');
      var addrMain = document.querySelector('.address-main');
      var addrDetail = document.querySelector('.address-detail');

      if (phoneEl) {
        if (phoneEl.tagName === 'A') {
          phoneEl.href = 'tel:' + String(c.phone || '').replace(/[^\d+]/g, '');
          phoneEl.textContent = c.phone;
        } else phoneEl.textContent = c.phone;
      }
      if (emailEl) {
        if (emailEl.tagName === 'A') {
          emailEl.href = 'mailto:' + c.email;
          emailEl.textContent = c.email;
        } else emailEl.textContent = c.email;
      }
      if (phoneSub) phoneSub.innerHTML = String(c.phoneHours || '').replace(/\n/g, '<br>');
      if (emailSub) emailSub.innerHTML = String(c.emailNote || '').replace(/\n/g, '<br>');
      if (addrMain) addrMain.innerHTML = (c.addressLine1 || '') + '<br>' + (c.addressLine2 || '');
      if (addrDetail) addrDetail.innerHTML = (c.city || '') + '<br>' + (c.country || '');
    }

    // Bind Details buttons after content is applied
    bindDetailButtons();
  }

  // Load from Firestore, then apply
  if (typeof loadContentAsync === 'function') {
    loadContentAsync().then(applyContent);
  } else {
    applyContent(getContent());
  }

  // Also bind on DOM ready in case content is static
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindDetailButtons);
  } else {
    bindDetailButtons();
  }
})();
