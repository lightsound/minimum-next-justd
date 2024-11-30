import { TransactionsTable } from '~/components/transactions-table'
import { Heading } from '~/justd/ui'

export default function Page() {
  return (
    <div className="space-y-10">
      <Heading level={2}>Details</Heading>
      <TransactionsTable />
    </div>
  )
}
