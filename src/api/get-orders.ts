import { api } from '@/lib/axios'

const orderStatus = [
  'pending',
  'canceled',
  'processing',
  'delivering',
  'delivered',
] as const

export type IOrderStatus = (typeof orderStatus)[number]

export interface IOrder {
  orderId: string
  createdAt: string
  status: IOrderStatus
  customerName: string
  total: number
}

export interface IGetOrdersResponse {
  orders: IOrder[]
  meta: {
    pageIndex: number
    perPage: number
    totalCount: number
  }
}

export async function getOrders() {
  const response = await api.get<IGetOrdersResponse>('/orders', {
    params: { pageIndex: 0 },
  })

  return response.data
}
