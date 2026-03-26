import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type PromptContentRendererProps = {
  content: string;
};

type TaggedSection = {
  tag: string;
  body: string;
};

function parseTaggedSections(content: string): TaggedSection[] | null {
  const trimmed = content.trim();
  const expression = /<([a-zA-Z][\w-]*)>\s*([\s\S]*?)\s*<\/\1>/g;
  const sections: TaggedSection[] = [];
  let matchedText = "";

  for (const match of trimmed.matchAll(expression)) {
    const [fullMatch, tagName, body] = match;

    if (!tagName || body === undefined) {
      continue;
    }

    sections.push({
      tag: tagName,
      body: body.trim(),
    });
    matchedText += fullMatch.trim();
  }

  if (!sections.length) {
    return null;
  }

  const normalisedSource = trimmed.replace(/\s+/g, "");
  const normalisedMatched = matchedText.replace(/\s+/g, "");

  return normalisedSource === normalisedMatched ? sections : null;
}

function TaggedPromptView({ sections }: { sections: TaggedSection[] }) {
  return (
    <div className="space-y-8">
      {sections.map((section) => (
        <section key={section.tag}>
          <p className="prompt-tag-line">{`<${section.tag}>`}</p>
          <div className="prompt-tag-body">{section.body}</div>
          <p className="prompt-tag-line mt-4">{`</${section.tag}>`}</p>
        </section>
      ))}
    </div>
  );
}

export function PromptContentRenderer({ content }: PromptContentRendererProps) {
  const taggedSections = parseTaggedSections(content);

  if (taggedSections) {
    return <TaggedPromptView sections={taggedSections} />;
  }

  return (
    <div className="markdown-content">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
