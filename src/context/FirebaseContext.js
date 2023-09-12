import PropTypes from 'prop-types';
import { createContext, useEffect, useReducer, useState } from 'react';
// import { initializeApp } from 'firebase/app';
// import { getFirestore, collection, doc, getDocs, getDoc, setDoc } from 'firebase/firestore';
import {
  getAuth,
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

import { firebase } from '../config';
import { UpdateUserAPI } from '../api';
// const firebaseApp = initializeApp(firebase);
const AUTH = getAuth(firebase);
const DB = getFirestore(firebase);

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};

const reducer = (state, action) => {
  if (action.type === 'INITIALISE') {
    const { isAuthenticated, user } = action.payload;
    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
    };
  }

  return state;
};

const AuthContext = createContext({
  ...initialState,
  method: 'firebase',
  login: () => Promise.resolve(),
  register: () => Promise.resolve(),
  logout: () => Promise.resolve(),
});

AuthProvider.propTypes = {
  children: PropTypes.node,
};

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // const [profile] = useState(null);
  const [creatingNewUser, setCreatingNewUser] = useState(false);

  useEffect(
    () =>
      onAuthStateChanged(AUTH, async (user) => {
        if (user) {
          const userRef = doc(DB, 'users', user.uid);
          const docSnap = await getDoc(userRef);

          const profile = docSnap.data();

          if (!creatingNewUser) {
            dispatch({
              type: 'INITIALISE',
              payload: { isAuthenticated: true, user: { ...user, ...profile } },
            });
          }
        } else {
          dispatch({
            type: 'INITIALISE',
            payload: { isAuthenticated: false, user: null },
          });
        }
      }),
    [dispatch, creatingNewUser]
  );

  const login = (email, password) => signInWithEmailAndPassword(AUTH, email, password);

  const register = async ({ fullName, phoneNo, email, password, img, token, notification, userType, createdAt }) => {
    setCreatingNewUser(true);
    const res = await createUserWithEmailAndPassword(AUTH, email, password);
    console.log(res.user.uid);
    const newItme = {
      uid: res.user.uid,
      fullName,
      phoneNo,
      email,
      // password: '',
      img,
      token,
      notification,
      userType,
      createdAt,
    };
    UpdateUserAPI(newItme);

    // const userRef = doc(DB, 'users', res.user.uid);
    // await setDoc(userRef, { fullName, email, password, userType });
    setCreatingNewUser(true);
    return res;
  };

  const logout = () => signOut(AUTH);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'firebase',
        user: {
          uid: state?.user?.uid,
          fullName: state.user?.fullName || '',
          email: state?.user?.email,
          userType: state.user?.userType,
        },
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
