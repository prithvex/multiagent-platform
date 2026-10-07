import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import {
  setSelectedConversation,
  addConversation,
  removeConversation,
} from "../redux/conversationSlice";
import api from "../../utils/axios";
import { createconversation } from "../features/createConversation";
import { deleteConversation } from "../features/deleteConversation";
import {
  SquarePen,
  MessageSquare,
  MessageSquarePlus,
  LogOut,
  Settings,
  User,
  Trash2,
  Sparkles,
  PanelLeftClose,
  PanelLeft,
  ChevronDown,
} from "lucide-react";

const Sidebar = ({
  isOpen = false,
  onToggle,
  onSelectChat,
  onNewChat,
}) => {
  const { userData } = useSelector((state) => state.user);
  const { conversations = [], selectedConversation } = useSelector(
    (state) => state.conversation
  );
  const dispatch = useDispatch();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isCreatingChat, setIsCreatingChat] = useState(false);

  const currentChatId = selectedConversation?._id || selectedConversation?.id;

  const handleLogout = async () => {
    try {
      await api.get("/api/auth/logout");
    } catch (e) {
      console.log("Logout notice:", e.message);
    } finally {
      dispatch(setUserData(null));
      dispatch(setSelectedConversation(null));
    }
  };

  const handleCreateNewChat = () => {
    if (!selectedConversation) return;
    dispatch(setSelectedConversation(null));
    if (onNewChat) onNewChat();
  };

  const handleDeleteChat = async (e, chatId) => {
    e.stopPropagation();
    dispatch(removeConversation(chatId));
    try {
      await deleteConversation(chatId);
    } catch (err) {
      console.error("Failed to delete conversation on server:", err);
    }
  };

  const handleSelect = (conv) => {
    dispatch(setSelectedConversation(conv));
    if (onSelectChat) onSelectChat(conv);
  };

  return (
    <aside
      className={`h-full bg-[#171717] border border-[#262626] rounded-2xl flex flex-col justify-between select-none shrink-0 transition-all duration-300 ease-in-out shadow-2xl relative ${isOpen
          ? "w-64 sm:w-72 p-3 opacity-100 pointer-events-auto"
          : "w-0 p-0 m-0 border-0 opacity-0 pointer-events-none overflow-hidden"
        }`}
    >
      {/* Top Header Row: Branding and Sidebar Close Toggle Button */}
      <div className="flex items-center justify-between mb-2.5 px-1">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#212121] border border-[#2f2f2f] flex items-center justify-center text-white text-xs font-semibold">
            C
          </div>
          <span className="text-xs font-medium text-[#ececec] tracking-wide">
            CortexAI
          </span>
        </div>

        {/* Sidebar Close Button */}
        <button
          onClick={onToggle}
          title="Close sidebar"
          className="p-1.5 rounded-lg text-[#8e8e8e] hover:text-white hover:bg-[#242424] transition cursor-pointer"
        >
          <PanelLeft className="w-4 h-4 stroke-[1.75]" />
        </button>
      </div>

      {/* New Chat Button */}
      <button
        onClick={handleCreateNewChat}
        disabled={isCreatingChat}
        className="w-full py-2.5 px-3.5 rounded-xl border border-[#2f2f2f] bg-[#212121] hover:bg-[#282828] active:scale-[0.99] text-[#ececec] text-xs font-medium flex items-center justify-between transition cursor-pointer shadow-sm group hover:border-[#383838] disabled:opacity-50"
      >
        <div className="flex items-center gap-2.5">
          {isCreatingChat ? (
            <span className="w-3.5 h-3.5 border-2 border-white/50 border-t-transparent rounded-full animate-spin" />
          ) : (
            <SquarePen className="w-3.5 h-3.5 text-[#a1a1aa] group-hover:text-white transition-colors" />
          )}
          <span className="tracking-wide">New chat</span>
        </div>
        <span className="text-[10px] text-[#71717a] font-mono group-hover:text-[#a1a1aa]">
          Ctrl+N
        </span>
      </button>

      {/* Middle: Chat History Container */}
      <div className="flex-1 my-2.5 rounded-xl border border-[#262626] bg-[#1a1a1a] p-2 overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-2 py-1 mb-1">
          <span className="text-[10px] uppercase font-semibold tracking-wider text-[#71717a]">
            Recent chats
          </span>
          <span className="text-[10px] font-mono text-[#52525b]">
            {conversations.length}
          </span>
        </div>

        {/* Scrollable list */}
        <div className="space-y-1 flex-1 overflow-y-auto pr-0.5 custom-scrollbar">
          {conversations.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-4 text-[#71717a]">
              <MessageSquarePlus className="w-6 h-6 mb-2 text-[#404040] stroke-[1.5]" />
              <p className="text-xs font-medium text-[#8e8e8e]">No conversations</p>
              <p className="text-[11px] text-[#52525b] mt-0.5">
                Click "New chat" to start
              </p>
            </div>
          ) : (
            conversations.map((chat) => {
              const chatId = chat._id || chat.id;
              const isSelected = currentChatId === chatId;
              const title = chat.title || "New chat";

              return (
                <div
                  key={chatId}
                  onClick={() => handleSelect(chat)}
                  className={`w-full px-3 py-2 rounded-lg text-xs transition cursor-pointer flex items-center justify-between group ${isSelected
                      ? "bg-[#282828] text-white border border-[#383838] shadow-sm font-medium"
                      : "text-[#a1a1aa] hover:bg-[#212121] hover:text-[#ececec] border border-transparent"
                    }`}
                >
                  <div className="flex items-center gap-2 truncate min-w-0">
                    <MessageSquare
                      className={`w-3.5 h-3.5 shrink-0 transition-colors ${isSelected ? "text-white" : "text-[#71717a] group-hover:text-[#a1a1aa]"
                        }`}
                    />
                    <span className="truncate">{title}</span>
                  </div>

                  <button
                    onClick={(e) => handleDeleteChat(e, chatId)}
                    title="Delete thread"
                    className="opacity-0 group-hover:opacity-100 p-1 hover:text-white rounded transition text-[#71717a] shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Bottom: Dedicated User Profile Bar */}
      <div className="relative">
        {showUserMenu && (
          <div className="absolute bottom-14 left-0 right-0 bg-[#212121] border border-[#2f2f2f] rounded-xl shadow-2xl p-1.5 z-50 text-xs space-y-0.5 animate-in fade-in slide-in-from-bottom-2 duration-150">
            <div className="px-3 py-2 border-b border-[#2a2a2a] text-[11px] text-[#8e8e8e] truncate flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-[#d4d4d8]" />
              <span className="truncate">{userData?.email || "user@cortex.ai"}</span>
            </div>
            <button
              onClick={() => setShowUserMenu(false)}
              className="w-full px-3 py-2 rounded-lg text-[#d4d4d8] hover:bg-[#2a2a2a] transition text-left flex items-center gap-2.5 cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5 text-[#8e8e8e]" />
              <span>Settings</span>
            </button>
            <button
              onClick={handleLogout}
              className="w-full px-3 py-2 rounded-lg text-[#e5e5e5] hover:bg-[#2a2a2a] hover:text-rose-400 transition text-left flex items-center gap-2.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 text-[#8e8e8e]" />
              <span>Log out</span>
            </button>
          </div>
        )}

        <div
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="w-full p-2 rounded-xl border border-[#262626] bg-[#1a1a1a] hover:bg-[#212121] transition flex items-center justify-between gap-2.5 cursor-pointer shadow-sm group hover:border-[#333333]"
        >
          {userData?.avatar ? (
            <img
              src={userData.avatar}
              alt={userData?.name || "User"}
              className="w-7 h-7 rounded-full object-cover border border-[#333333] shrink-0"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-[#242424] border border-[#333333] flex items-center justify-center text-xs text-white shrink-0 font-medium">
              <User className="w-3.5 h-3.5 text-[#a1a1aa]" />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-[#ececec] truncate leading-tight group-hover:text-white">
              {userData?.name || "Cortex User"}
            </div>
            <div className="text-[10px] text-[#71717a] truncate">Free plan</div>
          </div>

          <div className="w-5 h-5 flex items-center justify-center text-[#71717a] group-hover:text-white transition">
            <ChevronDown className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
