import { NextResponse } from "next/server";

import { isAuthenticated } from "@/lib/auth";
import { getPromptList } from "@/lib/prompts";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const isAdmin = await isAuthenticated();
  const data = await getPromptList(Object.fromEntries(searchParams.entries()), isAdmin);

  return NextResponse.json(data);
}
