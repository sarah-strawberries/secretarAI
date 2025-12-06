import { createContext, useContext } from "react";
import type { UseMutationResult } from "@tanstack/react-query";
import { JobContext } from "../types/JobContext";

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

export interface SendMessageArgs {
  content: string;
  jobContext?: JobContext;
}

export interface CreateConversationArgs {
  jobContext?: JobContext;
}

export interface MessageContextValue {
  messages: ChatMessage[];
  mostRecentAiResponse: string;
  loading: boolean;
  sendMessageMutation: UseMutationResult<SendMessageResponse, Error, SendMessageArgs>;
  conversations: { id: number; title?: string | null | undefined }[];
  conversationsLoading: boolean;
  conversationId: number | null;
  createConversationMutation: UseMutationResult<number, Error, CreateConversationArgs | void>;
  selectConversation: (id: number) => Promise<void>;
  resetChat: () => void;
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
