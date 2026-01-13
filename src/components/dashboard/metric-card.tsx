"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus, LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    direction: "up" | "down" | "stable";
    label?: string;
  };
  icon?: LucideIcon;
  iconColor?: string;
  chart?: React.ReactNode;
  className?: string;
}

export function MetricCard({
  title,
  value,
  subtitle,
  trend,
  icon: Icon,
  iconColor = "text-primary",
  chart,
  className,
}: MetricCardProps) {
  const TrendIcon = trend?.direction === "up"
    ? TrendingUp
    : trend?.direction === "down"
      ? TrendingDown
      : Minus;

  const trendColor = trend?.direction === "up"
    ? "text-green-600"
    : trend?.direction === "down"
      ? "text-red-600"
      : "text-muted-foreground";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={cn("overflow-hidden", className)}>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          {Icon && (
            <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center bg-muted", iconColor)}>
              <Icon className="h-4 w-4" />
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between">
            <div>
              <motion.div
                key={String(value)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl font-bold"
              >
                {value}
              </motion.div>
              {subtitle && (
                <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
              )}
              {trend && (
                <div className={cn("flex items-center gap-1 text-xs mt-1", trendColor)}>
                  <TrendIcon className="h-3 w-3" />
                  <span>
                    {trend.value > 0 ? "+" : ""}
                    {trend.value}%
                  </span>
                  {trend.label && (
                    <span className="text-muted-foreground">{trend.label}</span>
                  )}
                </div>
              )}
            </div>
            {chart && <div className="w-24 h-12">{chart}</div>}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
