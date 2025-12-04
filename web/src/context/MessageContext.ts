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
  messages: ChatMessage[];
  mostRecentAiResponse: string;
  loading: boolean;
  sendMessageMutation: UseMutationResult<SendMessageResponse, Error, string>;
  conversations: { id: number; title?: string | null | undefined }[];
  conversationsLoading: boolean;
  conversationId: number | null;
  createConversationMutation: UseMutationResult<number, Error, void>;
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
