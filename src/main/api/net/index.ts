import { ClientRequestConstructorOptions, net, ClientRequest } from 'electron'

const fns = {
  request(_event, options: ClientRequestConstructorOptions | string): ClientRequest {
    return net.request(options)
  },
  /** 是否有互联网连接 */
  isOnline(): boolean {
    return net.isOnline()
  }
}

export default fns
