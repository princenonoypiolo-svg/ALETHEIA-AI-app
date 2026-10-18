import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "steel-camp-m1ttq",
  appId: "1:356021588267:web:6628479723784bf620f56e",
  apiKey: "AIzaSyBuSX4SWNH6ZmZNrPuU5rzEDR3zlNjzRwM",
  authDomain: "steel-camp-m1ttq.firebaseapp.com",
  storageBucket: "steel-camp-m1ttq.firebasestorage.app",
  messagingSenderId: "356021588267"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, "ai-studio-aletheia-8334c8d7-9337-4086-86bd-d5827b592c4a");
