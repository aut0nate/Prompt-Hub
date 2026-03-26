"use client";

type DeletePromptButtonProps = {
  action: () => Promise<void>;
};

export function DeletePromptButton({ action }: DeletePromptButtonProps) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!window.confirm("Delete this prompt permanently?")) {
          event.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="status-danger-button rounded-full border px-4 py-2 text-sm font-medium transition"
      >
        Delete
      </button>
    </form>
  );
}
