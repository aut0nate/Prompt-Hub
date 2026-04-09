"use client";

import { formatDistanceToNow } from "date-fns";
import { Sparkles, Star } from "lucide-react";

import type { PromptCardRecord } from "@/lib/types";
import { cn, formatPromptType } from "@/lib/utils";

type PromptCardProps = {
  prompt: PromptCardRecord;
  onOpen: (slug: string) => void;
};

export function PromptCard({ prompt, onOpen }: PromptCardProps) {
  return (
    <button
      type="button"
      onClick={() => onOpen(prompt.slug)}
      data-testid="prompt-card"
      className={cn(
        "group flex h-full flex-col rounded-[1.75rem] border border-line/70 bg-panel/80 p-5 text-left shadow-[0_20px_70px_rgba(0,0,0,0.06)] transition duration-300 hover:-translate-y-1 hover:border-accent/60 hover:shadow-glow",
        prompt.isFavourite && "border-accent/70 bg-accentSoft/50",
      )}
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-muted">
            <span>{prompt.category}</span>
            {prompt.isFavourite ? (
              <span className="inline-flex items-center gap-1 text-[rgb(var(--accent))]">
                <Star className="h-3.5 w-3.5 fill-current" />
                Favourite
              </span>
            ) : null}
          </div>
          <h3 className="text-xl font-semibold leading-tight text-foreground">{prompt.title}</h3>
        </div>
        <span className="rounded-full border border-line/80 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-muted">
          {formatPromptType(prompt.type)}
        </span>
      </div>

      <p className="mb-5 text-sm leading-7 text-foreground/72">{prompt.summary}</p>

      <div
        data-testid="prompt-card-preview"
        className="mb-5 rounded-[1.4rem] border border-line/60 bg-black/10 p-4 font-mono text-sm leading-7 text-foreground/78 dark:bg-white/5"
      >
        <div className="line-clamp-6 whitespace-pre-wrap">{prompt.previewSnippet}</div>
      </div>

      <div className="mt-auto space-y-4">
        <div className="flex flex-wrap gap-2">
          {prompt.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-line/70 bg-background/60 px-3 py-1 text-xs font-medium text-foreground/70"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between text-sm text-muted">
          <span>{formatDistanceToNow(new Date(prompt.createdAt), { addSuffix: true })}</span>
          <span className="inline-flex items-center gap-2 transition group-hover:text-accent">
            <Sparkles className="h-4 w-4" />
            Open prompt
          </span>
        </div>
      </div>
    </button>
  );
}
