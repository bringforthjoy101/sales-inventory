// Order Storage Service - Manages local storage for orders

const STORAGE_KEY = 'picker_orders'
const CURRENT_ORDER_KEY = 'picker_current_order'
const HELD_ORDERS_KEY = 'picker_held_orders'

class OrderStorageService {
	// Save current order to local storage
	saveCurrentOrder(order) {
		try {
			localStorage.setItem(CURRENT_ORDER_KEY, JSON.stringify(order))
			return true
		} catch (error) {
			console.error('Error saving current order:', error)
			return false
		}
	}

	// Get current order from local storage
	getCurrentOrder() {
		try {
			const order = localStorage.getItem(CURRENT_ORDER_KEY)
			return order ? JSON.parse(order) : null
		} catch (error) {
			console.error('Error getting current order:', error)
			return null
		}
	}

	// Clear current order
	clearCurrentOrder() {
		try {
			localStorage.removeItem(CURRENT_ORDER_KEY)
			return true
		} catch (error) {
			console.error('Error clearing current order:', error)
			return false
		}
	}

	// Save held orders
	saveHeldOrders(orders) {
		try {
			localStorage.setItem(HELD_ORDERS_KEY, JSON.stringify(orders))
			return true
		} catch (error) {
			console.error('Error saving held orders:', error)
			return false
		}
	}

	// Get held orders
	getHeldOrders() {
		try {
			const orders = localStorage.getItem(HELD_ORDERS_KEY)
			return orders ? JSON.parse(orders) : []
		} catch (error) {
			console.error('Error getting held orders:', error)
			return []
		}
	}

	// Add order to held orders
	holdOrder(order, waiterInfo) {
		try {
			const heldOrders = this.getHeldOrders()
			const orderWithId = {
				...order,
				id: Date.now(),
				heldAt: new Date().toISOString(),
				status: 'held',
				waiter: waiterInfo // Store waiter information
			}
			heldOrders.push(orderWithId)
			this.saveHeldOrders(heldOrders)
			return orderWithId
		} catch (error) {
			console.error('Error holding order:', error)
			return null
		}
	}

	// Remove held order by id
	removeHeldOrder(orderId) {
		try {
			const heldOrders = this.getHeldOrders()
			const filteredOrders = heldOrders.filter(order => order.id !== orderId)
			this.saveHeldOrders(filteredOrders)
			return true
		} catch (error) {
			console.error('Error removing held order:', error)
			return false
		}
	}

	// Resume held order (make it current)
	resumeHeldOrder(orderId) {
		try {
			const heldOrders = this.getHeldOrders()
			const orderToResume = heldOrders.find(order => order.id === orderId)
			
			if (orderToResume) {
				// Save current order to held if it has items (preserve waiter info if exists)
				const currentOrder = this.getCurrentOrder()
				if (currentOrder && currentOrder.items && currentOrder.items.length > 0) {
					this.holdOrder(currentOrder, currentOrder.waiter || null)
				}
				
				// Remove from held orders
				this.removeHeldOrder(orderId)
				
				// Make it current
				delete orderToResume.id
				delete orderToResume.heldAt
				delete orderToResume.status
				this.saveCurrentOrder(orderToResume)
				
				return orderToResume
			}
			
			return null
		} catch (error) {
			console.error('Error resuming held order:', error)
			return null
		}
	}

	// Clear all held orders
	clearHeldOrders() {
		try {
			localStorage.removeItem(HELD_ORDERS_KEY)
			return true
		} catch (error) {
			console.error('Error clearing held orders:', error)
			return false
		}
	}

	// Clear all storage
	clearAll() {
		try {
			this.clearCurrentOrder()
			this.clearHeldOrders()
			return true
		} catch (error) {
			console.error('Error clearing all storage:', error)
			return false
		}
	}

	// Calculate order totals
	calculateOrderTotals(order) {
		if (!order || !order.items) {
			return {
				subtotal: 0,
				discount: 0,
				total: 0,
				itemCount: 0
			}
		}

		const subtotal = order.items.reduce((sum, item) => {
			return sum + (item.price * item.quantity)
		}, 0)

		// Calculate discount (can be amount or percentage)
		let discountAmount = 0
		if (order.discount) {
			if (order.discountType === 'percentage') {
				discountAmount = (subtotal * order.discount) / 100
			} else {
				discountAmount = order.discount
			}
		}

		const total = subtotal - discountAmount

		return {
			subtotal,
			discount: discountAmount,
			total: Math.max(0, total), // Ensure total is never negative
			itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0)
		}
	}

	// Generate order number
	generateOrderNumber() {
		const timestamp = Date.now()
		const random = Math.floor(Math.random() * 1000)
		return `ORD-${timestamp}-${random}`
	}
}

export default new OrderStorageService()