import { api } from '@/lib/axios'

export interface IGetOrderQuery {
  pageIndex?: number | null
}

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

export async function getOrders({ pageIndex }: IGetOrderQuery) {
  const response = await api.get<IGetOrdersResponse>('/orders', {
    params: { pageIndex },
  })

  return response.data
}
