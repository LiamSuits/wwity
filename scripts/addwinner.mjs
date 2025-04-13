import { initializeApp } from "firebase/app";
import { collection, addDoc, getFirestore } from "firebase/firestore";
import dotenv from 'dotenv';
dotenv.config({ path: './.env.local' });

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firestore instance
const db = getFirestore(app);

// Example: Add a blank document to "winners" collection
const run = async () => {
    try {
        const docRef = await addDoc(collection(db, "winners"), {
            age: "19",
            award: "Calder Trophy",
            gamedate: "13/4/2025",
            position: "Defense",
            solution: "Tyler Meyers",
            statline: "11G 37A 32PIM",
            team: "Buffalo Sabres",
            year: "2010"
        });

        console.log("Document written with ID: ", docRef.id);
    } catch (error) {
        console.error("Error adding document: ", error);
    }
};

run();