type FavouriteToggleButtonProps = {
  action: () => Promise<void>;
  isFavourite: boolean;
};

export function FavouriteToggleButton({ action, isFavourite }: FavouriteToggleButtonProps) {
  return (
    <form action={action}>
      <button
        type="submit"
        className="rounded-full border border-line/70 px-4 py-2 text-sm font-medium transition hover:border-accent/60 hover:text-accent"
      >
        {isFavourite ? "Remove favourite" : "Favourite"}
      </button>
    </form>
  );
}
