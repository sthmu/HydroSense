import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDsCPrIu1NWb8BuY4QR94-ajOB799h6nrg",
  authDomain: "hydrosense-9ef30.firebaseapp.com",
  databaseURL: "https://hydrosense-9ef30-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "hydrosense-9ef30",
  storageBucket: "hydrosense-9ef30.firebasestorage.app",
  messagingSenderId: "289951254542",
  appId: "1:289951254542:web:0c5d163aee6e93ffd8545f"
};


const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database, ref, onValue };
