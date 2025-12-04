import React, { useState, useEffect, useRef, forwardRef } from "react";
import { HttpClient } from "@/services/httpClient";
import { Check, RefreshCw, Database, AlertCircle, GitBranch, Github } from "lucide-react";
import ReactMarkdown from "react-markdown";

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

interface Stats {
  totalEmbeddings: number;
  totalCommits: number;
  processedCommits: number;
}

// NEW: GitHub Repository interface
// Note: Properties match the JSON keys from backend (snake_case from GitHub API)
interface GitHubRepo {
  name: string;
  full_name: string;        // GitHub API uses snake_case
  owner: string;
  private: boolean;
  default_branch: string;   // GitHub API uses snake_case
  html_url: string;         // GitHub API uses snake_case
  description?: string;
  language?: string;
  stargazers_count?: number; // GitHub API uses snake_case
}

// NEW: GitHub Branch interface
interface GitHubBranch {
  name: string;
  sha: string;
}

function ChatBubble({ role, content, isLoading = false }: ChatBubbleProps) {
  return (
    <div
      className={`flex ${
        role === "user" ? "justify-start" : "justify-end"
      } w-full`}
    >
      <div
        className={`flex items-start gap-3 max-w-[90%] sm:max-w-[88%] lg:max-w-[85%] ${
          role === "user" ? "flex-row" : "flex-row-reverse"
        }`}
      >
        <div
          className={`flex items-center justify-center rounded-full flex-shrink-0
                      h-8 w-8 sm:h-10 sm:w-10 ${
                        role === "user"
                          ? "bg-primary-main text-primary-contrast"
                          : "bg-secondary-main text-secondary-contrast"
                      }`}
        >
          <span className="text-sm sm:text-base font-semibold">
            {role === "user" ? "U" : "A"}
          </span>
        </div>

        <div
          className={`relative p-3 sm:p-4 rounded-2xl shadow-sm
                      text-sm sm:text-base break-words
                      ${
                        role === "user"
                          ? "bg-background-paper text-text-primary border border-background-contrast"
                          : "bg-primary-main text-primary-contrast"
                      }`}
        >
          {isLoading ? (
            <div className="flex items-center gap-1.5">
              <div className="animate-bounce w-2 h-2 bg-current rounded-full"></div>
              <div
                className="animate-bounce w-2 h-2 bg-current rounded-full"
                style={{ animationDelay: "0.15s" }}
              ></div>
              <div
                className="animate-bounce w-2 h-2 bg-current rounded-full"
                style={{ animationDelay: "0.3s" }}
              ></div>
            </div>
          ) : role === "assistant" ? (
            <div className="prose prose-sm sm:prose-base prose-invert max-w-none">
              <ReactMarkdown>{content}</ReactMarkdown>
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
    <div className="flex flex-col gap-3 px-2 sm:px-4 w-full">
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

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !disabled) handleSendMessage();
    };

    return (
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <input
          ref={ref}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className="flex-grow min-w-[200px] px-3 sm:px-4 py-2.5 sm:py-3 border border-background-contrast rounded-xl
                   focus:outline-none focus:ring-2 focus:ring-primary-main
                   bg-background-paper text-text-primary placeholder:text-text-secondary
                   text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed
                   transition-all"
          placeholder={
            disabled ? "Sending message..." : "Ask about the repository..."
          }
        />
        <button
          onClick={handleSendMessage}
          disabled={disabled || input.trim() === ""}
          className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-primary-main text-primary-contrast rounded-xl
                   hover:bg-primary-dark text-sm sm:text-base font-medium whitespace-nowrap
                   transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                   shadow-sm hover:shadow-md"
        >
          {disabled ? "..." : "Send"}
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
  const [stats, setStats] = useState<Stats | null>(null);
  const [isIndexing, setIsIndexing] = useState(false);
  const [isLoadingCommits, setIsLoadingCommits] = useState(false);
  const [hasMoreCommits, setHasMoreCommits] = useState(true);
  const [commitOffset, setCommitOffset] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputFieldRef = useRef<HTMLInputElement | null>(null);
  const commitListRef = useRef<HTMLDivElement | null>(null);

  // NEW: GitHub integration state
  const [githubRepos, setGithubRepos] = useState<GitHubRepo[]>([]);
  const [githubBranches, setGithubBranches] = useState<GitHubBranch[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<string>("");
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [isLoadingRepos, setIsLoadingRepos] = useState(false);
  const [isLoadingBranches, setIsLoadingBranches] = useState(false);
  const [isIndexingBranch, setIsIndexingBranch] = useState(false);
  const [githubError, setGithubError] = useState<string>("");

  useEffect(() => {
    loadCommits(true);
    loadStats();
    loadGitHubRepos(); // NEW: Load user's GitHub repositories on mount
    inputFieldRef.current?.focus();
  }, []);

  // BUG FIX 1 & 3: Reload commits and stats when selectedBranch changes
  useEffect(() => {
    if (selectedBranch) {
      // Reset pagination state
      setCommitOffset(0);
      setHasMoreCommits(true);
      setSelectedCommits([]); // Clear selected commits when branch changes

      // Reload commits for the new branch
      loadCommits(true);

      // Reload stats for the new branch
      loadStats();
    }
  }, [selectedBranch]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  // NEW: Load user's GitHub repositories
  const loadGitHubRepos = async () => {
    setIsLoadingRepos(true);
    setGithubError("");

    try {
      // Client-side JWT validation: Check if token exists before making request
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        setGithubError("Not authenticated. Please log in.");
        return;
      }

      // Get user ID from context or localStorage
      const userStr = localStorage.getItem("user");
      if (!userStr) {
        setGithubError("User information not found");
        return;
      }

      const user = JSON.parse(userStr);
      const userId = user.id;

      const repos = await HttpClient.get<GitHubRepo[]>(
        `/api/rag/github/repos?userId=${userId}`,
        { auth: true }
      );

      setGithubRepos(repos);

      // If no repos, check if user has linked GitHub
      if (repos.length === 0) {
        setGithubError("No repositories found. Please link your GitHub account.");
      }
    } catch (error: any) {
      console.error("Error loading GitHub repos:", error);

      // Handle 401 UNAUTHORIZED (expired JWT)
      if (error?.response?.status === 401) {
        setGithubError("Session expired. Please log in again.");
        // Trigger re-authentication (optional, based on your auth flow)
        // You could call authEvents.invalidateSession() here if available
      }
      // Handle 403 FORBIDDEN (missing JWT)
      else if (error?.response?.status === 403) {
        setGithubError("Access denied. Please log in.");
      }
      // Handle 400 BAD REQUEST (GitHub not linked)
      else if (error?.response?.status === 400) {
        setGithubError(
          error?.response?.data?.error || "GitHub account not linked. Please link your account in settings."
        );
      } else {
        setGithubError(
          error?.response?.data?.error ||
            error?.message ||
            "Failed to load repositories"
        );
      }
    } finally {
      setIsLoadingRepos(false);
    }
  };

  // NEW: Load branches for selected repository
  const loadGitHubBranches = async (repoFullName: string) => {
    setIsLoadingBranches(true);
    setGithubError("");

    try {
      // Client-side JWT validation
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        setGithubError("Not authenticated. Please log in.");
        return;
      }

      const userStr = localStorage.getItem("user");
      if (!userStr) {
        setGithubError("User information not found");
        return;
      }

      const user = JSON.parse(userStr);
      const userId = user.id;

      // Parse owner and repo from fullName (e.g., "user/repo")
      const parts = repoFullName.split("/");
      if (parts.length !== 2 || !parts[0] || !parts[1]) {
        setGithubError("Invalid repository format. Expected 'owner/repo'");
        return;
      }

      const [owner, repo] = parts;

      // URL encode owner and repo to handle special characters
      const encodedOwner = encodeURIComponent(owner);
      const encodedRepo = encodeURIComponent(repo);
      const requestUrl = `/api/rag/github/repos/${encodedOwner}/${encodedRepo}/branches?userId=${userId}`;

      // Debug logging
      console.log("Loading GitHub branches:", {
        repository: repoFullName,
        owner,
        repo,
        userId,
        requestUrl
      });

      const branches = await HttpClient.get<GitHubBranch[]>(
        requestUrl,
        { auth: true }
      );

      setGithubBranches(branches);

      // Auto-select default branch if available
      const selectedRepoObj = githubRepos.find(r => r.full_name === repoFullName);
      if (selectedRepoObj && branches.some(b => b.name === selectedRepoObj.default_branch)) {
        setSelectedBranch(selectedRepoObj.default_branch);
      } else if (branches.length > 0) {
        setSelectedBranch(branches[0].name);
      }
    } catch (error: any) {
      console.error("Error loading GitHub branches:", error);
      console.error("Error details:", {
        status: error?.response?.status,
        statusText: error?.response?.statusText,
        data: error?.response?.data,
        url: error?.config?.url
      });

      // Handle authentication errors
      if (error?.response?.status === 401) {
        setGithubError("Session expired. Please log in again.");
      } else if (error?.response?.status === 403) {
        setGithubError("Access denied. GitHub token may be invalid or expired.");
      } else if (error?.response?.status === 404) {
        setGithubError(
          `Repository branches not found. Please verify:\n` +
          `1. Repository name format is 'owner/repo'\n` +
          `2. You have access to this repository\n` +
          `3. The repository exists on GitHub`
        );
      } else {
        setGithubError(
          error?.response?.data?.error ||
            error?.message ||
            "Failed to load branches. Check console for details."
        );
      }
    } finally {
      setIsLoadingBranches(false);
    }
  };

  // NEW: Index selected branch from GitHub
  const indexGitHubBranch = async () => {
    if (!selectedRepo || !selectedBranch) {
      alert("Please select a repository and branch first");
      return;
    }

    setIsIndexingBranch(true);
    setGithubError("");

    try {
      // Client-side JWT validation
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        setGithubError("Not authenticated. Please log in.");
        return;
      }

      const userStr = localStorage.getItem("user");
      if (!userStr) {
        setGithubError("User information not found");
        return;
      }

      const user = JSON.parse(userStr);
      const userId = user.id;

      const [owner, repo] = selectedRepo.split("/");

      const response = await HttpClient.post<{
        status: string;
        totalCommits: number;
        message: string;
        repositoryUrl?: string;
        branch?: string;
      }>(
        `/api/rag/github/index-branch?userId=${userId}`,
        {
          owner,
          repo,
          branch: selectedBranch,
        },
        { auth: true }
      );

      // Show success message
      alert(
        `Success! Indexed ${response.totalCommits} commits from ${selectedBranch} branch.\n\n${response.message}`
      );

      // Refresh commits and stats
      setCommitOffset(0);
      setHasMoreCommits(true);
      loadCommits(true);
      loadStats();
      setRepoStatus(`${selectedRepo}/${selectedBranch} indexed ✓`);
    } catch (error: any) {
      console.error("Error indexing branch:", error);

      // Handle authentication errors
      if (error?.response?.status === 401) {
        setGithubError("Session expired. Please log in again.");
      } else if (error?.response?.status === 403) {
        setGithubError("Access denied. GitHub account not linked.");
      } else {
        const errorMsg =
          error?.response?.data?.error ||
          error?.message ||
          "Failed to index branch";
        setGithubError(errorMsg);
        alert("Error: " + errorMsg);
      }
    } finally {
      setIsIndexingBranch(false);
    }
  };

  // NEW: Handle repository selection
  const handleRepoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const repoFullName = e.target.value;
    setSelectedRepo(repoFullName);
    setSelectedBranch("");
    setGithubBranches([]);

    // BUG FIX 1 & 3: Clear commits and stats when repo changes
    setCommits([]);
    setSelectedCommits([]);
    setCommitOffset(0);
    setHasMoreCommits(true);

    if (repoFullName) {
      loadGitHubBranches(repoFullName);
      // Stats will be reloaded by the useEffect when selectedBranch is set
    } else {
      // If repo is cleared, reload default stats
      loadStats();
    }
  };

  const loadCommits = async (reset: boolean = false) => {
    if (isLoadingCommits || (!reset && !hasMoreCommits)) return;

    try {
      setIsLoadingCommits(true);
      const offset = reset ? 0 : commitOffset;

      // PHASE 2 FIX (Problem A): Include repo/branch parameters in API call
      let apiUrl = `/api/rag/commits?limit=21&offset=${offset}`;

      // Add repo/branch parameters if they are selected
      if (selectedRepo && selectedBranch) {
        apiUrl += `&repo=${encodeURIComponent(selectedRepo)}&branch=${encodeURIComponent(selectedBranch)}`;
      }

      // Request one extra to check if there are more commits
      const data = await HttpClient.get<Commit[]>(apiUrl, { auth: true });

      // If we got 21 or more, there are more commits available
      const hasMore = data.length > 20;
      setHasMoreCommits(hasMore);

      // Only take the first 20 for display
      const commitsToShow = hasMore ? data.slice(0, 20) : data;

      if (reset) {
        setCommits(commitsToShow);
        setCommitOffset(commitsToShow.length);
      } else {
        setCommits((prev) => [...prev, ...commitsToShow]);
        setCommitOffset((prev) => prev + commitsToShow.length);
      }
    } catch (error) {
      console.error("Error loading commits:", error);
    } finally {
      setIsLoadingCommits(false);
    }
  };

  const loadStats = async () => {
    try {
      const data = await HttpClient.get<Stats>("/api/rag/stats", {
        auth: true,
      });
      setStats(data);
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const syncRepo = async () => {
    try {
      setRepoStatus("Syncing...");
      await HttpClient.post("/api/rag/sync", {}, { auth: true });
      setRepoStatus("Synced ✓");
      setCommitOffset(0);
      setHasMoreCommits(true);
      loadCommits(true);
      loadStats();
    } catch (error) {
      console.error("Error syncing repo:", error);
      setRepoStatus("Sync failed");
    }
  };

  const indexCommits = async () => {
    if (selectedCommits.length === 0) {
      alert("Please select commits to index");
      return;
    }

    try {
      setIsIndexing(true);
      await HttpClient.post(
        "/api/rag/index",
        { commitIds: selectedCommits },
        { auth: true }
      );

      // Poll for stats update
      setTimeout(() => {
        loadStats();
        setIsIndexing(false);
      }, 2000);
    } catch (error) {
      console.error("Error indexing commits:", error);
      setIsIndexing(false);
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
      console.error("❌ Backend error:", error);
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

  const handleCommitScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const scrollPosition = target.scrollTop + target.clientHeight;
    const scrollHeight = target.scrollHeight;

    // Load more when scrolled to 80% of the list
    if (scrollPosition >= scrollHeight * 0.8 && hasMoreCommits && !isLoadingCommits) {
      loadCommits(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-full bg-background-main rounded-xl overflow-hidden">
      {/* Sidebar */}
      <div className="lg:w-80 border-b lg:border-b-0 lg:border-r border-background-contrast
                    bg-background-paper overflow-y-auto p-4 sm:p-6 max-h-64 lg:max-h-full">

        {/* NEW: GitHub Repository Selection */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Github className="w-4 h-4 text-primary-main" />
            <h3 className="font-semibold text-base sm:text-lg text-text-primary">
              GitHub Repository
            </h3>
          </div>

          {githubError && (
            <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
              {githubError}
            </div>
          )}

          <select
            value={selectedRepo}
            onChange={handleRepoChange}
            disabled={isLoadingRepos}
            className="w-full px-3 py-2 mb-2 text-sm border border-background-contrast rounded-lg
                     bg-background-subtle text-text-primary
                     focus:outline-none focus:ring-2 focus:ring-primary-main
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">
              {isLoadingRepos ? "Loading repositories..." : "Select a repository"}
            </option>
            {githubRepos.map((repo) => (
              <option key={repo.full_name} value={repo.full_name}>
                {repo.full_name} {repo.private ? "🔒" : ""}
              </option>
            ))}
          </select>

          {/* NEW: Branch Selection */}
          {selectedRepo && (
            <div className="flex items-center gap-2 mb-2">
              <GitBranch className="w-4 h-4 text-primary-main" />
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                disabled={isLoadingBranches}
                className="flex-1 px-3 py-2 text-sm border border-background-contrast rounded-lg
                         bg-background-subtle text-text-primary
                         focus:outline-none focus:ring-2 focus:ring-primary-main
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">
                  {isLoadingBranches ? "Loading branches..." : "Select a branch"}
                </option>
                {githubBranches.map((branch) => (
                  <option key={branch.name} value={branch.name}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <p className="text-xs text-text-secondary mt-2">
            {selectedRepo && selectedBranch
              ? `Selected: ${selectedRepo} (${selectedBranch})`
              : "Select a GitHub repository and branch to index"
            }
          </p>
        </div>

        {/* Repository Status */}
        <div className="mb-6">
          <h3 className="font-semibold text-base sm:text-lg mb-3 text-text-primary">
            Repository Status
          </h3>

          {/* Show different button based on whether GitHub repo is selected */}
          {selectedRepo && selectedBranch ? (
            <button
              onClick={() => indexGitHubBranch()}
              disabled={isIndexingBranch}
              className="w-full px-4 py-2.5 text-sm bg-secondary-main text-secondary-contrast rounded-lg
                       hover:bg-secondary-dark transition-colors shadow-sm flex items-center justify-center gap-2
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isIndexingBranch ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Indexing...
                </>
              ) : (
                <>
                  <Database className="w-4 h-4" />
                  Index Selected Branch
                </>
              )}
            </button>
          ) : (
            <button
              onClick={syncRepo}
              className="w-full px-4 py-2.5 text-sm bg-primary-main text-primary-contrast rounded-lg
                       hover:bg-primary-dark transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Sync Default Repository
            </button>
          )}

          <p className="text-xs sm:text-sm text-text-secondary mt-2">
            {selectedRepo && selectedBranch
              ? `Current: ${selectedRepo} (${selectedBranch})`
              : repoStatus
            }
          </p>
        </div>

        {/* Statistics */}
        {stats && (
          <div className="mb-6 p-4 bg-background-subtle rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Database className="w-4 h-4 text-primary-main" />
              <h3 className="font-semibold text-sm text-text-primary">
                Vector Store Stats
              </h3>
            </div>
            <div className="space-y-1 text-xs text-text-secondary">
              <div className="flex justify-between">
                <span>Embeddings:</span>
                <span className="font-medium">{stats.totalEmbeddings}</span>
              </div>
              <div className="flex justify-between">
                <span>Commits cached:</span>
                <span className="font-medium">{stats.totalCommits}</span>
              </div>
              <div className="flex justify-between">
                <span>Indexed:</span>
                <span className="font-medium">{stats.processedCommits}</span>
              </div>
            </div>
          </div>
        )}

        {/* Index Selected Commits */}
        {selectedCommits.length > 0 && (
          <div className="mb-6">
            <button
              onClick={indexCommits}
              disabled={isIndexing}
              className="w-full px-4 py-2.5 text-sm bg-secondary-main text-secondary-contrast rounded-lg
                       hover:bg-secondary-dark transition-colors shadow-sm flex items-center justify-center gap-2
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isIndexing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Indexing...
                </>
              ) : (
                <>
                  <Database className="w-4 h-4" />
                  Index Selected ({selectedCommits.length})
                </>
              )}
            </button>
            <p className="text-xs text-text-secondary mt-2 flex items-start gap-1">
              <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
              Index commits to enable semantic search
            </p>
          </div>
        )}

        {/* Commit Selection */}
        <div>
          <h3 className="font-semibold text-base sm:text-lg mb-3 text-text-primary">
            Select Commits ({selectedCommits.length})
          </h3>
          <div
            ref={commitListRef}
            onScroll={handleCommitScroll}
            className="space-y-2 max-h-96 overflow-y-auto pr-2"
          >
            {commits.map((commit) => (
              <div key={commit.hash} className="text-xs sm:text-sm">
                <label className="flex items-start gap-3 cursor-pointer hover:bg-background-subtle
                               p-3 rounded-lg transition-colors group">
                  <div className="relative flex items-center justify-center mt-0.5">
                    <input
                      type="checkbox"
                      checked={selectedCommits.includes(commit.hash)}
                      onChange={() => toggleCommit(commit.hash)}
                      className="sr-only peer"
                    />
                    <div className="w-5 h-5 border-2 border-background-contrast rounded
                                  peer-checked:bg-primary-main peer-checked:border-primary-main
                                  transition-all flex items-center justify-center">
                      {selectedCommits.includes(commit.hash) && (
                        <Check className="w-3.5 h-3.5 text-primary-contrast" />
                      )}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-mono text-xs sm:text-sm text-primary-main font-medium mb-1">
                      {commit.hash.substring(0, 7)}
                    </div>
                    <div className="text-text-primary font-medium mb-1 line-clamp-2">
                      {commit.message.split("\n")[0]}
                    </div>
                    <div className="text-text-secondary text-xs">
                      {commit.author}
                    </div>
                  </div>
                </label>
              </div>
            ))}

            {/* Loading indicator */}
            {isLoadingCommits && (
              <div className="flex items-center justify-center py-4">
                <RefreshCw className="w-5 h-5 animate-spin text-primary-main" />
                <span className="ml-2 text-sm text-text-secondary">Loading more commits...</span>
              </div>
            )}

            {/* End of list indicator */}
            {!hasMoreCommits && commits.length > 0 && (
              <div className="text-center py-4 text-xs text-text-secondary">
                All commits loaded
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-background-contrast
                      bg-background-paper flex-shrink-0">
          <div>
            <h3 className="font-semibold text-lg sm:text-xl text-text-primary">
              Repository Assistant (RAG)
            </h3>
            <p className="text-xs sm:text-sm text-text-secondary mt-1">
              Powered by semantic search & vector embeddings
            </p>
          </div>
          <button
            onClick={newChat}
            className="px-3 sm:px-4 py-2 text-sm bg-secondary-main text-secondary-contrast
                     rounded-lg hover:bg-secondary-dark transition-colors shadow-sm"
          >
            New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 min-h-0">
          {messages.length === 0 && (
            <div className="text-center text-text-secondary mt-8 sm:mt-16 px-4">
              <p className="mb-3 text-base sm:text-lg font-medium">
                🤖 AI-Powered Repository Analysis
              </p>
              <p className="text-sm sm:text-base mb-4">
                Select commits and ask questions about code changes
              </p>
              <div className="text-xs text-text-secondary max-w-md mx-auto bg-background-subtle p-4 rounded-lg">
                <p className="font-semibold mb-2">💡 Tips:</p>
                <ul className="text-left space-y-1">
                  <li>• Select a GitHub repository and branch to index</li>
                  <li>• Index commits first for better semantic search</li>
                  <li>• Ask specific questions about code changes</li>
                  <li>• Reference file names or functions</li>
                </ul>
              </div>
            </div>
          )}
          <ChatMessages messages={messages} isLoading={isLoading} />
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 sm:p-6 border-t border-background-contrast bg-background-paper flex-shrink-0">
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
