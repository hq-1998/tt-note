const Electron_Store_Key = 'Electron_Store_Key'

type StoreObserver = (value: any) => void

class Store {
  private observers: Map<string, StoreObserver[]> = new Map()
  constructor() {
    this.init()
  }
  init() {
    global[Electron_Store_Key] = {}
  }
  setState(key: string, value: any) {
    global[Electron_Store_Key][key] = value
    this.notifyObservers(key, value)
  }
  updateState(key: string, value: any) {
    global[Electron_Store_Key][key] = {
      ...global[Electron_Store_Key][key],
      ...value
    }
    this.notifyObservers(key, value)
  }
  delete(key: string) {
    delete global[Electron_Store_Key][key]
  }
  getState(key: string) {
    return global[Electron_Store_Key][key]
  }
  subscribe(key: string, callback: StoreObserver) {
    let observer = this.observers.get(key)
    if (!observer) {
      observer = []
      this.observers.set(key, observer)
    }
    observer = [...observer, callback]
    this.observers.set(key, observer)
    console.log(this.observers, 'observers')
    return () => {
      this.unsubscribe(key)
    }
  }
  private notifyObservers(key: string, value: any) {
    console.log('notifyObservers', this.observers)
    const observers = this.observers.get(key)
    if (observers) {
      observers.forEach((observer) => observer(value))
    }
  }
  unsubscribe(key: string) {
    const observers = this.observers.get(key)
    if (observers) {
      this.observers.delete(key)
    }
  }
}

export default new Store()
