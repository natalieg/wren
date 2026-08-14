import { getSoundUrl, FINISHED_SOUND_ID } from './sounds'
import { loadSettings } from './settings'

// single entry point for playing any catalogued sound — keeps volume applied
// consistently everywhere instead of every call site setting it itself
export function playSoundById(id) {
   const audio = new Audio(getSoundUrl(id))
   audio.volume = loadSettings().soundVolume
   audio.play()
}

export function playFinishedSound() {
   if (!loadSettings().finishedSoundEnabled) return
   playSoundById(FINISHED_SOUND_ID)
}

export function playTimerSound() {
   const { timerSoundEnabled, timerSound } = loadSettings()
   if (!timerSoundEnabled) return
   playSoundById(timerSound)
}

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