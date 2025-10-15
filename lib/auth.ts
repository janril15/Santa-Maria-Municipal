import { NextRequest } from "next/server";
import { prisma } from "./prisma";

interface AuthResult {
  success: boolean;
  user?: any;
  error?: string;
  status?: number;
}

export async function authenticateAdmin(request: NextRequest): Promise<AuthResult> {
  try {
    // Get authorization header
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      return { success: false, error: 'No token provided', status: 401 };
    }

    // In a real app, you'd verify JWT here
    // For now, we'll check if user exists and is admin
    const user = await prisma.user.findFirst({
      where: { 
        email: token, // Using email as simple token for demo
        role: 'admin' 
      }
    });

    if (!user) {
      return { success: false, error: 'Invalid or expired token', status: 401 };
    }

    return { success: true, user };
  } catch (error) {
    return { success: false, error: 'Authentication failed', status: 500 };
  }
}