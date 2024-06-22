import { api } from '@/lib/axios'

export interface IGetManagedRestaurantResponse {
  id: string
  name: string
  createdAt: string | null
  updatedAt: string | null
  description: string | null
  managerId: string | null
}

export async function getManagedRestaurant() {
  const response = await api.get<IGetManagedRestaurantResponse>(
    '/managed-restaurant',
  )

  return response.data
}
