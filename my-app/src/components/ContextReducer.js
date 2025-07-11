//ContextReducer.js

import React, { createContext, useContext, useReducer } from 'react';

// Create two contexts
const CartStateContext = createContext();
const CartDispatchContext = createContext();

// Reducer function to manage cart state
const reducer = (state, action) => {
    switch (action.type) {
        case 'ADD':
            return [...state,{id:action.id,name:action.name,qty:action.qty,size:action.size,price:action.price,img:action.img}];
        case 'REMOVE':
            return state.filter((_, index) => index !== action.index);
        case 'CLEAR':
            return [];
        default:
            throw new Error(`Unknown action type: ${action.type}`);
    }
};

// CartProvider to wrap your app or component tree
export const CartProvider = ({ children }) => {
const [state, dispatch] = useReducer(reducer, []);

  return (
    <CartDispatchContext.Provider value={dispatch}>
      <CartStateContext.Provider value={state}>
        {children}
      </CartStateContext.Provider>
    </CartDispatchContext.Provider>
  );
};


// Custom hooks for consuming state and dispatch
export const useCart = () => useContext(CartStateContext);
export const useDispatchCart = () => useContext(CartDispatchContext);
