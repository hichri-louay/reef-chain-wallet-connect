import React, { createContext, useState, useContext, ReactNode } from 'react';
import { extension as reefExt } from '@reef-chain/util-lib';

interface ConnectedWalletContextProps {
  selExtensionName: string|undefined;
  setSelExtensionName: (_ident: string|undefined) => void;
}

const ConnectedWalletContext = createContext<ConnectedWalletContextProps | undefined>(undefined);

export const ConnectedWalletProvider = ({ children }: { children: ReactNode }) => {
  let selectedWallet: string | null = null;
  try {
    selectedWallet = localStorage.getItem(reefExt.SELECTED_EXTENSION_IDENT);
  } catch (e) {
    // when cookies disabled localStorage can throw
  }

  const [ident, setIdent] = useState<string|undefined>(selectedWallet||undefined);

  const setSelExtensionName = (_ident: string|undefined) => {
    setIdent(_ident);
  };

  return (
    <ConnectedWalletContext.Provider value={{ selExtensionName:ident, setSelExtensionName }}>
      {children}
    </ConnectedWalletContext.Provider>
  );
};

export default ConnectedWalletContext;