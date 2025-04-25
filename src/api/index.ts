import { post, get } from "@/utils/http";

export const getList = (params: any) => {
  return post<any[]>('/api/getList', params)
}

export const login = (params: any) => {
  return post<any>('/api/login', params)
}

export const getUserinfo = (params?: any) => {
  return get<any>('/api/getUserinfo', params)
}