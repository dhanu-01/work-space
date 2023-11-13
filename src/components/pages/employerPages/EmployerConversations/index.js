import React, { useEffect } from "react";
import { Grid } from "@mui/material";
import SideBar from "./SideBar";
import MessageArea from "./MessageArea";
import {
  collection,
  query,
  where,
  onSnapshot,
  getDocs,
} from "firebase/firestore";
import { db } from "../../../../firebaseConfig";
import { useState } from "react";

const EmployerConversations = () => {
  const [allConversations, setAllconversations] = useState(null);
  const [mobileSectionState, setMobileSectionState] = useState("sidebar");
  const [currentSelectedMessage, setCurrentSelectedMessage] = useState(null);

  const handleClick = async (message) => {
    //fetch the  docs from  the conversation collection,
    //where the conversation id is equal to the conversation_id of the message
    //subscrite to it
    setCurrentSelectedMessage(message);

    const q = query(
      collection(db, "conversations"),
      where("conversation_id", "==", message.conversation_id)
    );

    console.log("Before onSnapshot query");
    const unsubscribe = await onSnapshot(q, ( querySnapshot) => {
        let docs = [];
        querySnapshot.forEach((doc) => {
          docs.push(doc.data());
        });
        setAllconversations(docs);
        console.log("AFter onSnapshot query,",message.last_message,docs);
      });

    // const q = await query(collection(db, "conversations"),where("conversation_id", "==", message.conversation_id))
    // const querySnapshot = await getDocs(q);
    // let allApplications = []
    // querySnapshot.forEach((doc)=>{
    //     allApplications.push(doc.data());
    // })
    // setAllconversations(allApplications);

  };

  useEffect(() => {
    if (allConversations) {
      setMobileSectionState("messageArea");
    }
  }, [allConversations]);

  return (
    <Grid
      container
      spacing={2}
      sx={{
        maxWidth: "95%",
        margin: "20px auto",
      }}
    >
      <Grid
        item
        xs={12}
        md={3}
        sx={{
          display: {
            xs: mobileSectionState === "sidebar" ? "block" : "none",
            md: "block",
          },
        }}
      >
        <SideBar
          handleClick={handleClick}
          currentSelectedMessage={currentSelectedMessage}
        />
      </Grid>

      <Grid
        item
        xs={12}
        md={9}
        sx={{
          display: {
            xs: mobileSectionState === "messageArea" ? "block" : "none",
            md: "block",
          },
        }}
      >
        {currentSelectedMessage && (
          <MessageArea
            allConversations={allConversations}
            setMobileSectionState={setMobileSectionState}
            currentSelectedMessage={currentSelectedMessage}
          />
        )}
      </Grid>
    </Grid>
  );
};

export default EmployerConversations;
