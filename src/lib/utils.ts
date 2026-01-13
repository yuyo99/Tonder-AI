import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency: string = "MXN"): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: currency,
  }).format(amount)
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("es-MX").format(num)
}

export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`
}

export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`
  return `${(ms / 1000).toFixed(2)}s`
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    completed: "text-green-600 bg-green-100",
    successful: "text-green-600 bg-green-100",
    active: "text-green-600 bg-green-100",
    pending: "text-yellow-600 bg-yellow-100",
    processing: "text-blue-600 bg-blue-100",
    failed: "text-red-600 bg-red-100",
    refunded: "text-orange-600 bg-orange-100",
    chargeback: "text-red-600 bg-red-100",
    cancelled: "text-gray-600 bg-gray-100",
    suspended: "text-red-600 bg-red-100",
    pending_review: "text-yellow-600 bg-yellow-100",
  }
  return colors[status] || "text-gray-600 bg-gray-100"
}

export function getSeverityColor(severity: string): string {
  const colors: Record<string, string> = {
    low: "text-blue-600 bg-blue-100 border-blue-200",
    medium: "text-yellow-600 bg-yellow-100 border-yellow-200",
    high: "text-orange-600 bg-orange-100 border-orange-200",
    critical: "text-red-600 bg-red-100 border-red-200",
  }
  return colors[severity] || "text-gray-600 bg-gray-100 border-gray-200"
}

export function generateTransactionId(): string {
  return `TXN-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
}

export function generateWithdrawalId(): string {
  return `WDL-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
}

export function maskBankAccount(account: string): string {
  if (account.length <= 4) return account
  return `****${account.slice(-4)}`
}
