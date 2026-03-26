import { PrismaClient, PromptType } from "@prisma/client";

const prisma = new PrismaClient();

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

const starterPrompts = [
  {
    title: "Brand voice polish for landing pages",
    summary: "Tighten homepage copy so it sounds clearer, warmer, and more confident without becoming salesy.",
    contentMarkdown: `## Role

You are a senior brand strategist and conversion copywriter.

## Task

Rewrite the homepage copy I provide so it feels:

- clearer and easier to scan
- warm and intelligent
- confident without hype
- suitable for a small, trustworthy product business

## Output

1. A sharper headline
2. A short supporting paragraph
3. Three feature blurbs
4. Three concise calls to action

## Guardrails

- Use British English
- Avoid clichés and startup jargon
- Keep the tone practical and grounded
- Preserve the original meaning unless something is obviously weak

## Source copy

{{paste copy here}}`,
    type: PromptType.TEXT,
    category: "Marketing",
    isFavourite: true,
    tags: ["copywriting", "landing-page", "brand-voice"],
    createdAt: new Date("2026-03-20T09:00:00.000Z"),
  },
  {
    title: "Product photography image prompt",
    summary: "Generate elegant ecommerce-style imagery with soft lighting and a clean editorial finish.",
    contentMarkdown: `## Goal

Create a polished product photograph for an ecommerce store.

## Visual direction

- soft natural lighting
- clean studio backdrop
- premium but believable styling
- subtle shadows
- editorial composition

## Subject

{{describe the product}}

## Constraints

- no extra objects unless requested
- no text overlays
- realistic materials and reflections
- image should feel commercially usable

## Aspect ratio

{{choose ratio}}`,
    type: PromptType.IMAGE,
    category: "Design",
    isFavourite: false,
    tags: ["image-generation", "ecommerce", "studio-lighting"],
    createdAt: new Date("2026-03-19T12:30:00.000Z"),
  },
  {
    title: "Short-form video hook generator",
    summary: "Create opening hooks for short videos that sound punchy, specific, and useful.",
    contentMarkdown: `You are helping me plan short social videos.

Write 15 opening hooks for a video about:

{{topic}}

The hooks should:

- stop the scroll quickly
- sound natural when spoken aloud
- avoid clickbait
- feel specific rather than generic
- be under 14 words

Group them into:

- direct
- curiosity-led
- contrarian

Use British English.`,
    type: PromptType.VIDEO,
    category: "Content",
    isFavourite: false,
    tags: ["video", "hooks", "social-media"],
    createdAt: new Date("2026-03-18T15:10:00.000Z"),
  },
  {
    title: "Podcast intro outline",
    summary: "Draft a crisp opening for a podcast episode, including tone, transitions, and listener promise.",
    contentMarkdown: `Create a podcast intro for the episode below.

Episode topic: {{topic}}
Audience: {{audience}}
Tone: {{tone}}

Please provide:

1. A 20-second opening script
2. A smoother transition into the main topic
3. Three optional episode title ideas

Keep it conversational, confident, and easy to read aloud.`,
    type: PromptType.AUDIO,
    category: "Audio",
    isFavourite: true,
    tags: ["podcast", "audio", "script"],
    createdAt: new Date("2026-03-17T08:45:00.000Z"),
  },
  {
    title: "Technical article simplifier",
    summary: "Turn dense technical writing into plain-English explanations without stripping out the important detail.",
    contentMarkdown: `Act as a technical editor for a non-specialist audience.

Take the passage below and rewrite it so it is easier to understand.

Requirements:

- keep the technical meaning accurate
- explain jargon in simple language
- use shorter sentences
- keep a professional tone
- use British English spelling

Return:

1. A simplified version
2. A bullet list of the most important ideas
3. A short glossary for any unavoidable technical terms

Passage:

{{paste passage here}}`,
    type: PromptType.TEXT,
    category: "Writing",
    isFavourite: false,
    tags: ["writing", "editing", "explainer"],
    createdAt: new Date("2026-03-16T13:05:00.000Z"),
  },
  {
    title: "UI review checklist for dashboards",
    summary: "Review a dashboard screen and identify visual clarity issues, confusing hierarchy, and opportunities to improve flow.",
    contentMarkdown: `You are a product designer reviewing a dashboard screen.

Assess the interface based on:

- hierarchy
- readability
- spacing
- interaction clarity
- empty states
- mobile responsiveness

Please respond with:

1. What is working well
2. The top 5 issues to fix first
3. Suggested copy improvements
4. One bolder design direction worth testing

Keep the advice practical and specific.`,
    type: PromptType.IMAGE,
    category: "Design",
    isFavourite: false,
    tags: ["ui", "ux", "dashboard"],
    createdAt: new Date("2026-03-15T10:20:00.000Z"),
  },
  {
    title: "Customer support reply helper",
    summary: "Draft kind, concise support replies that acknowledge the issue and move the conversation forward.",
    contentMarkdown: `You are helping with customer support.

Write a reply to the message below.

Goals:

- sound warm and calm
- acknowledge the customer's frustration
- explain the next step clearly
- avoid sounding robotic
- use British English

Customer message:

{{paste message here}}`,
    type: PromptType.TEXT,
    category: "Operations",
    isFavourite: true,
    tags: ["support", "email", "customer-service"],
    createdAt: new Date("2026-03-14T16:40:00.000Z"),
  },
  {
    title: "YouTube chapter generator",
    summary: "Break a long video transcript into helpful chapter titles with sensible timestamps and descriptive labels.",
    contentMarkdown: `Review the transcript below and create chapter markers for YouTube.

Requirements:

- use clear, descriptive titles
- keep titles short
- group adjacent points when they naturally belong together
- avoid vague labels such as "More tips"

Return a simple list in this format:

00:00 Opening
01:42 Topic name
04:15 Topic name

Transcript:

{{paste transcript here}}`,
    type: PromptType.VIDEO,
    category: "Content",
    isFavourite: false,
    tags: ["youtube", "video", "transcript"],
    createdAt: new Date("2026-03-13T11:15:00.000Z"),
  },
  {
    title: "Voiceover script polishing",
    summary: "Refine voiceover copy so it sounds smoother, shorter, and more natural when spoken.",
    contentMarkdown: `Edit the following voiceover script for spoken delivery.

Focus on:

- rhythm
- clarity
- natural phrasing
- removing unnecessary words

Do not make it overdramatic. Keep the meaning intact unless there is a clear improvement.

Script:

{{paste script here}}`,
    type: PromptType.AUDIO,
    category: "Audio",
    isFavourite: false,
    tags: ["voiceover", "script", "audio"],
    createdAt: new Date("2026-03-12T14:50:00.000Z"),
  },
  {
    title: "Prompt critique and improvement pass",
    summary: "Review an existing prompt, explain weak spots, and rewrite it to be more specific and reliable.",
    contentMarkdown: `You are a prompt engineer reviewing a prompt for quality.

Please analyse the prompt below and provide:

1. A short critique of what is vague or likely to fail
2. A rewritten version that is more specific and reliable
3. A note on which types of tasks the improved prompt is best suited to

Prompt to review:

{{paste prompt here}}`,
    type: PromptType.TEXT,
    category: "Prompt Engineering",
    isFavourite: true,
    tags: ["prompt-design", "review", "quality"],
    createdAt: new Date("2026-03-11T09:25:00.000Z"),
  },
  {
    title: "Course lesson thumbnail concept",
    summary: "Generate polished concept directions for educational thumbnails with clear focal points and restrained styling.",
    contentMarkdown: `Create three visual concepts for a course lesson thumbnail.

Topic: {{topic}}
Audience: {{audience}}

Each concept should include:

- a visual scene description
- colour direction
- composition notes
- what the image should communicate instantly

Aim for clarity over spectacle.`,
    type: PromptType.IMAGE,
    category: "Education",
    isFavourite: false,
    tags: ["thumbnail", "education", "image-generation"],
    createdAt: new Date("2026-03-10T17:35:00.000Z"),
  },
  {
    title: "Meeting note distiller",
    summary: "Extract actions, risks, and decisions from messy meeting notes in a format that is easy to reuse.",
    contentMarkdown: `Turn the notes below into a clean meeting summary.

Output sections:

## Summary
## Decisions
## Actions
## Risks
## Follow-up questions

Keep the wording direct and remove repetition.

Notes:

{{paste notes here}}`,
    type: PromptType.TEXT,
    category: "Operations",
    isFavourite: false,
    tags: ["meetings", "summary", "productivity"],
    createdAt: new Date("2026-03-09T08:15:00.000Z"),
  },
  {
    title: "Ad creative angle explorer",
    summary: "Generate distinct ad angles so campaigns do not end up with the same repeated message.",
    contentMarkdown: `I want fresh ad angles for the product below.

Product:
{{product}}

Audience:
{{audience}}

Provide 10 ideas split across:

- aspiration
- practical outcome
- pain relief
- identity
- objection handling

For each angle, add a one-line explanation of why it may resonate.`,
    type: PromptType.VIDEO,
    category: "Marketing",
    isFavourite: true,
    tags: ["advertising", "creative", "campaigns"],
    createdAt: new Date("2026-03-08T12:00:00.000Z"),
  },
  {
    title: "Audio clean-up prompt for editors",
    summary: "Describe the desired result of an audio clean-up pass with enough specificity for a useful first draft.",
    contentMarkdown: `Help me write an audio clean-up brief.

Source recording notes:
{{describe recording}}

Please produce a clean brief that covers:

- noise reduction priorities
- pacing edits
- filler word removal
- breaths and pauses
- level consistency
- final tone target

Keep the brief realistic and production-minded.`,
    type: PromptType.AUDIO,
    category: "Production",
    isFavourite: false,
    tags: ["editing", "audio", "post-production"],
    createdAt: new Date("2026-03-07T18:10:00.000Z"),
  },
  {
    title: "Case study structure builder",
    summary: "Shape raw project notes into a compelling case study outline with clear before-and-after storytelling.",
    contentMarkdown: `Build a case study structure from the material below.

I want the finished outline to include:

- context
- challenge
- approach
- key decisions
- outcome
- lessons learned

Please keep it suitable for a website case study and avoid padded language.

Material:

{{paste project notes here}}`,
    type: PromptType.TEXT,
    category: "Writing",
    isFavourite: false,
    tags: ["case-study", "storytelling", "writing"],
    createdAt: new Date("2026-03-06T10:55:00.000Z"),
  },
];

async function main() {
  await prisma.promptTag.deleteMany();
  await prisma.prompt.deleteMany();
  await prisma.tag.deleteMany();

  for (const prompt of starterPrompts) {
    const slug = slugify(prompt.title);

    await prisma.prompt.create({
      data: {
        slug,
        title: prompt.title,
        summary: prompt.summary,
        contentMarkdown: prompt.contentMarkdown,
        type: prompt.type,
        category: prompt.category,
        isFavourite: prompt.isFavourite,
        createdAt: prompt.createdAt,
        updatedAt: prompt.createdAt,
        tags: {
          create: prompt.tags.map((tagName) => {
            const name = tagName.replace(/-/g, " ");
            const tagSlug = slugify(tagName);

            return {
              tag: {
                connectOrCreate: {
                  where: { slug: tagSlug },
                  create: {
                    name,
                    slug: tagSlug,
                  },
                },
              },
            };
          }),
        },
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
