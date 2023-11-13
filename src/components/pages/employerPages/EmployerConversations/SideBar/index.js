import React from 'react'
import { useEffect,useState} from 'react';
import { collection, query,where,onSnapshot} from "firebase/firestore";
import { db } from '../../../../../firebaseConfig';
import SideBarArea from '../../../../common/SideBarArea';



const SideBar = ({handleClick,currentSelectedMessage}) => {
    const currentUser =   JSON.parse(localStorage.getItem('user'));
    const [lastMessage, setLastmessage] = useState(null);
    const [loading,setLoading] = useState(true);

    const fetch = async () => {
        const q = query(
            collection(db, "last_message"),
            where("employer_id", "==", currentUser.uid)
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