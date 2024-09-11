import React, { createContext, useState, ReactNode } from 'react';


interface WcPreloaderProps {
  loading: {
    value:boolean;
    message:string;
  };
  setLoading: (_loading:{
    value:boolean;
    message:string;
  }) => void;
}

const WcPreloaderContext = createContext<WcPreloaderProps | undefined>(undefined);

export const WcPreloaderProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setIsLoading] = useState<{
    value:boolean;
    message:string;
  }>({
    value:false,
    message:""
  });

  const setLoading = (_loading:{
    value:boolean;
    message:string;
  }) => {
    setIsLoading(_loading);
  };

  return (
    <WcPreloaderContext.Provider value={{ loading, setLoading }}>
      {children}
    </WcPreloaderContext.Provider>
  );
};

export default WcPreloaderContext;