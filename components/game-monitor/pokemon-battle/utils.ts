import { Character, StatusEffect } from "./types";

export const getAbilityDamage = (
  damage: number | { min: number; max: number } | undefined
): number => {
  if (!damage) return 0;
  if (typeof damage === "number") return damage;
  return Math.floor(Math.random() * (damage.max - damage.min + 1)) + damage.min;
};

export const applyStatusEffectsToDamage = (
  baseDamage: number,
  character: Character,
  isAttacking: boolean
): number => {
  if (!character.statusEffects?.length) return baseDamage;

  let damage = baseDamage;

  for (const effect of character.statusEffects) {
    if (effect.duration <= 0) continue;

    if (isAttacking) {
      if (effect.type === "attackBoost") {
        damage = Math.round(damage * (1 + effect.value / 100));
      } else if (effect.type === "attackReduction") {
        damage = Math.round(damage * (1 - effect.value / 100));
      }
    } else {
      if (effect.type === "defenseBoost") {
        damage = Math.round(damage * (1 - effect.value / 100));
      } else if (effect.type === "defenseReduction") {
        damage = Math.round(damage * (1 + effect.value / 100));
      }
    }
  }

  return Math.max(1, damage);
};

export const checkDodge = (character: Character): boolean => {
  const dodgeEffect = character.statusEffects?.find((e) => e.type === "dodge" && e.duration > 0);
  if (!dodgeEffect) return false;
  return Math.random() * 100 < dodgeEffect.value;
};

export const decrementStatusEffects = (character: Character): Character => ({
  ...character,
  statusEffects: (character.statusEffects || [])
    .map((e) => ({ ...e, duration: e.duration - 1 }))
    .filter((e) => e.duration > 0),
});

export const addStatusEffect = (character: Character, effect: StatusEffect): Character => ({
  ...character,
  statusEffects: [...(character.statusEffects || []).filter((e) => e.type !== effect.type), effect],
});
