
import React, {useEffect, useState} from 'react';
import {
  Components,
  hooks,
  ReefSigner
} from '@reef-chain/react-lib';
import {
  extension as reefExt
} from '@reef-chain/util-lib';


import './App.css';
import useConnectedWallet from './hooks/useConnectedWallet';

export const availableWallOptions = [
  Components.walletSelectorOptions[reefExt.REEF_EXTENSION_IDENT],
  Components.walletSelectorOptions[reefExt.REEF_WALLET_CONNECT_IDENT],
]

export const getIpfsGatewayUrl = (hash: string): string => `https://reef.infura-ipfs.io/ipfs/${hash}`;


function App() {
  const {selExtensionName,setSelExtensionName} = useConnectedWallet();
  const [accounts,setAccounts] = useState<ReefSigner[]>([]);
  const [selectedSigner,setSelectedSigner] = useState<ReefSigner | undefined>(undefined);
  const [dropdownOpen, setDropdownOpen] = useState<Boolean>(false);
  const {
    loading, error, signers, selectedReefSigner, network, provider, reefState, extension
  } = hooks.useInitReefStateExtension(
    'lhichri app', selExtensionName, { ipfsHashResolverFn: getIpfsGatewayUrl },
  );
  useEffect(()=>{
    setAccounts([]);
    setSelectedSigner(undefined);
  },[selExtensionName])
  useEffect(()=>{
    setAccounts(signers);
    setSelectedSigner(selectedReefSigner);
    console.log({signers})
    if(signers?.length && signers?.indexOf(selectedReefSigner!)==-1){
      reefState.setSelectedAddress(signers[0].address)
      console.log({selectedReefSigner})    }
  },[selectedReefSigner,signers])

  const onExtensionSelected = async(ident: string) => {
    console.log('extension changed to ', ident);
    setSelExtensionName(ident);
  }

  const handleDropdownItemClick = (extension: string) => {
    onExtensionSelected(extension);
  };

  const handleConnectClick = () => {
    console.log('connect clicked');
    setDropdownOpen(!dropdownOpen);
  }

  return (
    <div className="App">
      <nav className="navbar">
        <h1>Reef Chain Wallet</h1>
        {
          selectedSigner && (
            <div className="selected-wallet">
              <span>{selectedSigner.name}</span>
              <span>{selectedSigner.address}</span>
            </div>
          )
        }
        {
          !selectedSigner && (
            <div>
              <button className="connect-button" onClick={handleConnectClick}>
            Connect
            </button>
            {dropdownOpen && (
            <div className="dropdown-menu">
              <button
                className="dropdown-item"
                onClick={() => handleDropdownItemClick(reefExt.REEF_EXTENSION_IDENT)}
              >
                Reef Browser Wallet
              </button>
              <button
                className="dropdown-item"
                onClick={() => handleDropdownItemClick(reefExt.REEF_WALLET_CONNECT_IDENT)}
              >
                Wallet Connect
              </button>
            </div>
          )}
            </div>
            
          )
        }
        
        
      </nav>
        
      
    </div>
  );
}

export default App;
