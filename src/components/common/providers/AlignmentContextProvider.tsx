import React, { createContext, useContext } from 'react';
import { AlignmentProvider } from 'src/views/alignments/provider/AlignmentProvider';

interface Props {
  provider: AlignmentProvider;
  children: React.ReactNode;
}

const alignmentProviderContext = createContext<AlignmentProvider>(null);

export const AlignmentContextProvider = ({ children, provider }: Props) => {
  return (
    <alignmentProviderContext.Provider value={provider}>
      {children}
    </alignmentProviderContext.Provider>
  );
};

export const useAlignmentProvider = () => {
  const context = useContext(alignmentProviderContext);

  if (!context) {
    throw 'No alignment provider found. Try wrapping your component with <AlignmentContextProvider provider={someProvider}>';
  }

  return context;
};
