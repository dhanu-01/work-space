import React from 'react';
import {
    collection,
    query,
    where,
    onSnapshot
  } from "firebase/firestore";
  import { db } from '../../../../firebaseConfig';
import { useEffect } from 'react';
import { useState } from 'react';
import SideBarArea from '../../../common/SideBarArea';

const SideBar = ({handleClick,currentSelectedMessage}) => {

    const currentUser = JSON.parse(localStorage.getItem('user')).uid;
    const [lastMessage,setLastmessage] = useState(null);

    const fetch = async () => {
        const q = query(
            collection(db, "last_message"),
            where("candidate_id", "==", currentUser)
        );
        const unsubscribe = await onSnapshot(q, (QuerySnapshot) =>{
            let docs = [];
            QuerySnapshot.forEach((doc)=>{
                docs.push(doc.data());
            });
            setLastmessage(docs);
        })
    }

    useEffect(()=>{
        fetch()
    },[])
  return (
    <div>
        <SideBarArea
          lastMessage={lastMessage}
          handleClick={handleClick}
          currentSelectedMessage={currentSelectedMessage}
        />
    </div>
  )
}

export default SideBar