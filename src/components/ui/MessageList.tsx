// Renders the scrollable history of all chat messages, plus the AI "typing"
// indicator when a response is loading.
//
// RESPONSIBILITIES:
//  • Map over the messages array and render a MessageBubble for each
//  • Show a "thinking" animation while isLoading is true
//  • Show an empty state (welcome message) before the conversation starts
//  • Apply a stable key to each list item so React can track changes
//
// WHY DOES KEY MATTER?
//  React uses the key prop to identify which items in a list have changed,
//  been added, or been removed. Without stable keys, React may re-render
//  the wrong items — causing visual glitches or lost animations.
//  We use message.id (a UUID) as the key — it's unique and never changes.
// ─────────────────────────────────────────────────────────────────────────────

import { Message } from "@/types/chat";
import MessageBubble from "./MessageBubble";

// ─── Props ────────────────────────────────────────────────────────────────────

interface MessageListProps {
  messages: Message[];     // all messages so far (may be empty)
  isLoading: boolean;      // true while waiting for the AI response
}

// ─── Sub-component: Typing Indicator ─────────────────────────────────────────
/*
  The three bouncing dots that appear while the AI is "thinking".

  HOW THE ANIMATION WORKS:
  Each dot (<span class="typing-dot">) has the same bounce keyframe animation
  defined in globals.css. The :nth-child selector in globals.css gives each
  dot a different animation-delay, so they bounce in sequence.

  Dot 1: delay 0s   → bounces first
  Dot 2: delay 0.15s → bounces second
  Dot 3: delay 0.30s → bounces third

  The result looks like the AI is "thinking". This visual feedback is
  important — without it, users don't know if their message was received.
*/

function TypingIndicator() {
  return (
    /*
      animate-message-in — same entrance animation as real messages.
      This makes the typing indicator feel like a real message appearing.
    */
    <div
      className="animate-message-in flex items-end gap-2"
      role="status"
      aria-live="polite"
      aria-label="AI is thinking"
      /*
        role="status" + aria-live="polite": screen readers will announce
        "AI is thinking" when this element appears, without interrupting
        whatever the screen reader is currently reading.
      */
    >
      {/* Mirror the AI avatar from MessageBubble for visual consistency */}
      <div
        className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold"
        style={{
          background: "linear-gradient(135deg, #6366F1 0%, #4F6EF7 100%)",
          color: "#fff",
          boxShadow: "0 2px 8px rgba(79, 110, 247, 0.25)",
        }}
        aria-hidden="true"
      >
        AI
      </div>

      {/* The bubble holding the three dots */}
      <div
        className="flex items-center gap-[5px] py-[14px] rounded-full"
        /*
          py-[14px] with the flex + gap gives the dots enough breathing room
          so the bubble has a similar height to a short text message.
        */
      >
        <span className="typing-dot" />
        <span className="typing-dot" />
        <span className="typing-dot" />
      </div>
    </div>
  );
}

// ─── Sub-component: Empty State ───────────────────────────────────────────────
/*
  Shown when messages.length === 0 (before the user sends anything).

  WHY have an empty state?
  A blank screen is confusing. This gentle prompt tells the user:
    1. The chatbot is ready
    2. What kinds of questions they can ask
    3. How to get started

  Good UX = reduce uncertainty at every step.
*/

function EmptyState() {
  return (
    <div
      className="flex flex-col items-center justify-center h-full gap-4 px-6 text-center"
      role="region"
      aria-label="Chat empty — welcome message"
    >
      {/* Icon circle */}
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center text-2xl"
        style={{
          background: "linear-gradient(135deg, #6366F1 0%, #4F6EF7 100%)",
          boxShadow: "0 4px 20px rgba(79, 110, 247, 0.3)",
        }}
        aria-hidden="true"
      >
        ✦
      </div>

      <div className="space-y-1.5 max-w-xs">
        <h2
          className="text-lg font-semibold"
          style={{ color: "var(--ink)" }}
        >
          How can I help you?
        </h2>
        <p
          className="text-sm leading-relaxed"
          style={{ color: "var(--ink-muted)" }}
        >
          Ask me about our refund policy, shipping times, warranty,
          account help, or anything else you need support with.
        </p>
      </div>

      {/* Quick-start suggestion chips */}
      <div className="flex flex-wrap gap-2 justify-center mt-2">
        {[
          "What's the refund policy?",
          "How long does shipping take?",
          "How do I reset my password?",
        ].map((suggestion) => (
          <span
            key={suggestion}
            className="text-xs px-3 py-1.5 rounded-full border"
            style={{
              borderColor: "var(--border)",
              color: "var(--ink-muted)",
              background: "var(--surface-2)",
            }}
            /*
              These are display-only chips — they show example questions.
              For an interactive version you could attach an onClick that
              calls ChatWindow's handleSend with the suggestion text.
              That's a great follow-up exercise!
            */
          >
            {suggestion}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function MessageList({ messages, isLoading }: MessageListProps) {
  /*
    CONDITIONAL RENDERING with early return:
    If there are no messages AND we're not loading, show the empty state.
    "&&" (logical AND) renders the right side only when the left is truthy.
  */
  const isEmpty = messages.length === 0 && !isLoading;

  return (
    /*
      flex-1       → take up all available vertical space in ChatWindow
      overflow-y-auto → scroll vertically when messages overflow
      px-4 py-6    → breathing room around the message list
      flex flex-col → stack messages top-to-bottom
      gap-4        → 16px gap between each MessageBubble

      The scrollbar is styled in globals.css to be subtle (4px wide, warm colour).
    */
    <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-4">
      {isEmpty ? (
        <EmptyState />
      ) : (
        <>
          {/*
            Map creates one <MessageBubble> per message.

            KEY RULE: Always set key on the root element inside .map().
            The key must be:
              ✓ Unique among siblings
              ✓ Stable (doesn't change when the list re-renders)
              ✗ NOT the array index — index-based keys cause bugs when items
                 are inserted/removed in the middle of the list
          */}
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}

          {/*
            Show the typing indicator AFTER all real messages,
            but ONLY when isLoading is true.
          */}
          {isLoading && <TypingIndicator />}
        </>
      )}
    </div>
  );
}
