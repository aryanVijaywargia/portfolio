export type StatusEffect = {
  type: "attackBoost" | "defenseBoost" | "attackReduction" | "defenseReduction" | "dodge";
  value: number; // Percentage (e.g., 25 = 25%)
  duration: number; // Turns remaining
};

export type AbilitySoundName = string;
export type EntranceSoundName = string;
export type FaintSoundName = string;

export type Ability = {
  name: string;
  type: "attack" | "buff" | "debuff" | "joke";
  damage?: number | { min: number; max: number };
  description: string;
  soundEffect: AbilitySoundName;
};

export type Character = {
  id: string;
  name: string;
  level: string; // "L10", "L50", etc.
  hp: number;
  maxHp: number;
  abilities: Ability[];
  sprite: string; // identifier string
  image?: string; // URL for actual image
  statusEffects?: StatusEffect[];
  entranceSound: EntranceSoundName;
  faintSound: FaintSoundName;
};
