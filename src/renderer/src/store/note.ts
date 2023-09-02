import { defineStore } from 'pinia'

interface Note {
  title: string
  content: string
  timeStamp?: number
  id: string
}

const useNoteStore = defineStore('note', {
  state: () => {
    return {
      notes: [] as Note[],
      active: 0
    }
  },
  actions: {
    addNote(payload: Note) {
      this.notes.unshift(payload)
    },
    removeNoteById(id: string) {
      this.notes = this.notes.filter((note) => note.id !== id)
    },
    updateNoteById(id: string, payload: Partial<Note>) {
      const noteIndex = this.notes.findIndex((note) => note.id === id)
      this.notes[noteIndex] = {
        ...this.notes[noteIndex],
        ...payload
      }
    },
    clearNotes() {
      this.notes = []
    },
    setNotes(payload: Note[]) {
      this.notes = payload
    },
    getNotes() {
      return this.notes.sort((a, b) => b.timeStamp! - a.timeStamp!)
    },
    getNoteById(id: string) {
      return this.notes.find((note) => note.id === id)
    },
    getNoteByIndex(index: number) {
      return this.notes[index]
    },
    setActive(index: number) {
      this.active = index
    }
  }
})

export default useNoteStore
