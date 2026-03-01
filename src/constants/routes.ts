export const Routes = {
  auth: {
    login: () => `/login`,
  },
  merchant: {
    page: () => `/`,
    cart: () => `/orders?tab=cart`,
    orders: () => `/orders?tab=orders`,
    info: () => `/info`,
    staff: () => `/staff`,
  },
}
