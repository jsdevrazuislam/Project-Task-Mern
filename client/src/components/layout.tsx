import type React from "react";
import Navbar from "./navbar";

function Layout({ children }: { children: React.ReactNode}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Navbar />
        <main>
          {children} 
        </main>
    </div>
  );
}

export default Layout