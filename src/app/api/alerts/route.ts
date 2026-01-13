import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Alert } from "@/models";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const severity = searchParams.get("severity");
    const isResolved = searchParams.get("isResolved");
    const type = searchParams.get("type");

    // Build query
    const query: Record<string, unknown> = {};

    if (severity) {
      query.severity = severity;
    }

    if (isResolved !== null) {
      query.isResolved = isResolved === "true";
    }

    if (type) {
      query.type = type;
    }

    const skip = (page - 1) * limit;

    const [alerts, total, unresolvedCount] = await Promise.all([
      Alert.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Alert.countDocuments(query),
      Alert.countDocuments({ isResolved: false }),
    ]);

    // Get counts by severity for unresolved alerts
    const severityCounts = await Alert.aggregate([
      { $match: { isResolved: false } },
      { $group: { _id: "$severity", count: { $sum: 1 } } },
    ]);

    const severityCountsFormatted: Record<string, number> = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
    };
    severityCounts.forEach((s: { _id: string; count: number }) => {
      severityCountsFormatted[s._id] = s.count;
    });

    return NextResponse.json({
      alerts,
      unresolvedCount,
      severityCounts: severityCountsFormatted,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching alerts:", error);
    return NextResponse.json(
      { error: "Failed to fetch alerts" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const { id, isRead, isResolved, resolvedAt } = body;

    if (!id) {
      return NextResponse.json({ error: "Alert ID is required" }, { status: 400 });
    }

    const updateData: Record<string, unknown> = {};
    if (typeof isRead === "boolean") {
      updateData.isRead = isRead;
    }
    if (typeof isResolved === "boolean") {
      updateData.isResolved = isResolved;
      if (isResolved) {
        updateData.resolvedAt = resolvedAt || new Date();
      }
    }

    const alert = await Alert.findByIdAndUpdate(id, updateData, { new: true });

    if (!alert) {
      return NextResponse.json({ error: "Alert not found" }, { status: 404 });
    }

    return NextResponse.json(alert);
  } catch (error) {
    console.error("Error updating alert:", error);
    return NextResponse.json(
      { error: "Failed to update alert" },
      { status: 500 }
    );
  }
}
