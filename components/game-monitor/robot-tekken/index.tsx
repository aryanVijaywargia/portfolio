import React, { useState, useEffect } from "react";
import { useCharacterOverlay } from "../rick-overlay-context";

type Move = { name: string; damage: number; description: string };
type Fighter = { id: string; name: string; hp: number; maxHp: number; moves: Move[] };

const fighters: Fighter[] = [
  {
    id: "f1",
    name: "Johnny 5",
    hp: 100,
    maxHp: 100,
    moves: [
      { name: "Laser", damage: 15, description: "Shoots a laser" },
      { name: "Punch", damage: 10, description: "Basic punch" },
    ],
  },
  {
    id: "f2",
    name: "Terminator",
    hp: 120,
    maxHp: 120,
    moves: [
      { name: "Crush", damage: 20, description: "Heavy attack" },
      { name: "Kick", damage: 12, description: "Basic kick" },
    ],
  },
  {
    id: "f3",
    name: "Wall-E",
    hp: 80,
    maxHp: 80,
    moves: [
      { name: "Trash Compact", damage: 25, description: "High damage" },
      { name: "Tread Roll", damage: 8, description: "Low damage" },
    ],
  },
];

type Props = { onBack: () => void; onComplete?: () => void };

export const RobotTekken: React.FC<Props> = ({ onBack, onComplete }) => {
  const { showCharacter } = useCharacterOverlay();

  const [playerFighter, setPlayerFighter] = useState<Fighter | null>(null);
  const [opponentFighter, setOpponentFighter] = useState<Fighter | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [gameOver, setGameOver] = useState<"win" | "lose" | null>(null);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);

  const startGame = (fighter: Fighter) => {
    setPlayerFighter(fighter);
    const opponents = fighters.filter((f) => f.id !== fighter.id);
    const opponent = opponents[Math.floor(Math.random() * opponents.length)];
    setOpponentFighter({ ...opponent });
    setGameStarted(true);
    setBattleLog([`Battle start! ${fighter.name} vs ${opponent.name}`]);
    showCharacter(`Good luck! Don't let ${opponent.name} turn you into scrap!`, "excited");
  };

  const handlePlayerMove = (move: Move) => {
    if (!isPlayerTurn || gameOver || !playerFighter || !opponentFighter) return;

    setIsPlayerTurn(false);
    const newOpponentHp = Math.max(0, opponentFighter.hp - move.damage);
    setOpponentFighter((prev) => ({ ...prev!, hp: newOpponentHp }));
    setBattleLog((prev) => [
      ...prev,
      `${playerFighter.name} used ${move.name} for ${move.damage} damage!`,
    ]);

    if (newOpponentHp === 0) {
      setGameOver("win");
      if (onComplete) onComplete();
      showCharacter("You won! Incredible!", "excited");
      return;
    }

    setTimeout(() => opponentTurn(newOpponentHp), 1000);
  };

  const opponentTurn = (currentOpponentHp: number) => {
    if (!opponentFighter || !playerFighter || currentOpponentHp === 0) return;

    const move = opponentFighter.moves[Math.floor(Math.random() * opponentFighter.moves.length)];
    const newPlayerHp = Math.max(0, playerFighter.hp - move.damage);
    setPlayerFighter((prev) => ({ ...prev!, hp: newPlayerHp }));
    setBattleLog((prev) => [
      ...prev,
      `${opponentFighter.name} used ${move.name} for ${move.damage} damage!`,
    ]);

    if (newPlayerHp === 0) {
      setGameOver("lose");
      showCharacter("Oh no... you got trashed.", "panic");
    } else {
      setIsPlayerTurn(true);
    }
  };

  if (!gameStarted) {
    return (
      <div
        style={{
          padding: "2rem",
          height: "100%",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2 style={{ fontSize: "2rem", marginBottom: "2rem" }}>Select Your Fighter</h2>
        <div style={{ display: "flex", gap: "1rem" }}>
          {fighters.map((f) => (
            <div
              key={f.id}
              onClick={() => startGame(f)}
              style={{
                padding: "1rem",
                border: "1px solid var(--bulma-primary)",
                cursor: "pointer",
                borderRadius: "8px",
              }}
            >
              <h3>{f.name}</h3>
              <p>HP: {f.hp}</p>
            </div>
          ))}
        </div>
        <button
          onClick={onBack}
          style={{
            marginTop: "2rem",
            background: "transparent",
            color: "var(--bulma-primary)",
            border: "1px solid var(--bulma-primary)",
            padding: "0.5rem 1rem",
            cursor: "pointer",
          }}
        >
          Back to Menu
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "1rem", height: "100%", display: "flex", flexDirection: "column" }}>
      {gameOver && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.9)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
          }}
        >
          <h2 style={{ fontSize: "3rem", color: gameOver === "win" ? "green" : "red" }}>
            {gameOver === "win" ? "YOU WIN" : "YOU LOSE"}
          </h2>
          <button
            onClick={onBack}
            style={{
              marginTop: "1rem",
              padding: "0.5rem 1rem",
              cursor: "pointer",
              background: "var(--bulma-primary)",
              border: "none",
              color: "black",
              fontWeight: "bold",
            }}
          >
            Return to Menu
          </button>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", flex: 1 }}>
        <div
          style={{
            flex: 1,
            border: "1px solid red",
            padding: "1rem",
            margin: "1rem",
            textAlign: "center",
          }}
        >
          <h3>{opponentFighter?.name}</h3>
          <p>
            HP: {opponentFighter?.hp} / {opponentFighter?.maxHp}
          </p>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          border: "1px solid #444",
          margin: "1rem",
          overflowY: "auto",
          padding: "1rem",
          fontSize: "0.8rem",
          background: "rgba(0,0,0,0.5)",
        }}
      >
        {battleLog.map((log, i) => (
          <div key={i}>{log}</div>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", flex: 1 }}>
        <div
          style={{
            flex: 1,
            border: "1px solid green",
            padding: "1rem",
            margin: "1rem",
            textAlign: "center",
          }}
        >
          <h3>{playerFighter?.name}</h3>
          <p>
            HP: {playerFighter?.hp} / {playerFighter?.maxHp}
          </p>
          <div
            style={{ display: "flex", gap: "0.5rem", justifyContent: "center", marginTop: "1rem" }}
          >
            {playerFighter?.moves.map((m) => (
              <button
                key={m.name}
                onClick={() => handlePlayerMove(m)}
                disabled={!isPlayerTurn || !!gameOver}
                style={{
                  padding: "0.5rem",
                  background: "transparent",
                  color: "var(--bulma-primary)",
                  border: "1px solid var(--bulma-primary)",
                  cursor: isPlayerTurn && !gameOver ? "pointer" : "not-allowed",
                  opacity: isPlayerTurn ? 1 : 0.5,
                }}
              >
                {m.name} ({m.damage})
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
