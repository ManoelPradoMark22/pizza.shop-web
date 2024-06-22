import { api } from '@/lib/axios'

export interface IGetOrderQuery {
  pageIndex?: number | null
  orderId?: string | null
  customerName?: string | null
  status?: string | null
}

export const orderStatusArray = [
  'pending',
  'canceled',
  'processing',
  'delivering',
  'delivered',
] as const

export type IOrderStatus = (typeof orderStatusArray)[number]

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

export async function getOrders({
  pageIndex,
  orderId,
  customerName,
  status,
}: IGetOrderQuery) {
  const response = await api.get<IGetOrdersResponse>('/orders', {
    params: {
      pageIndex,
      orderId,
      customerName,
      status,
    },
  })

  return response.data
}
