import { useQuery } from '@tanstack/react-query'
import { differenceInDays, subDays } from 'date-fns'
import { useMemo, useState } from 'react'
import { DateRange } from 'react-day-picker'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { toast } from 'sonner'
import colors from 'tailwindcss/colors'

import { getDailyReceiptInPeriod } from '@/api/get-metrics'
import { LoadingTrendingUp } from '@/components/chart-loading'
import { DataStatus } from '@/components/data-status'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { DateRangePicker } from '@/components/ui/date-range-picker'
import { Label } from '@/components/ui/label'
import { QUERY_KEYS } from '@/utils/constants'
import { currencyBRL, returnLargestRevenue } from '@/utils/functions'

const { GET_METRICS, GET_RECEIPT_IN_PERIOD } = QUERY_KEYS

export function RevenueChart() {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(now, 7),
    to: now,
  })

  const handleDateChange = (newRange: DateRange | undefined) => {
    const { from, to } = newRange || {}
    if (from && to) {
      const dayDiff = differenceInDays(to, from)

      if (dayDiff <= 7) {
        setDateRange(newRange)
      } else {
        toast.error('Range must be 7 days or less')
      }
    } else {
      setDateRange(newRange)
    }
  }

  const {
    data: dailyReceiptInPeriod,
    isFetching: loadingDailyReceiptInPeriod,
    isError: errorDailyReceiptInPeriod,
    refetch,
  } = useQuery({
    queryFn: () =>
      getDailyReceiptInPeriod({ from: dateRange?.from, to: dateRange?.to }),
    queryKey: [GET_METRICS, GET_RECEIPT_IN_PERIOD, dateRange],
  })

  const reFetchDailyReceiptInPeriod = () => {
    refetch()
  }

  const canvas = document.getElementById('canvas') as HTMLCanvasElement
  let stickWidth = 80

  const chartData = useMemo(() => {
    return dailyReceiptInPeriod?.map((charItem) => {
      return {
        date: charItem.date,
        receipt: charItem.receipt / 100,
      }
    })
  }, [dailyReceiptInPeriod])

  if (chartData && canvas) {
    const ctx = canvas.getContext('2d')
    if (ctx) {
      const largestRevenue = returnLargestRevenue(chartData)
      const largestRevenueFormatted = currencyBRL(largestRevenue)

      const widthToIncrease = ctx.measureText(largestRevenueFormatted).width
      stickWidth = widthToIncrease + widthToIncrease * (70 / 100)
    }
  }

  const isLoading = loadingDailyReceiptInPeriod && !errorDailyReceiptInPeriod

  return (
    <Card className="col-span-6">
      <CardHeader className="flex-row items-center justify-between pb-8">
        <div className="space-y-1">
          <CardTitle className="text-base font-medium">
            Receita no período
          </CardTitle>
          <CardDescription>Receita diária no período</CardDescription>
        </div>

        <div className="flex items-center gap-3">
          <Label>Período</Label>
          <DateRangePicker
            date={dateRange}
            onDateChange={handleDateChange}
            isLoading={isLoading}
          />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex h-[240px] w-full items-center justify-center">
            <LoadingTrendingUp />
          </div>
        ) : !chartData ? (
          <div className="flex h-[240px] w-full items-center justify-center">
            <DataStatus
              type="error"
              size={35}
              refetch={reFetchDailyReceiptInPeriod}
            />
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex h-[240px] w-full items-center justify-center">
            <DataStatus type="no-data" size={35} />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <LineChart style={{ fontsize: 12 }} data={chartData}>
              <XAxis dataKey="date" tickLine={false} axisLine={false} dy={16} />

              <YAxis
                stroke="#888"
                axisLine={false}
                tickLine={false}
                width={stickWidth}
                tickFormatter={(value: number) => currencyBRL(value)}
              />
              <CartesianGrid vertical={false} className="stroke-muted" />
              <Tooltip
                formatter={(value: number) => currencyBRL(value)}
                itemStyle={{ fontWeight: 700 }}
                contentStyle={{ backgroundColor: 'var(--background)' }}
              />
              <Line
                type="linear"
                name="Receita"
                strokeWidth={2}
                dataKey="receipt"
                stroke={colors.violet['500']}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
