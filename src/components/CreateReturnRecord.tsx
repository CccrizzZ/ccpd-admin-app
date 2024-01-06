import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../App'
import axios from 'axios'
import {
  server,
  deSpace,
  initRetailRecord,
  renderMarketPlaceOptions,
  renderPaymentMethodOptions,
  initReturnRecord
} from '../utils/utils'
import {
  PaymentMethod,
  RetailRecord,
  ReturnRecord
} from '../utils/Types'
import {
  Form,
  InputGroup,
  Modal
} from 'react-bootstrap'
import { Button, Card, Col, Grid } from '@tremor/react'

type CreateSalesRecordModalProps = {
  show: boolean
  handleClose: (refresh: boolean) => void,
}

const CreateReturnRecordModal: React.FC<CreateSalesRecordModalProps> = (props: CreateSalesRecordModalProps) => {
  const { setLoading, userInfo } = useContext(AppContext)
  const [newReturnRecord, setNewReturnRecord] = useState<ReturnRecord>(initReturnRecord)
  const [targetRetailRecord, setTargetRetailRecord] = useState<RetailRecord>(initRetailRecord)
  const [targetInvoiceNumber, setTargetInvoiceRecord] = useState<string>('')

  useEffect(() => {
    setNewReturnRecord({ ...newReturnRecord, adminName: userInfo.name })
  }, [])

  const searchRetailRecordByInvoice = async () => {

  }

  const createReturnRecord = async () => {
    // null check on forms
    const fieldsEmpty = Object.values(newReturnRecord).some((val) => { return (deSpace(val).length < 1) })
    if (fieldsEmpty) return alert('Please Complete The Form')

    // post record to server
    setLoading(true)
    await axios({
      method: 'post',
      url: server + '/adminController/createReturnRecord',
      responseType: 'text',
      data: newReturnRecord,
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

  const onRefundAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => setNewReturnRecord({ ...newReturnRecord, refundAmount: Number(event.target.value) })
  const onReturnQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewReturnRecord({ ...newReturnRecord, returnQuantity: Number(event.target.value) })
  }
  const onInvoiceNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length + 1 > 8) return
    setTargetInvoiceRecord((event.target.value))
  }
  const onRefundMethodChange = (event: React.ChangeEvent<HTMLSelectElement>) => setNewReturnRecord({ ...newReturnRecord, refundMethod: event.target.value as PaymentMethod })
  const onReasonChange = (event: React.ChangeEvent<HTMLInputElement>) => setNewReturnRecord({ ...newReturnRecord, reason: event.target.value })

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
        <h4>🚩 Create Return Record</h4>
      </Modal.Header>
      <Modal.Body>
        <Grid className='gap-6' numItems={2}>
          <Col>
            <Card className='h-full'>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Incidunt culpa quas ut? Nostrum culpa animi consequuntur possimus dolorum quisquam recusandae libero corporis inventore. Quos eius dicta, temporibus doloremque quae dolor!
            </Card>
          </Col>
          <Col>
            <InputGroup className="mb-3">
              <InputGroup.Text>Invoice Number</InputGroup.Text>
              <Form.Control type='text' value={targetInvoiceNumber} onChange={onInvoiceNumberChange} />
            </InputGroup>
            <Button className='mb-3' color='rose' onClick={searchRetailRecordByInvoice}>Search</Button>
            <hr />
            <InputGroup className="mb-3">
              <InputGroup.Text>Return Quantity</InputGroup.Text>
              <Form.Control type='number' value={newReturnRecord.returnQuantity} onChange={onReturnQuantityChange} />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text>Return Amount</InputGroup.Text>
              <Form.Control type='number' step='any' value={newReturnRecord.refundAmount} onChange={onRefundAmountChange} />
              <InputGroup.Text>CAD $</InputGroup.Text>
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text>Refund Method</InputGroup.Text>
              <Form.Select value={newReturnRecord.refundMethod} onChange={onRefundMethodChange}>
                {renderPaymentMethodOptions()}
              </Form.Select>
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text>Reason</InputGroup.Text>
              <Form.Control type='text' as='textarea' className='resize-none' value={newReturnRecord.reason} onChange={onReasonChange} />
            </InputGroup>
          </Col>
        </Grid>
      </Modal.Body>
      <Modal.Footer>
        <div className='text-center'>
          <Button color='slate' onClick={() => props.handleClose(false)}>
            Cancel
          </Button>
          <Button className='ml-2' color='rose' onClick={createReturnRecord}>Create</Button>
        </div>
      </Modal.Footer>
    </Modal>
  )
}

export default CreateReturnRecordModal