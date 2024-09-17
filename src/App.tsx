
import React, {useEffect, useMemo, useState} from 'react';
import {
  Components,
  hooks,
  ReefSigner
} from '@reef-chain/react-lib';
import Uik from '@reef-chain/ui-kit';
import {
  extension as reefExt
} from '@reef-chain/util-lib';
import NetworkSwitch, { setSwitching } from './context/NetworkSwitch';
import useWcPreloader from './hooks/useWcPreloader';
import { connectWc } from './utils/walletConnect';
import './App.css';
import useConnectedWallet from './hooks/useConnectedWallet';
import { network as nw } from '@reef-chain/util-lib';
import { Signer as EvmSigner} from '@reef-chain/evm-provider/Signer'
import { Provider as ReefProvider } from '@reef-chain/evm-provider/Provider'
import { Signer, Contract, BigNumber } from 'ethers';
import { Signer as EtherSigner } from '@ethersproject/abstract-signer'
import Nav from './components/Nav/Nav';


export  const convertToReadableFormat = (value) => {
  const decimalValue = BigInt(!!value ? value : 0);
  return decimalValue /BigInt(Math.pow(10, 18));
};
export const getDAOToken = (account, network) => {
  if(network === 'testnet') {
    const contractAddress = '0x9001369C17044CA19b4376182aaD81BBCB01Ba1c'
  console.log({account: account})
  const contractAbi = 
    [{"type":"constructor","inputs":[{"name":"initialSupply","type":"uint256","internalType":"uint256"}],"stateMutability":"nonpayable"},{"name":"ERC20InsufficientAllowance","type":"error","inputs":[{"name":"spender","type":"address","internalType":"address"},{"name":"allowance","type":"uint256","internalType":"uint256"},{"name":"needed","type":"uint256","internalType":"uint256"}]},{"name":"ERC20InsufficientBalance","type":"error","inputs":[{"name":"sender","type":"address","internalType":"address"},{"name":"balance","type":"uint256","internalType":"uint256"},{"name":"needed","type":"uint256","internalType":"uint256"}]},{"name":"ERC20InvalidApprover","type":"error","inputs":[{"name":"approver","type":"address","internalType":"address"}]},{"name":"ERC20InvalidReceiver","type":"error","inputs":[{"name":"receiver","type":"address","internalType":"address"}]},{"name":"ERC20InvalidSender","type":"error","inputs":[{"name":"sender","type":"address","internalType":"address"}]},{"name":"ERC20InvalidSpender","type":"error","inputs":[{"name":"spender","type":"address","internalType":"address"}]},{"name":"Approval","type":"event","inputs":[{"name":"owner","type":"address","indexed":true,"internalType":"address"},{"name":"spender","type":"address","indexed":true,"internalType":"address"},{"name":"value","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"name":"Transfer","type":"event","inputs":[{"name":"from","type":"address","indexed":true,"internalType":"address"},{"name":"to","type":"address","indexed":true,"internalType":"address"},{"name":"value","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"name":"allowance","type":"function","inputs":[{"name":"owner","type":"address","internalType":"address"},{"name":"spender","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"name":"approve","type":"function","inputs":[{"name":"spender","type":"address","internalType":"address"},{"name":"value","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"bool","internalType":"bool"}],"stateMutability":"nonpayable"},{"name":"balanceOf","type":"function","inputs":[{"name":"account","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"name":"decimals","type":"function","inputs":[],"outputs":[{"name":"","type":"uint8","internalType":"uint8"}],"stateMutability":"view"},{"name":"name","type":"function","inputs":[],"outputs":[{"name":"","type":"string","internalType":"string"}],"stateMutability":"view"},{"name":"symbol","type":"function","inputs":[],"outputs":[{"name":"","type":"string","internalType":"string"}],"stateMutability":"view"},{"name":"totalSupply","type":"function","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"name":"transfer","type":"function","inputs":[{"name":"to","type":"address","internalType":"address"},{"name":"value","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"bool","internalType":"bool"}],"stateMutability":"nonpayable"},{"name":"transferFrom","type":"function","inputs":[{"name":"from","type":"address","internalType":"address"},{"name":"to","type":"address","internalType":"address"},{"name":"value","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"bool","internalType":"bool"}],"stateMutability":"nonpayable"}]
  

  const contract = new Contract(contractAddress, contractAbi, account.signer);
  
 
  // Create contract instance using the Reef signer
  return contract
  } return undefined
  
}




export const  { WalletSelector, walletSelectorOptions } = Components
const SIGNER_POINTER = 'reef-app-signer-pointer';

export const saveSignerLocalPointer = (index: number): void => {
  localStorage.setItem(SIGNER_POINTER, `${index}`);
};

export const getSignerLocalPointer = (): number => {
  const item = localStorage.getItem(SIGNER_POINTER);
  return item ? parseInt(item, 10) : 0;
};
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
  const [userBalanceERC20, setUserBalanceERC20] = useState<BigInt | undefined>(BigInt(0))
  const [walletDestination, setWalletDestination] = useState<string | undefined>(undefined)
  const [tokenSymbol, setTokenSymbol] = useState<string | undefined>(undefined)
  const [transactionHash, setTransactionHash] = useState<any | undefined>(undefined)
  const [switchingNetwork, setSwitchingNetwork] = useState<boolean | undefined>(true)
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
  const selectedNetwork = useMemo(() => {
    if(!!network) {
      console.log({network})
      return network.name;
    } 
    return undefined;
    
  }, [network]);

  const availableWallOptions = [
    walletSelectorOptions[reefExt.REEF_EXTENSION_IDENT],
    walletSelectorOptions[reefExt.REEF_WALLET_CONNECT_IDENT],
  ]

  useEffect(() => {
    console.log({loading})
    if (!loading && isNetworkSwitching) setNetworkSwitching(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  useEffect(() => {
    console.log({error})
    if(error?.code === 1) { 
      setSelExtensionName(undefined);
    }
    if (selExtensionName === reefExt.REEF_SNAP_IDENT && error?.code === 2) {
      //history.push(SNAP_URL);
    }
  }, [extension, error]);

  useEffect(()=>{
    setAccounts([]);
    setSelectedSigner(undefined);
    setUserBalance(undefined)
    //getDAOToken(reefState.signer);
  },[selExtensionName])
  useEffect(()=>{
    setAccounts(signers);
    setSelectedSigner(selectedReefSigner);
    setUserBalance(convertToReadableFormat(selectedReefSigner?.balance._hex))
    //getTokenSymbol(selectedReefSigner);
    reefState.setAccounts(signers)
    //getDAOToken(reefState.signer);
    console.log({signers, balance: selectedReefSigner?.balance, network})
    if(signers?.length && signers?.indexOf(selectedReefSigner!)==-1){

      reefState.setSelectedAddress(signers[0].address)
      reefState.setAccounts(signers)
      setUserBalance(convertToReadableFormat(selectedReefSigner?.balance._hex))
      getTokenSymbol(selectedReefSigner);
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
    console.log({value})
    const decimalValue = BigNumber.from(!!value ? value : 0);
    return decimalValue.toBigInt();
  };
  const handleDropdownItemClick = (extension: string) => {
    onExtensionSelected(extension);
  };


  const connectWallet = (extension: string) => {
    onExtensionSelected(extension);
  };

  const handleConnectClick = () => {
    console.log('connect clicked');
    setDropdownOpen(!dropdownOpen);
  }

  const selectNetwork = (key: 'mainnet' | 'testnet'): void => {
    setSwitchingNetwork(false);
    const toSelect = appAvailableNetworks.find((item) => item.name === key);
    networkSwitch.setSwitching(true);
    console.log({toSelect})
   

    if (toSelect) {
      reefState.setSelectedNetwork(toSelect);
      setSwitchingNetwork(true);
    }
  };

  const selectAccount = (index: number | null): void => {
    saveSignerLocalPointer(index || 0);
    console.log({index})
    reefState.setSelectedAddress(index != null ? accounts?.[index].address : undefined);
  };

  const handleSelectWallet = (index) => {
    reefState.setSelectedAddress(signers[index].address)
    setUserBalance(convertToReadableFormat(selectedReefSigner?.balance._hex))
  }

  /*const handleNetworkChange = (key: string) => {
    //console.log('network changed to ', key);
    setSelectedNetwork(key);
    //const networkToChange = appAvailableNetworks.find((network) => network.name === key);
    //reefState.setSelectedNetwork(networkToChange!);
  }*/

  const getUserBalance = async (account) => {
    const contract = getDAOToken(account, network.name);
    const userBalance = !!contract && await contract.balanceOf(account.evmAddress);
    console.log({userBalance})
    setUserBalanceERC20(convertToReadableFormat(userBalance._hex))
    
  }

  const getTokenSymbol = async (account) => { 
    const contract = getDAOToken(account, network.name);
    const tokenSymbol = !!contract && await contract.symbol();
    console.log({tokenSymbol})
    setTokenSymbol(tokenSymbol)
    //return tokenSymbol;
  }


  const transfert = async (account) => {  
      const contract = getDAOToken(account, network.name);
      const tx = !!contract && await contract.transfer(walletDestination, 1000);
      setTransactionHash(tx)
      console.log({tx})
  }

  return (
    <>
        {
          !(!!signers)
              ?
              (
                <>
                {
                  !selExtensionName && (
<WalletSelector 
                onExtensionSelect={(extName: string) => onExtensionSelected(extName)} 
                availableExtensions={availableWallOptions}
              />
                  )
                }
                  <Uik.Modal
              title={"Connecting to wallet"}
              isOpen={!!selExtensionName}
            >
              <div className="connecting-modal-content">
                <Uik.Loading />
                <Uik.Button onClick={() => setSelExtensionName(undefined)}>Cancel connection</Uik.Button>
              </div>
            </Uik.Modal>
                </>
              ) 
              :
              (

                <>
                 <NetworkSwitch.Provider value={networkSwitch}>
                    <Nav
                      accounts={accounts}
                      selectedSigner={selectedSigner}
                      selExtensionName={selExtensionName}
                      availableWallOptions={availableWallOptions}
                      selectedNetwork={!!network ? network?.name : 'mainnet'}
                      setSelExtensionName={setSelExtensionName}
                      selectAccount={selectAccount}
                      selectNetwork={selectNetwork}/>         
{
  !!signers && (
    <>
    <p>Contract methods of ERC20 Methods :</p>
<div>
  <p>Get user balance : </p>
  <button onClick={() => getUserBalance(selectedReefSigner)}>Balance</button>
  <Uik.Button>
    Test
  </Uik.Button>
      <p>{userBalanceERC20?.toString()} {tokenSymbol}</p>
    
  <Uik.Input></Uik.Input>
</div>

<div>
  <p>transfert token : </p>
  <input 
    onChange={(e) => setWalletDestination(e.target.value)}
  />
  <button onClick={() => transfert(selectedReefSigner)}>Send</button>
 
      <p>{userBalanceERC20?.toString()} {tokenSymbol}</p>
    
  
</div>

    <Uik.Modal
      isOpen={!!transactionHash}
      title='Transaction Sent Successfully'
      onClose={() => setTransactionHash(undefined)}
    >
      <p>
        You have sent Successfully !!!
      </p>
    </Uik.Modal>
    </>
  )
}

    </NetworkSwitch.Provider>

</>
              )
        }
    </>

    
  );
}

export default App;
