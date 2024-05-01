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

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { currencyBRL } from '@/utils/functions'

type IRevenueChartData = {
  date: string
  revenue: number
}

const data: IRevenueChartData[] = [
  { date: '10/12', revenue: 803.5 },
  { date: '11/12', revenue: 820 },
  { date: '12/12', revenue: 1901.33 },
  { date: '13/12', revenue: 434.5 },
  { date: '14/12', revenue: 2302 },
  { date: '15/12', revenue: 822.55 },
  { date: '16/12', revenue: 643.4 },
]

function returnLargestRevenue(data: IRevenueChartData[]) {
  let largest = 0

  for (let i = 0; i < data.length; i++) {
    if (data[i].revenue > largest) {
      largest = data[i].revenue
    }
  }

  return largest
}

export function RevenueChart() {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement
  let stickWidth = 80

  if (canvas) {
    const ctx = canvas.getContext('2d')
    if (ctx) {
      const largestRevenue = returnLargestRevenue(data)
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
        <ResponsiveContainer width="100%" height={240}>
          <LineChart style={{ fontsize: 12 }} data={data}>
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
              dataKey="revenue"
              stroke={colors.violet['500']}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
