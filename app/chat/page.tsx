"use client";

import { Fragment, useState } from "react";

import { Bot, Sparkles } from "lucide-react";

import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputBody,
  type PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import { Response } from "@/components/ai-elements/response";
import { Loader } from "@/components/ai-elements/loader";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

const RAGChatBot = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (message: PromptInputMessage) => {
    if (!message.text) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      text: message.text,
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.text,
          })),
        }),
      });

      const data = await res.json();

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        text: data.message || "No response",
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          text: "Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="noir-surface min-h-[calc(100vh-4rem)] px-3 py-4 text-[#fff4e8] sm:px-6 sm:py-6">
      <div className="noir-vignette mx-auto flex h-[calc(100vh-6rem)] max-w-5xl flex-col overflow-hidden rounded-lg border border-white/[0.12] bg-[#1d1216]/[0.88] backdrop-blur">
        <header className="flex flex-col gap-3 border-b border-white/10 bg-[#100a0d]/[0.96] px-4 py-4 text-[#fff4e8] sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-[#c9875f] text-[#160f12] shadow-lg shadow-[#c9875f]/20">
              <Bot className="size-5" />
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-lg font-semibold tracking-tight sm:text-xl">
                Document Chat
              </h1>
              <p className="text-sm text-[#d8c3b5]">
                Ask questions grounded in your uploaded PDFs.
              </p>
            </div>
          </div>
          <div className="inline-flex w-fit items-center gap-2 rounded-md border border-[#c9875f]/30 bg-[#c9875f]/[0.12] px-3 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-[#f1c39f]">
            <Sparkles className="size-3.5" />
            RAG Mode
          </div>
        </header>

        <Conversation className="min-h-0 bg-[radial-gradient(circle_at_top_left,rgb(127_51_68_/_14%),transparent_24rem),#160f12]">
          <ConversationContent className="gap-5 p-3 sm:p-6">
            {messages.length === 0 && !isLoading && (
              <ConversationEmptyState
                className="min-h-[45vh] text-[#d8c3b5]"
                description="Start with a direct question about your uploaded content."
                icon={<Bot className="size-8" />}
                title="Ready for your first question"
              />
            )}
            {messages.map((message) => (
              <Fragment key={message.id}>
                <Message from={message.role}>
                  <MessageContent
                    className={
                      message.role === "user"
                        ? "border border-[#c9875f]/20 bg-[#c9875f] px-4 py-3 text-[#160f12] shadow-lg shadow-[#c9875f]/10"
                        : "rounded-md border border-white/10 bg-white/[0.08] px-4 py-3 text-[#fff4e8] shadow-sm"
                    }
                  >
                    <Response>{message.text}</Response>
                  </MessageContent>
                </Message>
              </Fragment>
            ))}
            {isLoading && <Loader />}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        <div className="border-t border-white/10 bg-[#100a0d]/[0.96] p-3 sm:p-4">
          <PromptInput
            className="border-white/[0.12] bg-[#21161a] shadow-lg shadow-black/20"
            onSubmit={handleSubmit}
          >
            <PromptInputBody>
              <PromptInputTextarea
                className="min-h-20 text-base text-[#fff4e8] placeholder:text-[#a98f84]"
                disabled={isLoading}
                placeholder="Ask about your documents..."
                value={input}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setInput(e.target.value)
                }
              />
            </PromptInputBody>
            <PromptInputToolbar className="border-t border-white/[0.08]">
              <PromptInputTools />
              <PromptInputSubmit
                className="copper-button border-0"
                disabled={isLoading || !input.trim()}
                status={isLoading ? "submitted" : undefined}
              />
            </PromptInputToolbar>
          </PromptInput>
        </div>
      </div>
    </main>
  );
};

export default RAGChatBot;
