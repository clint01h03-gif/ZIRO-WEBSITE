/* =========================================================
   LUMINA Global Admin Access
   Type "zatheer" anywhere → password modal → OK → Admin
   ========================================================= */
(function () {
  const SECRET = 'zatheer';
  let buffer = '';
  let lastKeyTime = 0;

  // Create modal once
  function createModal() {
    if (document.getElementById('lumina-admin-modal')) return;

    const style = document.createElement('style');
    style.textContent = `
      #lumina-admin-modal {
        position: fixed; inset: 0; z-index: 99999;
        display: flex; align-items: center; justify-content: center;
        background: rgba(11, 30, 51, 0.75);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        opacity: 0; visibility: hidden;
        transition: opacity 0.25s ease, visibility 0.25s ease;
      }
      #lumina-admin-modal.open {
        opacity: 1; visibility: visible;
      }
      .lumina-modal-card {
        background: #0f172a;
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 24px;
        padding: 40px 36px;
        width: 90%; max-width: 380px;
        box-shadow: 0 40px 80px -20px rgba(0,0,0,0.6);
        transform: translateY(20px) scale(0.96);
        transition: transform 0.3s cubic-bezier(0.2,0,0,1);
      }
      #lumina-admin-modal.open .lumina-modal-card {
        transform: translateY(0) scale(1);
      }
      .lumina-modal-logo {
        font-family: 'Manrope', 'Inter', sans-serif;
        font-size: 1.6rem; font-weight: 700;
        color: #fff; text-align: center; margin-bottom: 6px;
        letter-spacing: -0.02em;
      }
      .lumina-modal-logo span { color: #60a5fa; }
      .lumina-modal-sub {
        text-align: center; color: #94a3b8;
        font-size: 0.9rem; margin-bottom: 28px;
      }
      .lumina-modal-label {
        display: block; font-size: 0.8rem; font-weight: 500;
        color: #94a3b8; margin-bottom: 8px; letter-spacing: 0.02em;
      }
      .lumina-modal-input {
        width: 100%; padding: 13px 16px; border-radius: 12px;
        border: 1px solid rgba(255,255,255,0.12);
        background: rgba(0,0,0,0.35); color: #fff;
        font-size: 1rem; font-family: inherit; outline: none;
        margin-bottom: 20px; transition: border 0.2s, box-shadow 0.2s;
        box-sizing: border-box;
      }
      .lumina-modal-input:focus {
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59,130,246,0.2);
      }
      .lumina-modal-actions {
        display: flex; gap: 12px;
      }
      .lumina-modal-btn {
        flex: 1; padding: 12px; border-radius: 12px;
        font-size: 0.95rem; font-weight: 600; cursor: pointer;
        font-family: inherit; transition: all 0.2s; border: none;
      }
      .lumina-modal-btn.cancel {
        background: transparent; border: 1px solid rgba(255,255,255,0.12);
        color: #cbd5e1;
      }
      .lumina-modal-btn.cancel:hover {
        background: rgba(255,255,255,0.06);
      }
      .lumina-modal-btn.ok {
        background: linear-gradient(135deg, #2563eb, #1d4ed8);
        color: white;
      }
      .lumina-modal-btn.ok:hover {
        box-shadow: 0 10px 20px -6px rgba(37,99,235,0.5);
        transform: translateY(-1px);
      }
      .lumina-modal-error {
        color: #f87171; font-size: 0.85rem; text-align: center;
        margin-top: 14px; display: none;
      }
    `;
    document.head.appendChild(style);

    const modal = document.createElement('div');
    modal.id = 'lumina-admin-modal';
    modal.innerHTML = `
      <div class="lumina-modal-card">
        <div class="lumina-modal-logo">Ziro<span>.</span></div>
        <p class="lumina-modal-sub">Admin Access</p>
        <label class="lumina-modal-label">Password</label>
        <input type="password" class="lumina-modal-input" id="lumina-admin-pass" placeholder="Enter password" autocomplete="off">
        <div class="lumina-modal-actions">
          <button class="lumina-modal-btn cancel" id="lumina-admin-cancel">Cancel</button>
          <button class="lumina-modal-btn ok" id="lumina-admin-ok">OK</button>
        </div>
        <p class="lumina-modal-error" id="lumina-admin-error">Incorrect password</p>
      </div>
    `;
    document.body.appendChild(modal);

    // Events
    document.getElementById('lumina-admin-cancel').addEventListener('click', closeModal);
    document.getElementById('lumina-admin-ok').addEventListener('click', submitPassword);
    document.getElementById('lumina-admin-pass').addEventListener('keydown', e => {
      if (e.key === 'Enter') submitPassword();
      if (e.key === 'Escape') closeModal();
    });
    modal.addEventListener('click', e => {
      if (e.target === modal) closeModal();
    });
  }

  function openModal() {
    createModal();
    const modal = document.getElementById('lumina-admin-modal');
    const input = document.getElementById('lumina-admin-pass');
    const err = document.getElementById('lumina-admin-error');
    err.style.display = 'none';
    input.value = '';
    modal.classList.add('open');
    setTimeout(() => input.focus(), 50);
  }

  function closeModal() {
    const modal = document.getElementById('lumina-admin-modal');
    if (modal) modal.classList.remove('open');
  }

  function submitPassword() {
    const input = document.getElementById('lumina-admin-pass');
    const err = document.getElementById('lumina-admin-error');
    if (input.value === SECRET) {
      sessionStorage.setItem('lumina_admin_auth', '1');
      window.location.href = 'admin.html';
    } else {
      err.style.display = 'block';
      input.value = '';
      input.focus();
    }
  }

  // Detect typing sequence "zatheer" (when not in an input)
  document.addEventListener('keydown', function (e) {
    const tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea' || e.target.isContentEditable) {
      buffer = '';
      return;
    }

    const now = Date.now();
    if (now - lastKeyTime > 1800) buffer = ''; // reset if paused too long
    lastKeyTime = now;

    if (e.key.length === 1) {
      buffer += e.key.toLowerCase();
      if (buffer.length > SECRET.length) {
        buffer = buffer.slice(-SECRET.length);
      }
      if (buffer === SECRET) {
        buffer = '';
        openModal();
      }
    }
  });
})();
