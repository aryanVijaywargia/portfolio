import { useRouter } from "next/router";
import { createContext, FC, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

type PortfolioMode = "default" | "batman";

type PortfolioModeContextValue = {
  mode: PortfolioMode;
  activateBatman: () => void;
  deactivateBatman: () => void;
  showTransition: boolean;
  dismissTransition: () => void;
};

const PortfolioModeContext = createContext<PortfolioModeContextValue>({
  mode: "default",
  activateBatman: () => {},
  deactivateBatman: () => {},
  showTransition: false,
  dismissTransition: () => {},
});

const RETURN_PATH_KEY = "batman-return-path";
const MODE_SWAP_DELAY_MS = 120;

export const PortfolioModeProvider: FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter();
  const [showTransition, setShowTransition] = useState(false);
  const modeSwapTimeoutRef = useRef<number | null>(null);
  const mode: PortfolioMode = router.pathname === "/batman" ? "batman" : "default";

  const clearModeSwapTimeout = useCallback(() => {
    if (modeSwapTimeoutRef.current === null) return;
    window.clearTimeout(modeSwapTimeoutRef.current);
    modeSwapTimeoutRef.current = null;
  }, []);

  useEffect(() => {
    if (mode === "batman") {
      document.documentElement.setAttribute("data-portfolio-mode", "batman");
    } else {
      document.documentElement.removeAttribute("data-portfolio-mode");
      try {
        sessionStorage.removeItem(RETURN_PATH_KEY);
      } catch {
        // sessionStorage unavailable
      }
    }
  }, [mode]);

  useEffect(() => {
    return () => {
      clearModeSwapTimeout();
    };
  }, [clearModeSwapTimeout]);

  const activateBatman = useCallback(() => {
    clearModeSwapTimeout();
    setShowTransition(true);

    try {
      sessionStorage.setItem(RETURN_PATH_KEY, router.asPath);
    } catch {
      // sessionStorage unavailable
    }

    modeSwapTimeoutRef.current = window.setTimeout(
      () => {
        modeSwapTimeoutRef.current = null;
        void router.push("/batman");
      },
      MODE_SWAP_DELAY_MS
    );
  }, [clearModeSwapTimeout, router]);

  const deactivateBatman = useCallback(() => {
    clearModeSwapTimeout();
    setShowTransition(false);
    document.documentElement.removeAttribute("data-portfolio-mode");

    let returnPath: string | null = null;
    try {
      returnPath = sessionStorage.getItem(RETURN_PATH_KEY);
      sessionStorage.removeItem(RETURN_PATH_KEY);
    } catch {
      // sessionStorage unavailable
    }

    if (returnPath) {
      router.back();
      return;
    }

    void router.replace("/");
  }, [clearModeSwapTimeout, router]);

  const dismissTransition = useCallback(() => {
    setShowTransition(false);
  }, []);

  const value = useMemo(
    () => ({
      mode,
      activateBatman,
      deactivateBatman,
      showTransition,
      dismissTransition,
    }),
    [mode, activateBatman, deactivateBatman, showTransition, dismissTransition]
  );

  return <PortfolioModeContext.Provider value={value}>{children}</PortfolioModeContext.Provider>;
};

export const usePortfolioMode = () => useContext(PortfolioModeContext);
