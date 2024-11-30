'use client'

import * as React from 'react'

import { useVisuallyHidden } from 'react-aria'

interface VisuallyHiddenSpanProps {
  children: React.ReactNode
}

function VisuallyHidden({ children }: VisuallyHiddenSpanProps) {
  const { visuallyHiddenProps } = useVisuallyHidden()

  return <span {...visuallyHiddenProps}>{children}</span>
}

export { VisuallyHidden }
