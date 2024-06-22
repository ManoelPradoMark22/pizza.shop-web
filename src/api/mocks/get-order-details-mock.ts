import { http, HttpResponse } from 'msw'

import {
  IGetOrderDetailsParams,
  IGetOrderDetailsResponse,
} from '../get-order-details'

export const getOrderDetailsMock = http.get<
  IGetOrderDetailsParams,
  never,
  IGetOrderDetailsResponse
>('/orders/:orderId', ({ params }) => {
  return HttpResponse.json({
    id: params.orderId,
    customer: {
      name: 'John Doe',
      email: 'johdoe@example.com',
      phone: '11922223333',
    },
    status: 'pending',
    createdAt: new Date().toISOString(),
    totalInCents: 56.4 * 100,
    orderItems: [
      {
        id: 'order-item-1',
        priceInCents: 44 * 100,
        product: {
          name: 'Pizza Frango com Catupiry',
        },
        quantity: 1,
      },
      {
        id: 'order-item-2',
        priceInCents: 12.4 * 100,
        product: {
          name: 'Refri 2L',
        },
        quantity: 1,
      },
    ],
  })
})
