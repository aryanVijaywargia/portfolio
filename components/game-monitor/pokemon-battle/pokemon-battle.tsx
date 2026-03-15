import React, { useState, useEffect, useCallback, useRef, useContext } from "react";
import { Ability, Character, StatusEffect } from "./types";
import { playerCharacters } from "./user-pokemon";
import { attackSoundManager, pokemonSoundManager } from "./sounds";
import { battleMusicManager } from "./battle-music";
import { PokemonStats } from "./pokemon-stats";
import { useCharacterOverlay } from "../rick-overlay-context";
import { AchievementContext } from "../../achievements";
import { ACHIEVEMENTS } from "../../achievements/achievementsList";
import { getAbilityDamage, applyStatusEffectsToDamage, checkDodge, decrementStatusEffects, addStatusEffect } from "./utils";

const enemy1: Character = {
  id: "enemy1",
  name: "ENEMY 1",
  level: "L10",
  hp: 70,
  maxHp: 70,
  sprite: "enemy1",
  image: undefined,
  entranceSound: "enemy1-entrance",
  faintSound: "enemy1-faint",
  abilities: [
    {
      name: "Attack 1",
      type: "attack",
      damage: { min: 3, max: 7 },
      description: "Hits!",
      soundEffect: "absorb",
    },
    {
      name: "Attack 2",
      type: "attack",
      damage: { min: 8, max: 12 },
      description: "Hits hard!",
      soundEffect: "bite",
    },
    { name: "Buff", type: "buff", description: "Powers up", soundEffect: "absorb" },
    { name: "Debuff", type: "debuff", description: "Weakens you", soundEffect: "absorb" },
  ],
};

type MenuState = "main" | "fight" | "pokemon";
type EnemyId = "enemy1" | "enemy2" | "boss";

type Props = {
  onBack: () => void;
  onComplete?: () => void;
};

const getPlayerBuffEffect = (abilityName: string): StatusEffect | null => {
  const effectMap: Record<string, StatusEffect> = {
    Agility: { type: "dodge", value: 50, duration: 2 },
  };
  return effectMap[abilityName] ?? null;
};

const getPlayerDebuffEffect = (abilityName: string): StatusEffect | null => {
  const effectMap: Record<string, StatusEffect> = {
    Growl: { type: "attackReduction", value: 20, duration: 2 },
  };
  return effectMap[abilityName] ?? null;
};

export const PokemonBattle: React.FC<Props> = ({ onBack, onComplete }) => {
  const { showCharacter } = useCharacterOverlay();
  const { addAchievement } = useContext(AchievementContext);

  const [playerTeam, setPlayerTeam] = useState<Character[]>(
    playerCharacters.map((c) => ({ ...c, statusEffects: [] }))
  );
  const [currentEnemy, setCurrentEnemy] = useState<EnemyId>("enemy1");
  const [opponentState, setOpponentState] = useState<Character>({ ...enemy1, statusEffects: [] });
  const [playerState, setPlayerState] = useState<Character>({
    ...playerCharacters[0],
    statusEffects: [],
  });

  const [menuState, setMenuState] = useState<MenuState>("main");
  const [selectedAbilityIndex, setSelectedAbilityIndex] = useState(0);
  const [battleLog, setBattleLog] = useState<string[]>(["A wild ENEMY 1 appeared!"]);
  const [isAnimatingAttack, setIsAnimatingAttack] = useState(false);
  const [showPokemonSelect, setShowPokemonSelect] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [gameLost, setGameLost] = useState(false);

  const battleLogRef = useRef<HTMLDivElement>(null);
  const isProcessingRef = useRef(false);

  useEffect(() => {
    battleMusicManager.load("", "");
    battleMusicManager.play();
    return () => battleMusicManager.stop();
  }, []);

  useEffect(() => {
    pokemonSoundManager.playEntranceSound(opponentState.entranceSound);
  }, [currentEnemy, opponentState.entranceSound]);

  useEffect(() => {
    if (battleLogRef.current) {
      battleLogRef.current.scrollTop = battleLogRef.current.scrollHeight;
    }
  }, [battleLog]);

  const addToLog = (message: string) => {
    setBattleLog((prev) => [...prev, message]);
  };

  const handleAbilityUse = useCallback(async (ability: Ability) => {
    if (isProcessingRef.current) return;
    isProcessingRef.current = true;

    await attackSoundManager.playAttackSound(ability.soundEffect);

    setIsAnimatingAttack(true);
    await new Promise((r) => setTimeout(r, 500));
    setIsAnimatingAttack(false);

    let updatedPlayer = { ...playerState };
    let updatedOpponent = { ...opponentState };

    if (ability.type === "attack") {
      if (checkDodge(updatedOpponent)) {
        addToLog(`${updatedOpponent.name} dodged the attack!`);
      } else {
        const baseDamage = getAbilityDamage(ability.damage);
        const attackDamage = applyStatusEffectsToDamage(baseDamage, updatedPlayer, true);
        const finalDamage = applyStatusEffectsToDamage(attackDamage, updatedOpponent, false);
        updatedOpponent.hp = Math.max(0, updatedOpponent.hp - finalDamage);
        addToLog(`${playerState.name} used ${ability.name} for ${finalDamage} damage!`);
      }
    } else if (ability.type === "buff") {
      const effect = getPlayerBuffEffect(ability.name);
      if (effect) {
        updatedPlayer = addStatusEffect(updatedPlayer, effect);
        addToLog(`${playerState.name} used ${ability.name}!`);
      }
    } else if (ability.type === "debuff") {
      const effect = getPlayerDebuffEffect(ability.name);
      if (effect) {
        updatedOpponent = addStatusEffect(updatedOpponent, effect);
        addToLog(`${playerState.name} used ${ability.name}! ${updatedOpponent.name} is weakened!`);
      }
    }

    updatedPlayer = decrementStatusEffects(updatedPlayer);
    updatedOpponent = decrementStatusEffects(updatedOpponent);

    setPlayerState(updatedPlayer);
    setOpponentState(updatedOpponent);

    if (updatedOpponent.hp <= 0) {
      await pokemonSoundManager.playFaintSound(updatedOpponent.faintSound);
      addToLog(`${updatedOpponent.name} fainted!`);
      handleEnemyDefeated();
      isProcessingRef.current = false;
      return;
    }

    setTimeout(
      () => {
        enemyTurn(updatedPlayer, updatedOpponent);
      },
      1000
    );

    setMenuState("main");
    isProcessingRef.current = false;
  }, [playerState, opponentState]);

  const enemyTurn = useCallback(async (currentPlayer: Character, currentOpponent: Character) => {
    const abilities = currentOpponent.abilities;
    const ability = abilities[Math.floor(Math.random() * abilities.length)];

    await attackSoundManager.playAttackSound(ability.soundEffect);
    addToLog(`${currentOpponent.name} used ${ability.name}!`);

    const updatedPlayer = { ...currentPlayer };

    if (ability.type === "attack") {
      if (checkDodge(updatedPlayer)) {
        addToLog(`${updatedPlayer.name} dodged!`);
      } else {
        const baseDamage = getAbilityDamage(ability.damage);
        const finalDamage = applyStatusEffectsToDamage(baseDamage, updatedPlayer, false);
        updatedPlayer.hp = Math.max(0, updatedPlayer.hp - finalDamage);
        addToLog(`${updatedPlayer.name} took ${finalDamage} damage!`);
      }
    }

    setPlayerTeam((prev) => prev.map((c) => (c.id === updatedPlayer.id ? updatedPlayer : c)));
    setPlayerState(updatedPlayer);

    if (updatedPlayer.hp <= 0) {
      await pokemonSoundManager.playFaintSound(updatedPlayer.faintSound);
      addToLog(`${updatedPlayer.name} fainted!`);

      const nextAlive = playerTeam.find((c) => c.id !== updatedPlayer.id && c.hp > 0);
      if (nextAlive) {
        setPlayerState(nextAlive);
        setShowPokemonSelect(true);
        addToLog(`Switch to another character!`);
      } else {
        setGameLost(true);
        addToLog("You lost! All characters have fainted.");
      }
    }
  }, [playerTeam]);

  const handleEnemyDefeated = () => {
    setGameWon(true);
    addToLog("You won! All enemies defeated!");
    addAchievement(ACHIEVEMENTS.POKEMON_BATTLE_COMPLETE);
    showCharacter("YES! You did it! I'm free!", "excited", 6000);
    setTimeout(() => onComplete?.(), 3000);
  };

  const switchPokemon = (character: Character) => {
    if (character.hp <= 0) return;
    setPlayerState({ ...character, statusEffects: [] });
    setShowPokemonSelect(false);
    setMenuState("main");
  };

  const moveWithinGrid = useCallback(
    (key: string, currentIndex: number, total: number, cols = 2) => {
      if (key === "ArrowUp") return Math.max(0, currentIndex - cols);
      if (key === "ArrowDown") return Math.min(total - 1, currentIndex + cols);
      if (key === "ArrowLeft") return Math.max(0, currentIndex - 1);
      if (key === "ArrowRight") return Math.min(total - 1, currentIndex + 1);
      return currentIndex;
    },
    []
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (menuState === "fight") {
        const navKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
        if (navKeys.includes(e.key)) {
          setSelectedAbilityIndex((prev) =>
            moveWithinGrid(e.key, prev, playerState.abilities.length)
          );
        } else if (e.key === "Enter") {
          handleAbilityUse(playerState.abilities[selectedAbilityIndex]);
        } else if (e.key === "Escape") {
          setMenuState("main");
        }
      } else if (menuState === "main") {
        if (e.key === "z" || e.key === "Z") setMenuState("fight");
        if (e.key === "x" || e.key === "X") setShowPokemonSelect(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [menuState, selectedAbilityIndex, playerState, handleAbilityUse, moveWithinGrid]);

  return (
    <div className="pokemon-battle">
      {showPokemonSelect && (
        <div className="pokemon-select-modal">
          <h3>Choose a Pokemon</h3>
          {playerTeam.map((char) => (
            <div
              key={char.id}
              className={`pokemon-option ${char.hp <= 0 ? "fainted" : ""} ${
                playerState.id === char.id ? "active" : ""
              }`}
              onClick={() => switchPokemon(char)}
            >
              <span>{char.name}</span>
              <span>{char.level}</span>
              <span>
                HP: {char.hp}/{char.maxHp}
              </span>
            </div>
          ))}
          <button onClick={() => setShowPokemonSelect(false)}>Cancel</button>
        </div>
      )}

      {(gameWon || gameLost) && (
        <div className="game-over-overlay">
          <h2>{gameWon ? "Victory!" : "Defeat!"}</h2>
          <p>{gameWon ? "You escaped!" : "All characters fainted!"}</p>
          <button onClick={onBack}>Return to Menu</button>
        </div>
      )}

      <div className="battle-area">
        <div className="opponent-section">
          <PokemonStats character={opponentState} isOpponent={true} />
          <div className={`opponent-sprite ${opponentState.hp <= 0 ? "fainted" : ""}`}>
            <div
              style={{ width: "100px", height: "100px", background: "red", marginTop: "1rem" }}
            />
          </div>
        </div>

        <div className={`player-section ${isAnimatingAttack ? "attacking" : ""}`}>
          <div className={`player-sprite ${playerState.hp <= 0 ? "fainted" : ""}`}>
            <div
              style={{ width: "100px", height: "100px", background: "blue", marginBottom: "1rem" }}
            />
          </div>
          <PokemonStats character={playerState} isOpponent={false} />
        </div>
      </div>

      <div className="battle-controls">
        <div className="battle-log" ref={battleLogRef}>
          {battleLog.slice(-6).map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>

        <div className="battle-menu">
          {menuState === "main" && (
            <div className="main-menu">
              <button onClick={() => setMenuState("fight")}>FIGHT</button>
              <button onClick={() => setShowPokemonSelect(true)}>PkMn</button>
              <button disabled>ITEM</button>
              <button onClick={onBack}>RUN</button>
            </div>
          )}

          {menuState === "fight" && (
            <div className="fight-menu">
              {playerState.abilities.map((ability, index) => (
                <button
                  key={ability.name}
                  className={index === selectedAbilityIndex ? "selected" : ""}
                  onClick={() => handleAbilityUse(ability)}
                >
                  <span>{ability.name}</span>
                  <span className="ability-type">{ability.type}</span>
                </button>
              ))}
              <button className="back-btn" onClick={() => setMenuState("main")}>
                Back
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
