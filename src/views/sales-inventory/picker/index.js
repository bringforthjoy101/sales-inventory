import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Row, Col } from 'reactstrap'
import OrderSidebar from './OrderSidebar'
import ProductGrid from './ProductGrid'
import { getProducts, initializeOrder } from './store/action'
import './picker.scss'

const Picker = () => {
	const dispatch = useDispatch()

	// Initialize on mount
	useEffect(() => {
		// Load products
		dispatch(getProducts())
		
		// Initialize order from local storage
		dispatch(initializeOrder())
	}, [dispatch])

	return (
		<div className='picker-page'>
			<Row className='match-height'>
				<Col xl='3' lg='4' md='5' sm='12' className='order-sidebar-col'>
					<OrderSidebar />
				</Col>
				<Col xl='9' lg='8' md='7' sm='12' className='product-grid-col'>
					<ProductGrid />
				</Col>
			</Row>
		</div>
	)
}

export default Picker