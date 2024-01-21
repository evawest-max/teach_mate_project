// Import the functions you need from the SDKs you need
import { getDatabase } from 'firebase/database'
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getMessaging } from "firebase/messaging";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCRopM1it3h6l3Cr_IxJwVzea6JFGdBP2w",
  authDomain: "task-management-131d4.firebaseapp.com",
  projectId: "task-management-131d4",
  storageBucket: "task-management-131d4.appspot.com",
  messagingSenderId: "920411861461",
  appId: "1:920411861461:web:350dbb44c0555d8b234d5c",
  measurementId: "G-7L98HCBJEJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

const storage = getStorage(app);
// Initialize Firebase database and get a reference to the service
const database = getDatabase(app);
// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
// Initialize Firebase Cloud Messaging and get a reference to the service
const messaging = getMessaging(app);
const provider = new GoogleAuthProvider();

export {database, auth, provider, storage, messaging}