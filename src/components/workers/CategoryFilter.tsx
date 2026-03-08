import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { categories } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Props {
  selected: string | null;
  onSelect: (id: string | null) => void;
}

export default function CategoryFilter({ selected, onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const selectedCat = categories.find((c) => c.id === selected);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between rounded-xl border-border bg-secondary text-sm hover:bg-surface-hover h-9 md:h-10"
        >
          <span className="truncate">
            {selectedCat ? (
              <>
                <span className="mr-1.5">{selectedCat.icon}</span>
                {selectedCat.name}
                <span className="ml-1.5 text-xs opacity-70">{selectedCat.count}</span>
              </>
            ) : (
              "Todas as categorias"
            )}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command>
          <CommandInput placeholder="Pesquisar categoria..." />
          <CommandList>
            <CommandEmpty>Nenhuma categoria encontrada.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  onSelect(null);
                  setOpen(false);
                }}
              >
                <Check className={cn("mr-2 h-4 w-4", !selected ? "opacity-100" : "opacity-0")} />
                Todas as categorias
              </CommandItem>
              {categories.map((cat) => (
                <CommandItem
                  key={cat.id}
                  onSelect={() => {
                    onSelect(selected === cat.id ? null : cat.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn("mr-2 h-4 w-4", selected === cat.id ? "opacity-100" : "opacity-0")}
                  />
                  <span className="mr-1.5">{cat.icon}</span>
                  {cat.name}
                  <span className="ml-auto text-xs text-muted-foreground">{cat.count}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
