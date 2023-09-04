import React, { useContext, createContext, useReducer } from 'react';
import { ADVERTISE_FETCHING, ADVERTISE_SUCCESS, ADVERTISE_FAILED } from './type';

const AdvertiseStateContext = createContext();
const AdvertiseDispatchContext = createContext();

const INITIAL_STATE = {
  loading: true,
  advertises: [],
};

const AdvertiseReducer = (state, action) => {
  switch (action.type) {
    case ADVERTISE_FETCHING: {
      return { ...state, loading: true };
    }
    case ADVERTISE_SUCCESS: {
      return { ...state, loading: false, advertises: action.payload };
    }
    case ADVERTISE_FAILED: {
      return { ...state, advertises: [], loading: false };
    }
    default:
      return state;
  }
};

function useAdvertiseState() {
  const context = useContext(AdvertiseStateContext);
  if (context === undefined) {
    throw new Error('useAdvertiseState must be used within a AdvertiseProvider');
  }
  return context;
}

function useAdvertiseDispatch() {
  const context = useContext(AdvertiseDispatchContext);
  if (context === undefined) {
    throw new Error('useAdvertiseDispatch must be used within a AdvertiseProvider');
  }
  return context;
}

function AdvertiseProvider({ children }) {
  const [state, dispatch] = useReducer(AdvertiseReducer, INITIAL_STATE);
  return (
    <AdvertiseStateContext.Provider value={state}>
      <AdvertiseDispatchContext.Provider value={dispatch}>{children}</AdvertiseDispatchContext.Provider>
    </AdvertiseStateContext.Provider>
  );
}

export { AdvertiseProvider, useAdvertiseState, useAdvertiseDispatch };
