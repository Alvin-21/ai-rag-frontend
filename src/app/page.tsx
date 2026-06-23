// This page is intentionally thin — it just mounts <ChatWindow />.
// All chat logic lives inside ChatWindow so it stays reusable and testable.

import ChatWindow from "@/components/ui/ChatWindow";

export default function HomePage() {
  return (
    /*
      The ChatWindow itself handles its own internal layout (header, messages,
      input) — this page just ensures it fills the screen.
    */
    <main className="min-h-screen flex flex-col bg-surface">
      <ChatWindow />
    </main>
  );
}
