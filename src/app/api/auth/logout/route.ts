import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const secret = process.env.NEXTAUTH_SECRET;

export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret });

  if (token) {
    // Perform any cleanup related to logging out, if needed
    console.log(`User with ID ${token.id} has logged out.`);
  }

  // Respond with a success message
  return NextResponse.json({ message: "Logged out successfully" });
}