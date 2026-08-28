import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/middleware/mongodb";
import { Banner } from "@/models/Banner";

export async function GET(request: NextRequest) {
  try {
    await connectDb();
    const { searchParams } = new URL(request.url);
    const placement = searchParams.get("placement");

    const query: any = { isActive: true };
    if (placement) {
      query.placement = placement;
    }

    const banners = await Banner.find(query)
      .sort({ displayOrder: 1, createdAt: -1 })
      .lean();

    return NextResponse.json(
      { success: true, banners },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message, banners: [] }, { status: 500 });
  }
}
