import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import ChatArea from "./ChatArea"; 
import MessageInput from "./MessageInput"; 
import { Loader } from "lucide-react";

const socket = io("http://localhost:5000");

const GroupChat = ({ currentGroup }) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentGroup) {
      setLoading(true);  // Set loading state to true when switching groups
      socket.emit("joinGroup", currentGroup.name);

      socket.on("loadHistory", (history) => {
        if (Array.isArray(history)) {
          setMessages(history);  // Set the history messages
        } else {
          console.error('Expected history to be an array', history);
          setMessages([]);  // Set empty if invalid data received
        }
        setLoading(false);  // Set loading to false once history is loaded
      });

      socket.on("receiveMessage", (message) => {
        setMessages((prev) => {
          if (!Array.isArray(prev)) return [message];
          return [...prev, message];
        });
      });

      socket.on("userListUpdate", (userList) => setUsers(userList));

      return () => {
        socket.off("loadHistory");
        socket.off("receiveMessage");
        socket.off("userListUpdate");
        socket.emit("leaveGroup", currentGroup.name);
      };
    }
  }, [currentGroup]);  // Only depend on currentGroup, not messages

  const handleSendMessage = (message) => {
    const { user, text } = message;
    if (typeof text !== "string") {
      console.error("Invalid message type:", message);
      return;
    }
    if (text.trim()) {
      socket.emit("sendMessage", {
        groupName: currentGroup.name,
        sender: user,
        message: text,
      });
    }
  };

  return (
    <div className="flex h-full">
      <div className="w-1/4 border-r p-4">
        <h2 className="text-xl font-bold mb-4">Members in {currentGroup.name}</h2>
        <ul>
          {users.length === 0 ? (
            <li>No users in this group</li>
          ) : (
            users.map((user, index) => (
              <li key={index} className="flex items-center space-x-2">
                <img
                  src={user.profilePic ? `http://localhost:5000${user.profilePic}` : '/defaultProfile.png'}
                  alt={user.username}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span>{user.username}</span>
              </li>
            ))
          )}
        </ul>
      </div>

      <div className="w-3/4 flex flex-col p-4">
        <h2 className="text-xl font-bold mb-4">Chat in {currentGroup.name}</h2>
        {loading ? (
          <Loader className="animate-spin mx-auto" />
        ) : (
          <>
            <ChatArea messages={messages} />
            <MessageInput onSendMessage={handleSendMessage} />
          </>
        )}
      </div>
    </div>
  );
};

export default GroupChat;
