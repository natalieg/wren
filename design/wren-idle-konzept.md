# Wren · Idle System — Konzept & Roadmap

> **Stand:** Juli 2026  
> Lebendiges Dokument — wird mit der Entwicklung erweitert.

---

## Vision

Wren soll sich jeden Morgen zu öffnen lohnen — nicht aus Pflichtgefühl, sondern aus echter Neugier.  
Die Kernfrage: *Was hat mein Charakter heute Nacht erlebt?*

Das Idle-System nutzt genau den Mechanismus der süchtig machenden Idle-Games (MelvorIdle, Rocky Idle, Milky Way Idle):  
die maximale Offline-Zeit von 24h bedeutet, dass es immer einen Grund gibt zurückzukommen — aber nie einen Grund sich gestresst zu fühlen.

**Leitprinzip:** Neugierige Retention, keine strafende Retention.  
Wren lockt dich zurück. Es nutzt keine Schuldgefühle als Währung.

---

## Core Loop

```
☀️  Morgens öffnen
        ↓
🗺️  Nacht-Expedition ansehen + Loot auspacken
        ↓
🎨  Dekorationen platzieren / Sammlung updaten
        ↓
✅  Aufgaben erledigen, Aktivitäten eintragen → Charakter bekommt EXP & Stats
        ↓
📊  Stats und Tagesfortschritt wachsen
        ↓
🔥  Abendlicher Wrap-up am Lagerfeuer (optional aber lohnend)
        ↓
⚔️  Charakter wird in den Dungeon geschickt
        ↓
😴  Neugier auf morgen
```

Das Öffnen der App ist gleichzeitig **Belohnung** (was ist passiert?) und **Einstieg** (was mache ich heute?).  
Die Hürde, den Tag anzulegen, ist viel kleiner, wenn man schon drin ist.

---

## Tag & Nacht — zwei getrennte Progressionsachsen

| Tagsüber | Nachts |
|---|---|
| Aufgaben erledigen → **EXP & Stats** | Charakter erkundet Dungeon → **Loot & Lore** |
| Vertikale Progression (Charakter wird stärker) | Horizontale Progression (Items, Collections, Kosmetik) |
| Spieler hat Kontrolle | Passiv, überraschend |

Diese Trennung verhindert, dass das System einfach "Zahl wird größer" ist.  
Selbst bei hohen Stats gibt es nachts noch Motive, Kristalle, Motten, seltene Events zu entdecken.

---

## Charakter-System

### Stats (Ragnarok-inspiriert)

| Stat | Symbol | Primär durch |
|---|---|---|
| STR | ⚔️ | Krafttraining, schwere körperliche Arbeit, evtl abstraktere Konzepte wie "Stark geblieben" |
| VIT | 💚 | Sport allgemein, Spaziergang, Yoga, Haushalt, Journaling/Selbstfürsorge |
| AGI | 🌀 | Ballett, Haushalt, schnelle Tasks |
| INT | 📖 | Programmieren, Lernen, Schreiben, Kunst |
| DEX | ✨ | Zeichnen, Programmieren, Ballett, Kanji |
| LUK | 🍀 | Zufalls-Proc bei jeder Aktivität |

Jede Aktivität hat einen **primären** und einen **sekundären** Stat:

| Aktivität | Primär | Sekundär |
|---|---|---|
| Programmieren | INT | DEX |
| Zeichnen / Kunst | DEX | INT |
| Schreiben / Storytelling | INT | LUK |
| Ballett | AGI | DEX |
| Krafttraining | STR | VIT |
| Spaziergang / Yoga | VIT | AGI |
| Haushalt | VIT | AGI |
| Lernen / Kanji | INT | DEX |
| Journaling / Selbstfürsorge | VIT | LUK |

**Wichtig:** Es geht nicht darum, einen ausgeglichenen Charakter zu haben — ein INT/DEX-Build ist legitim und interessant. Stats beeinflussen *was* man im Dungeon findet, nicht ob man "gewinnt".

### LUK-Mechanismus

Jede abgeschlossene Aufgabe hat eine kleine Chance, einen **Fortune Spark** (🍀) zu generieren.  
Bei ~10 Sparks steigt LUK um 1. Kein direkter Zufalls-Stat-Gain, damit es langfristig nicht aus dem Ruder läuft.

---

## Life-Area-Goals & EXP-System

### Grundprinzip

Nicht Stunden sind der Maßstab — sondern der **eigene Plan**.  
Wenn du Arbeit bei 60% deiner Woche einplanst, ist 60% das Optimum, nicht 100%.

### EXP-Berechnung (vereinfacht)

```
EXP = (erreichte % des Tagesziels) × (Budget-Anteil) × Basis-EXP
```

Beispiel (Tages-Budget 100 XP):

| Bereich | Plan | Heute erreicht | EXP |
|---|---|---|---|
| Arbeit | 60% | 80% des Ziels | 48 XP |
| Kunst | 30% | 100% des Ziels | 30 XP |
| Bewegung | 10% | 50% des Ziels | 5 XP |
| **Gesamt** | | | **83 XP** |

**Overachieving:** Bis zum Ziel = normal; bis ~125% = kleiner Bonus; darüber = kein weiterer Gain.  
→ Arbeit wird nicht bestraft, aber grinden um Kunst zu vernachlässigen lohnt sich nicht.
Das sollte vor allem Areas betreffen, die ich machen 'muss' wie zb Arbeit. Bei Dingen die lange liegen geblieben sind, ist es nicht unbedingt verkehrt, mal mehr EXP zu bekommen. Konzept muss explored werden.

### Task-Größe

Zeit ist Hinweis, nicht einziger Wert. Tasks können eine Einschätzung haben:
`klein · normal · groß`
Der Timer schlägt eine Größe vor, aber sie ist überschreibbar.
- Koennte auch bezug auf 'Energie' nehmen wenn implementiert.

### Tagestypen (kein tägliches Erzwingen von Balance)

```
Arbeitstag · Kreativtag · Erholungstag · Gemischter Tag
```

Die Balance wird über **7–14 Tage** gemessen, nicht täglich.  
Ein guter Arbeitstag darf 80% Arbeit sein.

---

## Klassen-System (Ragnarok-inspiriert)

> Ursprünglich als eigene Idee entstanden (`design/gamification.md`, 2026-07-26), jetzt hier zusammengeführt.

Inspiriert vom Klassensystem des frühen Ragnarok Online. Der Charakter startet als "Novize" und schaltet je nachdem, welche Life-Areas am meisten bespielt werden, unterschiedliche Klassenpfade frei — z.B. viel Sport → Thief-Klasse, viel Kunstpraxis → Archer-Klasse. Die Area→Klasse-Zuordnung muss keinen narrativen Sinn ergeben; der Punkt ist Neuheit und ein "Zahlen werden größer"-Grind-Gefühl, das dem Gehirn etwas Neues zum Kauen gibt — genau wie Ragnaroks Grind das ursprünglich geschafft hat.

**Wichtig, in Nats eigenen Worten:** "grindy" ist das Feature, kein Makel, der wegpoliert werden soll — das sollte so bleiben, wenn das System tatsächlich gebaut wird, nicht zu etwas Minimalerem/Ernsterem überarbeitet werden, als es gemeint war.

**Harte Abhängigkeit:** braucht Pro-Area-EXP-Daten aus dem Stat-System — Areas und die Area→Stat-Zuordnung (siehe Charakter-System oben) müssen zuerst existieren.

**Offene Fragen:**
- Braucht Klassen-Unlock jede Area über einer Schwelle, oder entscheidet die am meisten gelevelte Area allein (und kann sich das mit der Zeit verschieben, wenn sich der Fokus verschiebt)?
- Sind Klassen rein kosmetisches Flavor, oder schalten sie auch etwas Funktionales frei (area-spezifische Features, nicht nur Pets)?
- Wie hängen Pets mit Klassen zusammen — ein separater Reward-Track, oder klassen-spezifische Pets?

---

## Offline-Zeit & Dungeon-Runs

- **Start:** Kurze Runs (Charakter ist noch schwach)
- **Mit der Zeit:** Längere Runs durch höhere Stats (vermutlich VIT und/oder INT)
- **Harte Cap:** Empfehlung ~36–48h maximum, damit der Tagesrhythmus erhalten bleibt
- **Vacation Mode:** Spezielle gimmicky Funde wenn Wren mehrere Tage nicht geöffnet wird — keine Strafe, eher eine kleine "Urlaubsmitbringsel"-Mechanik

### Skip-Day Verhalten

Kein Auftrag = Charakter wartet am Lagerfeuer. Kein Verlust, kein Stress.  
Automatische Mini-Expedition wenn Wrap-up vergessen wurde:

> *Wren wartete eine Weile am Lagerfeuer. Als niemand mehr kam, sammelte sie in der Nähe des Camps einige leuchtende Pilze.*

Manueller Wrap-up bleibt attraktiver (bessere Vorbereitung, mehr Loot) — aber das System bestraft nicht.

**Inbox nach Tagesabschluss:** Die Aufgabenliste sperrt, aber Gedanken/Notizen für morgen können weiterhin eingetragen werden.

---

## Abend-Ritual (Wrap-up am Lagerfeuer)

Die UI wechselt in eine ruhige Nachtversion. Der Charakter sitzt am Feuer.

Felder (alle optional):
- **Mini-Journal:** Was ist heute vorangekommen? Was hat Energie gekostet? Was soll morgen leichter werden?
- **"Heute fehlen mir die Worte"** — vollständiger Wrap-up ohne Text
- **Stimmung:** kleines Mood-Picker (5 Optionen)
- **Mahlzeit-Slot:** optionales Essen für den Charakter mitnehmen (für VIT-Bonus o.ä.)

Dann: `[ Expedition beginnen ]` — Charakter läuft aus dem Bild.

---

## Morgen-Reveal

Nicht einfach eine Loot-Liste, sondern eine kleine Geschichte.

**Route als visuelle Karte:**
```
CAMP ●────●────◆────●────★ EXIT
      Pilze  Falle  Motte  Truhe
```

Beim Klicken klappen kurze Ereignisse auf:
> *Im Moos unter einer umgestürzten Statue entdeckte Wren einen schimmernden Kokon.  
> **DEX-Erfolg:** Der Kokon konnte unbeschädigt geborgen werden.*

Am Ende: Rucksack öffnet sich, Items werden nacheinander aufgedeckt.

---

## Collections & Loot

### Loot-Kategorien

**Sammel-Items** (für Collections):
- 🦋 Motten — Schaukasten / nächtlicher Garten
- 🪲 Käfer — Entomologie-Board
- 💎 Kristalle — beleuchtetes Regal
- 🍄 Pilze — Terrarium
- 🌿 Pflanzen — Herbarium-Seiten
- 📜 Fragment / Inschriften — Lore-Sammlung

**UI-Kosmetik** (tatsächliche App-Veränderungen):
- Button-Farben
- Checkbox-Sets
- Hintergründe / Inventory-Backgrounds
- Fensterrahmen
- Task-Sticker
- Corner Decorations

Styles sind **kombinierbar** (kein kompletter Theme-Zwang):  
Fensterrahmen von hier, Buttons von dort, Hintergrund selbst gewählt.

### Dekorationen auf der Main-Page

**Zone-System statt freeform Drag:** Die Main-Page hat 3–4 definierte Bereiche mit je 2–3 Slots.  
User wählt welches Item wo landet — das genaue Pixel-Placement macht das System.  
→ Persönlich, aber kein Code-Chaos und kein selbst-gecluterter Screen.

Limit sichtbarer Items (z.B. 6–8 gleichzeitig), der Rest bleibt in der Sammlung.

---

## Boss-System

### Konzept

Alle X Dungeon-Ebenen gibt es einen Boss. Nicht bestrafend, sondern herausfordernd.

Jeder Boss hat **mehrere Lösungswege** basierend auf Stats:

```
STR   → Das versiegelte Tor aufbrechen
INT   → Die Schutzrunen entschlüsseln
DEX   → Einen verborgenen Mechanismus finden
VIT   → Die lange Belagerung überstehen
LUK   → Einen seltenen alternativen Eingang entdecken
```

Fehlende Stärke = kein sofortiges Scheitern, sondern:
- mehrere Nächte nötig
- mehr Essen/Ressourcen verbraucht
- längere Route

**Boss-Preview auf der Main-Page:**
```
Nächster Boss: Dunkel-Salamander · Tiefe 15
Empfohlen: STR 60, VIT 70
```

---

## Pet-System

Das Pet hat eine **eigene Nacht-Progression** — levelt nur durch gemeinsame Expeditionen, nicht durch Tagesaktivitäten.

Das Pet bestimmt **Loot-Fokus** der Nacht:
- 🦋 Motten-Pet → seltene Insekten
- 🫧 Schleim → Materialien & Essen
- 🐦 Vogel → Kartenfragmente, glänzende Dinge
- 🍄 Pilzgeist → Pflanzen, Tränke-Zutaten
- 🎲 Poring-artiges → viel zufälliger Kleinkram

**Wichtig:** Kein Tamagotchi — das Pet wird nicht traurig oder verhungert nicht.  
Es ist Begleitung, keine weitere Verantwortung.

**Spätere Synergie:** Chara levelt tagsüber, Pet levelt nachts. Beide wachsen parallel, aber unabhängig.

---

## AI-generierte Dungeon-Events

### Ziel

Claude generiert die Erzähl-Ebene der Dungeon-Ereignisse → Nat hat einen echten Überraschungseffekt.  
Die **Spielökonomie bleibt deterministisch** — die KI schreibt Flavor Text, nicht die Rewards.

### Workflow

Das System bestimmt:
- Biom, Stat-Check, Erfolg/Misserfolg, Seltenheit, Belohnung

Claude bekommt strukturierte Daten:
```json
{
  "biom": "Mondschein-Ruinen",
  "event_type": "Fund",
  "stat_check": "DEX",
  "erfolg": true,
  "belohnung": "seltene Motte",
  "stimmung": "ruhig, leicht unheimlich",
  "max_wörter": 60
}
```

Und schreibt daraus den Ereignis-Text.

### Event-Karten-Tags (für spätere Datenbank)

```
biom · event_type · rarity · required_stat · success_text · 
alternate_text · loot_tags · previously_seen
```

**Späteres Feature:** Ereignisketten — Wren findet Nacht 1 eine verschlossene Tür, Nacht 5 den Schlüssel, Woche 3 den Raum dahinter.

---

## Charakter-Sprites & Outfits

### Tool-Empfehlung

**Aseprite** (ca. 20€, einmalig) — Standard für Pixel Art mit Layer- und Animations-Support.  
Exportiert Sprites direkt so wie sie gebraucht werden.

Alternativ: Photoshop mit Layer-Export-Convention.  
"Export Layers as Files" → transparente PNGs pro Kleidungsstück.

### Layering im Web

```
[base body] → [hair] → [outfit-bottom] → [outfit-top] → [accessory]
```

Jede Layer = `<img>` mit `position: absolute`, transparent PNG, CSS z-index.  
Kein Framework nötig.

**Animationen:** Selbst kleine Idle-Animationen (Charakter atmet, wippt leicht) machen enorm viel aus.

---

## Design-Prinzipien

1. **Neugierige Retention** — nicht strafende Retention
2. **Kein FOMO** — Cosmetics sind Bonus, kein notwendiger Fortschritt
3. **Eigener Plan ist Maßstab** — nicht ein fremder Standard
4. **Tage können unterschiedlich sein** — Balance über Wochen, nicht täglich
5. **Alles optional, nichts blockierend** — Journal, Wrap-up, Pet-Fütterung
6. **Builds entstehen lassen** — INT/DEX-Build ist genauso valid wie ein balanced Build
7. **Die App verändert sich mit dem Spieler** — freigespielte Kosmetik macht Wren persönlich

---

## Roadmap

### 🌱 MVP — "Funktioniert der Loop?"

**Ziel:** Herausfinden ob der Morgen-Reveal-Moment sich gut anfühlt.

- [ ] Tasks können einer Kategorie zugeordnet werden
- [ ] Abgeschlossene Tasks geben 2 Stats etwas EXP
- [ ] "Tag abschließen" speichert Zeitpunkt und startet Expedition
- [ ] Beim nächsten Öffnen: kurzer zufälliger Expeditionsbericht
- [ ] 1–3 Items werden "gefunden"
- [ ] 1 Item kann in ein sichtbares Sammlungsregal gelegt werden

> Test-Frage: *Freue ich mich morgen früh darauf, Wren zu öffnen?*

---

### 🌿 Phase 2 — "Der Charakter lebt"

- [ ] Alle 6 Stats mit Anzeige + EXP-Progression
- [ ] Life Area Goals konfigurierbar
- [ ] Proportionale EXP-Berechnung
- [ ] Offline-Zeit basierend auf Stats (Start: kurz, levelt mit VIT/INT)
- [ ] Abend-Wrap-up als eigener Screen mit Lagerfeuer-Vibe
- [ ] Morgen-Reveal als Route/Karte mit aufklappbaren Ereignissen
- [ ] AI-generierte Event-Texte (Claude API)
- [ ] Vacation Mode (kein Dungeon-Run, Mitbringsel)

---

### 🌳 Phase 3 — "Wren wird persönlich"

- [ ] UI-Kosmetik als Loot (Button-Farben, Checkboxen, Hintergründe)
- [ ] Zone-System für Main-Page-Dekoration
- [ ] Collections (Motten, Käfer, Kristalle) mit eigenen Display-Bereichen
- [ ] Charakter-Sprite mit Outfit-Layering
- [ ] Pet-System (Nacht-Progression, Loot-Fokus)
- [ ] Boss-Preview auf Main-Page
- [ ] Boss-System mit stat-basierten Lösungswegen
- [ ] Klassen-System (Ragnarok-inspiriert) — braucht Pro-Area-EXP aus dem Stat-System

---

### 🏔️ Phase 4 — "Langfristige Tiefe"

- [ ] Ereignisketten (mehrteilige Dungeon-Geschichten)
- [ ] Charakter-Animationen (Idle, Walk, Schlafen)
- [ ] Eigene gezeichnete Collection-Items integrieren
- [ ] Erweiterter Loot-Pool mit Community-Input (oder AI-Variationen)
- [ ] Rucksack / Inventar-System
- [ ] Essen-Items für den Charakter (VIT-Boosts für Expeditionen)

---

## Offene Fragen & Notes

- **Stat-Cap:** Gibt es eine Maximal-Zahl pro Stat, oder wächst es unbegrenzt?
- **EXP-Kurven:** Wird das Leveln mit der Zeit immer schwerer (RPG-typisch)?
- **Biome:** Welche Dungeon-Biome gibt es? (Mondschein-Ruinen, Pilz-Wald, Crystal Cave...?)
- **Charakter-Name:** "Navi" als Platzhalter, oder frei wählbar?
- **Stil:** Pixel Art vs. illustrativ für Charakter und Items?

---

*Idee entwickelt Juli 2026*
