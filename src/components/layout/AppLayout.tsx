import { ReactNode } from "react";
import BottomNav from "./BottomNav";
import DesktopSidebar from "./DesktopSidebar";
import { useAuth } from "@/contexts/AuthContext";

interface Props {
  children: ReactNode;
  hideBottomNav?: boolean;
}

export default function AppLayout({ children, hideBottomNav }: Props) {
  const { isAuthenticated, user } = useAuth();
  // Extra bottom padding when worker mode switch bar is visible on mobile
  const hasModeSwitchBar = isAuthenticated && user?.role === "worker" && !hideBottomNav;

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <DesktopSidebar />
      <main className={`${hideBottomNav ? '' : hasModeSwitchBar ? 'pb-32' : 'pb-20'} md:pb-0 md:pl-64 overflow-x-hidden`}>
        {children}
      </main>
      {!hideBottomNav && <BottomNav />}
    </div>
  );
}