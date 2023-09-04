import React, { useContext, createContext, useReducer } from 'react';
import { EVENTS_FETCHING, EVENTS_SUCCESS, EVENTS_FAILED } from './type';

const EventsStateContext = createContext();
const EventsDispatchContext = createContext();

const INITIAL_STATE = {
  loading: true,
  events: [],
};

const EventsReducer = (state, action) => {
  switch (action.type) {
    case EVENTS_FETCHING: {
      return { ...state, loading: true };
    }
    case EVENTS_SUCCESS: {
      return { ...state, loading: false, events: action.payload };
    }
    case EVENTS_FAILED: {
      return { ...state, events: [], loading: false };
    }
    default:
      return state;
  }
};

function useEventsState() {
  const context = useContext(EventsStateContext);
  if (context === undefined) {
    throw new Error('useEventsState must be used within a EventsProvider');
  }
  return context;
}

function useEventsDispatch() {
  const context = useContext(EventsDispatchContext);
  if (context === undefined) {
    throw new Error('useEventsDispatch must be used within a EventsProvider');
  }
  return context;
}

function EventsProvider({ children }) {
  const [state, dispatch] = useReducer(EventsReducer, INITIAL_STATE);
  return (
    <EventsStateContext.Provider value={state}>
      <EventsDispatchContext.Provider value={dispatch}>{children}</EventsDispatchContext.Provider>
    </EventsStateContext.Provider>
  );
}

export { EventsProvider, useEventsState, useEventsDispatch };
