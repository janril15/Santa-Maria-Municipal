import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticateAdmin } from "@/lib/auth";

// GET - Public access (anyone can read announcements)
export async function GET() {
  try {
    const announcements = await prisma.post.findMany({
      include: {
        author: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return NextResponse.json(announcements);
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return NextResponse.json(
      { error: "Failed to fetch announcements" },
      { status: 500 }
    );
  }
}

// POST - Admin only (create announcements)
export async function POST(request: NextRequest) {
  try {
    // Authenticate admin
    const auth = await authenticateAdmin(request);
    if (!auth.success || !auth.user) {
      return NextResponse.json(
        { error: auth.error || "Authentication failed" },
        { status: auth.status || 401 }
      );
    }

    const { title, content, image, category } = await request.json();
    
    console.log("📝 Creating announcement by admin:", auth.user.email);

    const announcement = await prisma.post.create({
      data: {
        title,
        content,
        image: image || "/images/default-announcement.jpg",
        category: category || "General",
        excerpt: content.substring(0, 150) + (content.length > 150 ? "..." : ""),
        readTime: `${Math.ceil(content.length / 200)} min read`,
        date: new Date().toLocaleDateString('en-US', { 
          month: 'long', 
          day: 'numeric', 
          year: 'numeric' 
        }),
        authorId: auth.user.id
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

    console.log("✅ Announcement created successfully:", announcement.id);
    
    return NextResponse.json(
      { message: "Announcement created successfully", announcement },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Error creating announcement:", error);
    return NextResponse.json(
      { error: "Failed to create announcement" },
      { status: 500 }
    );
  }
}