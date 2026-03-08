import { ReactNode } from "react";
import BottomNav from "./BottomNav";
import DesktopSidebar from "./DesktopSidebar";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <DesktopSidebar />
      <main className="pb-20 md:pb-0 md:pl-64">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
