import React, { createContext, useContext, useReducer, ReactNode } from 'react';

type CartAction =
  | { type: 'SET_COUNT'; payload: number }  // set exact number
  | { type: 'CLEAR_CART' };

interface CartState {
  count: number;
}

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'SET_COUNT':
      return { count: action.payload }; // directly set from API
    case 'CLEAR_CART':
      return { count: 0 };
    default:
      return state;
  }
};

interface CartContextType extends CartState {
  setCount: (count: number) => void;
  clearCartData: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { count: 0 });

  const setCount = (count: number) => dispatch({ type: 'SET_COUNT', payload: count });
  const clearCartData = () => dispatch({ type: 'CLEAR_CART' });

  return (
    <CartContext.Provider value={{ ...state, setCount, clearCartData }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return context;
};
