import { Button, Card, Heading } from '~/justd/ui'

export default function Page() {
  return (
    <div className="p-20">
      <Card className="space-y-4 p-4">
        <Heading>Hello, Justd!</Heading>
        <Button>無反応ボタン</Button>
      </Card>
    </div>
  )
}
