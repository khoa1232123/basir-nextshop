import React, { createContext, useReducer } from 'react';
import { cartTypes, orderTypes } from '../utils/types';

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
    case orderTypes.ORDER_SET:
      return {
        ...state,
        order: action.payload,
      };
    default:
      return state;
  }
}

const initialState = {
  cart: { loading: false },
  order:
    typeof window !== 'undefined' &&
    window.localStorage.getItem('order_receipt')
      ? JSON.parse(window.localStorage.getItem('order_receipt'))
      : null,
};

export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
