// RESPONSIBILITIES:
//  • Render a text input where the user types their message
//  • Render a Send button
//  • Call props.onSend when the user submits (button click OR Enter key)
//  • Clear the input after sending
//  • Disable interaction while a response is loading (prevent double-sends)
//  • Auto-resize the textarea as the user types more text
//
// IMPORTANT PATTERN — "Controlled Input":
//  In React, a "controlled" input is one where React state IS the source of
//  truth for the input's value. The flow is:
//    1. User types a character
//    2. onChange fires → setInputValue(newValue) → React re-renders
//    3. The <textarea> re-renders with the new value from state
//
//  This might seem roundabout, but it gives you full control:
//  you can validate, transform, or clear the value at any time.
// ─────────────────────────────────────────────────────────────────────────────

"use client";
import { useState, useRef, useEffect, KeyboardEvent } from "react";

// ─── Props ────────────────────────────────────────────────────────────────────

interface InputBarProps {
  onSend: (message: string) => void;  // called by ChatWindow to send a message
  isLoading: boolean;                 // true while AI is responding
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function InputBar({ onSend, isLoading }: InputBarProps) {
  // ── State ──
  const [inputValue, setInputValue] = useState("");

  // ── Refs ──
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  /*
    useRef gives us a direct reference to the DOM element.
    We use it for two things:
    1. Auto-resizing the textarea height as the user types
    2. Re-focusing the input after a message is sent
  */

  // ── Auto-resize the textarea ──
  useEffect(() => {
    /*
      Every time inputValue changes, recalculate the textarea's height.

      HOW IT WORKS:
      • Reset height to "auto" — lets the browser calculate natural content height
      • Set height to scrollHeight — the actual height of the content
      • Cap it at 160px so it doesn't take over the screen

      Without this, a <textarea> stays fixed height and shows a scrollbar
      once content overflows — which looks clunky in a chat UI.
    */
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    const maxHeight = 160; // px — ~5 lines of text
    textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
    textarea.style.overflowY = textarea.scrollHeight > maxHeight ? "auto" : "hidden";
  }, [inputValue]);

  // ── Computed values ──
  const trimmedValue = inputValue.trim();
  const canSend = trimmedValue.length > 0 && !isLoading;
  /*
    canSend: true only when there's non-whitespace text AND we're not loading.
    Used to:
    1. Enable/disable the Send button
    2. Decide whether pressing Enter should submit
  */

  // ── Event handlers ──
  const handleSubmit = () => {
    if (!canSend) return;
    onSend(trimmedValue);    // tell ChatWindow to process this message
    setInputValue("");        // clear the textarea
    textareaRef.current?.focus();  // keep focus in the input for the next message
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    /*
      Enter alone → submit the message (like most chat apps)
      Shift+Enter → insert a real newline (for multi-line messages)

      We check e.shiftKey to distinguish the two cases.
      e.preventDefault() stops the default Enter behaviour (adding a newline).
    */
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // ── Render ──
  return (
    /*
      The outer container sits at the bottom of ChatWindow.
      It has a top border and white background to separate it from the message list.

      The sticky container also gets a slight backdrop-filter blur so messages
      scrolling behind it look polished.
    */
    <div
      className="border-t px-4 py-3"
      style={{
        borderColor: "var(--border)",
        background: "var(--surface-2)",
        backdropFilter: "blur(8px)",
      }}
    >
      {/* Inner row: textarea + send button side by side */}
      <div
        className="flex items-end gap-3 rounded-2xl px-4 py-2 transition-shadow"
        style={{
          background: "var(--surface)",
          border: "1.5px solid var(--border)",
          /*
            We put the border on this inner wrapper (not the textarea itself),
            so the focus ring can wrap around both the textarea AND the button.
          */
        }}
      >
        {/* ── Textarea ── */}
        <textarea
          ref={textareaRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          placeholder={
            isLoading
              ? "AI is thinking…"
              : "Ask me anything — press Enter to send"
          }
          rows={1}
          /*
            rows={1}: start at one line tall. The useEffect above expands it
            automatically as content grows.
          */
          className="
            flex-1
            resize-none
            bg-transparent
            border-none
            outline-none
            text-[15px]
            leading-relaxed
            placeholder:text-[var(--ink-faint)]
            disabled:opacity-50
            disabled:cursor-not-allowed
            py-1
          "
          style={{ color: "var(--ink)" }}
          aria-label="Type your message"
          aria-multiline="true"
        />

        {/* ── Send Button ── */}
        <button
          onClick={handleSubmit}
          disabled={!canSend}
          className="
            flex-shrink-0
            w-9 h-9
            rounded-xl
            flex items-center justify-center
            transition-all duration-150
            disabled:opacity-40
            disabled:cursor-not-allowed
            active:scale-95
          "
          style={{
            background: canSend ? "var(--accent)" : "var(--surface-3)",
            color: canSend ? "#fff" : "var(--ink-faint)",
            /*
              The button visually "activates" when there's text to send:
              goes from muted grey → accent blue.
              This gives the user a clear signal that it's ready.
            */
          }}
          aria-label="Send message"
          /*
            aria-label is essential here because this button has no visible text —
            just an icon. Screen readers will announce "Send message" instead of
            reading out the SVG path description.
          */
        >
          {isLoading ? (
            /* Loading spinner — replaces the arrow icon while AI is responding */
            <svg
              className="animate-spin"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12" cy="12" r="10"
                stroke="currentColor"
                strokeWidth="3"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          ) : (
            /* Send arrow icon */
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M22 2L11 13"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M22 2L15 22L11 13L2 9L22 2Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
      </div>

      {/* ── Hint text ── */}
      <p
        className="text-xs text-center mt-2"
        style={{ color: "var(--ink-faint)" }}
        aria-hidden="true"
      >
        {isLoading
          ? "Searching knowledge base and generating response…"
          : "Shift + Enter for a new line · Enter to send"}
      </p>
    </div>
  );
}
