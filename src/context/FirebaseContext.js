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
import { firebase } from '../config';

// const firebaseApp = initializeApp(firebase);
const AUTH = getAuth(firebase);
// const DB = getFirestore(firebase);

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

  const [profile] = useState(null);
  const [creatingNewUser, setCreatingNewUser] = useState(false);

  useEffect(
    () =>
      onAuthStateChanged(AUTH, async (user) => {
        if (user) {
          if (!creatingNewUser) {
            dispatch({
              type: 'INITIALISE',
              payload: { isAuthenticated: true, user },
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

  const register = async (email, password) => {
    setCreatingNewUser(true);
    await createUserWithEmailAndPassword(AUTH, email, password);
    setCreatingNewUser(true);
  };

  const logout = () => signOut(AUTH);
  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'firebase',
        user: {
          _id: profile?._id || '',
          uid: state?.user?.uid,
          arName: profile?.arName || '',
          enName: profile?.enName || '',
          arDescription: profile?.arDescription || '',
          enDescription: profile?.enDescription || '',
          phone: profile?.phone || '',
          email: state?.user?.email,
          role: profile?.userType,
          accessToken: state.user?.accessToken,
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
