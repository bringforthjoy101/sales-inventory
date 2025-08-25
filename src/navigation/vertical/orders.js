import { ArrowUpRight, ShoppingCart, List } from 'react-feather'

export default [
    {
      id: 'Orders',
      title: 'Orders',
      icon: <ShoppingCart size={20} />,
      children: [
        {
          id: 'picker',
          title: 'Picker (POS)',
          icon: <ShoppingCart size={12} />,
          navLink: '/picker'
        },
        {
          id: 'allOrders',
          title: 'All Orders',
          icon: <List size={12} />,
          navLink: '/orders/list'
        }
      ]
    }
]