import { http, HttpResponse } from 'msw'

import { IGetManagedRestaurantResponse } from '../get-managed-restaurant'

export const getManagedRestaurantMock = http.get<
  never,
  never,
  IGetManagedRestaurantResponse
>('/managed-restaurant', () => {
  return HttpResponse.json({
    id: 'custom-restaurant-id',
    name: 'Sorveteria Chaplin',
    createdAt: new Date().toISOString(),
    updatedAt: null,
    description: 'Um pouco de tudo!',
    managerId: 'custom-user-id',
  })
})
