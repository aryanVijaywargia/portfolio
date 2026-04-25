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

const STORAGE_KEY = "portfolio-mode";
const MODE_SWAP_DELAY_MS = 120;

export const PortfolioModeProvider: FC<PropsWithChildren> = ({ children }) => {
  const [mode, setMode] = useState<PortfolioMode>("default");
  const [showTransition, setShowTransition] = useState(false);
  const modeSwapTimeoutRef = useRef<number | null>(null);

  const clearModeSwapTimeout = useCallback(() => {
    if (modeSwapTimeoutRef.current === null) return;
    window.clearTimeout(modeSwapTimeoutRef.current);
    modeSwapTimeoutRef.current = null;
  }, []);

  // Restore from sessionStorage on mount
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored === "batman") {
        setMode("batman");
        document.documentElement.setAttribute("data-portfolio-mode", "batman");
      }
    } catch {
      // sessionStorage unavailable
    }
  }, []);

  useEffect(() => {
    return () => {
      clearModeSwapTimeout();
    };
  }, [clearModeSwapTimeout]);

  const enterBatmanMode = useCallback(() => {
    setMode("batman");
    window.scrollTo(0, 0);
    document.documentElement.setAttribute("data-portfolio-mode", "batman");
    try {
      sessionStorage.setItem(STORAGE_KEY, "batman");
    } catch {
      // sessionStorage unavailable
    }
  }, []);

  const activateBatman = useCallback(() => {
    clearModeSwapTimeout();
    setShowTransition(true);
    modeSwapTimeoutRef.current = window.setTimeout(
      () => {
        modeSwapTimeoutRef.current = null;
        enterBatmanMode();
      },
      MODE_SWAP_DELAY_MS
    );
  }, [clearModeSwapTimeout, enterBatmanMode]);

  const deactivateBatman = useCallback(() => {
    clearModeSwapTimeout();
    setShowTransition(false);
    document.documentElement.removeAttribute("data-portfolio-mode");
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // sessionStorage unavailable
    }
    // Reset position before returning to the default portfolio.
    window.scrollTo(0, 0);
    setMode("default");
  }, [clearModeSwapTimeout]);

  const dismissTransition = useCallback(() => {
    setShowTransition(false);
  }, []);

  const value = useMemo(
    () => ({ mode, activateBatman, deactivateBatman, showTransition, dismissTransition }),
    [mode, activateBatman, deactivateBatman, showTransition, dismissTransition]
  );

  return <PortfolioModeContext.Provider value={value}>{children}</PortfolioModeContext.Provider>;
};

export const usePortfolioMode = () => useContext(PortfolioModeContext);
