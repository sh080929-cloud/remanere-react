import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCT5cDxL4QNfiSao5W0cijVo7nvW95ZPlM",
  authDomain: "remanere-groupware.firebaseapp.com",
  projectId: "remanere-groupware",
  storageBucket: "remanere-groupware.firebasestorage.app",
  messagingSenderId: "764605655546",
  appId: "1:764605655546:web:a70e108c2e1c882eec9c43",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);