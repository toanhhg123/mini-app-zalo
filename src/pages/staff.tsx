import React from 'react'
import { Icon, Page, Text, useNavigate } from 'zmp-ui'

import { PageContainer } from '@/components'
import { Routes } from '@/constants/routes'
import { logout } from '@/modules/auth/auth'
import { MerchantLayout, MerchantTabs } from '@/modules/merchants/components'

export default function MerchantStaffPage() {
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate(Routes.auth.login(), { replace: true, animate: false })
  }

  return (
    <MerchantLayout>
      <Page restoreScroll className="staff-info-page">
        <PageContainer withBottomNav noInsetTop>
          <header className="staff-info-page__header inset-top">
            <div className="staff-info-page__title-wrap">
              <button
                className="staff-info-page__back-btn"
                onClick={() => navigate(Routes.merchant.info(), { replace: true, animate: false })}
              >
                <Icon icon="zi-arrow-left" size={24} />
              </button>
              <Text className="staff-info-page__title">Thông tin nhân viên</Text>
            </div>
            <div className="staff-info-page__menu-box">
              <button className="staff-info-page__menu-btn">
                <Icon icon="zi-more-grid" size={22} />
              </button>
              <div className="staff-info-page__menu-divider" />
              <button className="staff-info-page__menu-btn">
                <Icon icon="zi-close" size={22} />
              </button>
            </div>
          </header>

          <div className="staff-info-page__content">
            <section className="staff-info-card">
              <Text className="staff-info-card__section-title">THÔNG TIN KHỞI TẠO</Text>
              <div className="staff-info-card__user">
                <div className="staff-info-card__avatar">
                  <Icon icon="zi-user-circle" size={52} />
                </div>
                <div>
                  <Text className="staff-info-card__name">Trường</Text>
                  <Text className="staff-info-card__code">NV000010</Text>
                </div>
              </div>

              <div className="staff-info-card__field">
                <Text className="staff-info-card__label">Số điện thoại</Text>
                <Text className="staff-info-card__value">0866116717</Text>
              </div>
              <div className="staff-info-card__divider" />
              <div className="staff-info-card__field">
                <Text className="staff-info-card__label">Chi nhánh trả lương</Text>
                <Text className="staff-info-card__value">Chi nhánh trung tâm</Text>
              </div>
              <div className="staff-info-card__divider" />
              <div className="staff-info-card__field">
                <Text className="staff-info-card__label">Chi nhánh làm việc</Text>
                <Text className="staff-info-card__value">Chi nhánh trung tâm</Text>
              </div>
            </section>

            <button className="staff-info-page__logout" onClick={handleLogout}>
              <Icon icon="zi-switch-users" size={22} />
              <span>Đăng xuất</span>
            </button>
          </div>
        </PageContainer>
      </Page>
      <MerchantTabs activeTab="staff" />
    </MerchantLayout>
  )
}
