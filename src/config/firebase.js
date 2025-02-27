import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
//dct
// const firebaseConfig = {
//    apiKey: "AIzaSyB9nCgRuDlOzob37IzvOpgpvuZYNrbmnOc",
//   authDomain: "chatter-37dc6.firebaseapp.com",
//   projectId: "chatter-37dc6",
//   storageBucket: "chatter-37dc6.appspot.com",
//   messagingSenderId: "931769986875",
//   appId: "1:931769986875:web:799b3ba5be12d778c4511e",
//   measurementId: "G-VBWB75YFP2"
// };
//tcd
const firebaseConfig = {
  apiKey: "AIzaSyDaxwvLNhEXb8d7hB2gQr_lrRHaoLZvWig",
  authDomain: "converse-46e30.firebaseapp.com",
  projectId: "converse-46e30",
  storageBucket: "converse-46e30.appspot.com",
  messagingSenderId: "90951631693",
  appId: "1:90951631693:web:c4668b143d07264f7c2d04"
};
//en20

// const firebaseConfig = {
//   apiKey: "AIzaSyDu9T_qn3710MVID_jzDwIizaMNSk0CTE8",
//   authDomain: "chater-4d516.firebaseapp.com",
//   projectId: "chater-4d516",
//   storageBucket: "chater-4d516.appspot.com",
//   messagingSenderId: "1055609310689",
//   appId: "1:1055609310689:web:6ae7e5566e4fd453afd6a0",
//   measurementId: "G-WJ54PWEDRT"
// };
// Initialize Firebase

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
