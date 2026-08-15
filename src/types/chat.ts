// Describes a single chat message
export interface Message {
    id: string;          // unique ID so React can track list items
    role: "user" | "assistant";  // who sent it?
    content: string;     // the text
    sources?: string[];  // optional list of matched knowledge base article titles
    timestamp: Date;
}

// What the frontend sends to the backend
export interface ChatRequest {
    message: string;
}

// What the backend sends back
export interface ChatResponse {
    reply: string;
    sources: string[];   // titles of matched knowledge base articles
}