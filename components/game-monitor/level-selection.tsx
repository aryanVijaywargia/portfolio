import React, { useEffect, useState, useCallback } from "react";
import { useCharacterOverlay } from "./rick-overlay-context";

type GameId = "pokemon-battle" | "robot-tekken";

type Game = {
  id: GameId;
  title: string;
  comment: string;
  disabled?: boolean;
};

const games: Game[] = [
  {
    id: "pokemon-battle",
    title: "YOU ARE POKEMON",
    comment: "Pokemon? Really? In 2025? At least it's not another terminal command...",
  },
  {
    id: "robot-tekken",
    title: "Johnny 5 Street Fighter",
    comment: "Now THIS is more like it! Robots fighting robots! Classic!",
    disabled: false,
  },
];

type Props = {
  completedGames: Set<GameId>;
  onSelectGame: (game: GameId) => void;
};

export const LevelSelection: React.FC<Props> = ({ completedGames, onSelectGame }) => {
  const { showCharacter, hideCharacter } = useCharacterOverlay();
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    showCharacter("Pick a game! Any of these should help me escape...", "normal");
  }, [showCharacter]);

  useEffect(() => {
    const game = games[selectedIndex];
    if (!game) return;
    if (completedGames.has(game.id)) {
      showCharacter("You already beat this one! But you can play it again!", "sarcastic", 3000);
    } else {
      showCharacter(game.comment, "sarcastic", 3000);
    }
  }, [selectedIndex, completedGames, showCharacter]);

  const handleSelect = useCallback((gameId: GameId) => {
    hideCharacter();
    setTimeout(() => onSelectGame(gameId), 300);
  }, [onSelectGame, hideCharacter]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + games.length) % games.length);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % games.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const game = games[selectedIndex];
      if (game && !game.disabled) handleSelect(game.id);
    }
  }, [selectedIndex, handleSelect]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="level-selection">
      <h2 className="title">Select a Game</h2>
      <div className="games-list">
        {games.map((game, index) => {
          const isCompleted = completedGames.has(game.id);
          const isSelected = index === selectedIndex;

          return (
            <div
              key={game.id}
              className={[
                "game-item",
                isSelected ? "selected" : "",
                isCompleted ? "completed" : "",
                game.disabled ? "disabled" : "",
              ].join(" ")}
              onMouseEnter={() => !game.disabled && setSelectedIndex(index)}
              onClick={() => !game.disabled && handleSelect(game.id)}
            >
              <span className="game-arrow">&gt;</span>
              <span className="game-title">
                {game.title}
                {isCompleted && <span className="completed-badge"> ✓ Completed</span>}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
