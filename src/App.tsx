
import React, {useState} from 'react';
import {
  Components,
  hooks
} from '@reef-chain/react-lib';
import {
  extension
} from '@reef-chain/util-lib';


import './App.css';
import useConnectedWallet from './hooks/useConnectedWallet';

export const availableWallOptions = [
  Components.walletSelectorOptions[extension.REEF_EXTENSION_IDENT],
  Components.walletSelectorOptions[extension.REEF_WALLET_CONNECT_IDENT],
]


function App() {
  const {selExtensionName,setSelExtensionName} = useConnectedWallet();
  
  const onExtensionSelected = async(ident: string) => {
    console.log('extension changed to ', ident);
    setSelExtensionName(ident);
  }

  return (
    <div className="App">
        {
          selExtensionName && <div>Selected Extension: {selExtensionName}</div>
        }
        <Components.WalletSelector 
          availableExtensions={availableWallOptions}
          onExtensionSelect={(ext: string) => setSelExtensionName(ext)}
        />
    </div>
  );
}

export default App;
