import { useQuery } from '@tanstack/react-query'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import colors from 'tailwindcss/colors'

import { getDailyReceiptInPeriod } from '@/api/get-metrics'
import { LoadingTrendingUp } from '@/components/chart-loading'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { QUERY_KEYS } from '@/utils/constants'
import { currencyBRL, returnLargestRevenue } from '@/utils/functions'

const { GET_METRICS, GET_RECEIPT_IN_PERIOD } = QUERY_KEYS

export function RevenueChart() {
  const { data: dailyReceiptInPeriod } = useQuery({
    queryFn: getDailyReceiptInPeriod,
    queryKey: [GET_METRICS, GET_RECEIPT_IN_PERIOD],
  })

  const canvas = document.getElementById('canvas') as HTMLCanvasElement
  let stickWidth = 80

  if (dailyReceiptInPeriod && canvas) {
    const ctx = canvas.getContext('2d')
    if (ctx) {
      const largestRevenue = returnLargestRevenue(dailyReceiptInPeriod)
      const largestRevenueFormatted = currencyBRL(largestRevenue)

      const widthToIncrease = ctx.measureText(largestRevenueFormatted).width
      stickWidth = widthToIncrease + widthToIncrease * (70 / 100)
    }
  }

  return (
    <Card className="col-span-6">
      <CardHeader className="flex-row items-center justify-between pb-8">
        <div className="space-y-1">
          <CardTitle className="text-base font-medium">
            Receita no período
          </CardTitle>
          <CardDescription>Receita diária no período</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {dailyReceiptInPeriod ? (
          <ResponsiveContainer width="100%" height={240}>
            <LineChart style={{ fontsize: 12 }} data={dailyReceiptInPeriod}>
              <XAxis dataKey="date" tickLine={false} axisLine={false} dy={16} />

              <YAxis
                stroke="#888"
                axisLine={false}
                tickLine={false}
                width={stickWidth}
                tickFormatter={(value: number) => currencyBRL(value / 100)}
              />
              <CartesianGrid vertical={false} className="stroke-muted" />
              <Tooltip
                formatter={(value: number) => currencyBRL(value / 100)}
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
        ) : (
          <div className="flex h-[240px] w-full items-center justify-center">
            <LoadingTrendingUp />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
