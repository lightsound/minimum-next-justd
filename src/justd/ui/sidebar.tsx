/* eslint-disable tailwindcss/no-custom-classname */
'use client'

import type { DisclosureProps, LinkProps } from 'react-aria-components'

import { IconChevronDown, IconChevronRight, IconHamburger, IconSidebarFill } from 'justd-icons'
import * as React from 'react'
import { Disclosure, DisclosurePanel, Link } from 'react-aria-components'
import { tv } from 'tailwind-variants'

import { Button, ButtonPrimitive } from './button'
import { cn, cr, useMediaQuery } from './primitive'
import { Sheet } from './sheet'
import { Tooltip } from './tooltip'

interface SidebarContextProps {
  state: 'expanded' | 'collapsed'
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}

const SidebarContext = React.createContext<SidebarContextProps | null>(null)

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error('useSidebar must be used within a Sidebar.')
  }

  return context
}

const Provider = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & {
    defaultOpen?: boolean
    isOpen?: boolean
    onOpenChange?: (open: boolean) => void
  }
>(
      (
        {
          defaultOpen = true,
          isOpen: openProp,
          onOpenChange: setOpenProp,
          className,
          children,
          ...props
        },
        ref,
      ) => {
        const isMobile = useMediaQuery('(max-width: 768px)')
        const [openMobile, setOpenMobile] = React.useState(false)

        const [_open, _setOpen] = React.useState(defaultOpen)
        const open = openProp ?? _open
        const setOpen = React.useCallback(
          (value: boolean | ((value: boolean) => boolean)) => {
            if (setOpenProp) {
              return setOpenProp?.(typeof value === 'function' ? value(open) : value)
            }

            _setOpen(value)

            // eslint-disable-next-line react-compiler/react-compiler
            document.cookie = `sidebar:state=${open}; path=/; max-age=${60 * 60 * 24 * 7}`
          },
          [setOpenProp, open],
        )

        const toggleSidebar = React.useCallback(() => {
          return isMobile ? setOpenMobile(open => !open) : setOpen(open => !open)
        }, [isMobile, setOpen, setOpenMobile])

        React.useEffect(() => {
          const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'b' && (event.metaKey || event.ctrlKey)) {
              event.preventDefault()
              toggleSidebar()
            }
          }

          window.addEventListener('keydown', handleKeyDown)
          return () => window.removeEventListener('keydown', handleKeyDown)
        }, [toggleSidebar])

        const state = open ? 'expanded' : 'collapsed'

        const contextValue = React.useMemo<SidebarContextProps>(
          () => ({
            state,
            open,
            setOpen,
            isMobile,
            openMobile,
            setOpenMobile,
            toggleSidebar,
          }),
          [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar],
        )

        return (
          <SidebarContext.Provider value={contextValue}>
            <div
              className={cn(
                'group/sidebar-wrapper flex min-h-svh w-full text-fg [--sidebar-width-icon:3rem] [--sidebar-width:16.5rem] has-[[data-intent=inset]]:bg-secondary/50 dark:has-[[data-intent=inset]]:bg-bg',
                className,
              )}
              ref={ref}
              {...props}
            >
              {children}
            </div>
          </SidebarContext.Provider>
        )
      },
      )
Provider.displayName = 'Provider'

function Inset({ className, ...props }: React.ComponentProps<'main'>) {
  return (
    <main
      data-slot="sidebar-inset"
      className={cn([
        [
          'relative flex min-h-svh max-w-full flex-1 flex-col bg-bg',
          'md:peer-data-[intent=inset]:ml-0 md:peer-data-[intent=inset]:rounded-xl md:peer-data-[intent=inset]:bg-tertiary',
          'peer-data-[intent=inset]:min-h-[calc(100svh-theme(spacing.4))] peer-data-[intent=inset]:overflow-hidden peer-data-[intent=inset]:border md:peer-data-[intent=inset]:my-2 md:peer-data-[intent=inset]:mr-2',
        ],
        className,
      ])}
      {...props}
    />
  )
}

function Sidebar({
  side = 'left',
  intent = 'sidebar',
  collapsible = 'offcanvas',
  className,
  children,
  ...props
}: React.ComponentProps<'div'> & {
  side?: 'left' | 'right'
  intent?: 'sidebar' | 'floating' | 'inset'
  collapsible?: 'offcanvas' | 'dock' | 'none'
}) {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar()

  if (collapsible === 'none') {
    return (
      <div
        className={cn('flex h-full w-[--sidebar-width] flex-col bg-tertiary text-fg ', className)}
        {...props}
      >
        {children}
      </div>
    )
  }

  if (isMobile) {
    return (
      <Sheet isOpen={openMobile} onOpenChange={setOpenMobile} {...props}>
        <Sheet.Content
          aria-label="Sidebar"
          data-slot="sidebar"
          data-mobile="true"
          classNames={{
            content: 'bg-tertiary text-fg [&>button]:hidden',
          }}
          isStack={intent === 'floating'}
          side={side}
        >
          <Sheet.Body className="p-0 sm:p-0">{children}</Sheet.Body>
        </Sheet.Content>
      </Sheet>
    )
  }
  return (
    <div
      className="group peer hidden md:block"
      data-state={state}
      data-collapsible={state === 'collapsed' ? collapsible : ''}
      data-intent={intent}
      data-side={side}
    >
      <div
        className={cn(
          'relative h-svh w-[--sidebar-width] bg-transparent transition-[width] duration-200 ease-linear',
          'group-data-[collapsible=offcanvas]:w-0',
          'group-data-[side=right]:rotate-180',
          intent === 'floating' || intent === 'inset'
            ? 'group-data-[collapsible=dock]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4))]'
            : 'group-data-[collapsible=dock]:w-[--sidebar-width-icon]',
        )}
      />
      <div
        className={cn(
          'fixed inset-y-0 z-10 hidden h-svh w-[--sidebar-width] transition-[left,right,width] duration-200 ease-linear md:flex',
          side === 'left'
            ? 'left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]'
            : 'right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]',
          intent === 'floating' || intent === 'inset'
            ? 'p-2 group-data-[collapsible=dock]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]'
            : 'group-data-[collapsible=dock]:w-[--sidebar-width-icon] group-data-[side=left]:border-r group-data-[side=right]:border-l',
          className,
        )}
        {...props}
      >
        <div
          data-slot="sidebar"
          className={cn(
            'flex size-full flex-col bg-tertiary group-data-[intent=floating]:rounded-lg group-data-[intent=floating]:border group-data-[intent=floating]:border-border group-data-[intent=floating]:bg-secondary/50 group-data-[intent=inset]:bg-transparent',
            intent === 'inset' || state === 'collapsed'
              ? '[&_[data-slot=sidebar-footer]]:border-transparent [&_[data-slot=sidebar-header]]:border-transparent'
              : '[&_[data-slot=sidebar-footer]]:border-t [&_[data-slot=sidebar-header]]:border-b',
          )}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

const itemStyles = tv({
  base: [
    'group/sidebar-item grid cursor-pointer [&>[data-slot=icon]]:size-4 col-span-full [&>[data-slot=icon]]:shrink-0 items-center [&>[data-slot=icon]]:text-muted-fg relative rounded-lg lg:text-sm leading-6',
    'forced-colors:text-[MenuLink] text-fg',
  ],
  variants: {
    collapsed: {
      false: 'grid-cols-subgrid [&>[data-slot=icon]]:mr-2 px-3 py-2',
    },
    isFocused: {
      true: 'outline-none',
    },
    isFocusVisible: {
      true: 'bg-muted [&:focus-visible_[slot=description]]:text-accent-fg/70 text-secondary-fg',
    },
    isHovered: {
      true: [
        'bg-muted [&:focus-visible_[slot=description]]:text-accent-fg/70 text-secondary-fg [&_.text-muted-fg]:text-secondary-fg/80',
      ],
    },
    isCurrent: {
      true: [
        '[&_[data-slot=icon]]:text-primary-fg [&_.text-muted-fg]:text-primary-fg/80 bg-primary text-primary-fg',
        '[&_.bdx]:bg-primary-fg/20 [&_.bdx]:ring-primary-fg/30',
      ],
    },
    isDisabled: {
      true: 'opacity-70 cursor-default text-muted-fg',
    },
  },
})

interface ItemProps extends LinkProps {
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>
  badge?: string | number | undefined
  isCurrent?: boolean
}

function Item({ isCurrent, children, className, icon: Icon, ...props }: ItemProps) {
  const { state, isMobile } = React.useContext(SidebarContext)!
  return state === 'collapsed' && !isMobile
    ? (
        <Tooltip closeDelay={0} delay={0}>
          <Link
            {...props}
            className="col-span-full grid size-9 place-content-center rounded-lg text-muted-fg hover:bg-muted hover:text-secondary-fg focus:outline-none"
          >
            {Icon && <Icon data-slot="icon" />}
            <span className="sr-only">{children as string}</span>
          </Link>
          <Tooltip.Content intent="inverse" showArrow={false} placement="right">
            {children as string}
          </Tooltip.Content>
        </Tooltip>
      )
    : (
        <Link
          data-slot="sidebar-item"
          aria-current={isCurrent ? 'page' : undefined}
          className={cr(className, (className, renderProps) =>
            itemStyles({
              ...renderProps,
              collapsed: state === 'collapsed',
              isCurrent,
              className,
            }))}
          {...props}
        >
          {values => (
            <>
              {Icon && <Icon data-slot="icon" />}
              <span className="col-start-2 group-data-[collapsible=dock]:hidden">
                {typeof children === 'function' ? children(values) : children}
                {props.badge && (
                  <div className="bdx absolute inset-y-1/2 right-1.5 grid h-[1.30rem] w-auto -translate-y-1/2 place-content-center rounded-md bg-fg/[0.02] px-1 text-xs font-medium text-muted-fg ring-1 ring-fg/20 dark:bg-fg/10">
                    {props.badge}
                  </div>
                )}
              </span>
            </>
          )}
        </Link>
      )
}

function Content({ className, ...props }: React.ComponentProps<'div'>) {
  const { state } = useSidebar()
  return (
    <div
      data-slot="sidebar-content"
      className={cn([
        'flex min-h-0 flex-1 flex-col overflow-auto group-data-[collapsible=dock]:items-center group-data-[collapsible=dock]:overflow-hidden',
        state === 'collapsed' ? 'gap-y-6' : 'gap-y-2',
        className,
      ])}
      {...props}
    />
  )
}

const navStyles = tv({
  base: 'bg-tertiary md:bg-bg w-full justify-between md:justify-start h-[3.57rem] px-4 border-b flex items-center gap-x-2',
  variants: {
    isSticky: {
      true: 'sticky top-0 z-40',
    },
  },
})

interface NavProps extends React.ComponentProps<'nav'> {
  isSticky?: boolean
}

function Nav({ isSticky = false, className, ...props }: NavProps) {
  return <nav data-slot="sidebar-nav" {...props} className={navStyles({ isSticky, className })} />
}

function Trigger({ className, onPress, ...props }: React.ComponentProps<typeof Button>) {
  const { toggleSidebar } = useSidebar()
  return (
    <Button
      aria-label={props['aria-label'] || 'Toggle Sidebar'}
      data-slot="sidebar-trigger"
      appearance="plain"
      size="square-petite"
      className={className}
      onPress={(event) => {
        onPress?.(event)
        toggleSidebar()
      }}
      {...props}
    >
      <IconSidebarFill className="hidden md:inline" />
      <IconHamburger className="inline md:hidden" />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )
}

const header = tv({
  base: 'flex flex-col mb-2',
  variants: {
    collapsed: {
      false: 'px-5 py-4',
      true: 'px-5 py-4 md:p-0 md:size-9 mt-1 group-data-[intent=floating]:mt-2 md:rounded-lg md:hover:bg-muted md:mx-auto md:justify-center md:items-center',
    },
  },
})

function Header({ className, ...props }: React.HtmlHTMLAttributes<HTMLDivElement>) {
  const { state } = React.useContext(SidebarContext)!
  return (
    <div
      data-slot="sidebar-header"
      {...props}
      className={header({ collapsed: state === 'collapsed', className })}
      {...props}
    />
  )
}

const footer = tv({
  base: 'flex flex-col mt-auto',
  variants: {
    collapsed: {
      false: [
        'p-2 [&_[data-slot=menu-trigger]>[data-slot=avatar]]:-ml-1.5 [&_[data-slot=menu-trigger]]:w-full [&_[data-slot=menu-trigger]]:hover:bg-muted [&_[data-slot=menu-trigger]]:justify-start [&_[data-slot=menu-trigger]]:flex [&_[data-slot=menu-trigger]]:items-center',
      ],
      true: 'size-12 p-1 [&_[data-slot=menu-trigger]]:size-9 justify-center items-center',
    },
  },
})

function Footer({ className, ...props }: React.HtmlHTMLAttributes<HTMLDivElement>) {
  const { state } = React.useContext(SidebarContext)!
  return (
    <div
      {...props}
      data-slot="sidebar-footer"
      className={footer({ collapsed: state === 'collapsed', className })}
      {...props}
    />
  )
}

interface CollapsibleProps extends DisclosureProps {
  children: React.ReactNode
  title?: string
  collapsible?: boolean
  defaultExpanded?: boolean
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>
}

function Section({
  title,
  className,
  collapsible,
  icon: Icon,
  defaultExpanded,
  ...props
}: CollapsibleProps) {
  const { state, isMobile } = useSidebar()

  const isExpanded = state === 'collapsed' || (title ? (collapsible ? (defaultExpanded ?? true) : true) : true)
  return (
    <Disclosure
      data-slot="sidebar-section"
      className={cn(
        'col-span-full px-2',
        state === 'collapsed' && [title && 'px-0', !isMobile && 'px-0'],
        state === 'expanded' && [
          '[&_[data-slot=sidebar-section]]:px-0',
          title && [
            Icon
              ? 'mt-0.5 [&_[data-slot=sidebar-section-panel]]:px-6 [&_[data-slot=sidebar-section-panel]_[data-slot=icon]]:-ml-0.5'
              : 'my-2.5',
          ],
        ],
        className,
      )}
      defaultExpanded={isExpanded}
      {...props}
    >
      {({ isExpanded }) => (
        <>
          {typeof title === 'string' && (
            <span className="group-data-[collapsible=dock]:hidden group-data-[collapsible=dock]:opacity-0">
              {collapsible
                ? (
                    <ButtonPrimitive
                      slot="trigger"
                      className={({ isHovered }) =>
                        cn(
                          'flex w-full items-center justify-between leading-6 focus:outline-none [&>.idctr]:size-6 [&>.idctr]:duration-200',
                          Icon
                            ? 'px-3 py-2 text-fg has-[.idctr]:pr-0.5 lg:py-1.5 lg:text-sm [&_.idctr]:text-muted-fg'
                            : 'px-3 py-2 text-sm text-muted-fg has-[.idctr]:pr-0',
                          isHovered
                          && Icon
                          && 'relative items-center rounded-lg bg-muted leading-6 text-secondary-fg lg:text-sm [&>[data-slot=icon]]:shrink-0 [&>[data-slot=icon]]:text-muted-fg [&_.text-muted-fg]:text-secondary-fg/80',
                          isExpanded && !Icon && '[&>.idctr]:rotate-180',
                          isExpanded && Icon && '[&>.idctr]:rotate-90',
                        )}
                    >
                      <span className="flex items-center [&>[data-slot=icon]]:mr-2 [&>[data-slot=icon]]:text-muted-fg">
                        {Icon && <Icon data-slot="icon" />}
                        {title}
                      </span>
                      {Icon && <IconChevronRight className="idctr" />}
                      {!Icon && <IconChevronDown className="idctr" />}
                    </ButtonPrimitive>
                  )
                : (
                    <h4 className="px-3 py-2 text-sm text-muted-fg">{title}</h4>
                  )}
            </span>
          )}
          <DisclosurePanel>
            <div
              data-slot="sidebar-section-panel"
              className={cn(
                'grid gap-y-0.5 group-data-[collapsible=dock]:place-content-center',
                state === 'collapsed'
                  ? 'group-data-[collapsible=dock]:place-content-center'
                  : 'grid-cols-[auto_1fr] [&_[data-slot=sidebar-item]:first-child]:mt-0.5',
              )}
            >
              {props.children}
            </div>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  )
}

function Rail({ className, ...props }: React.ComponentProps<'button'>) {
  const { toggleSidebar } = useSidebar()

  return (
    <button
      type="button"
      data-slot="sidebar-rail"
      aria-label="Toggle Sidebar"
      tabIndex={-1}
      onClick={toggleSidebar}
      title="Toggle Sidebar"
      className={cn(
        'absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] group-data-[side=left]:-right-4 group-data-[side=right]:left-0 hover:after:bg-transparent sm:flex',
        '[[data-side=left]_&]:cursor-w-resize [[data-side=right]_&]:cursor-e-resize',
        '[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize',
        'group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full group-data-[collapsible=offcanvas]:hover:bg-tertiary',
        '[[data-side=left][data-collapsible=offcanvas]_&]:-right-2',
        '[[data-side=right][data-collapsible=offcanvas]_&]:-left-2',
        className,
      )}
      {...props}
    />
  )
}

Sidebar.Provider = Provider
Sidebar.Inset = Inset
Sidebar.Header = Header
Sidebar.Nav = Nav
Sidebar.Content = Content
Sidebar.Footer = Footer
Sidebar.Item = Item
Sidebar.Section = Section
Sidebar.Rail = Rail
Sidebar.Trigger = Trigger

// eslint-disable-next-line react-refresh/only-export-components
export { Sidebar, useSidebar }
