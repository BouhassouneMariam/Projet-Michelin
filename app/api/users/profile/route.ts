import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/auth";
import { updateUserProfile } from "@/features/users/user.service";
import { Prisma } from "@prisma/client";

export async function PATCH(request: NextRequest) {
  try {
    const userId = getCurrentUserId();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, username, bio, avatarUrl } = body;

    const updated = await updateUserProfile(userId, {
      name: name !== undefined ? name : undefined,
      username: username !== undefined ? username : undefined,
      bio: bio !== undefined ? bio : undefined,
      avatarUrl: avatarUrl !== undefined ? avatarUrl : undefined,
    });

    if (!updated) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating profile:", error);
    
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "Username already exists" },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
