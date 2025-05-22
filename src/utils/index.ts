// 同一时间请求多次，返回上一次结果
export function asyncOnce<T = any>(cb:(...args:any[])=>Promise<T>) {
  const map:Record<string, null | Promise<T>> = {}
  return (...args:any[]) => {
    const key = JSON.stringify(args)
    return (map[key] ??= new Promise((resolve, reject) => {
      cb(...args)
        .then(resolve)
        .catch(reject)
        .finally(() => {
          map[key] = null
        })
    }))
  }
}

// 平台判断，Pc | Mobile
export const isMobile = (): boolean => {
  const uA = navigator.userAgent.toLowerCase();
  const uAData = (navigator as any)?.userAgentData?.mobile
  const isMobileUA = uAData ?? /android|iphone|ipad/i.test(uA);
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 1;
  
  return isMobileUA && isTouchDevice;
};

// 深拷贝
export function deepClone<T>(val: T): T {
  const CACHE = new WeakMap<object, any>()
  
  function clone<V>(value: V): V {
    // 处理基本类型和 null
    if (value === null || typeof value !== 'object') {
      return value
    }

    // 处理特殊对象类型
    if (value instanceof Date) return new Date(value.getTime()) as V
    if (value instanceof RegExp) return new RegExp(value) as V
    if (value instanceof Map) {
      const map = new Map()
      for (const [key, val] of value.entries()) {
        map.set(clone(key), clone(val))
      }
      return map as V
    }
    if (value instanceof Set) {
      const set = new Set()
      for (const val of value.values()) {
        set.add(clone(val))
      }
      return set as V
    }

    // 检查循环引用
    if (CACHE.has(value as object)) {
      return CACHE.get(value as object)
    }

    // 创建新对象/数组
    const newVal: any = Array.isArray(value) ? [] : {}
    CACHE.set(value as object, newVal)

    // 递归克隆所有属性
    Reflect.ownKeys(value as object).forEach(key => {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        newVal[key] = clone((value as any)[key])
      }
    })

    return newVal
  }

  return clone(val)
}