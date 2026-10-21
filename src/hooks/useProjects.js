import { useState, useEffect } from 'react'
import { newTaskId } from '../utils/taskId'

// [{ id, name, notes, createdAt, blocksOnly? }, ...]
function useProjects() {
   const [projects, setProjects] = useState(() => {
      try {
         const saved = localStorage.getItem('projects')
         return saved ? JSON.parse(saved) : []
      } catch (e) {
         console.error('Failed to load projects from localStorage:', e)
         return []
      }
   })

   useEffect(() => {
      localStorage.setItem('projects', JSON.stringify(projects))
   }, [projects])

   const addProject = (name) => {
      const project = { id: newTaskId(), name, notes: '', createdAt: new Date().toISOString() }
      setProjects(current => [...current, project])
      return project.id
   }

   const updateProjectNotes = (id, notes) => {
      setProjects(current => current.map(p => p.id === id ? { ...p, notes } : p))
   }

   const updateProjectName = (id, name) => {
      setProjects(current => current.map(p => p.id === id ? { ...p, name } : p))
   }

   // on: the project's day tasks only show on the day list inside a time block
   const updateProjectBlocksOnly = (id, blocksOnly) => {
      setProjects(current => current.map(p => p.id === id ? { ...p, blocksOnly } : p))
   }

   const deleteProject = (id) => {
      setProjects(current => current.filter(p => p.id !== id))
   }

   return { projects, addProject, updateProjectName, updateProjectNotes, updateProjectBlocksOnly, deleteProject }
}

export default useProjects
