import http from '@renderer/request'

const test = {
  test1(): Promise<any> {
    return http.get('/')
  }
}

export default test
