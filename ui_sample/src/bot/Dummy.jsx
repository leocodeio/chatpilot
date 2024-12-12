import React, { useState, useEffect, useRef } from "react";
import { GiCrossedBones } from "react-icons/gi";
import { SiChatbot } from "react-icons/si";
import { IoSendSharp } from "react-icons/io5";
import { Toaster, toast } from "react-hot-toast";

const DummyChatbot = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatData, setChatData] = useState([]);
  const [chatInput, setChatInput] = useState("");

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) {
      toast.error("Message cannot be empty!");
      return;
    }

    setChatData((prevChatData) => [
      ...prevChatData,
      { text: chatInput, sender: "user" },
    ]);

    setChatInput("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_CHATBOT_API_URL}/query/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query_text: chatInput,
            api_key: "react",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch response from server");
      }

      const data = await response.json();

      setChatData((prevChatData) => [
        ...prevChatData,
        { text: data.results || "No response from bot.", sender: "bot" },
      ]);

      toast.success("Message sent successfully!");
    } catch (error) {
      console.error("Error:", error);

      setChatData((prevChatData) => [
        ...prevChatData,
        {
          text: "An error occurred while fetching bot response.",
          sender: "bot",
        },
      ]);

      toast.error("An error occurred while fetching the bot's response.");
    }
  };

  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatData]);

  return (
    <>
      {/* Toaster for Notifications */}
      <Toaster position="bottom-center" reverseOrder={false} />

      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          setChatOpen(true);
        }}
        className="fixed h-10 w-10 bottom-8 right-8 rounded-full bg-red-500 flex items-center justify-center shadow-lg cursor-pointer z-50"
      >
        <SiChatbot size={20} />
      </button>

      {chatOpen && (
        <div className="max-w-xs w-full bg-white rounded-lg fixed bottom-8 right-4 shadow-lg z-50">
          <GiCrossedBones
            size={25}
            className="absolute top-[-30px] right-1 hover:scale-125 transition-all duration-300 cursor-pointer text-red-500"
            onClick={(e) => {
              e.preventDefault();
              setChatOpen(false);
            }}
          />
          <div
            className="h-80 w-full overflow-y-auto p-4"
            ref={chatContainerRef}
          >
            {chatData.length > 0 ? (
              chatData.map((message, index) => (
                <div
                  key={index}
                  className={`my-2 ${
                    message.sender === "user" ? "text-right" : "text-left"
                  }`}
                >
                  <span
                    className={`inline-block px-4 py-2 rounded-lg ${
                      message.sender === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    {message.text}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">No messages yet</p>
            )}
          </div>

          <form
            onSubmit={handleSendMessage}
            className="h-14 w-full p-2 flex items-center border-t border-gray-300"
          >
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Query here....."
              className="flex-grow p-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="ml-2 px-3 py-2 rounded-lg bg-blue-500 text-white"
            >
              <IoSendSharp
                size={20}
                className="hover:scale-110 transition-all duration-300"
              />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default DummyChatbot;
