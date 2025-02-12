/* eslint-disable @typescript-eslint/no-explicit-any */
import dbConnect from "@/app/lib/dbConnect";
import { User } from "@/app/model/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, name, password, dob, role } =
      await req.json();
    if (!email || !name || !password || !dob || !role) {
      return NextResponse.json(
        { success: false, message: "All fields are required." },
        { status: 400 }
      );
    }
  await dbConnect();
   const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User already registered." },
        { status: 409 }
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
        dob,
        role
    });

    await newUser.save();

    return NextResponse.json(
      {
        user: newUser,
        success: true,
        message: "User registered successfully.",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating user:", error);

    if (error.name === "ValidationError") {
      return NextResponse.json(
        { success: false, message: "Validation error.", errors: error.errors },
        { status: 400 }
      );
    } else if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message: "Duplicate key error. Email already exists.",
        },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { success: false, message: "Server error. Please try again later." },
      { status: 500 }
    );
  }
}
