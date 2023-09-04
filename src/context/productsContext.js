import React, { useContext, createContext, useReducer } from 'react';
import { PRODUCTS_FETCHING, PRODUCTS_SUCCESS, PRODUCTS_FAILED } from './type';

const ProductsStateContext = createContext();
const ProductsDispatchContext = createContext();

const INITIAL_STATE = {
  loading: true,
  products: [],
};

const ProductsReducer = (state, action) => {
  switch (action.type) {
    case PRODUCTS_FETCHING: {
      return { ...state, loading: true };
    }
    case PRODUCTS_SUCCESS: {
      return { ...state, loading: false, products: action.payload };
    }
    case PRODUCTS_FAILED: {
      return { ...state, products: [], loading: false };
    }
    default:
      return state;
  }
};

function useProductsState() {
  const context = useContext(ProductsStateContext);
  if (context === undefined) {
    throw new Error('useProductsState must be used within a ProductsProvider');
  }
  return context;
}

function useProductsDispatch() {
  const context = useContext(ProductsDispatchContext);
  if (context === undefined) {
    throw new Error('useProductsDispatch must be used within a ProductsProvider');
  }
  return context;
}

function ProductsProvider({ children }) {
  const [state, dispatch] = useReducer(ProductsReducer, INITIAL_STATE);
  return (
    <ProductsStateContext.Provider value={state}>
      <ProductsDispatchContext.Provider value={dispatch}>{children}</ProductsDispatchContext.Provider>
    </ProductsStateContext.Provider>
  );
}

export { ProductsProvider, useProductsState, useProductsDispatch };
