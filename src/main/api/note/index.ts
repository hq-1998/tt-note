import fse from 'node:fs/promises'
import { app } from 'electron'
import { ObjectEncodingOptions, ensureDir, readFileSync } from 'fs-extra'
import path from 'node:path'

const baseDir = app.getPath('userData') + '/notes'
const getIds = async () => {
  const dirs = await fse.readdir(baseDir)
  return dirs.map((dir) => dir.split('__')[0])
}

const getAllDirs = async () => {
  const dirs = await fse.readdir(baseDir)
  return dirs
}

const getAllFiles = async (dirname: string) => {
  const files = await fse.readFile(dirname)
  return files
}

const getFileName = (id: string, title: string, timeStamp: number) => {
  const filename = path.join(baseDir, id + '__' + title + '__' + timeStamp + '.md')
  return filename
}

const fns = {
  async save(_event, { id, title, content, timeStamp }) {
    const ids = await getIds()
    if (!ids || !ids.length) return fns.add(_event, { id, title, content, timeStamp })
    const isExist = ids.some((item) => item === id)
    if (isExist) {
      const allDirs = await getAllDirs()
      const originalFileName = path.join(
        baseDir,
        allDirs.find((item) => item.split('__')[0] === id)!
      )
      const filename = getFileName(id, title, timeStamp)
      await fse.rename(originalFileName, filename)
      return fse.writeFile(filename, content, 'utf-8')
    } else {
      return fns.add(_event, { id, title, content, timeStamp })
    }
  },
  async add(_event, { id, title, content, timeStamp }) {
    const filename = getFileName(id, title, timeStamp)
    return fse.writeFile(filename, content, 'utf-8')
  },
  async rename(_event, { id, title, timeStamp }) {
    const filename = getFileName(id, title, timeStamp)
    const all = await getAllDirs()
    const isExist = all.find((item) => item.split('__')[0] === id)
    if (!isExist) return

    const oldFileName = path.resolve(baseDir, isExist)
    return await fse.rename(oldFileName, filename)
  },
  async getAllDirs(
    _event,
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
    await ensureDir(baseDir)
    const files = await fse.readdir(baseDir)
    return files
  },
  async getNoteById(_event, { id, title, timeStamp }) {
    const filename = getFileName(id, title, timeStamp)
    const content = readFileSync(filename, 'utf-8')
    console.log(content, filename, '+++content+++')
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
