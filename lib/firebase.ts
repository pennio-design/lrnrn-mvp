import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

// Production Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAfCrDJdtQz9Qgrl6ncYs_7ouI5DLQW7Mo",
  authDomain: "lrnrn-mvp.firebaseapp.com",
  projectId: "lrnrn-mvp",
  storageBucket: "lrnrn-mvp.firebasestorage.app",
  messagingSenderId: "637274620020",
  appId: "1:637274620020:web:e1f3340c0a993b895c1121"
};

// Strict singleton check for the Firebase app
const app: FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize and export services tied to the singleton app instance
// This order is critical for component registration
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);

export default app;