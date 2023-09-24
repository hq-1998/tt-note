import http from '@renderer/request'
import { IBigFile, IChunksObj, IMergeChunks, IMergeResult } from './data'

const common = {
  /** 大文件上传 */
  uploadBigFile: (formData: FormData, data: IBigFile) => {
    return http.post<FormData, boolean>('/upload/bigFile', formData, {
      data,
      headers: {
        // 表单formdata
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  /** 校验文件是否已经上传成功 */
  verifyFileUploaded: (data: IChunksObj) => {
    return http.post<IChunksObj, boolean>('/upload/verifyFileUploaded', data)
  },
  /** 合并chunks */
  mergeChunk: (data: IMergeChunks) => {
    return http.post<IMergeChunks, IMergeResult>('/upload/mergeChunk', data)
  }
}

export default common
