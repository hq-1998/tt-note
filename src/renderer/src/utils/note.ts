import { IBaseNote } from '@renderer/store/note'
import { getParentNodeId } from './tool'

const getData = (notes: IBaseNote[], id: string) => {
  const p = getParentNodeId(notes, id)
  const source = !p || !p.children?.length ? notes : p.children
  return source
}

class Note {
  notes: IBaseNote[] = []
  constructor(note: IBaseNote[]) {
    this.notes = note
  }
  create(payload: IBaseNote) {
    const source = getData(this.notes, payload.id)
    source.unshift(payload)
  }
  update(payload: IBaseNote) {
    const source = getData(this.notes, payload.id)
    const noteIndex = source.findIndex((note) => note.id === payload.id)
    source[noteIndex] = payload
  }
  remove(id: string) {
    const source = getData(this.notes, id)
    const findIndex = source.findIndex((note) => note.id === id)
    if (findIndex > -1) {
      source.splice(findIndex, 1)
    }
  }
}

export default Note
