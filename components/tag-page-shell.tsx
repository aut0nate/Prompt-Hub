"use client";

import { LoaderCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { PromptCard } from "@/components/prompt-card";
import { PromptModal } from "@/components/prompt-modal";
import type { PromptListResult } from "@/lib/types";

type TagPageShellProps = {
  initialData: PromptListResult;
  tagName: string;
};

export function TagPageShell({ initialData, tagName }: TagPageShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [items, setItems] = useState(initialData.items);
  const [nextCursor, setNextCursor] = useState(initialData.nextCursor);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const promptSlug = searchParams.get("prompt");

  useEffect(() => {
    const node = loadMoreRef.current;

    if (!node || !nextCursor || isLoadingMore) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];

        if (firstEntry?.isIntersecting) {
          setIsLoadingMore(true);

          const params = new URLSearchParams();
          params.set("tags", tagName);
          params.set("cursor", nextCursor);

          fetch(`/api/prompts?${params.toString()}`, {
            cache: "no-store",
          })
            .then(async (response) => {
              if (!response.ok) {
                throw new Error("Could not load more prompts.");
              }

              return (await response.json()) as PromptListResult;
            })
            .then((data) => {
              setItems((current) => [...current, ...data.items]);
              setNextCursor(data.nextCursor);
            })
            .catch(() => {
              setErrorMessage("Related prompts could not be loaded just now.");
            })
            .finally(() => {
              setIsLoadingMore(false);
            });
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [isLoadingMore, nextCursor, tagName]);

  function openPrompt(slug: string) {
    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.set("prompt", slug);
    router.replace(`${pathname}?${nextParams.toString()}`, { scroll: false });
  }

  function closePrompt() {
    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.delete("prompt");
    router.replace(nextParams.size ? `${pathname}?${nextParams.toString()}` : pathname, { scroll: false });
  }

  return (
    <>
      <div className={promptSlug ? "pointer-events-none blur-md transition" : "transition"}>
        {errorMessage ? (
          <div className="status-error mb-6 rounded-[1.5rem] px-5 py-4 text-sm">
            {errorMessage}
          </div>
        ) : null}

        {items.length === 0 ? (
          <section className="rounded-[2rem] border border-dashed border-line/70 bg-panel/50 px-6 py-16 text-center">
            <h2 className="text-2xl font-semibold">No prompts found for this tag</h2>
            <p className="mt-3 text-sm leading-7 text-foreground/70">
              Try a different tag from the library, or add more prompts in the admin area.
            </p>
          </section>
        ) : (
          <>
            <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {items.map((prompt) => (
                <PromptCard key={prompt.id} prompt={prompt} onOpen={openPrompt} />
              ))}
            </section>

            <div ref={loadMoreRef} className="flex min-h-20 items-center justify-center">
              {isLoadingMore ? (
                <span className="inline-flex items-center gap-2 text-sm text-muted">
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Loading more prompts…
                </span>
              ) : null}
            </div>

            {!nextCursor ? (
              <p className="mt-4 text-center text-sm font-medium text-muted">You have reached the end of the page</p>
            ) : null}
          </>
        )}
      </div>

      <PromptModal slug={promptSlug} onClose={closePrompt} />
    </>
  );
}
