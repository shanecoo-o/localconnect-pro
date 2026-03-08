import { ReactNode } from "react";
import BottomNav from "./BottomNav";
import DesktopSidebar from "./DesktopSidebar";

interface Props {
  children: ReactNode;
  hideBottomNav?: boolean;
}

export default function AppLayout({ children, hideBottomNav }: Props) {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <DesktopSidebar />
      <main className={`${hideBottomNav ? '' : 'pb-20'} md:pb-0 md:pl-64 overflow-x-hidden`}>
        {children}
      </main>
      {!hideBottomNav && <BottomNav />}
    </div>
  );
}
