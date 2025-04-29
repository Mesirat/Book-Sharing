import { Loader } from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";
import MessageInput from "../components/chat/MessageInput";
import ChatArea from "../components/chat/ChatArea";
// import GroupList from "../components/chat/GroupList";
import { useAuthStore } from "../store/authStore";
import axios from "axios";
import { io } from "socket.io-client";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import MyGroup from "../components/chat/MyGroup";

const GroupChat = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const [currentGroup, setCurrentGroup] = useState(null);

  const { user } = useAuthStore();
  const socketRef = useRef(null);

  const fetchMessages = useCallback(async () => {
    if (!currentGroup?.name || !user?._id) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `http://localhost:5000/messages/${currentGroup.groupName}`
      );
      if (response.data.success && Array.isArray(response.data.messages)) {
        setMessages(response.data.messages);
      } else {
        setError("Failed to load messages. Invalid data format.");
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
      setError("Failed to load messages. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [currentGroup, user]);

  const handleReceiveMessage = useCallback((message) => {
    setMessages((prevMessages) => {
      if (prevMessages.some((msg) => msg._id === message._id))
        return prevMessages;
      return [...prevMessages, message];
    });
  }, []);

  useEffect(() => {
    if (!user?._id || !currentGroup?.name) return;

    socketRef.current = io("http://localhost:5000", { withCredentials: true });
    socketRef.current.on("connect", () => {
      console.log("Connected to server. Socket ID:", socketRef.current.id);
    });

    socketRef.current.on("connect_error", (err) => {
      console.error("Connection error:", err.message);
    });

    socketRef.current.emit(
      "joinGroup",
      currentGroup.groupName,
      user._id,
      user.username
    );
    socketRef.current.on("receiveMessage", handleReceiveMessage);

    socketRef.current.on("messageSeen", ({ messageId, userId }) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg._id === messageId && !msg.seenBy.includes(userId)
            ? { ...msg, seenBy: [...msg.seenBy, userId] }
            : msg
        )
      );
    });

    fetchMessages();

    return () => {
      socketRef.current.off("receiveMessage", handleReceiveMessage);
      socketRef.current.disconnect();
    };
  }, [currentGroup, user, handleReceiveMessage, fetchMessages]);

  useEffect(() => {
    if (!user?._id || !currentGroup?.groupName) return;

    const unseenMessages = messages.filter(
      (msg) => !msg.seenBy?.includes(user._id) && msg.sender !== user.name
    );

    unseenMessages.forEach((msg) => {
      socketRef.current.emit("markMessageSeen", {
        messageId: msg._id,
        userId: user._id,
      });
    });
  }, [messages, user, currentGroup]);

  const handleSendMessage = async ({ text, file }) => {
    if (!text.trim() && !file) {
      console.error("Cannot send empty message");
      return;
    }

    const formData = new FormData();
    formData.append("groupName", currentGroup.groupName);
    formData.append("sender", user._id);

    if (text.trim()) formData.append("text", text.trim());
    if (file) formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:5000/messages/send",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
        }
      );
      return response.status(200).json({ success: true });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="flex w-full max-h-[90vh] overflow-hidden mx-auto">
      <div className="w-1/3  bg-gray-100 border-r max-h-[90vh] overflow-y-auto">
        <MyGroup
          userId={user._id}
          currentGroup={currentGroup}
          setCurrentGroup={setCurrentGroup}
        />
      </div>

      <div className="w-2/3 flex flex-col  h-[88vh]">
        {currentGroup ? (
          <>
            <div className="sticky top-0 bg-white shadow-md z-10 p-2 rounded-t-lg">
              <h2 className="text-md font-semibold">
                {currentGroup?.groupName}
              </h2>
              <p className="text-sm text-gray-600">
                {currentGroup?.members?.length || 0} members
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-full">
                <Loader className="animate-spin" size={32} />
              </div>
            ) : error ? (
              <div className="text-red-500 text-center mt-4">{error}</div>
            ) : (
              <div className="flex flex-col flex-grow mt-2 overflow-y-auto">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 mt-4">
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  <ChatArea messages={messages} currentUser={user?.name} />
                )}
              </div>
            )}

            <div className="relative mt-4">
              {emojiPickerVisible && (
                <div className="absolute bottom-16 left-0 z-50">
                  <Picker
                    data={data}
                    onEmojiSelect={(emoji) => console.log(emoji)}
                    previewPosition="none"
                  />
                </div>
              )}
              <MessageInput
                onSendMessage={handleSendMessage}
                emojiPickerVisible={emojiPickerVisible}
                setEmojiPickerVisible={setEmojiPickerVisible}
              />
            </div>
          </>
        ) : (
          <div className="flex flex-col justify-center items-center h-full text-gray-400">
            <h2 className="text-xl font-semibold">
              Select a group to start chatting
            </h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupChat;
