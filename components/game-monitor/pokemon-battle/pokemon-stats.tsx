import React from "react";
import { Character } from "./types";

type Props = {
  character: Character;
  isOpponent: boolean;
};

export const PokemonStats: React.FC<Props> = ({ character, isOpponent }) => {
  const hpPercent = Math.max(0, (character.hp / character.maxHp) * 100);

  let hpClass = "hp-high";
  if (hpPercent < 10) hpClass = "hp-critical";
  else if (hpPercent < 30) hpClass = "hp-low";

  return (
    <div className={`pokemon-stats ${isOpponent ? "opponent" : "player"}`}>
      <div className="name-level">
        <span className="name">{character.name}</span>
        <span className="level">{character.level}</span>
      </div>
      <div className="hp-container">
        <span className="hp-label">HP</span>
        <div className="hp-track">
          <div
            className={`hp-fill ${hpClass}`}
            style={{ width: `${hpPercent}%`, transition: "width 0.5s ease" }}
          />
        </div>
      </div>
      {!isOpponent && (
        <div className="hp-numbers">
          {character.hp} / {character.maxHp}
        </div>
      )}
    </div>
  );
};
