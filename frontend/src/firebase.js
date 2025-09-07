// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
//   authDomain: "XXXXXXXXXXXXXXXXXXXXXXXX",
//   projectId: "XXXXXXXXX",
//   storageBucket: "XXXXXXXXXXXXXXXXXX",
//   messagingSenderId: "XXXXXXXXXXXX",
//   appId: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
// };

const firebaseConfig = {
  apiKey: "AIzaSyB_29fKFRIKz26CnodrFbEdkmEwA1NDp68",
  authDomain: "lifted-bd6b3.firebaseapp.com",
  projectId: "lifted-bd6b3",
  storageBucket: "lifted-bd6b3.firebasestorage.app",
  messagingSenderId: "1083549338738",
  appId: "1:1083549338738:web:4fd6c04c1be9cf89f546eb",
  measurementId: "G-JE02ETTP77"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);