import { useState } from "react";
import { IoSendSharp } from "react-icons/io5";
import {toast , Toaster} from "react-hot-toast";

import axios from "axios";
// Add interface for chat message type
interface ChatMessage {
  text: string;
  sender: "user" | "bot";
}

const ChatArea = () => {
  // Update state with proper typing
  const [chatData, setChatData] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [apiKey, setApiKey] = useState("");

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    if (!apiKey) {
      setChatData((prev) => [
        ...prev,
        { text: "Please set your API key first", sender: "bot" },
      ]);
      return;
    }

    setChatData((prev) => [...prev, { text: chatInput, sender: "user" }]);
    setChatInput("");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_APP_USER_BACKEND_MODEL_URL}/query`,
        {
          queryText: chatInput,
          apiKey: apiKey,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.status.toString().startsWith("2")) {
        throw new Error(
          response.statusText || `Server error: ${response.status}`
        );
      }

      const data = response.data;
      setChatData((prev) => [...prev, { text: data.payload.response, sender: "bot" }]);
    } catch (error) {
      toast.error("An unexpected error occurred");  
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      setChatData((prev) => [
        ...prev,
        { text: `Error: ${errorMessage}`, sender: "bot" },
      ]);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white/90 rounded-xl shadow-lg overflow-hidden">
      <Toaster />
      <div className="h-auto min-h-4xl overflow-y-auto p-4 space-y-4">
        {chatData.length > 0 ? (
          chatData.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <span
                className={`px-4 py-2 rounded-lg max-w-[70%] ${
                  message.sender === "user"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                {message.text}
              </span>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">Start a conversation!</p>
        )}
      </div>
      <input
        type="text"
        value={apiKey}
        placeholder="enter you api key here ... "
        onChange={(e) => setApiKey(e.target.value)}
        className="p-2 w-full bg-purple-400 text-black placeholder-gray-600 border-none rounded focus:outline-none dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
      />
      <form
        onSubmit={handleSendMessage}
        className="h-14 w-full p-2 flex items-center border-t border-gray-300"
      >
        <input
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-grow p-2 rounded-lg border border-gray-300 focus:outline-none focus:border-purple-500"
        />
        <button
          type="submit"
          className="ml-2 px-3 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors"
        >
          <IoSendSharp
            size={20}
            className="hover:scale-110 transition-all duration-300"
          />
        </button>
      </form>
    </div>
  );
};

export default ChatArea;
