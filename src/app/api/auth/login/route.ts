import { NextResponse } from "next/server";
import connectDB from "@/lib/connectdb";
import User from "@/models/UserModel";
import jwt from 'jsonwebtoken'; // Correct import
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    console.log("Request received"); // ✅ Log request start

    const { email, password } = await req.json();
    if (!email || !password) {
      console.log("Missing email/password"); // ✅ Log missing fields
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    console.log("Connecting to DB...");
    await connectDB();
    console.log("Connected to DB"); // ✅ Log successful DB connection

    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found"); // ✅ Log if user is not found
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("Comparing password...");
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Invalid credentials"); // ✅ Log invalid password case
      return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
    }

    console.log("Generating token...");
    if (!process.env.JWT_SECRET) {
      console.log("JWT_SECRET is missing!"); // ✅ Log if JWT_SECRET is missing
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    console.log("Setting cookie...");
    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    console.log("Login successful");
    return NextResponse.json({ message: "Login successful" }, { status: 200 });

  } catch (error) {
    console.log("Error:", error); // ✅ Log actual error
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
