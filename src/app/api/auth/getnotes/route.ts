import Note from '@/models/noteModels';
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/connectdb';

export async function GET() {
  await connectDB(); // Ensure database connection is awaited

  try {
    const cookieStore =  await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "You are not logged in" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    const notes = await Note.find({ createdBy: decoded.id });

    return NextResponse.json({ notes }, { status: 200 });
  } catch (error) {
    console.error(error); // Logs the error directly
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
