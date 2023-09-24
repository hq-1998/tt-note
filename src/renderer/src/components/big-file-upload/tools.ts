import { common } from '@renderer/api'

const separator = '::'

/** 获取文件后缀名
 * @param name 文件名
 */
const getFileExt = (name: string) => {
  return name.split('.').slice(-1)[0]
}

/**
 * 校验文件是否上传
 * @param md5
 * @param chunks
 */
const verifyFileUploaded = (md5: string, chunks: Blob[], file: File) => {
  const chunksNames = [] as string[]
  chunks.forEach((_, index) => chunksNames.push(`${md5}${separator}${index}`))
  const ext = getFileExt(file.name)
  return common.verifyFileUploaded({
    chunksNames,
    ext,
    md5,
    fullname: `${md5}.${ext}`
  })
}

/**
 * 文件分片
 * @param file 文件对象
 * @param chunkSize 分片大小
 */
const generateChunks = (file: File, chunkSize: number) => {
  const chunks: Blob[] = []
  for (let i = 0; i < file.size; i += chunkSize) {
    chunks.push(file.slice(i, i + chunkSize))
  }
  return chunks
}

/**
 * 上传分片
 * @param chunk 文件blob
 * @param md5 加密串
 * @param fullname 文件原名称
 * @param index 下标: 失败辅助标识
 */
const uploadSingleChunk = async (chunk: Blob, md5 = '', fullname = '', index = -1) => {
  const formData = new FormData()
  const data = {
    file: chunk,
    md5,
    fullname,
    index: String(index)
  }
  Object.entries(data).forEach(([key, value]) => formData.append(key, value))
  return await common.uploadBigFile(formData, data)
}

/** 上传chunks */
const uploadChunks = (chunks: Blob[] = [], md5 = '', fullname = '') => {
  const chunksRequest = chunks.map((item, index) => uploadSingleChunk(item, md5, fullname, index))
  return Promise.allSettled(chunksRequest)
}

/** 合并最终的chunks */
/**
 * @param md5
 * @param file
 */
const mergeChunks = async (md5 = '', file: File) => {
  return await common.mergeChunk({
    md5,
    fullname: file.name,
    ext: getFileExt(file.name)
  })
}

export { verifyFileUploaded, generateChunks, uploadChunks, mergeChunks }
