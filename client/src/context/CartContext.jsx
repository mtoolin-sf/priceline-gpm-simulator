import React, { createContext, useContext, useReducer } from 'react';

const CartContext = createContext();

const initialState = {
  profile: null,
  items: [],
  channel: 'Online',
  eligiblePromos: null,
  executionResult: null,
  tjResult: null,
  blmResult: null,
  useMock: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_PROFILE': return { ...initialState, profile: action.payload };
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.id === action.payload.id);
      if (existing) {
        return { ...state, items: state.items.map(i => i.id === action.payload.id ? { ...i, qty: i.qty + 1 } : i) };
      }
      return { ...state, items: [...state.items, { ...action.payload, qty: 1 }] };
    }
    case 'REMOVE_ITEM': return { ...state, items: state.items.filter(i => i.id !== action.payload) };
    case 'UPDATE_QTY': return { ...state, items: state.items.map(i => i.id === action.payload.id ? { ...i, qty: action.payload.qty } : i).filter(i => i.qty > 0) };
    case 'SET_CHANNEL': return { ...state, channel: action.payload, eligiblePromos: null };
    case 'SET_ELIGIBLE_PROMOS': return { ...state, eligiblePromos: action.payload };
    case 'SET_EXECUTION_RESULT': return { ...state, executionResult: action.payload };
    case 'SET_TJ_RESULT': return { ...state, tjResult: action.payload };
    case 'SET_BLM_RESULT': return { ...state, blmResult: action.payload };
    case 'TOGGLE_MOCK': return { ...state, useMock: !state.useMock };
    case 'RESET': return initialState;
    default: return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return <CartContext.Provider value={{ state, dispatch }}>{children}</CartContext.Provider>;
}

export function useCart() { return useContext(CartContext); }
