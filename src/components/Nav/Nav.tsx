import React from "react";
import { Components } from "@reef-chain/react-lib";
import Uik from "@reef-chain/ui-kit";

const Nav = ({
  accounts,
  selectedSigner,
  selExtensionName,
  availableWallOptions,
  selectedNetwork,
  setSelExtensionName,
  selectAccount,
  selectNetwork,
}) => {
  return (
    <div className="nav-content navigation d-flex d-flex-space-between">
      <div className="navigation__wrapper">
        <button type="button" className="logo-btn">
          DAOWave
        </button>
        <nav className="d-flex justify-content-end d-flex-vert-center">
          {accounts && (
            <Components.AccountSelector
              selExtName={selExtensionName}
              availableExtensions={availableWallOptions}
              selectExtension={setSelExtensionName}
              isBalanceHidden={false}
              showBalance={true}
              accounts={accounts || []}
              availableNetworks={["mainnet", "testnet"]}
              showSnapOptions={true}
              selectedSigner={selectedSigner || undefined}
              selectAccount={selectAccount}
              selectedNetwork={selectedNetwork}
              onNetworkSelect={selectNetwork}
            />
          )}
        </nav>
      </div>
    </div>
  );
};

export default Nav;
