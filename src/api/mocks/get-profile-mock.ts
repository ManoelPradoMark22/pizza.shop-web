import { http, HttpResponse } from 'msw'

import { IGetProfileResponse } from '../get-profile'

export const getProfileMock = http.get<never, never, IGetProfileResponse>(
  '/me',
  () => {
    return HttpResponse.json({
      id: 'custom-user-id',
      name: 'Manoel Prado',
      email: 'manoelprado.aecjr@gmail.com',
      phone: '31977779999',
      role: 'manager',
      createdAt: new Date().toISOString(),
      updatedAt: null,
    })
  },
)
