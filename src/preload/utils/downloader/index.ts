import https from 'node:https'
import fs from 'node:fs'
import { EventEmitter } from 'node:events'
import crypto from 'node:crypto'

export enum EDownloader {
  INIT = 0,
  DOWNLOADING = 1,
  DOWNLOADED = 2,
  ERROR = 3
}

class Downloader extends EventEmitter {
  url: string
  filePath: string
  _tempFilePath: string
  constructor(url: string, filePath: string) {
    super()
    this.url = url
    this.filePath = filePath
    this._tempFilePath = filePath + '.temp'
  }
  /** 开始下载 */
  start() {
    if (!this.url || !this.filePath) return
    this.emit('init')
    const fileStream = fs.createWriteStream(this._tempFilePath)
    https
      .get(this.url, (response) => {
        if (response.statusCode !== 200) {
          this.cleanup()
          throw new Error(`Request Failed. Status Code: ${response.statusCode}`)
        }
        const fileSize = parseInt(response.headers['content-length']!)
        let downloadedSize = 0
        response.on('data', (chunk) => {
          downloadedSize += chunk.length
          const percent = downloadedSize / fileSize
          const progress = (percent * 100).toFixed(2)
          this.emit('progress', progress)

          if (downloadedSize === fileSize) {
            response.destroy()
          }
        })

        response.pipe(fileStream)
        fileStream.on('finish', () => {
          const hash = crypto.createHash('md5')
          fs.rename(this._tempFilePath, this.filePath, (error) => {
            if (error) {
              this.emit('error', error)
              return
            }
            const content = fs.readFileSync(this.filePath)
            hash.update(content)
            const md5 = hash.digest('hex')
            this.emit('downloaded', md5)
          })
        })
        fileStream.on('error', (error) => {
          this.cleanup()
          this.emit('error', error)
        })
      })
      .on('error', (error) => {
        this.cleanup()
        this.emit('error', error)
      })
  }
  cleanup() {
    fs.unlink(this._tempFilePath, (error) => {
      if (error) {
        this.emit('error', error)
      }
    })
  }
}

export default Downloader
