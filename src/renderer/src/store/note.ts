import PAYLOAD, { ENoteType } from '@renderer/layout/menu/constants'
import { defineStore } from 'pinia'
import { omit } from 'lodash-es'

export interface IBaseNote {
  title: string
  timestamp?: number
  id: string
  children?: IBaseNote[]
  type: ENoteType
  isClickRename: boolean
  content: string
  ext: string
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
    addNote(type: ENoteType) {
      const payload: IBaseNote = PAYLOAD?.[type]
      if (payload) {
        window.electron.ipcRenderer.invoke('save', payload)
        this.notes[payload.type] = this.notes[payload.type] || []
        this.notes[payload.type]!.unshift(payload)
      }
    },
    /** 新建文件夹 */
    addNoteDir(payload: IBaseNote) {
      const { type } = payload
      if (!this.notes[type]) {
        this.notes[type] = []
      }
      this.notes[type as ENoteType.DIR]!.unshift(payload)
    },
    /** 通过id更新note */
    updateNoteById(id: string, payload: Partial<IBaseNote>) {
      const item = { ...this.notesMap[id] }
      if (item) {
        const noteIndex = this.notes[item.type].findIndex((note) => note.id === id)
        this.notes[item.type][noteIndex] = {
          ...this.notes[item.type][noteIndex],
          ...payload
        }
      }
    },
    /** 通过id移除note */
    async removeNote(item: IBaseNote) {
      const { content, type, id } = item
      /** 如果笔记没有内容 那么直接删除 不进入回收站 */
      const removeItem = omit(item, ['children'])
      if (!content) {
        await window.electron.ipcRenderer.invoke('removeNote', removeItem)
      } else {
        // 进入回收站
        this.removeNoteToTrash(removeItem)
      }
      this.notes[type] = this.notes[type]!.filter((note) => note.id !== id)
    },
    removeNoteToTrash(removeItem: Omit<IBaseNote, 'children'>) {
      window.electron.ipcRenderer.invoke('removeNoteToTrash', removeItem)
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
