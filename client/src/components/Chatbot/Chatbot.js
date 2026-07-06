import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Fab,
  IconButton,
  Typography,
  TextField,
  Fade,
  Grow,
  Chip
} from '@material-ui/core';
import {
  Chat as ChatIcon,
  Close as CloseIcon,
  Send as SendIcon,
  Face as FaceIcon
} from '@material-ui/icons';
import classnames from 'classnames';
import useStyles from './styles';
import apiUrl from '../../utils/apiUrl';

const initialMessages = [
  {
    sender: 'bot',
    text: 'Hi there! I am the M2K Cinemas Assistant. How can I help you today?',
    options: ['Movies', 'Showtimes', 'Food & Beverages', 'Offers', 'Group Booking', 'Contact Support']
  }
];

export default function Chatbot() {
  const classes = useStyles();
  const history = useHistory();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleToggle = () => setIsOpen(prev => !prev);

  const handleSend = async (text) => {
    const trimmedText = text.trim();
    if (!trimmedText) return;

    // Add User Message
    const newMessages = [...messages, { sender: 'user', text: trimmedText }];
    setMessages(newMessages);
    setInputText('');

    // Fetch response from backend
    try {
      const res = await fetch(apiUrl('/chatbot'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmedText })
      });
      
      const responseData = await res.json();
      
      if (res.ok) {
        setMessages(prev => [
          ...prev, 
          { 
            sender: 'bot', 
            text: responseData.text, 
            options: responseData.options 
          }
        ]);
        
        if (responseData.actionRoute) {
          setTimeout(() => {
            history.push(responseData.actionRoute);
          }, 2000);
        }
      } else {
        setMessages(prev => [...prev, { sender: 'bot', text: 'Sorry, I am having trouble connecting right now.' }]);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { sender: 'bot', text: 'An error occurred while connecting to the server.' }]);
    }
  };

  const onKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend(inputText);
    }
  };

  return (
    <>
      <Fade in={!isOpen}>
        <Fab className={classes.fab} onClick={handleToggle} aria-label="chat">
          <ChatIcon />
        </Fab>
      </Fade>

      <Grow in={isOpen} style={{ transformOrigin: 'bottom right' }}>
        <div className={classes.chatWindow}>
          <div className={classes.header}>
            <div className={classes.headerTitle}>
              <FaceIcon />
              <Typography variant="subtitle1" style={{ fontWeight: 600 }}>
                M2K Assistant
              </Typography>
            </div>
            <IconButton size="small" onClick={handleToggle} style={{ color: '#fff' }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </div>

          <div className={classes.messageArea}>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={classnames(
                  classes.messageRow,
                  msg.sender === 'bot' ? classes.botMessageRow : classes.userMessageRow
                )}>
                <div
                  className={classnames(
                    classes.bubble,
                    msg.sender === 'bot' ? classes.botBubble : classes.userBubble
                  )}>
                  {msg.text}
                </div>
                {msg.options && (
                  <div className={classes.optionsContainer}>
                    {msg.options.map((opt, i) => (
                      <Chip
                        key={i}
                        label={opt}
                        size="small"
                        className={classes.optionChip}
                        onClick={() => handleSend(opt)}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className={classes.inputArea}>
            <TextField
              className={classes.input}
              placeholder="Type your message..."
              variant="outlined"
              size="small"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={onKeyPress}
            />
            <IconButton className={classes.sendButton} onClick={() => handleSend(inputText)}>
              <SendIcon />
            </IconButton>
          </div>
        </div>
      </Grow>
    </>
  );
}
