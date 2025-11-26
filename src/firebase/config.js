// Firebase Configuration
// Replace these values with your Firebase project's web config
// Get from: Firebase Console > Project Settings > General > Your apps > Web app

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB-xkwLwLn8mgna6PWO-ceSuqa_MgLYwxE",
  authDomain: "campusconnect-d0f66.firebaseapp.com",
  projectId: "campusconnect-d0f66",
  storageBucket: "campusconnect-d0f66.appspot.com",
  messagingSenderId: "115375135768849587868",
  appId: "1:115375135768849587868:web:e59c019486636019745330"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;

