import { defineStore } from 'pinia'

export enum ENoteType {
  MARKDOWN = 'md',
  DIR = 'dir'
}

export interface IBaseNote {
  title: string
  timeStamp: number
  id: string
  children?: IBaseNote[]
  type: ENoteType
  isClickRename: boolean
  content: string
  suffix: string
}

type INotes = {
  [ENoteType.MARKDOWN]?: IBaseNote[]
  [ENoteType.DIR]?: IBaseNote[]
}

const useNoteStore = defineStore('note', {
  state: () => {
    return {
      notes: {} as INotes,
      active: 0,
      activeType: ENoteType.MARKDOWN
    }
  },
  getters: {
    notesMap(state) {
      return Object.entries(state.notes).reduce((pre, cur) => {
        const [, value] = cur
        value.map((item) => {
          pre[item.id] = item
        })
        return pre
      }, {})
    }
  },
  actions: {
    /** 新建markdown */
    addNote(payload: IBaseNote) {
      const { type } = payload
      if (!this.notes[type]) {
        this.notes[type] = []
      }
      this.notes[type]!.unshift(payload)
    },
    /** 新建文件夹 */
    addNoteDir(payload: IBaseNote) {
      const { type } = payload
      if (!this.notes[type]) {
        this.notes[type] = []
      }
      this.notes[type as ENoteType.DIR]!.unshift(payload)
    },
    updateNoteById(id: string, payload: Partial<IBaseNote>) {
      const item = { ...this.notesMap[id] }
      if (item) {
        const noteIndex = this.notes[item.suffix].findIndex((note) => note.id === id)
        this.notes[item.suffix][noteIndex] = {
          ...this.notes[item.suffix][noteIndex],
          ...payload
        }
      }
    },
    clearNotes() {
      this.notes = {}
    },
    setNotes(payload: INotes) {
      this.notes = payload
    },
    getNoteById(id: string) {
      const item = this.notesMap[id]
      return item
    },
    getNoteByIndex(index: number, type: ENoteType) {
      return this.notes[type!]![index]
    },
    setActive(index: number) {
      this.active = index
    }
  }
})

export default useNoteStore
