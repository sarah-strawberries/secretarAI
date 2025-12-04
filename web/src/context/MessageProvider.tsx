import React, { useState } from "react";
import { MessageContext, type ChatMessage } from "./MessageContext";
import { z } from "zod";
import { useQuery, useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useAuth } from "react-oidc-context";

interface Props {
  children: React.ReactNode;
}

export const MessageProvider: React.FC<Props> = ({ children }) => {
  const [aiResponse, setAiResponse] = useState<string>("");
  const [conversationId, setConversationId] = useState<number | null>(null);
  const auth = useAuth();

  // Zod validators for API shapes used by the client
  const CreateConversationResponseSchema = z.object({
    conversation: z.object({ id: z.number() }),
  });

  const ListConversationsResponseSchema = z.object({
    conversations: z.array(
      z.object({ id: z.number(), title: z.string().nullable().optional() })
    ),
  });

  const ListMessagesResponseSchema = z.object({
    messages: z.array(
      z.object({ role: z.enum(["user", "assistant", "system"]), content: z.string() })
    ),
  });

  const SendMessageResponseSchema = z.object({
    conversationId: z.number(),
    assistantText: z.string(),
  });

  const resetChat = () => {
    setAiResponse("");
    setConversationId(null);
  };

  // Fetch conversations using useQuery
  const fetchConversations = async () => {
    const res = await fetch("/api/conversations", {
      headers: {
        "Authorization": `Bearer ${auth.user?.access_token}`
      }
    });
    if (!res.ok) {
      toast.error(`An error occurred while fetching conversations. Status code: ${res.status}`);
      throw new Error('Failed to fetch conversations');
    }
    const json = await res.json();
    const parsed = ListConversationsResponseSchema.safeParse(json);
    if (!parsed.success) {
      toast.error('A parsing error occurred. Status code: 500');
      throw new Error('Invalid conversations response');
    }
    return parsed.data.conversations;
  };

  const {
    data: conversations = [],
    refetch: refreshConversations,
    isLoading: conversationsLoading,
    // error: conversationsError (not used)
  } = useQuery({
    queryKey: ['conversations'],
    queryFn: fetchConversations,
  });

  const createConversation = async () => {
    const res = await fetch("/api/conversations", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${auth.user?.access_token}`
      },
      body: JSON.stringify({ title: "Chat Session" }),
    });
    if (!res.ok) {
      toast.error(`Oops, an error occurred! Status code: ${res.status}`);
      throw new Error("Failed to create conversation");
    }
    const json = await res.json();
    const parsed = CreateConversationResponseSchema.safeParse(json);
    if (!parsed.success) {
      toast.error('Oops, an error occurred! Status code: 500');
      throw new Error("Failed to create conversation");
    }
    return parsed.data.conversation.id;
  };

  const createConversationMutation = useMutation({
    mutationFn: createConversation,
    onSuccess: () => {
      refreshConversations();
    },
    onError: () => {
      toast.error('Oops, an error occurred! Status code: 500');
    },
  });

  const selectConversation = async (id: number) => {
    if (!id || id === conversationId) return;
    setConversationId(id);
    // useQuery will refetch messages automatically
  };

  // Fetch messages using useQuery
  const fetchMessages = async (conversationId: number | null) => {
    if (!conversationId) return [];
    const res = await fetch(`/api/conversations/${conversationId}/messages`, {
      headers: {
        "Authorization": `Bearer ${auth.user?.access_token}`
      }
    });
    if (!res.ok) {
      toast.error(`Oops, an error occurred! Status code: ${res.status}`);
      throw new Error('Failed to fetch messages');
    }
    const json = await res.json();
    const parsed = ListMessagesResponseSchema.safeParse(json);
    if (!parsed.success) {
      toast.error('Oops, an error occurred! Status code: 500');
      throw new Error('Invalid messages response');
    }
    return parsed.data.messages as ChatMessage[];
  };

  const {
    data: messages = [],
    isLoading: loading,
    refetch: refetchMessages,
    // error: messagesError (not used)
  } = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => fetchMessages(conversationId),
    enabled: !!conversationId,
  });

  const sendLatestMessage = async (latestUserInput: string): Promise<{ conversationId: number; assistantText: string }> => {
      const input = latestUserInput.trim();
      if (!input) {
        throw new Error("Message cannot be empty");
      }

      setAiResponse("");
      let convId = conversationId;
      if (!convId) {
        // lazily create a conversation if missing (e.g., after reset)
        convId = await createConversation();
        setConversationId(convId);
      }

      const response = await fetch("/api/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" , "Authorization": `Bearer ${auth.user?.access_token}`}, 
        body: JSON.stringify({ conversationId: convId, content: input }),
      });

      if (!response.ok) {
        toast.error(`Oops, an error occurred! Status code: ${response.status}`);
        throw new Error(`Error: failed to get response (${response.status})`);
      }

      const data = await response.json();
      const parsed = SendMessageResponseSchema.safeParse(data);
      if (!parsed.success) {
        toast.error('Oops, an error occurred! Status code: 500');
        throw new Error("Invalid response format");
      }
      
      return parsed.data;
    };

  const sendMessageMutation = useMutation({
    mutationFn: sendLatestMessage,
    onSuccess: (data) => {
      setAiResponse(data.assistantText);
      // Refetch messages after sending
      refetchMessages();
      if (messages.length === 0) {
        // server may have auto-titled conversation; refresh list
        refreshConversations();
      }
    },
    onError: (error) => {
      setAiResponse(error.message || "Error: network error");
    },
  });

  const value = {
    messages,
    aiResponse,
    loading,
    sendMessageMutation,
    resetChat,
    conversations,
    conversationsLoading,
    conversationId,
    createConversationMutation,
    selectConversation,
  };

  return (
    <MessageContext.Provider value={value}>{children}</MessageContext.Provider>
  );
};

export default MessageProvider;
