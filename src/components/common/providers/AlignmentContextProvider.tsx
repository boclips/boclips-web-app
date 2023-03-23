import React, { createContext, useContext } from 'react';
import { Provider } from 'boclips-api-client/dist/sub-clients/alignments/model/provider/Provider';

interface Props {
  provider: Provider;
  children: React.ReactNode;
}

const alignmentProviderContext = createContext<Provider>(null);

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
