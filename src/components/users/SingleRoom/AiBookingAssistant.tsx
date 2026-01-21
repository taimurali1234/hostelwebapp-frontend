import { useState } from "react";
import { Send, MessageCircle, X, Minimize2 } from "lucide-react";
import type { Room } from "../Rooms/RoomCard";

interface Message {
  from: "ai" | "user";
  text: string;
}

interface Props {
  room: Room;
}

const AiBookingAssistant: React.FC<Props> = ({ room }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      from: "ai",
      text: `Hi! 👋 I'm your booking assistant. I can help you find the perfect stay in our ${room.title || 'room'}. What would you like to know?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { from: "user", text: userMessage }]);
    setInput("");
    setIsLoading(true);

    setTimeout(() => {
      let aiResponse = "That's a great question! ";
      if (userMessage.toLowerCase().includes("price")) {
        aiResponse = `The ${room.type} room is available at PKR ${room.shortTermPrice}/night for short stays and PKR ${room.longTermPrice}/month for long-term bookings. Would you like to proceed with booking?`;
      } else if (userMessage.toLowerCase().includes("bed")) {
        aiResponse = `This room comes with ${room.beds} comfortable bed${room.beds !== 1 ? 's' : ''}. All beds are equipped with premium bedding. Is there anything else you'd like to know?`;
      } else if (userMessage.toLowerCase().includes("availability")) {
        aiResponse = "This room is currently available! You can select your check-in date in the availability section above. I recommend booking soon as popular dates fill up quickly.";
      } else if (userMessage.toLowerCase().includes("booking")) {
        aiResponse = "Booking is easy! Just select your dates, choose your seat, apply a coupon if you have one, and click 'Book Now'. You'll receive a confirmation email within minutes.";
      } else {
        aiResponse = "That's an excellent point! Would you like more information about our booking process or payment options?";
      }

      setMessages((prev) => [...prev, { from: "ai", text: aiResponse }]);
      setIsLoading(false);
    }, 800);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Button - Top Right */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-24 right-4 md:right-6 bg-linear-to-r from-green-600 to-green-700 text-white p-2 md:p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all z-40 group"
          title="Open AI Assistant"
        >
          <MessageCircle size={18} />
          <div className="absolute top-12 md:top-14 right-0 bg-gray-900 text-white text-xs px-2 md:px-3 py-1 md:py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Chat with AI
          </div>
        </button>
      )}

      {/* Chat Modal - Opens Downward from Top */}
      {isOpen && (
        <div className={`fixed right-3 md:right-6 top-20 z-50 transition-all ${isMinimized ? "w-64 md:w-80 h-12 md:h-14" : "w-72 md:w-96 max-h-[65vh]"}  bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden`}>
          {/* Header */}
          <div className="bg-linear-to-r from-green-600 to-green-700 text-white p-2 md:p-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-1 md:gap-2 min-w-0">
              <div className="bg-white/20 p-1 md:p-2 rounded-lg shrink-0">
                <MessageCircle size={16} />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-xs md:text-sm truncate">Booking Assistant</h3>
                <p className="text-xs text-green-100 hidden md:block">Powered by AI</p>
              </div>
            </div>
            <div className="flex items-center gap-0.5 md:gap-1 shrink-0">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="hover:bg-white/20 p-1.5 md:p-2 rounded-lg transition"
                title={isMinimized ? "Expand" : "Minimize"}
              >
                <Minimize2 size={12} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/20 p-1.5 md:p-2 rounded-lg transition"
                title="Close"
              >
                <X size={12} />
              </button>
            </div>
          </div>

          {/* Chat Area */}
          {!isMinimized && (
            <>
              <div className="flex-1 overflow-y-auto p-2 md:p-3 space-y-2 md:space-y-3 bg-gray-50">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs px-2 md:px-3 py-1 md:py-2 rounded-2xl text-xs md:text-sm ${msg.from === "user"
                        ? "bg-green-600 text-white rounded-br-none"
                        : "bg-white text-gray-900 border border-gray-200 rounded-bl-none"
                      }`}
                    >
                      <p className="leading-relaxed">{msg.text}</p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-200 px-2 md:px-3 py-1 md:py-2 rounded-2xl rounded-bl-none">
                      <div className="flex gap-1.5">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="border-t border-gray-200 bg-white p-1.5 md:p-3 space-y-1 md:space-y-2 shrink-0">
                <div className="flex gap-1 md:gap-2">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isLoading}
                    placeholder="Ask..."
                    className="flex-1 border border-gray-300 rounded-lg p-1 md:p-2 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-xs"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={isLoading || !input.trim()}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white p-1.5 md:p-2 rounded-lg transition-colors disabled:cursor-not-allowed shrink-0"
                  >
                    <Send size={12} />
                  </button>
                </div>
                <p className="text-xs text-gray-400 text-center">24/7 Support</p>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default AiBookingAssistant;
