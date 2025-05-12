import React, { useRef, useState } from "react";
import { Paperclip, SendHorizontal, X } from "lucide-react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { useAuthStore } from "../../store/authStore";

const MessageInput = ({ onSendMessage }) => {
  const [text, setText] = useState("");
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const maxMessageLength = 1500;
  const { user } = useAuthStore();
  const inputRef = useRef(null);
  const maxFileSize = 20 * 1024 * 1024; //20MB

  const handleSend = () => {
    if (text.trim() || file) {
      onSendMessage({ text, file });
      setText("");
      setFile(null);
      setPreview(null);
      inputRef.current?.focus();
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > maxFileSize) {
        alert("File size exceeds the 5MB limit.");
      } else {
        setFile(selectedFile);
        const ext = selectedFile.name.split(".").pop().toLowerCase();
        const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp"];
        if (imageExtensions.includes(ext)) {
          setPreview(URL.createObjectURL(selectedFile));
        } else {
          setPreview(null);
        }
      }
    }
  };

  const handleCancelPreview = () => {
    setFile(null);
    setPreview(null);
  };

  const handleEmojiSelect = (emoji) => {
    setText((prevText) => prevText + emoji.native);
    setEmojiPickerVisible(false);
  };

  return (
    <div className="p-4 border-t bg-white relative">

     
      {file && (
        <div className="absolute top-[-200px] left-0 w-full flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-80 relative">
            <button
              className="absolute top-2 right-2 text-gray-500"
              onClick={handleCancelPreview}
            >
              <X size={20} />
            </button>

            {(() => {
              const extension = file.name.split('.').pop().toLowerCase();
              const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp"];

              if (imageExtensions.includes(extension)) {
                return (
                  <img
                    src={preview}
                    alt="Image Preview"
                    className="max-w-full max-h-60 mb-4 rounded"
                  />
                );
              } else {
                return (
                  <div className="flex flex-col items-center mb-4">
                    <div className="text-6xl text-gray-400 mb-2">📄</div>
                    <p className="text-sm text-center break-words">{file.name}</p>
                  </div>
                );
              }
            })()}

            <button
              onClick={handleSend}
              className="bg-blue-600 text-white px-4 py-2 rounded w-full"
            >
              {(() => {
                const ext = file.name.split('.').pop().toLowerCase();
                const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp"];
                return imageExtensions.includes(ext) ? "Send Image" : "Send File";
              })()}
            </button>
          </div>
        </div>
      )}

     
      <div className="flex items-center">
        <label htmlFor="file-input" className="cursor-pointer mr-2">
          <Paperclip />
        </label>
        <input
          type="file"
          className="hidden"
          onChange={handleFileChange}
          accept="image/*,application/pdf,.doc,.docx,.txt"
          id="file-input"
        />
        <input
          ref={inputRef}
          type="text"
          className={`flex-1 border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            text.length > maxMessageLength ? "border-red-500" : ""
          }`}
          placeholder={`Type a message, ${user.name || "Anonymous"}`}
          value={text}
          onChange={(e) => {
            if (e.target.value.length <= maxMessageLength) {
              setText(e.target.value);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && (text.trim() || file)) {
              handleSend();
            }
          }}
        />

      
        <div className="relative">
          <button
            className="text-xl cursor-pointer ml-2"
            onClick={() => setEmojiPickerVisible((prev) => !prev)}
            aria-label="Select emoji"
          >
            😊
          </button>
          {emojiPickerVisible && (
            <div className="absolute bottom-12 right-[-15px] z-50">
              <Picker data={data} onEmojiSelect={handleEmojiSelect} previewPosition="none" />
            </div>
          )}
        </div>

  
        <button
          className={`ml-2 p-2 rounded ${
            text.trim() || file ? "text-blue-600" : "hidden"
          }`}
          onClick={handleSend}
          disabled={!text.trim() && !file}
        >
          <SendHorizontal />
        </button>
      </div>

      <p
        className={`text-xs mt-2 ${
          text.length > maxMessageLength ? "text-red-500" : "text-gray-500"
        }`}
      >
        {text.length}/{maxMessageLength} characters
      </p>
    </div>
  );
};

export default MessageInput;
