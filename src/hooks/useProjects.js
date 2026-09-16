import { useState, useEffect } from 'react'
import { newTaskId } from '../utils/taskId'

// [{ id, name, notes, createdAt }, ...]
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

   const deleteProject = (id) => {
      setProjects(current => current.filter(p => p.id !== id))
   }

   return { projects, addProject, updateProjectNotes, deleteProject }
}

export default useProjects
