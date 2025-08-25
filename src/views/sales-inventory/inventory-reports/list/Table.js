// ** React Imports
import { Fragment, useState, useEffect } from 'react'
import moment from 'moment'

// ** Columns
import { columns, summaryColumns } from './columns'
import SummaryCards from './SummaryCards'

// ** Store & Actions
import { getInventoryReport, getLowStockProducts, clearInventoryData } from '../store/action'
import { useDispatch, useSelector } from 'react-redux'

// ** Third Party Components
import Select from 'react-select'
import ReactPaginate from 'react-paginate'
import { ChevronDown, FileText, Download, AlertTriangle } from 'react-feather'
import DataTable from 'react-data-table-component'
import Flatpickr from 'react-flatpickr'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { selectThemeColors } from '@utils'
import {
	Card,
	CardHeader,
	CardTitle,
	CardBody,
	UncontrolledButtonDropdown,
	DropdownMenu,
	DropdownItem,
	DropdownToggle,
	Input,
	Row,
	Col,
	Label,
	CustomInput,
	Button,
	Badge,
	Alert,
	Spinner,
} from 'reactstrap'

// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

// ** Custom Header
const CustomHeader = ({ 
	handleFilter, 
	searchTerm, 
	handlePerPage, 
	rowsPerPage, 
	dateRange,
	setDateRange,
	category,
	setCategory,
	handleGenerateReport,
	handleExportPDF,
	handleExportCSV,
	loading,
	summary,
	showAll,
	setShowAll,
	stockStatusFilter,
	setStockStatusFilter
}) => {
	const categoryOptions = [
		{ value: '', label: 'All Categories' },
		{ value: 'shop', label: 'Shop' },
		{ value: 'store', label: 'Store' },
	]

	const statusOptions = [
		{ value: '', label: 'All Status' },
		{ value: 'out-of-stock', label: 'Out of Stock' },
		{ value: 'critical', label: 'Critical' },
		{ value: 'low', label: 'Low' },
		{ value: 'good', label: 'Good' },
	]

	return (
		<div className='invoice-list-table-header w-100 py-2'>
			<Row>
				<Col lg='2' sm='6' className='d-flex align-items-center mb-2'>
					<Label for='date-range' className='mr-1'>Date Range</Label>
					<Flatpickr
						id='date-range'
						className='form-control'
						value={dateRange}
						options={{
							mode: 'range',
							dateFormat: 'Y-m-d',
							defaultDate: [moment().subtract(30, 'days').toDate(), new Date()],
						}}
						onChange={(dates) => setDateRange(dates)}
					/>
				</Col>
				<Col lg='2' sm='4' className='mb-2'>
					<Select
						theme={selectThemeColors}
						className='react-select'
						classNamePrefix='select'
						placeholder='Category'
						options={categoryOptions}
						value={categoryOptions.find(opt => opt.value === category)}
						onChange={(data) => setCategory(data.value)}
						isClearable={false}
					/>
				</Col>
				<Col lg='2' sm='4' className='mb-2'>
					<Select
						theme={selectThemeColors}
						className='react-select'
						classNamePrefix='select'
						placeholder='Stock Status'
						options={statusOptions}
						value={statusOptions.find(opt => opt.value === stockStatusFilter)}
						onChange={(data) => setStockStatusFilter(data.value)}
						isClearable={false}
					/>
				</Col>
				<Col lg='1' sm='4' className='mb-2'>
					<CustomInput
						type='switch'
						id='show-all'
						label='Show All'
						checked={showAll}
						onChange={(e) => setShowAll(e.target.checked)}
					/>
				</Col>
				<Col lg='2' sm='6' className='mb-2'>
					<Button 
						color='primary' 
						block 
						onClick={handleGenerateReport}
						disabled={loading}
					>
						{loading ? (
							<>
								<Spinner size='sm' className='mr-1' />
								Generating...
							</>
						) : (
							<>
								<FileText size={14} className='mr-1' />
								Generate Report
							</>
						)}
					</Button>
				</Col>
				<Col lg='2' sm='6' className='mb-2'>
					<div className='d-flex align-items-center'>
						<Input
							id='search-invoice'
							className='w-100'
							type='text'
							value={searchTerm}
							onChange={e => handleFilter(e.target.value)}
							placeholder='Search product...'
						/>
					</div>
				</Col>
				<Col lg='1' sm='6' className='mb-2'>
					<UncontrolledButtonDropdown>
						<DropdownToggle color='secondary' caret outline>
							<Download size={14} className='mr-1' />
							Export
						</DropdownToggle>
						<DropdownMenu right>
							<DropdownItem onClick={handleExportPDF}>
								<FileText size={14} className='mr-1' />
								Export PDF
							</DropdownItem>
							<DropdownItem onClick={handleExportCSV}>
								<FileText size={14} className='mr-1' />
								Export CSV
							</DropdownItem>
						</DropdownMenu>
					</UncontrolledButtonDropdown>
				</Col>
			</Row>
		</div>
	)
}

const InventoryReportList = () => {
	// ** Store vars
	const dispatch = useDispatch()
	const store = useSelector((state) => state.inventoryReport)

	// ** States
	const [searchTerm, setSearchTerm] = useState('')
	const [currentPage, setCurrentPage] = useState(0)
	const [rowsPerPage, setRowsPerPage] = useState(10)
	const [dateRange, setDateRange] = useState([
		moment().subtract(30, 'days').toDate(),
		new Date(),
	])
	const [category, setCategory] = useState('')
	const [filteredData, setFilteredData] = useState([])
	const [showLowStock, setShowLowStock] = useState(false)
	const [showAll, setShowAll] = useState(false)
	const [stockStatusFilter, setStockStatusFilter] = useState('')

	// ** Get data on mount
	useEffect(() => {
		dispatch(getLowStockProducts())
		return () => {
			dispatch(clearInventoryData())
		}
	}, [dispatch])

	// ** Filter data
	useEffect(() => {
		if (store.inventoryData && store.inventoryData.length > 0) {
			const filtered = store.inventoryData.filter((item) => {
				const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
				const matchesLowStock = !showLowStock || item.stockStatus !== 'good'
				const matchesStatus = !stockStatusFilter || item.stockStatus === stockStatusFilter
				return matchesSearch && matchesLowStock && matchesStatus
			})
			setFilteredData(filtered)
		} else {
			setFilteredData([])
		}
	}, [searchTerm, store.inventoryData, showLowStock, stockStatusFilter])

	// ** Function to handle filter
	const handleFilter = (val) => {
		setSearchTerm(val)
	}

	// ** Function to handle Pagination
	const handlePagination = (page) => {
		setCurrentPage(page.selected)
	}

	// ** Function to handle per page
	const handlePerPage = (e) => {
		setRowsPerPage(parseInt(e.target.value))
		setCurrentPage(0)
	}

	// ** Generate Report
	const handleGenerateReport = () => {
		if (dateRange && dateRange.length === 2) {
			const params = {
				startDate: moment(dateRange[0]).format('YYYY-MM-DD'),
				endDate: moment(dateRange[1]).format('YYYY-MM-DD'),
				showAll,
				showInactive: showAll
			}
			if (category) {
				params.category = category
			}
			dispatch(getInventoryReport(params))
		}
	}

	// ** Export to PDF
	const handleExportPDF = () => {
		const doc = new jsPDF()
		
		// Add title
		doc.setFontSize(18)
		doc.text('Inventory Report', 14, 22)
		
		// Add date range
		doc.setFontSize(11)
		doc.text(
			`Period: ${moment(dateRange[0]).format('YYYY-MM-DD')} to ${moment(dateRange[1]).format('YYYY-MM-DD')}`,
			14,
			30
		)
		
		// Add summary
		if (store.summary) {
			doc.text(`Total Products: ${store.summary.totalProducts}`, 14, 38)
			doc.text(`Total Opening Value: ₦${store.summary.totalOpeningValue.toLocaleString()}`, 14, 46)
			doc.text(`Total Closing Value: ₦${store.summary.totalClosingValue.toLocaleString()}`, 14, 54)
		}
		
		// Add table
		const tableData = filteredData.map((item) => [
			item.name,
			item.openingStock,
			item.stockIn,
			item.stockOut,
			item.salesQty,
			item.closingStock,
			item.variance,
			`₦${item.closingValue.toLocaleString()}`,
		])
		
		doc.autoTable({
			head: [['Product', 'Opening', 'In', 'Out', 'Sales', 'Closing', 'Variance', 'Value']],
			body: tableData,
			startY: 62,
		})
		
		// Save the PDF
		doc.save(`inventory-report-${moment().format('YYYY-MM-DD')}.pdf`)
	}

	// ** Export to CSV
	const handleExportCSV = () => {
		const csvData = filteredData.map((item) => ({
			Product: item.name,
			Category: item.category,
			Unit: item.unit,
			'Opening Stock': item.openingStock,
			'Opening Value': item.openingValue,
			'Stock In': item.stockIn,
			'Stock In Value': item.stockInValue,
			'Stock Out': item.stockOut,
			'Stock Out Value': item.stockOutValue,
			'Sales Qty': item.salesQty,
			'Closing Stock': item.closingStock,
			'Closing Value': item.closingValue,
			Variance: item.variance,
			'Cost Price': item.costPrice,
			'Selling Price': item.sellingPrice,
		}))

		const headers = Object.keys(csvData[0]).join(',')
		const rows = csvData.map((row) => Object.values(row).join(','))
		const csv = [headers, ...rows].join('\n')

		const blob = new Blob([csv], { type: 'text/csv' })
		const url = window.URL.createObjectURL(blob)
		const a = document.createElement('a')
		a.href = url
		a.download = `inventory-report-${moment().format('YYYY-MM-DD')}.csv`
		a.click()
		window.URL.revokeObjectURL(url)
	}

	// ** Custom Pagination
	const CustomPagination = () => {
		const count = Math.ceil(filteredData.length / rowsPerPage)

		return (
			<ReactPaginate
				previousLabel={''}
				nextLabel={''}
				breakLabel='...'
				pageCount={count || 1}
				marginPagesDisplayed={2}
				pageRangeDisplayed={2}
				activeClassName='active'
				forcePage={currentPage}
				onPageChange={handlePagination}
				pageClassName={'page-item'}
				nextLinkClassName={'page-link'}
				nextClassName={'page-item next'}
				previousClassName={'page-item prev'}
				previousLinkClassName={'page-link'}
				pageLinkClassName={'page-link'}
				breakClassName='page-item'
				breakLinkClassName='page-link'
				containerClassName={'pagination react-paginate separated-pagination pagination-sm justify-content-end pr-1'}
			/>
		)
	}

	// ** Table data to render
	const dataToRender = () => {
		if (filteredData.length > 0) {
			const start = currentPage * rowsPerPage
			const end = start + rowsPerPage
			return filteredData.slice(start, end)
		}
		return []
	}

	return (
		<Fragment>
			{store.summary && <SummaryCards summary={store.summary} />}
			
			{store.lowStockProducts && store.lowStockProducts.length > 0 && (
				<Alert color='warning' className='mb-2'>
					<div className='alert-body'>
						<AlertTriangle size={14} className='mr-1' />
						<span className='font-weight-bold'>Low Stock Alert: </span>
						You have {store.criticalCount} products with critical stock levels and{' '}
						{store.totalCount - store.criticalCount} products with low stock.
						<Button
							color='warning'
							size='sm'
							className='ml-2'
							onClick={() => setShowLowStock(!showLowStock)}
						>
							{showLowStock ? 'Show All' : 'Show Low Stock Only'}
						</Button>
					</div>
				</Alert>
			)}
			
			<Card>
				<CardHeader>
					<CardTitle tag='h4'>Inventory Report</CardTitle>
				</CardHeader>
				<CardBody>
					<CustomHeader
						searchTerm={searchTerm}
						rowsPerPage={rowsPerPage}
						handleFilter={handleFilter}
						handlePerPage={handlePerPage}
						dateRange={dateRange}
						setDateRange={setDateRange}
						category={category}
						setCategory={setCategory}
						handleGenerateReport={handleGenerateReport}
						handleExportPDF={handleExportPDF}
						handleExportCSV={handleExportCSV}
						loading={store.loading}
						summary={store.summary}
						showAll={showAll}
						setShowAll={setShowAll}
						stockStatusFilter={stockStatusFilter}
						setStockStatusFilter={setStockStatusFilter}
					/>
					<DataTable
						noHeader
						pagination
						paginationServer
						columns={columns}
						responsive={true}
						data={dataToRender()}
						sortIcon={<ChevronDown />}
						className='react-dataTable'
						paginationComponent={CustomPagination}
						noDataComponent={
							<div className='p-5 text-center'>
								<FileText size={40} className='text-muted mb-2' />
								<h4>No inventory data available</h4>
								<p className='text-muted'>
									Please select a date range and click "Generate Report" to view inventory data.
								</p>
							</div>
						}
						progressPending={store.loading}
						progressComponent={
							<div className='p-5 text-center'>
								<Spinner color='primary' />
								<p className='mt-2'>Loading inventory data...</p>
							</div>
						}
					/>
				</CardBody>
			</Card>
		</Fragment>
	)
}

export default InventoryReportList