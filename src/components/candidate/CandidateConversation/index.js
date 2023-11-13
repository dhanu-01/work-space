import React from "react";
import { Grid } from "@mui/material";
import SideBar from "./SideBar";
import MessageArea from "./MessageArea";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { useState,useEffect } from "react";


const CandidateConversations = () => {

  const [allConversations, setAllconversations] = useState(null);
  const [currentSelectedMessage, setCurrentSelectedMessage] = useState(null);
  const [mobileSectionState, setMobileSectionState] = useState("sidebar");

  const handleClick = (message) => {
    setCurrentSelectedMessage(message);
    try {
      const q = query(
        collection(db, "conversations"),where("conversation_id", "==", message.conversation_id)
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        let docs = [];
        querySnapshot.forEach((doc) => {
          docs.push(doc.data());
        });

        setAllconversations(docs);
        console.log("after on snapshot in candidate Conversations")
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(()=>{
     if(allConversations){
      setMobileSectionState("messageArea")
     }
  },[allConversations])

  return (
    <Grid
      container
      spacing={2}
      sx={{
        maxWidth: "80%",
        margin: "20px auto",
      }}
    >
      <Grid
        item
        xs={12} md={3}
        sx={{
          display: {
            xs: mobileSectionState === "sidebar" ? "block" : "none",
            md: "block",
          },
        }}
      >
        <SideBar handleClick={handleClick} currentSelectedMessage={currentSelectedMessage}/>
      </Grid>

      <Grid
        item
        xs={12} md={9}
        sx={{
          display: {
            xs: mobileSectionState === "messageArea" ? "block" : "none",
            md: "block",
          },
        }}
      >
     <MessageArea
          allConversations={allConversations}
          currentSelectedMessage={currentSelectedMessage}
          setMobileSectionState={setMobileSectionState}
        />
      </Grid>
    </Grid>
  );
};

export default CandidateConversations;
