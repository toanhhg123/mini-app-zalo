export const Routes = {
  auth: {
    login: () => `/login`,
  },
  merchant: {
    page: () => `/`,
    cart: () => `/orders?tab=cart`,
    orders: () => `/orders?tab=orders`,
    timesheet: () => `/timesheet`,
    info: () => `/info`,
    staff: () => `/staff`,
  },
}
