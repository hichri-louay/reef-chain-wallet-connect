import { useContext } from "react";
import ConnectedWalletContext from "../context/ConnectedWalletContext";

const useConnectedWallet = () => {
    const context = useContext(ConnectedWalletContext);
    if (!context) {
      throw new Error('useConnectedWallet must be used within a ConnectedWalletProvider');
    }
    return context;
  };
  
  export default useConnectedWallet;