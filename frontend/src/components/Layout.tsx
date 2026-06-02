import React from "react";
import { Navbar } from "./Navbar";

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen bg-slate-100 flex flex-col">
    <Navbar />
    <main className="flex-1 max-w-6xl mx-auto w-full p-6 space-y-6">{children}</main>
  </div>
);

