import React, { createContext, useContext, useState } from 'react';

interface Props {
  children: React.ReactNode;
  triggerOpen?: boolean;
}

const themeMobileMenuContext = createContext(null);

export const ThemeMobileMenuProvider = ({ children, triggerOpen }: Props) => {
  const value = useThemeMobileMenu();

  if (triggerOpen) {
    value.isOpen = triggerOpen;
  }

  return (
    <themeMobileMenuContext.Provider value={value}>
      {children}
    </themeMobileMenuContext.Provider>
  );
};

export const useThemeMobileMenuContext = () => {
  return useContext(themeMobileMenuContext);
};

export const useThemeMobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  if (isOpen) {
    document.querySelector('body').style.overflow = 'hidden';
  } else {
    document.querySelector('body').style.overflow = 'auto';
  }

  return { isOpen, setIsOpen };
};
