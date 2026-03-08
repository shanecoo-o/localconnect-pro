import AppLayout from "@/components/layout/AppLayout";
import BookingFlow from "@/components/booking/BookingFlow";
import { CalendarIcon } from "lucide-react";

export default function BookingPage() {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <div className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-xl px-3 py-2 md:px-6 md:py-3">
          <div className="flex items-center gap-2 md:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
              <CalendarIcon size={14} className="text-primary-foreground" />
            </div>
            <h1 className="font-display text-base font-bold">Nova Marcação</h1>
          </div>
          <div className="hidden md:block">
            <h2 className="font-display text-xl font-bold">Nova Marcação</h2>
            <p className="text-sm text-muted-foreground">Agende um serviço com um profissional</p>
          </div>
        </div>

        <div className="p-4 md:p-6">
          <BookingFlow />
        </div>
      </div>
    </AppLayout>
  );
}
