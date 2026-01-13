"use client";

import React, { useState } from "react";
import {
  Bell,
  Mail,
  Clock,
  Shield,
  Users,
  Palette,
  Database,
  Save,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface NotificationSettings {
  emailAlerts: boolean;
  criticalAlerts: boolean;
  dailyDigest: boolean;
  weeklyReport: boolean;
  transactionAlerts: boolean;
  withdrawalAlerts: boolean;
}

interface DashboardSettings {
  refreshInterval: string;
  defaultPage: string;
  compactMode: boolean;
  showAnimations: boolean;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: "coo" | "admin" | "analyst";
  lastActive: Date;
}

export default function SettingsPage() {
  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailAlerts: true,
    criticalAlerts: true,
    dailyDigest: true,
    weeklyReport: false,
    transactionAlerts: false,
    withdrawalAlerts: true,
  });

  const [dashboard, setDashboard] = useState<DashboardSettings>({
    refreshInterval: "30",
    defaultPage: "overview",
    compactMode: false,
    showAnimations: true,
  });

  const [users] = useState<User[]>([
    {
      id: "1",
      name: "Maria Garcia",
      email: "maria.garcia@tonder.mx",
      role: "coo",
      lastActive: new Date(),
    },
    {
      id: "2",
      name: "Carlos Rodriguez",
      email: "carlos.rodriguez@tonder.mx",
      role: "admin",
      lastActive: new Date(Date.now() - 3600000),
    },
    {
      id: "3",
      name: "Ana Martinez",
      email: "ana.martinez@tonder.mx",
      role: "analyst",
      lastActive: new Date(Date.now() - 86400000),
    },
  ]);

  const roleColors = {
    coo: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
    admin: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    analyst: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-muted-foreground">
          Manage your dashboard preferences and account settings
        </p>
      </div>

      <Tabs defaultValue="notifications" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="dashboard">
            <Palette className="h-4 w-4 mr-2" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="h-4 w-4 mr-2" />
            Users
          </TabsTrigger>
          <TabsTrigger value="api">
            <Database className="h-4 w-4 mr-2" />
            API
          </TabsTrigger>
        </TabsList>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Notification Preferences
              </CardTitle>
              <CardDescription>
                Configure when and how you receive email notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-alerts">Email Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive alerts via email
                    </p>
                  </div>
                  <Switch
                    id="email-alerts"
                    checked={notifications.emailAlerts}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, emailAlerts: checked })
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="critical-alerts">Critical Alerts Only</Label>
                    <p className="text-sm text-muted-foreground">
                      Only notify for critical severity alerts
                    </p>
                  </div>
                  <Switch
                    id="critical-alerts"
                    checked={notifications.criticalAlerts}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, criticalAlerts: checked })
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="daily-digest">Daily Digest</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive a daily summary of activity
                    </p>
                  </div>
                  <Switch
                    id="daily-digest"
                    checked={notifications.dailyDigest}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, dailyDigest: checked })
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="weekly-report">Weekly Report</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive a weekly analytics report
                    </p>
                  </div>
                  <Switch
                    id="weekly-report"
                    checked={notifications.weeklyReport}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, weeklyReport: checked })
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="transaction-alerts">Transaction Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify for large or unusual transactions
                    </p>
                  </div>
                  <Switch
                    id="transaction-alerts"
                    checked={notifications.transactionAlerts}
                    onCheckedChange={(checked) =>
                      setNotifications({
                        ...notifications,
                        transactionAlerts: checked,
                      })
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="withdrawal-alerts">Withdrawal Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify when withdrawals require attention
                    </p>
                  </div>
                  <Switch
                    id="withdrawal-alerts"
                    checked={notifications.withdrawalAlerts}
                    onCheckedChange={(checked) =>
                      setNotifications({
                        ...notifications,
                        withdrawalAlerts: checked,
                      })
                    }
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button>
                  <Save className="h-4 w-4 mr-2" />
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Dashboard Settings
              </CardTitle>
              <CardDescription>
                Customize your dashboard experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="refresh-interval">Auto-refresh Interval</Label>
                  <Select
                    value={dashboard.refreshInterval}
                    onValueChange={(value) =>
                      setDashboard({ ...dashboard, refreshInterval: value })
                    }
                  >
                    <SelectTrigger id="refresh-interval">
                      <SelectValue placeholder="Select interval" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 seconds</SelectItem>
                      <SelectItem value="30">30 seconds</SelectItem>
                      <SelectItem value="60">1 minute</SelectItem>
                      <SelectItem value="300">5 minutes</SelectItem>
                      <SelectItem value="0">Manual only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="default-page">Default Landing Page</Label>
                  <Select
                    value={dashboard.defaultPage}
                    onValueChange={(value) =>
                      setDashboard({ ...dashboard, defaultPage: value })
                    }
                  >
                    <SelectTrigger id="default-page">
                      <SelectValue placeholder="Select page" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="overview">Overview</SelectItem>
                      <SelectItem value="transactions">Transactions</SelectItem>
                      <SelectItem value="withdrawals">Withdrawals</SelectItem>
                      <SelectItem value="revenue">Revenue</SelectItem>
                      <SelectItem value="alerts">Alerts</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Separator />
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="compact-mode">Compact Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Use smaller spacing and fonts for more data density
                    </p>
                  </div>
                  <Switch
                    id="compact-mode"
                    checked={dashboard.compactMode}
                    onCheckedChange={(checked) =>
                      setDashboard({ ...dashboard, compactMode: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="animations">Animations</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable smooth transitions and animations
                    </p>
                  </div>
                  <Switch
                    id="animations"
                    checked={dashboard.showAnimations}
                    onCheckedChange={(checked) =>
                      setDashboard({ ...dashboard, showAnimations: checked })
                    }
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button>
                  <Save className="h-4 w-4 mr-2" />
                  Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                User Management
              </CardTitle>
              <CardDescription>
                Manage team members and their access levels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 rounded-lg border"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-medium">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge className={roleColors[user.role]}>
                        {user.role.toUpperCase()}
                      </Badge>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">
                          Last active
                        </p>
                        <p className="text-sm">
                          {user.lastActive.toLocaleDateString()}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <Button>
                  <Users className="h-4 w-4 mr-2" />
                  Invite User
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Tab */}
        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                API Configuration
              </CardTitle>
              <CardDescription>
                Manage API keys and integration settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label>API Key</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      type="password"
                      value="sk_live_xxxxxxxxxxxxxxxxxxxx"
                      readOnly
                      className="font-mono"
                    />
                    <Button variant="outline">Copy</Button>
                    <Button variant="outline">Regenerate</Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Use this key to authenticate API requests
                  </p>
                </div>
                <Separator />
                <div>
                  <Label>Webhook URL</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      placeholder="https://your-domain.com/webhooks/tonder"
                      className="font-mono"
                    />
                    <Button variant="outline">Test</Button>
                    <Button>Save</Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Receive real-time notifications about events
                  </p>
                </div>
                <Separator />
                <div>
                  <Label>MongoDB Connection Status</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-sm text-green-600">Connected</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Database is healthy and responding
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
