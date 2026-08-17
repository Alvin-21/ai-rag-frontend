// Describes a single chat message
export interface Message {
    id: string;          // unique ID so React can track list items
    role: "user" | "assistant";  // who sent it?
    content: string;     // the text
    sources?: string[];  // optional list of matched knowledge base article titles
    timestamp: Date;
}

/**
 * One previous turn in the conversation.
 * Sent to the backend as part of ChatRequest.history.
 *
 * This is a subset of Message — only the fields the backend cares about.
 * We deliberately omit id and timestamp: the backend doesn't need them.
 */
export interface HistoryMessage {
  role: "user" | "assistant";
  content: string;
}

/**
 * What we POST to /chat.
 *
 * Turn 1 (first message):
 *   { message: "Hi!", history: [] }
 *
 * Turn 2 (follow-up):
 *   {
 *     message: "Tell me more",
 *     history: [
 *       { role: "user",      content: "Hi!" },
 *       { role: "assistant", content: "Hello! How can I help?" }
 *     ]
 *   }
 */

// What the frontend sends to the backend
export interface ChatRequest {
    message: string;
    history: HistoryMessage[];  // empty array on the first turn
}

// What the backend sends back
export interface ChatResponse {
    reply: string;
    sources: string[];   // titles of matched knowledge base articles
}