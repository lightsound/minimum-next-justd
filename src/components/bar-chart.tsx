'use client'

import { IconCircleInfo } from 'justd-icons'
import { Bar, CartesianGrid, BarChart as OriginalBarChart, XAxis, YAxis } from 'recharts'
import { Card, Chart, type ChartConfig, Tooltip } from '~/justd/ui'

const data = [
  { date: '16/10/24', sales: 84846 },
  { date: '15/10/24', sales: 50014 },
  { date: '14/10/24', sales: 48213 },
  { date: '13/10/24', sales: 31803 },
  { date: '12/10/24', sales: 73902 },
  { date: '11/10/24', sales: 33945 },
  { date: '10/10/24', sales: 92381 },
  { date: '09/10/24', sales: 24945 },
  { date: '08/10/24', sales: 63145 },
  { date: '07/10/24', sales: 34533 },
  { date: '06/10/24', sales: 78904 },
  { date: '05/10/24', sales: 28573 },
  { date: '04/10/24', sales: 36788 },
  { date: '03/10/24', sales: 38920 },
  { date: '02/10/24', sales: 40119 },
  { date: '01/10/24', sales: 3019 },
]

const config = {
  sales: {
    label: 'Sales',
    color: 'hsl(var(--primary-chart))',
  },
  profit: {
    label: 'Profit',
    color: 'hsl(var(--secondary-chart))',
  },
} satisfies ChartConfig

export function BarChart() {
  return (
    <Card className="border-0 shadow-none">
      <Card.Header className="space-y-2 px-0">
        <Card.Description className="flex items-center gap-x-2">
          Total Transaction Amount
          <Tooltip delay={200} closeDelay={0}>
            <Tooltip.Trigger aria-label="Follow My Twitter">
              <IconCircleInfo />
            </Tooltip.Trigger>
            <Tooltip.Content intent="inverse">
              <div className="relative">
                <strong className="font-semibold">Attention</strong>
                <p>This is a warning message.</p>
              </div>
            </Tooltip.Content>
          </Tooltip>
        </Card.Description>
        <Card.Title className="!text-2xl">$708,395</Card.Title>
      </Card.Header>

      <Card.Content className="px-0">
        <Chart className="max-h-[250px] min-h-[250px] w-full" config={config}>
          <OriginalBarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis tickFormatter={(value: number) => `$${value.toLocaleString()}`} />
            <Chart.Tooltip cursor={false} content={<Chart.TooltipContent hideLabel />} />
            <Bar dataKey="sales" fill="var(--color-sales)" radius={4} />
          </OriginalBarChart>
        </Chart>
      </Card.Content>
    </Card>
  )
}
