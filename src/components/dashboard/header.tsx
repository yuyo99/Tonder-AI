"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Bell, Search, Wifi, WifiOff, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface HeaderProps {
  isConnected?: boolean;
  unreadAlerts?: number;
}

const pathTitles: Record<string, string> = {
  "/dashboard": "Overview",
  "/dashboard/transactions": "Transaction Monitoring",
  "/dashboard/withdrawals": "Withdrawals Monitoring",
  "/dashboard/revenue": "Revenue Analytics",
  "/dashboard/alerts": "Alerts & Thresholds",
  "/dashboard/settings": "Settings",
};

export function Header({ isConnected = true, unreadAlerts = 0 }: HeaderProps) {
  const pathname = usePathname();
  const title = pathTitles[pathname] || "Dashboard";
  const [isDark, setIsDark] = React.useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-6">
      {/* Page Title & Breadcrumb */}
      <div className="flex flex-1 items-center gap-4">
        <h1 className="text-xl font-semibold">{title}</h1>

        {/* Connection Status */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className={`flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium ${
                  isConnected
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                }`}
              >
                {isConnected ? (
                  <Wifi className="h-3 w-3" />
                ) : (
                  <WifiOff className="h-3 w-3" />
                )}
                {isConnected ? "Live" : "Disconnected"}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              {isConnected
                ? "Real-time updates are active"
                : "Connection lost. Attempting to reconnect..."}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Search */}
      <div className="relative hidden md:block">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search transactions..."
          className="w-64 pl-9"
        />
      </div>

      {/* Theme Toggle */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {isDark ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {isDark ? "Switch to light mode" : "Switch to dark mode"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Notifications */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {unreadAlerts > 0 && (
              <Badge
                variant="destructive"
                className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
              >
                {unreadAlerts > 9 ? "9+" : unreadAlerts}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <DropdownMenuLabel className="flex items-center justify-between">
            Notifications
            {unreadAlerts > 0 && (
              <Badge variant="secondary">{unreadAlerts} unread</Badge>
            )}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <div className="max-h-80 overflow-y-auto">
            <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
              <div className="flex w-full items-center justify-between">
                <span className="font-medium text-sm">Success Rate Alert</span>
                <Badge variant="danger" className="text-xs">Critical</Badge>
              </div>
              <span className="text-xs text-muted-foreground">
                Success rate dropped below 95% threshold
              </span>
              <span className="text-xs text-muted-foreground">2 min ago</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
              <div className="flex w-full items-center justify-between">
                <span className="font-medium text-sm">High Volume Detected</span>
                <Badge variant="warning" className="text-xs">High</Badge>
              </div>
              <span className="text-xs text-muted-foreground">
                Transaction volume 50% above average
              </span>
              <span className="text-xs text-muted-foreground">15 min ago</span>
            </DropdownMenuItem>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="justify-center text-primary">
            View all alerts
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* User Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-9 w-9 rounded-full">
            <Avatar className="h-9 w-9">
              <AvatarImage src="/avatars/coo.png" alt="COO" />
              <AvatarFallback className="bg-primary text-primary-foreground">
                CO
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium">Maria Garcia</p>
              <p className="text-xs text-muted-foreground">
                Chief Operating Officer
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-600">Log out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
