// app/api/auth/signup/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/connectdb";
import User from "@/models/UserModel";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    // Log the incoming request payload
    const payload = await req.json();
    console.log("Received request payload:", payload);

    // Validate the request payload
    if (!payload.name || !payload.email || !payload.password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await connectDB();
    console.log("Connected to MongoDB");

    // Extract data from the request
    const { name, email, password } = payload;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    console.log(existingUser);
    if (existingUser) {
      console.log("User already exists:", email);
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Password hashed successfully");

    // Create and save the new user
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    console.log("User created successfully:", newUser);

    // Return success response
    return NextResponse.json(
      { message: "User created successfully", user: { name, email } },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error during signup:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}