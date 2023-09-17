import { ENoteType, PAYLOAD } from '@renderer/layout/menu/constants'
import { defineStore } from 'pinia'
import dayjs from 'dayjs'
import { v4 } from 'uuid'
import { toRaw } from 'vue'
import { omit } from 'lodash-es'
import Note from '@renderer/utils/note'

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
      notesMap: new Map<string, IBaseNote>(),
      active: 0,
      activeType: ENoteType.MARKDOWN,
      notesHandler: new Note([])
    }
  },
  getters: {
    dirNotes(state) {
      return state.notes.filter((item) => !item.ext)
    },
    fileNotes(state) {
      return state.notes.filter((item) => item.ext)
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
      let parent: IBaseNote | undefined
      if (basePayload) {
        const id = v4()
        const fullname = id + '__' + basePayload.title + basePayload.ext
        if (parentId) {
          parent = this.notesMap.get(parentId)
        }
        const payload: IBaseNote = {
          ...basePayload,
          id,
          fullname,
          timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          parentId,
          parentFullName: parent ? parent.fullname : ''
        }
        const data = omit(payload, 'children')
        if (payload) {
          await window.electron.ipcRenderer.invoke('save', data)
          await window.electron.ipcRenderer.invoke('setNotesMap', data)
          /** 递归插入children parent notes */
          this.notesHandler.create(payload)
          this.notesMap.set(id, payload)
          if (parentId && parent) {
            this.insertChildrenToParent(parentId, payload)
          }
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
      const data = { ...basePayload, id, fullname }
      let parent: IBaseNote | undefined
      if (parentId) {
        const parentInfo = this.notesMap.get(parentId)
        if (parentInfo) {
          parent = toRaw<IBaseNote>(parentInfo)
        }
      }
      if (data) {
        await window.electron.ipcRenderer.invoke('createDir', data)
        await window.electron.ipcRenderer.invoke('setNotesMap', data)
        /** 递归插入children notes parent */
        const payload = {
          ...data,
          parentId,
          parentFullName: parent?.fullname ?? ''
        }
        this.notesHandler.create(payload)
        this.notesMap.set(id, data)
        if (parentId && parent) {
          this.insertChildrenToParent(parentId, data)
        }
        return data.id
      }
      return null
    },
    insertChildrenToParent(parentId: string, item: IBaseNote) {
      const parent = this.notesMap.get(parentId)
      if (parent) {
        const children = parent.children || []
        const findIndex = children.findIndex((child) => child.id === item.id)
        if (findIndex === -1) {
          children.push(item)
        }
      }
      this.notesMap.set(parentId, parent as IBaseNote)
    },
    /** 保存 */
    save(id: string, payload: Partial<IBaseNote>) {
      const item = this.notesMap.get(id)
      if (item) {
        const data = {
          ...item,
          ...payload
        }
        window.electron.ipcRenderer.invoke('save', omit(data, ['children']))
        this.notesMap.set(id, data)
      }
    },
    /** 通过id更新note */
    async updateNoteById(id: string, data: Partial<IBaseNote>) {
      const item = this.notesMap.get(id)
      if (item) {
        const payload = {
          ...item,
          ...data
        }
        this.notesHandler.update(payload)
        this.notesMap.set(id, payload)
      }
    },
    /** 修改文件名 */
    async rename(value: string, oldValue: string, item: IBaseNote) {
      const { id } = item
      this.notesHandler.update({
        ...item,
        isClickRename: false
      })
      if (Object.is(value, oldValue)) return
      if (!value) {
        this.notesHandler.update({
          ...item,
          title: oldValue,
          isClickRename: false
        })
        return
      }
      this.updateNoteById(id, {
        title: value,
        type: ENoteType.MARKDOWN
      })
      const success = await window.electron.ipcRenderer.invoke('rename', {
        id,
        title: value
      })
      return success
    },
    /** 通过id移除文件夹 */
    async removeNoteDirById(id: string) {
      /** 如果文件夹下 没有文件 那么直接删除 不进入回收站 */
      const item = this.notesMap.get(id)
      if (item) {
        const dirHasContent = await window.electron.ipcRenderer.invoke('checkDir', item.fullname)
        /** 文件夹有内容 进入回收站 */
        if (dirHasContent) {
          await window.electron.ipcRenderer.invoke('removeNoteToTrash', id)
        } else {
          /* 无内容 直接删除文件 */
          await window.electron.ipcRenderer.invoke('removeNoteDir', {
            dirName: item.fullname
          })
        }
        this.notesHandler.remove(id)
        this.notesMap.delete(id)
      } else {
        throw new Error('文件夹不存在')
      }
    },
    /** 通过id移除note */
    async removeNoteById(id: string) {
      /** 如果笔记没有内容 那么直接删除 不进入回收站 */
      const item = this.notesMap.get(id)
      if (!item?.content) {
        await window.electron.ipcRenderer.invoke('removeNote', id)
      } else {
        // 进入回收站
        await window.electron.ipcRenderer.invoke('removeNoteToTrash', id)
      }
      this.notesHandler.remove(id)
      this.notesMap.delete(id)
    },
    setNotes(payload: IBaseNote[]) {
      this.notes = payload
      this.notesHandler = new Note(this.notes)
    },
    setNotesMap(payload: Map<string, IBaseNote>) {
      this.notesMap = payload
    },
    async getNoteById(id: string) {
      const content = await window.electron.ipcRenderer.invoke('getNoteById', id)
      return content
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
