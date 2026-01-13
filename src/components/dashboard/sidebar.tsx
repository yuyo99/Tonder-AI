"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard,
  CreditCard,
  Wallet,
  DollarSign,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
} from "lucide-react";

const menuItems = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Transactions",
    href: "/dashboard/transactions",
    icon: CreditCard,
  },
  {
    title: "Withdrawals",
    href: "/dashboard/withdrawals",
    icon: Wallet,
  },
  {
    title: "Revenue",
    href: "/dashboard/revenue",
    icon: DollarSign,
  },
  {
    title: "Alerts",
    href: "/dashboard/alerts",
    icon: Bell,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "relative flex flex-col border-r bg-background transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
        className
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Zap className="h-5 w-5 text-primary-foreground" />
          </div>
          {!isCollapsed && (
            <span className="text-xl font-bold text-primary">Tonder</span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 py-4">
        <nav className="flex flex-col gap-1 px-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  isCollapsed && "justify-center px-2"
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {!isCollapsed && <span>{item.title}</span>}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Collapse Toggle */}
      <Separator />
      <div className="p-2">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "w-full justify-center",
            isCollapsed ? "px-2" : "justify-start"
          )}
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Collapse
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
