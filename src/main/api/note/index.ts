import fse from 'node:fs/promises'
import { app } from 'electron'
import dayjs from 'dayjs'
import { ObjectEncodingOptions, ensureDir, readFileSync, readdirSync } from 'fs-extra'
import { statSync } from 'node:fs'
import path from 'node:path'

enum ENoteType {
  FILE = 'file',
  DIR = 'dir'
}

type Info = {
  // 名称
  name: string
  // 修改时间
  mtime: string
}

type INotes = {
  [ENoteType.FILE]: Info[]
  [ENoteType.DIR]: Info[]
}

const baseDir = app.getPath('userData') + '/notes'
const trashDir = app.getPath('userData') + '/trash'

const getIds = async (parentId = '') => {
  console.log('getIds')
  const dirs = await fse.readdir(path.join(baseDir, parentId))
  console.log(dirs, '===dirs===')
  return dirs.map((dir) => dir.split('__')[0])
}

const getAllDirs = async () => {
  const dirs = await fse.readdir(baseDir)
  return dirs
}

const getFileName = (id: string, title: string, ext: string, parentFullName = '') => {
  const filename = path.resolve(baseDir, parentFullName, `${id}__${title}${ext}`)
  console.log(filename, '===fileName===')
  return filename
}

const getTrashFileName = (id: string, title: string, ext) => {
  const filename = path.join(trashDir, `${id}__${title}${ext}`)
  return filename
}

const fns = {
  async save(_event, data) {
    const source = JSON.parse(data)
    const { payload, parent } = source
    const { id, title, ext, content } = payload
    const { fullname } = parent || {}

    console.log(payload, parent, 'save')
    const ids = await getIds(fullname)
    console.log(ids, '===ids===')
    if (!ids || !ids.length)
      return fns.add(_event, {
        ...payload,
        fullname
      })

    const isExist = ids.some((item) => item === id)
    if (isExist) {
      const allDirs = await getAllDirs()
      const originalFileName = path.join(
        baseDir,
        allDirs.find((item) => item.split('__')[0] === id)!
      )
      const filename = getFileName(id, title, ext)
      await fse.rename(originalFileName, filename)
      return fse.writeFile(filename, content, 'utf-8')
    } else {
      return fns.add(_event, { id, title, content, ext, fullname })
    }
  },
  async add(_event, { id, title, content, ext, fullname }) {
    const filename = getFileName(id, title, ext, fullname)
    return fse.writeFile(filename, content, 'utf-8')
  },
  async rename(_event, { id, title, ext }) {
    const filename = getFileName(id, title, ext)
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
    const files: Info[] = []
    const dirs: Info[] = []
    for (const item of all) {
      const stat = await fse.stat(path.join(baseDir, item))
      const payload = {
        name: item,
        mtime: dayjs(stat.mtime).format('YYYY-MM-DD HH:mm:ss')
      }
      if (stat.isDirectory()) {
        dirs.push(payload)
      } else {
        files.push(payload)
      }
    }
    return {
      [ENoteType.FILE]: files,
      [ENoteType.DIR]: dirs
    }
  },
  async getNoteById(_event, item) {
    const { id, title, ext, type, fullname } = item
    let content: Info[] | string
    const filename = getFileName(id, title, ext)

    console.log(filename, 'getNoteById filename')

    switch (type) {
      case ENoteType.DIR: {
        const data = readdirSync(filename, 'utf-8')
        const result = data.map((item) => {
          const [prefix, type] = item.split('.')
          const [id, title] = prefix.split('__')
          const ext = type ? `.${type}` : ''
          const childFileName = getFileName(id, title, ext, fullname)
          const stat = statSync(childFileName)
          return {
            name: item,
            mtime: dayjs(stat.mtime).format('YYYY-MM-DD HH:mm:ss')
          }
        })
        return result
      }
      default: {
        content = readFileSync(filename, 'utf-8')
        return content
      }
    }
  },
  /** 移除文件 回收站里点击移除 真删除 */
  async removeNote(_event, { id, title, ext }) {
    const ids = await getIds()
    const isExist = ids.find((item) => item === id)
    const filename = getFileName(id, title, ext)
    if (isExist) {
      await fse.unlink(path.resolve(baseDir, filename))
    }
  },
  /** 移除到回收站 假删除 */
  async removeNoteToTrash(_event, { id, title, ext }) {
    await ensureDir(trashDir)
    const oldFileName = getFileName(id, title, ext)
    const newFileName = getTrashFileName(id, title, ext)
    return await fse.rename(oldFileName, newFileName)
  },
  /** 移除目录 */
  async removeNoteDir(_event, { dirName, options }) {
    await fse.rmdir(path.join(baseDir, dirName), options)
  },
  /** 新建文件夹 */
  async createDir(_event, { id, title, ext }) {
    const dirName = getFileName(id, title, ext)
    await fse.mkdir(dirName)
  },
  /** 检测文件夹是否为空 */
  async checkDir(_event, id: string) {
    const readPath = path.join(baseDir, id)
    const hasContent = await fse.readdir(readPath)
    return !!hasContent.length
  }
}

export default fns
