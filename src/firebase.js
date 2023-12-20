import { initializeApp } from "firebase/app";
import { collection, getFirestore, getDocs, getDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCunwZlB7C1nSZtcnI95MvtP7-XZctbpqM",
  authDomain: "statiker-1a4af.firebaseapp.com",
  projectId: "statiker-1a4af",
  storageBucket: "statiker-1a4af.appspot.com",
  messagingSenderId: "266919632868",
  appId: "1:266919632868:web:cfd24b48aba0a84f2d31f1",
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { db };
