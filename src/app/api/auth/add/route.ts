import Note from "@/models/noteModels";
import { NextResponse, NextRequest } from "next/server";
import connectDB from "@/lib/connectdb";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers"; // Import the cookies function

export async function POST(req: NextRequest) {
  try {
    await connectDB();


   
    const cookieStore = await cookies(); // Add 'await' here
    const token = cookieStore.get("token")?.value; // Access the token value

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized: Token not found" },
        { status: 401 }
      );
    }

    // Manually verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; email: string };

    console.log("Decoded Token:", decoded);

    const { title, description } = await req.json();

    if (!title || !description) {
      return NextResponse.json(
        { error: "Please fill all fields" },
        { status: 400 }
      );
    }

    // Use `decoded.id` for the user ID
    const newNote = new Note({ title, description, createdBy: decoded.id });
    await newNote.save();

    return NextResponse.json(
      { message: "Saved successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Error saving note" },
      { status: 500 }
    );
  }
}