'use client'

import { IconCheck, IconHamburger } from 'justd-icons'

import * as React from 'react'
import {
  ListBoxItem as ListBoxItemPrimitive,
  type ListBoxItemProps as ListBoxItemPrimitiveProps,
  ListBox as ListBoxPrimitive,
  type ListBoxProps as ListBoxPrimitiveProps,
} from 'react-aria-components'
import { tv } from 'tailwind-variants'

import { DropdownItemDetails, DropdownSection } from './dropdown'
import { cn, cr } from './primitive'

const listBoxStyles = tv({
  base: 'flex max-h-96 [&::-webkit-scrollbar]:size-0.5 [scrollbar-width:thin] w-full gap-y-1 min-w-72 flex-col overflow-y-auto rounded-xl border p-1 shadow-lg outline-none',
})

interface ListBoxProps<T> extends ListBoxPrimitiveProps<T> {
  className?: string
}

function ListBox<T extends object>({ children, className, ...props }: ListBoxProps<T>) {
  return (
    <ListBoxPrimitive {...props} className={listBoxStyles({ className })}>
      {children}
    </ListBoxPrimitive>
  )
}

const listBoxItemStyles = tv({
  base: 'lbi cursor-pointer relative rounded-[calc(var(--radius)-1px)] p-2 text-base outline-none lg:text-sm',
  variants: {
    isFocusVisible: {
      true: 'bg-secondary [&:focus-visible_[slot=label]]:text-accent-fg [&:focus-visible_[slot=description]]:text-accent-fg/70 text-secondary-fg',
    },
    isHovered: {
      true: 'bg-accent [&:hover_[slot=label]]:text-accent-fg [&:hover_[slot=description]]:text-accent-fg/70 text-accent-fg [&_.text-muted-fg]:text-accent-fg/80',
    },
    isFocused: {
      true: '[&_[data-slot=icon]]:text-accent-fg [&_[data-slot=label]]:text-accent-fg [&_.text-muted-fg]:text-accent-fg/80 bg-accent text-accent-fg',
    },
    isSelected: {
      true: '[&_[data-slot=icon]]:text-accent-fg [&_[data-slot=label]]:text-accent-fg [&_.text-muted-fg]:text-accent-fg/80 bg-accent text-accent-fg',
    },
    isDragging: { true: 'cursor-grabbing bg-secondary text-secondary-fg' },
    isDisabled: {
      true: 'opacity-70 cursor-default text-muted-fg',
    },
  },
})

interface ListBoxItemProps<T extends object> extends ListBoxItemPrimitiveProps<T> {
  className?: string
}

function ListBoxItem<T extends object>({ children, className, ...props }: ListBoxItemProps<T>) {
  const textValue = typeof children === 'string' ? children : undefined

  return (
    <ListBoxItemPrimitive
      textValue={textValue}
      {...props}
      className={cr(className, (className, renderProps) =>
        listBoxItemStyles({
          ...renderProps,
          className,
        }))}
    >
      {values => (
        <div className="flex items-center gap-2">
          {values.allowsDragging && (
            <IconHamburger
              className={cn(
                'size-4 shrink-0 text-muted-fg transition',
                values.isFocused && 'text-fg',
                values.isDragging && 'text-fg',
                values.isSelected && 'text-accent-fg/70',
              )}
            />
          )}
          <div className="flex flex-col">
            {typeof children === 'function' ? children(values) : children}

            {values.isSelected && (
              <span className="absolute right-2 top-3 animate-in lg:top-2.5">
                <IconCheck />
              </span>
            )}
          </div>
        </div>
      )}
    </ListBoxItemPrimitive>
  )
}

type ListBoxPickerProps<T> = ListBoxProps<T>

function ListBoxPicker<T extends object>({ className, ...props }: ListBoxPickerProps<T>) {
  return (
    <ListBoxPrimitive
      className={cn('max-h-72 overflow-auto p-1 outline-none', className)}
      {...props}
    />
  )
}

function Section({ className, ...props }: React.ComponentProps<typeof DropdownSection>) {
  return (
    <DropdownSection className={cn(className, 'gap-y-1 [&_.lbi:last-child]:-mb-1.5')} {...props} />
  )
}

ListBox.Section = Section
ListBox.ItemDetails = DropdownItemDetails
ListBox.Item = ListBoxItem
ListBox.Picker = ListBoxPicker

// eslint-disable-next-line react-refresh/only-export-components
export { ListBox, type ListBoxPickerProps, listBoxStyles }
