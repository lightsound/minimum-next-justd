import * as React from 'react'

import { tv } from 'tailwind-variants'
import { cn } from '~/utils/classes'

import { Heading } from './heading'

const card = tv({
  slots: {
    root: [
      'xrkr bg-bg rounded-xl xkd2 [&:has(table)_.ccvgs8x]:border-t [&:has(table)_.x32]:bg-tertiary [&:has(table)]:overflow-hidden border text-fg shadow-sm [&:has(.larhy3):not(:has(.yahnba))>.ccvgs8x]:pt-6 [&:has(.larhy3)]:overflow-hidden [&_table]:overflow-hidden',
    ],
    header: 'flex xlw32 flex-col space-y-1.5 px-6 py-5',
    title: 'sm:leading-6 leading-none klda font-semibold tracking-tight',
    description: 'text-base dl2 text-muted-fg sm:text-sm',
    content:
      'yahnba px-6 pb-6 has-[.t-hea]:bg-secondary/40 has-[table]:p-0 [&:has(table)+.ccvgs8x]:py-5 [&:has(table)]:border-t [&_.t-cel]:px-6 [&_.t-col]:px-6',
    footer: 'ccvgs8x flex items-center p-6 pt-0',
  },
})

const { root, header, title, description, content, footer } = card()

function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={root({ className })} {...props} />
}

interface HeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
  withoutPadding?: boolean
}

function Header({
  withoutPadding = false,
  className,
  title,
  description,
  children,
  ...props
}: HeaderProps) {
  return (
    <div className={header({ className: cn(className, withoutPadding && 'px-0 pt-0') })} {...props}>
      {title && <Title>{title}</Title>}
      {description && <Description>{description}</Description>}
      {!title && typeof children === 'string' ? <Title>{children}</Title> : children}
    </div>
  )
}

function Title({ className, level = 3, ...props }: React.ComponentProps<typeof Heading>) {
  return <Heading level={level} className={title({ className })} {...props} />
}

function Description({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} slot="description" className={description({ className })} {...props} />
}

function Content({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={content({ className })} {...props} />
}

function Footer({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={footer({ className })} {...props} />
}

Card.Content = Content
Card.Description = Description
Card.Footer = Footer
Card.Header = Header
Card.Title = Title

export { Card }
