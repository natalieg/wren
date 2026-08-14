// timer-sound catalogue — glob-imported so dropping a .wav into assets/sounds
// is enough to make it pickable, no manual registration needed
const soundFiles = import.meta.glob('../assets/sounds/*.wav', { eager: true, import: 'default' })

const soundsById = Object.fromEntries(
  Object.entries(soundFiles).map(([path, url]) => [path.match(/([^/]+)\.wav$/)[1], url])
)

// reserved as the fixed 'task finished' sound, excluded from the timer-sound picker
export const FINISHED_SOUND_ID = 'happyBell2'

export const timerSoundIds = Object.keys(soundsById).filter(id => id !== FINISHED_SOUND_ID)

export const getSoundUrl = (id) => soundsById[id]
