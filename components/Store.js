import React, { createContext, useReducer } from 'react';
import { cartTypes } from '../utils/types';

export const Store = createContext();

function reducer(state, action) {
  switch (action.type) {
    case cartTypes.CART_RETRIEVE_REQUEST:
      return {
        ...state,
        cart: { loading: true },
      };
    case cartTypes.CART_RETRIEVE_SUCCESS:
      return {
        ...state,
        cart: { loading: false, data: action.payload },
      };
    default:
      return state;
  }
}

const initialState = {
  cart: { loading: false },
  order: null,
};

export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
