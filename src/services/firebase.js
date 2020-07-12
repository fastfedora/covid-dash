// import firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyAkwJRGyOpvl9zVR_F9RMs1y8W7T4j6i9c",
  authDomain: "covid-2019-dash.firebaseapp.com",
  databaseURL: "https://covid-2019-dash.firebaseio.com",
  projectId: "covid-2019-dash",
  storageBucket: "covid-2019-dash.appspot.com",
  messagingSenderId: "151786714181",
  appId: "1:151786714181:web:e4fb45706f762a887f9f2c"
};

function isNode() {
  return (
    typeof process !== "undefined" &&
    process.release &&
    process.release.name === "node"
  );
}

// if (isNode()) {
//   global.XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
// }

require("@firebase/polyfill");
const firebase = require("@firebase/app").default;
require("@firebase/firestore");
require("@firebase/auth");

try {
  firebase.initializeApp(firebaseConfig);
} catch (err) {
  if (!/already exists/.test(err.message)) {
    console.error("Firebase initialization error", err.stack);
  }
}

const auth = firebase.auth();
const firestore = firebase.firestore();

export { firebase, auth, firestore };
