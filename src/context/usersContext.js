import React, { useContext, createContext, useReducer } from 'react';
import { USER_FETCHING, USER_SUCCESS, USER_FAILED } from './type';

const UsersStateContext = createContext();
const UsersDispatchContext = createContext();

const INITIAL_STATE = {
  loading: true,
  users: null,
};

const UsersReducer = (state, action) => {
  switch (action.type) {
    case USER_FETCHING: {
      return { ...state, loading: true };
    }
    case USER_SUCCESS: {
      return { ...state, loading: false, users: action.payload };
    }
    case USER_FAILED: {
      return { ...state, users: {}, loading: false };
    }
    default:
      return state;
  }
};

function useUsersState() {
  const context = useContext(UsersStateContext);
  if (context === undefined) {
    throw new Error('useUsersState must be used within a UsersProvider');
  }
  return context;
}

function useUsersDispatch() {
  const context = useContext(UsersDispatchContext);
  if (context === undefined) {
    throw new Error('useUsersDispatch must be used within a UsersProvider');
  }
  return context;
}

function UsersProvider({ children }) {
  const [state, dispatch] = useReducer(UsersReducer, INITIAL_STATE);
  return (
    <UsersStateContext.Provider value={state}>
      <UsersDispatchContext.Provider value={dispatch}>{children}</UsersDispatchContext.Provider>
    </UsersStateContext.Provider>
  );
}

export { UsersProvider, useUsersState, useUsersDispatch };
