import { http, HttpResponse } from 'msw'

import { IRegisterRestaurantBody } from '../register-restaurant'

export const registerRestaurantMock = http.post<never, IRegisterRestaurantBody>(
  '/restaurants',
  async ({ request }) => {
    const { restaurantName } = await request.json()

    if (
      restaurantName === 'Pizza Shop' ||
      restaurantName === 'Sorveteria Chaplin'
    ) {
      return new HttpResponse(null, {
        status: 201,
      })
    }

    return new HttpResponse(null, { status: 400 })
  },
)
