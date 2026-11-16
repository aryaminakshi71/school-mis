import { RealTimeChat } from "@/components/real-time-chat";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/chat")({
  component: ChatPage,
});

function ChatPage() {
  return <RealTimeChat />;
}
