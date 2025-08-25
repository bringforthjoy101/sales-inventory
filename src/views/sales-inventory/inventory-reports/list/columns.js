import { Badge } from 'reactstrap'

// ** Renders Product Name
const renderProduct = (row) => {
	return (
		<div>
			<span className='font-weight-bold'>{row.name}</span>
			<br />
			<small className='text-muted'>
				{row.unit} | {row.category === 'shop' ? 'Shop' : 'Store'}
			</small>
		</div>
	)
}

// ** Renders Stock Status
const renderStockStatus = (row) => {
	const statusMap = {
		'out-of-stock': { color: 'danger', text: 'Out of Stock' },
		critical: { color: 'danger', text: 'Critical' },
		low: { color: 'warning', text: 'Low' },
		good: { color: 'success', text: 'Good' }
	}
	
	const status = statusMap[row.stockStatus] || { color: 'secondary', text: 'Unknown' }
	
	return <Badge color={status.color} pill>{status.text}</Badge>
}

// ** Renders Variance
const renderVariance = (row) => {
	if (row.variance === 0) {
		return <span className='text-success'>0</span>
	} else if (row.variance > 0) {
		return <span className='text-success'>+{row.variance}</span>
	} else {
		return <span className='text-danger'>{row.variance}</span>
	}
}

// ** Format Currency
const formatCurrency = (value) => {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'NGN',
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(value)
}

export const columns = [
	{
		name: 'Product',
		sortable: true,
		minWidth: '200px',
		selector: 'name',
		cell: (row) => renderProduct(row),
	},
	{
		name: 'Opening Stock',
		sortable: true,
		minWidth: '120px',
		selector: 'openingStock',
		cell: (row) => (
			<div>
				<div>{row.openingStock}</div>
				<small className='text-muted'>{formatCurrency(row.openingValue)}</small>
			</div>
		),
	},
	{
		name: 'Stock In',
		sortable: true,
		minWidth: '100px',
		selector: 'stockIn',
		cell: (row) => (
			<div>
				<div className='text-success'>{row.stockIn > 0 ? `+${row.stockIn}` : 0}</div>
				<small className='text-muted'>{formatCurrency(row.stockInValue)}</small>
			</div>
		),
	},
	{
		name: 'Stock Out',
		sortable: true,
		minWidth: '100px',
		selector: 'stockOut',
		cell: (row) => (
			<div>
				<div className='text-danger'>{row.stockOut > 0 ? `-${row.stockOut}` : 0}</div>
				<small className='text-muted'>{formatCurrency(row.stockOutValue)}</small>
			</div>
		),
	},
	{
		name: 'Sales',
		sortable: true,
		minWidth: '80px',
		selector: 'salesQty',
		cell: (row) => row.salesQty || 0,
	},
	{
		name: 'Closing Stock',
		sortable: true,
		minWidth: '120px',
		selector: 'closingStock',
		cell: (row) => (
			<div>
				<div className='font-weight-bold'>{row.closingStock}</div>
				<small className='text-muted'>{formatCurrency(row.closingValue)}</small>
			</div>
		),
	},
	{
		name: 'Variance',
		sortable: true,
		minWidth: '80px',
		selector: 'variance',
		cell: (row) => renderVariance(row),
	},
	{
		name: 'Status',
		sortable: true,
		minWidth: '100px',
		selector: 'stockStatus',
		cell: (row) => renderStockStatus(row),
	},
	{
		name: 'Profit Margin',
		sortable: true,
		minWidth: '100px',
		selector: 'profitMargin',
		cell: (row) => (
			<div>
				{row.profitMargin > 0 ? (
					<Badge color='light-success'>{row.profitMargin}%</Badge>
				) : (
					<Badge color='light-secondary'>N/A</Badge>
				)}
			</div>
		),
	},
	{
		name: 'Turnover Rate',
		sortable: true,
		minWidth: '110px',
		selector: 'stockTurnoverRate',
		cell: (row) => (
			<div>
				{row.stockTurnoverRate !== 'N/A' ? (
					<span>{row.stockTurnoverRate}x</span>
				) : (
					<span className='text-muted'>N/A</span>
				)}
			</div>
		),
	},
	{
		name: 'Reorder Point',
		sortable: true,
		minWidth: '110px',
		selector: 'reorderPoint',
		cell: (row) => (
			<div>
				<span>{row.reorderPoint}</span>
				{row.needsReorder && (
					<Badge color='warning' className='ml-1'>Reorder</Badge>
				)}
			</div>
		),
	},
]

export const summaryColumns = [
	{
		name: 'Metric',
		minWidth: '200px',
		selector: 'metric',
		cell: (row) => <span className='font-weight-bold'>{row.metric}</span>,
	},
	{
		name: 'Value',
		minWidth: '150px',
		selector: 'value',
		cell: (row) => row.value,
	},
]