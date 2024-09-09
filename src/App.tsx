
import {
  Components
} from '@reef-chain/react-lib';
import {
  extension
} from '@reef-chain/util-lib'

import './App.css';

export const availableWallOptions = [
  Components.walletSelectorOptions[extension.REEF_EXTENSION_IDENT],
  Components.walletSelectorOptions[extension.REEF_WALLET_CONNECT_IDENT],
]
function App() {
  
  return (
    <div className="App">
        <Components.WalletSelector 
          availableExtensions={availableWallOptions}
          onExtensionSelect={(ext: string) => console.log({ext})}
        />
    </div>
  );
}

export default App;
