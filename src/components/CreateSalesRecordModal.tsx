import React, { useContext, useState } from 'react'
import { AppContext } from '../App'
import axios from 'axios'
import {
  server,
  deSpace,
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
import {
  Button,
  Card,
  Col,
  Grid
} from '@tremor/react'

type CreateSalesRecordModalProps = {
  show: boolean
  handleClose: (refresh: boolean) => void,
}

const CreateSalesRecordModal: React.FC<CreateSalesRecordModalProps> = (props: CreateSalesRecordModalProps) => {
  const { setLoading, userInfo } = useContext(AppContext)
  const [newRecord, setNewRecord] = useState<RetailRecord>(initRetailRecord)

  // create a single retail record
  const createRetailRecord = async () => {
    // null check on forms
    const fieldsEmpty = Object.values(newRecord).some((val) => { return (deSpace(val).length < 1) })
    if (fieldsEmpty) return alert('Please Complete The Form')

    // post record to server
    setLoading(true)
    await axios({
      method: 'post',
      url: server + '/adminController/createSalesRecord',
      responseType: 'text',
      data: newRecord,
      withCredentials: true
    }).then((res) => {
      if (res.status < 230) {
        alert('Retail Record Created!')
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

  const getInstockBySku = async () => {

  }

  const renderInventoryInfoCard = () => {
    return (
      <>

      </>
    )
  }

  // setters
  const onSkuChange = (event: React.ChangeEvent<HTMLInputElement>) => setNewRecord({ ...newRecord, sku: Number(event.target.value) })
  const onAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => setNewRecord({ ...newRecord, amount: Number(event.target.value) })
  const onQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewRecord({ ...newRecord, quantity: Number(event.target.value) })
  }
  const onMarketPlaceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setNewRecord({ ...newRecord, marketplace: event.target.value })
  }
  const onPaymentMethodChange = (event: React.ChangeEvent<HTMLSelectElement>) => setNewRecord({ ...newRecord, paymentMethod: event.target.value as PaymentMethod })
  const onBuyerNameChange = (event: React.ChangeEvent<HTMLSelectElement>) => setNewRecord({ ...newRecord, buyerName: event.target.value })
  const onInvoiceNumberChange = (event: React.ChangeEvent<HTMLSelectElement>) => setNewRecord({ ...newRecord, buyerName: event.target.value })

  return (
    <Modal
      show={props.show}
      onHide={() => props.handleClose(false)}
      aria-labelledby="contained-modal-title-vcenter"
      backdrop="static"
      size='xl'
      keyboard={false}
      centered
    >
      <Modal.Header>
        <h4>💵 Create Sales Record</h4>
      </Modal.Header>
      {renderInventoryInfoCard()}
      <Modal.Body>
        <Grid className='gap-6' numItems={2}>
          <Col>
            <InputGroup className="mb-3">
              <InputGroup.Text>SKU</InputGroup.Text>
              <Form.Control value={newRecord.sku} onChange={onSkuChange} />
            </InputGroup>
            <Button className='mb-3' color='emerald' onClick={getInstockBySku}>Search</Button>
            <InputGroup className="mb-3">
              <InputGroup.Text>Quantity</InputGroup.Text>
              <Form.Control value={newRecord.quantity} onChange={onQuantityChange} />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text>Sales Amount</InputGroup.Text>
              <Form.Control type='number' step='any' value={newRecord.amount} onChange={onAmountChange} />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text>Market Place</InputGroup.Text>
              <Form.Select value={newRecord.marketplace} onChange={onMarketPlaceChange}>
                {renderMarketPlaceOptions()}
              </Form.Select>
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text>Payment Method</InputGroup.Text>
              <Form.Select value={newRecord.paymentMethod} onChange={onPaymentMethodChange}>
                {renderPaymentMethodOptions()}
              </Form.Select>
            </InputGroup>
          </Col>
          <Col>
            <Card className='h-full'>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus ipsa ad beatae minus vero pariatur impedit. Mollitia, maiores repellat neque doloremque reprehenderit eligendi in, sunt error quo suscipit ipsa repudiandae?
            </Card>
          </Col>
        </Grid>
      </Modal.Body>
      <Modal.Footer>
        <div className='text-center'>
          <Button color='slate' onClick={() => props.handleClose(false)}>
            Cancel
          </Button>
          <Button className='ml-2' color='emerald' onClick={createRetailRecord}>Create</Button>
        </div>
      </Modal.Footer>
    </Modal>
  )
}

export default CreateSalesRecordModal
