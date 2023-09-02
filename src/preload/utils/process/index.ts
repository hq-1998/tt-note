import process from 'node:process'

class Process {
  constructor() {
    /**
     * 1. process方法被显示调用
     * 2. Nodejs事件循环不需要执行任何额外的工作
     */
    process.on('exit', this.handleExit)
    process.on('message', this.handleMessage)
  }
  handleExit(code) {
    console.log(`About to exit with code: ${code}`)
  }
  handleMessage(message: any) {
    console.log('ipc receive message: ', message)
  }
}

export default new Process()
