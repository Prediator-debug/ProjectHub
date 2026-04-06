import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDyJvlZZjXobMAhLHitK9rU3bHf_g6rZeE",
  authDomain: "marketplace-6d699.firebaseapp.com",
  projectId: "marketplace-6d699",
  storageBucket: "marketplace-6d699.firebasestorage.app",
  messagingSenderId: "1096502611279",
  appId: "1:1096502611279:web:c51daf03458b4e9ab9493a",
  measurementId: "G-7J44Q5F4FQ"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
