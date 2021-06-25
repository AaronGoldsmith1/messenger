import React, {useState} from "react";
import { Box, Avatar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { SenderBubble, OtherUserBubble } from "../ActiveChat";
import moment from "moment";

const useStyles = makeStyles(() => ({
  avatar: {
    width: 20,
    height: 20,
    float: 'right',
    marginTop: 5,
    },
}));


const Messages = (props) => {
  const classes = useStyles();
  const { messages, otherUser, userId } = props;
  const lastReadMessage = messages.filter((message) => message.senderId === userId && !message.unread).pop();
  
  return (
    <Box>
      {messages.map((message, idx) => {
        const time = moment(message.createdAt).format("h:mm");
        return message.senderId === userId ? (
          <>
          <SenderBubble key={message.id} text={message.text} time={time} />
          { message.id === lastReadMessage?.id ? 
            <Avatar alt={otherUser.username} src={otherUser.photoUrl} className={classes.avatar}></Avatar> : ''}
          </>
        ) : (
          <OtherUserBubble key={message.id} text={message.text} time={time} otherUser={otherUser} />



        );
      })}
    </Box>
  );
};

export default Messages;
