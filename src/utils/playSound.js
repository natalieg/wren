
export default function playBeep() {
   const ctx = new AudioContext();
   const oscillator = ctx.createOscillator();
   const gain = ctx.createGain();

   oscillator.connect(gain);
   gain.connect(ctx.destination);

   oscillator.type = 'sine';
   oscillator.frequency.value = 880; // Hz
   gain.gain.setValueAtTime(1, ctx.currentTime);
   gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

   oscillator.start(ctx.currentTime);
   oscillator.stop(ctx.currentTime + 0.5);
}

export function playLongWarmTone() {
   const ctx = new AudioContext();
   const oscillator = ctx.createOscillator();
   const gain = ctx.createGain();

   oscillator.connect(gain);
   gain.connect(ctx.destination);

   oscillator.type = 'sine';
   oscillator.frequency.value = 660;
   gain.gain.setValueAtTime(0.0001, ctx.currentTime);
   gain.gain.exponentialRampToValueAtTime(0.6, ctx.currentTime + 0.03);
   gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1);

   oscillator.start(ctx.currentTime);
   oscillator.stop(ctx.currentTime + 1);
}