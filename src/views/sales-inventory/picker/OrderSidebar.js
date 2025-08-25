import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
	Card,
	CardBody,
	Button,
	Badge,
	ListGroup,
	ListGroupItem,
	UncontrolledDropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem,
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Input,
	Label,
	FormGroup,
	Nav,
	NavItem,
	NavLink,
	TabContent,
	TabPane
} from 'reactstrap'
import {
	ShoppingCart,
	Plus,
	Minus,
	Trash2,
	DollarSign,
	CreditCard,
	Smartphone,
	Clock,
	Send,
	RefreshCw,
	X,
	User,
	FileText,
	Pause,
	Play,
	Wifi
} from 'react-feather'
import classnames from 'classnames'
import orderStorage from './orderStorage'
import {
	updateOrderItemQuantity,
	removeFromOrder,
	clearCurrentOrder,
	holdCurrentOrder,
	resumeHeldOrder,
	deleteHeldOrder,
	submitOrder,
	updateCustomerInfo,
	updateOrderNotes,
	updateOrderDiscount,
	getWaiters
} from './store/action'

const OrderSidebar = () => {
	const dispatch = useDispatch()
	const { currentOrder, heldOrders, submitting, waiters } = useSelector(state => state.picker)
	const [activeTab, setActiveTab] = useState('current')
	const [paymentModal, setPaymentModal] = useState(false)
	const [selectedPaymentMode, setSelectedPaymentMode] = useState('cash')
	const [customerModal, setCustomerModal] = useState(false)
	const [customerName, setCustomerName] = useState('')
	const [customerPhone, setCustomerPhone] = useState('')
	const [orderNotes, setOrderNotes] = useState('')
	const [discount, setDiscount] = useState(0)
	const [discountType, setDiscountType] = useState('amount')
	const [selectedWaiterId, setSelectedWaiterId] = useState(null)

	// Fetch waiters on mount
	useEffect(() => {
		dispatch(getWaiters())
	}, [])

	// Calculate totals
	const totals = orderStorage.calculateOrderTotals(currentOrder)

	// Handle quantity change
	const handleQuantityChange = (itemId, delta) => {
		const item = currentOrder.items.find(i => i.id === itemId)
		if (item) {
			const newQuantity = item.quantity + delta
			if (newQuantity > 0) {
				dispatch(updateOrderItemQuantity(itemId, newQuantity))
			}
		}
	}

	// Handle remove item
	const handleRemoveItem = (itemId) => {
		dispatch(removeFromOrder(itemId))
	}

	// Handle clear order
	const handleClearOrder = () => {
		if (currentOrder.items.length > 0) {
			if (window.confirm('Are you sure you want to clear the current order?')) {
				dispatch(clearCurrentOrder())
			}
		}
	}

	// Handle hold order
	const handleHoldOrder = () => {
		dispatch(holdCurrentOrder())
	}

	// Handle resume held order
	const handleResumeOrder = (orderId) => {
		dispatch(resumeHeldOrder(orderId))
		setActiveTab('current')
	}

	// Handle delete held order
	const handleDeleteHeldOrder = (orderId) => {
		if (window.confirm('Are you sure you want to delete this held order?')) {
			dispatch(deleteHeldOrder(orderId))
		}
	}

	// Handle submit order
	const handleSubmitOrder = async () => {
		// Save customer info if provided
		if (customerName || customerPhone) {
			dispatch(updateCustomerInfo({ name: customerName, phone: customerPhone }))
		}
		
		// Save notes if provided
		if (orderNotes) {
			dispatch(updateOrderNotes(orderNotes))
		}
		
		// Save discount if provided
		if (discount > 0) {
			dispatch(updateOrderDiscount(discount, discountType))
		}
		
		// Submit order with waiter ID
		const result = await dispatch(submitOrder(selectedPaymentMode, selectedWaiterId))
		
		if (result) {
			// Reset form
			setCustomerName('')
			setCustomerPhone('')
			setOrderNotes('')
			setDiscount(0)
			setDiscountType('amount')
			setSelectedWaiterId(null)
			setPaymentModal(false)
		}
	}

	// Format currency
	const formatCurrency = (value) => {
		return new Intl.NumberFormat('en-NG', {
			style: 'currency',
			currency: 'NGN',
			minimumFractionDigits: 0,
			maximumFractionDigits: 0
		}).format(value)
	}

	// Payment methods
	const paymentMethods = [
		{ value: 'cash', label: 'Cash', icon: DollarSign, color: 'success' },
		{ value: 'pos', label: 'POS', icon: CreditCard, color: 'primary' },
		{ value: 'transfer', label: 'Transfer', icon: Smartphone, color: 'info' },
		{ value: 'complimentary', label: 'Complimentary', icon: User, color: 'secondary' }
	]

	return (
		<Card className='order-sidebar h-100'>
			<CardBody className='p-0 d-flex flex-column h-100'>
				{/* Header */}
				<div className='order-header p-2 border-bottom'>
					<div className='d-flex justify-content-between align-items-center'>
						<h5 className='mb-0'>
							<ShoppingCart size={20} className='mr-1' />
							Order Management
						</h5>
						<Badge color='primary' pill>
							{totals.itemCount} items
						</Badge>
					</div>
				</div>

				{/* Tabs */}
				<Nav tabs className='px-2 pt-2'>
					<NavItem>
						<NavLink
							className={classnames({ active: activeTab === 'current' })}
							onClick={() => setActiveTab('current')}
						>
							Current Order
							{currentOrder.items.length > 0 && (
								<Badge color='primary' className='ml-1'>{currentOrder.items.length}</Badge>
							)}
						</NavLink>
					</NavItem>
					<NavItem>
						<NavLink
							className={classnames({ active: activeTab === 'held' })}
							onClick={() => setActiveTab('held')}
						>
							On Hold
							{heldOrders.length > 0 && (
								<Badge color='warning' className='ml-1'>{heldOrders.length}</Badge>
							)}
						</NavLink>
					</NavItem>
				</Nav>

				<TabContent activeTab={activeTab} className='flex-grow-1 d-flex flex-column'>
					{/* Current Order Tab */}
					<TabPane tabId='current' className='flex-grow-1 d-flex flex-column'>
						{/* Order Items */}
						<div className='order-items flex-grow-1 overflow-auto p-2'>
							{currentOrder.items.length === 0 ? (
								<div className='text-center py-5'>
									<ShoppingCart size={48} className='text-muted mb-2' />
									<p className='text-muted'>No items in order</p>
									<small className='text-muted'>Add products to start a new order</small>
								</div>
							) : (
								<ListGroup flush>
									{currentOrder.items.map((item) => (
										<ListGroupItem key={item.id} className='px-0'>
											<div className='d-flex justify-content-between align-items-start'>
												<div className='flex-grow-1'>
													<h6 className='mb-0'>{item.name}</h6>
													<small className='text-muted'>
														{formatCurrency(item.price)} × {item.quantity}
													</small>
												</div>
												<div className='d-flex align-items-center'>
													<div className='quantity-controls d-flex align-items-center mr-2'>
														<Button
															color='light'
															size='sm'
															className='p-0'
															style={{ width: '24px', height: '24px' }}
															onClick={() => handleQuantityChange(item.id, -1)}
														>
															<Minus size={14} />
														</Button>
														<span className='mx-2' style={{ minWidth: '20px', textAlign: 'center' }}>
															{item.quantity}
														</span>
														<Button
															color='light'
															size='sm'
															className='p-0'
															style={{ width: '24px', height: '24px' }}
															onClick={() => handleQuantityChange(item.id, 1)}
														>
															<Plus size={14} />
														</Button>
													</div>
													<Button
														color='light'
														size='sm'
														className='p-0'
														style={{ width: '24px', height: '24px' }}
														onClick={() => handleRemoveItem(item.id)}
													>
														<X size={14} className='text-danger' />
													</Button>
												</div>
											</div>
											<div className='text-right'>
												<strong>{formatCurrency(item.price * item.quantity)}</strong>
											</div>
										</ListGroupItem>
									))}
								</ListGroup>
							)}
						</div>

						{/* Order Summary */}
						{currentOrder.items.length > 0 && (
							<div className='order-summary border-top p-2'>
								<div className='d-flex justify-content-between mb-1'>
									<span>Subtotal:</span>
									<strong>{formatCurrency(totals.subtotal)}</strong>
								</div>
								{totals.discount > 0 && (
									<div className='d-flex justify-content-between mb-1'>
										<span>Discount:</span>
										<span className='text-success'>-{formatCurrency(totals.discount)}</span>
									</div>
								)}
								<div className='d-flex justify-content-between mb-2'>
									<strong>Total:</strong>
									<strong className='text-primary h5 mb-0'>{formatCurrency(totals.total)}</strong>
								</div>

								{/* Action Buttons */}
								<div className='d-flex gap-1'>
									<Button
										color='warning'
										size='sm'
										className='flex-grow-1'
										onClick={handleHoldOrder}
									>
										<Pause size={14} className='mr-1' />
										Hold
									</Button>
									<Button
										color='danger'
										size='sm'
										className='flex-grow-1'
										onClick={handleClearOrder}
									>
										<X size={14} className='mr-1' />
										Clear
									</Button>
									<Button
										color='success'
										size='sm'
										className='flex-grow-1'
										onClick={() => setPaymentModal(true)}
										disabled={submitting}
									>
										<Send size={14} className='mr-1' />
										Pay
									</Button>
								</div>
							</div>
						)}
					</TabPane>

					{/* Held Orders Tab */}
					<TabPane tabId='held' className='p-2'>
						{heldOrders.length === 0 ? (
							<div className='text-center py-5'>
								<Clock size={48} className='text-muted mb-2' />
								<p className='text-muted'>No orders on hold</p>
							</div>
						) : (
							<ListGroup flush>
								{heldOrders.map((order) => {
									const orderTotals = orderStorage.calculateOrderTotals(order)
									return (
										<ListGroupItem key={order.id} className='px-0'>
											<div className='d-flex justify-content-between align-items-start mb-2'>
												<div>
													<h6 className='mb-0'>Order #{order.id}</h6>
													<small className='text-muted'>
														{new Date(order.heldAt).toLocaleString()}
													</small>
													<div className='mt-1'>
														<Badge color='light-primary' className='mr-1'>
															{orderTotals.itemCount} items
														</Badge>
														<Badge color='light-success'>
															{formatCurrency(orderTotals.total)}
														</Badge>
													</div>
												</div>
												<div>
													<Button
														color='success'
														size='sm'
														className='mr-1'
														onClick={() => handleResumeOrder(order.id)}
													>
														<Play size={14} />
													</Button>
													<Button
														color='danger'
														size='sm'
														onClick={() => handleDeleteHeldOrder(order.id)}
													>
														<Trash2 size={14} />
													</Button>
												</div>
											</div>
											<div className='small'>
												{order.items.slice(0, 3).map((item, idx) => (
													<div key={idx}>
														• {item.name} ({item.quantity})
													</div>
												))}
												{order.items.length > 3 && (
													<div className='text-muted'>
														...and {order.items.length - 3} more
													</div>
												)}
											</div>
										</ListGroupItem>
									)
								})}
							</ListGroup>
						)}
					</TabPane>
				</TabContent>

				{/* Payment Modal */}
				<Modal isOpen={paymentModal} toggle={() => setPaymentModal(false)}>
					<ModalHeader toggle={() => setPaymentModal(false)}>
						Complete Payment
					</ModalHeader>
					<ModalBody>
						{/* Order Summary */}
						<div className='mb-3 p-2 bg-light rounded'>
							<h6>Order Summary</h6>
							<div className='d-flex justify-content-between'>
								<span>Items:</span>
								<span>{totals.itemCount}</span>
							</div>
							<div className='d-flex justify-content-between'>
								<span>Total:</span>
								<strong className='text-primary'>{formatCurrency(totals.total)}</strong>
							</div>
						</div>

						{/* Waiter Selection */}
						<FormGroup>
							<Label>Select Waiter/Cashier <span className='text-danger'>*</span></Label>
							<Input
								type='select'
								value={selectedWaiterId || ''}
								onChange={(e) => setSelectedWaiterId(e.target.value)}
								required
							>
								<option value=''>-- Select Waiter --</option>
								{waiters && waiters.map(waiter => (
									<option key={waiter.id} value={waiter.id}>
										{waiter.fullName}
									</option>
								))}
							</Input>
						</FormGroup>

						{/* Discount */}
						<FormGroup>
							<Label>Discount (Optional)</Label>
							<div className='d-flex'>
								<Input
									type='number'
									placeholder='Enter discount'
									value={discount}
									onChange={(e) => {
										const value = parseFloat(e.target.value) || 0
										setDiscount(value)
										dispatch(updateOrderDiscount(value, discountType))
									}}
									min='0'
									max={discountType === 'percentage' ? '100' : totals.subtotal}
									style={{ flex: 1 }}
								/>
								<Input
									type='select'
									value={discountType}
									onChange={(e) => {
										setDiscountType(e.target.value)
										dispatch(updateOrderDiscount(discount, e.target.value))
									}}
									style={{ width: '120px', marginLeft: '10px' }}
								>
									<option value='amount'>Amount (₦)</option>
									<option value='percentage'>Percent (%)</option>
								</Input>
							</div>
						</FormGroup>

						{/* Customer Info */}
						<FormGroup>
							<Label>Customer Name (Optional)</Label>
							<Input
								type='text'
								placeholder='Enter customer name'
								value={customerName}
								onChange={(e) => setCustomerName(e.target.value)}
							/>
						</FormGroup>

						<FormGroup>
							<Label>Customer Phone (Optional)</Label>
							<Input
								type='tel'
								placeholder='Enter phone number'
								value={customerPhone}
								onChange={(e) => setCustomerPhone(e.target.value)}
							/>
						</FormGroup>

						{/* Order Notes */}
						<FormGroup>
							<Label>Order Notes (Optional)</Label>
							<Input
								type='textarea'
								rows='2'
								placeholder='Add any special notes...'
								value={orderNotes}
								onChange={(e) => setOrderNotes(e.target.value)}
							/>
						</FormGroup>

						{/* Payment Method */}
						<FormGroup>
							<Label>Payment Method</Label>
							<div className='payment-methods'>
								{paymentMethods.map((method) => {
									const Icon = method.icon
									return (
										<Button
											key={method.value}
											color={selectedPaymentMode === method.value ? method.color : 'light'}
											className='mr-1 mb-1'
											onClick={() => setSelectedPaymentMode(method.value)}
										>
											<Icon size={16} className='mr-1' />
											{method.label}
										</Button>
									)
								})}
							</div>
						</FormGroup>
					</ModalBody>
					<ModalFooter>
						<Button color='secondary' onClick={() => setPaymentModal(false)}>
							Cancel
						</Button>
						<Button
							color='success'
							onClick={handleSubmitOrder}
							disabled={submitting || !selectedWaiterId}
						>
							{submitting ? 'Processing...' : 'Complete Order'}
						</Button>
					</ModalFooter>
				</Modal>
			</CardBody>
		</Card>
	)
}

export default OrderSidebar