import React, { useState, useEffect } from "react";
import Uik from "@reef-chain/ui-kit";
import erc20 from "../../abi/erc20.json";
import { Contract } from "ethers";
import { transactionUtils , tokenUtil} from "@reef-chain/util-lib";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { TokenWithAmount, hooks } from "@reef-chain/react-lib";
import ActivityItem from "../ActivityItem/ActivityItem";

const ReefContractInteractor = ({ account, network }) => {
  const [smartContractAddress, setSmartContractAddress] = useState<string>("");
  const [tokenSymbol, setTokenSymbol] = useState<string>("");
  const [tokenName, setTokenName] = useState<string>("");
  const [recipientAddress, setRecipientAddress] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [loadingSmartContract, setLoadingSmartContract] = useState<boolean>(false);
  const [apiPromise, setApiPromise] = useState<ApiPromise | null>(null);

  useEffect(() => {
    console.log({network, account})
    initializeState();
    const initApi = async () => {
      try {
        const wsProvider = new WsProvider(network.rpcUrl);
        const api = await ApiPromise.create({ provider: wsProvider });
        setApiPromise(api);
      } catch (err) {
        console.error("Error initializing API", err);
      }
    };
    
    
    initApi();

    return () => {
      if (apiPromise) {
        apiPromise.disconnect();
      }
    };
  }, [account, network]);

  const smartContract = () => {
    return new Contract(smartContractAddress, erc20, account.signer);
  };

  const initializeState = () => {
    setTokenName(""); 
    setAmount("");
    setTokenSymbol("");
    setRecipientAddress("");
    setSmartContractAddress("");
    setLoadingSmartContract(false);
  }

  const send = async () => {
    if (!apiPromise) {
      Uik.notify.danger("API not initialized");
      return;
    }

    try {
      if (recipientAddress !== "" && amount !== "") {
        const contract = smartContract();
        if (contract) {
          const status$ = transactionUtils.getEvmTransactionStatus$(
            contract.transfer(recipientAddress, amount),
            apiPromise,
            recipientAddress
          );

          const subscription = status$.subscribe(
            (statusEvent) => {
              switch (statusEvent.txStage) {
                case "BROADCAST":
                  Uik.notify.info(
                    `Transaction broadcasted: ${statusEvent.txData.hash}`
                  );
                  break;
                case "INCLUDED_IN_BLOCK":
                  Uik.notify.info(
                    `Transaction included in block: ${statusEvent.txData.blockHash}`
                  );
                  break;
                case "BLOCK_FINALIZED":
                  Uik.notify.success(
                    `Transaction finalized in block: ${statusEvent.txData.blockHash}`
                  );
                  break;
                case "BLOCK_NOT_FINALIZED":
                  Uik.notify.danger(`Transaction not finalized after 10 blocks`);
                  break;
                default:
                  Uik.notify.danger("Unknown transaction status");
              }
            },
            (err) => {
              Uik.notify.danger("Transaction reverted with error");
              console.error("Transaction error:", err);
            }
          );

          
          setTimeout(() => {
            subscription.unsubscribe();
          }, 90000); 
        }
      } else {
        Uik.notify.danger("Please enter a valid smart contract address and amount");
      }
    } catch (err) {
      console.error("Error sending token", err);
      Uik.notify.danger("Error sending token");
    }
  };

  const loadSmartContract = async () => {
    try {
      if (smartContractAddress !== "") {
        setLoadingSmartContract(true);
        const contract = smartContract();
        if (contract) {
          const symbol = await contract.symbol();
          const name = await contract.name();
          setTokenName(name);
          setTokenSymbol(symbol);
          setLoadingSmartContract(false);
          Uik.notify.success("Smart Contract loaded successfully");
        }
      } else {
        Uik.notify.danger("Please enter a valid smart contract address");
      }
    } catch (err) {
      setLoadingSmartContract(false);
      Uik.notify.danger("Error loading smart contract");
    }
  };



  return (

    <div className="interaction-components">
      <div className="load-smart-contracts">
        <Uik.Input
          label="Smart Contract Address"
          placeholder="0x9001369C17044CA19b4376182aaD81BBCB01Ba1c"
          onChange={(e) => setSmartContractAddress(e.target.value)}
        />
        <Uik.Button className="load-contract-button" onClick={loadSmartContract}>
          Load
        </Uik.Button>
      </div>
      {(tokenName !== "" || tokenSymbol !== "") && (
        <div className="contract-info">
          <Uik.Tooltip>Smart Contract Information</Uik.Tooltip>
          <Uik.Tooltip>Token Name: {tokenName}</Uik.Tooltip>
          <Uik.Tooltip>Token Symbol: {tokenSymbol}</Uik.Tooltip>
          <Uik.Tooltip>Transfer Token</Uik.Tooltip>
          <div className="send-token">
            <Uik.Input
              label="Recipient Address"
              placeholder="0x9001369C17044CA19b4376182aaD81BBCB01Ba1c"
              onChange={(e) => setRecipientAddress(e.target.value)}
            />
            <Uik.Input
              label="Amount"
              placeholder="100"
              onChange={(e) => setAmount(e.target.value)}
            />
            <Uik.Button className="load-contract-button" onClick={send}>
              Send
            </Uik.Button>
          </div>
        </div>
      )}

      {
        loadingSmartContract && (
          
          <Uik.Loading></Uik.Loading>
        )
      }
    </div>
  );
};

export default ReefContractInteractor;
