class GlobalStorage {
  private storage: Storage = localStorage
  constructor(_storage: Storage = localStorage) {
    this.storage = _storage || localStorage
  }
  get(key: string) {
    const value = this.storage.getItem(key)
    if (!value) return null
    return JSON.parse(value)
  }
  length() {
    return this.storage.length
  }
  clear() {
    this.storage.clear()
  }
  set(key: string, value: unknown) {
    this.storage.setItem(key, JSON.stringify(value))
  }
  remove(key: string) {
    this.storage.removeItem(key)
  }
}

export default new GlobalStorage()
