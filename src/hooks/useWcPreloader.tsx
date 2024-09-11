import { useContext } from "react";
import WcPreloaderContext from "../context/WcPreloaderContext";

const useWcPreloader = () => {
    const context = useContext(WcPreloaderContext);
    if (!context) {
      throw new Error('useWcPreloader must be used within a WcPreloaderProvider');
    }
    return context;
  };
  
  export default useWcPreloader;