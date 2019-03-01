const firebase = require(`firebase/app`);
require(`firebase/auth`);
require(`firebase/firestore`);

const FIREBASE_CONFIG = {
  apiKey: process.env.GATSBY_FIREBASE_API_KEY,
  authDomain: `gloomhaven-tracker-47.firebaseapp.com`,
  databaseURL: `https://gloomhaven-tracker-47.firebaseio.com`,
  projectId: `gloomhaven-tracker-47`,
  storageBucket: `gloomhaven-tracker-47.appspot.com`,
  messagingSenderId: `225471931713`
}

const app = firebase.initializeApp(FIREBASE_CONFIG);

const db = firebase.firestore();

db.collection(`characters`).get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
    });
});
