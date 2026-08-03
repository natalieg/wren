// Fixes the "timer stops when switching pages" bug: useTasks() must be
// instantiated exactly ONCE, above <Routes> in App.jsx, so navigating between
// pages doesn't unmount (and destroy) runningTaskId / the interval / trackingStartTime.
// This Provider is that single instantiation point; every page reads from it
// via useTasksContext() instead of calling useTasks() itself.

// TODO 1: import { createContext, useContext } from 'react' and your useTasks hook

// TODO 2: const TasksContext = createContext(null)

// TODO 3: export function TasksProvider({ children }) {
//   const tasksApi = useTasks()   // <- the ONE call site, remember to drop the
//                                 //    newTask/taskTime args once handleAddTask
//                                 //    takes them as real params instead (see
//                                 //    useTasks.js HINTs)
//   return <TasksContext.Provider value={tasksApi}>{children}</TasksContext.Provider>
// }

// TODO 4: export function useTasksContext() {
//   const ctx = useContext(TasksContext)
//   // optional: throw if ctx is null, i.e. used outside <TasksProvider>
//   return ctx
// }
