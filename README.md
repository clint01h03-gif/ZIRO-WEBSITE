# Ziro Devices — Premium Laptop Website

Static multi-page website with a password-protected **CMS** backed by **Firebase Firestore + Storage**.

---

## Pages

| File | Description |
|------|-------------|
| `index.html` | Homepage — hero, featured products, features, CTA |
| `ultrabooks.html` | Ultrabooks catalog |
| `gaming.html` | Gaming laptops catalog |
| `support.html` | Support — phone, email, address |
| `admin.html` | Content Management System (password protected) |

---

## Quick start

1. Extract the zip folder.
2. Open `index.html` in a browser  
   *(For full Firebase features, host on a local server or web host — some browsers block Firebase on `file://`.)*

### Local server (recommended)

```bash
# Python
python3 -m http.server 8080

# Node
npx serve .
```

Then open: `http://localhost:8080`

---

## Admin CMS

### Open admin

**Option A**  
Open `admin.html` directly.

**Option B**  
On any page, type the password sequence **`zatheer`** on the keyboard (not inside an input).  
A modal appears → enter password again → **OK**.

**Password:** `zatheer`

### What you can edit

- Homepage hero text & buttons  
- Featured products (name, tag, specs, price, image)  
- All Ultrabook models  
- All Gaming models  
- Support contact (phone, email, address, hours)

Click **Save All Changes** → data is written to **Firebase Firestore** (permanent, all devices).

---

## Images

### Upload in Admin (recommended)

1. Open Admin → Featured / Ultrabooks / Gaming  
2. On a product → **Upload Image**  
3. Image goes to **Firebase Storage**  
4. Public URL is saved → shows on every device  

Max size: **5 MB** · Formats: JPG, PNG, WebP, GIF  

### Manual path

Put files in the `images/` folder and enter path in Admin, e.g.:

```
images/air13.jpg
```

---

## Firebase setup (required for permanent data)

Project: **ziro-web-90d2d**

### 1. Enable services

[Firebase Console](https://console.firebase.google.com/project/ziro-web-90d2d)

1. **Firestore Database** → Create database (start in test mode)  
2. **Storage** → Get started (start in test mode)

### 2. Firestore rules

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /cms/{doc} {
      allow read: if true;
      allow write: if true;
    }
  }
}
```

### 3. Storage rules

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /product-images/{allPaths=**} {
      allow read: if true;
      allow write: if request.resource.size < 5 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*');
    }
  }
}
```

> **Security:** `allow write: if true` is fine for demo only.  
> Later add Firebase Authentication and restrict writes to your account.

---

## Project structure

```
├── index.html
├── ultrabooks.html
├── gaming.html
├── support.html
├── admin.html
├── firebase-config.js      # Firebase project config
├── content.js              # Defaults + Firestore helpers
├── apply-content.js        # Applies CMS data on live pages
├── admin-access.js         # Type "zatheer" → open admin modal
├── images/                 # Optional local product images
│   └── README.txt
├── FIREBASE-SETUP.txt      # Short setup checklist
└── README.md
```

---

## Brand

- **Name:** Ziro Devices  
- **Email:** support@zirodevices.com  
- **Logo text:** Ziro.

---

## Notes

- Without Firebase enabled, the site still works using **localStorage** (data stays on that browser only).  
- With Firebase enabled, Save / Upload syncs across all devices.  
- Admin password is client-side only — not real security for public production. Use Firebase Auth for production.

---

## License

© 2025 Ziro Devices Inc. All rights reserved.
