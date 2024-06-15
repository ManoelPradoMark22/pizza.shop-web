import { useQuery } from '@tanstack/react-query'
import { Ban } from 'lucide-react'

import { getMonthOrdersAmount } from '@/api/get-metrics'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { QUERY_KEYS } from '@/utils/constants'
import { numberBRL } from '@/utils/functions'

import { MetricCardSkeleton } from './skeletons/metric-card-skeleton'

const { GET_METRICS, GET_MONTH_CANCELED_ORDERS_AMOUNT } = QUERY_KEYS

export function MonthCanceledOrdersAmountCard() {
  const { data: monthCanceledOrdersAmount } = useQuery({
    queryFn: () =>
      getMonthOrdersAmount({ typeAmount: 'month-canceled-orders-amount' }),
    queryKey: [GET_METRICS, GET_MONTH_CANCELED_ORDERS_AMOUNT],
  })

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">
          Cancelamentos (mês)
        </CardTitle>
        <Ban className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-1">
        {monthCanceledOrdersAmount ? (
          <>
            <span className="text-2xl font-bold tracking-tight">
              {numberBRL(monthCanceledOrdersAmount.amount)}
            </span>
            <p className="text-xs text-muted-foreground">
              {monthCanceledOrdersAmount.diffFromLastMonth <= 0 ? (
                <>
                  <span className="text-emerald-500 dark:text-emerald-400">
                    {monthCanceledOrdersAmount.diffFromLastMonth === 0
                      ? '-'
                      : ''}
                    {numberBRL(monthCanceledOrdersAmount.diffFromLastMonth)}%
                  </span>{' '}
                  em relação ao mês passado
                </>
              ) : (
                <>
                  <span className="text-rose-500 dark:text-rose-400">
                    +{numberBRL(monthCanceledOrdersAmount.diffFromLastMonth)}%
                  </span>{' '}
                  em relação ao mês passado
                </>
              )}
            </p>
          </>
        ) : (
          <MetricCardSkeleton />
        )}
      </CardContent>
    </Card>
  )
}
