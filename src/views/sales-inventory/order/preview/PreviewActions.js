// ** React Imports
import { Link } from 'react-router-dom'
import { useState } from 'react'

// ** Third Party Components
import { Card, CardBody, Button, Modal, ModalHeader, ModalBody, ModalFooter, Spinner, Label, Form } from 'reactstrap'
import UpdateStatus from './UpdateStatus'
import { swal, apiRequest, selectThemeColors } from '@utils'
import { useDispatch } from 'react-redux'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import moment from 'moment/moment'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { getOrder, completeOrder, nullifyOrder } from '../store/action'
import Select from 'react-select'

const PreviewActions = ({ id, data }) => {
	const dispatch = useDispatch()
  const MySwal = withReactContent(Swal)
  const [paymentModal, setPaymentModal] = useState(false)
  const [selectedPaymentMode, setSelectedPaymentMode] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const togglePaymentModal = () => {
    setPaymentModal(!paymentModal)
    if (!paymentModal) {
      setSelectedPaymentMode(null)
    }
  }

  const paymentModeOptions = [
    { value: 'cash', label: 'Cash' },
    { value: 'transfer', label: 'Transfer' },
    { value: 'pos', label: 'POS' },
    { value: 'dynamic', label: 'Dynamic' }
  ]

  const handlePaymentSubmit = async (e) => {
    e.preventDefault()
    if (!selectedPaymentMode) {
      swal('Oops!', 'Please select a payment mode', 'error')
      return
    }

    setIsSubmitting(true)
    try {
      const completed = await dispatch(completeOrder(data.id, selectedPaymentMode.value))
      if (completed) {
        await dispatch(getOrder(id))
        MySwal.fire({
          icon: 'success',
          title: 'Completed!',
          text: 'Order has been completed.',
          customClass: {
            confirmButton: 'btn btn-primary'
          }
        })
        togglePaymentModal()
      }
    } catch (error) {
      console.error(error)
      swal('Oops!', 'Something went wrong while completing the order', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

	const handleNullifyOrder = async (id) => {
        return MySwal.fire({
          title: 'Are you sure?',
          text: "This action will cancelled this order!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, cancel it!',
          customClass: {
            confirmButton: 'btn btn-danger',
            cancelButton: 'btn btn-outline-danger ml-1'
          },
          buttonsStyling: false
        }).then(async function (result) {
          if (result.value) {
            const nullified = await dispatch(nullifyOrder(id))
            if (nullified) {
              await dispatch(getOrder(id))
                MySwal.fire({
                    icon: 'success',
                    title: 'Cancelled!',
                    text: 'Order has been cancelled.',
                    customClass: {
                      confirmButton: 'btn btn-primary'
                    }
                  })
            //   history.push(`/products/list`)
            }
            
          }
        })
  	}

    const handleDownloadOrder = () => {
      // Fetch order details based on orderId
      // const orderDetails = data.find(order => order.id === orderId)
  
      // Create a new jsPDF instance
      const doc = new jsPDF()
      doc.setFontSize(24);
		  doc.setTextColor("blue");
      doc.text("THE CIRCLE LOUNGE Sales.", 14, 20);
  
      // Add title
      doc.setFontSize(12);
      doc.text(`Order Details - ${data.orderNumber}`, 14, 30)
  
      // Add order details
      doc.text(`Date: ${moment(data.createdAt).format('LLL')}`, 14, 38)
      doc.text(`Customer: ${data.customer.fullName} - ${data.customer.phone}`, 14, 46)
      doc.text(`Location: ${data.location}`, 14, 54)
      doc.text(`Payment Mode: ${data.paymentMode}`, 14, 62)
      doc.text(`Order Status: ${data.status}`, 14, 70)
  
      // Add order products table
      doc.autoTable({
        startY: 78,
        head: [['Product', 'Qty', 'Price', 'Total']],
        body: data.products.map(product => [product.name, product.qty, `${product.price.toLocaleString('en-US', { style: 'currency', currency: 'NGN' })}`, `${product.amount.toLocaleString('en-US', { style: 'currency', currency: 'NGN' })}`])
      })
  
      // Add total
      const rightAlign = (text, y) => {
        const pageWidth = doc.internal.pageSize.width;
        const textWidth = doc.getTextWidth(text);
        doc.text(text, pageWidth - textWidth - 14, y);
      };

      rightAlign(`Sub Total: ${data.subTotal.toLocaleString('en-US', { style: 'currency', currency: 'NGN' })}`, doc.autoTable.previous.finalY + 10);
      rightAlign(`Logistics: ${data.logistics.toLocaleString('en-US', { style: 'currency', currency: 'NGN' })}`, doc.autoTable.previous.finalY + 20);
      rightAlign(`Discount: ${data.discount.toLocaleString('en-US', { style: 'currency', currency: 'NGN' })}`, doc.autoTable.previous.finalY + 30);
      doc.setFont(undefined, 'bold');
      rightAlign(`Total: ${data.amount.toLocaleString('en-US', { style: 'currency', currency: 'NGN' })}`, doc.autoTable.previous.finalY + 40);
      doc.setFont(undefined, 'normal'); // Reset to normal font
  
      // Save the PDF
      doc.save(`order-${data.orderNumber}.pdf`)
    }
	return (
		<Card className="invoice-action-wrapper">
			<CardBody>
				{/* <Button.Ripple color='primary' block className='mb-75' onClick={() => setSendSidebarOpen(true)}>
          Send Invoice
        </Button.Ripple> */}

				<Button.Ripple className="mb-75" color='success' onClick={togglePaymentModal} block disabled={data.status !== 'processing'}>
					Complete Order
				</Button.Ripple>
				<Button.Ripple className='mb-75' color='danger' outline onClick={() => handleNullifyOrder(data.id)} block disabled={data.status !== 'processing'}>
					Cancel Order
				</Button.Ripple>
        <Button.Ripple className='mb-75' color="success" onClick={() => handleDownloadOrder()} block outline>
					Download
				</Button.Ripple>
				<Button.Ripple color="secondary" tag={Link} to={`/order/print/${id}`} block outline className="mb-75">
					Print
				</Button.Ripple>
				
				{/* <UpdateStatus /> */}
				{/* <Button.Ripple tag={Link} to={`/apps/invoice/edit/${id}`} color='secondary' block outline className='mb-75'>
          Edit
        </Button.Ripple>
        <Button.Ripple color='success' block onClick={() => setAddPaymentOpen(true)}>
          Add Payment
        </Button.Ripple> */}

        {/* Payment Mode Selection Modal */}
        <Modal isOpen={paymentModal} toggle={togglePaymentModal} className="modal-dialog-centered" modalClassName="modal-info">
          <ModalHeader toggle={togglePaymentModal}>Select Payment Mode</ModalHeader>
          <Form onSubmit={handlePaymentSubmit}>
            <ModalBody>
              <div className="mb-1">
                <Label className="form-label" for="paymentMode">
                  Payment Mode
                </Label>
                <Select
                  id="paymentMode"
                  name="paymentMode"
                  theme={selectThemeColors}
                  className="react-select"
                  classNamePrefix="select"
                  options={paymentModeOptions}
                  value={selectedPaymentMode}
                  onChange={setSelectedPaymentMode}
                  isClearable={false}
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onClick={togglePaymentModal} outline>
                Cancel
              </Button>
              <Button color="primary" type="submit" disabled={isSubmitting}>
                {isSubmitting && <Spinner color="white" size="sm" className="mr-1" />}
                Complete Order
              </Button>
            </ModalFooter>
          </Form>
        </Modal>
			</CardBody>
		</Card>
	)
}

export default PreviewActions
