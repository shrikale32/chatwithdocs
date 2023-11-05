import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(req: Request, res: Response) {
  try {
    const { userId } = await auth();
    return NextResponse.json(
      {
        userId: userId,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "internal server error" },
      { status: 500 }
    );
  }
}
