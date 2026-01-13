"use client";

import React from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert } from "@/types";
import {
  AlertTriangle,
  AlertCircle,
  Info,
  XCircle,
  ArrowRight,
} from "lucide-react";

interface AlertsSummaryProps {
  alerts: Alert[];
}

const severityConfig = {
  critical: {
    icon: XCircle,
    color: "text-red-600",
    bgColor: "bg-red-50 dark:bg-red-950/30",
    borderColor: "border-red-200 dark:border-red-800",
  },
  high: {
    icon: AlertTriangle,
    color: "text-orange-600",
    bgColor: "bg-orange-50 dark:bg-orange-950/30",
    borderColor: "border-orange-200 dark:border-orange-800",
  },
  medium: {
    icon: AlertCircle,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50 dark:bg-yellow-950/30",
    borderColor: "border-yellow-200 dark:border-yellow-800",
  },
  low: {
    icon: Info,
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
    borderColor: "border-blue-200 dark:border-blue-800",
  },
};

const severityBadgeVariant = {
  critical: "danger" as const,
  high: "warning" as const,
  medium: "warning" as const,
  low: "info" as const,
};

export function AlertsSummary({ alerts }: AlertsSummaryProps) {
  const unresolvedAlerts = alerts.filter((a) => !a.isResolved);
  const criticalCount = unresolvedAlerts.filter((a) => a.severity === "critical").length;

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span>Active Alerts</span>
          {criticalCount > 0 && (
            <Badge variant="danger" className="animate-pulse">
              {criticalCount} Critical
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          {unresolvedAlerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <AlertCircle className="h-8 w-8 mb-2" />
              <p className="text-sm">No active alerts</p>
            </div>
          ) : (
            <div className="space-y-3">
              {unresolvedAlerts.slice(0, 5).map((alert) => {
                const config = severityConfig[alert.severity];
                const SeverityIcon = config.icon;

                return (
                  <div
                    key={alert._id}
                    className={`flex items-start gap-3 p-3 rounded-lg border ${config.bgColor} ${config.borderColor}`}
                  >
                    <SeverityIcon className={`h-5 w-5 mt-0.5 ${config.color}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm truncate">
                          {alert.title}
                        </span>
                        <Badge
                          variant={severityBadgeVariant[alert.severity]}
                          className="text-xs"
                        >
                          {alert.severity}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {alert.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(alert.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
      <CardFooter className="pt-0">
        <Button variant="ghost" className="w-full" asChild>
          <Link href="/dashboard/alerts">
            View all alerts
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
