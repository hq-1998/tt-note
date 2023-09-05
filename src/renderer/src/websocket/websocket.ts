enum EWebSocketStatus {
  CONNECTING = 0,
  OPEN = 1,
  CLOSING = 2,
  CLOSED = 3,
}

type Callback = (...args: any[]) => void

/** 返回数据通用格式 */
interface IMessage {
  event: string
  data: any
}

const RECONNECT_INTERVAL = 3 * 1000;

class GlobalWebsocket {
  url: string
  socket: WebSocket | null = null
  readyState: number = EWebSocketStatus.CONNECTING
  events: Map<string, Set<Callback>> = new Map()
  reconnectInterval: number = RECONNECT_INTERVAL
  reconnectTimer: number | null = null
  constructor(url: string) {
    this.url = url;
  }
  connect() {
    if (!this.url) {
      throw new Error('websocket url is null')
    }
    this.socket = new WebSocket(this.url)
    this.socket.addEventListener('open', this.onOpen)
    this.socket.addEventListener('message', this.onMessage)
    this.socket.addEventListener('error', this.onError)
    this.socket.addEventListener('close', this.onClose)
  }
  /** websocket打开 */
  onOpen() {
    console.log('websocket建立连接')
    this.readyState = EWebSocketStatus.OPEN
  }
  /** 清除定时器 */
  clear() {
    clearInterval(this.reconnectInterval);
  }
  /** websocket收到消息 */
  onMessage(event) {
    console.log('websocket接收到消息', event)
    const message: IMessage = JSON.parse(event.data)
    this.notify(message.event, message.data)
  }
  /** websocket错误 */
  onError(e) {
    console.log('websocket接收到错误', e)
    this.clear();
    this.onClose();
    this.reconnect();
  }
  /** websocket关闭 */
  onClose() {
    console.log('websocket关闭');
    this.clear();
    this.socket.close();
    this.readyState = EWebSocketStatus.CLOSED;
    this.reconnect();
  }
  /** 发送消息给服务端 */
  sendMessage(data) {
    if (this.readyState === EWebSocketStatus.OPEN) {
       this.socket.send(JSON.stringify(data));
    }
  }
  /** 重连 */
  reconnect() {
    this.clear();
    this.reconnectTimer = setTimeout(() => {
      this.connect()
    }, this.reconnectInterval)
  }
  /** 订阅消息 */
  subscribe(event: string, callback: Callback) {
    if (!this.events.has(event)) {
      this.events.set(event, new Set())
    }
    const subEvent = this.events.get(event);
    subEvent.add(callback);
  }
  /** 取消订阅消息 */
  unsubscribe(event: string, callback?: Callback) {
    if (!this.events.has(event)) {
      return;
    }
    if (!callback) {
      this.events.delete(event);
      return;
    }
    const subEvent = this.events.get(event);
    subEvent.delete(callback);
  }
  /** 触发订阅消息 */
  notify(event: string, data: any) {
    const subEvent = this.events.get(event);
    if (subEvent) {
      subEvent.forEach((callback: Callback) => {
        callback(data)
      })
    }
  }
}

export default new GlobalWebsocket(import.meta.env.RENDERER_VITE_WS_API)
