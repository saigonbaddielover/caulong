import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDflvBvXYn0z1F5vuD5osLlpBFuIR_ngoE",
    authDomain: "caulong-2974b.web.app",
    projectId: "caulong-2974b",
    storageBucket: "caulong-2974b.firebasestorage.app",
    messagingSenderId: "450431128394",
    appId: "1:450431128394:web:7c7b40628f90453a1327b3"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, db, googleProvider };
