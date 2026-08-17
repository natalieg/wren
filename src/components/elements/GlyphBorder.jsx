// ─────────────────────────────────────────────
//  GlyphBorder
//
//  Props:
//    glyph       — Symbol for all positions  (default "✦")
//    cornerGlyph — Overrides glyph for corners
//    centerGlyph   — Overrides glyph for edge midpoints
//    variant     — "corners" | "center" | "both"  (default "corners")
//    glyphSize   — Glyph size in px           (default 20)
//    color       — Color for lines + glyphs  (default "currentColor")
//    borderWidth — Line width in px           (default 1)
//    padding     — Inner spacing             (default 32)
//    style / className — passed through to the container
// ─────────────────────────────────────────────

export function GlyphBorder({
    children,
    glyph = "✦",
    cornerGlyph,
    centerGlyph,
    variant = "corners",
    glyphSize = 20,
    color = "currentColor",
    borderWidth = 1,
    padding = 6,
    style,
    className = "",
}) {
    const cg = cornerGlyph ?? glyph;
    const ceng = centerGlyph ?? glyph;
    const h = glyphSize / 2;

    const showCorners = variant === "corners" || variant === "both";
    const showEdges = variant === "center" || variant === "both";

    // ── Glyph span ─────────────────────────────
    const Glyph = ({ content, pos }) => (
        <span
            aria-hidden="true"
            style={{
                position: "absolute",
                fontSize: glyphSize,
                lineHeight: 1,
                color,
                width: glyphSize,
                height: glyphSize,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                pointerEvents: "none",
                userSelect: "none",
                ...pos,
            }}
        >
            {content}
        </span>
    );

    // Line span
    const Line = ({ pos }) => (
        <span
            aria-hidden="true"
            style={{
                position: "absolute",
                backgroundColor: color,
                pointerEvents: "none",
                ...pos,
            }}
        />
    );

    // ── Line segments depending on variant ───
    //
    //  "corners" → one line per edge, gaps only at the corners
    //  "center"   → two segments per edge, gap in the middle
    //  "both"    → two segments per edge, gaps at corners + middle
    //
    const lines = [];

    if (variant === "corners") {
        // Four full edges, each with an h-offset at both ends
        lines.push(
            { height: borderWidth, top: 0, left: h, right: h },
            { height: borderWidth, bottom: 0, left: h, right: h },
            { width: borderWidth, left: 0, top: h, bottom: h },
            { width: borderWidth, right: 0, top: h, bottom: h },
        );
    } else if (variant === "center") {
        // Two segments per edge around the center point
        lines.push(
            // Top: left ↔ center glyph
            { height: borderWidth, top: 0, left: 0, right: `calc(50% + ${h}px)` },
            { height: borderWidth, top: 0, left: `calc(50% + ${h}px)`, right: 0 },
            // Bottom
            { height: borderWidth, bottom: 0, left: 0, right: `calc(50% + ${h}px)` },
            { height: borderWidth, bottom: 0, left: `calc(50% + ${h}px)`, right: 0 },
            // Left
            { width: borderWidth, left: 0, top: 0, bottom: `calc(50% + ${h}px)` },
            { width: borderWidth, left: 0, top: `calc(50% + ${h}px)`, bottom: 0 },
            // Right
            { width: borderWidth, right: 0, top: 0, bottom: `calc(50% + ${h}px)` },
            { width: borderWidth, right: 0, top: `calc(50% + ${h}px)`, bottom: 0 },
        );
    } else {
        // "both" → gaps at corners AND midpoints
        lines.push(
            // Top: corner → center glyph, center glyph → corner
            { height: borderWidth, top: 0, left: h, right: `calc(50% + ${h}px)` },
            { height: borderWidth, top: 0, left: `calc(50% + ${h}px)`, right: h },
            // Bottom
            { height: borderWidth, bottom: 0, left: h, right: `calc(50% + ${h}px)` },
            { height: borderWidth, bottom: 0, left: `calc(50% + ${h}px)`, right: h },
            // Left
            { width: borderWidth, left: 0, top: h, bottom: `calc(50% + ${h}px)` },
            { width: borderWidth, left: 0, top: `calc(50% + ${h}px)`, bottom: h },
            // Right
            { width: borderWidth, right: 0, top: h, bottom: `calc(50% + ${h}px)` },
            { width: borderWidth, right: 0, top: `calc(50% + ${h}px)`, bottom: h },
        );
    }

    // Glyph positions
    const cornerPositions = [
        { top: -h, left: -h },
        { top: -h, right: -h },
        { bottom: -h, left: -h },
        { bottom: -h, right: -h },
    ];

    const edgePositions = [
        { top: -h, left: "50%", transform: "translateX(-50%)" },
        { bottom: -h, left: "50%", transform: "translateX(-50%)" },
        { left: -h, top: "50%", transform: "translateY(-50%)" },
        { right: -h, top: "50%", transform: "translateY(-50%)" },
    ];

    return (
        <div
            className={className}
            style={{
                position: "relative",
                padding,
                boxSizing: "border-box",
                ...style,
            }}
        >
            {lines.map((pos, i) => <Line key={i} pos={pos} />)}

            {showCorners && cornerPositions.map((pos, i) => (
                <Glyph key={`c${i}`} content={cg} pos={pos} />
            ))}

            {showEdges && edgePositions.map((pos, i) => (
                <Glyph key={`e${i}`} content={ceng} pos={pos} />
            ))}

            {children}
        </div>
    );
}