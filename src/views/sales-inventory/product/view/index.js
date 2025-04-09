// ** React Imports
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'

// ** Store & Actions
import { getProduct } from '../store/action'
import { useSelector, useDispatch } from 'react-redux'

// ** Reactstrap
import { Row, Col, Card, CardBody, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap'

// ** User View Components
import UserInfoCard from './UserInfoCard'
import PlanCard from './PlanCard'
import { isUserLoggedIn, apiRequest, swal } from '@utils'
import InventoryHistories from './InventoryHistories'
import classnames from 'classnames'
import SpinnerComponent from '@src/@core/components/spinner/Loading-spinner'
import StoreStockTable from './StoreStockTable'
import SalesStockTable from './SalesStockTable'


// ** Styles
import '@styles/react/apps/app-users.scss'

const ProductView = props => {
  // ** Vars
  const store = useSelector(state => state.products),
    dispatch = useDispatch(),
    { id } = useParams()

  const [userData, setUserData] = useState(null)
  const [detail, setDetail] = useState(null)

  // const [loading, setLoading] = useState(true)
  const [active, setActive] = useState('1')

  const toggle = tab => {
    if (active !== tab) {
      setActive(tab)
    }
  }

  // ** Get user on mount
  useEffect(() => {
    dispatch(getProduct(id))
  }, [dispatch])


  useEffect(() => {
    if (isUserLoggedIn() !== null) {
      setUserData(JSON.parse(localStorage.getItem('userData')))
    }
  }, [])

  // if (loading) {
  //   return (
  //     <div className='d-flex justify-content-center align-items-center' style={{ minHeight: '70vh' }}>
  //       <SpinnerComponent />
  //     </div>
  //   )
  // }


  return store.selectedProduct !== null && store.selectedProduct !== undefined ? (
    <div className='app-user-view'>
      <Row>
        <Col xl='9' lg='9' md='12'>
          <UserInfoCard selectedProduct={store.selectedProduct} detail={detail} />
        </Col>
        <Col xl="3" lg="3" md="12">
					<PlanCard selectedInventory={store.selectedProduct} detail={detail} />
				</Col>
      </Row>
      <Row>
				{/* <Col sm="12">
					<InventoryHistories inventoryHistories={store.selectedProduct.productStockHistories.sort((a, b) => b.id - a.id)} product={store.selectedProduct} />
				</Col> */}
        <Col sm='12'>
          <Card>
            <CardBody>
              <Nav tabs>
                <NavItem>
                  <NavLink
                    className={classnames({ active: active === '1' })}
                    onClick={() => toggle('1')}
                  >
                    <span className='align-middle'>Store Stock</span>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({ active: active === '2' })}
                    onClick={() => toggle('2')}
                  >
                    <span className='align-middle'>Sales Stock</span>
                  </NavLink>
                </NavItem>
              </Nav>
              <TabContent className='py-50' activeTab={active}>
                <TabPane tabId='1'>
                  <StoreStockTable stockData={store.selectedProduct.productStockHistories.filter(item => item.category === 'STORE').sort((a, b) => b.id - a.id)} />
                </TabPane>
                <TabPane tabId='2'>
                  <SalesStockTable stockData={store.selectedProduct.productStockHistories.filter(item => item.category === 'SALES').sort((a, b) => b.id - a.id)} />
                </TabPane>
              </TabContent>
            </CardBody>
          </Card>
        </Col>
			</Row>
    </div>
  ) : <SpinnerComponent />
}
export default ProductView
