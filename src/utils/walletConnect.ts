import { CoreTypes } from "@walletconnect/types";
import { Web3Modal } from "@web3modal/standalone";
import { extension as reefExt, logoSvgUrl } from '@reef-chain/util-lib';

const web3Modal = new Web3Modal({
  projectId: reefExt.WC_PROJECT_ID,
  walletConnectVersion: 2,
  enableExplorer: false,
  explorerRecommendedWalletIds: "NONE",
  themeMode: "light",
  themeVariables: {
    "--w3m-accent-color": "#a93185",
    "--w3m-accent-fill-color": "#5d3bad",
    "--w3m-background-color": "#a93185",
    "--w3m-z-index": "1001",
    "--w3m-logo-image-url": logoSvgUrl.logoSvgUrl,
  },
});

const appMetadata: CoreTypes.Metadata = { 
  name: 'Reef App',
  description: 'Reef App',
  url: window.location.origin,
  icons: [window.location.origin + '/favicon.ico'],
};

export const connectWc = async (setWcPreloader:any): Promise<reefExt.WcConnection | undefined> => {
  try {
    const client = await reefExt.initWcClient(appMetadata);

    const { uri, approval } = await client.connect({
      requiredNamespaces: reefExt.getWcRequiredNamespaces(),
    });

    if (uri) {
      web3Modal.openModal({ uri });
      setWcPreloader({
        value:false,
        message:""
      });
    } else {
      throw new Error("_noUriFoundWC");
    }

    const session = await approval();
    web3Modal.closeModal();
    return { client, session };
  } catch (error) {
    console.error("Error connecting WalletConnect:", error);
    web3Modal.closeModal();
    return undefined;
  }
};
