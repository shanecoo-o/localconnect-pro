import { MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import AppLayout from "@/components/layout/AppLayout";

const conversations = [
  { id: "1", name: "Maria Silva", lastMsg: "Ok, combinado para amanhã às 9h", time: "10:30", unread: 2, category: "Canalizador" },
  { id: "2", name: "António Costa", lastMsg: "Pode enviar orçamento?", time: "09:15", unread: 0, category: "Eletricista" },
  { id: "3", name: "Joana Lopes", lastMsg: "Trabalho concluído, obrigada!", time: "Ontem", unread: 0, category: "Limpeza" },
];

export default function Messages() {
  return (
    <AppLayout>
      <div className="max-w-lg mx-auto">
        <div className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-xl px-4 py-3">
          <h2 className="font-display text-lg font-bold">Mensagens</h2>
          <p className="text-xs text-muted-foreground">{conversations.length} conversas</p>
        </div>
        <div className="p-4 space-y-2">
          {conversations.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 cursor-pointer card-hover"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary font-display text-lg font-bold text-primary">
                {c.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-foreground text-sm truncate">{c.name}</h4>
                  <span className="text-[11px] text-muted-foreground shrink-0">{c.time}</span>
                </div>
                <p className="text-xs text-muted-foreground truncate mt-0.5">{c.lastMsg}</p>
                <span className="text-[10px] text-primary mt-0.5 block">{c.category}</span>
              </div>
              {c.unread > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {c.unread}
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
