import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../App'
import axios from 'axios'
import {
  server,
  deSpace,
  initRetailRecord,
  // renderMarketPlaceOptions,
  renderPaymentMethodOptions,
  initReturnRecord,
  copyLink,
  // getConditionVariant,
  openLink,
  initInstockInventory
} from '../utils/utils'
import {
  InstockInventory,
  PaymentMethod,
  RetailRecord,
  ReturnRecord
} from '../utils/Types'
import {
  Form,
  InputGroup,
  Modal
} from 'react-bootstrap'
import {
  Badge,
  Bold,
  Button,
  Card,
  Col,
  Divider,
  Grid,
  List,
  ListItem,
  Metric,
  Subtitle,
  Text
} from '@tremor/react'

type CreateSalesRecordModalProps = {
  show: boolean
  handleClose: (refresh: boolean) => void,
}

const CreateReturnRecordModal: React.FC<CreateSalesRecordModalProps> = (props: CreateSalesRecordModalProps) => {
  const { setLoading, userInfo } = useContext(AppContext)
  const [newReturnRecord, setNewReturnRecord] = useState<ReturnRecord>(initReturnRecord)
  const [targetRetailRecord, setTargetRetailRecord] = useState<RetailRecord>(initRetailRecord)
  const [instockInventory] = useState<InstockInventory>(initInstockInventory)
  const [targetInvoiceNumber, setTargetInvoiceNumber] = useState<string>('')
  const [targetSku, setTargetSku] = useState<string>('')

  useEffect(() => {
    setNewReturnRecord({ ...newReturnRecord, adminName: userInfo.name })
  }, [])

  const searchRecord = async () => {

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

  const onRefundAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length + 1 > 8) return
    setNewReturnRecord({ ...newReturnRecord, refundAmount: Number(event.target.value) })
  }
  const onReturnQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length + 1 > 6) return
    setNewReturnRecord({ ...newReturnRecord, returnQuantity: Number(event.target.value) })
  }
  const onInvoiceNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length + 1 > 8) return
    setTargetInvoiceNumber(event.target.value)
  }
  const onSkuChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length + 1 > 8) return
    setTargetSku(event.target.value)
  }

  const onRefundMethodChange = (event: React.ChangeEvent<HTMLSelectElement>) => setNewReturnRecord({ ...newReturnRecord, refundMethod: event.target.value as PaymentMethod })
  const onReasonChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewReturnRecord({ ...newReturnRecord, reason: event.target.value })
  }
  const resetForm = () => {
    setNewReturnRecord(initReturnRecord)
    setTargetRetailRecord(initRetailRecord)
    setTargetInvoiceNumber('')
    setTargetSku('')
  }

  const renderRetailRecordDetails = () => {
    if (!targetRetailRecord.time || !instockInventory.time) return <Subtitle>Search Result Will Be Shown Here 👉</Subtitle>

    // todo: invoice have multiple sku
    return (
      <Grid className='gap-3' numItems={1}>
        <Col>
          <List className='pl-0'>
            <ListItem>
              <span>Invoice Number</span>
              <Badge color='slate'>{targetRetailRecord.invoiceNumber}</Badge>
            </ListItem>
            <ListItem>
              <span>Sales Admin</span>
              <span>{targetRetailRecord.adminName}</span>
            </ListItem>
            <ListItem>
              <span>Sales Admin</span>
              <span>{targetRetailRecord.adminName}</span>
            </ListItem>
            <ListItem>
              <span>Quantity Instock</span>
              <Badge color='emerald'>
                <Bold>
                  {
                    newReturnRecord.returnQuantity > 0 ?
                      `${instockInventory.quantityInstock} + ${newReturnRecord.returnQuantity} = ${instockInventory.quantityInstock + newReturnRecord.returnQuantity}` :
                      instockInventory.quantityInstock
                  }
                </Bold>
              </Badge>
            </ListItem>
            <ListItem>
              <span>Quantity Sold</span>
              <Badge color='rose'>
                <Bold>
                  {
                    newReturnRecord.returnQuantity > 0 ?
                      `${instockInventory.quantitySold} - ${newReturnRecord.returnQuantity} = ${instockInventory.quantitySold - newReturnRecord.returnQuantity}` :
                      instockInventory.quantitySold
                  }
                </Bold>
              </Badge>
            </ListItem>
          </List>
        </Col>
        <Col>
          <div className='border-solid border-2 border-slate-500 rounded p-2'>
            <Divider className='mt-0'>Comment</Divider>
            <Text>{instockInventory.comment}</Text>
            <Divider>Link</Divider>
            <div className='flex d-grid'>
              <Button color='gray' onClick={() => copyLink(instockInventory.url)}>Copy</Button>
              <Button color='emerald' onClick={() => openLink(instockInventory.url)}>Open</Button>
            </div>
          </div>
        </Col>
      </Grid>
    )
  }

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
              {renderRetailRecordDetails()}
            </Card>
          </Col>
          <Col>
            <InputGroup className="mb-3">
              <InputGroup.Text>Invoice Number</InputGroup.Text>
              <Form.Control type='text' value={targetInvoiceNumber} onChange={onInvoiceNumberChange} />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text>SKU (optional)</InputGroup.Text>
              <Form.Control type='text' value={targetSku} onChange={onSkuChange} />
            </InputGroup>
            <Button className='mb-3' color='rose' onClick={searchRecord}>Search</Button>
            <hr />
            <InputGroup className="mb-3">
              <InputGroup.Text>Return Quantity</InputGroup.Text>
              <Form.Control type='number' value={newReturnRecord.returnQuantity} onChange={onReturnQuantityChange} />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text>Return Amount</InputGroup.Text>
              <Form.Control type='number' step='any' value={newReturnRecord.refundAmount} onChange={onRefundAmountChange} />
              <InputGroup.Text>$CAD</InputGroup.Text>
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
            {/* footer */}
            <Card className="mx-auto" decoration="top" decorationColor="rose">
              <Grid numItems={3}>
                <Col>
                  <Text>Return Items Count</Text>
                  <Metric>{newReturnRecord.returnQuantity}</Metric>
                </Col>
                <Col>
                  <Text>Refund Item Price</Text>
                  <Metric>{(newReturnRecord.refundAmount).toFixed(2)}</Metric>
                </Col>
                <Col>
                  <Text>Total Refund In CAD</Text>
                  <Metric>${(newReturnRecord.returnQuantity * newReturnRecord.refundAmount).toFixed(2)}</Metric>
                </Col>
              </Grid>
            </Card>
          </Col>
        </Grid>
      </Modal.Body>
      <Modal.Footer>
        <div className='text-center flex gap-6'>
          <Button color='amber' onClick={resetForm}>Reset Form</Button>
          <Button color='slate' onClick={() => props.handleClose(false)}>Cancel</Button>
          <Button color='rose' onClick={createReturnRecord}>Create</Button>
        </div>
      </Modal.Footer>
    </Modal>
  )
}

export default CreateReturnRecordModal