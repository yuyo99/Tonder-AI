import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Transaction } from "@/models";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get("period") || "day"; // day, week, month

    const now = new Date();
    let startDate: Date;

    switch (period) {
      case "week":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "month":
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }

    const [generalStats, failedBreakdown, paymentMethodDistribution, hourlyVolume] = await Promise.all([
      // General statistics
      Transaction.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        {
          $group: {
            _id: null,
            totalTransactions: { $sum: 1 },
            totalAmount: { $sum: "$amount" },
            successfulTransactions: {
              $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
            },
            avgAmount: { $avg: "$amount" },
          },
        },
      ]),

      // Failed transactions breakdown by error code
      Transaction.aggregate([
        { $match: { createdAt: { $gte: startDate }, status: "failed" } },
        { $group: { _id: "$errorCode", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),

      // Payment method distribution
      Transaction.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        {
          $group: {
            _id: "$paymentMethod",
            count: { $sum: 1 },
            totalAmount: { $sum: "$amount" },
          },
        },
        { $sort: { count: -1 } },
      ]),

      // Hourly volume (last 24 hours)
      Transaction.aggregate([
        { $match: { createdAt: { $gte: new Date(now.getTime() - 24 * 60 * 60 * 1000) } } },
        {
          $group: {
            _id: { $hour: "$createdAt" },
            count: { $sum: 1 },
            amount: { $sum: "$amount" },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    const stats = generalStats[0] || {
      totalTransactions: 0,
      totalAmount: 0,
      successfulTransactions: 0,
      avgAmount: 0,
    };

    const successRate = stats.totalTransactions > 0
      ? (stats.successfulTransactions / stats.totalTransactions) * 100
      : 100;

    // Format failed breakdown
    const failedBreakdownFormatted: Record<string, number> = {};
    failedBreakdown.forEach((item: { _id: string; count: number }) => {
      if (item._id) {
        failedBreakdownFormatted[item._id] = item.count;
      }
    });

    // Format payment method distribution
    const totalTransactions = stats.totalTransactions || 1;
    const paymentMethodDistributionFormatted = paymentMethodDistribution.map(
      (item: { _id: string; count: number; totalAmount: number }) => ({
        method: item._id,
        count: item.count,
        percentage: Math.round((item.count / totalTransactions) * 100),
        amount: item.totalAmount,
      })
    );

    // Format hourly volume
    const volumeOverTime = hourlyVolume.map((item: { _id: number; count: number; amount: number }) => ({
      hour: item._id,
      count: item.count,
      amount: item.amount,
    }));

    return NextResponse.json({
      totalTransactions: stats.totalTransactions,
      successRate: Math.round(successRate * 10) / 10,
      averageTicket: Math.round(stats.avgAmount * 100) / 100,
      failedBreakdown: failedBreakdownFormatted,
      paymentMethodDistribution: paymentMethodDistributionFormatted,
      volumeOverTime,
    });
  } catch (error) {
    console.error("Error fetching transaction stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch transaction stats" },
      { status: 500 }
    );
  }
}
