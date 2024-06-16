import { api } from '@/lib/axios'
import { formatSimpleDate } from '@/utils/functions'

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

export type IGetDailyReceiptInPeriodProps = {
  from?: Date
  to?: Date
}

export type IGetDailyReceiptInPeriodResponse = {
  date: string
  receipt: number
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

export async function getDailyReceiptInPeriod({
  from,
  to,
}: IGetDailyReceiptInPeriodProps) {
  const response = await api.get<IGetDailyReceiptInPeriodResponse>(
    '/metrics/daily-receipt-in-period',
    {
      params: {
        from: from ? formatSimpleDate(from) : from,
        to: to ? formatSimpleDate(to) : to,
      },
    },
  )

  return response.data
}
