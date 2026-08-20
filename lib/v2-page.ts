import type { GetStaticProps } from "next";
import { getSupabaseConfig, readScratchpadNotes } from "lib/scratchpad";
import type { ScratchpadNote } from "lib/scratchpad";

export type V2PageProps = {
  initialScratchpadNotes: ScratchpadNote[] | null;
};

/**
 * Shared data loader for the v2 routes.
 *
 * Both /signal and /graphite render the same page with the same data; only the
 * token set differs. Re-exported from each page because Next requires
 * getStaticProps to be a top-level export of the page module.
 */
export const getV2StaticProps: GetStaticProps<V2PageProps> = async () => {
  const config = getSupabaseConfig();
  if (!config) {
    return { props: { initialScratchpadNotes: null }, revalidate: 60 };
  }

  try {
    const initialScratchpadNotes = await readScratchpadNotes(config);
    return { props: { initialScratchpadNotes }, revalidate: 60 };
  } catch (error) {
    console.error("Could not preload scratchpad notes", error);
    return { props: { initialScratchpadNotes: null }, revalidate: 30 };
  }
};
