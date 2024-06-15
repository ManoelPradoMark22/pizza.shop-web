import { useQuery } from '@tanstack/react-query'
import { DollarSign } from 'lucide-react'

import { getMonthReceipt } from '@/api/get-metrics'
import { MetricCardSkeleton } from '@/components/skeletons/metric-card-skeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { QUERY_KEYS } from '@/utils/constants'
import { currencyBRL, numberBRL } from '@/utils/functions'

const { GET_METRICS, GET_MONTH_RECEIPT } = QUERY_KEYS

export function MonthRevenueCard() {
  const { data: monthReceipt } = useQuery({
    queryFn: getMonthReceipt,
    queryKey: [GET_METRICS, GET_MONTH_RECEIPT],
  })

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">
          Receita total (mês)
        </CardTitle>
        <DollarSign className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-1">
        {monthReceipt ? (
          <>
            <span className="text-2xl font-bold tracking-tight">
              {currencyBRL(monthReceipt.receipt / 100)}
            </span>
            <p className="text-xs text-muted-foreground">
              {monthReceipt.diffFromLastMonth >= 0 ? (
                <>
                  <span
                    className={
                      monthReceipt.diffFromLastMonth === 0
                        ? 'text-slate-950 dark:text-slate-50'
                        : 'text-emerald-500 dark:text-emerald-400'
                    }
                  >
                    +{numberBRL(monthReceipt.diffFromLastMonth)}%
                  </span>{' '}
                  em relação ao mês passado
                </>
              ) : (
                <>
                  <span className="text-rose-500 dark:text-rose-400">
                    {numberBRL(monthReceipt.diffFromLastMonth)}%
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
