import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB4Dc7QtrpiCOQcBdtR1lgQTU1upklE2IM",
  authDomain: "agri-optima.firebaseapp.com",
  projectId: "agri-optima",
  storageBucket: "agri-optima.firebasestorage.app",
  messagingSenderId: "1005394692696",
  appId: "1:1005394692696:web:f731c5201cf63326bc582d"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);

// Ensure authentication state persists across page reloads
setPersistence(auth, browserLocalPersistence);
const googleProvider = new GoogleAuthProvider();
export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
