import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/middleware/mongodb";
import { Banner } from "@/models/Banner";

// GET: Fetch all banners for admin
export async function GET(request: NextRequest) {
  try {
    await connectDb();
    const { searchParams } = new URL(request.url);
    const placement = searchParams.get("placement");

    const query: any = {};
    if (placement) {
      query.placement = placement;
    }

    const banners = await Banner.find(query).sort({ displayOrder: 1, createdAt: -1 });
    return NextResponse.json({ success: true, banners });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Create a new banner
export async function POST(request: NextRequest) {
  try {
    await connectDb();
    const body = await request.json();
    const { placement, image, title, subtitle, buttonText, linkUrl, displayOrder, isActive } = body;

    if (!image) {
      return NextResponse.json({ error: "Image URL is required" }, { status: 400 });
    }

    const newBanner = await Banner.create({
      placement: placement || "home-desktop",
      image,
      title: title || "",
      subtitle: subtitle || "",
      buttonText: buttonText || "",
      linkUrl: linkUrl || "",
      displayOrder: displayOrder !== undefined ? Number(displayOrder) : 0,
      isActive: isActive !== undefined ? Boolean(isActive) : true,
    });

    return NextResponse.json({ success: true, banner: newBanner });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT: Update banner
export async function PUT(request: NextRequest) {
  try {
    await connectDb();
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "Banner ID is required" }, { status: 400 });
    }

    const updatedBanner = await Banner.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: new Date() },
      { new: true }
    );

    return NextResponse.json({ success: true, banner: updatedBanner });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Delete banner
export async function DELETE(request: NextRequest) {
  try {
    await connectDb();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Banner ID is required" }, { status: 400 });
    }

    await Banner.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
