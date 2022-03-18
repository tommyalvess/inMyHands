// Initialize Cloud Firestore through Firebase
import { initializeApp } from "firebase/app"
import * as firebase from 'firebase';
import "firebase/firestore";

const firebaseApp = initializeApp({
  apiKey: 'AIzaSyD7yy7fyXz2QDfHbzCphEippDsVn1ShHbY',
  authDomain: 'myhomeinhand.firebaseapp.com',
  projectId: 'myhomeinhand'
});

export const fireDB = app.firestore();

export default firebaseApp;