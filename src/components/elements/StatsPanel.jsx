import Card from './Card'
import StatRow from './StatRow'

const STAT_KEYS = ['str', 'int', 'agi', 'dex', 'vit', 'luk']

export default function StatsPanel({ stats, bonuses = {} }) {
    return (
        <Card title="Stats">
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                {STAT_KEYS.map((key) => (
                    <StatRow
                        key={key}
                        label={key.toUpperCase()}
                        stat={stats[key]}
                        bonus={bonuses[key]}
                    />
                ))}
            </div>
        </Card>
    )
}
