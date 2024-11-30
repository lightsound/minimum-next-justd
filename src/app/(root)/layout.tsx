import type { NextLayoutProps } from '~/app/type'
import { AppLayout } from '~/components/app-layout'
import '~/css/globals.css'

export default function RootLayout({ children }: NextLayoutProps) {
  return (
    <AppLayout>
      {children}
    </AppLayout>
  )
}
