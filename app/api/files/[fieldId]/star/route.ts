import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { and,eq } from "drizzle-orm";


export async function PATCH(request: Request, props:{params:Promise<{fieldId:string}>}) {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { fieldId } = await props.params;
    if (!fieldId) {
      return NextResponse.json({ error: "File ID is required" }, { status: 400 });
    }
    
    const [file]= await db.select().from(files).where(and(
      eq(files.id, fieldId),
      eq(files.userId, userId)
    ));
    
    if(!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }
    // Toggle the star status
    const updatedFiles = await db
      .update(files)
      .set({ isStarred: !file.isStarred })
      .where(and(eq(files.id, fieldId), eq(files.userId, userId))).returning();
    
      // console.log("Updated files:", updatedFiles);
  
    const updatedFile = updatedFiles[0];      
    
    return NextResponse.json(updatedFile, { status: 200 });
 
  } catch (error) {
    console.error("Error updating file star status:", error);
    return NextResponse.json(
      { error: "Failed to update file star status" },
      { status: 500 }
    );
  }




}