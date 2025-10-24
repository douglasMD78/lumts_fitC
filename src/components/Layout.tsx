import { Outlet } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/navigation/BottomNav"; // Import BottomNav
import { useIsMobile } from '@/hooks/use-mobile'; // Import useIsMobile

const Layout = () => {
  const isMobile = useIsMobile(); // Use the hook

  return (
    <div className="min-h-screen w-full bg-slate-50/50 relative overflow-hidden flex flex-col">
      {/* Soft background shapes */}
      <div className="absolute top-0 left-0 w-full h-full z-[-1]">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-pink-200/50 rounded-full filter blur-3xl opacity-50 animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-200/50 rounded-full filter blur-3xl opacity-50 animate-pulse animation-delay-400"></div>
      </div>
      
      <Header />
      <main className="flex-grow pb-16 lg:pb-0"> {/* Add padding-bottom for mobile to account for BottomNav */}
        <Outlet />
      </main>
      <Footer />
      {isMobile && <BottomNav />} {/* Conditionally render BottomNav */}
    </div>
  );
};

export default Layout;