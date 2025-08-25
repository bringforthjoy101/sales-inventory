// Initial State
const initialState = {
	inventoryData: [],
	summary: null,
	movements: [],
	totalRecords: 0,
	balance: null,
	lowStockProducts: [],
	totalCount: 0,
	criticalCount: 0,
	loading: false,
	error: null,
}

const inventoryReducer = (state = initialState, action) => {
	switch (action.type) {
		case 'GET_INVENTORY_REPORT':
			return {
				...state,
				inventoryData: action.inventoryData,
				summary: action.summary,
			}
		case 'GET_STOCK_MOVEMENTS':
			return {
				...state,
				movements: action.movements,
				totalRecords: action.totalRecords,
			}
		case 'GET_PRODUCT_BALANCE':
			return {
				...state,
				balance: action.balance,
			}
		case 'GET_LOW_STOCK':
			return {
				...state,
				lowStockProducts: action.lowStockProducts,
				totalCount: action.totalCount,
				criticalCount: action.criticalCount,
			}
		case 'SET_INVENTORY_LOADING':
			return {
				...state,
				loading: action.loading,
			}
		case 'CLEAR_INVENTORY_DATA':
			return initialState
		default:
			return state
	}
}

export default inventoryReducer