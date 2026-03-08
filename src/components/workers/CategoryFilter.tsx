import { motion } from "framer-motion";
import { categories } from "@/data/mockData";

interface Props {
  selected: string | null;
  onSelect: (id: string | null) => void;
}

export default function CategoryFilter({ selected, onSelect }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
      <button
        onClick={() => onSelect(null)}
        className={`shrink-0 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
          selected === null
            ? "bg-gradient-primary text-primary-foreground glow-primary-sm"
            : "bg-secondary text-secondary-foreground hover:bg-surface-hover"
        }`}
      >
        Todos
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(selected === cat.id ? null : cat.id)}
          className={`shrink-0 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
            selected === cat.id
              ? "bg-gradient-primary text-primary-foreground glow-primary-sm"
              : "bg-secondary text-secondary-foreground hover:bg-surface-hover"
          }`}
        >
          <span className="mr-1.5">{cat.icon}</span>
          {cat.name}
          <span className="ml-1.5 text-xs opacity-70">{cat.count}</span>
        </button>
      ))}
    </div>
  );
}
