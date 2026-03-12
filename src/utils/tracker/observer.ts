export function createObservableObject(
  obj: any,
  callback: (prop: string | symbol, value: any) => void,
): ProxyConstructor {
  return new Proxy(obj, {
    set(target, property, value) {
      if (target[property] !== value) {
        target[property] = value
        callback(property, value)
      }
      return true // success status
    },
  })
}

export function proxyDecode(obj: ProxyConstructor) {
  return JSON.parse(JSON.stringify(obj))
}
