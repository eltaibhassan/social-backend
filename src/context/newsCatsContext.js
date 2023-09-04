import React, { useContext, createContext, useReducer } from 'react';
import { NEWSCATS_FETCHING, NEWSCATS_SUCCESS, NEWSCATS_FAILED } from './type';

const NewsCatsStateContext = createContext();
const NewsCatsDispatchContext = createContext();

const INITIAL_STATE = {
  loading: true,
  newsCats: [],
};

const NewsCatsReducer = (state, action) => {
  switch (action.type) {
    case NEWSCATS_FETCHING: {
      return { ...state, loading: true };
    }
    case NEWSCATS_SUCCESS: {
      return { ...state, loading: false, newsCats: action.payload };
    }
    case NEWSCATS_FAILED: {
      return { ...state, newsCats: [], loading: false };
    }
    default:
      return state;
  }
};

function useNewsCatsState() {
  const context = useContext(NewsCatsStateContext);
  if (context === undefined) {
    throw new Error('useNewsCatsState must be used within a NewsCatsProvider');
  }
  return context;
}

function useNewsCatsDispatch() {
  const context = useContext(NewsCatsDispatchContext);
  if (context === undefined) {
    throw new Error('useNewsCatsDispatch must be used within a NewsCatsProvider');
  }
  return context;
}

function NewsCatsProvider({ children }) {
  const [state, dispatch] = useReducer(NewsCatsReducer, INITIAL_STATE);
  return (
    <NewsCatsStateContext.Provider value={state}>
      <NewsCatsDispatchContext.Provider value={dispatch}>{children}</NewsCatsDispatchContext.Provider>
    </NewsCatsStateContext.Provider>
  );
}

export { NewsCatsProvider, useNewsCatsState, useNewsCatsDispatch };
