import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './App.css';

import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

import { 
  selectMessages, 
  selectError, 
  selectLoading,
  sendMessage,
  setMessage,
  setError,
  API_BASE
} from './features/messages/messagesSlice';

import MessageDisplay  from './features/messages/MessageDisplay';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function App() {
  const dispatch = useDispatch()
  const loading = useSelector(selectLoading);
  const messages = useSelector(selectMessages);
  const error = useSelector(selectError);

  /* state items */
  const [loadPage] = useState(0);
  const [message, setDraftMessage] = useState("");
  
  const registerEventStream = function(cb) {
    const sse = new EventSource(API_BASE() + "api/messages");
    sse.addEventListener("message", function(e) {
      cb(e.data);
    });
  }

  useEffect(() => {
    registerEventStream((e) => {
      dispatch(setMessage({
        message: e
      }));
    });
  }, [loadPage, dispatch]);

  const triggerSend = () => {
    dispatch(sendMessage({
      message: message
    }));
    setDraftMessage("");
  }

  const messagesForDisplay = messages.map(message => <MessageDisplay key={message.when + message.message} message={message.message} ts={message.when} />)

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

      <Snackbar open={error !== ""} autoHideDuration={6000} onClose={() => {dispatch(setError(""))}}>
        <Alert onClose={() => {dispatch(setError(""))}} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
      
    </div>
  );
}

export default App;
