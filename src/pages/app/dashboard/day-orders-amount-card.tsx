import { useQuery } from '@tanstack/react-query'
import { Utensils } from 'lucide-react'

import { getDayOrdersAmount } from '@/api/get-metrics'
import { MetricCardSkeleton } from '@/components/skeletons/metric-card-skeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { QUERY_KEYS } from '@/utils/constants'
import { numberBRL } from '@/utils/functions'

const { GET_METRICS, GET_DAY_ORDERS_AMOUNT } = QUERY_KEYS

export function DayOrdersAmountCard() {
  const { data: dayOrdersAmount } = useQuery({
    queryFn: getDayOrdersAmount,
    queryKey: [GET_METRICS, GET_DAY_ORDERS_AMOUNT],
  })

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">Pedidos (dia)</CardTitle>
        <Utensils className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-1">
        {dayOrdersAmount ? (
          <>
            <span className="text-2xl font-bold tracking-tight">
              {numberBRL(dayOrdersAmount.amount)}
            </span>
            <p className="text-xs text-muted-foreground">
              {dayOrdersAmount.diffFromYesterday >= 0 ? (
                <>
                  <span
                    className={
                      dayOrdersAmount.diffFromYesterday === 0
                        ? 'text-slate-950 dark:text-slate-50'
                        : 'text-emerald-500 dark:text-emerald-400'
                    }
                  >
                    +{numberBRL(dayOrdersAmount.diffFromYesterday)}%
                  </span>{' '}
                  em relação a ontem
                </>
              ) : (
                <>
                  <span className="text-rose-500 dark:text-rose-400">
                    {numberBRL(dayOrdersAmount.diffFromYesterday)}%
                  </span>{' '}
                  em relação a ontem
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
