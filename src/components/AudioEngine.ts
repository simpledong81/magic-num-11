// Web Audio API custom synthesizer for child-friendly sound effects
class SimpleAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setMute(muted: boolean) {
    this.isMuted = muted;
  }

  getMute() {
    return this.isMuted;
  }

  // Playful pop sound when digits split or hug
  playPop() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.1);

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.1);
    } catch (e) {
      console.warn('Audio failed to play', e);
    }
  }

  // Magic chime for achievements and answers
  playChime() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.1, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.005, now + idx * 0.08 + 0.25);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.3);
      });
    } catch (e) {
      console.warn('Audio failed to play', e);
    }
  }

  // Sliding sound for numbers shifting
  playSlide() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(150, this.ctx.currentTime + 0.3);

      gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.3);
    } catch (e) {
      console.warn('Audio failed to play', e);
    }
  }

  // Cute train whistle: "Choo-Choo!"
  playTrainWhistle() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      const playWhistleBlast = (startTime: number, duration: number) => {
        // A train whistle usually consists of two notes combined, like G5 (784Hz) and A5 (880Hz)
        const freqs = [784, 880];
        
        freqs.forEach(freq => {
          const osc = this.ctx!.createOscillator();
          const gain = this.ctx!.createGain();

          osc.connect(gain);
          gain.connect(this.ctx!.destination);

          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, startTime);
          
          // Add a slight vibrato for realism
          const vibrato = this.ctx!.createOscillator();
          const vibratoGain = this.ctx!.createGain();
          vibrato.frequency.value = 6; // 6Hz modulation
          vibratoGain.gain.value = 5; // 5Hz frequency depth
          
          vibrato.connect(vibratoGain);
          vibratoGain.connect(osc.frequency);
          
          vibrato.start(startTime);
          vibrato.stop(startTime + duration);

          // Volume envelope
          gain.gain.setValueAtTime(0, startTime);
          gain.gain.linearRampToValueAtTime(0.04, startTime + 0.05);
          gain.gain.setValueAtTime(0.04, startTime + duration - 0.05);
          gain.gain.linearRampToValueAtTime(0, startTime + duration);

          osc.start(startTime);
          osc.stop(startTime + duration);
        });
      };

      // Play double whistle blast "Choo... Choo!"
      playWhistleBlast(now, 0.25);
      playWhistleBlast(now + 0.35, 0.4);
    } catch (e) {
      console.warn('Audio failed to play', e);
    }
  }
}

export const audioEngine = new SimpleAudioEngine();
