// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB4Dc7QtrpiCOQcBdtR1lgQTU1upklE2IM",
  authDomain: "agri-optima.firebaseapp.com",
  projectId: "agri-optima",
  storageBucket: "agri-optima.firebasestorage.app",
  messagingSenderId: "1005394692696",
  appId: "1:1005394692696:web:f731c5201cf63326bc582d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export { app };
