class BattleMusicManager {
  private introAudio: HTMLAudioElement | null = null;
  private loopAudio: HTMLAudioElement | null = null;
  private volume = 0.3;

  load(introUrl: string, loopUrl: string) {
    try {
      this.introAudio = new Audio(introUrl);
      this.introAudio.volume = this.volume;
      this.loopAudio = new Audio(loopUrl);
      this.loopAudio.loop = true;
      this.loopAudio.volume = this.volume;
    } catch (e) {
      console.warn("Audio not supported or failed to load");
    }
  }

  play() {
    if (!this.introAudio || !this.loopAudio) return;
    this.introAudio.play().catch(() => {
      this.loopAudio?.play().catch(() => {});
    });
    this.introAudio.addEventListener(
      "ended",
      () => {
        this.loopAudio?.play().catch(() => {});
      },
      { once: true }
    );
  }

  stop() {
    this.introAudio?.pause();
    if (this.introAudio) this.introAudio.currentTime = 0;
    this.loopAudio?.pause();
    if (this.loopAudio) this.loopAudio.currentTime = 0;
  }

  setVolume(vol: number) {
    this.volume = vol;
    if (this.introAudio) this.introAudio.volume = vol;
    if (this.loopAudio) this.loopAudio.volume = vol;
  }
}
export const battleMusicManager = new BattleMusicManager();
