import React, { useState, useEffect } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../utils/firebase";
import api from "../../utils/axios";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/userSlice";
import {
  setConversation,
  setSelectedConversation,
  addConversation,
} from "../redux/conversationSlice";
import { getconversation } from "../features/getConversations";
import { createconversation } from "../features/createConversation";
import Sidebar from "../components/sidebar.jsx";
import ChatArea from "../components/chatArea.jsx";
import Artifact from "../components/artifact.jsx";

function Home() {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  // App UI State matching ChatGPT: Sidebar initially closed
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isArtifactOpen, setIsArtifactOpen] = useState(false);
  const [activeArtifact, setActiveArtifact] = useState({
    title: "AppPreview.jsx",
    language: "jsx",
    code: `import React, { useState } from "react";

export default function InteractiveCounter() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col items-center justify-center p-6 text-center text-white">
      <h3 className="text-sm font-semibold tracking-wider uppercase text-[#a3a3a3] mb-2">
        Active Artifact
      </h3>
      <div className="text-5xl font-mono font-bold my-4 text-white tracking-widest">
        {count}
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setCount((c) => c - 1)}
          className="px-3 py-1.5 rounded-lg bg-[#262626] border border-[#383838] hover:bg-[#303030] text-xs font-medium text-white transition cursor-pointer"
        >
          - Decrement
        </button>
        <button
          onClick={() => setCount(0)}
          className="px-3 py-1.5 rounded-lg bg-[#1f1f1f] border border-[#333] hover:bg-[#282828] text-xs text-[#888] hover:text-white transition cursor-pointer"
        >
          Reset
        </button>
        <button
          onClick={() => setCount((c) => c + 1)}
          className="px-3 py-1.5 rounded-lg bg-white text-black hover:bg-neutral-200 text-xs font-semibold transition cursor-pointer"
        >
          + Increment
        </button>
      </div>
    </div>
  );
}`,
  });

  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Load conversations once user is authenticated
  useEffect(() => {
    const fetchConversations = async () => {
      if (userData) {
        try {
          const list = await getconversation();
          if (list && list.length > 0) {
            dispatch(setConversation(list));
            dispatch(setSelectedConversation(list[0]));
          }
        } catch (e) {
          console.error("Failed to load user conversations:", e);
        }
      }
    };
    fetchConversations();
  }, [userData, dispatch]);

  const handleCreateNewChat = async () => {
    try {
      const newConv = await createconversation();
      if (newConv) {
        dispatch(addConversation(newConv));
        dispatch(setSelectedConversation(newConv));
      }
    } catch (err) {
      console.error("Failed to create conversation:", err);
    }
  };

  // Send Firebase ID token to backend
  const handleLogin = async (token) => {
    setIsLoggingIn(true);
    setLoginError("");
    try {
      const { data } = await api.post("/api/auth/login", { token });
      dispatch(setUserData(data));
    } catch (error) {
      console.error(
        "Backend login failed:",
        error.response?.data || error.message
      );
      setLoginError(
        error.response?.data?.message || "Authentication failed. Check backend status."
      );
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Google login
  const googleLogin = async () => {
    setIsLoggingIn(true);
    setLoginError("");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();
      await handleLogin(token);
    } catch (error) {
      console.error("Google login failed:", error);
      setLoginError(error.message || "Failed to sign in with Google.");
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-[#0d0d0d] text-[#ececec] overflow-hidden p-2.5 sm:p-3 flex items-center justify-center font-sans antialiased">
      {userData ? (
        <div className="flex w-full h-full gap-2 sm:gap-2.5 overflow-hidden transition-all duration-300">
          {/* Panel 1 (Left): Sidebar with toggle state */}
          <Sidebar
            isOpen={isSidebarOpen}
            onToggle={() => setIsSidebarOpen(false)}
            onNewChat={handleCreateNewChat}
          />

          {/* Panel 2 (Center): Chat Area */}
          <ChatArea
            userData={userData}
            isSidebarOpen={isSidebarOpen}
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            onNewChat={handleCreateNewChat}
            isArtifactOpen={isArtifactOpen}
            onToggleArtifact={() => setIsArtifactOpen(!isArtifactOpen)}
            onSelectArtifact={(artifactData) => {
              setActiveArtifact(artifactData);
              setIsArtifactOpen(true);
            }}
          />

          {/* Panel 3 (Right): Artifact Canvas */}
          {isArtifactOpen && (
            <Artifact
              artifact={activeArtifact}
              onClose={() => setIsArtifactOpen(false)}
            />
          )}
        </div>
      ) : (
        /* Minimal Black and Grey Login Modal */
        <div className="w-full max-w-sm p-6 sm:p-8 bg-[#171717] rounded-2xl border border-[#2a2a2a] shadow-2xl text-center">
          <div className="w-12 h-12 rounded-xl bg-[#222222] border border-[#333333] flex items-center justify-center mx-auto mb-4 text-white">
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="9" strokeWidth="1.75" />
              <path strokeWidth="1.75" d="M12 3a9 9 0 0 1 9 9m-9 9a9 9 0 0 1-9-9" />
            </svg>
          </div>

          <h1 className="text-xl font-semibold text-white tracking-tight mb-1">
            CortexAI Workspace
          </h1>
          <p className="text-xs text-[#8e8e8e] mb-6">
            Sign in to access your multi-agent chat and live canvas.
          </p>

          {loginError && (
            <div className="mb-4 p-3 rounded-xl bg-[#2b1f1f] border border-rose-500/40 text-rose-300 text-xs text-left">
              {loginError}
            </div>
          )}

          <button
            onClick={googleLogin}
            disabled={isLoggingIn}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white text-black hover:bg-[#e4e4e7] active:scale-[0.99] font-medium text-sm rounded-xl transition duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {isLoggingIn ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full border-2 border-black border-t-transparent animate-spin" />
                Signing in...
              </span>
            ) : (
              <>
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

export default Home;