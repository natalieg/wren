**1. Zentraler Panel-State** – nicht mehr jeder Floater verwaltet seine Position selbst, sondern ein gemeinsamer Store (Context/Zustand) hält für jedes Panel: `floating | docked | minimized`, Position (wenn floating), Dock-Slot/Reihenfolge (wenn docked).

**2. Drop-Zone-Erkennung** – während des Drags prüfen, ob Pointer/Panel-Kante in der Nähe der Dock-Zone ist (Schwelle in px), Zone optisch highlighten (z.B. Rahmen/Hintergrund-Tint) als Feedback.

**3. Snap-Übergang** – beim Drop wechselt das Panel von "absolute positioniert, eigene Größe" zu "Flex-/Listen-Kind im Dock-Container". Das ist der fummeligste Teil, weil sich das Styling-Modell ändert (inline x/y vs. Layout-gesteuert).

**4. Dock-Container-Layout** – die Zone selbst braucht eigene Logik: gestapelte Panels (vertikal/horizontal), evtl. Reorder per Drag, evtl. Resize-Handle zwischen Dock und Hauptinhalt.

**5. Persistenz** – Zustände in localStorage, sonst ist nach jedem Reload wieder alles floating.

Zum Styling-Punkt: am saubersten ist eine Panel-Komponente mit zwei visuellen Varianten statt zwei Komponenten – Header/Handle bleibt gleich, aber Shadow/Rundung/Backdrop nur im `floating`-State, im `docked`-State flach/inset, gesteuert über ein `variant`-Prop statt Duplizierung. Dann bleibt's konsistent, egal wo das Panel gerade sitzt.

Reihenfolge macht Sinn: Minibar ist ca. Baustein 1+5 in klein, Docking baut danach auf demselben State-Modell auf.