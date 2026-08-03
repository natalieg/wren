// todo evaluate if the whole header should be pulled out of other comps to handle it here
export default function Header({ label, glyphs = "✧ ✦", fontSize = "text-5xl", glyphSize = 'text-md', className = "" }) {
    const reversedGlyphs = glyphs.split('').reverse().join('')
    const glyphClass = glyphSize

    return (
        <div
            className={`flex space-x-2 items-end font-title text-text-primary ${className}`}>
            <span className={glyphClass}>{glyphs}</span>
            <span className={fontSize}>{label}</span>
            <span className={glyphClass}>{reversedGlyphs}</span>
        </div>
    )
}
