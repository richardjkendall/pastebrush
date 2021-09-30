import React, { useState } from 'react';
import styled from 'styled-components';
import moment from 'moment';

import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const MessageContainer = styled.div`
  padding-left: 10px;
  padding-top: 10px;
`

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function MessageDisplay(props) {
  const [display, setDisplay] = useState(false);

  const copyToClipboard = (e) => {
    navigator.permissions.query({name: "clipboard-write"}).then(result => {
      if(result.state === "granted" || result.state === "prompt") {
        navigator.clipboard.writeText(props.message).then(() => {
          console.log("wrote to clipboard");
          setDisplay(true);
        }, () => {
          console.log("could not write to clipboard");
        });
      }
    });
  }

  return (
    <div>
      <Paper elevation={1} style={{marginBottom: "10px"}}>
        <MessageContainer>
          <Typography variant="body2" gutterBottom>{moment(props.ts).fromNow()}</Typography>
          <Typography variant="body1" style={{whiteSpace: "pre-wrap"}}>{props.message}</Typography>
        </MessageContainer>
        <Button variant="text" onClick={copyToClipboard}>Copy to Clipboard</Button>
      </Paper>
      <Snackbar open={display} autoHideDuration={2000} onClose={() => {setDisplay(false)}}>
        <Alert onClose={() => {setDisplay(false)}} severity="success" sx={{ width: '100%' }}>
          Copied!
        </Alert>
      </Snackbar>
    </div>
  )
}

export default MessageDisplay;
