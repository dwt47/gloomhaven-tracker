import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import React from 'react';

const FIREBASE_CONFIG = {
  apiKey: process.env.GATSBY_FIREBASE_API_KEY,
  authDomain: `gloomhaven-tracker-47.firebaseapp.com`,
  databaseURL: `https://gloomhaven-tracker-47.firebaseio.com`,
  projectId: `gloomhaven-tracker-47`,
  storageBucket: `gloomhaven-tracker-47.appspot.com`,
  messagingSenderId: `225471931713`
}

firebase.initializeApp(FIREBASE_CONFIG);

/** STORE **/
const firebaseStore = firebase.firestore();

const StoreContext = React.createContext(firebaseStore);
export function useStore() {
	return React.useContext(StoreContext);
}

/** AUTH **/
const BLANK_USER = {
  uid: '',
  email: '',
  displayName: '',
  photoURL: '',
};

const auth = firebase.auth;
function signIn(provider, data) {
  switch (provider) {
    // the auth listener will handle the success cases
    case 'google':
      return auth()
        .signInWithPopup(new auth.GoogleAuthProvider())
        .catch(error => {
          console.error(error);
          return error;
        });
    case 'email':
      const { email = '', password = '' } = data || {};
      return auth()
        .createUserWithEmailAndPassword(email, password)
        .catch(error => {
          // eslint-disable-next-line no-console
          console.error(error);
          // TODO: notify the user of the error
          return error;
        });
    default:
      const reason = 'Invalid provider passed to signIn method';
      console.error(reason);
      return Promise.reject(reason);
  }
}

function signOut() {
  return auth().signOut();
}

const AuthContext = React.createContext(BLANK_USER);
function AuthProvider({children}) {
  const [user, setUser] = React.useState(BLANK_USER);

  React.useEffect(() => {
    // onAuthStateChanged returns an unsubscribe method
    const unsubscribe = auth().onAuthStateChanged(
      // `newUser` will be "false-y" if logging out
      newUser => setUser(newUser ? newUser : BLANK_USER)
    );

    return unsubscribe;
  }, [auth, setUser])

  const authData = {
    user,
    isLoggedIn: !!user.uid,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={authData}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  return React.useContext(AuthContext);
}

export function useUser() {
  const { user = BLANK_USER } = React.useContext(AuthContext);
  return user;
}

/** PROVIDER **/
export function FirebaseProvider({ children }) {
  return (
    <AuthProvider>
      <StoreContext.Provider>
        {children}
      </StoreContext.Provider>
    </AuthProvider>
  );
}
