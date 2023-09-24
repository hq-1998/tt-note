import './spark-md5'

self.addEventListener('message', async (event) => {
  const chunks = event.data
  const md5 = await generateMD5(chunks)
  self.postMessage(md5)
})

/**
 * 生成md5
 * @param chunks 文件blob集合
 */
const generateMD5 = (chunks) => {
  const spark = new self.SparkMD5()
  return new Promise((resolve) => {
    const readChunks = (index) => {
      if (index >= chunks.length) {
        const md5 = spark.end()
        resolve(md5)
        return
      }
      const blob = chunks[index]
      const reader = new FileReader()

      reader.onload = (e) => {
        const bytes = e.target?.result
        spark.append(bytes)
        readChunks(index + 1)
      }
      reader.readAsArrayBuffer(blob)
    }
    readChunks(0)
  })
}
