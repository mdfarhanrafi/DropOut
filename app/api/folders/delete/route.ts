import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import ImageKit from "imagekit";

// Initialize ImageKit
const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "",
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "",
});

// Recursive delete function
async function deleteFolderAndContents(folderId: string, userId: string) {
  // Find all children
  const children = await db
    .select()
    .from(files)
    .where(and(eq(files.parentId, folderId), eq(files.userId, userId)));

  for (const child of children) {
    if (child.isFolder) {
      await deleteFolderAndContents(child.id, userId);
    } else {
      // Delete from ImageKit if filePath exists
      if (child.path) {
        try {
          await imagekit.deleteFile(child.path);
        } catch (e) {
          console.warn("Failed to delete from ImageKit:", e);
        }
      }
      await db.delete(files).where(eq(files.id, child.id));
    }
  }
  // Delete the folder itself
  await db.delete(files).where(eq(files.id, folderId));
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { folderId } = await request.json();
    if (!folderId) {
      return NextResponse.json({ error: "Missing folderId" }, { status: 400 });
    }

    // Check folder exists and belongs to user
    const [folder] = await db
      .select()
      .from(files)
      .where(and(eq(files.id, folderId), eq(files.userId, userId), eq(files.isFolder, true)));

    if (!folder) {
      return NextResponse.json({ error: "Folder not found" }, { status: 404 });
    }

    await deleteFolderAndContents(folderId, userId);

    return NextResponse.json({ success: true, message: "Folder and contents deleted" });
  } catch (error) {
    console.error("Error deleting folder:", error);
    return NextResponse.json({ error: "Failed to delete folder" }, { status: 500 });
  }
}