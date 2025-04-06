import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import GroupList from './GroupList';
import CreateGroupForm from './CreateGroupForm';
import ChatArea from './ChatArea';
import MessageInput from './MessageInput';

const socket = io('http://localhost:3001'); // Replace with your backend URL

const GroupChat = () => {
  const [currentGroup, setCurrentGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]); // Store the list of users

  useEffect(() => {
    if (currentGroup) {
      socket.emit('joinGroup', currentGroup.name, 'Username'); // Pass the username here

      socket.on('loadHistory', (history) => {
        setMessages(history);
      });

      socket.on('receiveMessage', (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      socket.on('userListUpdate', (userList) => {
        setUsers(userList); // Update the user list when it changes
      });

      return () => {
        socket.off('loadHistory');
        socket.off('receiveMessage');
        socket.off('userListUpdate');
      };
    }
  }, [currentGroup]);

  const handleSendMessage = (message) => {
    if (currentGroup) {
      socket.emit('sendMessage', { groupName: currentGroup.name, message });
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/4 border-r p-4">
        <CreateGroupForm />
        <GroupList setCurrentGroup={setCurrentGroup} />
      </div>
      <div className="w-3/4 flex flex-col">
        <ChatArea messages={messages} />
        <MessageInput onSendMessage={handleSendMessage} />
        <div className="mt-4">
          <h3 className="font-bold">Users in {currentGroup?.name}</h3>
          <ul>
            {users.length === 0 ? (
              <li>No users in this group</li>
            ) : (
              users.map((user, index) => (
                <li key={index}>{user.username}</li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GroupChat;
