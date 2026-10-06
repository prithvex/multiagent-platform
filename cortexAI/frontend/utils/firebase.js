// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "cortexai-d3e3b.firebaseapp.com",
  projectId: "cortexai-d3e3b",
  storageBucket: "cortexai-d3e3b.firebasestorage.app",
  messagingSenderId: "1038174601285",
  appId: "1:1038174601285:web:e72429d0ed6a711a20232c",
  measurementId: "G-CQCDK1VJMQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider= new GoogleAuthProvider()