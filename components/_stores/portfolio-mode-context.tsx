import { createContext, FC, PropsWithChildren, useCallback, useContext, useEffect, useState } from "react";

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

export const PortfolioModeProvider: FC<PropsWithChildren> = ({ children }) => {
  const [mode, setMode] = useState<PortfolioMode>("default");
  const [showTransition, setShowTransition] = useState(false);

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

  const activateBatman = useCallback(() => {
    setMode("batman");
    setShowTransition(true);
    document.documentElement.setAttribute("data-portfolio-mode", "batman");
    try {
      sessionStorage.setItem(STORAGE_KEY, "batman");
    } catch {
      // sessionStorage unavailable
    }
  }, []);

  const deactivateBatman = useCallback(() => {
    setShowTransition(false);
    document.documentElement.removeAttribute("data-portfolio-mode");
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // sessionStorage unavailable
    }
    // Small delay to let CSS transition, then switch mode and scroll
    window.scrollTo({ top: 0, behavior: "instant" });
    setMode("default");
  }, []);

  const dismissTransition = useCallback(() => {
    setShowTransition(false);
  }, []);

  return (
    <PortfolioModeContext.Provider
      value={{ mode, activateBatman, deactivateBatman, showTransition, dismissTransition }}
    >
      {children}
    </PortfolioModeContext.Provider>
  );
};

export const usePortfolioMode = () => useContext(PortfolioModeContext);
