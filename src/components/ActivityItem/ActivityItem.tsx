import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { utils } from "@reef-chain/react-lib";
import Uik from "@reef-chain/ui-kit";
import React, { useEffect } from "react";


const ActivityItem = ({ activity, index }) => {
    const { showBalance } = utils;
    useEffect(() => {   console.log({activity})}, []);

    const reefExplorer = () => {
        window.open(activity.url, '_blank');
    }
    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            
            hour12: false,
            timeZone: 'UTC'
          };
        return date.toLocaleString('en-GB', options).replace(/\//g, '-');
      } 
    return (
        <>
        <div key={activity.timestamp + index.toString()}>
            <div className={`activity-item ${ activity.type === 'send' ? 'activity-item--send' : 'activity-item--receive'}`}>
                <div className="activity-item__indicator">
                <Uik.Icon className="activity-item__indicator-icon" icon={faArrowDown} />
                </div>

                <div className="activity-item__content">
                    <div className="activity-item__info">
                        <div className="activity-item__title">
                        {activity.type === 'send' ? 'Sent' : 'Received'} {activity.tokenSymbol}
                        </div>

                        <div className="activity-item__date">
                        {formatTimestamp(activity.timestamp)}
                        </div>

                    </div>
                    <div className="activity-item__amount-wrapper">
                        <div className="activity-item__amount">
                            {activity.type === 'send' ? '- ' : '+ '} 
                        </div>
                        <div className="activity-item__amount-token-icon" style={{backgroundImage: `url(${activity.image})`}}>

                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
        
    )
}


export default ActivityItem;