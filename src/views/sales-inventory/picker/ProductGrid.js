import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
	Card,
	CardBody,
	CardTitle,
	CardText,
	Button,
	Badge,
	Input,
	InputGroup,
	InputGroupAddon,
	InputGroupText,
	Row,
	Col,
	Spinner,
	ButtonGroup
} from 'reactstrap'
import {
	Search,
	Plus,
	Minus,
	ShoppingCart,
	Package,
	Grid,
	List,
	Filter
} from 'react-feather'
import { addToOrder, setSelectedCategory, setSearchTerm } from './store/action'

const ProductGrid = () => {
	const dispatch = useDispatch()
	const { products, selectedCategory, searchTerm, loading, currentOrder } = useSelector(state => state.picker)
	const [quantities, setQuantities] = useState({})
	const [viewMode, setViewMode] = useState('grid') // grid or list
	const [localSearchTerm, setLocalSearchTerm] = useState('')

	// Initialize quantities for each product
	useEffect(() => {
		const initialQuantities = {}
		products.forEach(product => {
			initialQuantities[product.id] = 1
		})
		setQuantities(initialQuantities)
	}, [products])

	// Get unique categories from products
	const categories = ['All Products', ...new Set(products.map(p => p.category).filter(c => c))]

	// Filter products based on category and search
	const filteredProducts = products.filter(product => {
		const matchesCategory = !selectedCategory || selectedCategory === 'All Products' || product.category === selectedCategory
		const matchesSearch = !searchTerm || 
			product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			(product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
		return matchesCategory && matchesSearch
	})

	// Handle quantity change
	const handleQuantityChange = (productId, delta) => {
		setQuantities(prev => ({
			...prev,
			[productId]: Math.max(1, (prev[productId] || 1) + delta)
		}))
	}

	// Handle add to order
	const handleAddToOrder = (product) => {
		const quantity = quantities[product.id] || 1
		dispatch(addToOrder(product, quantity))
		// Reset quantity after adding
		setQuantities(prev => ({
			...prev,
			[product.id]: 1
		}))
	}

	// Check if product is in current order
	const getProductQuantityInOrder = (productId) => {
		const item = currentOrder.items.find(i => i.id === productId)
		return item ? item.quantity : 0
	}

	// Handle search
	const handleSearch = (value) => {
		setLocalSearchTerm(value)
		// Debounce search
		setTimeout(() => {
			dispatch(setSearchTerm(value))
		}, 300)
	}

	// Handle category selection
	const handleCategorySelect = (category) => {
		dispatch(setSelectedCategory(category === 'All Products' ? '' : category))
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

	// Get category color
	const getCategoryColor = (category) => {
		const colors = {
			shop: 'primary',
			store: 'success',
			beer: 'warning',
			wine: 'danger',
			spirits: 'info',
			cigarettes: 'secondary',
			default: 'light'
		}
		return colors[category?.toLowerCase()] || colors.default
	}

	// Product Card Component
	const ProductCard = ({ product }) => {
		const inOrderQty = getProductQuantityInOrder(product.id)
		const quantity = quantities[product.id] || 1

		return (
			<Card className='product-card h-100'>
				<CardBody className='p-2'>
					<div className='d-flex justify-content-between mb-2'>
						{product.qty <= 5 && (
							<Badge color='danger'>
								Low Stock
							</Badge>
						)}
						{inOrderQty > 0 && (
							<Badge color='success'>
								In Order: {inOrderQty}
							</Badge>
						)}
					</div>
					<CardTitle tag='h6' className='mb-1 text-truncate'>
						{product.name}
					</CardTitle>
					<div className='d-flex justify-content-between align-items-center mb-2'>
						<Badge color={`light-${getCategoryColor(product.category)}`}>
							{product.category}
						</Badge>
						<small className='text-muted'>Stock: {product.qty}</small>
					</div>
					<CardText className='text-primary font-weight-bold mb-2'>
						{formatCurrency(product.price)}
					</CardText>
					<div className='quantity-selector d-flex align-items-center mb-2'>
						<Button
							color='light'
							size='sm'
							className='p-0'
							style={{ width: '30px', height: '30px' }}
							onClick={() => handleQuantityChange(product.id, -1)}
						>
							<Minus size={14} />
						</Button>
						<Input
							type='number'
							value={quantity}
							onChange={(e) => setQuantities(prev => ({
								...prev,
								[product.id]: parseInt(e.target.value) || 1
							}))}
							className='mx-1 text-center'
							style={{ width: '60px', height: '30px' }}
							min='1'
						/>
						<Button
							color='light'
							size='sm'
							className='p-0'
							style={{ width: '30px', height: '30px' }}
							onClick={() => handleQuantityChange(product.id, 1)}
						>
							<Plus size={14} />
						</Button>
					</div>
					<Button
						color={inOrderQty > 0 ? 'success' : 'primary'}
						size='sm'
						block
						onClick={() => handleAddToOrder(product)}
						disabled={product.qty === 0}
					>
						<ShoppingCart size={14} className='mr-1' />
						{product.qty === 0 ? 'Out of Stock' : inOrderQty > 0 ? 'Add More' : 'Add to Cart'}
					</Button>
				</CardBody>
			</Card>
		)
	}

	// Product List Item Component
	const ProductListItem = ({ product }) => {
		const inOrderQty = getProductQuantityInOrder(product.id)
		const quantity = quantities[product.id] || 1

		return (
			<Card className='product-list-item mb-2'>
				<CardBody className='p-2'>
					<Row className='align-items-center'>
						<Col xs='12'>
							<div className='d-flex justify-content-between align-items-center'>
								<div className='flex-grow-1'>
									<h6 className='mb-0'>{product.name}</h6>
									<div>
										<Badge color={`light-${getCategoryColor(product.category)}`} className='mr-2'>
											{product.category}
										</Badge>
										<span className='text-muted small'>Stock: {product.qty}</span>
										{inOrderQty > 0 && (
											<Badge color='success' className='ml-2'>
												In Order: {inOrderQty}
											</Badge>
										)}
									</div>
								</div>
								<div className='d-flex align-items-center'>
									<strong className='text-primary mr-3'>{formatCurrency(product.price)}</strong>
									<div className='quantity-selector d-flex align-items-center mr-2'>
										<Button
											color='light'
											size='sm'
											className='p-0'
											style={{ width: '28px', height: '28px' }}
											onClick={() => handleQuantityChange(product.id, -1)}
										>
											<Minus size={14} />
										</Button>
										<Input
											type='number'
											value={quantity}
											onChange={(e) => setQuantities(prev => ({
												...prev,
												[product.id]: parseInt(e.target.value) || 1
											}))}
											className='mx-1 text-center'
											style={{ width: '50px', height: '28px' }}
											min='1'
										/>
										<Button
											color='light'
											size='sm'
											className='p-0'
											style={{ width: '28px', height: '28px' }}
											onClick={() => handleQuantityChange(product.id, 1)}
										>
											<Plus size={14} />
										</Button>
									</div>
									<Button
										color={inOrderQty > 0 ? 'success' : 'primary'}
										size='sm'
										onClick={() => handleAddToOrder(product)}
										disabled={product.qty === 0}
										style={{ minWidth: '100px' }}
									>
										<ShoppingCart size={14} className='mr-1' />
										{product.qty === 0 ? 'Out of Stock' : inOrderQty > 0 ? 'Add More' : 'Add to Cart'}
									</Button>
								</div>
							</div>
						</Col>
					</Row>
				</CardBody>
			</Card>
		)
	}

	return (
		<div className='product-grid-container'>
			{/* Header with Search and Filters */}
			<div className='product-grid-header mb-3'>
				<Row className='align-items-center'>
					<Col md='6'>
						<InputGroup>
							<InputGroupAddon addonType='prepend'>
								<InputGroupText>
									<Search size={16} />
								</InputGroupText>
							</InputGroupAddon>
							<Input
								type='text'
								placeholder='Search products by name, barcode, or category...'
								value={localSearchTerm}
								onChange={(e) => handleSearch(e.target.value)}
							/>
						</InputGroup>
					</Col>
					<Col md='6' className='d-flex justify-content-end mt-2 mt-md-0'>
						<ButtonGroup className='mr-2'>
							<Button
								color={viewMode === 'grid' ? 'primary' : 'light'}
								size='sm'
								onClick={() => setViewMode('grid')}
							>
								<Grid size={16} />
							</Button>
							<Button
								color={viewMode === 'list' ? 'primary' : 'light'}
								size='sm'
								onClick={() => setViewMode('list')}
							>
								<List size={16} />
							</Button>
						</ButtonGroup>
						<Button color='light' size='sm'>
							<Filter size={16} className='mr-1' />
							Filter
						</Button>
					</Col>
				</Row>
			</div>

			{/* Category Pills */}
			<div className='category-pills mb-3'>
				<div className='d-flex flex-wrap gap-1'>
					{categories.map(category => (
						<Button
							key={category}
							color={(!selectedCategory && category === 'All Products') || selectedCategory === category ? 'primary' : 'light'}
							size='sm'
							className='mb-1'
							onClick={() => handleCategorySelect(category)}
						>
							{category === 'All Products' && <Package size={14} className='mr-1' />}
							{category}
							{category === 'All Products' && (
								<Badge color='light' className='ml-1'>{products.length}</Badge>
							)}
						</Button>
					))}
				</div>
			</div>

			{/* Products Display */}
			{loading ? (
				<div className='text-center py-5'>
					<Spinner color='primary' />
					<p className='mt-2'>Loading products...</p>
				</div>
			) : filteredProducts.length === 0 ? (
				<div className='text-center py-5'>
					<Package size={48} className='text-muted mb-2' />
					<p className='text-muted'>No products found</p>
				</div>
			) : viewMode === 'grid' ? (
				<Row>
					{filteredProducts.map(product => (
						<Col key={product.id} xs='6' sm='6' md='4' lg='3' xl='3' className='mb-3'>
							<ProductCard product={product} />
						</Col>
					))}
				</Row>
			) : (
				<div>
					{filteredProducts.map(product => (
						<ProductListItem key={product.id} product={product} />
					))}
				</div>
			)}

			{/* Results Count */}
			<div className='text-center mt-3'>
				<small className='text-muted'>
					Showing {filteredProducts.length} of {products.length} products
				</small>
			</div>
		</div>
	)
}

export default ProductGrid