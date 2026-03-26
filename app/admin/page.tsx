import Link from "next/link";
import { format } from "date-fns";

import { deletePromptAction, toggleFavouriteAction } from "@/app/admin/actions";
import { DeletePromptButton } from "@/components/delete-prompt-button";
import { FavouriteToggleButton } from "@/components/favourite-toggle-button";
import { prisma } from "@/lib/prisma";

export default async function AdminPage() {
  const prompts = await prisma.prompt.findMany({
    include: {
      tags: {
        include: {
          tag: true,
        },
      },
    },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
  });

  return (
    <section className="space-y-5">
      {prompts.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-line/70 bg-panel/60 px-6 py-16 text-center">
          <h2 className="text-2xl font-semibold">No prompts yet</h2>
          <p className="mt-3 text-sm leading-7 text-foreground/72">
            Add your first prompt to start building your personal library.
          </p>
        </div>
      ) : (
        prompts.map((prompt) => (
          <article
            key={prompt.id}
            className="rounded-[2rem] border border-line/70 bg-panel/75 p-6 shadow-[0_20px_70px_rgba(0,0,0,0.05)]"
          >
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-4">
                <div>
                  <div className="mb-2 flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.22em] text-muted">
                    <span>{prompt.category}</span>
                    <span>{prompt.type.toLowerCase()}</span>
                    <span>{format(prompt.createdAt, "d MMM yyyy")}</span>
                  </div>
                  <h2 className="text-2xl font-semibold">{prompt.title}</h2>
                  <p className="mt-2 max-w-3xl text-sm leading-7 text-foreground/72">{prompt.summary}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {prompt.tags.map(({ tag }) => (
                    <span
                      key={tag.id}
                      className="rounded-full border border-line/70 bg-background/60 px-3 py-1 text-xs font-medium text-foreground/70"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-3 lg:justify-end">
                <Link
                  href={`/admin/prompts/${prompt.id}/edit`}
                  className="rounded-full border border-line/70 px-4 py-2 text-sm font-medium transition hover:border-accent/60 hover:text-accent"
                >
                  Edit
                </Link>
                <FavouriteToggleButton
                  action={toggleFavouriteAction.bind(null, prompt.id)}
                  isFavourite={prompt.isFavourite}
                />
                <DeletePromptButton action={deletePromptAction.bind(null, prompt.id)} />
              </div>
            </div>
          </article>
        ))
      )}
    </section>
  );
}
