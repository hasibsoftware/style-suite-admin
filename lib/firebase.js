import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// আপনার দেওয়া ফায়ারবেস কনফিগারেশন
const firebaseConfig = {
    apiKey: "AIzaSyAb6b7GgcfAyI0LmXpOHiqsFByaqOJb8Bg",
    authDomain: "style-suite-admin.firebaseapp.com",
    projectId: "style-suite-admin",
    storageBucket: "style-suite-admin.firebasestorage.app",
    messagingSenderId: "785263157641",
    appId: "1:785263157641:web:e19dec3e5b7e197bf38158"
};

// Next.js-এর জন্য ফায়ারবেস ইনিশিয়ালাইজেশন লজিক
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// লগইন (Auth) এবং ডেটাবেস (Firestore) সেটআপ
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };