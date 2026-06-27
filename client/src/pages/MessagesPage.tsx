import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageSquare, Send, Search } from "lucide-react";

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  type: "sent" | "received";
}

export default function MessagesPage() {
  const [selectedChat, setSelectedChat] = useState("1");
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "System",
      content: "Welcome to Messages",
      timestamp: "10:00 AM",
      type: "received",
    },
  ]);

  const chats = [
    { id: "1", name: "Wedding Event", lastMessage: "See you soon!", unread: 2 },
    { id: "2", name: "Test Event", lastMessage: "Thanks for attending", unread: 0 },
  ];

  const handleSendMessage = () => {
    if (messageText.trim()) {
      const newMessage: Message = {
        id: Math.random().toString(),
        sender: "You",
        content: messageText,
        timestamp: new Date().toLocaleTimeString(),
        type: "sent",
      };
      setMessages([...messages, newMessage]);
      setMessageText("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 p-6 rtl" dir="rtl">
      <div className="max-w-7xl mx-auto h-[600px] flex gap-4">
        {/* Chats List */}
        <div className="w-80 flex flex-col">
          <Card className="border border-purple-100 bg-white shadow-sm rounded-[1.625rem] flex-1">
            <CardHeader className="border-b border-purple-100 pb-4">
              <CardTitle className="text-xl text-gray-900">Messages</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-2 overflow-y-auto max-h-[500px]">
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => setSelectedChat(chat.id)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedChat === chat.id
                      ? "bg-purple-100 border-l-4 border-purple-600"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-gray-900">{chat.name}</p>
                    {chat.unread > 0 && (
                      <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Chat View */}
        <div className="flex-1 flex flex-col">
          <Card className="border border-purple-100 bg-white shadow-sm rounded-[1.625rem] flex-1 flex flex-col">
            <CardHeader className="border-b border-purple-100 pb-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-purple-600" />
                <CardTitle className="text-xl text-gray-900">
                  {chats.find((c) => c.id === selectedChat)?.name}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto pt-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.type === "sent" ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      msg.type === "sent"
                        ? "bg-gray-100 text-gray-900"
                        : "bg-purple-600 text-white"
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <p className="text-xs opacity-70 mt-1">{msg.timestamp}</p>
                  </div>
                </div>
              ))}
            </CardContent>
            <div className="border-t border-purple-100 p-4 flex gap-2">
              <Input
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type a message..."
                className="rounded-lg border-gray-200"
              />
              <Button
                onClick={handleSendMessage}
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
