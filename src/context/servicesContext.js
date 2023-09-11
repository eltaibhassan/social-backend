import React, { useContext, createContext, useReducer } from 'react';
import { PRODUCTS_FETCHING, PRODUCTS_SUCCESS, PRODUCTS_FAILED } from './type';

const ServicesStateContext = createContext();
const ServicesDispatchContext = createContext();

const INITIAL_STATE = {
  loading: true,
  services: [],
};

const ServicesReducer = (state, action) => {
  switch (action.type) {
    case PRODUCTS_FETCHING: {
      return { ...state, loading: true };
    }
    case PRODUCTS_SUCCESS: {
      return { ...state, loading: false, services: action.payload };
    }
    case PRODUCTS_FAILED: {
      return { ...state, services: [], loading: false };
    }
    default:
      return state;
  }
};

function useServicesState() {
  const context = useContext(ServicesStateContext);
  if (context === undefined) {
    throw new Error('useServicesState must be used within a ServicesProvider');
  }
  return context;
}

function useServicesDispatch() {
  const context = useContext(ServicesDispatchContext);
  if (context === undefined) {
    throw new Error('useServicesDispatch must be used within a ServicesProvider');
  }
  return context;
}

function ServicesProvider({ children }) {
  const [state, dispatch] = useReducer(ServicesReducer, INITIAL_STATE);
  return (
    <ServicesStateContext.Provider value={state}>
      <ServicesDispatchContext.Provider value={dispatch}>{children}</ServicesDispatchContext.Provider>
    </ServicesStateContext.Provider>
  );
}

export { ServicesProvider, useServicesState, useServicesDispatch };
