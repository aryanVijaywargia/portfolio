class AttackSoundManager {
  async playAttackSound(sound: string) {
    // Mocked for Next.js env to avoid missing asset errors
    console.log("Playing sound:", sound);
  }
}
export const attackSoundManager = new AttackSoundManager();

class PokemonSoundManager {
  async playEntranceSound(sound: string) {
    console.log("Playing entrance sound:", sound);
  }
  async playFaintSound(sound: string) {
    console.log("Playing faint sound:", sound);
  }
}
export const pokemonSoundManager = new PokemonSoundManager();
