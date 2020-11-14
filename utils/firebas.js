import firebase from 'firebase/app'

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCmHL3o-skzteoxIXOxgU1MN_qbMg7Yzwk",
    authDomain: "tienda-2ac86.firebaseapp.com",
    databaseURL: "https://tienda-2ac86.firebaseio.com",
    projectId: "tienda-2ac86",
    storageBucket: "tienda-2ac86.appspot.com",
    messagingSenderId: "525265734942",
    appId: "1:525265734942:web:74c1c5af5adbee24784d0f"
};

firebase.initializeApp(firebaseConfig);
 
export default firebase;