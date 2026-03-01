import React, { useMemo, useState } from 'react'
import { Icon, Modal, Text, useNavigate } from 'zmp-ui'

import QRCode from '@/components/qr-code'
import { Routes } from '@/constants/routes'
import { formatMoney } from '@/utils/format'

import { useCart } from '../use-cart'
import { useOrdersTab } from '../use-orders-tab'

type PaymentMethod = 'cash' | 'bank' | 'card' | 'wallet'

const PAYMENT_METHODS: { key: PaymentMethod; label: string }[] = [
  { key: 'cash', label: 'Tiền mặt' },
  { key: 'bank', label: 'Chuyển khoản' },
  { key: 'card', label: 'Thẻ' },
  { key: 'wallet', label: 'Ví' },
]

function toNumeric(value: string) {
  const number = Number(value.replace(/[^\d]/g, ''))
  if (!Number.isFinite(number)) return 0
  return number
}

export function OrdersPage() {
  const navigate = useNavigate()
  const [tab, setTab] = useOrdersTab()
  const cartItems = useCart((state) => state.items)
  const cartTotal = useCart((state) => state.total)
  const cartActions = useCart((state) => state.actions)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash')
  const [discountPercent, setDiscountPercent] = useState('0')
  const [otherIncome, setOtherIncome] = useState('0')
  const [paidAmount, setPaidAmount] = useState('')
  const [openPrinterModal, setOpenPrinterModal] = useState(false)

  const items = useMemo(() => Object.values(cartItems).sort((a, b) => b.createdAt - a.createdAt), [cartItems])
  const totalItems = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items])

  const discountValue = Math.min(toNumeric(discountPercent), 100)
  const extraValue = toNumeric(otherIncome)
  const totalAfterDiscount = Math.round(Math.max(cartTotal - (cartTotal * discountValue) / 100 + extraValue, 0))

  if (tab === 'orders') {
    return (
      <div className="pos-checkout-page">
        <header className="pos-page-header inset-top">
          <button className="pos-icon-btn" onClick={() => setTab('cart')}>
            <Icon icon="zi-arrow-left" size={26} />
          </button>
          <Text className="pos-page-header__title">Thanh toán</Text>
          <div className="pos-page-header__actions">
            <button className="pos-icon-btn">
              <Icon icon="zi-share" size={24} />
            </button>
            <button
              className="pos-icon-btn"
              onClick={() => {
                if (paymentMethod === 'wallet') {
                  setOpenPrinterModal(true)
                }
              }}
            >
              <Icon icon="zi-print" size={24} />
            </button>
          </div>
        </header>

        {paymentMethod !== 'bank' && (
          <button className="pos-order-review">
            <span>Xem hàng trong đơn</span>
            <Icon icon="zi-chevron-right" size={22} />
          </button>
        )}

        <section className="pos-payment-card">
          <div className="pos-payment-row">
            <Text className="pos-payment-row__label">
              Tổng tiền hàng <span className="pos-payment-badge">{totalItems}</span>
            </Text>
            <Text className="pos-payment-row__value">{formatMoney(cartTotal)}</Text>
          </div>
          <div className="pos-payment-row">
            <Text className="pos-payment-row__label">Giảm giá (%)</Text>
            <input
              className="pos-payment-input"
              value={discountPercent}
              onChange={(event) => setDiscountPercent(event.target.value.replace(/[^\d]/g, ''))}
            />
          </div>
          <div className="pos-payment-row">
            <Text className="pos-payment-row__label">Thu khác</Text>
            <input
              className="pos-payment-input"
              value={otherIncome}
              onChange={(event) => setOtherIncome(event.target.value.replace(/[^\d]/g, ''))}
            />
          </div>
          <div className="pos-payment-row">
            <Text className="pos-payment-row__label">Khách cần trả</Text>
            <Text className="pos-payment-row__value pos-payment-row__value-primary">
              {formatMoney(totalAfterDiscount)}
            </Text>
          </div>
          <div className="pos-payment-row">
            <Text className="pos-payment-row__label">Khách thanh toán</Text>
            <input
              className="pos-payment-input"
              value={paidAmount}
              placeholder={String(totalAfterDiscount)}
              onChange={(event) => setPaidAmount(event.target.value.replace(/[^\d]/g, ''))}
            />
          </div>

          <div className="pos-methods">
            <div className="pos-method-tabs">
              {PAYMENT_METHODS.map((method) => (
                <button
                  key={method.key}
                  className={method.key === paymentMethod ? 'pos-method-tab pos-method-tab-active' : 'pos-method-tab'}
                  onClick={() => setPaymentMethod(method.key)}
                >
                  {method.label}
                </button>
              ))}
              <button className="pos-method-tab pos-method-tab-more">...</button>
            </div>
            <div className="pos-method-indicator" />
          </div>

          {paymentMethod === 'bank' && (
            <div className="pos-bank-block">
              <Text className="pos-bank-title">Vietcombank - 9345999521</Text>
              <Text className="pos-bank-owner">DANG THI KIM NGA</Text>
              <div className="pos-bank-qr">
                <Text className="pos-bank-logo">
                  <span className="pos-bank-logo-red">VIET</span>
                  <span className="pos-bank-logo-blue">QR</span>
                </Text>
                <QRCode size={190} value={`VCB-9345999521-${totalAfterDiscount}`} />
              </div>
            </div>
          )}
          {paymentMethod === 'wallet' && (
            <div className="pos-wallet-block">
              <Icon icon="zi-wallet" size={42} />
              <Text>Chưa kết nối ví thanh toán</Text>
            </div>
          )}
          {paymentMethod !== 'bank' && paymentMethod !== 'wallet' && <div className="pos-payment-spacer" />}
        </section>

        <footer className="pos-bottom-action">
          <button className="pos-primary-btn">Hoàn thành</button>
        </footer>
        <Modal
          visible={openPrinterModal}
          title="Chưa kết nối máy in"
          onClose={() => setOpenPrinterModal(false)}
          children={<Text>Đi đến Cài đặt để kết nối máy in, sau đó hãy thử in lại.</Text>}
          actions={[
            {
              text: 'Hủy',
              close: true,
            },
            {
              text: 'Cài đặt',
              close: true,
            },
          ]}
        />
      </div>
    )
  }

  return (
    <div className="pos-cart-page">
      <header className="pos-page-header inset-top">
        <button
          className="pos-icon-btn"
          onClick={() => {
            navigate(Routes.merchant.page(), { animate: false, replace: true })
          }}
        >
          <Icon icon="zi-close" size={28} />
        </button>
        <Text className="pos-page-header__title">Bán hàng</Text>
        <button className="pos-icon-btn">
          <Icon icon="zi-info-circle" size={24} />
        </button>
      </header>

      <div className="pos-cart-search">
        <label className="sales-home__search-box">
          <Icon icon="zi-search" size={20} />
          <input className="sales-home__search-input" placeholder="Tên, mã hàng, mã ..." />
        </label>
        <button className="sales-home__search-action">
          <Icon icon="zi-plus" size={24} />
        </button>
        <button className="sales-home__search-action">
          <Icon icon="zi-qrscanner" size={22} />
        </button>
      </div>

      <div className="pos-cart-selector">
        <button className="pos-cart-selector__item">
          <span>Khách lẻ</span>
          <Icon icon="zi-chevron-right" size={20} />
        </button>
        <button className="pos-cart-selector__item">
          <span>Bảng giá chung</span>
          <Icon icon="zi-chevron-right" size={20} />
        </button>
      </div>

      <div className="pos-cart-items">
        {items.map((item) => (
          <div key={item.id} className="pos-cart-item">
            <img src={item.product.imageUrl} alt={item.product.name} className="pos-cart-item__image" />
            <div className="pos-cart-item__main">
              <Text className="pos-cart-item__name">{item.product.name}</Text>
              <div className="pos-cart-item__row">
                <Text className="pos-cart-item__price">{formatMoney(item.price)}</Text>
                <div className="pos-stepper">
                  <button
                    className="pos-stepper__btn"
                    onClick={() => {
                      cartActions.decrease(item.id)
                    }}
                  >
                    -
                  </button>
                  <span className="pos-stepper__value">{item.quantity}</span>
                  <button
                    className="pos-stepper__btn"
                    onClick={() => {
                      cartActions.increase(item.id)
                    }}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="pos-cart-empty">
            <Text>Chưa có sản phẩm trong đơn</Text>
          </div>
        )}
      </div>

      <footer className="pos-cart-footer">
        <div className="pos-cart-footer__summary">
          <div className="pos-cart-footer__label">
            <span>Tổng tiền hàng</span>
            <span className="pos-payment-badge">{totalItems}</span>
          </div>
          <Text className="pos-cart-footer__value">{formatMoney(cartTotal)}</Text>
        </div>
        <div className="pos-cart-footer__actions">
          <button className="pos-outline-btn">Lưu tạm</button>
          <button className="pos-primary-btn" onClick={() => setTab('orders')}>
            Thanh toán
          </button>
        </div>
      </footer>
    </div>
  )
}
