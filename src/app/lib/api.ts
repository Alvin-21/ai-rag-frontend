// Why a wrapper? If the backend URL changes or we add auth headers,
// we change it in ONE place, not across every component.

import { ChatRequest, ChatResponse, HistoryMessage } from "@/types/chat";
import { AppError } from "@/types/error";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function sendMessage(message: string, history: HistoryMessage[]): Promise<ChatResponse> {
    const body: ChatRequest = { message, history };

    const response = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",  // tell the server we're sending JSON
        },
        body: JSON.stringify(body),
    });

    // If the server returned an error status, throw so the UI can handle it
    if (!response.ok) {
      const errorData = await response.json();

      switch (response.status) {
        case 422:
          throw new AppError(errorData["detail"][0]["ctx"]["error"].detail, 422);
        case 429:
          throw new AppError(errorData.message, 429);
        default:
          throw new AppError("Something went wrong. Please try again.", 500);
      }
    }

    return response.json() as Promise<ChatResponse>;
}


/*

This function sends a chat message to the backend API and returns the parsed response.

- `const body: ChatRequest = { message };`
  - Creates the request payload with the `message` string in the shape expected by the backend.

- `const response = await fetch(`${API_URL}/chat`, { ... });`
  - Calls the backend API endpoint at `NEXT_PUBLIC_API_URL/chat`.
  - Uses `POST` with a JSON body.

- `headers: { "Content-Type": "application/json" }`
  - Tells the server that the request body is JSON.

- `body: JSON.stringify(body)`
  - Converts the JavaScript object into a JSON string for transmission.

- `if (!response.ok) { throw new Error(...) }`
  - If the server responds with an HTTP error status (like 400 or 500), it throws an error so the UI can handle it.

- `return response.json() as Promise<ChatResponse>;`
  - Parses the response body as JSON and types it as `ChatResponse`.

So this wrapper centralizes the network request logic for sending chat messages and handling basic error checking.
*/