import React, { useState } from 'react'
import { Button, Icon, Modal, Page, Text } from 'zmp-ui'

import { PageContainer } from '@/components'
import { MerchantLayout, MerchantTabs } from '@/modules/merchants/components'

type Props = {
  activeTab: 'home' | 'staff'
}

export function StaffShiftPage({ activeTab }: Props) {
  const [checkedIn, setCheckedIn] = useState(false)
  const [openCheckinModal, setOpenCheckinModal] = useState(false)
  const [openCloseShiftPopup, setOpenCloseShiftPopup] = useState(false)
  const [closingTotal, setClosingTotal] = useState('')
  const [cashAmount, setCashAmount] = useState('')
  const [transferAmount, setTransferAmount] = useState('15000000')

  return (
    <MerchantLayout>
      <Page restoreScroll className="staff-page">
        <PageContainer withBottomNav noInsetTop>
          <div
            className={openCloseShiftPopup ? 'staff-page__content staff-page__content-dimmed' : 'staff-page__content'}
          >
            <header className="staff-page__header inset-top">
              <Text className="staff-page__app-title">KiotViet Nhân Viên</Text>
              <div className="staff-page__menu-box">
                <button className="staff-page__menu-btn">
                  <Icon icon="zi-more-grid" size={22} />
                </button>
                <div className="staff-page__menu-divider" />
                <button className="staff-page__menu-btn">
                  <Icon icon="zi-close" size={22} />
                </button>
              </div>
            </header>

            <section className="staff-page__profile">
              <div className="staff-page__avatar">
                <Icon icon="zi-user-circle" size={56} />
              </div>
              <div>
                <Text className="staff-page__name">Trường</Text>
                <Text className="staff-page__meta">NV000010 • Chi nhánh trung tâm</Text>
              </div>
            </section>

            <section className="staff-page__shift-card">
              <Text className="staff-page__label">CA HIỆN TẠI</Text>
              <Text className="staff-page__date">Thứ Ba, 24 tháng 2, 2026</Text>
              <div className="staff-page__time-row">
                <Text>Vào ca: 10:45</Text>
                <Text>Ra ca: 15:00</Text>
              </div>
              <div className="staff-page__actions">
                <button className="staff-page__btn staff-page__btn-primary" onClick={() => setOpenCheckinModal(true)}>
                  {checkedIn ? 'Đã vào ca 10:45' : 'Vào Ca 10:45'}
                </button>
                <button
                  className="staff-page__btn staff-page__btn-outline"
                  onClick={() => setOpenCloseShiftPopup(true)}
                >
                  Đóng Ca 15:00
                </button>
              </div>
            </section>
          </div>

          <Modal
            visible={openCheckinModal}
            title="Xác nhận vào ca"
            onClose={() => setOpenCheckinModal(false)}
            children={<Text>Bạn có chắc chắn muốn vào ca lúc 10:45?</Text>}
            actions={[
              {
                text: 'Hủy',
                close: true,
              },
              {
                text: 'Xác nhận',
                close: true,
                onClick: () => setCheckedIn(true),
              },
            ]}
          />

          {openCloseShiftPopup && (
            <div className="staff-close-popup__overlay">
              <div className="staff-close-popup">
                <div className="staff-close-popup__header">
                  <Text className="staff-close-popup__title">Hoàn thành ca làm việc</Text>
                  <button className="staff-close-popup__close" onClick={() => setOpenCloseShiftPopup(false)}>
                    <Icon icon="zi-close" size={20} />
                  </button>
                </div>

                <label className="staff-close-popup__field">
                  <span>Số tiền cuối ca:</span>
                  <div className="staff-close-popup__input-wrap">
                    <input
                      value={closingTotal}
                      onChange={(event) => setClosingTotal(event.target.value)}
                      className="staff-close-popup__input"
                    />
                    <span className="staff-close-popup__suffix">đ</span>
                  </div>
                </label>

                <label className="staff-close-popup__field">
                  <span>Số tiền mặt:</span>
                  <div className="staff-close-popup__input-wrap">
                    <input
                      value={cashAmount}
                      onChange={(event) => setCashAmount(event.target.value)}
                      className="staff-close-popup__input"
                    />
                    <span className="staff-close-popup__suffix">đ</span>
                  </div>
                </label>

                <label className="staff-close-popup__field">
                  <span>Số tiền chuyển khoản:</span>
                  <div className="staff-close-popup__input-wrap">
                    <input
                      value={transferAmount}
                      onChange={(event) => setTransferAmount(event.target.value)}
                      className="staff-close-popup__input"
                    />
                  </div>
                </label>

                <div className="staff-close-popup__actions">
                  <Button
                    className="staff-close-popup__btn"
                    variant="secondary"
                    type="neutral"
                    onClick={() => setOpenCloseShiftPopup(false)}
                    fullWidth
                  >
                    Hủy
                  </Button>
                  <Button
                    className="staff-close-popup__btn"
                    fullWidth
                    onClick={() => {
                      setCheckedIn(false)
                      setOpenCloseShiftPopup(false)
                    }}
                  >
                    Xác nhận
                  </Button>
                </div>
              </div>
            </div>
          )}
        </PageContainer>
      </Page>
      <MerchantTabs activeTab={activeTab} />
    </MerchantLayout>
  )
}
