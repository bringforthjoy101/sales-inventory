// ** Initial State
const initialState = {
  allData: [],
  data: [],
  total: 1,
  params: {},
  selectedWaiter: null,
  waiterDetails: null,
  track: null,
  selectedWaiterAllTransactions: [],
  selectedWaiterTransactions: [],
  selectedWaiterTotalTransactions: 1,
  selectedWaiterTransactionParams: {},
  selectedWaiterAllOrders: [],
  selectedWaiterOrders: [],
  selectedWaiterTotalOrders: 1,
  selectedWaiterOrderParams: {}
}

const waiters = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_ALL_DATA':
      return { ...state, allData: action.data }
    case 'GET_FILTERED_WAITER_DATA':
      return {
        ...state,
        data: action.data,
        total: action.totalPages,
        params: action.params
      }
    case 'GET_WAITER':
      return { ...state, selectedWaiter: action.selectedWaiter }
    case 'GET_WAITER_DETAILS':
      return { ...state, waiterDetails: action.waiterDetails }
    case 'GET_WAITER_ALL_TRANSACTIONS':
      return { 
        ...state, 
        selectedWaiterAllTransactions: action.data
      }
    case 'GET_WAITER_TRANSACTIONS':
      return {
        ...state,
        selectedWaiterTransactions: action.data,
        selectedWaiterTotalTransactions: action.totalPages,
        selectedWaiterTransactionParams: action.params
      }
    case 'GET_WAITER_ALL_ORDERS':
      return { 
        ...state, 
        selectedWaiterAllOrders: action.data
      }
    case 'GET_WAITER_ORDERS':
      return {
        ...state,
        selectedWaiterOrders: action.data,
        selectedWaiterTotalOrders: action.totalPages,
        selectedWaiterOrderParams: action.params
      }
    default:
      return { ...state }
  }
}
export default waiters
