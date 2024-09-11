
import React, {useEffect, useState} from 'react';
import {
  Components,
  hooks,
  ReefSigner
} from '@reef-chain/react-lib';
import {
  extension as reefExt
} from '@reef-chain/util-lib';
import NetworkSwitch, { setSwitching } from './context/NetworkSwitch';
import useWcPreloader from './hooks/useWcPreloader';
import { connectWc } from './utils/walletConnect';
import './App.css';
import useConnectedWallet from './hooks/useConnectedWallet';
import { network as nw } from '@reef-chain/util-lib';

export const availableWallOptions = [
  Components.walletSelectorOptions[reefExt.REEF_EXTENSION_IDENT],
  Components.walletSelectorOptions[reefExt.REEF_WALLET_CONNECT_IDENT],
]

export const getIpfsGatewayUrl = (hash: string): string => `https://reef.infura-ipfs.io/ipfs/${hash}`;
export const connectWalletConnect = async(ident:string,setSelExtensionName:any,setWcPreloader:any)=>{
  setWcPreloader({
    value:true,
    message:"initializing mobile app connection"
  });
  setSelExtensionName(undefined); //force setting this to different value from the ident initially or else it doesn't call useInitReefState hook

  const response:reefExt.WcConnection | undefined = await connectWc(setWcPreloader)
  console.log({response})
  console.log('connectWalletConnect',response);
      if (response) {
        reefExt.injectWcAsExtension(response, { name: reefExt.REEF_WALLET_CONNECT_IDENT, version: "1.0.0" });
        setSelExtensionName(ident);
        // display preloader 
        setWcPreloader({
          value:true,
          message:"wait while we are establishing a connection"
        });
      } else {
        // if proposal expired, recursively call
        await connectWalletConnect(ident,setSelExtensionName,setWcPreloader);
      }
    }

function App() {
  const {selExtensionName,setSelExtensionName} = useConnectedWallet();
  const [accounts,setAccounts] = useState<ReefSigner[]>([]);
  const [selectedSigner,setSelectedSigner] = useState<ReefSigner | undefined>(undefined);
  const [dropdownOpen, setDropdownOpen] = useState<Boolean>(false);
  const [userBalance, setUserBalance] = useState<BigInt | undefined>(BigInt(0))
  const {loading:wcPreloader,setLoading:setWcPreloader} = useWcPreloader()
  const {
    loading, error, signers, selectedReefSigner, network, provider, reefState, extension
  } = hooks.useInitReefStateExtension(
    'lhichri app', selExtensionName, { ipfsHashResolverFn: getIpfsGatewayUrl },
  );
  const [isNetworkSwitching, setNetworkSwitching] = useState(false);
  const networkSwitch = {
    isSwitching: isNetworkSwitching,
    setSwitching: (value: boolean) => setSwitching(value, setNetworkSwitching),
  };
  useEffect(()=>{
    setAccounts([]);
    setSelectedSigner(undefined);
    setUserBalance(undefined)
    
  },[selExtensionName])
  useEffect(()=>{
    setAccounts(signers);
    setSelectedSigner(selectedReefSigner);
    setUserBalance(convertToReadableFormat(selectedReefSigner?.balance._hex))
    console.log({signers, balance: selectedReefSigner?.balance, network})
    if(signers?.length && signers?.indexOf(selectedReefSigner!)==-1){
      reefState.setSelectedAddress(signers[0].address)
      setUserBalance(convertToReadableFormat(selectedReefSigner?.balance._hex))
      console.log({selectedReefSigner})    }
  },[selectedReefSigner,signers])
  const appAvailableNetworks = [nw.AVAILABLE_NETWORKS.mainnet, nw.AVAILABLE_NETWORKS.testnet];
  const onExtensionSelected = async(ident: string) => {
    console.log('extension changed to ', ident);
    if(ident === reefExt.REEF_WALLET_CONNECT_IDENT) {
      await connectWalletConnect(ident, setSelExtensionName, setWcPreloader)
    } else {
      setSelExtensionName(ident);
    }
    
  }
  const convertToReadableFormat = (value) => {
    const decimalValue = BigInt(!!value ? value : 0);
    return decimalValue /BigInt(Math.pow(10, 18));
  };
  const handleDropdownItemClick = (extension: string) => {
    onExtensionSelected(extension);
  };

  const handleConnectClick = () => {
    console.log('connect clicked');
    setDropdownOpen(!dropdownOpen);
  }

  const handleSelectWallet = (index) => {
    reefState.setSelectedAddress(signers[index].address)
    setUserBalance(convertToReadableFormat(selectedReefSigner?.balance._hex))
  }

  const handleNetworkChange = (key : string) => {
    console.log('network changed to ', key);
    const networkToChange = appAvailableNetworks.find((network) => network.name === key);
    reefState.setSelectedNetwork(networkToChange!);
  }

 

  return (
    <NetworkSwitch.Provider value={networkSwitch}>
      <div className="App">
      <nav className="navbar">
        <h1>Reef Chain Wallet</h1>
        <div>
          <button onClick={() => handleNetworkChange('mainnet')}>Mainnet</button>
          <button onClick={() => handleNetworkChange('testnet')}>Testnet</button>
        </div>
        
        {
          !!signers && (
            <div className="selected-wallet">
              {signers.map((signer, index) => (
        <div key={index}>
          <span>{signer.name}</span>
          <span style={{ 'marginLeft': '20px'}}> {signer.address}</span>
          <button style={{ 'marginLeft': '20px'}} onClick={() => handleSelectWallet(index)}>Select Wallet</button>
        </div>
      ))}

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


        {
          !!selectedSigner && (
            <div>
              <p>Address wallet selected is : {selectedSigner.address}</p>
              <p>Balance : {userBalance?.toString()}</p>
            </div>
          )
        }
        
        
      </nav>
        
      
    </div>
    </NetworkSwitch.Provider>
    
  );
}

export default App;
