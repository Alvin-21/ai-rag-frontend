"use client";

import { useState, useRef, useEffect } from "react";
import { Message } from "@/types/chat";
import { sendMessage } from "@/app/lib/api";
import MessageList from "./MessageList";
import InputBar from "./InputBar";

export default function ChatWindow() {
    // useState holds the list of messages. React re-renders when it changes.
    const [messages, setMessages] = useState<Message[]>([]);
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

        try {
            // Call the backend
            const data = await sendMessage(text);

            // Add the AI's reply
            const aiMessage: Message = {
                id: crypto.randomUUID(),
                role: "assistant",
                content: data.reply,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, aiMessage]);
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-screen max-w-2xl mx-auto">
            {/* Header */}
            <header className="p-4 border-b bg-white">
                <h1 className="text-xl font-semibold text-gray-800">AI Assistant</h1>
                <p className="text-sm text-gray-500">Powered by Groq · llama-3.1-8b-instant</p>
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