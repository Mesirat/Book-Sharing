import React, { useEffect, useRef } from 'react';

const ChatArea = ({ messages = [], currentUser }) => {
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div
      className="flex-1 overflow-y-auto p-4 bg-gray-100 rounded-lg shadow-inner"
      role="region"
      aria-live="polite"
      aria-label="Chat area, messages appear below"
    >
      <h2 className="text-xl font-bold mb-4 text-center">Chat</h2>
      {messages.length === 0 ? (
        <p className="text-gray-500 text-center">No messages yet. Start the conversation!</p>
      ) : (
        <ul className="space-y-4" role="list">
          {messages.map((msg, index) => (
            <li
              key={msg.id || index}
              className={`flex items-start space-x-2 ${msg.user === currentUser ? 'justify-end' : 'justify-start'}`}
              aria-label={`Message from ${msg.user}`}
            >
              <div
                className={`p-3 rounded-lg shadow-md w-3/4 ${msg.user === currentUser ? 'bg-blue-100' : 'bg-white'} break-words`}
              >
                <p className="text-sm text-gray-600">
                  <strong className="text-blue-500">{msg.user}:</strong> {msg.text}
                </p>
                <span className="text-xs text-gray-400 block text-right">
                  {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                </span>
              </div>
            </li>
          ))}
          <div ref={chatEndRef} />
        </ul>
      )}
    </div>
  );
};

export default ChatArea;
