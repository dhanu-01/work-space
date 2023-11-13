import React from 'react';
import { Button } from '@mui/material';
import TextingArea from '../../../../common/TextingArea';
import {
  setDoc,
  doc,
  collection,
  query,
  where,
  getDocs
} from "firebase/firestore";
import { db } from '../../../../../firebaseConfig';
import { v4 as uuidv4 } from 'uuid';
import { useEffect } from 'react';


const MessageArea = ({allConversations,setMobileSectionState,currentSelectedMessage}) => {
  let user_id = JSON.parse(localStorage.getItem('user')).uid;

    const submitMessage = (text) => {

         const conversation_doc_id = uuidv4();
         //update the last message in the last_message collection
         setDoc(doc(db, "last_message", currentSelectedMessage.last_message_id),{
             last_message : text,
         },{
           merge: true
         })
         //add a new document to the conversation collection

         setDoc(doc(db, "conversations", conversation_doc_id),{
           conversation_id: currentSelectedMessage.conversation_id,
           createdAt: new Date(),
           message: text,
           by: "employer",
           user_id,
           conversation_doc_id
         })

    }

    const updateSeen = async () => {
      const q = await query(
        collection(db, "conversations"),
        where("conversation_id", "==", currentSelectedMessage.conversation_id),
      )

          //add a property call seen = true to all conversation
          //where the conversation id is equal  to the current selected message converstion id
          // and the userid should not be equal to the current user id

      getDocs(q).then((querySnapshot)=>{
           querySnapshot.forEach((doc_id)=>{

                  if(doc_id.data().user_id!=user_id && !doc_id.data().seen){
                     setDoc(doc(db,"conversations", doc_id.data().conversation_doc_id),{
                       seen:true,
                     },{
                      merge:true
                     })
                  }
           })
      })
    }

    useEffect(()=>{
        if(currentSelectedMessage){
          updateSeen()
        }
    },[currentSelectedMessage,allConversations])
  return (
    <div>
        <Button
        sx={{
            display: { xs:'block', md: "none" }
          }}
        onClick={()=>setMobileSectionState("sidebar")}
        >
        Back
        </Button>
       <TextingArea
          allConversations={allConversations}
          submitMessage={submitMessage}
          currentSelectedMessage={currentSelectedMessage}
       />
    </div>
  )
}

export default MessageArea