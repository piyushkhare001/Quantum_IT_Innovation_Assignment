import {User} from "@/app/model/User";  
import {  NextResponse } from "next/server";

import dbConnect from "@/app/lib/dbConnect"; 

export async function GET() {
  try {
    dbConnect()
    const users = await User.find().sort({ createdAt: -1 });

    return NextResponse.json({
      data: users,
    });
  } catch (error) {
    return NextResponse.json({ message: "Error fetching courses", error }, { status: 500 });
  }
}
