import React, { useContext, createContext, useReducer } from 'react';
import { ASSOCIATIONS_FETCHING, ASSOCIATIONS_SUCCESS, ASSOCIATIONS_FAILED } from './type';

const AssociationsStateContext = createContext();
const AssociationsDispatchContext = createContext();

const INITIAL_STATE = {
  loading: true,
  associations: [],
};

const AssociationsReducer = (state, action) => {
  switch (action.type) {
    case ASSOCIATIONS_FETCHING: {
      return { ...state, loading: true };
    }
    case ASSOCIATIONS_SUCCESS: {
      return { ...state, loading: false, associations: action.payload };
    }
    case ASSOCIATIONS_FAILED: {
      return { ...state, associations: [], loading: false };
    }
    default:
      return state;
  }
};

function useAssociationsState() {
  const context = useContext(AssociationsStateContext);
  if (context === undefined) {
    throw new Error('useAssociationsState must be used within a AssociationsProvider');
  }
  return context;
}

function useAssociationsDispatch() {
  const context = useContext(AssociationsDispatchContext);
  if (context === undefined) {
    throw new Error('useAssociationsDispatch must be used within a AssociationsProvider');
  }
  return context;
}

function AssociationsProvider({ children }) {
  const [state, dispatch] = useReducer(AssociationsReducer, INITIAL_STATE);
  return (
    <AssociationsStateContext.Provider value={state}>
      <AssociationsDispatchContext.Provider value={dispatch}>{children}</AssociationsDispatchContext.Provider>
    </AssociationsStateContext.Provider>
  );
}

export { AssociationsProvider, useAssociationsState, useAssociationsDispatch };
