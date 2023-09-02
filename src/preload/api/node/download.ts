import Downloader, { EDownloader } from '../../utils/downloader'
import store from '../../../main/store'

const handleError = (filePath: string, _error) => {
  store.updateState(filePath, {
    status: EDownloader.ERROR
  })
}

const handleProgress = (filePath: string, progress: number) => {
  store.updateState(filePath, {
    progress,
    status: EDownloader.DOWNLOADING
  })
}

const handleDownloaded = (filePath: string, md5: string) => {
  console.log(md5)
  store.updateState(filePath, {
    md5,
    status: EDownloader.DOWNLOADED
  })
}

const handleInit = (filePath: string, url: string) => {
  console.log('init')
  store.setState(filePath, {
    md5: null,
    progress: 0,
    filePath,
    url,
    status: EDownloader.INIT
  })
}

const fns = {
  download(url: string, filePath: string) {
    const downloader = new Downloader(url, filePath)

    downloader.on('init', () => handleInit(filePath, url))
    downloader.on('error', (error: Error) => handleError(filePath, error))
    downloader.on('progress', (progress: number) => handleProgress(filePath, progress))
    downloader.on('downloaded', (md5: string) => handleDownloaded(filePath, md5))

    downloader.start()
  }
}

export default fns
