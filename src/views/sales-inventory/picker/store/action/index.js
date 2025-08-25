import { apiRequest, swal } from '@utils'
import orderStorage from '../../orderStorage'

// Get all products for picker
export const getProducts = () => {
	return async (dispatch) => {
		dispatch({ type: 'SET_PICKER_LOADING', loading: true })
		
		const response = await apiRequest({ url: '/products', method: 'GET' }, dispatch)
		
		if (response && response.data && response.data.status) {
			dispatch({
				type: 'GET_PICKER_PRODUCTS',
				products: response.data.data
			})
		} else {
			console.log(response)
			swal('Oops!', 'Failed to load products.', 'error')
		}
		
		dispatch({ type: 'SET_PICKER_LOADING', loading: false })
	}
}

// Get all waiters
export const getWaiters = () => {
	return async (dispatch) => {
		const response = await apiRequest({ url: '/waiters', method: 'GET' }, dispatch)
		
		if (response && response.data && response.data.status) {
			dispatch({
				type: 'GET_PICKER_WAITERS',
				waiters: response.data.data
			})
		} else {
			console.log(response)
			// Don't show error for waiters, just log it
		}
	}
}

// Initialize order from local storage
export const initializeOrder = () => {
	return (dispatch) => {
		const currentOrder = orderStorage.getCurrentOrder()
		const heldOrders = orderStorage.getHeldOrders()
		
		dispatch({
			type: 'INITIALIZE_ORDER',
			currentOrder: currentOrder || { items: [], customer: null, notes: '' },
			heldOrders
		})
	}
}

// Add item to current order
export const addToOrder = (product, quantity = 1) => {
	return (dispatch, getState) => {
		const { currentOrder } = getState().picker
		
		// Check if item already exists in order
		const existingItemIndex = currentOrder.items.findIndex(item => item.id === product.id)
		
		let updatedOrder
		if (existingItemIndex >= 0) {
			// Update quantity if item exists
			updatedOrder = {
				...currentOrder,
				items: currentOrder.items.map((item, index) => {
					if (index === existingItemIndex) {
						return {
							...item,
							quantity: item.quantity + quantity
						}
					}
					return item
				})
			}
		} else {
			// Add new item
			const orderItem = {
				id: product.id,
				name: product.name,
				price: product.price,
				costPrice: product.costPrice,
				quantity,
				unit: product.unit,
				category: product.category
			}
			
			updatedOrder = {
				...currentOrder,
				items: [...currentOrder.items, orderItem]
			}
		}
		
		// Save to local storage
		orderStorage.saveCurrentOrder(updatedOrder)
		
		dispatch({
			type: 'UPDATE_CURRENT_ORDER',
			currentOrder: updatedOrder
		})
	}
}

// Update item quantity in order
export const updateOrderItemQuantity = (itemId, quantity) => {
	return (dispatch, getState) => {
		const { currentOrder } = getState().picker
		
		let updatedOrder
		if (quantity <= 0) {
			// Remove item if quantity is 0 or less
			updatedOrder = {
				...currentOrder,
				items: currentOrder.items.filter(item => item.id !== itemId)
			}
		} else {
			// Update quantity
			updatedOrder = {
				...currentOrder,
				items: currentOrder.items.map(item => {
					if (item.id === itemId) {
						return { ...item, quantity }
					}
					return item
				})
			}
		}
		
		// Save to local storage
		orderStorage.saveCurrentOrder(updatedOrder)
		
		dispatch({
			type: 'UPDATE_CURRENT_ORDER',
			currentOrder: updatedOrder
		})
	}
}

// Remove item from order
export const removeFromOrder = (itemId) => {
	return (dispatch, getState) => {
		const { currentOrder } = getState().picker
		
		const updatedOrder = {
			...currentOrder,
			items: currentOrder.items.filter(item => item.id !== itemId)
		}
		
		// Save to local storage
		orderStorage.saveCurrentOrder(updatedOrder)
		
		dispatch({
			type: 'UPDATE_CURRENT_ORDER',
			currentOrder: updatedOrder
		})
	}
}

// Clear current order
export const clearCurrentOrder = () => {
	return (dispatch) => {
		orderStorage.clearCurrentOrder()
		
		dispatch({
			type: 'CLEAR_CURRENT_ORDER'
		})
	}
}

// Hold current order
export const holdCurrentOrder = () => {
	return (dispatch, getState) => {
		const { currentOrder } = getState().picker
		
		if (!currentOrder.items || currentOrder.items.length === 0) {
			swal('Oops!', 'No items in current order to hold.', 'warning')
			return
		}
		
		const heldOrder = orderStorage.holdOrder(currentOrder)
		
		if (heldOrder) {
			// Clear current order
			orderStorage.clearCurrentOrder()
			
			// Update state
			const heldOrders = orderStorage.getHeldOrders()
			dispatch({
				type: 'HOLD_ORDER',
				heldOrders
			})
			
			swal('Success!', 'Order has been put on hold.', 'success')
		}
	}
}

// Resume held order
export const resumeHeldOrder = (orderId) => {
	return (dispatch) => {
		const resumedOrder = orderStorage.resumeHeldOrder(orderId)
		
		if (resumedOrder) {
			const heldOrders = orderStorage.getHeldOrders()
			
			dispatch({
				type: 'RESUME_HELD_ORDER',
				currentOrder: resumedOrder,
				heldOrders
			})
			
			swal('Success!', 'Order has been resumed.', 'success')
		}
	}
}

// Delete held order
export const deleteHeldOrder = (orderId) => {
	return (dispatch) => {
		const success = orderStorage.removeHeldOrder(orderId)
		
		if (success) {
			const heldOrders = orderStorage.getHeldOrders()
			
			dispatch({
				type: 'DELETE_HELD_ORDER',
				heldOrders
			})
			
			swal('Success!', 'Held order has been deleted.', 'success')
		}
	}
}

// Submit order to backend
export const submitOrder = (paymentMode = 'cash', waiterId = null) => {
	return async (dispatch, getState) => {
		const { currentOrder } = getState().picker
		
		if (!currentOrder.items || currentOrder.items.length === 0) {
			swal('Oops!', 'No items in order to submit.', 'warning')
			return
		}
		
		// If no waiterId provided, try to get from user's data
		if (!waiterId) {
			// Check if current user has a waiter profile
			const userData = JSON.parse(localStorage.getItem('userData'))
			if (userData && userData.waiterId) {
				waiterId = userData.waiterId
			} else if (userData && userData.id) {
				// Use the user's admin ID as waiterId for POS sales
				waiterId = userData.id
			} else {
				// If no user data available, let the backend handle it or show error
				swal('Error', 'Unable to identify cashier. Please log in again.', 'error')
				dispatch({ type: 'SET_SUBMITTING', submitting: false })
				return
			}
		}
		
		dispatch({ type: 'SET_SUBMITTING', submitting: true })
		
		// Calculate totals
		const totals = orderStorage.calculateOrderTotals(currentOrder)
		
		// Prepare order data for backend - matching the expected format
		const orderData = {
			products: currentOrder.items.map(item => ({
				id: item.id,
				name: item.name,
				qty: item.quantity, // Backend expects 'qty' not 'quantity'
				price: item.price,
				costPrice: item.costPrice,
				totalAmount: item.price * item.quantity,
				unit: item.unit || 'pcs',
				unitValue: 1
			})),
			subTotal: totals.subtotal,
			discount: totals.discount || 0,
			amount: totals.total,
			charges: 0, // No tax/charges
			paymentMode,
			waiterId,
			notes: currentOrder.notes || ''
		}
		
		// Submit to backend
		const response = await apiRequest({
			url: '/orders/create',
			method: 'POST',
			body: JSON.stringify(orderData)
		}, dispatch)
		
		if (response && response.data && response.data.status) {
			// Clear current order
			orderStorage.clearCurrentOrder()
			
			dispatch({
				type: 'ORDER_SUBMITTED_SUCCESS',
				order: response.data.data
			})
			
			swal('Success!', `Order #${response.data.data.id || response.data.data.orderNumber || 'new'} has been submitted successfully.`, 'success')
			
			// Return the order for potential printing
			return response.data.data
		} else {
			swal('Oops!', response?.data?.message || 'Failed to submit order.', 'error')
		}
		
		dispatch({ type: 'SET_SUBMITTING', submitting: false })
	}
}

// Update customer info
export const updateCustomerInfo = (customerInfo) => {
	return (dispatch, getState) => {
		const { currentOrder } = getState().picker
		
		const updatedOrder = {
			...currentOrder,
			customer: customerInfo
		}
		
		orderStorage.saveCurrentOrder(updatedOrder)
		
		dispatch({
			type: 'UPDATE_CURRENT_ORDER',
			currentOrder: updatedOrder
		})
	}
}

// Update order notes
export const updateOrderNotes = (notes) => {
	return (dispatch, getState) => {
		const { currentOrder } = getState().picker
		
		const updatedOrder = {
			...currentOrder,
			notes
		}
		
		orderStorage.saveCurrentOrder(updatedOrder)
		
		dispatch({
			type: 'UPDATE_CURRENT_ORDER',
			currentOrder: updatedOrder
		})
	}
}

// Update order discount
export const updateOrderDiscount = (discount, discountType) => {
	return (dispatch, getState) => {
		const { currentOrder } = getState().picker
		
		const updatedOrder = {
			...currentOrder,
			discount,
			discountType
		}
		
		orderStorage.saveCurrentOrder(updatedOrder)
		
		dispatch({
			type: 'UPDATE_CURRENT_ORDER',
			currentOrder: updatedOrder
		})
	}
}

// Set selected category filter
export const setSelectedCategory = (category) => {
	return (dispatch) => {
		dispatch({
			type: 'SET_SELECTED_CATEGORY',
			selectedCategory: category
		})
	}
}

// Set search term
export const setSearchTerm = (term) => {
	return (dispatch) => {
		dispatch({
			type: 'SET_SEARCH_TERM',
			searchTerm: term
		})
	}
}