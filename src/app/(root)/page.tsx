import { BarChart } from '~/components/bar-chart'
import { DateSelect } from '~/components/date-select'
import { Heading } from '~/justd/ui'

export default function Page() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-1">
          <Heading level={2}>Reports</Heading>
          <span className="text-sm">Last refresh: 30/11/2024, 15:19</span>
        </div>
        <div className="flex items-center gap-x-4">
          <DateSelect />
          <DateSelect />
          <DateSelect />
          <DateSelect />
        </div>
      </div>
      <BarChart />
      <BarChart />
    </div>
  )
}
