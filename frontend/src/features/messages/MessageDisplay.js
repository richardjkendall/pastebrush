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

function MessageDisplay(props) {
  return (
    <div>
      <Paper elevation={1} style={{marginBottom: "10px"}}>
        <MessageContainer>
          <Typography variant="body2" gutterBottom>{moment(props.ts).fromNow()}</Typography>
          <Typography variant="body1">{props.message}</Typography>
        </MessageContainer>
        <Button variant="text">Copy to Clipboard</Button>
      </Paper>
    </div>
  )
}

export default MessageDisplay;