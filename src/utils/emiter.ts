// 发布订阅-单例
type CallBack = (...args:any[])=> void
class Emitter {
  private Events:Record<string,Set<CallBack>> = {}
  private static Instance: Emitter
  private constructor(){}
  static getInstance (){
    return Emitter.Instance ??= new Emitter()
  }
  on(eventName:string,cb:CallBack){
    (this.Events[eventName] ??= new Set()).add(cb)
  }
  emit(eventName:string,...args:any[]){
    this.Events[eventName].forEach(cb=> cb(...args))
  }
  off(eventName:string,cb:CallBack){
    this.Events[eventName]?.delete(cb)
  }
  once(eventName:string,cb:CallBack){
    const handler = (...args:any[]) => {
      cb(...args)
      this.off(eventName, handler)
    }
    this.on(eventName, handler)
  }
}

export const Emitt = Emitter.getInstance()