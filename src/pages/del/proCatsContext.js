import React, { useContext, createContext, useReducer } from 'react';
import { PROCATS_FETCHING, PROCATS_SUCCESS, PROCATS_FAILED } from '../../context/type';

const ProCatsStateContext = createContext();
const ProCatsDispatchContext = createContext();

const INITIAL_STATE = {
  loading: true,
  proCats: [],
};

const ProCatsReducer = (state, action) => {
  switch (action.type) {
    case PROCATS_FETCHING: {
      return { ...state, loading: true };
    }
    case PROCATS_SUCCESS: {
      return { ...state, loading: false, proCats: action.payload };
    }
    case PROCATS_FAILED: {
      return { ...state, proCats: [], loading: false };
    }
    default:
      return state;
  }
};

function useProCatsState() {
  const context = useContext(ProCatsStateContext);
  if (context === undefined) {
    throw new Error('useProCatsState must be used within a ProCatsProvider');
  }
  return context;
}

function useProCatsDispatch() {
  const context = useContext(ProCatsDispatchContext);
  if (context === undefined) {
    throw new Error('useProCatsDispatch must be used within a ProCatsProvider');
  }
  return context;
}

function ProCatsProvider({ children }) {
  const [state, dispatch] = useReducer(ProCatsReducer, INITIAL_STATE);
  return (
    <ProCatsStateContext.Provider value={state}>
      <ProCatsDispatchContext.Provider value={dispatch}>{children}</ProCatsDispatchContext.Provider>
    </ProCatsStateContext.Provider>
  );
}

export { ProCatsProvider, useProCatsState, useProCatsDispatch };
