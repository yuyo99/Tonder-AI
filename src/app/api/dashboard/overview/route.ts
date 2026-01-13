import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Transaction, Withdrawal, Merchant, Alert } from "@/models";

export async function GET() {
  try {
    await connectToDatabase();

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);

    // Get TPV and transaction stats
    const [todayStats, weekStats, monthStats, yesterdayStats] = await Promise.all([
      Transaction.aggregate([
        { $match: { createdAt: { $gte: startOfToday } } },
        {
          $group: {
            _id: null,
            totalVolume: { $sum: "$amount" },
            totalTransactions: { $sum: 1 },
            successfulTransactions: {
              $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
            },
            failedTransactions: {
              $sum: { $cond: [{ $eq: ["$status", "failed"] }, 1, 0] },
            },
            totalFees: { $sum: "$fee" },
            avgProcessingTime: { $avg: "$processingTime" },
          },
        },
      ]),
      Transaction.aggregate([
        { $match: { createdAt: { $gte: startOfWeek } } },
        { $group: { _id: null, totalVolume: { $sum: "$amount" } } },
      ]),
      Transaction.aggregate([
        { $match: { createdAt: { $gte: startOfMonth } } },
        { $group: { _id: null, totalVolume: { $sum: "$amount" } } },
      ]),
      Transaction.aggregate([
        { $match: { createdAt: { $gte: startOfYesterday, $lt: startOfToday } } },
        { $group: { _id: null, totalVolume: { $sum: "$amount" } } },
      ]),
    ]);

    const todayData = todayStats[0] || {
      totalVolume: 0,
      totalTransactions: 0,
      successfulTransactions: 0,
      failedTransactions: 0,
      totalFees: 0,
      avgProcessingTime: 0,
    };
    const weekVolume = weekStats[0]?.totalVolume || 0;
    const monthVolume = monthStats[0]?.totalVolume || 0;
    const yesterdayVolume = yesterdayStats[0]?.totalVolume || 0;

    // Calculate change percent
    const changePercent = yesterdayVolume > 0
      ? ((todayData.totalVolume - yesterdayVolume) / yesterdayVolume) * 100
      : 0;

    // Calculate success rate
    const successRate = todayData.totalTransactions > 0
      ? (todayData.successfulTransactions / todayData.totalTransactions) * 100
      : 100;

    // Get merchant count
    const [merchantStats] = await Merchant.aggregate([
      { $match: { status: "active" } },
      { $group: { _id: null, count: { $sum: 1 } } },
    ]);

    // Get pending withdrawals
    const [pendingWithdrawals] = await Withdrawal.aggregate([
      { $match: { status: { $in: ["pending", "processing"] } } },
      { $group: { _id: null, count: { $sum: 1 }, amount: { $sum: "$amount" } } },
    ]);

    // Get unread alerts count
    const unresolvedAlerts = await Alert.countDocuments({ isResolved: false });

    const overview = {
      tpv: {
        today: todayData.totalVolume,
        thisWeek: weekVolume,
        thisMonth: monthVolume,
        changePercent: Math.round(changePercent * 10) / 10,
      },
      successRate: {
        value: Math.round(successRate * 10) / 10,
        trend: successRate >= 95 ? "up" : "down",
        target: 95,
      },
      transactions: {
        total: todayData.totalTransactions,
        successful: todayData.successfulTransactions,
        failed: todayData.failedTransactions,
      },
      revenue: {
        total: todayData.totalFees,
        fees: todayData.totalFees,
      },
      merchants: {
        active: merchantStats?.count || 0,
        growth: 8, // This would be calculated from historical data
      },
      processingTime: {
        average: Math.round(todayData.avgProcessingTime || 0),
        trend: "stable",
      },
      pendingWithdrawals: {
        count: pendingWithdrawals?.count || 0,
        amount: pendingWithdrawals?.amount || 0,
      },
      unresolvedAlerts,
    };

    return NextResponse.json(overview);
  } catch (error) {
    console.error("Error fetching dashboard overview:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard overview" },
      { status: 500 }
    );
  }
}
