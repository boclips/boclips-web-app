import React, { createContext, useContext, useState } from 'react';
import { useQueryClient } from 'react-query';
import { useHistory } from 'react-router-dom';

interface Props {
  children: React.ReactNode;
}

const queryClientContext = createContext<{ isError: boolean }>({
  isError: false,
});

export const GlobalQueryErrorProvider = ({ children }: Props) => {
  const isError = useProvideError();

  const value = React.useMemo(() => ({ isError }), [isError]);

  return (
    <queryClientContext.Provider value={value}>
      {children}
    </queryClientContext.Provider>
  );
};

export const useGlobalQueryError = () => {
  return useContext(queryClientContext);
};

const useProvideError = () => {
  const [isError, setIsError] = useState<boolean>(false);
  const client = useQueryClient();
  const currentLocation = useHistory().location?.pathname;

  React.useEffect(() => {
    if (isError) {
      client.clear();
    }
    // eslint-disable-next-line
  }, [currentLocation]);

  React.useEffect(() => {
    const queryCache = client.getQueryCache();
    const unsubscribeHandle = queryCache.subscribe(() => {
      setIsError(
        client
          .getQueryCache()
          .getAll()
          .some((query) => query.state.status === 'error'),
      );
    });

    return () => unsubscribeHandle();
  }, [client]);

  return isError;
};
