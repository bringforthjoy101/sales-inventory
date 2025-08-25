import { lazy } from 'react'
import { Redirect } from 'react-router-dom'

const userData = JSON.parse(localStorage.getItem('userData'))


const ManagerRoutes = [
    {
        path: '/apps/ecommerce/shop',
        className: 'ecommerce-application',
        component: lazy(() => import('../../views/sales-inventory/ecommerce/shop'))
    },
    {
        path: '/apps/ecommerce/wishlist',
        className: 'ecommerce-application',
        component: lazy(() => import('../../views/sales-inventory/ecommerce/wishlist'))
    },
    {
        path: '/apps/ecommerce/product-detail',
        exact: true,
        className: 'ecommerce-application',
        component: () => <Redirect to='/apps/sales-inventory/product-detail/apple-i-phone-11-64-gb-black-26' />
    },
    {
        path: '/apps/ecommerce/product-detail/:product',
        exact: true,
        className: 'ecommerce-application',
        component: lazy(() => import('../../views/sales-inventory/ecommerce/detail')),
        meta: {
          navLink: '/apps/ecommerce/product-detail'
        }
    },
    {
        path: '/apps/ecommerce/checkout',
        className: 'ecommerce-application',
        component: lazy(() => import('../../views/sales-inventory/ecommerce/checkout'))
    },
    {
        path: '/admins/list',
        component: lazy(() => import('../../views/sales-inventory/admin/list'))
      },
      {
        path: '/admin/view',
        exact: true,
        component: () => <Redirect to='/sales-inventory/admin/view/1' />
      },
      {
        path: '/admin/view/:id',
        component: lazy(() => import('../../views/sales-inventory/admin/view')),
        meta: {
          navLink: '/sales-inventory/admin/view'
        }
      },
      {
        path: '/admin/edit',
        exact: true,
        component: () => <Redirect to='/admin/edit/1' />
      },
      {
        path: '/admin/edit/:id',
        component: lazy(() => import('../../views/sales-inventory/admin/edit')),
        meta: {
          navLink: '/admin/edit'
        }
      },
      {
        path: '/waiters/list',
        component: lazy(() => import('../../views/sales-inventory/waiter/list'))
      },
      {
        path: '/waiter/view',
        exact: true,
        component: () => <Redirect to='/sales-inventory/waiter/view/1' />
      },
      {
        path: '/waiter/view/:id',
        component: lazy(() => import('../../views/sales-inventory/waiter/view')),
        meta: {
          navLink: '/sales-inventory/waiter/view'
        }
      },
      {
        path: '/products/list',
        component: lazy(() => import('../../views/sales-inventory/product/list'))
      },
      {
        path: '/product/view',
        exact: true,
        component: () => <Redirect to='/sales-inventory/product/view/1' />
      },
      {
        path: '/product/view/:id',
        component: lazy(() => import('../../views/sales-inventory/product/view')),
        meta: {
          navLink: '/sales-inventory/product/view'
        }
      },
      {
        path: '/product/edit',
        exact: true,
        component: () => <Redirect to='/product/edit/1' />
      },
      {
        path: '/product/edit/:id',
        component: lazy(() => import('../../views/sales-inventory/product/edit')),
        meta: {
          navLink: '/product/edit'
        }
      },
      {
        path: '/orders/list',
        component: lazy(() => import('../../views/sales-inventory/order/list'))
      },
      {
        path: '/order/preview',
        exact: true,
        component: () => <Redirect to='/sales-inventory/order/preview/1' />
      },
      {
        path: '/order/preview/:id',
        component: lazy(() => import('../../views/sales-inventory/order/preview')),
        meta: {
          navLink: '/sales-inventory/order/preview'
        }
      },
      {
        path: '/order/print/:id',
        layout: 'BlankLayout',
        component: lazy(() => import('../../views/sales-inventory/order/print'))
      },
      {
        path: '/reports/list',
        component: lazy(() => import('../../views/sales-inventory/reports/list')),
      },
      {
        path: '/inventory-reports/list',
        component: lazy(() => import('../../views/sales-inventory/inventory-reports/list')),
      },
      {
        path: '/withdrawals/list',
        component: lazy(() => import('../../views/sales-inventory/withdrawals/list')),
      },
      {
        path: '/settlements/list',
        component: lazy(() => import('../../views/sales-inventory/settlement/list'))
      },
      {
        path: '/settings/list',
        component: lazy(() => import('../../views/sales-inventory/settings/list'))
      },
      {
        path: '/transactions/list',
        component: lazy(() => import('../../views/sales-inventory/transactions/list')),
      },
      {
        path: '/wallets/list',
        component: lazy(() => import('../../views/sales-inventory/wallets/list'))
      },
      {
        path: '/wallets/view',
        exact: true,
        component: () => <Redirect to='/sales-inventory/wallets/view/1' />
      },
      {
        path: '/wallets/view/:id',
        component: lazy(() => import('../../views/sales-inventory/wallets/view')),
        meta: {
          navLink: '/sales-inventory/wallets/view'
        }
      },
      {
        path: '/investments/packages/list',
        component: lazy(() => import('../../views/sales-inventory/investment/list'))
      },
      {
        path: '/investments/packages/view',
        exact: true,
        component: () => <Redirect to='/sales-inventory/investments/packages/view/1' />
      },
      {
        path: '/investments/packages/view/:id',
        component: lazy(() => import('../../views/sales-inventory/investment/view')),
        meta: {
          navLink: '/sales-inventory/investments/packages/view'
        }
      },
      {
        path: '/investments/investors/list',
        component: lazy(() => import('../../views/sales-inventory/guests/list'))
      },
      {
        path: '/investments/investors/view',
        exact: true,
        component: () => <Redirect to='/sales-inventory/investments/investors/view/1' />
      },
      {
        path: '/investments/investors/view/:id',
        component: lazy(() => import('../../views/sales-inventory/guests/view')),
        meta: {
          navLink: '/sales-inventory/investments/investors/view'
        }
      },
      {
        path: '/suppliers/list',
        component: lazy(() => import('../../views/sales-inventory/supplier/list'))
      },
      {
        path: '/supplier/view',
        exact: true,
        component: () => <Redirect to='/supplier/view/1' />
      },
      {
        path: '/supplier/view/:id',
        component: lazy(() => import('../../views/sales-inventory/supplier/view')),
        meta: {
          navLink: '/supplier/view'
        }
      },
      {
        path: '/supplier/edit',
        exact: true,
        component: () => <Redirect to='/supplier/edit/1' />
      },
      {
        path: '/supplier/edit/:id',
        component: lazy(() => import('../../views/sales-inventory/supplier/edit')),
        meta: {
          navLink: '/supplier/edit'
        }
      },
      {
        path: '/picker',
        component: lazy(() => import('../../views/sales-inventory/picker')),
      },
]

const BursaryRoutes = [
  {
    path: '/apps/ecommerce/shop',
    className: 'ecommerce-application',
    component: lazy(() => import('../../views/sales-inventory/ecommerce/shop'))
  },
  {
      path: '/apps/ecommerce/wishlist',
      className: 'ecommerce-application',
      component: lazy(() => import('../../views/sales-inventory/ecommerce/wishlist'))
  },
  {
      path: '/apps/ecommerce/product-detail',
      exact: true,
      className: 'ecommerce-application',
      component: () => <Redirect to='/apps/sales-inventory/product-detail/apple-i-phone-11-64-gb-black-26' />
  },
  {
      path: '/apps/ecommerce/product-detail/:product',
      exact: true,
      className: 'ecommerce-application',
      component: lazy(() => import('../../views/sales-inventory/ecommerce/detail')),
      meta: {
        navLink: '/apps/ecommerce/product-detail'
      }
  },
  {
      path: '/apps/ecommerce/checkout',
      className: 'ecommerce-application',
      component: lazy(() => import('../../views/sales-inventory/ecommerce/checkout'))
  },
  {
    path: '/admins/list',
    component: lazy(() => import('../../views/sales-inventory/admin/list'))
  },
  {
    path: '/admin/view',
    exact: true,
    component: () => <Redirect to='/sales-inventory/admin/view/1' />
  },
  {
    path: '/admin/view/:id',
    component: lazy(() => import('../../views/sales-inventory/admin/view')),
    meta: {
      navLink: '/sales-inventory/admin/view'
    }
  },
  {
    path: '/waiters/list',
    component: lazy(() => import('../../views/sales-inventory/waiter/list'))
  },
  {
    path: '/waiter/view',
    exact: true,
    component: () => <Redirect to='/sales-inventory/waiter/view/1' />
  },
  {
    path: '/waiter/view/:id',
    component: lazy(() => import('../../views/sales-inventory/waiter/view')),
    meta: {
      navLink: '/sales-inventory/waiter/view'
    }
  },
  {
    path: '/orders/list',
    component: lazy(() => import('../../views/sales-inventory/order/list'))
  },
  {
    path: '/order/view',
    exact: true,
    component: () => <Redirect to='/sales-inventory/order/view/1' />
  },
  {
    path: '/order/view/:id',
    component: lazy(() => import('../../views/sales-inventory/order/view')),
    meta: {
      navLink: '/sales-inventory/order/view'
    }
  },
  {
    path: '/withdrawals/list',
    component: lazy(() => import('../../views/sales-inventory/withdrawals/list')),
  },
  {
    path: '/settlements/list',
    component: lazy(() => import('../../views/sales-inventory/settlement/list'))
  },
  {
    path: '/transactions/list',
    component: lazy(() => import('../../views/sales-inventory/transactions/list')),
  },
  {
    path: '/picker',
    component: lazy(() => import('../../views/sales-inventory/picker')),
  },
]

const SalesRepRoutes = [
  {
    path: '/apps/ecommerce/shop',
    className: 'ecommerce-application',
    component: lazy(() => import('../../views/sales-inventory/ecommerce/shop'))
  },
  {
      path: '/apps/ecommerce/wishlist',
      className: 'ecommerce-application',
      component: lazy(() => import('../../views/sales-inventory/ecommerce/wishlist'))
  },
  {
      path: '/apps/ecommerce/product-detail',
      exact: true,
      className: 'ecommerce-application',
      component: () => <Redirect to='/apps/sales-inventory/product-detail/apple-i-phone-11-64-gb-black-26' />
  },
  {
      path: '/apps/ecommerce/product-detail/:product',
      exact: true,
      className: 'ecommerce-application',
      component: lazy(() => import('../../views/sales-inventory/ecommerce/detail')),
      meta: {
        navLink: '/apps/ecommerce/product-detail'
      }
  },
  {
      path: '/apps/ecommerce/checkout',
      className: 'ecommerce-application',
      component: lazy(() => import('../../views/sales-inventory/ecommerce/checkout'))
  },
  {
    path: '/waiters/list',
    component: lazy(() => import('../../views/sales-inventory/waiter/list'))
  },
  {
    path: '/waiter/view',
    exact: true,
    component: () => <Redirect to='/sales-inventory/waiter/view/1' />
  },
  {
    path: '/waiter/view/:id',
    component: lazy(() => import('../../views/sales-inventory/waiter/view')),
    meta: {
      navLink: '/sales-inventory/waiter/view'
    }
  },
  {
    path: '/orders/list',
    component: lazy(() => import('../../views/sales-inventory/order/list'))
  },
  {
    path: '/order/preview',
    exact: true,
    component: () => <Redirect to='/sales-inventory/order/preview/1' />
  },
  {
    path: '/order/preview/:id',
    component: lazy(() => import('../../views/sales-inventory/order/preview')),
    meta: {
      navLink: '/sales-inventory/order/preview'
    }
  },
  {
    path: '/order/print/:id',
    layout: 'BlankLayout',
    component: lazy(() => import('../../views/sales-inventory/order/print'))
  },
  {
    path: '/reports/list',
    component: lazy(() => import('../../views/sales-inventory/reports/list')),
  },
  {
    path: '/inventory-reports/list',
    component: lazy(() => import('../../views/sales-inventory/inventory-reports/list')),
  },
  {
    path: '/picker',
    component: lazy(() => import('../../views/sales-inventory/picker')),
  },
  {
    path: '/withdrawals/list',
    component: lazy(() => import('../../views/sales-inventory/withdrawals/list')),
  },
  {
    path: '/transactions/list',
    component: lazy(() => import('../../views/sales-inventory/transactions/list')),
  },
]

const StoreRoutes = [
  {
    path: '/apps/ecommerce/shop',
    className: 'ecommerce-application',
    component: lazy(() => import('../../views/sales-inventory/ecommerce/shop'))
  },
  {
      path: '/apps/ecommerce/wishlist',
      className: 'ecommerce-application',
      component: lazy(() => import('../../views/sales-inventory/ecommerce/wishlist'))
  },
  {
      path: '/apps/ecommerce/product-detail',
      exact: true,
      className: 'ecommerce-application',
      component: () => <Redirect to='/apps/sales-inventory/product-detail/apple-i-phone-11-64-gb-black-26' />
  },
  {
      path: '/apps/ecommerce/product-detail/:product',
      exact: true,
      className: 'ecommerce-application',
      component: lazy(() => import('../../views/sales-inventory/ecommerce/detail')),
      meta: {
        navLink: '/apps/ecommerce/product-detail'
      }
  },
  {
      path: '/apps/ecommerce/checkout',
      className: 'ecommerce-application',
      component: lazy(() => import('../../views/sales-inventory/ecommerce/checkout'))
  },
  {
    path: '/withdrawals/list',
    component: lazy(() => import('../../views/sales-inventory/withdrawals/list')),
  },
  {
    path: '/transactions/list',
    component: lazy(() => import('../../views/sales-inventory/transactions/list')),
  },
  {
    path: '/picker',
    component: lazy(() => import('../../views/sales-inventory/picker')),
  }
]

export default userData?.role === 'admin' ? ManagerRoutes : userData?.role === 'store' ? BursaryRoutes : userData?.role === 'sales-rep' ? SalesRepRoutes : StoreRoutes
