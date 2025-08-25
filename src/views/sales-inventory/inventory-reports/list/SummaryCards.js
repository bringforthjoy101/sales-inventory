import { Card, CardBody, Row, Col } from 'reactstrap'
import { Package, TrendingUp, AlertTriangle, DollarSign, ShoppingCart, RotateCw, AlertCircle, CheckCircle } from 'react-feather'

const SummaryCards = ({ summary }) => {
	if (!summary) return null

	const cards = [
		{
			title: 'Total Products',
			value: summary.totalProducts,
			subtitle: `${summary.activeProducts} active | ${summary.displayedProducts} shown`,
			icon: Package,
			color: 'primary'
		},
		{
			title: 'Total Value',
			value: `₦${summary.totalClosingValue.toLocaleString()}`,
			subtitle: 'Current inventory value',
			icon: DollarSign,
			color: 'success'
		},
		{
			title: 'Stock Status',
			value: summary.outOfStockCount,
			subtitle: `${summary.criticalStockCount} critical | ${summary.lowStockCount} low`,
			icon: AlertTriangle,
			color: summary.outOfStockCount > 0 ? 'danger' : 'warning'
		},
		{
			title: 'Needs Reorder',
			value: summary.needsReorderCount,
			subtitle: 'Products below reorder point',
			icon: RotateCw,
			color: 'warning'
		},
		{
			title: 'Stock Movement',
			value: `₦${summary.totalStockInValue.toLocaleString()}`,
			subtitle: `In: ₦${summary.totalStockInValue.toLocaleString()} | Out: ₦${summary.totalStockOutValue.toLocaleString()}`,
			icon: TrendingUp,
			color: 'info'
		},
		{
			title: 'Variance',
			value: summary.totalVariance,
			subtitle: summary.totalVariance !== 0 ? 'Discrepancy found' : 'No discrepancy',
			icon: summary.totalVariance !== 0 ? AlertCircle : CheckCircle,
			color: summary.totalVariance !== 0 ? 'danger' : 'success'
		}
	]

	return (
		<Row className='mb-2'>
			{cards.map((card, index) => (
				<Col xl='2' md='4' sm='6' key={index}>
					<Card className='mb-1'>
						<CardBody className='p-2'>
							<div className='d-flex justify-content-between align-items-center'>
								<div>
									<h6 className='mb-1 text-muted'>{card.title}</h6>
									<h3 className={`mb-0 text-${card.color}`}>{card.value}</h3>
									<small className='text-muted'>{card.subtitle}</small>
								</div>
								<div className={`avatar avatar-stats p-50 bg-light-${card.color}`}>
									<div className='avatar-content'>
										<card.icon size={21} className={`text-${card.color}`} />
									</div>
								</div>
							</div>
						</CardBody>
					</Card>
				</Col>
			))}
		</Row>
	)
}

export default SummaryCards