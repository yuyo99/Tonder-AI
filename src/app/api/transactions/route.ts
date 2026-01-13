import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Transaction } from "@/models";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status");
    const paymentMethod = searchParams.get("paymentMethod");
    const merchantId = searchParams.get("merchantId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const minAmount = searchParams.get("minAmount");
    const maxAmount = searchParams.get("maxAmount");

    // Build query
    const query: Record<string, unknown> = {};

    if (status) {
      query.status = status;
    }

    if (paymentMethod) {
      query.paymentMethod = paymentMethod;
    }

    if (merchantId) {
      query.merchantId = merchantId;
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        (query.createdAt as Record<string, Date>).$gte = new Date(startDate);
      }
      if (endDate) {
        (query.createdAt as Record<string, Date>).$lte = new Date(endDate);
      }
    }

    if (minAmount || maxAmount) {
      query.amount = {};
      if (minAmount) {
        (query.amount as Record<string, number>).$gte = parseFloat(minAmount);
      }
      if (maxAmount) {
        (query.amount as Record<string, number>).$lte = parseFloat(maxAmount);
      }
    }

    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      Transaction.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Transaction.countDocuments(query),
    ]);

    return NextResponse.json({
      transactions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}
