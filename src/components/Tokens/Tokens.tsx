import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { TokenWithAmount } from "@reef-chain/react-lib";
import Uik from "@reef-chain/ui-kit";
import { BigNumber, ethers } from "ethers";
import React, { useEffect } from "react";


const Tokens = (tokens: any) => {
    const [tokenList, setTokenList] = React.useState<TokenWithAmount[]>([]);
    useEffect(() => {
        console.log({tokens})
        if (Array.isArray(tokens)) {
        setTokenList(tokens);
      }}, [tokens]);

      const cryptoBalance = (token) => {
        return parseFloat(ethers.utils.formatUnits(BigNumber.from(token.balance._hex), token.decimals)).toFixed(2);
      }

      const dollarsBalance = (token) => {
        const balance = cryptoBalance(token);
        return Number(balance) * Number(token.price);
      }
    return (
        <div className="dashboard__tokens">
            {
                true && (
                    <div>
                {
                    tokens.tokens.map((token, index) => { 
                        return (
                            <div className="token-card" key={index}>
                    <div className="token-card__wrapper">
                        <div className="token-card__main">
                            <Uik.Tooltip>
                                <button 
                                    className="token-card__image"
                                    type="button" 
                                    style={{backgroundImage: `url(${token.iconUrl})`}}>
                                    
                                </button>
                            </Uik.Tooltip>
                            <div className="token-card__info">
                                <div className="token-card__token-info">
                                    <span className="token-card__token-name ">{token.symbol}</span>
                                </div>
                                <button className="token-card__token-price" disabled type="button">
                                {token.price === 0 ? 'N/A' : `$${token.price}`}
                                </button>
                            </div>
                        </div>
                        <div className="token-card__aside">
                            <div className="token-card__values">
                                <button type="button" className="token-card__value">
                                ${dollarsBalance(token).toFixed(2)}
                                </button>
                                <button type="button" className="token-card__amount">
                                {cryptoBalance(token)} {token.symbol}
                                </button>
                            </div>
                            <Uik.Button
                            
                            fill={true}
                            size="small"
                            >
                                <Uik.Icon
                                icon={faPaperPlane}
                                className="uik-icon uik-button__icon">

                                </Uik.Icon>
                                <span className="uik-button__text">Send</span>
                            </Uik.Button>
                        </div>
                    </div>
                </div>
                        )
                    })
                }
                
            </div>
                )
            }
            
        </div>
    )
}


export default Tokens; 