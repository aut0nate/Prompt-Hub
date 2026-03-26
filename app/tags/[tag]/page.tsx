import Link from "next/link";
import { ArrowLeft, Circle } from "lucide-react";
import { notFound } from "next/navigation";

import { TagPageShell } from "@/components/tag-page-shell";
import { ThemeToggle } from "@/components/theme-toggle";
import { isAuthenticated } from "@/lib/auth";
import { getPromptList, getTagBySlug } from "@/lib/prompts";

type TagPageProps = {
  params: Promise<{ tag: string }>;
};

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params;
  const tagRecord = await getTagBySlug(tag);

  if (!tagRecord) {
    notFound();
  }

  const isAdmin = await isAuthenticated();
  const initialData = await getPromptList({ tags: tagRecord.name }, isAdmin);

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-10 md:px-8 md:py-12">
      <header className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-5">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-foreground/74 transition hover:text-accent"
          >
            <ArrowLeft className="h-4 w-4" />
            All prompts
          </Link>

          <div className="space-y-3">
            <div className="inline-flex items-center gap-3 text-foreground">
              <Circle className="h-3.5 w-3.5 fill-[rgb(var(--accent))] text-[rgb(var(--accent))]" />
              <h1 className="text-4xl font-semibold md:text-5xl">{tagRecord.name}</h1>
              <span className="text-base text-muted">{initialData.totalCount} prompts</span>
            </div>
            <p className="max-w-2xl text-base leading-8 text-foreground/72">
              Browse every prompt tagged with <span className="text-foreground">{tagRecord.name}</span> and open any
              one to copy the full content.
            </p>
          </div>
        </div>

        <ThemeToggle />
      </header>

      <TagPageShell initialData={initialData} tagName={tagRecord.name} />
    </main>
  );
}
