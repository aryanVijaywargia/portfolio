import { XMarkIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { FC, useEffect, useState } from "react";

import { usePortfolioMode } from "components/_stores/portfolio-mode-context";

const STORAGE_KEY = "portfolio-mobile-experience-notice-dismissed";

export const MobileExperienceNotice: FC = () => {
  const { mode } = usePortfolioMode();
  const [isVisible, setIsVisible] = useState(false);
  const isBatman = mode === "batman";

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");

    const updateVisibility = () => {
      const wasDismissed = sessionStorage.getItem(STORAGE_KEY) === "true";
      setIsVisible(mediaQuery.matches && !wasDismissed);
    };

    updateVisibility();
    mediaQuery.addEventListener?.("change", updateVisibility);
    return () => mediaQuery.removeEventListener?.("change", updateVisibility);
  }, []);

  const dismiss = () => {
    sessionStorage.setItem(STORAGE_KEY, "true");
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible
        ? <motion.div
            className="fixed inset-x-0 bottom-0 z-[80] px-4 pb-4 sm:hidden"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <div
              className={clsx(
                "mx-auto max-w-sm rounded-lg border p-4 shadow-2xl backdrop-blur",
                isBatman
                  ? "border-[#0db7a6]/50 bg-[#031212]/95 text-[#9ee8dc] shadow-[#00c2ad]/20"
                  : "shadow-gray-900/15 border-gray-200 bg-white/95 text-gray-900 dark:border-gray-700 dark:bg-[#111827]/95 dark:text-gray-100 dark:shadow-black/30"
              )}
            >
              <div className="flex items-start gap-3">
                <div
                  className={clsx(
                    "mt-1 h-2.5 w-2.5 flex-none rounded-full",
                    isBatman ? "bg-[#00c2ad]" : "bg-primary-500 dark:bg-primary-400"
                  )}
                />
                <div className="min-w-0 flex-1">
                  <p
                    className={clsx(
                      "text-sm font-semibold",
                      isBatman ? "text-[#00c2ad]" : "text-gray-950 dark:text-white"
                    )}
                  >
                    Best on larger screens
                  </p>
                  <p
                    className={clsx(
                      "mt-1 text-sm leading-6",
                      isBatman ? "text-[#7fbfb5]" : "text-gray-600 dark:text-gray-300"
                    )}
                  >
                    This portfolio is fully usable on mobile, but the terminal and interactive
                    details are sharper on a laptop or desktop.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={dismiss}
                  className={clsx(
                    "grid h-8 w-8 flex-none place-items-center rounded-md transition",
                    isBatman
                      ? "text-[#7fbfb5] hover:bg-[#0db7a6]/10 hover:text-[#00c2ad]"
                      : "text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-white"
                  )}
                  aria-label="Dismiss mobile experience notice"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
              <button
                type="button"
                onClick={dismiss}
                className={clsx(
                  "mt-4 w-full rounded-md px-4 py-2 text-sm font-semibold transition",
                  isBatman
                    ? "border border-[#0db7a6]/50 bg-[#063b37] text-[#c8fff5] hover:bg-[#07524b]"
                    : "bg-gray-950 dark:text-gray-950 text-white hover:bg-gray-800 dark:bg-primary-500 dark:hover:bg-primary-400"
                )}
              >
                Continue
              </button>
            </div>
          </motion.div>
        : null}
    </AnimatePresence>
  );
};
