import React, { useContext, createContext, useReducer } from 'react';
import { NEWS_FETCHING, NEWS_SUCCESS, NEWS_FAILED } from './type';

const NewsStateContext = createContext();
const NewsDispatchContext = createContext();

const INITIAL_STATE = {
  loading: true,
  news: [],
};

const NewsReducer = (state, action) => {
  switch (action.type) {
    case NEWS_FETCHING: {
      return { ...state, loading: true };
    }
    case NEWS_SUCCESS: {
      return { ...state, loading: false, news: action.payload };
    }
    case NEWS_FAILED: {
      return { ...state, news: [], loading: false };
    }
    default:
      return state;
  }
};

function useNewsState() {
  const context = useContext(NewsStateContext);
  if (context === undefined) {
    throw new Error('useNewsState must be used within a NewsProvider');
  }
  return context;
}

function useNewsDispatch() {
  const context = useContext(NewsDispatchContext);
  if (context === undefined) {
    throw new Error('useNewsDispatch must be used within a NewsProvider');
  }
  return context;
}

function NewsProvider({ children }) {
  const [state, dispatch] = useReducer(NewsReducer, INITIAL_STATE);
  return (
    <NewsStateContext.Provider value={state}>
      <NewsDispatchContext.Provider value={dispatch}>{children}</NewsDispatchContext.Provider>
    </NewsStateContext.Provider>
  );
}

export { NewsProvider, useNewsState, useNewsDispatch };
