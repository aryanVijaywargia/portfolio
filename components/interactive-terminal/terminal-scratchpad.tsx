import { AnimatePresence, motion } from "framer-motion";
import type { ScratchpadNote } from "lib/scratchpad";
import { FC, FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";

const MAX_NOTE_LENGTH = 280;

type TerminalScratchpadProps = {
  isLoading: boolean;
  loadError: string;
  notes: ScratchpadNote[];
  onNoteCreated: (note: ScratchpadNote) => void;
  onRefresh: () => void | Promise<void>;
};

const formatTimestamp = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "just now";

  return new Intl.DateTimeFormat(undefined, {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export const TerminalScratchpad: FC<TerminalScratchpadProps> = ({
  isLoading,
  loadError,
  notes,
  onNoteCreated,
  onRefresh,
}) => {
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!isLoading || notes.length > 0) inputRef.current?.focus({ preventScroll: true });
  }, [isLoading, notes.length]);

  const submitNote = async () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage || isSubmitting) return;

    setSubmissionError("");
    setConfirmation("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/scratchpad", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmedMessage, website }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "Your note could not be saved.");

      onNoteCreated(data.note as ScratchpadNote);
      setMessage("");
      setWebsite("");
      setConfirmation("Added to Shared Notes");
      window.setTimeout(() => setConfirmation(""), 2600);
    } catch (submitError) {
      setSubmissionError((submitError as Error).message || "Your note could not be saved.");
    } finally {
      setIsSubmitting(false);
      inputRef.current?.focus({ preventScroll: true });
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    submitNote();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submitNote();
    }
  };

  const error = submissionError || loadError;

  return (
    <section className="notes-app flex h-full min-h-0 text-[#1d1d1f] dark:text-[#f5f5f7]">
      <aside className="notes-sidebar hidden w-44 shrink-0 flex-col border-r border-black/10 px-3 py-4 dark:border-white/10 sm:flex md:w-52">
        <div className="mb-4 flex items-center justify-between px-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8e8e93]">
            iCloud
          </span>
          <span aria-hidden="true" className="text-[15px] text-[#d89b00] dark:text-[#ffcc00]">
            ＋
          </span>
        </div>

        <div className="notes-folder flex items-center gap-2.5 rounded-lg px-3 py-2.5">
          <span aria-hidden="true" className="text-[17px] text-[#d89b00] dark:text-[#ffcc00]">
            ▤
          </span>
          <span className="min-w-0 flex-1 truncate text-[13px] font-medium">Shared Notes</span>
          <span className="text-[11px] text-[#8e8e93]">{notes.length}</span>
        </div>

        <div className="mt-3 px-3 text-[11px] leading-5 text-[#8e8e93]">
          <p>Public folder</p>
          <p>Anonymous contributors</p>
        </div>

        <button
          type="button"
          onClick={() => onRefresh()}
          disabled={isLoading}
          className="mt-auto flex items-center gap-2 rounded-lg px-3 py-2 text-left text-[12px] text-[#6e6e73] transition-colors hover:bg-black/5 disabled:cursor-wait disabled:opacity-50 dark:text-[#a1a1a6] dark:hover:bg-white/5"
        >
          <span aria-hidden="true">↻</span>
          {isLoading ? "Syncing…" : "Refresh notes"}
        </button>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col bg-[#fffefb] dark:bg-[#1c1c1e]">
        <div className="notes-mobile-toolbar flex h-10 shrink-0 items-center justify-between border-b border-black/10 px-4 dark:border-white/10 sm:hidden">
          <span className="text-[12px] font-semibold text-[#8c6500] dark:text-[#ffcc00]">
            Shared Notes
          </span>
          <button
            type="button"
            onClick={() => onRefresh()}
            disabled={isLoading}
            className="grid h-7 w-7 place-items-center rounded-full text-[15px] text-[#8c6500] disabled:opacity-50 dark:text-[#ffcc00]"
            aria-label="Refresh notes"
          >
            ↻
          </button>
        </div>

        <div className="notes-document min-h-0 flex-1 overflow-y-auto" aria-live="polite">
          <div className="mx-auto w-full max-w-2xl px-5 pb-8 pt-7 sm:px-8 sm:pt-9">
            <header className="mb-7 text-center">
              <p className="text-[11px] font-medium text-[#8e8e93]">Shared by everyone</p>
              <h1 className="mt-2 text-[23px] font-bold tracking-[-0.025em] sm:text-[26px]">
                Thoughts from the internet
              </h1>
              <p className="mt-2 text-[12px] text-[#8e8e93]">
                Leave a line. No account, no profile.
              </p>
            </header>

            {isLoading && notes.length === 0
              ? <div className="flex items-center justify-center py-16 text-[13px] text-[#8e8e93]">
                  <span className="mr-2 inline-block h-2 w-2 animate-pulse rounded-full bg-[#e5a700] dark:bg-[#ffcc00]" />
                  Syncing shared notes…
                </div>
              : notes.length > 0
              ? <AnimatePresence initial={false}>
                  {notes.map((note, index) => (
                    <motion.article
                      key={note.id}
                      initial={index === 0 ? { opacity: 0, y: -6 } : false}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.22 }}
                      className="notes-entry relative border-t border-black/[0.07] py-5 pl-5 first:border-t-0 first:pt-0 dark:border-white/[0.09]"
                    >
                      <span
                        aria-hidden="true"
                        className={`absolute left-0 h-2 w-2 rounded-full bg-[#e7ab13] dark:bg-[#ffcc00] ${
                          index === 0 ? "top-1" : "top-[1.6rem]"
                        }`}
                      />
                      <p className="whitespace-pre-wrap break-words text-[14px] leading-6 text-[#29292b] dark:text-[#ededf0] sm:text-[15px] sm:leading-7">
                        {note.message}
                      </p>
                      <div className="mt-2 text-[10px] text-[#9a9a9f] sm:text-[11px]">
                        <time dateTime={note.created_at}>{formatTimestamp(note.created_at)}</time>
                      </div>
                    </motion.article>
                  ))}
                </AnimatePresence>
              : !error
              ? <div className="py-16 text-center">
                  <span aria-hidden="true" className="text-3xl text-[#e5a700] dark:text-[#ffcc00]">
                    ✎
                  </span>
                  <p className="mt-3 text-[14px] font-medium">No notes yet</p>
                  <p className="mt-1 text-[12px] text-[#8e8e93]">Start the shared page below.</p>
                </div>
              : null}
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="notes-composer relative shrink-0 border-t border-black/10 bg-[#f7f6f2]/95 px-3 py-3 backdrop-blur-xl dark:border-white/10 dark:bg-[#242426]/95 sm:px-5"
        >
          <label htmlFor="scratchpad-message" className="sr-only">
            Add a note to the shared scratchpad
          </label>
          <div className="notes-input-shell mx-auto flex max-w-2xl items-end gap-2 rounded-2xl border border-black/10 bg-white px-3 py-2 shadow-sm transition-shadow focus-within:border-[#d3a11a]/70 focus-within:shadow-[0_0_0_3px_rgba(229,167,0,0.12)] dark:border-white/10 dark:bg-[#303033] dark:focus-within:border-[#ffcc00]/50 dark:focus-within:shadow-[0_0_0_3px_rgba(255,204,0,0.08)]">
            <textarea
              ref={inputRef}
              id="scratchpad-message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              onKeyDown={handleKeyDown}
              maxLength={MAX_NOTE_LENGTH}
              rows={2}
              placeholder="Write a shared note…"
              disabled={isSubmitting}
              spellCheck={false}
              data-gramm="false"
              data-gramm_editor="false"
              data-enable-grammarly="false"
              className="min-h-[3.25rem] min-w-0 flex-1 resize-none border-0 bg-transparent px-1 py-1 text-[14px] leading-6 text-[#1d1d1f] placeholder:text-[#a1a1a6] focus:ring-0 dark:text-[#f5f5f7] dark:placeholder:text-[#77777c]"
            />
            <button
              type="submit"
              disabled={!message.trim() || isSubmitting}
              className="mb-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#e4a900] text-[17px] font-semibold text-white shadow-sm transition-all hover:bg-[#d39c00] active:scale-95 disabled:cursor-not-allowed disabled:bg-[#d1d1d6] disabled:text-white/80 dark:bg-[#ffcc00] dark:text-[#282200] dark:hover:bg-[#f4c300] dark:disabled:bg-[#48484a] dark:disabled:text-[#858589]"
              aria-label={isSubmitting ? "Saving note" : "Add note"}
              title="Add note"
            >
              {isSubmitting
                ? <span className="animate-pulse text-[11px]">•••</span>
                : <span aria-hidden="true">↑</span>}
            </button>
          </div>

          <input
            value={website}
            onChange={(event) => setWebsite(event.target.value)}
            name="website"
            tabIndex={-1}
            autoComplete="off"
            className="pointer-events-none absolute -left-[9999px] h-px w-px opacity-0"
            aria-hidden="true"
          />

          <div className="mx-auto mt-1.5 flex max-w-2xl items-center justify-between px-1 text-[10px] text-[#8e8e93]">
            <span>Enter to post · Shift+Enter for a new line</span>
            <span className={message.length > 250 ? "text-[#b77700] dark:text-[#ffcc00]" : ""}>
              {message.length}/{MAX_NOTE_LENGTH}
            </span>
          </div>

          <AnimatePresence>
            {(error || confirmation) && (
              <motion.p
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -3 }}
                className={`mx-auto mt-1 max-w-2xl px-1 text-[11px] ${
                  error
                    ? "text-[#c7322b] dark:text-[#ff8b83]"
                    : "text-[#477b43] dark:text-[#78d99a]"
                }`}
                role={error ? "alert" : "status"}
              >
                {error || `✓ ${confirmation}`}
              </motion.p>
            )}
          </AnimatePresence>
        </form>
      </div>

      <style jsx>{`
        .notes-app {
          background: #f4f3ef;
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", Inter, system-ui,
            sans-serif;
        }

        :global(.dark) .notes-app {
          background: #1c1c1e;
        }

        .notes-sidebar {
          background: linear-gradient(180deg, #efede7 0%, #e9e7e1 100%);
        }

        :global(.dark) .notes-sidebar {
          background: linear-gradient(180deg, #28282a 0%, #242426 100%);
        }

        .notes-folder {
          background: rgba(229, 167, 0, 0.17);
          box-shadow: inset 0 0 0 1px rgba(180, 127, 0, 0.08);
        }

        :global(.dark) .notes-folder {
          background: rgba(255, 204, 0, 0.13);
          box-shadow: inset 0 0 0 1px rgba(255, 204, 0, 0.08);
        }

        .notes-document {
          scrollbar-color: rgba(142, 142, 147, 0.42) transparent;
          scrollbar-width: thin;
        }

        @media (max-width: 639px) {
          .notes-composer {
            padding-bottom: max(0.75rem, env(safe-area-inset-bottom));
          }
        }
      `}</style>
    </section>
  );
};
