import { useState, useEffect } from 'react'
import { CHARACTER_STORAGE_KEY, DEFAULT_CHARACTER, loadCharacter, getExpForNextLevel, getExpForNextClassLevel } from '../utils/character'



function useCharacter() {
    const [character, setCharacter] = useState(loadCharacter)

    useEffect(() => {
        localStorage.setItem(CHARACTER_STORAGE_KEY, JSON.stringify(character))
    }, [character])

    const updateCharacter = (key, value) => {
        setCharacter(current => ({ ...current, [key]: value }))
    }

    function addStatExp(statKey, expToAdd) {
        setCharacter(current => {
            if (current.activated === false) {
                console.warn('Character is not activated. Cannot add experience.')
                return current
            }
            const stat = current.stats[statKey]
            const newStatExp = stat.exp + expToAdd
            const newStatLevel = newStatExp >= getExpForNextLevel(stat.level) ? stat.level + 1 : stat.level

            const newClassExp = current.class.exp + expToAdd
            const newClassLevel = newClassExp >= getExpForNextClassLevel(current.class.level) ? current.class.level + 1 : current.class.level

            return {
                ...current,
                stats: {
                    ...current.stats,
                    [statKey]: { level: newStatLevel, exp: newStatExp }
                },
                class: {
                    ...current.class,
                    level: newClassLevel,
                    exp: newClassExp
                }
            }
        })
    }

    function resetCharacter() {
        setCharacter(DEFAULT_CHARACTER)
    }



    return { character, updateCharacter, addStatExp, resetCharacter }

}

export default useCharacter