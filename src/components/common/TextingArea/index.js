import React, { useEffect, useState } from "react";
import { Grid, TextField } from "@mui/material";
import { Button } from "@mui/material";
import moment from "moment/moment";
import "./TextingArea.css";
import SendIcon from "@mui/icons-material/Send";
import DoneAllIcon from "@mui/icons-material/DoneAll";

const TextingArea = ({ allConversations, submitMessage,currentSelectedMessage}) => {

  const [text, setText] = useState("");
  const user_id = JSON.parse(localStorage.getItem("user")).uid;
  const [sortedConversations, setSortedConversations] = useState(allConversations);

  useEffect(() => {
    if (allConversations) {
      setSortedConversations(
        allConversations.sort((a, b) => {
          return a.createdAt.toDate() - b.createdAt.toDate();
        })
      );
    }
  }, [allConversations]);

  const submit = (e) => {
    e.preventDefault();
    submitMessage(text);
  };

  return (
    allConversations&& <form
      onSubmit={(e) => submit(e)}
      style={{
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          display: "grid",
          gridGap: "10px",
        }}
      >
        {sortedConversations &&
          sortedConversations.map((conversation, i) => {
            return (
              <div>
                <div
                  key={i}
                  className={
                    conversation.user_id === user_id
                      ? "sent-by-user"
                      : "sent-by-other"
                  }
                >
                  <div>{conversation.message}</div>
                  <p>
                    {moment(conversation.createdAt.toDate().toString()).format(
                      "lll"
                    )}
                    {conversation.user_id === user_id && (
                      <DoneAllIcon
                        size="small"
                        sx={{
                          fontSize: "16px",
                          marginLeft: "5px",
                          color: conversation?.seen ? "blue" : "grey",
                        }}
                      />
                    )}
                  </p>
                </div>
              </div>
            );
          })}
      </div>
      <Grid
        container
        spacing={2}
        sx={{
          border: "1px solid #00000021",
          borderRadius: "10px",
          padding: "10px",
          position: "sticky",
          bottom: "10px",
          background: "#fff",
        }}
      >
        <Grid item xs={10}>
          <TextField
            multiline={true}
            maxRows={4}
            fullWidth
            size="small"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </Grid>
        <Grid item xs={2}>
          <Button type="submit">
            <SendIcon
              sx={{
                color: "blue",
              }}
            />
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default TextingArea;
