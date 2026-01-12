import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

// The config provided in your snippet
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "AIzaSyAfCrDJdtQz9Qgrl6ncYs_7ouI5DLQW7Mo",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "lrnrn-mvp.firebaseapp.com",
  projectId: process.env.FIREBASE_PROJECT_ID || "lrnrn-mvp",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "lrnrn-mvp.firebasestorage.app",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "637274620020",
  appId: process.env.FIREBASE_APP_ID || "1:637274620020:web:e1f3340c0a993b895c1121"
};

// Singleton pattern for Firebase initialization
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

// Ensure services are linked to the specific singleton app instance
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);

export default app;