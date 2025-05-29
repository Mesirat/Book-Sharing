import React, { useEffect, useRef } from "react";
import { useAuthStore } from "../../store/authStore";

const ChatArea = ({ messages }) => {
  const { user: currentUser } = useAuthStore();
  const lastMessageRef = useRef(null);

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-4  hide-scrollbar">
      <ul className="space-y-4">
        {messages.map((msg, index) => {
          const senderId =
            typeof msg.sender === "object" ? msg.sender._id : msg.sender;
          const isCurrentUser = senderId?.toString() === currentUser?._id?.toString();

          const senderName =
            typeof msg.sender === "object" ? msg.sender.firstName : "You";

          return (
            <li
              key={msg._id || index}
              className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
              aria-label={`Message from ${senderName}`}
            >
              <div
                ref={index === messages.length - 1 ? lastMessageRef : null}
                className={`p-3 rounded-xl shadow-md max-w-[70%] break-words ${
                  isCurrentUser ? "bg-blue-100" : "bg-white"
                }`}
              >
                <div className="text-sm text-gray-600">
                  {!isCurrentUser && typeof msg.sender === "object" && (
                    <strong className="text-blue-500">
                      {senderName}
                    </strong>
                  )}

                
                  {msg.text && <p>{msg.text}</p>}

                
                  {msg.file?.type === "image" && msg.file?.url && (
                    <img
                      src={msg.file.url}
                      alt={msg.file.name || "sent image"}
                      className="mt-2 max-w-full rounded-md border"
                    />
                  )}

                
                  {msg.file?.type === "pdf" && msg.file?.url && (
                    <div className="mt-2">
                      <a
                        href={msg.file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline flex items-center space-x-1"
                      >
                        <span>📄</span>
                        <span>{msg.file.name || "View PDF"}</span>
                      </a>
                    </div>
                  )}
                </div>

                <span className="text-xs text-gray-400 block text-right">
                  {msg.createdAt
                    ? new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Just now"}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ChatArea;
