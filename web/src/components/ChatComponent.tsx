import React, { useState, useEffect } from "react";
import ChatMessage from "./ChatMessage";
import { useMessageContext } from "../context/MessageContext";
import { JobContext } from "../types/JobContext";

interface ChatComponentProps {
  jobContext: JobContext;
}

const ChatComponent: React.FC<ChatComponentProps> = ({ jobContext }) => {
  const [userInput, setUserInput] = useState("");
  const { 
    messages: chat, 
    loading, 
    sendMessageMutation, 
    resetChat
  } = useMessageContext();

  const isLoading = loading || sendMessageMutation.isPending;

  useEffect(() => {
      resetChat();
  }, [jobContext]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const input = userInput.trim();
    if (!input) return;
    setUserInput("");
    sendMessageMutation.mutate({ content: input, jobContext });
  };

  return (
    <div className="flex flex-col h-[600px] w-2/3 mx-auto bg-[var(--tan-100)] rounded-lg shadow-lg overflow-hidden border border-[var(--tan-300)]">
      <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
        <div className="flex flex-col space-y-4">
          {chat.map((msg, i) => {
            const isUser = msg.role === "user";
            return (
              <div
                key={i}
                className={`w-full flex ${isUser ? "justify-end" : "justify-start"}`}
              >
                <ChatMessage
                  message={msg.content}
                  sender={msg.role}
                />
              </div>
            );
          })}
          {isLoading && (
             <div className="w-full flex justify-start">
                <div className="bg-[var(--blue-500)] text-white rounded-2xl px-5 py-4 my-2 max-w-[80%] self-start text-base shadow-md relative mb-2 opacity-70">
                    <div className="text-xs mb-1 text-blue-100 font-semibold">SecretarAI</div>
                    Thinking...
                </div>
             </div>
          )}
        </div>
      </div>
      <div className="border-t border-[var(--tan-300)] p-4 bg-white">
        <form onSubmit={sendMessage} className="flex gap-2 w-full">
          <input
            type="text"
            value={userInput}
            onChange={e => setUserInput(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-1 rounded border border-[var(--coolgrey-200)] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--blue-400)]"
          />
          <button
            type="submit"
            disabled={isLoading || !userInput.trim()}
            className="rounded bg-[var(--blue-500)] text-white px-4 py-2 disabled:opacity-50 hover:bg-[var(--blue-600)] transition-colors"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatComponent;
