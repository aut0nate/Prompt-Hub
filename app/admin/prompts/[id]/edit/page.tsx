import { notFound } from "next/navigation";

import { updatePromptAction } from "@/app/admin/actions";
import { AdminPromptForm } from "@/components/admin-prompt-form";
import { getPromptById } from "@/lib/prompts";

type EditPromptPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditPromptPage({ params }: EditPromptPageProps) {
  const { id } = await params;
  const prompt = await getPromptById(id);

  if (!prompt) {
    notFound();
  }

  return (
    <section className="space-y-4">
      <div>
        <p className="text-sm uppercase tracking-[0.28em] text-muted">Edit prompt</p>
        <h2 className="mt-3 text-3xl font-semibold">{prompt.title}</h2>
      </div>

      <AdminPromptForm action={updatePromptAction.bind(null, id)} prompt={prompt} submitLabel="Update prompt" />
    </section>
  );
}
