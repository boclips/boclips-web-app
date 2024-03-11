import React, { createContext, useContext } from 'react';

interface ShareCodeReferer {
  shareCode?: string;
  referer?: string;
}

interface Props {
  shareCodeReferer: ShareCodeReferer;
  children: React.ReactNode;
}

const ShareCodeRefererContext = createContext<ShareCodeReferer>(null);

export const ShareCodeRefererContextProvider = ({
  children,
  shareCodeReferer,
}: Props) => {
  return (
    <ShareCodeRefererContext.Provider value={shareCodeReferer}>
      {children}
    </ShareCodeRefererContext.Provider>
  );
};

export const useShareCodeReferer = () => {
  const context = useContext(ShareCodeRefererContext);
  return context;
};
