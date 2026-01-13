import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Withdrawal } from "@/models";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status");
    const merchantId = searchParams.get("merchantId");

    // Build query
    const query: Record<string, unknown> = {};

    if (status) {
      query.status = status;
    }

    if (merchantId) {
      query.merchantId = merchantId;
    }

    const skip = (page - 1) * limit;

    const [withdrawals, total, stats] = await Promise.all([
      Withdrawal.find(query)
        .sort({ requestedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Withdrawal.countDocuments(query),
      Withdrawal.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
            totalAmount: { $sum: "$amount" },
          },
        },
      ]),
    ]);

    // Format stats
    const statsFormatted: Record<string, { count: number; amount: number }> = {};
    stats.forEach((s: { _id: string; count: number; totalAmount: number }) => {
      statsFormatted[s._id] = {
        count: s.count,
        amount: s.totalAmount,
      };
    });

    return NextResponse.json({
      withdrawals,
      stats: statsFormatted,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching withdrawals:", error);
    return NextResponse.json(
      { error: "Failed to fetch withdrawals" },
      { status: 500 }
    );
  }
}
