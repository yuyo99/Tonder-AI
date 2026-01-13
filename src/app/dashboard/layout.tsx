"use client";

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { TooltipProvider } from "@/components/ui/tooltip";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      refetchInterval: 1000 * 30, // 30 seconds for real-time feel
    },
  },
});

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="flex h-screen overflow-hidden bg-muted/30">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <div className="flex flex-1 flex-col overflow-hidden">
            {/* Header */}
            <Header isConnected={true} unreadAlerts={3} />

            {/* Page Content */}
            <main className="flex-1 overflow-y-auto p-6">{children}</main>
          </div>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
