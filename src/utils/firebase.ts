// src/utils/firebase.ts
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // or import { getDatabase } for Realtime DB
import { getDoc, doc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app); // Or use getDatabase(app)

export const getLightState = async (
  HOME_ID: string
): Promise<"ON" | "OFF" | null> => {
  // const docRef = doc(db, "lightStates", email);
  // const snapshot = await getDoc(docRef);
  const docRef = doc(db, "lightStates", HOME_ID);
  const snapshot = await getDoc(docRef);
  if (snapshot.exists()) {
    const data = snapshot.data();
    return data?.state || null;
  }
  return null;
};

export const signInWithGoogle = () => signInWithPopup(auth, provider);
export const logout = () => signOut(auth);
