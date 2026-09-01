"use client";

import { useState, useRef, useEffect } from "react";
import { Message, HistoryMessage } from "@/types/chat";
import { sendMessage } from "@/app/lib/api";
import MessageList from "./MessageList";
import InputBar from "./InputBar";
import { AppError } from "@/types/error";

// Maximum number of history messages to send per request.
// 10 messages = 5 full turns (user + assistant each time).
// Increase this for longer context, or decrease to save tokens.
const MAX_HISTORY_MESSAGES = 10;

export default function ChatWindow() {
    // useState holds the list of messages. React re-renders when it changes.
    const [messages, setMessages] = useState<Message[]>([]);
    const [conversationHistory, setConversationHistory] = useState<HistoryMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Used to auto-scroll to the bottom when a new message arrives
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async (text: string) => {
        if (!text.trim() || isLoading) return;

        // Add the user's message to state immediately (feels instant)
        const userMessage: Message = {
            id: crypto.randomUUID(),
            role: "user",
            content: text,
            timestamp: new Date(),
        };
        setMessages((prev) => [...prev, userMessage]);
        setIsLoading(true);
        setError(null);

        // ── Step 2: Trim history before sending ──
        //
        // Slice from the end to keep only the most recent turns.
        // .slice(-10) returns the last 10 elements of any array.
        // If the array has fewer than 10 elements, it returns everything.
        const historyToSend = conversationHistory.slice(-MAX_HISTORY_MESSAGES);

        try {
            // Call the backend
            const data = await sendMessage(text.trim(), historyToSend);

            // Add the AI's reply
            const aiMessage: Message = {
                id: crypto.randomUUID(),
                role: "assistant",
                content: data.reply,
                sources: data.sources,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, aiMessage]);

            // We add the user message AND the AI reply together as a pair.
            // This keeps history in alternating user/assistant order, which
            // is required by the Groq API.
            //
            // IMPORTANT: we use text.trim() (not userMessage.content) and
            // data.reply directly — these are the clean strings without UI metadata.
            setConversationHistory((prev) => [
                ...prev,
                { role: "user", content: text.trim() },   // what the user said
                { role: "assistant", content: data.reply },     // what the AI said
            ]);
        } catch (err) {
            if (err instanceof AppError) {
                setError(err.message);
            } else {
                setError("Something went wrong. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-screen max-w-2xl mx-auto">
            {/* Header */}
            <header className="p-4 border-b bg-white">
                <h1 className="text-xl font-semibold text-gray-800">AI Assistant</h1>
                <p className="text-sm text-gray-500">Powered by Groq · openai/gpt-oss-20b</p>
            </header>

            {/* Message area — scrollable */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                <MessageList messages={messages} isLoading={isLoading} />
                {error && (
                    <p className="text-center text-sm text-red-500">{error}</p>
                )}
                <div ref={bottomRef} />
            </div>

            {/* Input area — stays at bottom */}
            <InputBar onSend={handleSend} isLoading={isLoading} />
        </div>
    );
}