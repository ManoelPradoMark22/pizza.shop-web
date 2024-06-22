import { api } from '@/lib/axios'

export interface IGetProfileResponse {
  id: string
  name: string
  email: string
  phone: string | null
  role: 'manager' | 'customer'
  createdAt: string | null
  updatedAt: string | null
}

export async function getProfile() {
  const response = await api.get<IGetProfileResponse>('/me')

  return response.data
}
