// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBSmD8z-Iq3ieVZc3v1MVcgLT9Gixt2GsI",
  authDomain: "testsocial-eccbe.firebaseapp.com",
  projectId: "testsocial-eccbe",
  storageBucket: "testsocial-eccbe.firebasestorage.app",
  messagingSenderId: "119061341168",
  appId: "1:119061341168:web:f6f30fbe292a844d85f335",
  measurementId: "G-811JM8RZ5L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);