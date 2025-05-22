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

// 获取图片列表
export const getImageList = (params?: { page: number, limit: number }) => {
  return get<any[]>('/v2/list', params, {
    baseURL: 'https://picsum.photos'
  })
}
