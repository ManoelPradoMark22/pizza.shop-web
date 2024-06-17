import { http, HttpResponse } from 'msw'

import {
  IGetDailyReceiptInPeriodResponse,
  IGetDayOrdersAmountResponse,
  IGetMonthOrdersAmountResponse,
  IGetMonthReceiptResponse,
  IGetPopularProductsResponse,
} from '../get-metrics'

export const getDayOrdersAmountMock = http.get<
  never,
  never,
  IGetDayOrdersAmountResponse
>('/metrics/day-orders-amount', () => {
  return HttpResponse.json({
    amount: 20,
    diffFromYesterday: -30,
  })
})

export const getMonthOrdersAmountMock = http.get<
  never,
  never,
  IGetMonthOrdersAmountResponse
>('/metrics/month-orders-amount', () => {
  return HttpResponse.json({
    amount: 200,
    diffFromLastMonth: 0,
  })
})

export const getMonthCanceledOrdersAmountMock = http.get<
  never,
  never,
  IGetMonthOrdersAmountResponse
>('/metrics/month-canceled-orders-amount', () => {
  return HttpResponse.json({
    amount: 5,
    diffFromLastMonth: -5,
  })
})

export const getMonthReceiptMock = http.get<
  never,
  never,
  IGetMonthReceiptResponse
>('/metrics/month-receipt', () => {
  return HttpResponse.json({
    receipt: 9200,
    diffFromLastMonth: 11.43,
  })
})

export const getDailyReceiptInPeriodMock = http.get<
  never,
  never,
  IGetDailyReceiptInPeriodResponse
>('/metrics/daily-receipt-in-period', () => {
  return HttpResponse.json([
    {
      date: '01/01',
      receipt: 2000,
    },
    {
      date: '02/01',
      receipt: 1923.34,
    },
    {
      date: '03/01',
      receipt: 1523,
    },
    {
      date: '04/01',
      receipt: 3244,
    },
    {
      date: '05/01',
      receipt: 4500,
    },
    {
      date: '06/01',
      receipt: 1233,
    },
    {
      date: '07/01',
      receipt: 2332.23,
    },
  ])
})

export const getPopularProductsMock = http.get<
  never,
  never,
  IGetPopularProductsResponse
>('/metrics/popular-products', () => {
  return HttpResponse.json([
    { product: 'Pizza 01', amount: 50 },
    { product: 'Pizza 02', amount: 60 },
    { product: 'Pizza 03', amount: 10 },
    { product: 'Pizza 04', amount: 20 },
    { product: 'Pizza 05', amount: 49 },
    // { product: 'Pizza 06', amount: 50 },
    // { product: 'Pizza 07', amount: 60 },
    // { product: 'Pizza 08', amount: 10 },
    // { product: 'Pizza 09', amount: 20 },
    // { product: 'Pizza 10', amount: 49 },
  ])
})
