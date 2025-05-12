// import { Loader } from "lucide-react";
// import { useState, useEffect, useCallback, useRef } from "react";
// import MessageInput from "../components/chat/MessageInput";
// import ChatArea from "../components/chat/ChatArea";
// import { useAuthStore } from "../store/authStore";
// import api from "../Services/api";
// import { io } from "socket.io-client";
// import Picker from "@emoji-mart/react";
// import data from "@emoji-mart/data";
// import MyGroup from "../components/chat/MyGroup";
// import GroupInfo from "../components/chat/GroupInfo";

// const GroupChat = () => {
//   const [messages, setMessages] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
//   const [currentGroup, setCurrentGroup] = useState(null);
//   const [showGroupDetails, setShowGroupDetails] = useState(false);

//   const token = useAuthStore.getState().token;
//   const { user } = useAuthStore();
//   const socketRef = useRef(null);

//   const fetchMessages = useCallback(async () => {
//     if (!currentGroup?.groupName || !user?._id) return;

//     setLoading(true);
//     setError(null);

//     try {
//       const response = await api.get(`/messages/${currentGroup.groupName}`);
//       if (response.data.success && Array.isArray(response.data.messages)) {
//         setMessages(response.data.messages);
//       } else {
//         setError("Invalid message format.");
//       }
//     } catch (err) {
//       console.error("Error fetching messages:", err);
//       setError("Failed to load messages.");
//     } finally {
//       setLoading(false);
//     }
//   }, [currentGroup, user]);

//   const handleReceiveMessage = useCallback((message) => {
//     setMessages((prevMessages) => {
//       if (prevMessages.some((msg) => msg._id === message._id))
//         return prevMessages;
//       return [...prevMessages, message];
//     });
//   }, []);

//   useEffect(() => {
//     if (!user?._id || !currentGroup?.groupName) return;

//     socketRef.current = io("http://localhost:5000", { withCredentials: true });

//     socketRef.current.on("connect", () => {});

//     socketRef.current.on("connect_error", (err) => {
//       console.error("Socket error:", err.message);
//     });

//     socketRef.current.emit(
//       "joinGroup",
//       currentGroup.groupName,
//       user._id,
//       user.username
//     );

//     socketRef.current.on("receiveMessage", handleReceiveMessage);

//     socketRef.current.on("messageSeen", ({ messageId, userId }) => {
//       setMessages((prevMessages) =>
//         prevMessages.map((msg) =>
//           msg._id === messageId && !msg.seenBy.includes(userId)
//             ? { ...msg, seenBy: [...msg.seenBy, userId] }
//             : msg
//         )
//       );
//     });

//     fetchMessages();

//     return () => {
//       socketRef.current?.off("receiveMessage", handleReceiveMessage);
//       socketRef.current?.disconnect();
//     };
//   }, [currentGroup, user, fetchMessages, handleReceiveMessage]);

//   useEffect(() => {
//     if (!user?._id || !currentGroup?.groupName) return;

//     const unseen = messages.filter(
//       (msg) => !msg.seenBy?.includes(user._id) && msg.sender !== user.name
//     );

//     unseen.forEach((msg) => {
//       socketRef.current.emit("markMessageSeen", {
//         messageId: msg._id,
//         userId: user._id,
//       });
//     });
//   }, [messages, user, currentGroup]);

//   const handleSendMessage = async ({ text, file }) => {
//     if (!text.trim() && !file) return;

//     const formData = new FormData();
//     formData.append("groupName", currentGroup.groupName);
//     formData.append("sender", user._id);
//     if (text.trim()) formData.append("text", text.trim());

//     if (file) {
//       const ext = file.name.split(".").pop().toLowerCase();
//       if (["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(ext)) {
//         formData.append("thumbnail", file);
//       } else if (ext === "pdf") {
//         formData.append("pdf", file);
//       }
//     }

//     try {
//       const res = await api.post("/messages/send", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (res.data.success && res.data.message) {
//         setMessages((prev) => [...prev, res.data.message]);
//       }
//     } catch (err) {
//       console.error("Message send error:", err);
//     }
//   };

//   return (
//     <div className="flex w-full max-h-[90vh] overflow-hidden mx-auto">
//       <div className="w-1/3 bg-gray-100 border-r max-h-[85vh] overflow-y-auto">
//         <MyGroup
//           userId={user._id}
//           currentGroup={currentGroup}
//           setCurrentGroup={setCurrentGroup}
//         />
//       </div>
//       {showGroupDetails && currentGroup && (
//         <GroupInfo
//           groupId={currentGroup._id}
//           onClose={() => setShowGroupDetails(false)}
//         />
//       )}
//       <div className="w-2/3 flex flex-col h-[85vh]">
//         {currentGroup ? (
//           <>
//             <div
//               className="sticky top-0 bg-white shadow-md z-10 p-2 rounded-t-lg cursor-pointer"
//               onClick={() => setShowGroupDetails(!showGroupDetails)}
//             >
//               <h2 className="text-md font-semibold">
//                 {currentGroup?.groupName}
//               </h2>
//               <p className="text-sm text-gray-600">
//                 {currentGroup?.members?.length || 0} members
//               </p>
//             </div>

//             {loading ? (
//               <div className="flex justify-center items-center h-full">
//                 <Loader className="animate-spin" size={32} />
//               </div>
//             ) : error ? (
//               <div className="text-red-500 text-center mt-4">{error}</div>
//             ) : (
//               <div className="flex flex-col flex-grow mt-4 overflow-y-auto">
//                 {messages.length === 0 ? (
//                   <div className="text-center text-gray-500 mt-4">
//                     No messages yet. Start the conversation!
//                   </div>
//                 ) : (
//                   <ChatArea messages={messages} currentUser={user} />
//                 )}
//               </div>
//             )}

//             <div className="relative mt-6">
//               <MessageInput
//                 onSendMessage={handleSendMessage}
//                 emojiPickerVisible={emojiPickerVisible}
//                 setEmojiPickerVisible={setEmojiPickerVisible}
//               />
//             </div>
//           </>
//         ) : (
//           <div className="flex flex-col justify-center items-center h-full text-gray-400">
//             <h2 className="text-xl font-semibold">
//               Select a group to start chatting
//             </h2>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default GroupChat;
import { Loader } from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";
import MessageInput from "../components/chat/MessageInput";
import ChatArea from "../components/chat/ChatArea";
import { useAuthStore } from "../store/authStore";
import api from "../Services/api";
import { io } from "socket.io-client";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import MyGroup from "../components/chat/MyGroup";
import GroupInfo from "../components/chat/GroupInfo";

const GroupChat = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const [currentGroup, setCurrentGroup] = useState(null);
  const [showGroupDetails, setShowGroupDetails] = useState(false);

  const token = useAuthStore.getState().token;
  const { user } = useAuthStore();
  const socketRef = useRef(null);

  const fetchMessages = useCallback(async () => {
    if (!currentGroup?.groupName || !user?._id) return;

    setLoading(true);
    setError(null);

    try {
      const response = await api.get(`/messages/${currentGroup.groupName}`);
      if (response.data.success && Array.isArray(response.data.messages)) {
        setMessages(response.data.messages);
      } else {
        setError("Invalid message format.");
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
      setError("Failed to load messages.");
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
    if (!user?._id || !currentGroup?.groupName) return;

    socketRef.current = io("http://localhost:5000", { withCredentials: true });

    socketRef.current.on("connect", () => {});

    socketRef.current.on("connect_error", (err) => {
      console.error("Socket error:", err.message);
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
      socketRef.current?.off("receiveMessage", handleReceiveMessage);
      socketRef.current?.disconnect();
    };
  }, [currentGroup, user, fetchMessages, handleReceiveMessage]);

  useEffect(() => {
    if (!user?._id || !currentGroup?.groupName) return;

    const unseen = messages.filter(
      (msg) => !msg.seenBy?.includes(user._id) && msg.sender !== user.name
    );

    unseen.forEach((msg) => {
      socketRef.current.emit("markMessageSeen", {
        messageId: msg._id,
        userId: user._id,
      });
    });
  }, [messages, user, currentGroup]);

  const handleSendMessage = async ({ text, file }) => {
    if (!text.trim() && !file) return;

    const formData = new FormData();
    formData.append("groupName", currentGroup.groupName);
    formData.append("sender", user._id);
    if (text.trim()) formData.append("text", text.trim());

    if (file) {
      const ext = file.name.split(".").pop().toLowerCase();
      if (["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(ext)) {
        formData.append("thumbnail", file);
      } else if (ext === "pdf") {
        formData.append("pdf", file);
      }
    }

    try {
      const res = await api.post("/messages/send", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success && res.data.message) {
        setMessages((prev) => [...prev, res.data.message]);
      }
    } catch (err) {
      console.error("Message send error:", err);
    }
  };

  return (
    <div className="flex w-full h-[96vh] overflow-hidden mx-auto">
     
      <div className="lg:w-1/3 w-full bg-gray-100 border-r max-h-[96vh] overflow-y-auto hide-scrollbar">
        <MyGroup
          userId={user._id}
          currentGroup={currentGroup}
          setCurrentGroup={setCurrentGroup}
        />
      </div>
           {showGroupDetails && currentGroup && (
        <GroupInfo
          groupId={currentGroup._id}
          onClose={() => setShowGroupDetails(false)}
        />
      )}
      <div className="lg:w-2/3 w-full flex flex-col max-h-screen">
        {currentGroup ? (
          <>
            <div
              className="sticky top-0 bg-white shadow-md z-10 p-2 rounded-t-lg cursor-pointer"
              onClick={() => setShowGroupDetails(!showGroupDetails)}
            >
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
              <div className="flex flex-col flex-grow mt-1 overflow-y-auto">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 mt-4">
                    No messages yet. Start the conversation!
                  </div>
                ) : (
                  <ChatArea messages={messages} currentUser={user} />
                )}
              </div>
            )}

            
            <div className="relative">
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
