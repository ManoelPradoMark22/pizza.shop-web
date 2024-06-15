import { api } from '@/lib/axios'

interface IGetMonthOrdersAmountProps {
  typeAmount: 'month-orders-amount' | 'month-canceled-orders-amount'
}

export interface IGetDayOrdersAmountResponse {
  amount: number
  diffFromYesterday: number
}

export interface IGetMonthOrdersAmountResponse {
  amount: number
  diffFromLastMonth: number
}

export interface IGetMonthReceiptResponse {
  receipt: number
  diffFromLastMonth: number
}

export type IGetPopularProductsResponse = {
  product: string
  amount: number
}[]

export async function getDayOrdersAmount() {
  const response = await api.get<IGetDayOrdersAmountResponse>(
    '/metrics/day-orders-amount',
  )

  return response.data
}

export async function getMonthOrdersAmount({
  typeAmount,
}: IGetMonthOrdersAmountProps) {
  const response = await api.get<IGetMonthOrdersAmountResponse>(
    `/metrics/${typeAmount}`,
  )

  return response.data
}

export async function getMonthReceipt() {
  const response = await api.get<IGetMonthReceiptResponse>(
    '/metrics/month-receipt',
  )

  return response.data
}

export async function getPopularProducts() {
  const response = await api.get<IGetPopularProductsResponse>(
    '/metrics/popular-products',
  )

  return response.data
}
