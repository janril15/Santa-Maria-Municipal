import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Use shared client
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const user = await prisma.user.findUnique({ // Use shared prisma
      where: { email },
    });

    if (!user) {
      console.log("❌ User not found:", email);
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    console.log("👤 User found, role:", user.role);

    // ✅ COMPARE PASSWORDS
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log("❌ Invalid password for:", email);
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    console.log("✅ Password valid, returning role:", user.role.toUpperCase());

    // ✅ Force return role in UPPERCASE
    return NextResponse.json(
      { 
        message: "Login successful", 
        role: user.role.toUpperCase() // Force uppercase
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}