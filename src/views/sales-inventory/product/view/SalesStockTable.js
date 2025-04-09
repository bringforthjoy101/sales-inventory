// ** React Imports
import { useState } from 'react'
import { Link } from 'react-router-dom'

// ** Third Party Components
import { Badge, Row, Col, Label, CustomInput, UncontrolledTooltip } from 'reactstrap'
import { ChevronDown, Eye } from 'react-feather'
import DataTable from 'react-data-table-component'
import ReactPaginate from 'react-paginate'
import moment from 'moment'

const statusColors = {
  active: 'light-success',
  pending: 'light-warning',
  inactive: 'light-secondary',
  suspended: 'light-danger'
}

const SalesStockTable = ({ stockData }) => {
  // ** States
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  // ** Get total pages count
  const count = Number((stockData?.length / rowsPerPage).toFixed(0))

  // ** Function to handle Pagination
  const handlePagination = page => {
    setCurrentPage(page.selected + 1)
  }

  // ** Function to handle per page
  const handlePerPage = e => {
    setRowsPerPage(parseInt(e.target.value))
    setCurrentPage(1)
  }

  // ** Custom Pagination
  const CustomPagination = () => (
    <Row>
      <Col sm='6'>
        <Label for='sort-select'>Show</Label>
        <CustomInput
          className='form-control mx-50 w-50'
          type='select'
          id='rows-per-page'
          value={rowsPerPage}
          onChange={handlePerPage}
        >
          <option value='10'>10</option>
          <option value='25'>25</option>
          <option value='50'>50</option>
        </CustomInput>
      </Col>
      <Col sm='6'>
        <ReactPaginate
          previousLabel={''}
          nextLabel={''}
          pageCount={count || 1}
          activeClassName='active'
          forcePage={currentPage !== 0 ? currentPage - 1 : 0}
          onPageChange={page => handlePagination(page)}
          pageClassName={'page-item'}
          nextLinkClassName={'page-link'}
          nextClassName={'page-item next'}
          previousClassName={'page-item prev'}
          previousLinkClassName={'page-link'}
          pageLinkClassName={'page-link'}
          containerClassName={'pagination react-paginate justify-content-end my-2 pr-1'}
        />
      </Col>
    </Row>
  )

  // ** Table Columns
  const columns = [
    {
      name: 'ID',
      minWidth: '100px',
      selector: 'id',
      cell: (row) => <span>{`#${row.id}`}</span>,
    },
    {
      name: 'Qty',
      selector: 'qty',
      sortable: true,
      minWidth: '100px',
      cell: (row) => <span>{(row.qty || 0).toLocaleString()}</span>,
    },
    {
      name: 'Type ',
      minWidth: '100px',
      selector: 'type',
      sortable: true,
      cell: (row) => <span>{row.type}</span>,
    },
    {
      name: 'Department ',
      minWidth: '100px',
      selector: 'department',
      sortable: true,
      cell: (row) => <span>{row.department || '--'}</span>,
    },
    {
      name: 'New Qty',
      selector: 'newQty',
      sortable: true,
      minWidth: '100px',
      cell: (row) => <span>{(row.newQty || 0).toLocaleString()}</span>,
    },
    {
      name: 'Description',
      selector: 'description',
      sortable: true,
      minWidth: '200px',
      cell: (row) => <span>{row.description || '--'}</span>,
    },
    {
      name: 'Date',
      selector: 'createdAt',
      sortable: true,
      minWidth: '100px',
      cell: (row) => moment(row.createdAt).format('lll'),
    },
    {
      name: 'Initiated By',
      minWidth: '200px',
      selector: 'admin',
      sortable: true,
      cell: (row) => <span className="font-weight-bold">{row.admin.firstName} {row.admin.lastName}</span>,
    },
  ]

  // ** Get current items based on pagination
  const getCurrentItems = () => {
    const start = (currentPage - 1) * rowsPerPage
    const end = start + rowsPerPage
    return stockData?.slice(start, end) || []
  }

  return (
    <div className='react-dataTable'>
      <DataTable
        noHeader
        pagination
        columns={columns}
        paginationPerPage={rowsPerPage}
        className='react-dataTable'
        sortIcon={<ChevronDown size={10} />}
        paginationDefaultPage={currentPage}
        paginationComponent={CustomPagination}
        data={getCurrentItems()}
      />
    </div>
  )
}

export default SalesStockTable 