import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import Uik from "@reef-chain/ui-kit";
import React, { useEffect } from "react";


const ActivityItem = ({ activity, index }) => {

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
        {
            activity && (
                <>
                            <div key={activity.timestamp + index.toString()} className="activity-item" onClick={reefExplorer}>
                            <div className="activity-item__indicator">
          <Uik.Icon className="activity-item__indicator-icon" icon={faArrowDown} />
        </div>
                                <div className="activity-item__from">{activity.type === 'send' ? 'Sent' : 'Received'} {activity.tokenSymbol}</div>
                                <div className="activity-item__timestamp">{formatTimestamp(activity.timestamp)}</div>
                                
                                <div className="activity-item__inbound">{activity.inbound}</div>
                                <div className="activity-item__type">{activity.type}</div>
                            </div>
                        

                </>
            )
        }
        </>
        
    )
}


export default ActivityItem;