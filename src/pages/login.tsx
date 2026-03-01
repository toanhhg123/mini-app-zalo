import React, { FormEvent, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Button, Icon, Page, Text } from 'zmp-ui'

import { Routes } from '@/constants/routes'
import { isAuthenticated, loginWithCredential } from '@/modules/auth/auth'

export default function LoginPage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  if (isAuthenticated()) {
    return <Navigate to={Routes.merchant.page()} replace />
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const isValid = loginWithCredential(username.trim(), password)
    if (!isValid) {
      setError('Sai tài khoản hoặc mật khẩu. Dùng admin/admin để đăng nhập.')
      return
    }
    setError('')
    navigate(Routes.merchant.page(), { replace: true })
  }

  return (
    <Page className="login-page">
      <div className="login-page__header inset-top">
        <Text className="login-page__app-title">KiotViet Nhân Viên</Text>
        <div className="login-page__menu-box">
          <button className="login-page__menu-btn">
            <Icon icon="zi-more-grid" size={22} />
          </button>
          <div className="login-page__menu-divider" />
          <button className="login-page__menu-btn">
            <Icon icon="zi-close" size={22} />
          </button>
        </div>
      </div>

      <div className="login-page__body">
        <div className="login-page__hero">
          <div className="login-page__hero-inner">
            <Icon icon="zi-qrline" size={72} />
          </div>
        </div>
        <Text className="login-page__title">Đăng nhập</Text>

        <form className="login-page__form" onSubmit={handleSubmit}>
          <label className="login-page__field">
            <span className="login-page__label">Tên đăng nhập</span>
            <input
              className="login-page__input"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="admin"
            />
          </label>

          <label className="login-page__field">
            <span className="login-page__label">Mật khẩu</span>
            <input
              className="login-page__input"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="admin"
            />
          </label>

          {error && <Text className="login-page__error">{error}</Text>}

          <Button
            className="login-page__submit"
            type="highlight"
            disabled={!username.trim() || !password}
            fullWidth
            htmlType="submit"
            size="large"
          >
            Tiếp tục
          </Button>
        </form>
      </div>

      <div className="login-page__powered">
        <Text className="login-page__powered-text">Powered by</Text>
        <Text className="login-page__powered-brand">KiotViet</Text>
      </div>
    </Page>
  )
}
