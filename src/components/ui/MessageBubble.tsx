// This is called a "presentational component" — it only receives data
// via props and renders it. This makes it trivially easy to test and reuse.
// ─────────────────────────────────────────────────────────────────────────────

import { Message } from "@/types/chat";

// ─── Props ────────────────────────────────────────────────────────────────────
// Props = the inputs a component receives from its parent.
// TypeScript enforces these — the parent MUST pass a valid Message object.

interface MessageBubbleProps {
  message: Message;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Formats a Date into a human-readable time string.
 * e.g. new Date() → "14:35"  or  "2:35 PM"
 *
 * Intl.DateTimeFormat is built into all modern browsers — no library needed.
 */
function formatTime(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

// ─── Sub-component: AI Avatar ─────────────────────────────────────────────────
// Extracted as its own small component to keep the main return() readable.
// A small icon beside the AI's messages makes the sender obvious at a glance.

function AIAvatar() {
  return (
    <div
      className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold"
      style={{
        background: "linear-gradient(135deg, #6366F1 0%, #4F6EF7 100%)",
        color: "#fff",
        boxShadow: "0 2px 8px rgba(79, 110, 247, 0.25)",
      }}
      aria-hidden="true"
      /*
        aria-hidden="true" hides this from screen readers — the message text
        already conveys the sender, so the avatar is purely decorative.
      */
    >
      AI
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  /*
    CONDITIONAL RENDERING STRATEGY:
    Instead of a single return with deeply nested ternaries, we compute the
    class names and layout choices upfront, then use them in a clean JSX tree.
    This is much easier to read and debug.
  */

  return (
    /*
      animate-message-in — defined in globals.css — slides the bubble up
      and fades it in when it first mounts. Each message feels "delivered".

      The outer div is the row — it controls LEFT vs RIGHT alignment.
      Inside the row: [avatar?] [bubble]  or  [bubble] [avatar?]
    */
    <div
      className={`animate-message-in flex items-end gap-2 ${
        isUser
          ? "flex-row-reverse"   // user: bubble on right, no avatar
          : "flex-row"           // AI:   avatar on left, bubble on right of avatar
      }`}
    >
      {/* ── Avatar — only shown for AI messages ── */}
      {!isUser && <AIAvatar />}

      {/* ── Bubble + Timestamp (stacked vertically) ── */}
      <div
        className={`flex flex-col gap-1 w-full ${
          isUser ? "items-end" : "items-start"
          // items-end   → timestamp right-aligned under user bubble
          // items-start → timestamp left-aligned under AI bubble
        }`}
      >
        {/* ── The Bubble itself ── */}
        <div
          className={isUser ? "chat-bubble bubble-user" : "chat-bubble bubble-ai"}
          /*
            bubble-user and bubble-ai are defined in globals.css (@layer components).
            Each sets background, text colour, border-radius, and shadow.
          */
        >
          {/*
            whitespace-pre-wrap: preserves newlines in the message text.
            If the AI responds with a list using "\n- item", it renders correctly.
          */}
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>

        {/* ── Timestamp ── */}
        <span
          className="text-xs px-1"
          style={{ color: "var(--ink-faint)" }}
          aria-label={`Sent at ${formatTime(message.timestamp)}`}
        >
          {formatTime(message.timestamp)}
        </span>
      </div>

      {/*
        Spacer for user rows — keeps the bubble from touching the right edge.
        Without this, the bubble would be flush against the container wall.
      */}
      {isUser && <div className="w-2 flex-shrink-0" aria-hidden="true" />}
    </div>
  );
}
