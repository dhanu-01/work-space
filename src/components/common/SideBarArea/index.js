import React from 'react';
import spinner from  '../../../assests/spinner.gif'
import './SideBarArea.css'

const SideBarArea = ({lastMessage,handleClick,currentSelectedMessage}) => {
    
  return (
    <div
    className='sidebarArea-container'
    >

        {
        lastMessage && lastMessage.length === 0  ? (
            <div>
                No messages
            </div>
        ) : lastMessage && lastMessage.length > 0 ? (
             <div style={{cursor: "pointer"}}>
                {
                    lastMessage.map((message,i)=>{
                        return (
                             <div key={i}
                             className={message.last_message_id === currentSelectedMessage?.last_message_id ? 'selectedCard' : 'card'}
                             onClick={()=>handleClick(message)}
                             >
                                <h2>{message.candidate_name} </h2>
                                <p> {message.last_message} </p>
                            </div>
                        )
                    })
                }
             </div>
        ) : (
            <div>
            <img
                src={spinner}
                alt="imgNotFound"
            />
        </div>
        )
      }</div>
  )
}

export default SideBarArea