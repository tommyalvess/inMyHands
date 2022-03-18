import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD7yy7fyXz2QDfHbzCphEippDsVn1ShHbY",
  authDomain: "myhomeinhand.firebaseapp.com",
  databaseURL: "https://myhomeinhand-default-rtdb.firebaseio.com",
  projectId: "myhomeinhand",
  storageBucket: "myhomeinhand.appspot.com",
  messagingSenderId: "47747391523",
  appId: "1:47747391523:web:0f085ccfc271fe88855196",
  measurementId: "G-JT8Q9KH6YY"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;