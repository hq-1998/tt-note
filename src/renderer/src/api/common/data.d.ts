interface IBigFile {
  /** 文件md5 */
  md5: string
  /** 文件原名称 */
  fullname: string
  /** 分片索引 */
  index: string
}

interface IChunksObj {
  md5: string
  chunksNames: string[]
  ext: string
  fullname: string
}

interface IMergeChunks {
  md5: string
  fullname: string
  ext: string
}

interface IMergeResult {
  /** 上传文件地址 */
  url: string
  /** 上传文件类型 */
  fileType: string
  /** 上传后的文件名称 */
  name: string
}

export { IBigFile, IChunksObj, IMergeChunks, IMergeResult }
