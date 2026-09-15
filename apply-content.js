/* Apply CMS content to the live pages */
(function () {
  const content = getContent();
  const page = document.body.dataset.page || location.pathname.split('/').pop().replace('.html', '') || 'index';

  function $(sel) { return document.querySelector(sel); }
  function $$(sel) { return document.querySelectorAll(sel); }

  function setProductImage(card, imageUrl) {
    if (!imageUrl || !imageUrl.trim()) return;
    const imgContainer = card.querySelector('.product-image');
    if (!imgContainer) return;

    imgContainer.innerHTML = '';
    imgContainer.style.background = '#f1f5f9';
    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = 'Product';
    img.style.cssText = 'width:100%;height:100%;object-fit:contain;padding:12px;display:block;';
    img.onerror = function () {
      imgContainer.innerHTML = '<div class="laptop-mini" style="width:70%;aspect-ratio:16/10;background:radial-gradient(circle at 30% 30%,#1a3450,#0a1a2b);border-radius:10px 10px 3px 3px;border:2px solid #2c3e5a;"></div>';
    };
    imgContainer.appendChild(img);
  }

  // ---------- HOMEPAGE ----------
  if (page === 'index' || page === '' || page === 'index.html') {
    const h = content.hero;
    const badge = $('.hero-badge');
    if (badge) badge.textContent = h.badge;

    const h1 = $('.hero h1');
    if (h1) {
      h1.innerHTML = h.title + ' <span class="accent">' + h.accent + '</span> ' + h.titleEnd;
    }

    const desc = $('.hero p');
    if (desc) desc.textContent = h.description;

    const btnP = $('.btn-primary');
    if (btnP) btnP.textContent = h.btnPrimary;
    const btnO = $('.btn-outline');
    if (btnO) btnO.textContent = h.btnOutline;

    const cards = $$('.products .product-card');
    content.featured.forEach(function (p, i) {
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

  // ---------- ULTRABOOKS ----------
  if (page === 'ultrabooks') {
    const cards = $$('.product-card');
    content.ultrabooks.forEach(function (p, i) {
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
      if (model) model.textContent = p.name.replace('Ziro ', '');
      setProductImage(cards[i], p.image);
    });
  }

  // ---------- GAMING ----------
  if (page === 'gaming') {
    const cards = $$('.product-card');
    content.gaming.forEach(function (p, i) {
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
      if (model) model.textContent = p.name.replace('Ziro ', '');
      setProductImage(cards[i], p.image);
    });
  }

  // ---------- SUPPORT ----------
  if (page === 'support') {
    const c = content.contact;
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
        phoneEl.href = 'tel:' + c.phone.replace(/[^\d+]/g, '');
        phoneEl.textContent = c.phone;
      } else {
        phoneEl.textContent = c.phone;
      }
    }
    if (emailEl) {
      if (emailEl.tagName === 'A') {
        emailEl.href = 'mailto:' + c.email;
        emailEl.textContent = c.email;
      } else {
        emailEl.textContent = c.email;
      }
    }
    if (phoneSub) phoneSub.innerHTML = (c.phoneHours || '').replace(/\n/g, '<br>');
    if (emailSub) emailSub.innerHTML = (c.emailNote || '').replace(/\n/g, '<br>');
    if (addrMain) addrMain.innerHTML = c.addressLine1 + '<br>' + c.addressLine2;
    if (addrDetail) addrDetail.innerHTML = c.city + '<br>' + c.country;
  }
})();
