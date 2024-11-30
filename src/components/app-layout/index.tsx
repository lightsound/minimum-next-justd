'use client'

import {
  IconCirclePerson,
  IconLogout,
  IconSettings,
  IconShield,
} from 'justd-icons'
import * as React from 'react'
import { Avatar, Link, Menu, Sidebar } from '~/justd/ui'
import { AppSidebar } from './app-sidebar'

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Sidebar.Provider>
      <AppSidebar intent="inset" collapsible="dock" />
      <Sidebar.Inset>
        <Sidebar.Nav isSticky className="md:hidden">
          <Link href="/docs/components/layouts/sidebar">
            <strong className="font-medium group-data-[collapsible=dock]:hidden">Acme Corp.</strong>
          </Link>
          <div className="flex items-center gap-x-2 md:hidden">
            <Menu>
              <Menu.Trigger aria-label="Profile" className="group flex items-center gap-x-2">
                <Avatar size="small" shape="circle" src="/images/sidebar/profile-slash.jpg" />
              </Menu.Trigger>
              <Menu.Content className="min-w-[--trigger-width]">
                <Menu.Item href="#">
                  <IconCirclePerson />
                  Profile
                </Menu.Item>
                <Menu.Item href="#">
                  <IconSettings />
                  Settings
                </Menu.Item>
                <Menu.Item href="#">
                  <IconShield />
                  Security
                </Menu.Item>
                <Menu.Item href="#">
                  <IconLogout />
                  Log out
                </Menu.Item>
              </Menu.Content>
            </Menu>
            <Sidebar.Trigger className="inline md:hidden" />
          </div>
        </Sidebar.Nav>
        <div className="p-4 lg:p-6">{children}</div>
      </Sidebar.Inset>
    </Sidebar.Provider>
  )
}
