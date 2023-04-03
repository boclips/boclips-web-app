import React, { createContext, useContext, useState } from 'react';
import useFeatureFlags from 'src/hooks/useFeatureFlags';

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

  const { features } = useFeatureFlags();
  const isCartValid = Object.values(cartItemsValidation).every((item) => {
    return (
      ((features.BO_WEB_APP_REQUEST_TRIMMING &&
        item.trim?.isFromValid &&
        item.trim?.isToValid) ||
        !features.BO_WEB_APP_REQUEST_TRIMMING) &&
      ((features.BO_WEB_APP_REQUEST_ADDITIONAL_EDITING &&
        item.editRequest?.isValid) ||
        !features.BO_WEB_APP_REQUEST_ADDITIONAL_EDITING)
    );
  });

  return {
    isCartValid,
    cartItemsValidation,
    setCartItemsValidation,
  };
};
