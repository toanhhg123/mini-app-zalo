import React, { useMemo, useState } from 'react'
import { Header, Icon, Text, useNavigate } from 'zmp-ui'

import { MerchantNotFoundError } from '@/constants/errors'
import { Routes } from '@/constants/routes'
import { useCart, useTotalCartItems } from '@/modules/orders/use-cart'
import { useMenu } from '@/modules/products/use-menu'
import { formatMoney } from '@/utils/format'

import { useMerchant } from '../use-merchant'
import { MerchantMenuPageLoading } from './merchant-menu-page-loading'

function buildProductCode(id: number) {
  return `SP${String(id).padStart(6, '0')}`
}

export function MerchantMenuPage() {
  const navigate = useNavigate()
  const { data: merchant, isLoading: merchantLoading } = useMerchant()
  const { data: menu, isLoading: menuLoading } = useMenu()
  const cartItems = useCart((state) => state.items)
  const cartActions = useCart((state) => state.actions)
  const totalCartItems = useTotalCartItems()
  const [keyword, setKeyword] = useState('')

  const isLoading = merchantLoading || menuLoading

  const products = useMemo(
    () =>
      (menu || []).flatMap((group) =>
        group.products.map((product) => ({ ...product, categoryName: group.category.name })),
      ),
    [menu],
  )
  const quantityByProduct = useMemo(
    () =>
      Object.values(cartItems).reduce(
        (acc, item) => {
          acc[item.product.id] = (acc[item.product.id] || 0) + item.quantity
          return acc
        },
        {} as Record<number, number>,
      ),
    [cartItems],
  )
  const filteredProducts = useMemo(() => {
    const key = keyword.trim().toLocaleLowerCase()
    if (!key) return products
    return products.filter((product) => {
      const code = buildProductCode(product.id)
      return (
        product.name.toLocaleLowerCase().includes(key) ||
        product.categoryName.toLocaleLowerCase().includes(key) ||
        code.toLocaleLowerCase().includes(key)
      )
    })
  }, [keyword, products])

  if (isLoading) return <MerchantMenuPageLoading />
  if (!merchant || !menu) throw new MerchantNotFoundError()

  return (
    <div className="sales-home">
      <Header showBackIcon={false} className="no-divider opacity-0 pointer-events-none" title={merchant.name} />
      <div className="sales-home__header inset-top">
        <div className="sales-home__title-row">
          <Text className="sales-home__title">Bán hàng</Text>
          <button
            className="sales-home__history-btn"
            onClick={() => {
              navigate(Routes.merchant.cart(), { animate: false })
            }}
          >
            <Icon icon="zi-clock-1" size={24} />
            {totalCartItems > 0 && <span className="sales-home__notif-dot">{totalCartItems}</span>}
          </button>
        </div>
        <div className="sales-home__search-row">
          <label className="sales-home__search-box">
            <Icon icon="zi-search" size={18} />
            <input
              className="sales-home__search-input"
              placeholder="Tên, mã hàng, mã ..."
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
            />
          </label>
          <button className="sales-home__search-action">
            <Icon icon="zi-plus" size={20} />
          </button>
          <button className="sales-home__search-action">
            <Icon icon="zi-qrline" size={19} />
          </button>
        </div>
        <div className="sales-home__filter-row">
          <div className="sales-home__filter-label">
            <Icon icon="zi-user" size={18} />
            <span>Khách lẻ</span>
          </div>
          <div className="sales-home__filter-label">
            <Icon icon="zi-file" size={18} />
            <span>Bảng giá chung</span>
          </div>
          <button className="sales-home__filter-btn">
            <Icon icon="zi-filter" size={18} />
          </button>
        </div>
      </div>
      <div className="sales-home__list">
        {filteredProducts.map((product) => {
          const code = buildProductCode(product.id)
          const count = quantityByProduct[product.id] || 0
          const inventory = product.id % 4 === 0 ? -2 : 0
          return (
            <button
              key={product.id}
              className="sales-product-card"
              onClick={() => {
                cartActions.add({ product })
              }}
            >
              <img className="sales-product-card__image" src={product.imageUrl} alt={product.name} />
              <div className="sales-product-card__content">
                <Text className="sales-product-card__name">{product.name}</Text>
                <div className="sales-product-card__meta">
                  <span className="sales-product-card__code">{code}</span>
                  <span className="sales-product-card__inventory">{inventory}</span>
                  <span className="sales-product-card__customer">KH đặt: {count}</span>
                </div>
                <Text className="sales-product-card__price">{formatMoney(product.price)}</Text>
              </div>
            </button>
          )
        })}
        {filteredProducts.length === 0 && (
          <div className="sales-home__empty">
            <Text>Không tìm thấy sản phẩm phù hợp</Text>
          </div>
        )}
      </div>
      <div className="sales-home__switch">
        <button className="sales-home__switch-btn">Đặt hàng</button>
        <button
          className="sales-home__switch-btn sales-home__switch-btn-active"
          onClick={() => {
            navigate(Routes.merchant.cart(), { animate: false })
          }}
        >
          Bán
        </button>
        <button className="sales-home__switch-more">...</button>
      </div>
    </div>
  )
}
