import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../App'
import axios, { AxiosError, AxiosResponse } from 'axios'
import {
  server,
  deSpace,
  initRetailRecord,
  renderMarketPlaceOptions,
  renderPaymentMethodOptions,
  initInstockInventory,
  getConditionVariant,
  copyLink,
  openLink
} from '../utils/utils'
import {
  // Condition,
  InstockInventory,
  PaymentMethod,
  // Platform,
  RetailRecord
} from '../utils/Types'
import {
  Form,
  InputGroup,
  Modal
} from 'react-bootstrap'
import {
  Badge,
  Button,
  Card,
  Col,
  Divider,
  Grid,
  List,
  ListItem,
  Subtitle,
  Title,
  Text,
  Bold,
  Metric
} from '@tremor/react'

type CreateSalesRecordModalProps = {
  show: boolean
  handleClose: (refresh: boolean) => void,
}

const CreateSalesRecordModal: React.FC<CreateSalesRecordModalProps> = (props: CreateSalesRecordModalProps) => {
  const { setLoading, userInfo } = useContext(AppContext)
  const [newSalesRecord, setNewSalesRecord] = useState<RetailRecord>({ ...initRetailRecord, adminName: userInfo.name ?? '' })
  const [targetSku, setTargetSku] = useState<string>('')
  const [targetInventoryRecord, setTargetInventoryRecord] = useState<InstockInventory>(initInstockInventory)

  useEffect(() => {
    setNewSalesRecord({ ...newSalesRecord, adminName: userInfo.name })
    console.log(targetSku)
  }, [])

  // create a single retail record
  const createRetailRecord = async () => {
    // null check on forms
    const fieldsEmpty = Object.values(newSalesRecord).some((val) => { return (deSpace(val).length < 1) })
    if (fieldsEmpty) return alert('Please Complete The Form')

    // post record to server
    setLoading(true)
    await axios({
      method: 'post',
      url: server + '/adminController/createSalesRecord',
      responseType: 'text',
      data: newSalesRecord,
      withCredentials: true
    }).then((res: AxiosResponse) => {
      if (res.status < 230) {
        alert('Retail Record Created!')
        props.handleClose(true)
      } else {
        alert('Record Not Created: ' + res.status)
      }
    }).catch((err: AxiosError) => {
      alert('Create Retail Record Failed: ' + err.message)
    })
    setLoading(false)
    props.handleClose(true)
  }

  const getInstockBySku = async () => {

  }

  // setters
  const onSkuChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length + 1 > 8) return
    setNewSalesRecord({ ...newSalesRecord, sku: Number(event.target.value) })
  }
  const onAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length + 1 > 7) return
    setNewSalesRecord({ ...newSalesRecord, amount: Number(event.target.value) })
  }
  const onQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length + 1 > 6) return
    setNewSalesRecord({ ...newSalesRecord, quantity: Number(event.target.value) })
  }
  const onMarketPlaceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setNewSalesRecord({ ...newSalesRecord, marketplace: event.target.value })
  }
  const onPaymentMethodChange = (event: React.ChangeEvent<HTMLSelectElement>) => setNewSalesRecord({ ...newSalesRecord, paymentMethod: event.target.value as PaymentMethod })
  const onBuyerNameChange = (event: React.ChangeEvent<HTMLInputElement>) => setNewSalesRecord({ ...newSalesRecord, buyerName: event.target.value })
  const onInvoiceNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length + 1 > 8) return
    setNewSalesRecord({ ...newSalesRecord, invoiceNumber: event.target.value })
  }
  const resetForm = () => {
    setNewSalesRecord({ ...initRetailRecord, adminName: userInfo.name })
    setTargetInventoryRecord(initInstockInventory)
    setTargetSku('')
  }

  const renderInventoryDetails = () => {
    return (
      <Grid className='gap-3' numItems={1}>
        <Col>
          <List className='pl-0'>
            <ListItem>
              <span>Shelf Location</span>
              <Badge color='slate'>{targetInventoryRecord.shelfLocation}</Badge>
            </ListItem>
            <ListItem>
              <span>Condition</span>
              <Badge color={getConditionVariant(targetInventoryRecord.condition)}><Bold>{targetInventoryRecord.condition}</Bold></Badge>
            </ListItem>
            <ListItem>
              <span>Q&A Owner</span>
              <span>{targetInventoryRecord.qaName}</span>
            </ListItem>
            <ListItem>
              <span>Record Admin</span>
              <span>{targetInventoryRecord.adminName}</span>
            </ListItem>
            <ListItem>
              <span>Quantity Instock</span>
              <Badge color='green'>
                <Bold>
                  {
                    newSalesRecord.quantity > 0 ?
                      `${targetInventoryRecord.quantityInstock} - ${newSalesRecord.quantity} = ${targetInventoryRecord.quantityInstock - newSalesRecord.quantity}` :
                      targetInventoryRecord.quantityInstock
                  }
                </Bold>
              </Badge>
            </ListItem>
            <ListItem>
              <span>Quantity Sold</span>
              <Badge color='rose'>
                <Bold>
                  {
                    newSalesRecord.quantity > 0 ?
                      `${targetInventoryRecord.quantitySold} + ${newSalesRecord.quantity} = ${targetInventoryRecord.quantitySold + newSalesRecord.quantity}` :
                      targetInventoryRecord.quantitySold
                  }
                </Bold>
              </Badge>
            </ListItem>
          </List>
        </Col>
        <Col>
          <div className='border-solid border-2 border-slate-500 rounded p-2'>
            <Divider className='mt-0'>Comment</Divider>
            <Text>{targetInventoryRecord.comment}</Text>
            <Divider>Link</Divider>
            <div className='d-grid gap-2'>
              <Button color='gray' onClick={() => copyLink(targetInventoryRecord.url)}>Copy</Button>
              <Button color='emerald' onClick={() => openLink(targetInventoryRecord.url)}>Open</Button>
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
        <h4>💰 Create Sales Record</h4>
      </Modal.Header>
      <Modal.Body>
        <Grid className='gap-6' numItems={2}>
          <Col>
            <Title>Search For Inventory</Title>
            <InputGroup className="mb-3">
              <InputGroup.Text>SKU</InputGroup.Text>
              <Form.Control value={newSalesRecord.sku} onChange={onSkuChange} />
            </InputGroup>
            <Button className='mb-3' color='emerald' onClick={getInstockBySku}>Search</Button>
            <InputGroup className="mb-3">
              <InputGroup.Text>Invoice Number</InputGroup.Text>
              <Form.Control value={newSalesRecord.invoiceNumber} onChange={onInvoiceNumberChange} />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text>Admin Name</InputGroup.Text>
              <Form.Control
                type="text"
                placeholder={newSalesRecord.adminName}
                aria-label="Admin Name"
                disabled
                readOnly
              />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text>Buyer Name</InputGroup.Text>
              <Form.Control value={newSalesRecord.buyerName} onChange={onBuyerNameChange} />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text>Quantity</InputGroup.Text>
              <Form.Control value={newSalesRecord.quantity} onChange={onQuantityChange} />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text>Sales Amount</InputGroup.Text>
              <Form.Control type='number' step='any' value={newSalesRecord.amount} onChange={onAmountChange} />
              <InputGroup.Text>$CAD</InputGroup.Text>
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text>Market Place</InputGroup.Text>
              <Form.Select value={newSalesRecord.marketplace} onChange={onMarketPlaceChange}>
                {renderMarketPlaceOptions()}
              </Form.Select>
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text>Payment Method</InputGroup.Text>
              <Form.Select value={newSalesRecord.paymentMethod} onChange={onPaymentMethodChange}>
                {renderPaymentMethodOptions()}
              </Form.Select>
            </InputGroup>
            <Card className="mx-auto" decoration="top" decorationColor="emerald">
              <Grid numItems={3}>
                <Col>
                  <Text>Items Count</Text>
                  <Metric>{newSalesRecord.quantity}</Metric>
                </Col>
                <Col>
                  <Text>Item Price</Text>
                  <Metric>{(newSalesRecord.amount).toFixed(2)}</Metric>
                </Col>
                <Col>
                  <Text>Total Sales In CAD</Text>
                  <Metric>${(newSalesRecord.amount * newSalesRecord.quantity).toFixed(2)}</Metric>
                </Col>
              </Grid>
            </Card>
          </Col>
          <Col>
            <Card className='h-full'>
              {targetInventoryRecord.sku ? <><Title>{targetInventoryRecord.sku}</Title> {renderInventoryDetails()}</> : <Subtitle>👈 Search Result Will Be Shown Here</Subtitle>}
            </Card>
          </Col>
        </Grid>
      </Modal.Body>
      <Modal.Footer>
        <div className='text-center flex gap-6'>
          <Button color='amber' onClick={resetForm}>Reset Form</Button>
          <Button color='slate' onClick={() => props.handleClose(false)}>Cancel</Button>
          <Button color='emerald' onClick={createRetailRecord}>Create</Button>
        </div>
      </Modal.Footer>
    </Modal >
  )
}

export default CreateSalesRecordModal
