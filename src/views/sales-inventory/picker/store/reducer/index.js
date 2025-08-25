// Initial State
const initialState = {
	products: [],
	waiters: [],
	currentOrder: {
		items: [],
		customer: null,
		notes: '',
		discount: 0,
		discountType: 'amount'
	},
	heldOrders: [],
	selectedCategory: '',
	searchTerm: '',
	loading: false,
	submitting: false,
	error: null
}

const pickerReducer = (state = initialState, action) => {
	switch (action.type) {
		case 'GET_PICKER_PRODUCTS':
			return {
				...state,
				products: action.products
			}
		
		case 'GET_PICKER_WAITERS':
			return {
				...state,
				waiters: action.waiters
			}
		
		case 'INITIALIZE_ORDER':
			return {
				...state,
				currentOrder: action.currentOrder,
				heldOrders: action.heldOrders
			}
		
		case 'UPDATE_CURRENT_ORDER':
			return {
				...state,
				currentOrder: action.currentOrder
			}
		
		case 'CLEAR_CURRENT_ORDER':
			return {
				...state,
				currentOrder: {
					items: [],
					customer: null,
					notes: '',
					discount: 0,
					discountType: 'amount'
				}
			}
		
		case 'HOLD_ORDER':
			return {
				...state,
				currentOrder: {
					items: [],
					customer: null,
					notes: '',
					discount: 0,
					discountType: 'amount'
				},
				heldOrders: action.heldOrders
			}
		
		case 'RESUME_HELD_ORDER':
			return {
				...state,
				currentOrder: action.currentOrder,
				heldOrders: action.heldOrders
			}
		
		case 'DELETE_HELD_ORDER':
			return {
				...state,
				heldOrders: action.heldOrders
			}
		
		case 'ORDER_SUBMITTED_SUCCESS':
			return {
				...state,
				currentOrder: {
					items: [],
					customer: null,
					notes: '',
					discount: 0,
					discountType: 'amount'
				}
			}
		
		case 'SET_SELECTED_CATEGORY':
			return {
				...state,
				selectedCategory: action.selectedCategory
			}
		
		case 'SET_SEARCH_TERM':
			return {
				...state,
				searchTerm: action.searchTerm
			}
		
		case 'SET_PICKER_LOADING':
			return {
				...state,
				loading: action.loading
			}
		
		case 'SET_SUBMITTING':
			return {
				...state,
				submitting: action.submitting
			}
		
		default:
			return state
	}
}

export default pickerReducer