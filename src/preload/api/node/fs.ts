import { Abortable } from 'node:events'
import {
  PathLike,
  MakeDirectoryOptions,
  ObjectEncodingOptions,
  OpenMode,
  RmDirOptions,
  RmOptions,
  StatOptions,
  Mode,
  WriteStream
} from 'node:fs'
import fse from 'node:fs/promises'
import { Stream, StreamOptions } from 'node:stream'
import fs from 'node:fs'

const fns = {
  /** 创建目录 */
  mkdir(
    path: PathLike,
    options?: MakeDirectoryOptions & {
      recursive: true
    }
  ): Promise<string | undefined> {
    return fse.mkdir(path, options)
  },
  /** 读取目录 */
  readdir(
    path: PathLike,
    options?:
      | (ObjectEncodingOptions & {
          withFileTypes?: false | undefined
        })
      | BufferEncoding
      | null
  ): Promise<string[]> {
    return fse.readdir(path, options)
  },
  /** 读取文件 */
  readFile(
    path: PathLike,
    options?:
      | ({
          encoding?: null | undefined
          flag?: OpenMode | undefined
        } & Abortable)
      | null
  ) {
    return fse.readFile(path, options)
  },
  /** 重命名 */
  rename(oldPath: PathLike, newPath: PathLike) {
    return fse.rename(oldPath, newPath)
  },
  /** 删除空目录 */
  rmdir(path: PathLike, options: RmDirOptions) {
    return fse.rmdir(path, options)
  },
  /** 删除目录 */
  rm(path: PathLike, options?: RmOptions) {
    return fse.rm(path, options)
  },
  /** 查看文件状态 */
  stat(
    path: PathLike,
    options?: StatOptions & {
      bigint?: false | undefined
    }
  ) {
    return fse.stat(path, options)
  },
  /** 查看文件状态 同步 */
  statSync(path: PathLike, options?: StatOptions & { bigint?: false | undefined }): fs.Stats {
    return fs.statSync(path, options)
  },
  /** 写入文件 */
  writeFile(
    file: PathLike | fse.FileHandle,
    data:
      | string
      | NodeJS.ArrayBufferView
      | Iterable<string | NodeJS.ArrayBufferView>
      | AsyncIterable<string | NodeJS.ArrayBufferView>
      | Stream,
    options?:
      | (ObjectEncodingOptions & {
          mode?: Mode | undefined
          flag?: OpenMode | undefined
        } & Abortable)
      | BufferEncoding
      | null
  ) {
    return fse.writeFile(file, data, options)
  },
  /** 创建写入流 */
  createWriteStram(path: PathLike, options?: BufferEncoding | StreamOptions<any>): WriteStream {
    return fs.createWriteStream(path, options)
  }
}

export default fns
