import { extension as reefExt } from "@reef-chain/util-lib";
import { connectWc } from "./walletConnect";

export const getIpfsGatewayUrl = (hash: string): string =>
  `https://reef.infura-ipfs.io/ipfs/${hash}`;

export const connectWallet = async (
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
    await connectWallet(ident, setSelExtensionName, setWcPreloader);
  }
};
