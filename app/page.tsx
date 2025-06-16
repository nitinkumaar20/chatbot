import ChatModal from "./components/ChatBot";

export default function Home() {
  return (
    <main className="h-screen bg-gray-50">
      <h1 className="text-center text-2xl font-bold p-10">Welcome to Gemini Chat</h1>
      <ChatModal />
    </main>

  );
}
