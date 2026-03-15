import { Character } from "./types";

export const playerCharacters: Character[] = [
  {
    id: "character-a",
    name: "PIKACHU (V1)",
    level: "L10",
    hp: 69,
    maxHp: 69,
    sprite: "character-a",
    image: undefined,
    entranceSound: "character-a-entrance",
    faintSound: "character-a-faint",
    statusEffects: [],
    abilities: [
      {
        name: "Thunder Shock",
        type: "attack",
        damage: { min: 18, max: 25 },
        description: "Electric attack!",
        soundEffect: "thunderbolt",
      },
      {
        name: "Tail Whip",
        type: "attack",
        damage: 15,
        description: "Basic hit",
        soundEffect: "absorb",
      },
      { name: "Agility", type: "buff", description: "Boosts speed", soundEffect: "absorb" },
      { name: "Growl", type: "debuff", description: "Reduces enemy attack", soundEffect: "absorb" },
    ],
  },
  {
    id: "character-b",
    name: "CHARMANDER (V2)",
    level: "L12",
    hp: 55,
    maxHp: 55,
    sprite: "character-b",
    image: undefined,
    entranceSound: "character-b-entrance",
    faintSound: "character-b-faint",
    statusEffects: [],
    abilities: [
      {
        name: "Ember",
        type: "attack",
        damage: { min: 20, max: 30 },
        description: "Fire attack!",
        soundEffect: "thunderbolt",
      },
      {
        name: "Scratch",
        type: "attack",
        damage: 10,
        description: "Basic hit",
        soundEffect: "absorb",
      },
    ],
  },
];
