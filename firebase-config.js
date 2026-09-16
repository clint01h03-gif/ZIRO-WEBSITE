/* =========================================================
   Ziro Devices — Firebase Configuration
   Firestore = permanent CMS data
   Storage   = permanent product images
   ========================================================= */

const firebaseConfig = {
  apiKey: "AIzaSyB0Cq-SdSgC2MFYWAYWxnTYh8SC1S-wqOI",
  authDomain: "ziro-web-90d2d.firebaseapp.com",
  projectId: "ziro-web-90d2d",
  storageBucket: "ziro-web-90d2d.firebasestorage.app",
  messagingSenderId: "34116776550",
  appId: "1:34116776550:web:6ffbd9fc8641cc502ab3a7",
  measurementId: "G-FY7V8VD0J1"
};

// Initialize (compat SDK loaded via CDN on each page)
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const storage = firebase.storage();

const CMS_DOC = db.collection('cms').doc('content');
