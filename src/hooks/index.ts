import { deepClone } from "@/utils"
export function resetRef<T>(val:T){
  const initialValue = deepClone<T>(val)
  const state = ref<T>(val)
  const reset = ()=>{
    state.value = deepClone(initialValue)
  }
  return [state,reset] as const
}