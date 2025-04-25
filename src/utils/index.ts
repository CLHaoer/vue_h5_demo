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