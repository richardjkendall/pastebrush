import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './App.css';

import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import { 
  selectMessages, 
  selectError, 
  selectLoading,
  sendMessage,
  setMessage,
  API_BASE
} from './features/messages/messagesSlice';

import MessageDisplay  from './features/messages/MessageDisplay';

function App() {
  const dispatch = useDispatch()
  const loading = useSelector(selectLoading);
  const messages = useSelector(selectMessages);

  /* state items */
  const [loadPage] = useState(0);
  const [message, setDraftMessage] = useState("");
  
  const registerEventStream = function(cb) {
    const sse = new EventSource(API_BASE() + "api/messages");
    sse.addEventListener("message", function(e) {
      console.log(e.data);
      cb(e.data);
    });
  }

  useEffect(() => {
    console.log("on page load");

    registerEventStream((e) => {
      console.log("got an event", e);
      dispatch(setMessage({
        message: e
      }));
    });
  }, [loadPage, dispatch]);

  const triggerSend = () => {
    console.log("in triggerSend");

    dispatch(sendMessage({
      message: message
    }));

    setDraftMessage("");
  }

  const messagesForDisplay = messages.map(message => <MessageDisplay key={message.when} message={message.message} ts={message.when} />)

  return (
    <div className="App">
      <Typography variant="h3">Paste Brush</Typography>

      <div id="clipform">
        <TextField
          id="clipboard"
          label="Item to send"
          placeholder="Placeholder"
          value={message}
          onChange={(e) => {setDraftMessage(e.target.value)}}
          multiline
        />
        <Button id="send" variant="contained" disabled={loading==="yes" || message === ""} onClick={triggerSend}>Send</Button>
      </div>

      <div id="messageslist">
        {messagesForDisplay}
      </div>

    </div>
  );
}

export default App;
