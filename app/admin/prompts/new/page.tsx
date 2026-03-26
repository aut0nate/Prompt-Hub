import { createPromptAction } from "@/app/admin/actions";
import { AdminPromptForm } from "@/components/admin-prompt-form";

export default function NewPromptPage() {
  return (
    <section className="space-y-4">
      <div>
        <p className="text-sm uppercase tracking-[0.28em] text-muted">Create prompt</p>
        <h2 className="mt-3 text-3xl font-semibold">Add a new prompt to Prompt Hub</h2>
      </div>

      <AdminPromptForm action={createPromptAction} submitLabel="Save prompt" />
    </section>
  );
}
