import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";

export type CharacterExpression = "normal" | "panic" | "excited" | "sarcastic" | "showoff";

interface OverlayContextType {
  narration: string | null;
  expression: CharacterExpression;
  overlayPosition: "top-left" | "top-center" | "bottom-right";
  setOverlayPosition: (pos: "top-left" | "top-center" | "bottom-right") => void;
  showCharacter: (text: string, expression?: CharacterExpression, duration?: number) => void;
  hideCharacter: () => void;
}

const OverlayContext = createContext<OverlayContextType | undefined>(undefined);

export const RickOverlayProvider: React.FC<{
  children: React.ReactNode;
  initialOverlayPosition: "top-left" | "top-center" | "bottom-right";
}> = ({ children, initialOverlayPosition }) => {
  const [narration, setNarration] = useState<string | null>(null);
  const [expression, setExpression] = useState<CharacterExpression>("normal");
  const [overlayPosition, setOverlayPosition] = useState(initialOverlayPosition);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showCharacter = useCallback(
    (text: string, expr: CharacterExpression = "normal", duration = 4000) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      setNarration(text);
      setExpression(expr);
      timeoutRef.current = setTimeout(
        () => {
          setNarration(null);
          timeoutRef.current = null;
        },
        duration
      );
    },
    []
  );

  const hideCharacter = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setNarration(null);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <OverlayContext.Provider
      value={{
        narration,
        expression,
        overlayPosition,
        setOverlayPosition,
        showCharacter,
        hideCharacter,
      }}
    >
      {children}
    </OverlayContext.Provider>
  );
};

export const useCharacterOverlay = () => {
  const context = useContext(OverlayContext);
  if (!context) throw new Error("useCharacterOverlay must be used within OverlayProvider");
  return context;
};
