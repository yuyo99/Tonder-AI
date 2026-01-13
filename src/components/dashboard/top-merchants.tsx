"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatCurrency, formatNumber } from "@/lib/utils";

interface TopMerchant {
  merchantId: string;
  merchantName: string;
  volume: number;
  transactions: number;
}

interface TopMerchantsProps {
  merchants: TopMerchant[];
}

export function TopMerchants({ merchants }: TopMerchantsProps) {
  const maxVolume = Math.max(...merchants.map((m) => m.volume));

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle>Top Merchants by Volume</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {merchants.slice(0, 5).map((merchant, index) => {
            const percentage = (merchant.volume / maxVolume) * 100;

            return (
              <div key={merchant.merchantId} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-medium">
                      {index + 1}
                    </span>
                    <span className="font-medium text-sm truncate max-w-[200px]">
                      {merchant.merchantName}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-sm">
                      {formatCurrency(merchant.volume)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatNumber(merchant.transactions)} txns
                    </div>
                  </div>
                </div>
                <Progress value={percentage} className="h-2" />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
