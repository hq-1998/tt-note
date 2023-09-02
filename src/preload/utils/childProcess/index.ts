import {
  SpawnOptionsWithoutStdio,
  spawn,
  spawnSync,
  exec,
  execFile,
  ExecException
} from 'node:child_process'

class ChildProcess {
  // 适配
  spawn = (command: string, options?: SpawnOptionsWithoutStdio) => {
    const result = spawn(command, options)
    this.listener(result)
  }
  spawnSync = (command: string) => {
    const result = spawnSync(command)
    this.listener(result)
  }
  // shell
  exec = (
    command: string,
    callback?: (error: ExecException | null, stdout: string, stderr: string) => void
  ) => {
    return exec(command, callback)
  }
  // 默认生成指令
  execFile = (file: string) => {
    return execFile(file)
  }
  handleData(data) {
    console.log(`stdout: ${data}`)
  }
  handleError(data) {
    console.log(`stderr: ${data}`)
  }
  handleClose(code) {
    console.log(`子进程退出码：${code}`)
  }
  listener(result) {
    result.stdout.on('data', this.handleData)
    result.stderr.on('data', this.handleError)
    result.on('close', this.handleClose)
  }
}

export default new ChildProcess()
