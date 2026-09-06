import React, { useEffect, useState } from 'react'
import useCharacter from '../../hooks/useCharacter'
import DocWrapper from '../../components/DocWrapper'
import StatRow from '../../components/elements/StatRow'



export default function Character() {
  const { character, updateCharacter, addStatExp, resetCharacter } = useCharacter()
  const [isEditingName, setIsEditingName] = useState(false)
  const [nameDraft, setNameDraft] = useState(character.name)


  const savedTasks = localStorage.getItem('tasks')

  const [dummyData, setDummyData] = useState([{
    id: "1",
    finished: false,
    label: "hallo anu",
    time: 20,
    list: "active",
    area: "work",
    effort: 3,
  },
  {
    id: "2",
    finished: false,
    label: "hallo anu 2",
    time: 40,
    list: "active",
    area: "work",
    effort: 2,
  },])

  const [userExp, setUserExp] = useState(0)

  const changeFinishedStatus = (taskId) => {
    const taskNowFinished = dummyData.find(task => task.id === taskId)?.finished;
    setDummyData(prevData => {
      const updatedData = prevData.map(task => {
        if (task.id === taskId) {
          return { ...task, finished: !task.finished };
        }
        return task;
      });
      return updatedData;
    });
    setUserExp(prevExp => prevExp + (taskNowFinished ? -1 : 1));
    if (!taskNowFinished) {
      areaObject.stats.forEach(statName => addStatExp(statName, task.effort))
    }
  }

  // task is marked finished > 
  // which area?
  // howmuch effort?
  // areaExp = effort * something

  const areaObject = {
    id: 1,
    name: "work",
    exp: 0,
    stats: ['vit', 'int']
  }

  // when task is finished, find stats that correspond to area and add exp to them

  // add exp to eg 'vit' and 'int'

  const statArray = [
    {
      id: 1,
      name: 'vit',
      level: 1,
      exp: 0
    },
    {
      id: 2,
      name: 'int',
      level: 1,
      exp: 0
    }
  ]

  // simple scale: level 2 needs 10 exp, level 3 needs 20 exp, level 4 needs 30 exp, etc.
  // step 1. add simple '1' to exp, real level scale later

  return (
    <DocWrapper header='Character'>
      <div>
        <div className="flex items-center gap-2">
          {isEditingName ? (
            <input
              value={nameDraft}
              onChange={(e) => setNameDraft(e.target.value)}
              onBlur={() => {
                updateCharacter('name', nameDraft)
                setIsEditingName(false)
              }}
              autoFocus
            />
          ) : (
            <p onClick={() => setIsEditingName(true)}>
              {character.name}
            </p>
          )}
          <button className="softButton mt-0 min-w-5 mx-auto block" onClick={() => setIsEditingName(true)}>
            ⚙
          </button>
        </div>

        <p>Class: {character.class.id}, Level: {character.class.level}, Exp: {character.class.exp}</p>
        <div className="flex items-center gap-2">
          <p>Activated: {character.activated ? 'Ja' : 'Nein'}</p>
          <button className={`softButton mt-0 min-w-40 mx-auto block`} onClick={() => updateCharacter('activated', !character.activated)}>
            Toggle Activated
          </button>

        </div>
        
        <p>HP: {character.hp.current} / {character.hp.max}</p>
        
        {Object.entries(character.stats).map(([statName, stat]) => (
          <StatRow key={statName} label={statName.toUpperCase()} stat={stat} />
        ))}
        <br />
<p>Add Experience to Stats</p>  
        <div className="flex flex-wrap gap-2 mt-0">
          <button className={`softButton mt-4 min-w-40 `} onClick={() => addStatExp('str', 5)}>
            +5 STR Exp
          </button>
          <button className={`softButton mt-4 min-w-40`} onClick={() => addStatExp('agi', 5)}>
            +5 AGI Exp
          </button>
          <button className={`softButton mt-4 min-w-40 `} onClick={() => addStatExp('vit', 5)}>
            +5 VIT Exp
          </button>
          <button className={`softButton mt-4 min-w-40`} onClick={() => addStatExp('int', 5)}>
            +5 INT Exp
          </button>
          <button className={`softButton mt-4 min-w-40`} onClick={() => addStatExp('dex', 5)}>
            +5 DEX Exp
          </button>
          <button className={`softButton mt-4 min-w-40`} onClick={() => addStatExp('luk', 5)}>
            +5 LUK Exp
          </button>
          <button className="softButton  mt-4 min-w-40 block" onClick={resetCharacter}>Reset</button>

        </div>
      </div>

      <br />
      <p>Dummy Data</p>

      <div>
        {dummyData.map(task => (
          <div key={task.id}>
            <p>Label: {task.label}</p>
            <p>Finished: {task.finished ? 'Yes' : 'No'}</p>
            <p>Time: {task.time}</p>
            <p>List: {task.list}</p>
            <p>Area: {task.area}</p>
            <p>Effort: {task.effort}</p>
            <button className='bg-blue-500 text-white px-4 py-2 rounded'
              onClick={() => changeFinishedStatus(task.id)}>
              {task.finished ? 'Mark as Unfinished' : 'Mark as Finished'}
            </button>
          </div>
        ))}
        <p>User Experience: {userExp}</p>
      </div>

    </DocWrapper>
  )
}
