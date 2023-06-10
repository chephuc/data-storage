import firebase from 'firebase/compat/app';
import "firebase/compat/database";

const firebaseConfig = {
    apiKey: "AIzaSyCDmkp5U_up33as68SW6mSgmGLFB52KgJQ",
    authDomain: "react-crud-e0236.firebaseapp.com",
    projectId: "react-crud-e0236",
    storageBucket: "react-crud-e0236.appspot.com",
    messagingSenderId: "552818101137",
    appId: "1:552818101137:web:3de38239bc7f4d56426830"
  };

const fireDb = firebase.initializeApp(firebaseConfig);
export default fireDb.database().ref();