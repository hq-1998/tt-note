import { dialog, OpenDialogSyncOptions } from 'electron'

const fns = {
  showOpenDialogSync(options: OpenDialogSyncOptions = {}) {
    console.log('????')
    dialog.showOpenDialogSync(options)
  },
  aaa() {
    console.log('123')
  }
}

export default fns
