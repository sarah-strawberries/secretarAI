import { useEffect, useState } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

interface ChatMessageProps {
  message: string;
  sender: "assistant" | "user" | "system";
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, sender }) => {
  const [parsedMessage, setParsedMessage] = useState<string>('');
  const isAI = sender === "assistant";
  
  useEffect(() => {
    if (isAI) {
      const parseMessage = async () => {
        try {
          const parsed = await marked.parse(message);
          setParsedMessage(DOMPurify.sanitize(parsed));
        } catch (error) {
          console.error('Error parsing markdown:', error);
          setParsedMessage(DOMPurify.sanitize(message));
        }
      };
      parseMessage();
    }
  }, [message, isAI]);

  const bubbleClass = isAI
    ? "bg-[var(--blue-500)] text-white rounded-2xl px-5 py-4 my-2 max-w-[80%] self-start text-base shadow-md relative mb-2"
    : "bg-[var(--bluegrey-100)] text-[#222] rounded-2xl px-5 py-4 my-2 max-w-[80%] self-end text-base shadow-sm relative mb-2";
  const caption = isAI ? "SecretarAI" : "You";
  const captionClass = isAI
    ? "text-xs mb-1 text-blue-100 font-semibold"
    : "text-xs mb-1 text-gray-500 font-semibold";

  return (
    <div className={bubbleClass}>
      <div className={captionClass}>{caption}</div>
      {isAI ? (
        <div
          className="prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{
            __html: parsedMessage,
          }}
        />
      ) : (
        message
      )}
    </div>
  );
};

export default ChatMessage;
