import { useRef } from 'react';
import firebase from 'firebase/app';
//import firebase from 'firebase/app'; import 'firebase/auth;'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
// import 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { doc, getDoc, getFirestore } from 'firebase/firestore';

const config = {
    apiKey: "AIzaSyDH2iIIKpsN9Quf3t4XOaOysvuPrZyd43A",//process.env.FIREBASE_API_KEY,
    authDomain: "sisfor-bkm.firebaseapp.com",
    projectId: "sisfor-bkm",
    storageBucket: "sisfor-bkm.appspot.com",
    messagingSenderId: "600736994352",
    appId: "1:600736994352:web:3d90ddc81056fc4eddc9f5",
    measurementId: "G-3ECLRWKCEE"
}

// Initialize Firebase
const app = initializeApp(config);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore();

//EXPORT
export { app, analytics, auth, db };
