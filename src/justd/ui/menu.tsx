'use client'

import type {
  ButtonProps,
  MenuItemProps as MenuItemPrimitiveProps,
  MenuProps as MenuPrimitiveProps,
  MenuSectionProps,
  MenuTriggerProps as MenuTriggerPrimitiveProps,
  PopoverProps,
  SeparatorProps,
} from 'react-aria-components'

import type { VariantProps } from 'tailwind-variants'
import { IconBulletFill, IconCheck, IconChevronLgRight } from 'justd-icons'
import * as React from 'react'
import {
  Button,
  Collection,
  Header,
  MenuItem,
  Menu as MenuPrimitive,
  MenuSection,
  MenuTrigger as MenuTriggerPrimitive,
  Separator,
  SubmenuTrigger as SubmenuTriggerPrimitive,
} from 'react-aria-components'
import { tv } from 'tailwind-variants'

import { DropdownItemDetails, dropdownItemStyles, dropdownSectionStyles } from './dropdown'
import { Keyboard } from './keyboard'
import { Popover } from './popover'
import { cn, cr } from './primitive'

interface MenuContextProps {
  respectScreen: boolean
}

const MenuContext = React.createContext<MenuContextProps>({ respectScreen: true })

interface MenuProps extends MenuTriggerPrimitiveProps {
  respectScreen?: boolean
}

function Menu({ respectScreen = true, ...props }: MenuProps) {
  return (
    // eslint-disable-next-line react/no-unstable-context-value
    <MenuContext.Provider value={{ respectScreen }}>
      <MenuTriggerPrimitive {...props}>{props.children}</MenuTriggerPrimitive>
    </MenuContext.Provider>
  )
}

function SubMenu({ delay = 0, ...props }) {
  return (
    <SubmenuTriggerPrimitive {...props} delay={delay}>
      {props.children}
    </SubmenuTriggerPrimitive>
  )
}

const menuStyles = tv({
  slots: {
    menu: 'z32kk max-h-[calc(var(--visual-viewport-height)-10rem)] sm:max-h-[inherit] overflow-auto rounded-xl p-1 outline outline-0 [clip-path:inset(0_0_0_0_round_calc(var(--radius)-2px))]',
    popover: 'z-50 min-w-40 p-0 outline-none shadow-sm',
    trigger: [
      'inline relative text-left focus:outline-none focus-visible:ring-1 focus-visible:ring-primary pressed:outline-none',
    ],
  },
})

const { menu, popover, trigger } = menuStyles()

interface MenuTriggerProps extends ButtonProps {
  className?: string
}

function Trigger({ className, ...props }: MenuTriggerProps) {
  return (
    <Button className={trigger({ className })} {...props}>
      {values => (
        <>{typeof props.children === 'function' ? props.children(values) : props.children}</>
      )}
    </Button>
  )
}

interface MenuContentProps<T>
  extends Omit<PopoverProps, 'children' | 'style'>,
  MenuPrimitiveProps<T> {
  className?: string
  popoverClassName?: string
  showArrow?: boolean
  respectScreen?: boolean
}

function Content<T extends object>({
  className,
  showArrow = false,
  popoverClassName,
  ...props
}: MenuContentProps<T>) {
  const { respectScreen } = React.useContext(MenuContext)
  return (
    <Popover.Content
      respectScreen={respectScreen}
      showArrow={showArrow}
      className={popover({
        className: cn([
          showArrow && 'placement-left:mt-[-0.38rem] placement-right:mt-[-0.38rem]',
          popoverClassName,
        ]),
      })}
      {...props}
    >
      <MenuPrimitive className={menu({ className })} {...props} />
    </Popover.Content>
  )
}

interface MenuItemProps
  extends Omit<MenuItemPrimitiveProps, 'isDanger'>,
  VariantProps<typeof dropdownItemStyles> {
  isDanger?: boolean
}

function Item({ className, isDanger = false, children, ...props }: MenuItemProps) {
  const textValue = props.textValue || (typeof children === 'string' ? children : undefined)
  return (
    <MenuItem
      className={cr(className, (className, renderProps) =>
        dropdownItemStyles({
          ...renderProps,
          className,
        }))}
      textValue={textValue}
      data-danger={isDanger ? 'true' : undefined}
      {...props}
    >
      {values => (
        <>
          {typeof children === 'function' ? children(values) : children}
          {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
          {values.hasSubmenu && <IconChevronLgRight className="gpfw ml-auto size-3.5" />}
        </>
      )}
    </MenuItem>
  )
}

export interface MenuHeaderProps extends React.ComponentProps<typeof Header> {
  separator?: boolean
}

function MenuHeader({ className, separator = false, ...props }: MenuHeaderProps) {
  return (
    <Header
      className={cn(
        'p-2 text-base font-semibold sm:text-sm',
        separator && '-mx-1 border-b px-3 pb-2.5',
        className,
      )}
      {...props}
    />
  )
}

function MenuSeparator({ className, ...props }: SeparatorProps) {
  return <Separator className={cn('-mx-1 my-1 h-px border-b', className)} {...props} />
}

function Checkbox({ className, children, ...props }: MenuItemProps) {
  return (
    <Item className={cn('relative pr-8', className)} {...props}>
      {values => (
        <>
          {typeof children === 'function' ? children(values) : children}
          {values.isSelected && (
            <span className="absolute right-2 flex size-4 shrink-0 items-center justify-center animate-in">
              <IconCheck />
            </span>
          )}
        </>
      )}
    </Item>
  )
}

function Radio({ className, children, ...props }: MenuItemProps) {
  return (
    <Item className={cn('relative', className)} {...props}>
      {values => (
        <>
          {typeof children === 'function' ? children(values) : children}

          {values.isSelected && (
            <span
              data-slot="menu-radio"
              className="absolute right-3 flex items-center justify-center animate-in"
            >
              <IconBulletFill />
            </span>
          )}
        </>
      )}
    </Item>
  )
}

const { section, header } = dropdownSectionStyles()

interface SectionProps<T> extends MenuSectionProps<T> {
  title?: string
}

function Section<T extends object>({ className, ...props }: SectionProps<T>) {
  return (
    <MenuSection className={section({ className })} {...props}>
      {'title' in props && <Header className={header()}>{props.title}</Header>}
      <Collection items={props.items}>{props.children}</Collection>
    </MenuSection>
  )
}

Menu.Primitive = MenuPrimitive
Menu.Content = Content
Menu.Header = MenuHeader
Menu.Item = Item
Menu.Content = Content
Menu.Keyboard = Keyboard
Menu.Checkbox = Checkbox
Menu.Radio = Radio
Menu.Section = Section
Menu.Separator = MenuSeparator
Menu.Trigger = Trigger
Menu.ItemDetails = DropdownItemDetails
Menu.Submenu = SubMenu

export { Menu, type MenuContentProps }
