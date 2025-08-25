import { apiRequest, swal } from '@utils'

// Get Inventory Report
export const getInventoryReport = (params) => {
	return async (dispatch) => {
		dispatch({
			type: 'SET_INVENTORY_LOADING',
			loading: true,
		})

		const response = await apiRequest({
			url: '/inventory/report',
			method: 'POST',
			body: JSON.stringify(params)
		}, dispatch)

		if (response && response.data && response.data.status) {
			dispatch({
				type: 'GET_INVENTORY_REPORT',
				inventoryData: response.data.data.inventoryData,
				summary: response.data.data.summary,
			})
			dispatch({
				type: 'SET_INVENTORY_LOADING',
				loading: false,
			})
		} else {
			console.log(response)
			dispatch({
				type: 'SET_INVENTORY_LOADING',
				loading: false,
			})
			if (response && response.data && response.data.message) {
				swal('Oops!', response.data.message, 'error')
			} else {
				swal('Oops!', 'Failed to generate inventory report.', 'error')
			}
		}
	}
}

// Get Stock Movement Summary
export const getStockMovementSummary = (params) => {
	return async (dispatch) => {
		dispatch({
			type: 'SET_INVENTORY_LOADING',
			loading: true,
		})

		const response = await apiRequest({
			url: '/inventory/stock-movement',
			method: 'POST',
			body: JSON.stringify(params)
		}, dispatch)

		if (response && response.data && response.data.status) {
			dispatch({
				type: 'GET_STOCK_MOVEMENTS',
				movements: response.data.data.movements,
				totalRecords: response.data.data.totalRecords,
			})
			dispatch({
				type: 'SET_INVENTORY_LOADING',
				loading: false,
			})
		} else {
			console.log(response)
			dispatch({
				type: 'SET_INVENTORY_LOADING',
				loading: false,
			})
			if (response && response.data && response.data.message) {
				swal('Oops!', response.data.message, 'error')
			} else {
				swal('Oops!', 'Failed to get stock movements.', 'error')
			}
		}
	}
}

// Get Product Stock Balance
export const getProductStockBalance = (productId, date = null) => {
	return async (dispatch) => {
		dispatch({
			type: 'SET_INVENTORY_LOADING',
			loading: true,
		})

		const params = date ? { date } : {}
		
		const response = await apiRequest({
			url: `/inventory/stock-balance/${productId}`,
			method: 'POST',
			body: JSON.stringify(params)
		}, dispatch)

		if (response && response.data && response.data.status) {
			dispatch({
				type: 'GET_PRODUCT_BALANCE',
				balance: response.data.data,
			})
			dispatch({
				type: 'SET_INVENTORY_LOADING',
				loading: false,
			})
		} else {
			console.log(response)
			dispatch({
				type: 'SET_INVENTORY_LOADING',
				loading: false,
			})
			if (response && response.data && response.data.message) {
				swal('Oops!', response.data.message, 'error')
			} else {
				swal('Oops!', 'Failed to get product stock balance.', 'error')
			}
		}
	}
}

// Get Low Stock Products
export const getLowStockProducts = (params = {}) => {
	return async (dispatch) => {
		dispatch({
			type: 'SET_INVENTORY_LOADING',
			loading: true,
		})

		const response = await apiRequest({
			url: '/inventory/low-stock',
			method: 'POST',
			body: JSON.stringify(params)
		}, dispatch)

		if (response && response.data && response.data.status) {
			dispatch({
				type: 'GET_LOW_STOCK',
				lowStockProducts: response.data.data.products,
				totalCount: response.data.data.totalCount,
				criticalCount: response.data.data.criticalCount,
			})
			dispatch({
				type: 'SET_INVENTORY_LOADING',
				loading: false,
			})
		} else {
			console.log(response)
			dispatch({
				type: 'SET_INVENTORY_LOADING',
				loading: false,
			})
			if (response && response.data && response.data.message) {
				swal('Oops!', response.data.message, 'error')
			} else {
				swal('Oops!', 'Failed to get low stock products.', 'error')
			}
		}
	}
}

// Clear Inventory Data
export const clearInventoryData = () => {
	return (dispatch) => {
		dispatch({
			type: 'CLEAR_INVENTORY_DATA',
		})
	}
}