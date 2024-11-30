'use client'

import {
  IconArrowUpRight,
  IconChartBarUp,
  IconChevronLgDown,
  IconCompass,
  IconDeviceDesktop,
  IconLayoutColumnLeftside,
  IconMoon,
  IconSettings,
  IconSun,
} from 'justd-icons'
import { useTheme } from 'next-themes'

import * as React from 'react'
import { Avatar, Button, Link, Menu, Sidebar } from '~/justd/ui'

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const { resolvedTheme, setTheme } = useTheme()
  const themes = ['light', 'dark', 'system'] as const

  return (
    <Sidebar {...props}>
      <Sidebar.Header className="pl-2.5">
        <div className="flex items-center gap-x-2 group-data-[collapsible=dock]:justify-center">
          <Sidebar.Trigger className="hidden md:block" />
          <Link href="/docs/components/layouts/sidebar" className="group-data-[collapsible=dock]:hidden">
            <strong className="whitespace-nowrap font-medium">Acme Corp.</strong>
          </Link>
        </div>
      </Sidebar.Header>
      <Sidebar.Content className="group-data-[collapsible=dock]:mt-6">
        <Sidebar.Section title="Platform">
          <Sidebar.Item icon={IconChartBarUp} href="/">
            Reports
          </Sidebar.Item>
          <Sidebar.Item icon={IconLayoutColumnLeftside} href="/transactions">
            Transactions
          </Sidebar.Item>
          <Sidebar.Item icon={IconSettings} href="/settings">
            Settings
          </Sidebar.Item>
        </Sidebar.Section>
        <Sidebar.Section title="Setup">
          <Sidebar.Item icon={IconCompass} href="/onboarding">
            Onboarding
          </Sidebar.Item>
        </Sidebar.Section>
      </Sidebar.Content>
      <Sidebar.Footer className="hidden items-center md:flex md:flex-row">
        <Menu>
          <Button appearance="plain" aria-label="Profile" data-slot="menu-trigger" className="group">
            <Avatar size="small" shape="circle" initials="ES" />
            <span className="flex items-center justify-center group-data-[collapsible=dock]:hidden">
              Emma Stone
              <IconChevronLgDown className="absolute right-3 size-4 transition-transform group-pressed:rotate-180" />
            </span>
          </Button>
          <Menu.Content className="min-w-[--trigger-width]">
            <Menu.Section>
              <Menu.Header>
                <span className="font-normal text-muted-fg">emma.stone@acme.com</span>
              </Menu.Header>
              <Menu.Submenu>
                <Menu.Item>Theme</Menu.Item>
                <Menu.Content
                  selectionMode="single"
                  items={themes.map(theme => ({ id: theme, name: theme }))}
                  selectedKeys={resolvedTheme}
                  onAction={value => setTheme(value as typeof themes[number])}
                >
                  {({ id, name }) => (
                    <Menu.Item key={id} value={{ id, name }}>
                      {id === 'light' ? <IconSun /> : null}
                      {id === 'dark' ? <IconMoon /> : null}
                      {id === 'system' ? <IconDeviceDesktop /> : null}
                      {name}
                    </Menu.Item>
                  )}
                </Menu.Content>
              </Menu.Submenu>
            </Menu.Section>
            <Menu.Separator />
            <Menu.Item href="#">
              Changelog
              <IconArrowUpRight />
            </Menu.Item>
            <Menu.Item href="#">
              Documentation
              <IconArrowUpRight />
            </Menu.Item>
            <Menu.Item href="#">
              Join Slack community
              <IconArrowUpRight />
            </Menu.Item>
            <Menu.Separator />
            <Menu.Item href="#">
              Log out
            </Menu.Item>
          </Menu.Content>
        </Menu>
      </Sidebar.Footer>
      <Sidebar.Rail />
    </Sidebar>
  )
}
