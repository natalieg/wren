import React, {useEffect, useState} from 'react'

export default function Character() {
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
    <> 
    <div>Areas</div>
    <div>
      {dummyData.map(task => (
        <div key={task.id}>
          <p>Label: {task.label}</p>
          <p>Finished: {task.finished ? 'Yes' : 'No'}</p>
          <p>Time: {task.time}</p>
          <p>List: {task.list}</p>
          <p>Area: {task.area}</p>
          <p>Effort: {task.effort}</p>
          <button  className='bg-blue-500 text-white px-4 py-2 rounded'
          onClick={() => changeFinishedStatus(task.id)}>
            {task.finished ? 'Mark as Unfinished' : 'Mark as Finished'}
          </button>
        </div>
      ))}
       <p>User Experience: {userExp}</p>
    </div>
    </>
  )
}
