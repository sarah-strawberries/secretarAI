import { createContext, useContext } from "react";
import type { UseMutationResult } from "@tanstack/react-query";

export type ChatRole = "user" | "assistant" | "system";

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export interface SendMessageRequest {
  conversationId: number;
  content: string;
}

export interface SendMessageResponse {
  conversationId: number;
  assistantText: string;
}

export interface MessageContextValue {
  // Full chat history for rendering
  messages: ChatMessage[];
  // Last AI response as a convenience string
  aiResponse: string;
  // Loading state for in-flight requests
  loading: boolean;
  // Mutation for sending messages
  sendMessageMutation: UseMutationResult<SendMessageResponse, Error, string>;
  // Optional helpers
  resetChat: () => void;
  // Conversations list (non-empty titled)
  conversations: { id: number; title?: string | null | undefined }[];
  // Loading state for conversations query
  conversationsLoading: boolean;
  // Currently selected conversation id (nullable until created)
  conversationId: number | null;
  // Create a new conversation with the default title
  createConversationMutation: UseMutationResult<number, Error, void>;
  // Select an existing conversation and load its messages
  selectConversation: (id: number) => Promise<void>;
}

export const MessageContext = createContext<MessageContextValue | undefined>(
  undefined
);

export function useMessageContext(): MessageContextValue {
  const ctx = useContext(MessageContext);
  if (!ctx) {
    throw new Error("useMessageContext must be used within a MessageProvider");
  }
  return ctx;
}
