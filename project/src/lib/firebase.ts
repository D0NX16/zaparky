import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAD48ZLmvF0sBpZjTUoNunl4UvaqypJVV4",
  authDomain: "zaparky-e2556.firebaseapp.com",
  projectId: "zaparky-e2556",
  storageBucket: "zaparky-e2556.firebasestorage.app",
  messagingSenderId: "957244143281",
  appId: "1:957244143281:web:d944655e7f8d4465ff5490"
};

// Initialize Firebase before exporting any services
const app = initializeApp(firebaseConfig);

// Initialize and export services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;