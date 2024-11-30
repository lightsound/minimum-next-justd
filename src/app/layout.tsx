import type { NextLayoutProps } from '~/app/type'
import { Providers } from '~/justd/providers'
import '~/css/globals.css'

export default function RootLayout({ children }: NextLayoutProps) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
