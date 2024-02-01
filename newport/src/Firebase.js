// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: "royalestate-46bd2.firebaseapp.com",
  projectId: "royalestate-46bd2",
  storageBucket: "royalestate-46bd2.appspot.com",
  messagingSenderId: "570838584954",
  appId: "1:570838584954:web:a19f2038c8bc8287f6f5c3",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
