
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import ImageKit from "imagekit";
// SDK initialization


const imagekit = new ImageKit({
    publicKey : process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!! as string, // Public key is safe to expose on client side
    privateKey : process.env.IMAGEKIT_PRIVATE_KEY!! as string, // Private key should never be exposed on client side
    urlEndpoint :process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!! as string, // URL endpoint is safe to expose on client side 
});


export async function GET() {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get authentication parameters from ImageKit
    const authParams = imagekit.getAuthenticationParameters();
    console.log("Generated ImageKit auth params:", authParams);
    
    return NextResponse.json(authParams);
  } catch (error) {
    console.error("Error generating ImageKit auth params:", error);
    return NextResponse.json(
      { error: "Failed to generate authentication parameters" },
      { status: 500 }
    );
  }
}
