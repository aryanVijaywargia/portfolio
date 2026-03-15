import { useState, useEffect } from "react";
import { BootScreen } from "./boot-screen";
import { IntroScreen } from "./intro-screen";
import { LevelSelection } from "./level-selection";
import { PokemonBattle } from "./pokemon-battle/pokemon-battle";
import { RobotTekken } from "./robot-tekken";
import { RickOverlay } from "./rick-overlay";
import { RickOverlayProvider } from "./rick-overlay-context";

export type Screen = "boot" | "intro" | "level-select" | "pokemon-battle" | "robot-tekken";

type GameId = "pokemon-battle" | "robot-tekken";

const COMPLETED_GAMES_KEY = "game-monitor-completed-games";

const loadCompletedGames = (): Set<GameId> => {
  try {
    const stored = localStorage.getItem(COMPLETED_GAMES_KEY);
    if (stored) return new Set(JSON.parse(stored) as GameId[]);
  } catch (e) {
    console.warn("Failed to load completed games", e);
  }
  return new Set<GameId>();
};

const saveCompletedGames = (completed: Set<GameId>) => {
  try {
    localStorage.setItem(COMPLETED_GAMES_KEY, JSON.stringify(Array.from(completed)));
  } catch (e) {
    console.warn("Failed to save completed games", e);
  }
};

export const GameMonitor = () => {
  const [screen, setScreen] = useState<Screen>("boot");
  const [completedGames, setCompletedGames] = useState<Set<GameId>>(() => new Set());

  // Delay loading from localStorage to avoid SSR hydration mismatch
  useEffect(() => {
    setCompletedGames(loadCompletedGames());
  }, []);

  useEffect(() => {
    saveCompletedGames(completedGames);
  }, [completedGames]);

  const markGameCompleted = (gameId: GameId) => {
    setCompletedGames((prev) => {
      const updated = new Set(prev);
      updated.add(gameId);
      return updated;
    });
  };

  return (
    <RickOverlayProvider initialOverlayPosition="bottom-right">
      <div id="game-monitor" className="is-fullscreen">
        <div className="screen-container">
          {screen === "boot" && <BootScreen onComplete={() => setScreen("intro")} />}
          {screen === "intro" && <IntroScreen onComplete={() => setScreen("level-select")} />}
          {screen === "level-select" && (
            <LevelSelection
              completedGames={completedGames}
              onSelectGame={(game) => setScreen(game)}
            />
          )}
          {screen === "pokemon-battle" && (
            <PokemonBattle
              onBack={() => setScreen("level-select")}
              onComplete={() => {
                markGameCompleted("pokemon-battle");
                setScreen("level-select");
              }}
            />
          )}
          {screen === "robot-tekken" && (
            <RobotTekken
              onBack={() => setScreen("level-select")}
              onComplete={() => {
                markGameCompleted("robot-tekken");
                setScreen("level-select");
              }}
            />
          )}
        </div>
        <RickOverlay />
      </div>
    </RickOverlayProvider>
  );
};
