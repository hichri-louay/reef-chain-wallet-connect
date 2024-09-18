import React, { useEffect, useMemo, useState } from "react";
import { Components, hooks, ReefSigner } from "@reef-chain/react-lib";
import Uik from "@reef-chain/ui-kit";
import { extension as reefExt } from "@reef-chain/util-lib";
import NetworkSwitch, { setSwitching } from "./context/NetworkSwitch";
import useWcPreloader from "./hooks/useWcPreloader";
import { connectWc } from "./utils/walletConnect";
import "./App.css";
import useConnectedWallet from "./hooks/useConnectedWallet";
import { network as nw } from "@reef-chain/util-lib";
import { Signer as EvmSigner } from "@reef-chain/evm-provider/Signer";
import { Provider as ReefProvider } from "@reef-chain/evm-provider/Provider";
import { Signer, Contract, BigNumber } from "ethers";
import { Signer as EtherSigner } from "@ethersproject/abstract-signer";
import Nav from "./components/Nav/Nav";
import ReefContractInteractor from "./components/ReefContractInteractor/ReefContractInteractor";

export const convertToReadableFormat = (value) => {
  const decimalValue = BigInt(!!value ? value : 0);
  return decimalValue / BigInt(Math.pow(10, 18));
};


export const { WalletSelector, walletSelectorOptions } = Components;
const SIGNER_POINTER = "reef-app-signer-pointer";

export const saveSignerLocalPointer = (index: number): void => {
  localStorage.setItem(SIGNER_POINTER, `${index}`);
};

export const getSignerLocalPointer = (): number => {
  const item = localStorage.getItem(SIGNER_POINTER);
  return item ? parseInt(item, 10) : 0;
};
export const getIpfsGatewayUrl = (hash: string): string =>
  `https://reef.infura-ipfs.io/ipfs/${hash}`;
export const connectWalletConnect = async (
  ident: string,
  setSelExtensionName: any,
  setWcPreloader: any,
) => {
  setWcPreloader({
    value: true,
    message: "initializing mobile app connection",
  });
  setSelExtensionName(undefined);

  const response: reefExt.WcConnection | undefined =
    await connectWc(setWcPreloader);
  
 
  if (response) {
    reefExt.injectWcAsExtension(response, {
      name: reefExt.REEF_WALLET_CONNECT_IDENT,
      version: "1.0.0",
    });
    setSelExtensionName(ident);
    // display preloader
    setWcPreloader({
      value: true,
      message: "wait while we are establishing a connection",
    });
  } else {
    // if proposal expired, recursively call
    await connectWalletConnect(ident, setSelExtensionName, setWcPreloader);
  }
};

function App() {
  const { selExtensionName, setSelExtensionName } = useConnectedWallet();
  const [accounts, setAccounts] = useState<ReefSigner[]>([]);
  const [selectedSigner, setSelectedSigner] = useState<ReefSigner | undefined>(
    undefined,
  );
  const [dropdownOpen, setDropdownOpen] = useState<Boolean>(false);
  const [userBalance, setUserBalance] = useState<BigInt | undefined>(BigInt(0));
  const [userBalanceERC20, setUserBalanceERC20] = useState<BigInt | undefined>(
    BigInt(0),
  );
  const [walletDestination, setWalletDestination] = useState<
    string | undefined
  >(undefined);
  const [tokenSymbol, setTokenSymbol] = useState<string | undefined>(undefined);
  const [transactionHash, setTransactionHash] = useState<any | undefined>(
    undefined,
  );
  const [switchingNetwork, setSwitchingNetwork] = useState<boolean | undefined>(
    true,
  );
  const { loading: wcPreloader, setLoading: setWcPreloader } = useWcPreloader();

  const {
    loading,
    error,
    signers,
    selectedReefSigner,
    network,
    provider,
    reefState,
    extension,
  } = hooks.useInitReefStateExtension("lhichri app", selExtensionName, {
    ipfsHashResolverFn: getIpfsGatewayUrl,
  });
  const [isNetworkSwitching, setNetworkSwitching] = useState(false);
  const networkSwitch = {
    isSwitching: isNetworkSwitching,
    setSwitching: (value: boolean) => setSwitching(value, setNetworkSwitching),
  };
  const selectedNetwork = useMemo(() => {
    if (!!network) {
      return network.name;
    }
    return undefined;
  }, [network]);

  const availableWallOptions = [
    walletSelectorOptions[reefExt.REEF_EXTENSION_IDENT],
    walletSelectorOptions[reefExt.REEF_WALLET_CONNECT_IDENT],
  ];

  useEffect(() => {
    if (!loading && isNetworkSwitching) setNetworkSwitching(false);
   
  }, [loading]);

  useEffect(() => {
    if (error?.code === 1) {
      setSelExtensionName(undefined);
    }
  }, [extension, error]);

  useEffect(() => {
    setAccounts([]);
    setSelectedSigner(undefined);
    setUserBalance(undefined);
    //getDAOToken(reefState.signer);
  }, [selExtensionName]);
  useEffect(() => {
    setAccounts(signers);
    setSelectedSigner(selectedReefSigner);
    setUserBalance(convertToReadableFormat(selectedReefSigner?.balance._hex));
    //getTokenSymbol(selectedReefSigner);
    reefState.setAccounts(signers);

    if (signers?.length && signers?.indexOf(selectedReefSigner!) == -1) {
      reefState.setSelectedAddress(signers[0].address);
      reefState.setAccounts(signers);
      setUserBalance(convertToReadableFormat(selectedReefSigner?.balance._hex));
      
    }
  }, [selectedReefSigner, signers]);
  const appAvailableNetworks = [
    nw.AVAILABLE_NETWORKS.mainnet,
    nw.AVAILABLE_NETWORKS.testnet,
  ];
  const onExtensionSelected = async (ident: string) => {
    if (ident === reefExt.REEF_WALLET_CONNECT_IDENT) {
      await connectWalletConnect(ident, setSelExtensionName, setWcPreloader);
    } else {
      setSelExtensionName(ident);
    }
  };
 


  const selectNetwork = (key: "mainnet" | "testnet"): void => {
    setSwitchingNetwork(false);
    const toSelect = appAvailableNetworks.find((item) => item.name === key);
    networkSwitch.setSwitching(true);

    if (toSelect) {
      reefState.setSelectedNetwork(toSelect);
      setSwitchingNetwork(true);
    }
  };

  const selectAccount = (index: number | null): void => {
    saveSignerLocalPointer(index || 0);
    reefState.setSelectedAddress(
      index != null ? accounts?.[index].address : undefined,
    );
  };


  return (
    <>
      {!!!signers ? (
        <>
          {!selExtensionName && (
            <WalletSelector
              onExtensionSelect={(extName: string) =>
                onExtensionSelected(extName)
              }
              availableExtensions={availableWallOptions}
            />
          )}
          <Uik.Modal title={"Connecting to wallet"} isOpen={!!selExtensionName}>
            <div className="connecting-modal-content">
              <Uik.Loading />
              <Uik.Button onClick={() => setSelExtensionName(undefined)}>
                Cancel connection
              </Uik.Button>
            </div>
          </Uik.Modal>
        </>
      ) : (
        <>
          <NetworkSwitch.Provider value={networkSwitch}>
            <Nav
              accounts={accounts}
              selectedSigner={selectedSigner}
              selExtensionName={selExtensionName}
              availableWallOptions={availableWallOptions}
              selectedNetwork={!!network ? network?.name : "mainnet"}
              setSelExtensionName={setSelExtensionName}
              selectAccount={selectAccount}
              selectNetwork={selectNetwork}
            />
            {!!signers && (
              <ReefContractInteractor
                account={selectedReefSigner}
              ></ReefContractInteractor>
            )}
          </NetworkSwitch.Provider>
        </>
      )}
    </>
  );
}

export default App;
