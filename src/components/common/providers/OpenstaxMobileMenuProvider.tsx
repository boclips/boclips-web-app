import React, { createContext, useContext, useState } from 'react';

interface Props {
  children: React.ReactNode;
  triggerOpen?: boolean;
}

const openStaxMobileMenuContext = createContext(null);

export const OpenstaxMobileMenuProvider = ({
  children,
  triggerOpen,
}: Props) => {
  const value = useOpenStaxMobileMenu();

  if (triggerOpen) {
    value.isOpen = triggerOpen;
  }

  return (
    <openStaxMobileMenuContext.Provider value={value}>
      {children}
    </openStaxMobileMenuContext.Provider>
  );
};

export const useOpenstaxMobileMenu = () => {
  return useContext(openStaxMobileMenuContext);
};

export const useOpenStaxMobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  if (isOpen) {
    document.querySelector('body').style.overflow = 'hidden';
  } else {
    document.querySelector('body').style.overflow = 'auto';
  }

  return { isOpen, setIsOpen };
};
