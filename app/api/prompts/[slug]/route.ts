import { NextResponse } from "next/server";

import { isAuthenticated } from "@/lib/auth";
import { getPromptBySlug } from "@/lib/prompts";

export const dynamic = "force-dynamic";

type PromptDetailRouteProps = {
  params: Promise<{ slug: string }>;
};

export async function GET(_: Request, { params }: PromptDetailRouteProps) {
  const { slug } = await params;
  const prompt = await getPromptBySlug(slug, await isAuthenticated());

  if (!prompt) {
    return NextResponse.json({ message: "Prompt not found." }, { status: 404 });
  }

  return NextResponse.json({ prompt });
}
