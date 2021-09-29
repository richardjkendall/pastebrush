import React from 'react';
import styled from 'styled-components';
import moment from 'moment';

import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const MessageContainer = styled.div`
  padding-left: 10px;
  padding-top: 10px;
`

const copyToClipboard = (clip) => {
  navigator.permissions.query({name: "clipboard-write"}).then(result => {
    if(result.state === "granted" || result.state === "prompt") {
      navigator.clipboard.writeText(clip).then(() => {
        console.log("wrote to clipboard");
      }, () => {
        console.log("could not write to clipboard");
      });
    }
  });
}

function MessageDisplay(props) {
  return (
    <div>
      <Paper elevation={1} style={{marginBottom: "10px"}}>
        <MessageContainer>
          <Typography variant="body2" gutterBottom>{moment(props.ts).fromNow()}</Typography>
          <Typography variant="body1" style={{whiteSpace: "pre-wrap"}}>{props.message}</Typography>
        </MessageContainer>
        <Button variant="text" onClick={copyToClipboard.bind(props.message)}>Copy to Clipboard</Button>
      </Paper>
    </div>
  )
}

export default MessageDisplay;