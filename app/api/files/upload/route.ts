import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import ImageKit from "imagekit";
import { v4 as uuidv4 } from "uuid";

// Initialize ImageKit with your credentials
const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "",
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "",
});

export async function POST(request: NextRequest) {
   try {
     const { userId } = await auth();
     if (!userId) {
       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
     }
     const formData = await request.formData();
    // console.log("Form Data:", formData);
     
     const file = formData.get("file") as File;
     const parentId = formData.get("parentId") as string | null;
     const formUserId = formData.get("userId") as string;
     let parentFolderName= "";
     if(formUserId !== userId) {
       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
     }
     if(!file || !(file instanceof File)) {
       return NextResponse.json({ error: "Invalid file upload" }, { status: 400 });
     }
     if(parentId){
       const [parentFolder]= await db
          .select()
            .from(files)
            .where(and(eq(files.id, parentId), eq(files.userId, userId), eq(files.isFolder, true)))
       if(!parentFolder) {
         return NextResponse.json({ error: "Parent folder not found" }, { status: 404 });
       }else{
         parentFolderName = parentFolder.name;
       } 
            
     }else {
        return NextResponse.json({ error: "Parent folder not found" }, { status: 404 });
     }

     if(!file.type.startsWith("image/") && file.type !== "application/pdf") {
       return NextResponse.json({ error: "Unsupported file type pdf and image only" }, { status: 400 });
     }

     const buffer = await file.arrayBuffer();
     const fileBuffer = Buffer.from(buffer);
     
     const originalFileName = file.name;
     const fileExtension = originalFileName.split('.').pop() || '';
     const uniqueFileName = `${uuidv4()}.${fileExtension}`;
     const folderPath  = parentId ? `/dropOut/${userId}/${parentFolderName}/${parentId}` : `/dropOut/${userId}`; 
     console.log("Folder Path:", folderPath);
     const uploadResponse = await imagekit.upload({
      file:fileBuffer,
      fileName: uniqueFileName,
      // folder: folderPath,
      useUniqueFileName: false,
     })
     const fileData = {
      name: originalFileName,
      path: uploadResponse.filePath,
      size: file.size,
      type: file.type,
      fileUrl: uploadResponse.url,
      thumbnailUrl: uploadResponse.thumbnailUrl || null,
      userId: userId,
      parentId: parentId,
      isFolder: false,
      isStarred: false,
      isTrash: false,

     }

     const [newFile] = await db.insert(files).values(fileData).returning();
     return NextResponse.json(newFile, { status: 201 });

     
     

   } catch (error) {
     
      console.error("Error uploading file:", error);
      return NextResponse.json({ error: "Failed to Upload file"}, { status: 500 });
   }
    

}


