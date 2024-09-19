cat << 'EOF' > README.md
# Implementing Reef Chain Wallet Connection in a React App

This guide will walk you through the process of integrating Reef Chain wallet connection features into a React application using the `@reef-chain/react-lib` library. You will learn how to:

- Set up a React project.
- Configure and connect to a Reef wallet.
- Switch between networks.
- Interact with smart contracts.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Project Setup](#project-setup)
   - [1. Create a React App](#1-create-a-react-app)
   - [2. Install Dependencies](#2-install-dependencies)
   - [3. Set Up Project Structure](#3-set-up-project-structure)
3. [Wallet Connection](#wallet-connection)
   - [1. Reef Wallet Integration](#1-reef-wallet-integration)
   - [2. WalletConnect Integration](#2-walletconnect-integration)
4. [Network Switching](#network-switching)
5. [Interacting with Smart Contracts](#interacting-with-smart-contracts)
6. [Additional Tips](#additional-tips)
7. [Troubleshooting](#troubleshooting)
8. [Conclusion](#conclusion)

## Prerequisites

Before you begin, ensure you have the following tools installed:

- Node.js and npm
- A code editor (like VS Code)
- Basic knowledge of React and TypeScript
- Access to the Reef Chain extension or WalletConnect-compatible wallet

## Project Setup

### 1. Create a React App

Start by creating a new React application. You can use \`create-react-app\` to bootstrap the project.

\`\`\`bash
npx create-react-app reef-wallet-connection --template typescript
cd reef-wallet-connection
\`\`\`

### 2. Install Dependencies

Install the necessary dependencies, including the Reef Chain libraries.

\`\`\`bash
npm install @reef-chain/react-lib @reef-chain/util-lib @reef-chain/ui-kit
npm install --save-dev typescript @types/react @types/react-dom
\`\`\`

### 3. Set Up Project Structure

Create the following folders and files to organize your code:

\`\`\`
src/
  ├── components/
  │   ├── Nav/
  │   │   └── Nav.tsx
  │   ├── ReefContractInteractor/
  │   │   └── ReefContractInteractor.tsx
  ├── context/
  │   └── NetworkSwitch.tsx
  ├── hooks/
  │   ├── useConnectedWallet.tsx
  │   └── useWcPreloader.tsx
  ├── utils/
  │   └── walletConnect.ts
  ├── App.tsx
  └── index.tsx
\`\`\`

## Wallet Connection

### 1. Reef Wallet Integration

#### Setting Up the Wallet Selector

1. Import and configure the \`WalletSelector\` component from \`@reef-chain/react-lib\`.

   \`\`\`tsx
   import { Components, hooks, ReefSigner } from "@reef-chain/react-lib";
   const { WalletSelector, walletSelectorOptions } = Components;
   \`\`\`

2. Set up a state to manage the selected wallet and initialize the Reef state.

   \`\`\`tsx
   const [selExtensionName, setSelExtensionName] = useState<string | undefined>();
   const { loading, signers, selectedReefSigner, reefState } = hooks.useInitReefStateExtension(
     "YourApp",
     selExtensionName,
     {
       ipfsHashResolverFn: (hash: string) => \`https://reef.infura-ipfs.io/ipfs/\${hash}\`,
     }
   );
   \`\`\`

3. Implement the \`WalletSelector\` in your \`App.tsx\`:

   \`\`\`tsx
   return (
     <>
       {!selExtensionName && (
         <WalletSelector
           onExtensionSelect={(extName: string) => setSelExtensionName(extName)}
           availableExtensions={[walletSelectorOptions.REEF_EXTENSION_IDENT]}
         />
       )}
     </>
   );
   \`\`\`

### 2. WalletConnect Integration

1. Import and set up WalletConnect utility functions.

   \`\`\`tsx
   import { extension as reefExt } from "@reef-chain/util-lib";
   import { connectWc } from "./utils/walletConnect";
   \`\`\`

2. Implement a function to handle WalletConnect integration:

   \`\`\`tsx
   const connectWalletConnect = async () => {
     const response = await connectWc();
     if (response) {
       reefExt.injectWcAsExtension(response, {
         name: reefExt.REEF_WALLET_CONNECT_IDENT,
         version: "1.0.0",
       });
       setSelExtensionName(reefExt.REEF_WALLET_CONNECT_IDENT);
     }
   };
   \`\`\`

3. Add a button to trigger WalletConnect connection:

   \`\`\`tsx
   <button onClick={connectWalletConnect}>Connect WalletConnect</button>
   \`\`\`

## Network Switching

1. Create a context for network switching:

   \`\`\`tsx
   import { createContext, useContext, useState } from "react";

   export const NetworkSwitchContext = createContext();

   export const NetworkSwitchProvider = ({ children }) => {
     const [isSwitching, setSwitching] = useState(false);
     return (
       <NetworkSwitchContext.Provider value={{ isSwitching, setSwitching }}>
         {children}
       </NetworkSwitchContext.Provider>
     );
   };

   export const useNetworkSwitch = () => useContext(NetworkSwitchContext);
   \`\`\`

2. Implement a network switcher component:

   \`\`\`tsx
   const NetworkSwitcher = () => {
     const { isSwitching, setSwitching } = useNetworkSwitch();

     const switchNetwork = (networkName) => {
       setSwitching(true);
       // Set the selected network logic here
       setSwitching(false);
     };

     return (
       <div>
         <button onClick={() => switchNetwork("mainnet")}>Mainnet</button>
         <button onClick={() => switchNetwork("testnet")}>Testnet</button>
       </div>
     );
   };
   \`\`\`

## Interacting with Smart Contracts

1. Create a component to handle smart contract interaction:

   \`\`\`tsx
   const ReefContractInteractor = ({ account }) => {
     const [contractData, setContractData] = useState(null);

     const loadContractData = async () => {
       // Logic to interact with the smart contract using \`account\`
     };

     useEffect(() => {
       if (account) loadContractData();
     }, [account]);

     return <div>{contractData ? JSON.stringify(contractData) : "Loading..."}</div>;
   };
   \`\`\`

2. Add the component to your \`App.tsx\` and pass the selected account:

   \`\`\`tsx
   <ReefContractInteractor account={selectedReefSigner} />
   \`\`\`

## Additional Tips

- Use the \`ReefSigner\` object to sign and send transactions.
- Always handle the \`loading\` and \`error\` states properly for a better user experience.
- Implement proper error handling for each network and wallet interaction.

## Troubleshooting

1. **Unable to Connect Wallet:** Check if the extension or WalletConnect is correctly installed and configured.
2. **Network Switching Issues:** Ensure that the network switcher correctly sets the desired network configuration.
3. **Smart Contract Interaction Failing:** Verify the contract address and ABI, and ensure the selected network matches the contract's deployment network.

## Conclusion

You have now set up a React application that connects to the Reef Chain wallet, switches networks, and interacts with smart contracts. Feel free to customize and extend the implementation based on your requirements.
EOF
