import { useState, useRef, useEffect } from "react";
import { MessageSquare, ArrowLeft, Send, Phone, MoreVertical, Image } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AppLayout from "@/components/layout/AppLayout";
import { useAuth } from "@/contexts/AuthContext";

interface Message {
  id: string;
  text: string;
  fromMe: boolean;
  time: string;
}

interface Conversation {
  id: string;
  name: string;
  lastMsg: string;
  time: string;
  unread: number;
  category: string;
  online: boolean;
  messages: Message[];
}

const conversations: Conversation[] = [
  {
    id: "1", name: "Maria Silva", lastMsg: "Ok, combinado para amanhã às 9h", time: "10:30", unread: 2, category: "Canalizador", online: true,
    messages: [
      { id: "m1", text: "Olá, preciso de um canalizador urgente", fromMe: false, time: "09:45" },
      { id: "m2", text: "Bom dia! Claro, qual é o problema?", fromMe: true, time: "09:50" },
      { id: "m3", text: "Tenho uma fuga na cozinha debaixo do lava-louça", fromMe: false, time: "09:52" },
      { id: "m4", text: "Posso ir amanhã de manhã às 9h, serve?", fromMe: true, time: "10:00" },
      { id: "m5", text: "Sim, perfeito!", fromMe: false, time: "10:25" },
      { id: "m6", text: "Ok, combinado para amanhã às 9h", fromMe: false, time: "10:30" },
    ],
  },
  {
    id: "2", name: "António Costa", lastMsg: "Pode enviar orçamento?", time: "09:15", unread: 0, category: "Eletricista", online: false,
    messages: [
      { id: "m1", text: "Boa tarde, preciso de instalar pontos de luz", fromMe: false, time: "08:30" },
      { id: "m2", text: "Quantos pontos precisa?", fromMe: true, time: "08:45" },
      { id: "m3", text: "3 no quarto e 2 na sala", fromMe: false, time: "09:00" },
      { id: "m4", text: "Pode enviar orçamento?", fromMe: false, time: "09:15" },
    ],
  },
  {
    id: "3", name: "Joana Lopes", lastMsg: "Trabalho concluído, obrigada!", time: "Ontem", unread: 0, category: "Limpeza", online: true,
    messages: [
      { id: "m1", text: "A limpeza ficou excelente!", fromMe: false, time: "16:00" },
      { id: "m2", text: "Muito obrigado pelo feedback! 😊", fromMe: true, time: "16:10" },
      { id: "m3", text: "Trabalho concluído, obrigada!", fromMe: false, time: "16:15" },
    ],
  },
];

export default function Messages() {
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [chats, setChats] = useState(conversations);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const active = chats.find((c) => c.id === activeChat);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [active?.messages.length]);

  const sendMessage = () => {
    if (!input.trim() || !activeChat) return;
    const newMsg: Message = {
      id: `m${Date.now()}`,
      text: input.trim(),
      fromMe: true,
      time: new Date().toLocaleTimeString("pt", { hour: "2-digit", minute: "2-digit" }),
    };
    setChats((prev) =>
      prev.map((c) =>
        c.id === activeChat
          ? { ...c, messages: [...c.messages, newMsg], lastMsg: newMsg.text, time: newMsg.time }
          : c
      )
    );
    setInput("");
    inputRef.current?.focus();
  };

  // ─── Conversation List ───
  const ConversationList = () => (
    <div className={`flex flex-col h-full ${activeChat ? "hidden md:flex" : "flex"} md:w-80 lg:w-96 md:border-r md:border-border`}>
      <div className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-xl px-4 py-3">
        <h2 className="font-display text-lg font-bold">Mensagens</h2>
        <p className="text-xs text-muted-foreground">{chats.length} conversas</p>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
        {chats.map((c, i) => (
          <motion.button
            key={c.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            onClick={() => {
              setActiveChat(c.id);
              // Clear unread
              setChats((prev) => prev.map((ch) => (ch.id === c.id ? { ...ch, unread: 0 } : ch)));
            }}
            className={`flex w-full items-center gap-3 rounded-2xl p-3 text-left transition-colors ${
              activeChat === c.id
                ? "bg-primary/10 border border-primary/20"
                : "hover:bg-surface-hover border border-transparent"
            }`}
          >
            <div className="relative shrink-0">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary font-display text-base font-bold text-primary">
                {c.name.charAt(0)}
              </div>
              {c.online && (
                <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card bg-emerald-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-foreground text-sm truncate">{c.name}</h4>
                <span className="text-[10px] text-muted-foreground shrink-0 ml-2">{c.time}</span>
              </div>
              <p className="text-xs text-muted-foreground truncate mt-0.5">{c.lastMsg}</p>
            </div>
            {c.unread > 0 && (
              <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">
                {c.unread}
              </span>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );

  // ─── Chat View ───
  const ChatView = () => {
    if (!active) {
      return (
        <div className="hidden md:flex flex-1 items-center justify-center">
          <div className="text-center">
            <MessageSquare size={48} className="mx-auto text-muted-foreground/20 mb-3" />
            <p className="text-sm text-muted-foreground">Selecione uma conversa</p>
          </div>
        </div>
      );
    }

    return (
      <div className={`flex flex-col flex-1 h-full ${!activeChat ? "hidden md:flex" : "flex"}`}>
        {/* Chat header */}
        <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-border bg-background/80 backdrop-blur-xl px-3 py-2.5 md:px-4 md:py-3">
          <button
            onClick={() => setActiveChat(null)}
            className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-surface-hover transition-colors md:hidden"
          >
            <ArrowLeft size={18} className="text-foreground" />
          </button>
          <div className="relative">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary font-display text-sm font-bold text-primary">
              {active.name.charAt(0)}
            </div>
            {active.online && (
              <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-card bg-emerald-400" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-foreground text-sm truncate">{active.name}</h4>
            <p className="text-[10px] text-muted-foreground">
              {active.online ? "Online" : "Offline"} • {active.category}
            </p>
          </div>
          <button className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-surface-hover transition-colors">
            <Phone size={16} className="text-muted-foreground" />
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-surface-hover transition-colors">
            <MoreVertical size={16} className="text-muted-foreground" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-3 py-4 md:px-4 space-y-2">
          {active.messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.fromMe ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] md:max-w-[65%] rounded-2xl px-3.5 py-2.5 ${
                  msg.fromMe
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-secondary text-foreground rounded-bl-md"
                }`}
              >
                <p className="text-sm leading-relaxed">{msg.text}</p>
                <p className={`text-[9px] mt-1 text-right ${
                  msg.fromMe ? "text-primary-foreground/60" : "text-muted-foreground"
                }`}>
                  {msg.time}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input bar */}
        <div className="sticky bottom-0 border-t border-border bg-background/90 backdrop-blur-xl px-3 py-2.5 md:px-4 md:py-3 pb-safe">
          <div className="flex items-center gap-2">
            <button className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-secondary hover:bg-surface-hover transition-colors">
              <Image size={16} className="text-muted-foreground" />
            </button>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Escrever mensagem..."
              className="flex-1 rounded-xl border border-border bg-secondary px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 h-9 md:h-10"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              className="flex h-9 w-9 md:h-10 md:w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-40"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <AppLayout>
      <div className="flex h-[calc(100vh-4rem)] md:h-screen md:max-h-screen overflow-hidden max-w-5xl mx-auto">
        <ConversationList />
        <ChatView />
      </div>
    </AppLayout>
  );
}
