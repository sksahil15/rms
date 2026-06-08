import { NextResponse } from "next/server";
import connectDB from "@/lib/db"; // ← @/lib/db
import Family from "@/lib/models/Family"; // ← @/lib/models/Family

export async function PATCH(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;
    const { lifted } = await request.json();

    // const updated = await Family.findByIdAndUpdate(
    //   id,
    //   { lifted },
      
    //   { returnDocument: "after" },
    // );
    const updated = await Family.findByIdAndUpdate(
      id,
      {
        lifted,
        status: lifted === true ? "complete" : "pending",
      },
      { returnDocument: "after" }
    );
    if (!updated) {
      return NextResponse.json({ error: "Family not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
    
  } catch (error) {
    console.error("PATCH error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
  
}

