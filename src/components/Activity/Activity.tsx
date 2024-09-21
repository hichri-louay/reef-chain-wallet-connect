import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import Uik from "@reef-chain/ui-kit";
import React, { useEffect } from "react";

const Activity = (account, network) => {

    useEffect(() => {  
        console.log({account})
     }, []);
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

                </div>
            </div>
        
        </div>
    );
}

export default Activity;