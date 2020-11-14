//import * as firebase from 'firebase';
import firebase from 'firebase/app'
// Optionally import the services that you want to use
//import "firebase/auth";
//import "firebase/database";
//import "firebase/firestore";
//import "firebase/functions";
//import "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyArgDoMCcT_ig5d6_LCI1bRmh9tshXx_7k",
    authDomain: "gosender-15ab3.firebaseapp.com",
    databaseURL: "https://gosender-15ab3.firebaseio.com",
    projectId: "gosender-15ab3",
    storageBucket: "gosender-15ab3.appspot.com",
    messagingSenderId: "736089699199",
    appId: "1:736089699199:web:fc8f2e9e1dbfc7d57a604a"
};

firebase.initializeApp(firebaseConfig);
 
export default firebase;