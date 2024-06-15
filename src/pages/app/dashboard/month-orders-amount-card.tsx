import { useQuery } from '@tanstack/react-query'
import { Utensils } from 'lucide-react'

import { getMonthOrdersAmount } from '@/api/get-metrics'
import { MetricCardSkeleton } from '@/components/skeletons/metric-card-skeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { QUERY_KEYS } from '@/utils/constants'
import { numberBRL } from '@/utils/functions'

const { GET_METRICS, GET_MONTH_ORDERS_AMOUNT } = QUERY_KEYS

export function MonthOrdersAmountCard() {
  const { data: monthOrdersAmount } = useQuery({
    queryFn: () => getMonthOrdersAmount({ typeAmount: 'month-orders-amount' }),
    queryKey: [GET_METRICS, GET_MONTH_ORDERS_AMOUNT],
  })

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">Pedidos (mês)</CardTitle>
        <Utensils className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-1">
        {monthOrdersAmount ? (
          <>
            <span className="text-2xl font-bold tracking-tight">
              {numberBRL(monthOrdersAmount.amount)}
            </span>
            <p className="text-xs text-muted-foreground">
              {monthOrdersAmount.diffFromLastMonth >= 0 ? (
                <>
                  <span
                    className={
                      monthOrdersAmount.diffFromLastMonth === 0
                        ? 'text-slate-950 dark:text-slate-50'
                        : 'text-emerald-500 dark:text-emerald-400'
                    }
                  >
                    +{numberBRL(monthOrdersAmount.diffFromLastMonth)}%
                  </span>{' '}
                  em relação ao mês passado
                </>
              ) : (
                <>
                  <span className="text-rose-500 dark:text-rose-400">
                    {numberBRL(monthOrdersAmount.diffFromLastMonth)}%
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
