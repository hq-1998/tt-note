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
  parentFullName: string
}

const baseDir = app.getPath('userData') + '/notes'
const trashDir = app.getPath('userData') + '/trash'
let noteMaps: Map<string, Info> = new Map()

const getFileName = (id: string, title: string, ext: string, parentFullName = '') => {
  const filename = path.resolve(baseDir, parentFullName, `${id}__${title}${ext}`)
  return filename
}

const replaceFullName = (oldFullName: string, title: string) => {
  const [prefix, suffix] = oldFullName.split('.')
  const [id] = prefix.split('__')
  const newSuffix = `${id}__${title}${suffix ? '.' + suffix : ''}`
  return newSuffix
}

const fns = {
  async save(_event, payload: Info) {
    const { id, content } = payload
    const isExist = noteMaps.get(id)
    if (isExist) {
      const mergeResult = {
        ...isExist,
        ...payload,
        fullname: replaceFullName(isExist.fullname, payload.title)
      }
      const originalFileName = fns.montagePath(isExist)
      const filename = getFileName(
        mergeResult.id,
        mergeResult.title,
        mergeResult.ext,
        mergeResult.parentFullName
      )
      await fse.rename(originalFileName, filename)
      await fse.writeFile(filename, content, 'utf-8')
      noteMaps.set(id, mergeResult)
      return mergeResult.id
    } else {
      await fns._add(payload)
      noteMaps.set(id, payload)
      return payload.id
    }
  },
  async _add({ fullname, content, parentFullName }: Info) {
    const filename = path.resolve(baseDir, parentFullName, fullname)
    return fse.writeFile(filename, content, 'utf-8')
  },
  async rename(_event, item: Info) {
    const isExist = noteMaps.get(item.id)
    if (!isExist) return
    const p = fns.montagePath(isExist)
    const oldFileName = path.resolve(baseDir, isExist.fullname)
    const basePath = path.basename(p)
    const [prefix, suffix] = basePath.split('.')
    const [id] = prefix.split('__')
    const newTitle = item.title
    const newSuffix = `${id}__${newTitle}${suffix ? '.' + suffix : ''}`
    const filename = path.resolve(baseDir, isExist.parentFullName, newSuffix)
    await fse.rename(oldFileName, filename)
    noteMaps.set(item.id, {
      ...isExist,
      ...item
    })
    return item.id
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
    noteMaps = new Map(Object.entries(treeMap))
    return {
      result,
      noteMaps
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
      type: type || ENoteType.DIR,
      children: [],
      parentId: parent?.id ?? null,
      parentFullName: parent?.fullname ?? ''
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
    const pathname = [item.fullname]
    while (parentId) {
      const parent = noteMaps.get(parentId)
      pathname.push(parent!.fullname)
      parentId = parent!.parentId
    }
    const urlStr = pathname.reverse().join('/')
    return path.join(baseDir, urlStr)
  },
  setNotesMap(_event, item: Info) {
    const { id } = item
    noteMaps.set(id, item)
  },
  removeNotesMapById(id: string) {
    noteMaps.delete(id)
  },
  async getNoteById(_event, id: string) {
    let content: Info[] | string
    const item = noteMaps.get(id)
    if (item) {
      const fullResolvePath = fns.montagePath(item)
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
    } else {
      throw new Error('文件不存在')
    }
  },
  /** 移除文件 回收站里点击移除 真删除 */
  async removeNote(_event, id: string): Promise<string | null> {
    const item = noteMaps.get(id)
    if (item) {
      const removePath = fns.montagePath(item)
      if (removePath) {
        await fse.unlink(removePath)
        noteMaps.delete(id)
        return id
      }
      return null
    }
    throw new Error('文件不存在')
  },
  /** 移除到回收站 假删除 */
  async removeNoteToTrash(_event, id: string) {
    await ensureDir(trashDir)
    const item = noteMaps.get(id)
    if (item) {
      const oldFileName = fns.montagePath(item)
      console.log(oldFileName, noteMaps, '===oldFileName===')
      const newFileName = oldFileName.replace('/notes', '/trash')
      await fse.rename(oldFileName, newFileName)
      noteMaps.delete(id)
      return id
    }
    throw new Error('文件不存在')
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
