import fse from 'node:fs/promises'
import { app } from 'electron'
import dayjs from 'dayjs'
import { ObjectEncodingOptions, ensureDir, readFileSync, readdirSync } from 'fs-extra'
import { Stats, statSync } from 'node:fs'
import path from 'node:path'

enum ENoteType {
  FILE = 'file',
  DIR = 'dir'
}

type Info = {
  id: string
  title: string
  content: string
  timestamp: string
  ext: string
  fullname: string
  type: string
  children: Info[]
  parentId: string | null
  parentFullName: string | null
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

let noteMaps: Record<string, Info> = {}

const fns = {
  async save(_event, data) {
    const source = JSON.parse(data)
    const { payload, parent } = source
    const { id, title, ext, content } = payload
    const { fullname } = parent || {}
    const ids = await getIds(fullname)
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
  async getNotes(): Promise<ReturnType<typeof fns._transTree>> {
    await ensureDir(baseDir)
    const { result, treeMap } = fns._transTree(baseDir)
    noteMaps = { ...treeMap }
    return {
      result,
      treeMap
    }
  },
  _generateData(fileInfo: string, stat: Stats, parent?: Info) {
    const [prefix, type] = fileInfo.split('.')
    const [id, title] = prefix.split('__')
    const ext = type ? `.${type}` : ''
    const fullname = fileInfo
    const payload: Info = {
      id,
      title,
      content: '',
      timestamp: dayjs(stat.mtime).format('YYYY-MM-DD HH:mm:ss'),
      ext,
      fullname,
      type: ext || ENoteType.DIR,
      children: [],
      parentId: parent?.id ?? null,
      parentFullName: parent?.fullname ?? null
    }
    return payload
  },
  // 生成文件树
  _transTree(dir: string) {
    const readDir = readdirSync(dir, 'utf-8')
    const result: Info[] = []
    const treeMap: Record<string, Info> = {}
    const fn = (dir: string, data: string[], parent?: Info) => {
      for (const item of data) {
        const childDir = path.join(dir, item)
        const stat = statSync(childDir)
        if (stat.isDirectory()) {
          const current = this._generateData(item, stat, parent)
          result.push(current)
          treeMap[current.id] = current
          fn(childDir, readdirSync(childDir, 'utf-8'), current)
        } else {
          const insert = this._generateData(item, stat, parent)
          treeMap[insert.id] = insert
          if (parent) {
            parent!.children.push(insert)
          } else {
            result.push(insert)
          }
        }
      }
    }
    fn(dir, readDir)
    return {
      result,
      treeMap
    }
  },
  /** 通过id 递归查找上级id 拼接完整路径 */
  montagePath(item: Info) {
    let parentId = item.parentId
    const path = [item.fullname]
    while (parentId) {
      const parent = noteMaps[parentId]
      path.push(parent.fullname)
      parentId = parent.parentId
    }
    return path.reverse().join('/')
  },
  async getNoteById(_event, item) {
    let content: Info[] | string
    const fullPath = fns.montagePath(item)
    const fullResolvePath = path.join(baseDir, fullPath)

    switch (item.type) {
      case ENoteType.DIR: {
        const data = readdirSync(fullResolvePath, 'utf-8')
        return data.map((v) => {
          return fns._generateData(v, statSync(path.resolve(fullResolvePath, v)), item)
        })
      }
      default: {
        content = readFileSync(fullResolvePath, 'utf-8')
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
