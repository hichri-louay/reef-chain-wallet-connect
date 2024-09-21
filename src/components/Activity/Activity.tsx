import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import Uik from "@reef-chain/ui-kit";
import React, { useEffect } from "react";
import ActivityItem from "../ActivityItem/ActivityItem";
import { hooks } from "@reef-chain/react-lib";
import { tokenUtil } from "@reef-chain/util-lib";

const Activity = (account) => {
    const [unparsedTransfers, loading] :[tokenUtil.TokenTransfer[], boolean] = hooks.useTxHistory();

    

     const parsedTransfers = () => {
        if(unparsedTransfers.length > 0) {
          return unparsedTransfers.filter((transfer) => 
            transfer.reefswapAction === null && 
            transfer.inbound === false &&
            transfer.type === "ERC20"
          ).map((transaction) => { 
            console.log({transaction}) 
            const isSend = account.address === transaction.from;
            return {
              type: isSend ? 'send' : 'receive',
              timestamp: transaction.timestamp,
              status: transaction.success ? 'Success' : 'Failed',
              tokenName: transaction.token.name,
              tokenSymbol: transaction.token.symbol,
              url: transaction.url,
            }
          });
        } return []
      }
    return (
        <div className="dashboard__right">
            <div className="token-activity activity">
                <div className="activity__head">
                    <Uik.Text type="title" text="Activity" className="activity__title" />
                    <Uik.Button
                        size="small"
                        icon={faArrowUpRightFromSquare}
                        text="Open Explorer"
            onClick={() => window.open(`${account.network.reefscanUrl}/account/${account.account.address}`)}
          />
                </div>
                <div className="col-12 card card-bg-light">
                {
                parsedTransfers().map((transfer, index) => {
                    return (
                  <ActivityItem
                    activity={transfer}
                    index={index}
                  />
                )
              })
            }
                    
                </div>
            </div>
        
        </div>
    );
}

export default Activity;