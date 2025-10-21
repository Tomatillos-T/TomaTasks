import React, { useState, useEffect, useRef, forwardRef } from "react";
import { HttpClient } from "../services/httpClient";

interface ChatBubbleProps {
  role: "user" | "assistant";
  content: string;
  isLoading?: boolean;
}

interface Commit {
  hash: string;
  message: string;
  author: string;
  timestamp: number;
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
  content: string;
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
          content={message.content}
        />
      ))}
      {isLoading && <ChatBubble role="assistant" content="" isLoading={true} />}
    </div>
  );
}

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
            disabled ? "Enviando mensaje..." : "Pregunta sobre el repositorio..."
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
  const [commits, setCommits] = useState<Commit[]>([]);
  const [selectedCommits, setSelectedCommits] = useState<string[]>([]);
  const [repoStatus, setRepoStatus] = useState<string>("Not synced");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputFieldRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    loadCommits();
    inputFieldRef.current?.focus();
  }, []);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const loadCommits = async () => {
    try {
      const data = await HttpClient.get<Commit[]>("/api/rag/commits?limit=20", { auth: true });
      setCommits(data);
    } catch (error) {
      console.error("Error loading commits:", error);
    }
  };

  const syncRepo = async () => {
    try {
      setRepoStatus("Syncing...");
      await HttpClient.post("/api/rag/sync", {}, { auth: true });
      setRepoStatus("Synced ✓");
      loadCommits();
    } catch (error) {
      console.error("Error syncing repo:", error);
      setRepoStatus("Sync failed");
    }
  };

  const handleSendMessage = async (input: string) => {
    const newMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, newMessage]);
    setIsLoading(true);
    scrollToBottom();

    try {
      const response = await HttpClient.post<{ answer: string }>(
        "/api/rag/query",
        { question: input, commitIds: selectedCommits },
        { auth: true }
      );

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response.answer },
      ]);
    } catch (error: any) {
      console.error("❌ Backend 500 error:", error);
      const message =
        error?.response?.data?.error ||
        error?.message ||
        "There was an error processing your question.";
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error: " + message },
      ]);
    } finally {
      setIsLoading(false);
      scrollToBottom();
      inputFieldRef.current?.focus();
    }
  };

  const newChat = () => {
    setMessages([]);
    setSelectedCommits([]);
    inputFieldRef.current?.focus();
  };

  const toggleCommit = (hash: string) => {
    setSelectedCommits((prev) =>
      prev.includes(hash) ? prev.filter((h) => h !== hash) : [...prev, hash]
    );
  };

  return (
    <div className="flex h-full bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 border-r dark:border-gray-700 bg-white dark:bg-gray-800 overflow-y-auto p-4">
        <div className="mb-4">
          <h3 className="font-semibold text-sm mb-2">Repository Status</h3>
          <button
            onClick={syncRepo}
            className="w-full px-3 py-2 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Sync Repository
          </button>
          <p className="text-xs text-gray-500 mt-1">{repoStatus}</p>
        </div>

        <div>
          <h3 className="font-semibold text-sm mb-2">Select Commits</h3>
          <div className="space-y-2">
            {commits.map((commit) => (
              <div key={commit.hash} className="text-xs">
                <label className="flex items-start gap-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded">
                  <input
                    type="checkbox"
                    checked={selectedCommits.includes(commit.hash)}
                    onChange={() => toggleCommit(commit.hash)}
                    className="mt-0.5"
                  />
                  <div className="flex-1">
                    <div className="font-mono text-xs text-blue-600 dark:text-blue-400">
                      {commit.hash.substring(0, 7)}
                    </div>
                    <div className="text-gray-700 dark:text-gray-300">
                      {commit.message.split("\n")[0].substring(0, 50)}
                    </div>
                    <div className="text-gray-500 text-xs">
                      {commit.author}
                    </div>
                  </div>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700 bg-white dark:bg-gray-800">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Repository Assistant
            </h3>
            <p className="text-xs text-gray-500">
              Ask questions about commits and code changes
            </p>
          </div>
          <button
            onClick={newChat}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 sm:p-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 dark:text-gray-400 mt-4 sm:mt-8 px-4">
              <p className="mb-2 text-sm sm:text-base">
                👨‍💻 Repository Analysis Assistant
              </p>
              <p className="text-xs sm:text-sm">
                Select commits from the sidebar and ask questions about changes
              </p>
            </div>
          )}
          <ChatMessages messages={messages} isLoading={isLoading} />
          <div ref={messagesEndRef} />
        </div>

        <div className="p-2 sm:p-4 border-t dark:border-gray-700 bg-white dark:bg-gray-800">
          <ChatInput
            onSendMessage={handleSendMessage}
            ref={inputFieldRef}
            disabled={isLoading}
          />
        </div>
      </div>
    </div>
  );
}

export default Chatbot;
