import DocWrapper from '../components/DocWrapper'
import Header from '../components/elements/Header'
import { GlyphBorder } from '../components/elements/GlyphBorder'
import { parseChangelog, splitInlineCode } from '../utils/changelog'
import { version as currentVersion } from '../../package.json'
import changelogRaw from '../../CHANGELOG.md?raw'

const { intro, entries } = parseChangelog(changelogRaw)

export default function Changelog() {
   return (
      <DocWrapper header='Changelog'>
         <div className='w-full flex flex-col items-center gap-6'>
            {intro && (
               <p className='max-w-[70ch] text-center text-sm text-text-muted px-4'>
                  {intro}
               </p>
            )}

            {entries.map(entry => (
               <GlyphBorder key={entry.version} variant='corners' glyph='⊡'
                  color='color-mix(in srgb, var(--color-text-secondary) 30%, transparent)'
                  className='min-w-[80%] max-w-[90%]'>
                  <div className='flex flex-col items-center p-2'>
                     <Header label={entry.version} fontSize='text-2xl' className='pb-1'
                        glyphs='․⁘' glyphSize='text-md' />
                     <p className='text-xs text-text-muted pb-3'>
                        {entry.date}
                        {entry.version === currentVersion && ' · you are here'}
                     </p>
                     <ul className='flex flex-col gap-2 w-full max-w-[70ch] px-2'>
                        {entry.items.map((item, i) => (
                           <li key={i} className='flex gap-2 text-sm text-text-secondary'>
                              <span aria-hidden='true' className='text-text-muted'>✦</span>
                              <span>
                                 {splitInlineCode(item).map((chunk, j) => chunk.code
                                    ? <code key={j}
                                       className='px-1 rounded bg-text-primary/8 text-text-primary text-[0.85em]'>
                                       {chunk.text}
                                    </code>
                                    : <span key={j}>{chunk.text}</span>
                                 )}
                              </span>
                           </li>
                        ))}
                     </ul>
                  </div>
               </GlyphBorder>
            ))}
         </div>
      </DocWrapper>
   )
}
