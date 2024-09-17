import React, { useState } from 'react';
import { Components } from '@reef-chain/react-lib';
import Uik from '@reef-chain/ui-kit';
import erc20 from '../../abi/erc20.json'
import { Contract } from 'ethers';


const ReefContractInteractor = (
  {account}
) => {
  const [smartContractAddress, setSmartContractAddress] = useState<string>('')
  const [tokenSymbol, setTokenSymbol] = useState<string>('')
  const [tokenName, setTokenName] = useState<string>('')
  const [recipientAddress, setRecipientAddress] = useState<string>('')
  const [amount, setAmount] = useState<string>('')
  
  const smartContract = () => {
    const contract = new Contract(smartContractAddress, erc20,account.signer)
    return contract
  }


  const send = async () => {
    try {
      if(recipientAddress !== '' && amount !== '') {
        const contract = smartContract();
        if(!!contract) {
          const tx = await contract.transfer(recipientAddress, amount)
          await tx.wait()
          console.log({tx})
          Uik.notify.success(`Transfer successful ${tx.hash}`)
        }
      } else Uik.notify.danger('Please enter a valid smart contract address')
    } catch(err) {
      console.log({err})
      Uik.notify.danger('Error sending token')
  }
}
  const loadSmartContract = async () => {
    try {
      if(smartContractAddress !== '') {
        const contract = smartContract();
        if(!!contract) {
          console.log({contract, erc20})
          const symbol = await contract.symbol();
          const name = await contract.name();
          setTokenName(name)
          setTokenSymbol(symbol)
          Uik.notify.success('Smart Contract loaded successfully')
        }
      } else Uik.notify.danger('Please enter a valid smart contract address')
    } catch(err) {
      console.log({err})
      Uik.notify.danger('Error loading smart contract')
    }
    
    
  }
  return (
    <div className='interaction-components'>
    <div className='load-smart-contracts'>
      <Uik.Input 
        label='Smart Contract Address' 
        placeholder='0x9001369C17044CA19b4376182aaD81BBCB01Ba1c' 
        onChange={(e) => setSmartContractAddress(e.target.value)}></Uik.Input>
        <Uik.Button 
    className='load-contract-button'
    onClick={loadSmartContract}>Load</Uik.Button>
    </div>
    {
      (tokenName !== '' || tokenSymbol !== '') && (
       
        <div className='contract-info'>
          <Uik.Tooltip>Smart Contract Information</Uik.Tooltip>
          <Uik.Tooltip>Token Name: {tokenName}</Uik.Tooltip>
          <Uik.Tooltip>Token Symbol: {tokenSymbol}</Uik.Tooltip>
          <Uik.Tooltip>Transfer Token</Uik.Tooltip>
          <div className='send-token'>
          <Uik.Input label='Recipient Address' placeholder='0x9001369C17044CA19b4376182aaD81BBCB01Ba1c' onChange={(e) => setRecipientAddress(e.target.value)}></Uik.Input>
          <Uik.Input label='Amount' placeholder='100' onChange={(e) => setAmount(e.target.value)}></Uik.Input>  
          <Uik.Button 
    className='load-contract-button'
    onClick={send}>Send</Uik.Button>
          </div>
          
          
          
        </div>
      )
    }
    
    </div>
  );
};

export default ReefContractInteractor;
