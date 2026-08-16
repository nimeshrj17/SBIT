import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "dummy-api-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "dummy.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "dummy-project",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "dummy.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:123456789:web:abcdef",
};

// Only initialize Firebase if we are on the client or if we actually have an API key.
// Passing a dummy key to initializeApp still throws invalid-api-key for some services like Auth 
// if it tries to actually connect. 
// We will export mock objects if no real API key is present.

const hasRealConfig = !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

let app;
export let auth: any = {};
export let db: any = {};
export let storage: any = {};

if (hasRealConfig) {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
} else {
  console.warn("Firebase config is missing. Running with mock Firebase services.");
}
