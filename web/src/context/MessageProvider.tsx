import React, { useState } from "react";
import { MessageContext, type ChatMessage, type SendMessageArgs, type CreateConversationArgs } from "./MessageContext";
import { z } from "zod";
import { useQuery, useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useAuth } from "react-oidc-context";

interface Props {
  children: React.ReactNode;
}

export const MessageProvider: React.FC<Props> = ({ children }) => {
  const [mostRecentAiResponse, setAiResponse] = useState<string>("");
  const [conversationId, setConversationId] = useState<number | null>(null);
  const auth = useAuth();

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

  const fetchConversations = async () => {
    const res = await fetch("/api/conversations", {
      headers: {
        "Authorization": `Bearer ${auth.user?.access_token}`
      }
    });
    if (!res.ok) {
      throw new Error(`An error occurred while fetching conversations. Status code: ${res.status}`);
    }
    const json = await res.json();
    const parsed = ListConversationsResponseSchema.safeParse(json);
    if (!parsed.success) {
      throw new Error('A parsing error occurred. Status code: 500');
    }
    return parsed.data.conversations;
  };

  const {
    data: conversations = [],
    refetch: refreshConversations,
    isLoading: conversationsLoading,
    error: conversationsError,
    isError: isConversationsError,
  } = useQuery({
    queryKey: ['conversations'],
    queryFn: fetchConversations,
  });

  React.useEffect(() => {
    if (isConversationsError && conversationsError) {
      toast.error(conversationsError.message, { id: 'fetch-conversations-error' });
    }
  }, [isConversationsError, conversationsError]);

  const createConversation = async (args?: CreateConversationArgs) => {
    const body: any = { title: "Chat Session" };
    if (args?.jobContext) {
      body.jobContext = args.jobContext;
    }
    const res = await fetch("/api/conversations", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${auth.user?.access_token}`
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      throw new Error(`Oops, an error occurred! Status code: ${res.status}`);
    }
    const json = await res.json();
    const parsed = CreateConversationResponseSchema.safeParse(json);
    if (!parsed.success) {
      throw new Error('Oops, an error occurred! Status code: 500');
    }
    return parsed.data.conversation.id;
  };

  const createConversationMutation = useMutation({
    mutationFn: createConversation,
    onSuccess: () => {
      refreshConversations();
    },
    onError: (error) => {
      toast.error(error.message, { id: 'create-conversation-error' });
    },
  });

  const selectConversation = async (id: number) => {
    if (!id || id === conversationId) return;
    setConversationId(id);
  };

  const fetchMessages = async (conversationId: number | null) => {
    if (!conversationId) return [];
    const res = await fetch(`/api/conversations/${conversationId}/messages`, {
      headers: {
        "Authorization": `Bearer ${auth.user?.access_token}`
      }
    });
    if (!res.ok) {
      throw new Error(`Oops, an error occurred! Status code: ${res.status}`);
    }
    const json = await res.json();
    const parsed = ListMessagesResponseSchema.safeParse(json);
    if (!parsed.success) {
      throw new Error('Oops, an error occurred! Status code: 500');
    }
    return parsed.data.messages as ChatMessage[];
  };

  const {
    data: messages = [],
    isLoading: loading,
    refetch: refetchMessages,
    error: messagesError,
    isError: isMessagesError,
  } = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => fetchMessages(conversationId),
    enabled: !!conversationId,
  });

  React.useEffect(() => {
    if (isMessagesError && messagesError) {
      toast.error(messagesError.message, { id: 'fetch-messages-error' });
    }
  }, [isMessagesError, messagesError]);

  const sendLatestMessage = async ({ content: latestUserInput, jobContext }: SendMessageArgs): Promise<{ conversationId: number; assistantText: string }> => {
      const input = latestUserInput.trim();
      if (!input) {
        throw new Error("Message cannot be empty");
      }

      setAiResponse("");
      let convId = conversationId;
      if (!convId) {
        convId = await createConversation({ jobContext });
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
      refetchMessages();
      if (messages.length === 0) {
        refreshConversations();
      }
    },
    onError: (error) => {
      setAiResponse(error.message || "Error: network error");
    },
  });

  const value = {
    messages,
    mostRecentAiResponse,
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
