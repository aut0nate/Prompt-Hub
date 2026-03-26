"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { clearSessionCookie, requireAdmin } from "@/lib/auth";
import { ensureUniquePromptSlug } from "@/lib/prompts";
import { prisma } from "@/lib/prisma";
import type { PromptFormState } from "@/lib/types";
import { slugify } from "@/lib/utils";
import { promptFormSchema } from "@/lib/validation";

function validationError(message: string, errors?: PromptFormState["errors"]): PromptFormState {
  return {
    success: false,
    message,
    errors,
  };
}

function formValue(formData: FormData, key: string) {
  return String(formData.get(key) ?? "");
}

async function savePrompt(id: string | null, formData: FormData): Promise<PromptFormState> {
  await requireAdmin();

  const parsed = promptFormSchema.safeParse({
    title: formValue(formData, "title"),
    summary: formValue(formData, "summary"),
    contentMarkdown: formValue(formData, "contentMarkdown"),
    category: formValue(formData, "category"),
    type: formValue(formData, "type"),
    tags: formValue(formData, "tags"),
  });

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;

    return validationError("Please fix the highlighted fields.", {
      title: fieldErrors.title?.[0],
      summary: fieldErrors.summary?.[0],
      contentMarkdown: fieldErrors.contentMarkdown?.[0],
      category: fieldErrors.category?.[0],
      type: fieldErrors.type?.[0],
      tags: fieldErrors.tags?.[0],
    });
  }

  const slug = await ensureUniquePromptSlug(parsed.data.title, id ?? undefined);

  const promptData = {
    slug,
    title: parsed.data.title,
    summary: parsed.data.summary,
    contentMarkdown: parsed.data.contentMarkdown,
    category: parsed.data.category,
    type: parsed.data.type,
  } as const;

  const tagCreates = parsed.data.tags.map((tagName) => {
    const normalisedName = tagName.trim().replace(/\s+/g, " ");
    const tagSlug = slugify(normalisedName);

    return {
      tag: {
        connectOrCreate: {
          where: { slug: tagSlug },
          create: {
            name: normalisedName,
            slug: tagSlug,
          },
        },
      },
    };
  });

  if (id) {
    await prisma.prompt.update({
      where: { id },
      data: {
        ...promptData,
        tags: {
          deleteMany: {},
          create: tagCreates,
        },
      },
    });
  } else {
    await prisma.prompt.create({
      data: {
        ...promptData,
        tags: {
          create: tagCreates,
        },
      },
    });
  }

  revalidatePath("/");
  revalidatePath("/admin");

  return {
    success: true,
    message: id ? "Prompt updated." : "Prompt created.",
    redirectTo: "/admin",
  };
}

export async function createPromptAction(_: PromptFormState, formData: FormData): Promise<PromptFormState> {
  return savePrompt(null, formData);
}

export async function updatePromptAction(
  id: string,
  _: PromptFormState,
  formData: FormData,
): Promise<PromptFormState> {
  return savePrompt(id, formData);
}

export async function toggleFavouriteAction(id: string) {
  await requireAdmin();

  const prompt = await prisma.prompt.findUnique({
    where: { id },
    select: { id: true, isFavourite: true },
  });

  if (!prompt) {
    return;
  }

  await prisma.prompt.update({
    where: { id },
    data: {
      isFavourite: !prompt.isFavourite,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function deletePromptAction(id: string) {
  await requireAdmin();

  await prisma.prompt.delete({
    where: { id },
  });

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function logoutAction() {
  await clearSessionCookie();
  redirect("/");
}
