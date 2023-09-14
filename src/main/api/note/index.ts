import fse from 'node:fs/promises'
import { app } from 'electron'
import { ObjectEncodingOptions, ensureDir, readFileSync } from 'fs-extra'
import path from 'node:path'

enum ENoteType {
  FILE = 'file',
  DIR = 'dir'
}

type INotes = {
  [ENoteType.FILE]: string[]
  [ENoteType.DIR]: string[]
}

const baseDir = app.getPath('userData') + '/notes'
console.log(baseDir, 'baseDIr')
const getIds = async () => {
  const dirs = await fse.readdir(baseDir)
  return dirs.map((dir) => dir.split('__')[0])
}

const getAllDirs = async () => {
  const dirs = await fse.readdir(baseDir)
  return dirs
}

const getFileName = (id: string, title: string, suffix = '.md') => {
  const filename = path.join(baseDir, `${id}__${title}${suffix}`)
  return filename
}

const fns = {
  async save(_event, { id, title, content }) {
    const ids = await getIds()
    if (!ids || !ids.length) return fns.add(_event, { id, title, content })
    const isExist = ids.some((item) => item === id)
    if (isExist) {
      const allDirs = await getAllDirs()
      const originalFileName = path.join(
        baseDir,
        allDirs.find((item) => item.split('__')[0] === id)!
      )
      const filename = getFileName(id, title)
      await fse.rename(originalFileName, filename)
      return fse.writeFile(filename, content, 'utf-8')
    } else {
      return fns.add(_event, { id, title, content })
    }
  },
  async add(_event, { id, title, content }) {
    const filename = getFileName(id, title)
    console.log(filename, '===filename===')
    return fse.writeFile(filename, content, 'utf-8')
  },
  async rename(_event, { id, title }) {
    const filename = getFileName(id, title)
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
  async getNotes(): Promise<INotes> {
    await ensureDir(baseDir)
    const all: string[] = await fse.readdir(baseDir)
    const files: string[] = []
    const dirs: string[] = []
    for (const item of all) {
      const stat = await fse.stat(path.join(baseDir, item))
      if (stat.isDirectory()) {
        dirs.push(item)
      } else {
        files.push(item)
      }
    }
    return {
      [ENoteType.FILE]: files,
      [ENoteType.DIR]: dirs
    }
  },
  async getNoteById(_event, { id, title }) {
    const filename = getFileName(id, title)
    const content = readFileSync(filename, 'utf-8')
    return content
  },
  /** 移除文件 回收站里点击移除 */
  async removeNoteById(_event, { id, title }) {
    const ids = await getIds()
    const isExist = ids.find((item) => item === id)
    const filename = getFileName(id, title)
    if (isExist) {
      await fse.unlink(path.join(baseDir, filename))
    }
  },
  /** 移除目录 */
  async removeNoteByDir(_event, { dirName, options }) {
    await fse.rmdir(path.join(baseDir, dirName), options)
  },
  /** 新建文件夹 */
  async createDir(_event, { id, title }) {
    const dirName = getFileName(id, title, '')
    console.log(dirName, 'dirName')
    await fse.mkdir(dirName)
  }
}

export default fns
