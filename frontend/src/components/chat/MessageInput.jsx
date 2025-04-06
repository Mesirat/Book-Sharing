import React, { useState, useRef } from 'react';
import { useAuthStore } from '../../store/authStore';

const MessageInput = ({ onSendMessage, username }) => {
  const [text, setText] = useState('');
  const maxMessageLength = 500; 
  const { user } = useAuthStore();
  const inputRef = useRef(null); // Add reference for focus management

  const handleSend = () => {
    if (text.trim()) {
      onSendMessage({ user: user.name || 'Anonymous', text });
      setText('');
      if (inputRef.current) {
        inputRef.current.focus(); // Reset focus after sending the message
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && text.trim()) {
      // Only send on Enter, not Shift + Enter
      handleSend();
    }
  };

  return (
    <div className="p-4 border-t bg-white">
      <div className="flex">
        <input
          ref={inputRef} // Set focus on the input
          type="text"
          className="flex-1 border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={`Type a message, ${user.name || 'Anonymous'}`}
          value={text}
          onChange={(e) => {
            if (e.target.value.length <= maxMessageLength) {
              setText(e.target.value);
            }
          }}
          onKeyDown={handleKeyPress}
        />
        <button
          className={`ml-2 px-4 py-2 rounded ${
            text.trim() ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-300 cursor-not-allowed'
          } text-white`}
          onClick={handleSend}
          disabled={!text.trim()}
        >
          Send
        </button>
      </div>
      <p className={`text-xs mt-2 ${text.length > 400 ? 'text-red-500' : 'text-gray-500'}`}>
        {text.length}/{maxMessageLength} characters
      </p>
    </div>
  );
};

export default MessageInput;
