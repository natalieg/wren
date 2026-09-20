import Bar from './Bar'

export default function HealthBar({ current, max }) {
    const percentage = max > 0 ? Math.min((current / max) * 100, 100) : 0

    return (
        <div>
            <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Health Points</span>
                <span className="tnum text-text-primary font-medium">{current}/{max}</span>
            </div>
            <div className="mt-1">
                <Bar percent={percentage} color="success" height="h-2" />
            </div>
        </div>
    )
}
