import appUpdater from '../../updater'
const fns = {
  /** 检测更新 */
  async patchUrlAndDownload(_event, options: { url: string }) {
    return await appUpdater.patchUrlAndDownload(options.url)
  }
}

export default fns
