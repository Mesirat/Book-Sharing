const GroupChat = ({ group }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const [messageText, setMessageText] = useState("");
  const { user } = useAuthStore();
  const socketRef = useRef(null);

  const fetchMessages = useCallback(async () => {
    if (!group || !user?._id) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `http://localhost:5000/messages/${group.name}`
      );
      if (response.data.success && Array.isArray(response.data.messages)) {
        setMessages(response.data.messages);
      } else {
        setError("Failed to load messages. Invalid data format.");
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      setError("Failed to load messages. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [group, user]);

  const handleReceiveMessage = useCallback((message) => {
    setMessages((prevMessages) => {
      if (prevMessages.some((msg) => msg._id === message._id)) return prevMessages;
      return [...prevMessages, message];
    });
  }, []);

  useEffect(() => {
    if (!user?._id) return;

    const unseenMessages = messages.filter(
      (msg) => !msg.seenBy?.includes(user._id) && msg.sender !== user.name
    );

    unseenMessages.forEach((msg) => {
      socketRef.current.emit("markMessageSeen", {
        messageId: msg._id,
        userId: user._id,
      });
    });
  }, [messages, user]);

  useEffect(() => {
    if (!group || !user?._id) return;

    socketRef.current = io("http://localhost:5000");

    socketRef.current.emit("joinGroup", group.name, user._id, user.username);
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
  }, [group, user, handleReceiveMessage, fetchMessages]);

  const handleSendMessage = async ({ text, file }) => {
    if (!text.trim() && !file) return;
    if (file && !text.trim()) text = null;
    const formData = new FormData();
    formData.append("groupName", group.name);
    formData.append("sender", user.name);
    if (text) formData.append("text", text);
    if (file) formData.append("file", file);
    const messageData = {
      groupName: group.name,
      sender: user.name,
      text: text || "",
      status: "sending",
    };

    setMessages((prevMessages) => [...prevMessages, messageData]);

    try {
      const response = await axios.post(
        "http://localhost:5000/messages/send",
        formData,
        { "Content-Type": "multipart/form-data" }
      );

      if (response.status === 201) {
        const updatedMessage = {
          ...messageData,
          status: "sent",
          createdAt: response.data.createdAt,
          fileUrl: response.data.fileUrl,
        };

        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.text === messageData.text && msg.status === "sending"
              ? updatedMessage
              : msg
          )
        );

        socketRef.current.emit("sendMessage", updatedMessage);
      } else {
        throw new Error(response.data?.message || "Failed to send message.");
      }
    } catch (error) {
      console.error("Error sending message:", error.response?.data || error.message);
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.text === messageData.text && msg.status === "sending"
            ? { ...msg, status: "failed" }
            : msg
        )
      );
      setError("Failed to send message. Please try again.");
    }
  };

  return (
    <div className="flex w-full h-full overflow-hidden">
      <div className="flex w-full flex-col px-4">
        <div className="sticky top-0 bg-white shadow-md z-10 p-4 rounded-t-lg">
          <h2 className="text-lg font-bold">{group.name}</h2>
          <p className="text-sm text-gray-600">{group.members?.length || 0} members</p>
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
                <p>No conversation yet. Start messaging to begin the conversation!</p>
              </div>
            ) : (
              <ChatArea messages={messages} currentUser={user?.name} />
            )}
          </div>
        )}

        <div className="relative mt-4">
          {emojiPickerVisible && (
            <div className="absolute bottom-16 left-0 z-50">
              <Picker data={data} onEmojiSelect={handleEmojiSelect} previewPosition="none" />
            </div>
          )}
          <MessageInput
            onSendMessage={handleSendMessage}
            emojiPickerVisible={emojiPickerVisible}
            setEmojiPickerVisible={setEmojiPickerVisible}
          />
        </div>
      </div>
    </div>
  );
};

export default GroupChat;
