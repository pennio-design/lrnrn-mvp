import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAfCrDJdtQz9Qgrl6ncYs_7ouI5DLQW7Mo",
  authDomain: "lrnrn-mvp.firebaseapp.com",
  projectId: "lrnrn-mvp",
  storageBucket: "lrnrn-mvp.firebasestorage.app",
  messagingSenderId: "637274620020",
  appId: "1:637274620020:web:e1f3340c0a993b895c1121",
  measurementId: "G-JH88NLPKF7"
};

// Singleton check: prevents the "app already exists" and registration errors
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Explicitly pass the 'app' instance to each service
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;