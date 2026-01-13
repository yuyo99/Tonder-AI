"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import {
  Bell,
  AlertTriangle,
  AlertCircle,
  Info,
  XCircle,
  CheckCircle2,
  Settings,
  Search,
  Filter,
  Eye,
  EyeOff,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { generateAlerts } from "@/lib/mock-data";
import { Alert, AlertType, AlertSeverity } from "@/types";

const severityConfig: Record<AlertSeverity, { icon: React.ComponentType<{ className?: string }>; color: string; bgColor: string; borderColor: string }> = {
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

const severityBadgeVariant: Record<AlertSeverity, "danger" | "warning" | "info" | "default"> = {
  critical: "danger",
  high: "warning",
  medium: "warning",
  low: "info",
};

interface AlertThreshold {
  type: AlertType;
  name: string;
  description: string;
  threshold: number;
  unit: string;
  isEnabled: boolean;
}

const defaultThresholds: AlertThreshold[] = [
  {
    type: "success_rate",
    name: "Success Rate",
    description: "Alert when success rate drops below threshold",
    threshold: 95,
    unit: "%",
    isEnabled: true,
  },
  {
    type: "high_chargebacks",
    name: "Chargeback Rate",
    description: "Alert when chargeback rate exceeds threshold",
    threshold: 1,
    unit: "%",
    isEnabled: true,
  },
  {
    type: "unusual_volume",
    name: "Volume Change",
    description: "Alert when volume changes by more than threshold from average",
    threshold: 50,
    unit: "%",
    isEnabled: true,
  },
  {
    type: "system_latency",
    name: "Processing Time",
    description: "Alert when average processing time exceeds threshold",
    threshold: 3000,
    unit: "ms",
    isEnabled: true,
  },
  {
    type: "fraud_suspected",
    name: "Fraud Score",
    description: "Alert when fraud score exceeds threshold",
    threshold: 80,
    unit: "",
    isEnabled: true,
  },
];

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>(() => generateAlerts(25));
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [showResolved, setShowResolved] = useState(false);
  const [thresholds, setThresholds] = useState<AlertThreshold[]>(defaultThresholds);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  // Calculate stats
  const stats = useMemo(() => {
    const unresolved = alerts.filter((a) => !a.isResolved);
    return {
      total: unresolved.length,
      critical: unresolved.filter((a) => a.severity === "critical").length,
      high: unresolved.filter((a) => a.severity === "high").length,
      medium: unresolved.filter((a) => a.severity === "medium").length,
      low: unresolved.filter((a) => a.severity === "low").length,
    };
  }, [alerts]);

  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      const matchesSearch =
        alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alert.message.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSeverity =
        severityFilter === "all" || alert.severity === severityFilter;
      const matchesResolved = showResolved || !alert.isResolved;
      return matchesSearch && matchesSeverity && matchesResolved;
    });
  }, [alerts, searchQuery, severityFilter, showResolved]);

  const handleResolve = (alertId: string) => {
    setAlerts(
      alerts.map((a) =>
        a._id === alertId
          ? { ...a, isResolved: true, resolvedAt: new Date() }
          : a
      )
    );
    setSelectedAlert(null);
  };

  const handleMarkRead = (alertId: string) => {
    setAlerts(
      alerts.map((a) => (a._id === alertId ? { ...a, isRead: true } : a))
    );
  };

  const updateThreshold = (type: AlertType, value: number) => {
    setThresholds(
      thresholds.map((t) => (t.type === type ? { ...t, threshold: value } : t))
    );
  };

  const toggleThreshold = (type: AlertType) => {
    setThresholds(
      thresholds.map((t) =>
        t.type === type ? { ...t, isEnabled: !t.isEnabled } : t
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card className="border-l-4 border-l-primary">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Active</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Bell className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Critical</p>
                <p className="text-2xl font-bold text-red-600">{stats.critical}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">High</p>
                <p className="text-2xl font-bold text-orange-600">{stats.high}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Medium</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.medium}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Low</p>
                <p className="text-2xl font-bold text-blue-600">{stats.low}</p>
              </div>
              <Info className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="alerts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="alerts">Active Alerts</TabsTrigger>
          <TabsTrigger value="thresholds">Threshold Configuration</TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search alerts..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
                <Select value={severityFilter} onValueChange={setSeverityFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Severity</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-2">
                  <Switch
                    id="show-resolved"
                    checked={showResolved}
                    onCheckedChange={setShowResolved}
                  />
                  <Label htmlFor="show-resolved">Show resolved</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alerts List */}
          <div className="space-y-3">
            <AnimatePresence>
              {filteredAlerts.map((alert, index) => {
                const config = severityConfig[alert.severity];
                const SeverityIcon = config.icon;

                return (
                  <motion.div
                    key={alert._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <Card
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        alert.isResolved ? "opacity-60" : ""
                      } ${!alert.isRead ? "ring-2 ring-primary/20" : ""}`}
                      onClick={() => {
                        setSelectedAlert(alert);
                        if (!alert.isRead) handleMarkRead(alert._id);
                      }}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${config.bgColor}`}
                          >
                            <SeverityIcon className={`h-5 w-5 ${config.color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">{alert.title}</span>
                              <Badge variant={severityBadgeVariant[alert.severity]}>
                                {alert.severity}
                              </Badge>
                              {alert.isResolved && (
                                <Badge variant="success">Resolved</Badge>
                              )}
                              {!alert.isRead && (
                                <div className="h-2 w-2 rounded-full bg-primary" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {alert.message}
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                              <span>
                                {formatDistanceToNow(new Date(alert.createdAt), {
                                  addSuffix: true,
                                })}
                              </span>
                              <span>
                                Metric: {alert.metric} | Threshold: {alert.threshold} |
                                Current: {alert.currentValue.toFixed(1)}
                              </span>
                            </div>
                          </div>
                          {!alert.isResolved && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleResolve(alert._id);
                              }}
                            >
                              <CheckCircle2 className="h-4 w-4 mr-1" />
                              Resolve
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </TabsContent>

        <TabsContent value="thresholds" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Alert Threshold Configuration
              </CardTitle>
              <CardDescription>
                Configure when alerts should be triggered based on metric thresholds.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {thresholds.map((threshold) => (
                  <div
                    key={threshold.type}
                    className="flex items-center justify-between p-4 rounded-lg border"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{threshold.name}</h4>
                        <Badge variant={threshold.isEnabled ? "default" : "secondary"}>
                          {threshold.isEnabled ? "Active" : "Disabled"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {threshold.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={threshold.threshold}
                          onChange={(e) =>
                            updateThreshold(threshold.type, parseFloat(e.target.value))
                          }
                          className="w-24"
                          disabled={!threshold.isEnabled}
                        />
                        <span className="text-sm text-muted-foreground w-8">
                          {threshold.unit}
                        </span>
                      </div>
                      <Switch
                        checked={threshold.isEnabled}
                        onCheckedChange={() => toggleThreshold(threshold.type)}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-end">
                <Button>Save Configuration</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Alert Detail Dialog */}
      <Dialog open={!!selectedAlert} onOpenChange={() => setSelectedAlert(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedAlert?.title}</DialogTitle>
            <DialogDescription>Alert Details</DialogDescription>
          </DialogHeader>
          {selectedAlert && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant={severityBadgeVariant[selectedAlert.severity]}>
                  {selectedAlert.severity}
                </Badge>
                {selectedAlert.isResolved && (
                  <Badge variant="success">Resolved</Badge>
                )}
              </div>
              <p className="text-muted-foreground">{selectedAlert.message}</p>
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Metric</p>
                  <p className="font-medium">{selectedAlert.metric}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Threshold</p>
                  <p className="font-medium">{selectedAlert.threshold}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Current Value</p>
                  <p className="font-medium">
                    {selectedAlert.currentValue.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="font-medium">
                    {new Date(selectedAlert.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              {selectedAlert.merchantId && (
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Related Merchant</p>
                  <p className="font-medium">{selectedAlert.merchantId}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedAlert(null)}>
              Close
            </Button>
            {selectedAlert && !selectedAlert.isResolved && (
              <Button onClick={() => handleResolve(selectedAlert._id)}>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Resolve Alert
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
