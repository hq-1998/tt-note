const shallowMergeObject = (obj1: Record<string, any>, obj2: Record<string, any>) => {
  const keys = Object.keys(obj2)
  keys.forEach((key) => {
    obj1[key] = obj2[key]
  })
  return obj1
}

const getImageBase64 = (
  file: File
): Promise<{
  base64Code: string
  fileType: string
}> => {
  return new Promise((resolve) => {
    const fileType = file.name.split('.')[1]
    const imgObject = URL.createObjectURL(file)
    const img = new Image()
    img.src = imgObject
    img.onload = () => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (e) => {
        const result = e.target?.result
        if (result) {
          const base64Code = (result as string).split('base64,')[1]
          resolve({
            base64Code,
            fileType
          })
        }
      }
    }
  })
}

const svgDir = import.meta.glob('@renderer/assets/images/svg/*.svg', { eager: true }) as Record<
  string,
  {
    default: string
  }
>

const loadSvg = (key: string): string | undefined => {
  const svgObj = Object.create(null)
  Object.keys(svgDir).forEach((svgName) => {
    const name = svgName.split('/').at(-1)?.split('.')[0]
    if (name) {
      svgObj[name] = svgDir[svgName].default
    }
  })
  return svgObj?.[key]
}

export { shallowMergeObject, loadSvg, getImageBase64 }
