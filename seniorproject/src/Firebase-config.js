import { initializeApp } from "firebase/app";
import { getFirestore } from  "@firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'



const firebaseConfig = {
    apiKey: "AIzaSyCn2qWcRCc-IMmA3CWOdUgbAQUTncg-4Ts",
    authDomain: "huddlehero-2cf73.firebaseapp.com",
    projectId: "huddlehero-2cf73", 
    storageBucket: "huddlehero-2cf73.appspot.com",
    messagingSenderId: "535168775137",
    appId: "1:535168775137:web:d89e5d53f5c4e08b4c58a0",
    measurementId: "G-R8XVR7HD4V"
  };

  const app = initializeApp(firebaseConfig);



  export const signInWithGoogle = () => {
    signInWithPopup(auth, provider).then((results) => {
      console.log(results);
    }).catch((error) => {
      console.log(error);
    })
  };

  export const auth = getAuth()
  export const db = getFirestore(app)
  export const provider = new GoogleAuthProvider();