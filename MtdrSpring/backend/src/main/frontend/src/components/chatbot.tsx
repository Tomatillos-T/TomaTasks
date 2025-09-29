import React, { useState, useEffect, useRef, forwardRef } from "react";
import geminiService from "../services/geminiService";

interface ChatBubbleProps {
  role: "user" | "assistant";
  content: string;
  isLoading?: boolean;
}

function ChatBubble({ role, content, isLoading = false }: ChatBubbleProps) {
  return (
    <div
      className={`${
        role === "user" ? "col-start-1 col-end-8" : "col-start-6 col-end-13"
      } p-1 sm:p-2 rounded-lg`}
    >
      <div
        className={`flex ${
          role === "user" ? "flex-row" : "flex-row-reverse"
        } items-center`}
      >
        <div
          className={`flex items-center justify-center rounded-full flex-shrink-0
                        h-6 w-6 sm:h-8 sm:w-8 ${
                          role === "user" ? "bg-indigo-300" : "bg-indigo-500"
                        }`}
        >
          <span className="text-xs sm:text-sm font-semibold">
            {role[0].toUpperCase()}
          </span>
        </div>
        <div
          className={`relative ${
            role === "user" ? "ml-2 sm:ml-3" : "mr-2 sm:mr-3"
          } 
                        p-2 sm:p-3 shadow rounded-xl 
                        max-w-[70%] sm:max-w-[70%] 
                        text-xs sm:text-sm 
                        ${
                          role === "user"
                            ? "bg-white dark:bg-cyan-900 text-black dark:text-white"
                            : "bg-blue-500 dark:bg-sky-900 text-white"
                        }`}
        >
          {isLoading ? (
            <div className="flex items-center gap-1">
              <div className="animate-bounce w-2 h-2 bg-white rounded-full"></div>
              <div
                className="animate-bounce w-2 h-2 bg-white rounded-full"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="animate-bounce w-2 h-2 bg-white rounded-full"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
          ) : (
            <span className="whitespace-pre-wrap">{content}</span>
          )}
        </div>
      </div>
    </div>
  );
}

interface Message {
  role: "user" | "assistant";
  content: { text: string }[];
}

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
}

function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  return (
    <div className="grid grid-cols-12 gap-y-2 px-2">
      {messages.map((message, index) => (
        <ChatBubble
          key={index}
          role={message.role}
          content={message.content.map((block) => block.text).join("\n")}
        />
      ))}
      {isLoading && <ChatBubble role="assistant" content="" isLoading={true} />}
    </div>
  );
}

// ChatInput.jsx (dentro de Chatbot.jsx)
interface ChatInputProps {
  onSendMessage: (input: string) => void;
  disabled?: boolean;
}

const ChatInput = forwardRef<HTMLInputElement, ChatInputProps>(
  ({ onSendMessage, disabled = false }, ref) => {
    const [input, setInput] = useState("");

    const handleSendMessage = () => {
      if (input.trim() === "" || disabled) return;
      onSendMessage(input);
      setInput("");
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !disabled) handleSendMessage();
    };

    return (
      <div className="flex items-center gap-2">
        <input
          ref={ref}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={disabled}
          className="flex-grow px-2 sm:px-3 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
                   dark:bg-gray-700 dark:border-gray-600 dark:text-white 
                   text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder={
            disabled ? "Enviando mensaje..." : "Escribe un mensaje..."
          }
        />
        <button
          onClick={handleSendMessage}
          disabled={disabled || input.trim() === ""}
          className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {disabled ? "..." : "Enviar"}
        </button>
      </div>
    );
  }
);

function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeminiAvailable, setIsGeminiAvailable] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputFieldRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // Verificar si Gemini está disponible
    setIsGeminiAvailable(geminiService.isAvailable());

    if (!geminiService.isAvailable()) {
      if (typeof geminiService.getModelInfo === "function") {
        console.log("Gemini Service Info:", geminiService.getModelInfo());
      } else {
        console.log("Gemini Service Info: not available");
      }
    }

    inputFieldRef.current?.focus();
  }, []);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleSendMessage = async (input: string) => {
    if (!isGeminiAvailable) {
      alert("Gemini no está configurado correctamente. Verifica tu API key.");
      return;
    }

    const newMessage: Message = {
      role: "user",
      content: [{ text: input }],
    };

    // Agregar mensaje del usuario
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setIsLoading(true);
    scrollToBottom();

    try {
      // Enviar mensaje a Gemini
      const response = await geminiService.sendMessage(
        input,
        messages
          .filter((m) => m.role === "user")
          .map((m) => m.content.map((block) => block.text).join("\n"))
      );

      const assistantMessage: Message = {
        role: "assistant",
        content: [{ text: response }],
      };

      // Agregar respuesta del asistente
      setMessages((prevMessages) => [...prevMessages, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);

      const errorMessage: Message = {
        role: "assistant",
        content: [
          {
            text:
              "Error: " +
              (error && typeof error === "object" && "message" in error
                ? (error as { message?: string }).message
                : String(error)),
          },
        ],
      };

      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
      scrollToBottom();
      inputFieldRef.current?.focus();
    }
  };

  const newChat = () => {
    setMessages([]);
    inputFieldRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden">
      {/* Header del chat */}
      <div className="flex flex-wrap items-center justify-between p-4 border-b dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Chatbot con Gemini
          </h3>
          {isGeminiAvailable && (
            <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
              ✓ Conectado
            </span>
          )}
          {!isGeminiAvailable && (
            <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
              ✗ Sin conexión
            </span>
          )}
        </div>
        <button
          onClick={newChat}
          className="mt-2 sm:mt-0 px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Nuevo Chat
        </button>
      </div>

      {/* Área de mensajes */}
      <div className="flex-1 overflow-y-auto p-2 sm:p-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-4 sm:mt-8 px-4">
            <p className="mb-2 text-sm sm:text-base">
              👋 ¡Hola! Soy un chatbot potenciado por Gemini
            </p>
            <p className="text-xs sm:text-sm">
              Escribe un mensaje para comenzar la conversación
            </p>
          </div>
        )}
        <ChatMessages messages={messages} isLoading={isLoading} />
        <div ref={messagesEndRef} />
      </div>

      {/* Input de mensaje */}
      <div className="p-2 sm:p-4 border-t dark:border-gray-700 bg-white dark:bg-gray-800">
        {!isGeminiAvailable && (
          <div className="mb-2 sm:mb-3 p-2 bg-yellow-100 border border-yellow-300 rounded-lg text-yellow-800 text-xs sm:text-sm">
            ⚠️ Configura tu API key de Gemini en las variables de entorno
            (VITE_APP_GEMINI_API_KEY)
          </div>
        )}
        <ChatInput
          onSendMessage={handleSendMessage}
          ref={inputFieldRef}
          disabled={isLoading || !isGeminiAvailable}
        />
      </div>
    </div>
  );
}

export default Chatbot;
