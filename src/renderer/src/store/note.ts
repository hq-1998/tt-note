import { ENoteType, PAYLOAD } from '@renderer/layout/menu/constants'
import { defineStore } from 'pinia'
import { omit } from 'lodash-es'
import { v4 } from 'uuid'
import { toRaw } from 'vue'

export interface IBaseNote {
  title: string
  timestamp?: string
  id: string
  children: IBaseNote[]
  type: ENoteType
  isClickRename: boolean
  content: string
  ext: string
  fullname: string
  parentId?: string
  parentFullName?: string
}

const useNoteStore = defineStore('note', {
  state: () => {
    return {
      notes: [] as IBaseNote[],
      notesMap: {} as Record<string, IBaseNote>,
      active: 0,
      activeType: ENoteType.MARKDOWN
    }
  },
  getters: {
    dirNotes(state) {
      return state.notes.filter((item) => !item.ext)
    }
  },
  actions: {
    /** 新建markdown */
    async addNote(type: ENoteType, parentId?: string) {
      let id: string | null = null
      switch (type) {
        case ENoteType.DIR:
          id = await this.addNoteDir(parentId)
          break
        default:
          id = await this.addNoteFile(type, parentId)
      }
      return id
    },
    /** 新建文件 */
    async addNoteFile(type: ENoteType, parentId?: string): Promise<string | null> {
      const basePayload = PAYLOAD?.[type]
      if (basePayload) {
        const id = v4()
        const fullname = id + '__' + basePayload.title + basePayload.ext
        const payload: IBaseNote = { ...basePayload, id, fullname }
        let parent: IBaseNote | null = null
        if (parentId) {
          parent = toRaw<IBaseNote>(this.notesMap[parentId])
        }
        const data = JSON.stringify({
          payload,
          parent
        })
        if (payload) {
          await window.electron.ipcRenderer.invoke('save', data)
          this.notes[type] = this.notes[type] || []
          this.notes[type]!.unshift({
            ...payload,
            parentId,
            parentFullName: parent?.fullname
          })
          return payload.id
        }
        return null
      }
      return null
    },
    /** 新建文件夹 */
    async addNoteDir(parentId?: string): Promise<string | null> {
      const basePayload = PAYLOAD[ENoteType.DIR]
      const id = v4()
      const fullname = id + '__' + basePayload.title + basePayload.ext
      const payload = { ...basePayload, id, fullname }
      let parent: IBaseNote | null = null
      if (parentId) {
        parent = toRaw<IBaseNote>(this.notesMap[parentId])
      }
      if (payload) {
        await window.electron.ipcRenderer.invoke('createDir', payload)
        this.notes[ENoteType.DIR] = this.notes?.[ENoteType.DIR] || []
        this.notes[ENoteType.DIR]!.unshift({
          ...payload,
          parentId,
          parentFullName: parent?.fullname
        })
        return payload.id
      }
      return null
    },
    /** 通过id更新note */
    updateNoteById(id: string, payload: Partial<IBaseNote>) {
      const item = this.notesMap[id]
      if (item) {
        const noteIndex = this.notes.findIndex((note) => note.id === id)
        this.notes[noteIndex] = {
          ...this.notes[noteIndex],
          ...payload
        }
      }
    },
    /** 通过id移除文件夹 */
    async removeNoteDir(item: IBaseNote) {
      /** 如果文件夹下 没有文件 那么直接删除 不进入回收站 */
      const allDirs = await window.electron.ipcRenderer.invoke('getAllDirs')
      const { id, type } = item
      const dir = allDirs.find((dir) => dir.split('__')[0] === id)
      if (dir) {
        const dirHasContent = await window.electron.ipcRenderer.invoke('checkDir', dir)
        const removeItem = omit(item, ['children'])
        /** 文件夹有内容 进入回收站 */
        if (dirHasContent) {
          this.removeNoteToTrash(removeItem)
        } else {
          /* 无内容 直接删除文件 */
          await window.electron.ipcRenderer.invoke('removeNoteDir', {
            dirName: dir
          })
        }
        this.notes[type] = this.notes[type]!.filter((note) => note.id !== id)
      } else {
        throw new Error('文件夹不存在')
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
    setNotes(payload: IBaseNote[]) {
      this.notes = payload
    },
    setNotesMap(payload: Record<string, IBaseNote>) {
      this.notesMap = payload
    },
    async getNoteById(id: string) {
      const item = toRaw(omit(this.notesMap[id], 'children'))
      const content = await window.electron.ipcRenderer.invoke('getNoteById', item)
      console.log(content, '===')
      return content
    },
    getNoteByIndex(index: number, type: ENoteType) {
      const category = this.notes[type]
      return category[index]
    },
    setActive(index: number) {
      this.active = index
    },
    setActiveType(type: ENoteType) {
      this.activeType = type
    }
  }
})

export default useNoteStore
