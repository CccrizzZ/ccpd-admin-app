import React, { useContext, useState } from 'react'
import { AppContext } from '../App'
import axios from 'axios'
import {
  server,
  initCreateUser,
  deSpace,
  renderUserRoleOptions,
  initRetailRecord,
  renderMarketPlaceOptions,
  renderPaymentMethodOptions
} from '../utils/utils'
import { PaymentMethod, RetailRecord } from '../utils/Types'
import {
  Form,
  InputGroup,
  Modal
} from 'react-bootstrap'
import { Button } from '@tremor/react'

type CreateReturnRecordModalProps = {
  show: boolean
  handleClose: (refresh: boolean) => void,
}

const CreateReturnRecordModal: React.FC<CreateReturnRecordModalProps> = (props: CreateReturnRecordModalProps) => {
  const { setLoading, userInfo } = useContext(AppContext)
  const [newRecord, setNewRecord] = useState<RetailRecord>(initRetailRecord)

  const createReturnRecord = async () => {
    // null check on forms
    const fieldsEmpty = Object.values(newRecord).some((val) => { return (deSpace(val).length < 1) })
    if (fieldsEmpty) return alert('Please Complete The Form')

    // post record to server
    setLoading(true)
    await axios({
      method: 'post',
      url: server + '/adminController/createReturnRecord',
      responseType: 'text',
      data: newRecord,
      withCredentials: true
    }).then((res) => {
      if (res.status < 204) {
        alert('Return Record Created!')
        props.handleClose(true)
      } else {
        alert('Record Not Created: ' + res.status)
      }
    }).catch((err) => {
      alert('Create Retail Record Failed: ' + err.response.status)
    })
    setLoading(false)
    props.handleClose(true)
  }

  // search for sales record to create a return record
  const getSalesRecordByInvoice = async () => {

  }

  // setters
  const onSkuChange = (event: React.ChangeEvent<HTMLInputElement>) => setNewRecord({ ...newRecord, sku: Number(event.target.value) })
  const onAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewRecord({ ...newRecord, amount: Number(event.target.value) })
  }
  const onQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewRecord({ ...newRecord, quantity: Number(event.target.value) })
  }
  const onMarketPlaceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setNewRecord({ ...newRecord, marketplace: event.target.value })
  }
  const onPaymentMethodChange = (event: React.ChangeEvent<HTMLSelectElement>) => setNewRecord({ ...newRecord, paymentMethod: event.target.value as PaymentMethod })
  const onBuyerNameChange = (event: React.ChangeEvent<HTMLSelectElement>) => setNewRecord({ ...newRecord, buyerName: event.target.value })
  const onInvoiceNumberChange = (event: React.ChangeEvent<HTMLSelectElement>) => setNewRecord({ ...newRecord, buyerName: event.target.value })

  const renderSalesRecordCard = () => {
    return (
      <>

      </>
    )
  }

  return (
    <Modal
      show={props.show}
      onHide={() => props.handleClose(false)}
      aria-labelledby="contained-modal-title-vcenter"
      backdrop="static"
      keyboard={false}
      centered
    >
      <Modal.Header>
        <h4>🚩 Create Return Record</h4>
      </Modal.Header>
      {renderSalesRecordCard()}
      <Modal.Body>
        <InputGroup className="mb-3">
          <InputGroup.Text>SKU</InputGroup.Text>
          <Form.Control type="number" value={newRecord.sku} onChange={onSkuChange} />
        </InputGroup>
        <Button className='mb-3' color='emerald' onClick={getSalesRecordByInvoice}>Search</Button>
        <InputGroup className="mb-3">
          <InputGroup.Text>Quantity</InputGroup.Text>
          <Form.Control type="number" value={newRecord.quantity} onChange={onQuantityChange} />
        </InputGroup>
        <InputGroup className="mb-3">
          <InputGroup.Text>Sales Amount (CAD)</InputGroup.Text>
          <Form.Control type="number" step="0.1" value={newRecord.amount} onChange={onAmountChange} />
        </InputGroup>
        <InputGroup className="mb-3">
          <InputGroup.Text>Market Place</InputGroup.Text>
          <Form.Select value={newRecord.marketplace} onChange={onMarketPlaceChange}>
            {renderMarketPlaceOptions()}
          </Form.Select>
        </InputGroup>
        <InputGroup className="mb-3">
          <InputGroup.Text>Payment Method</InputGroup.Text>
          <Form.Select value={newRecord.paymentMethod} onChange={onMarketPlaceChange}>
            {renderPaymentMethodOptions()}
          </Form.Select>
        </InputGroup>
      </Modal.Body>
      <Modal.Footer>
        <div className='text-center'>
          <Button color='slate' onClick={() => props.handleClose(false)}>
            Cancel
          </Button>
          <Button className='ml-2' color='emerald' onClick={createReturnRecord}>Create</Button>
        </div>
      </Modal.Footer>
    </Modal>
  )
}

export default CreateReturnRecordModal
