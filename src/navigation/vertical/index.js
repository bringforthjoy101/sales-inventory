// ** Navigation sections imports
import admins from './admins'
import waiters from './waiters'
import shop from './shop.js'
import dashboards from './dashboards'
import products from './products.js'
import orders from './orders'
import settlements from './settlements.js'
import reports from './reports.js'
import withdrawals from './withdrawals.js'
import transactions from './transactions.js'
import wallets from './wallets.js'
// import investments from './investments.js'
import suppliers from './suppliers.js'

const userData = JSON.parse(localStorage.getItem('userData'))

// ** Merge & Export
export default userData?.role === 'admin' ? [...dashboards, ...shop, ...products, ...suppliers, ...orders, ...waiters, ...admins, ...withdrawals, ...transactions, ...wallets, ...reports] : userData?.role === 'store' ? [...dashboards, ...shop, ...waiters, ...withdrawals, ...transactions, ...wallets] : userData?.role === 'sales-rep' ? [...dashboards, ...shop, ...waiters, ...orders, ...withdrawals, ...transactions, ...wallets, ...reports] : [...dashboards, ...shop, ...withdrawals]