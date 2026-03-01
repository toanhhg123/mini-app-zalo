import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React, { Suspense } from 'react'
import { Navigate, Route } from 'react-router-dom'
import { AnimationRoutes, App, SnackbarProvider, ZMPRouter } from 'zmp-ui'

import { RootProvider } from './components'
import { Routes } from './constants/routes'
import { isAuthenticated } from './modules/auth/auth'
import MerchantInfoPage from './pages/info'
import LoginPage from './pages/login'
import MerchantRootPage from './pages/menu'
import MerchantOrdersPage from './pages/orders'
import MerchantOrdersViewPage from './pages/orders.view'
import MerchantStaffPage from './pages/staff'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
    },
  },
})

function RequireAuth({ children }: { children: React.ReactElement }) {
  if (!isAuthenticated()) {
    return <Navigate to={Routes.auth.login()} replace />
  }
  return children
}

function PublicOnly({ children }: { children: React.ReactElement }) {
  if (isAuthenticated()) {
    return <Navigate to={Routes.merchant.page()} replace />
  }
  return children
}

const MyApp = () => {
  return (
    <App>
      <Suspense>
        <QueryClientProvider client={queryClient}>
          <SnackbarProvider>
            <RootProvider>
              <ZMPRouter>
                <AnimationRoutes>
                  <Route
                    path={Routes.auth.login()}
                    element={
                      <PublicOnly>
                        <LoginPage />
                      </PublicOnly>
                    }
                  />
                  <Route
                    path="/"
                    element={
                      <RequireAuth>
                        <MerchantRootPage />
                      </RequireAuth>
                    }
                  />
                  <Route
                    path="/orders"
                    element={
                      <RequireAuth>
                        <MerchantOrdersPage />
                      </RequireAuth>
                    }
                  />
                  <Route
                    path="/orders/view"
                    element={
                      <RequireAuth>
                        <MerchantOrdersViewPage />
                      </RequireAuth>
                    }
                  />
                  <Route
                    path="/info"
                    element={
                      <RequireAuth>
                        <MerchantInfoPage />
                      </RequireAuth>
                    }
                  />
                  <Route
                    path="/staff"
                    element={
                      <RequireAuth>
                        <MerchantStaffPage />
                      </RequireAuth>
                    }
                  />
                  <Route path="*" element={<Navigate to={Routes.auth.login()} replace />} />
                </AnimationRoutes>
              </ZMPRouter>
            </RootProvider>
          </SnackbarProvider>
        </QueryClientProvider>
      </Suspense>
    </App>
  )
}
export default MyApp
