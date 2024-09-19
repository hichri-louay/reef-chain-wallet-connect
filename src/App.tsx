import React, { useEffect, useState } from "react";
import { Components, hooks, ReefSigner } from "@reef-chain/react-lib";
import Uik from "@reef-chain/ui-kit";
import { extension as reefExt } from "@reef-chain/util-lib";
import NetworkSwitch, { setSwitching } from "./context/NetworkSwitch";
import useWcPreloader from "./hooks/useWcPreloader";
import { connectWc } from "./utils/walletConnect";
import "./App.css";
import useConnectedWallet from "./hooks/useConnectedWallet";
import { network as nw } from "@reef-chain/util-lib";
import Nav from "./components/Nav/Nav";
import ReefContractInteractor from "./components/ReefContractInteractor/ReefContractInteractor";
import { connectWallet, getIpfsGatewayUrl } from "./utils/walletHelper";

function App() {
  const { selExtensionName, setSelExtensionName } = useConnectedWallet();
  const [accounts, setAccounts] = useState<ReefSigner[]>([]);
  const [selectedSigner, setSelectedSigner] = useState<ReefSigner | undefined>(
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

  const availableWallOptions = [
    Components.walletSelectorOptions[reefExt.REEF_EXTENSION_IDENT],
    Components.walletSelectorOptions[reefExt.REEF_WALLET_CONNECT_IDENT],
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
  }, [selExtensionName]);
  useEffect(() => {
    setAccounts(signers);
    setSelectedSigner(selectedReefSigner);
    reefState.setAccounts(signers);

    if (signers?.length && signers?.indexOf(selectedReefSigner!) == -1) {
      reefState.setSelectedAddress(signers[0].address);
    }
  }, [selectedReefSigner, signers]);
  const appAvailableNetworks = [
    nw.AVAILABLE_NETWORKS.mainnet,
    nw.AVAILABLE_NETWORKS.testnet,
  ];
  const onExtensionSelected = async (ident: string) => {
    if (ident === reefExt.REEF_WALLET_CONNECT_IDENT) {
      await connectWallet(ident, setSelExtensionName, setWcPreloader);
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
    reefState.setSelectedAddress(
      index != null ? accounts?.[index].address : undefined,
    );
  };

  return (
    <>
      {!!!signers ? (
        <>
          {!selExtensionName && (
            <Components.WalletSelector
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
