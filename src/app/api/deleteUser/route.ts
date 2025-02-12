import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import { User } from "@/app/model/User";
import { authOptions } from "@/app/lib/auth";
import { getServerSession } from "next-auth/next";

export async function DELETE(req: Request) {
  try {
    // Get the session
    const session = await getServerSession(authOptions);

    // Check if the user is logged in and is an admin
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized access. Admins only." },
        { status: 403 }
      );
    }

    // Parse request body
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json(
        { success: false, message: "User email is required for deletion." },
        { status: 400 }
      );
    }

    // Connect to database
    await dbConnect();

    // Delete the user
    const deletedUser = await User.findOneAndDelete({ email });

    if (!deletedUser) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "User deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { success: false, message: "Server error. Please try again." },
      { status: 500 }
    );
  }
}
