import React, { useState } from 'react'
import { BottomNavigation, Icon, useNavigate } from 'zmp-ui'

import { Routes } from '@/constants/routes'

import { useMerchant } from '../use-merchant'

type MenuType = 'home' | 'inventory' | 'stock-check' | 'shipping' | 'sales' | 'staff'

export function MerchantTabs({ activeTab }: { activeTab: MenuType }) {
  const navigate = useNavigate()
  const { isLoading } = useMerchant()

  const [tab, setTab] = useState(activeTab)

  function handleTabChange(tab: string) {
    setTab(tab as MenuType)
    let url = Routes.merchant.info()
    switch (tab) {
      case 'home':
        url = Routes.merchant.info()
        break
      case 'inventory':
        url = `${Routes.merchant.management()}?section=inventory`
        break
      case 'shipping':
        url = `${Routes.merchant.management()}?section=shipping`
        break
      case 'stock-check':
        url = Routes.merchant.timesheet()
        break
      case 'sales':
        url = Routes.merchant.page()
        break
      case 'staff':
        url = Routes.merchant.staff()
        break
      default:
        url = Routes.merchant.info()
        break
    }
    navigate(url, { animate: false, replace: true })
  }

  if (isLoading) return null

  return (
    <BottomNavigation fixed activeKey={tab} onChange={handleTabChange}>
      <BottomNavigation.Item key="home" label="Trang chủ" icon={<Icon icon="zi-home" />} />
      <BottomNavigation.Item key="inventory" label="Hàng hoá" icon={<Icon icon="zi-inbox" />} />
      <BottomNavigation.Item key="stock-check" label="Kiểm kho" icon={<Icon icon="zi-calendar" />} />
      <BottomNavigation.Item key="shipping" label="Chuyển" icon={<Icon icon="zi-note" />} />
      <BottomNavigation.Item key="sales" label="Bán hàng" icon={<Icon icon="zi-gallery" />} />
      <BottomNavigation.Item key="staff" label="Nhân viên" icon={<Icon icon="zi-user-circle" />} />
    </BottomNavigation>
  )
}
