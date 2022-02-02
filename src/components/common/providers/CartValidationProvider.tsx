import React, { createContext, useContext, useState } from 'react';

interface Props {
  children: React.ReactNode;
}

interface CartItemValidation {
  trim: {
    isFromValid: boolean;
    isToValid: boolean;
  };
  editRequest: {
    isValid: boolean;
  };
}

type CartItemValidationMap = { [key in string]: CartItemValidation };

const queryClientContext = createContext<{
  isCartValid: boolean;
  cartItemsValidation: CartItemValidationMap;
  setCartItemsValidation: React.Dispatch<
    React.SetStateAction<CartItemValidationMap>
  >;
}>(null);

export const CartValidationProvider = ({ children }: Props) => {
  const value = useProvideValidation();

  return (
    <queryClientContext.Provider value={value}>
      {children}
    </queryClientContext.Provider>
  );
};

export const useCartValidation = () => {
  return useContext(queryClientContext);
};

const useProvideValidation = () => {
  const [cartItemsValidation, setCartItemsValidation] =
    useState<CartItemValidationMap>({});

  const isCartValid = Object.values(cartItemsValidation).every((item) => {
    return (
      item.trim?.isFromValid &&
      item.trim?.isToValid &&
      item.editRequest?.isValid
    );
  });

  return {
    isCartValid,
    cartItemsValidation,
    setCartItemsValidation,
  };
};
