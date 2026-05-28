import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAh1y1fn0VxL_juhfdsIKCyePyNSeR6z6k",
  authDomain: "agri-optima-2026.firebaseapp.com",
  projectId: "agri-optima-2026",
  storageBucket: "agri-optima-2026.firebasestorage.app",
  messagingSenderId: "263003282029",
  appId: "1:263003282029:web:6e64c721ca62abdd69bd64"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);

// Ensure authentication state persists across page reloads
setPersistence(auth, browserLocalPersistence);
const googleProvider = new GoogleAuthProvider();
export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
