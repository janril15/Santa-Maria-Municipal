import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticateAdmin } from "@/lib/auth";

// GET - Public access (anyone can read single announcement)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid announcement ID" },
        { status: 400 }
      );
    }

    const announcement = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    if (!announcement) {
      return NextResponse.json(
        { error: "Announcement not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(announcement);
  } catch (error) {
    console.error("Error fetching announcement:", error);
    return NextResponse.json(
      { error: "Failed to fetch announcement" },
      { status: 500 }
    );
  }
}

// PUT - Admin only (update announcements)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authenticate admin
    const auth = await authenticateAdmin(request);
    if (!auth.success || !auth.user) {
      return NextResponse.json(
        { error: auth.error || "Authentication failed" },
        { status: auth.status || 401 }
      );
    }

    const id = parseInt(params.id);
    
    console.log("🔄 Updating announcement ID:", id, "by admin:", auth.user.email);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid announcement ID" },
        { status: 400 }
      );
    }

    const { title, content, image, category } = await request.json();
    
    console.log("📝 Update data:", { title, category });

    // Check if announcement exists
    const existingAnnouncement = await prisma.post.findUnique({
      where: { id }
    });

    if (!existingAnnouncement) {
      console.log("❌ Announcement not found:", id);
      return NextResponse.json(
        { error: "Announcement not found" },
        { status: 404 }
      );
    }

    const updatedAnnouncement = await prisma.post.update({
      where: { id },
      data: {
        title,
        content,
        image: image || "/images/default-announcement.jpg",
        category: category || "General",
        excerpt: content.substring(0, 150) + (content.length > 150 ? "..." : ""),
        readTime: `${Math.ceil(content.length / 200)} min read`,
      },
      include: {
        author: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    console.log("✅ Announcement updated successfully:", updatedAnnouncement.id);
    
    return NextResponse.json(
      { message: "Announcement updated successfully", announcement: updatedAnnouncement },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error updating announcement:", error);
    return NextResponse.json(
      { error: "Failed to update announcement" },
      { status: 500 }
    );
  }
}

// DELETE - Admin only
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authenticate admin
    const auth = await authenticateAdmin(request);
    if (!auth.success || !auth.user) {
      return NextResponse.json(
        { error: auth.error || "Authentication failed" },
        { status: auth.status || 401 }
      );
    }

    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid announcement ID" },
        { status: 400 }
      );
    }

    await prisma.post.delete({
      where: { id }
    });
    
    console.log("🗑️ Announcement deleted by admin:", auth.user.email);
    
    return NextResponse.json(
      { message: "Announcement deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting announcement:", error);
    return NextResponse.json(
      { error: "Failed to delete announcement" },
      { status: 500 }
    );
  }
}