// ** Redux Imports
import { combineReducers } from 'redux'

// ** Reducers Imports
import auth from './auth'
import navbar from './navbar'
import layout from './layout'
import chat from '@src/views/apps/chat/store/reducer'
import todo from '@src/views/apps/todo/store/reducer'
import users from '@src/views/apps/user/store/reducer'

import waiters from '@src/views/sales-inventory/waiter/store/reducer'
import wallets from '@src/views/sales-inventory/wallets/store/reducer'
import investments from '@src/views/sales-inventory/investment/store/reducer'
import guests from '@src/views/sales-inventory/guests/store/reducer'
import admins from '@src/views/sales-inventory/admin/store/reducer'
import products from '@src/views/sales-inventory/product/store/reducer'
import orders from '@src/views/sales-inventory/order/store/reducer'
import settlements from '@src/views/sales-inventory/settlement/store/reducer'
import reports from '@src/views/sales-inventory/reports/store/reducer'
import inventoryReport from '@src/views/sales-inventory/inventory-reports/store/reducer'
import picker from '@src/views/sales-inventory/picker/store/reducer'
import withdrawals from '@src/views/sales-inventory/withdrawals/store/reducer'
import transactions from '@src/views/sales-inventory/transactions/store/reducer'
import suppliers from '@src/views/sales-inventory/supplier/store/reducer'
import email from '@src/views/apps/email/store/reducer'
// import invoice from '@src/views/apps/invoice/store/reducer'
import invoice from '@src/views/invoiceApp/store/reducer'
import calendar from '@src/views/apps/calendar/store/reducer'
import ecommerce from '@src/views/sales-inventory/ecommerce/store/reducer'
import dataTables from '@src/views/tables/data-tables/store/reducer'

const rootReducer = combineReducers({
  auth,
  ecommerce,
  todo,
  chat,
  email,
  users,
  waiters,
  wallets,
  investments,
  guests,
  admins,
  products,
  settlements,
  reports,
  inventoryReport,
  picker,
  withdrawals,
  transactions,
  orders,
  suppliers,
  navbar,
  layout,
  invoice,
  calendar,
  dataTables
})

export default rootReducer
