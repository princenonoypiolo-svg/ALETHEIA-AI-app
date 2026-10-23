import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported, Analytics } from 'firebase/analytics';

export const firebaseConfig = {
  apiKey: "AIzaSyBkm-TYeGLAfvaMo0pokTAadynIwDilC5A",
  authDomain: "alethea-ai-app.firebaseapp.com",
  projectId: "alethea-ai-app",
  storageBucket: "alethea-ai-app.firebasestorage.app",
  messagingSenderId: "283795139899",
  appId: "1:283795139899:web:eda2aaafa02fd921939b1e",
  measurementId: "G-1RBKY7SBW0"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize Firebase Analytics (guarded for browser and SSR/build environments)
export let analytics: Analytics | null = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {
    // Analytics is not supported in this environment
  });
}
