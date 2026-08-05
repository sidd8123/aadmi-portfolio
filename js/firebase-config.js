// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-storage.js";

const firebaseConfig = {
  projectId: "aadmi-portfolio-site",
  appId: "1:352753582674:web:7d207752918ad322ec958b",
  storageBucket: "aadmi-portfolio-site.firebasestorage.app",
  apiKey: "AIzaSyAVxviX7LNInNhixrrSoEcNevtbKX3C1wk",
  authDomain: "aadmi-portfolio-site.firebaseapp.com",
  messagingSenderId: "352753582674"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

export { db, auth, storage, googleProvider };
