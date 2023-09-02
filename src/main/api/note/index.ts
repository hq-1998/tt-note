import fse from 'node:fs/promises'
import { app } from 'electron'
import { ObjectEncodingOptions, ensureDir, ensureFile } from 'fs-extra'
import path from 'node:path'

const baseDir = app.getPath('userData') + '/notes'
const getIds = async () => {
  const dirs = await fse.readdir(baseDir)
  return dirs.map((dir) => dir.split('__')[0])
}

const getAll = async () => {
  const dirs = await fse.readdir(baseDir)
  return dirs
}

const getFileName = (id: string, title: string, timeStamp: number) => {
  const filename = path.join(baseDir, id + '__' + title + '__' + timeStamp)
  return filename
}

const fns = {
  async save(_event, { id, title, content, timeStamp }) {
    await ensureDir(baseDir)
    const ids = await getIds()
    const isExist = ids.find((item) => item === id)
    const filename = getFileName(id, title, timeStamp)
    await ensureFile(filename)
    if (isExist) {
      await fse.rename(isExist, filename)
    }
    return fse.writeFile(filename, content, 'utf-8')
  },
  async rename(_event, { id, title, timeStamp }) {
    const filename = getFileName(id, title, timeStamp)
    const all = await getAll()
    const isExist = all.find((item) => item.split('__')[0] === id)
    if (!isExist) return

    const oldFileName = path.resolve(baseDir, isExist)
    return await fse.rename(oldFileName, filename)
  },
  async getAllDirs(
    path = baseDir,
    options?:
      | BufferEncoding
      | (ObjectEncodingOptions & {
          withFileTypes?: false | undefined
          recursive?: boolean | undefined
        })
      | null
  ) {
    const dirs = await fse.readdir(path, options)
    return dirs
  },
  async getNotes() {
    const files = await fse.readdir(baseDir)
    return files
  },
  async getNoteById(_event, { id, title, timeStamp }) {
    const filename = getFileName(id, title, timeStamp)
    const content = await fse.readFile(filename, 'utf-8')
    return content
  },
  /** 移除文件 回收站里点击移除 */
  async removeNoteById(_event, { id, title, timeStamp }) {
    const ids = await getIds()
    const isExist = ids.find((item) => item === id)
    const filename = getFileName(id, title, timeStamp)
    if (isExist) {
      await fse.unlink(path.join(baseDir, filename))
    }
  },
  /** 移除目录 */
  async removeNoteByDir(_event, { dirName, options }) {
    await fse.rmdir(path.join(baseDir, dirName), options)
  },
  /** 新建文件夹 */
  async createDir(_event, { dirName }) {
    await fse.mkdir(path.join(baseDir, dirName))
  }
}

export default fns
