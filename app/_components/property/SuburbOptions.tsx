import { connection } from "next/server";
import { getSuburbs } from "@/lib/db/queries";

/**
 * Autocomplete values for a search input, taken from suburbs that actually have
 * stock. Rendered as a standalone `<datalist>` so it can be streamed in after
 * the input it serves — the hero must not wait on MongoDB to paint, and an
 * input works fine before its suggestions arrive.
 */
export async function SuburbOptions({ id }: { id: string }) {
  await connection();

  const suburbs = await getSuburbs();
  if (suburbs.length === 0) return null;

  return (
    <datalist id={id}>
      {suburbs.map((s) => (
        <option key={s} value={s} />
      ))}
    </datalist>
  );
}
