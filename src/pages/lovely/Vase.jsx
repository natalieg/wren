import flowerPeony from '../../assets/img/lovely/flower-peony.webp'
import flowerViolet from '../../assets/img/lovely/flower-violet.webp'
import flowerTulip from '../../assets/img/lovely/flower-tulip.webp'
import flowerPoppy from '../../assets/img/lovely/flower-poppy.webp'
import flowerMagenta from '../../assets/img/lovely/flower-magenta.webp'
import mothPink from '../../assets/img/lovely/moth-pink.webp'
import mothBlue from '../../assets/img/lovely/moth-blue.webp'
import mothPinkC from '../../assets/img/lovely/moth-pink-c.webp'
import mothBlueC from '../../assets/img/lovely/moth-blue-c.webp'
import mothBluePink from '../../assets/img/lovely/moth-bluepink.webp'
import mothPinkB from '../../assets/img/lovely/moth-pink-b.webp'
import { MAX_FLOWERS, SPRINKLE_MINUTES } from '../../utils/lovely'

// filled middle first, then outwards — stems all meet in the vase mouth
const SLOTS = [
   { img: flowerPeony, deg: 0, height: 170 },
   { img: flowerViolet, deg: -18, height: 160 },
   { img: flowerTulip, deg: 18, height: 165 },
   { img: flowerPoppy, deg: -34, height: 140 },
   { img: flowerMagenta, deg: 32, height: 145 },
]
// one moth per 30 min of other work, fluttering around the bouquet: [left %, top %, width px, tilt deg]
const MOTHS = [
   { img: mothPink, spot: [4, 10, 46, -14] },
   { img: mothBlue, spot: [80, 4, 42, 12] },
   { img: mothPinkC, spot: [0, 52, 38, 8] },
   { img: mothBlueC, spot: [86, 44, 40, -10] },
   { img: mothBluePink, spot: [22, 0, 32, 18] },
   { img: mothPinkB, spot: [68, 26, 30, -20] },
   { img: mothBlue, spot: [10, 78, 30, -6] },
   { img: mothPink, spot: [84, 78, 32, 14] },
]

const MESSAGES = [
   'your vase is waiting for its first flower',
   'one flower, and it’s already a lovely day',
   'two flowers! look at you ✧',
   'three flowers, what a soft little day',
   'four! the vase is getting full',
   'a whole bouquet. you were so kind to yourself today',
]

export default function Vase({ flowers, sprinkles }) {
   const count = Math.min(flowers.length, MAX_FLOWERS)
   const shownMoths = Math.min(sprinkles, MOTHS.length)

   return (
      <section>
         <h2 className='font-hand text-4xl font-bold text-[#6b5486]'>today&apos;s bouquet</h2>
         <div className='relative h-64 mt-1'
            title={`a moth for every ${SPRINKLE_MINUTES} min of other work`}>
            {MOTHS.slice(0, shownMoths).map(({ img, spot: [left, top, width, deg] }, i) =>
               <img key={i} src={img} alt='' aria-hidden='true' className='absolute select-none pastel-soft z-20'
                  style={{ left: `${left}%`, top: `${top}%`, width, transform: `rotate(${deg}deg)` }} />)}
            {SLOTS.slice(0, count).map((slot, i) =>
               <img key={i} src={slot.img} alt={flowers[i].label}
                  className='absolute left-1/2 bottom-17.5 w-auto max-w-none'
                  style={{ height: slot.height, transform: `translateX(-50%) rotate(${slot.deg}deg)`, transformOrigin: 'bottom center' }} />)}
            <div aria-hidden='true'
               className='absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-24 border-[2.5px] border-t-0 border-border-strong rounded-b-[44px] rounded-t-[10px] bg-[#e3ccff]/40' />
         </div>
         <p className='font-hand text-2xl leading-tight text-[#7a52b3] text-center mt-3'>{MESSAGES[count]}</p>
         {sprinkles > 0 &&
            <p className='text-xs text-text-secondary/50 text-center mt-1'>
               {sprinkles} {sprinkles === 1 ? 'moth' : 'moths'} for {sprinkles * SPRINKLE_MINUTES} min of other work
            </p>}
      </section>
   )
}
