'use client'

import { Select } from '~/justd/ui'

export function DateSelect() {
  return (
    <Select label="Date Range" defaultSelectedKey={3}>
      <Select.Trigger />
      <Select.List items={[
        { id: 1, name: 'Last 7 Days' },
        { id: 2, name: 'Last 30 Days' },
        { id: 3, name: 'Last 60 Days' },
        { id: 4, name: 'Last 90 Days' },
        { id: 5, name: 'Last 180 Days' },
        { id: 6, name: 'Last 365 Days' },
      ]}
      >
        {item => <Select.Option id={item.id} textValue={item.name}>{item.name}</Select.Option>}
      </Select.List>
    </Select>

  )
}
