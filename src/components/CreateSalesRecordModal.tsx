import React, { useContext, useState } from 'react'
import { AppContext } from '../App'
import axios from 'axios'
import {
  server,
  initCreateUser,
  deSpace,
  renderUserRoleOptions,
  initRetailRecord
} from '../utils/utils'
import { RetailRecord } from '../utils/Types'
import {
  Form,
  InputGroup,
  Modal
} from 'react-bootstrap'
import { Button } from '@tremor/react'

type CreateSalesRecordModalProps = {
  show: boolean
  handleClose: (refresh: boolean) => void,
}

const CreateSalesRecordModal: React.FC<CreateSalesRecordModalProps> = (props: CreateSalesRecordModalProps) => {
  const { setLoading, userInfo } = useContext(AppContext)
  const [newRecord, setNewRecord] = useState<RetailRecord>(initRetailRecord)

  // create a custom user
  const createUser = async () => {
    // null check for all values of new sales record
    const fieldsEmpty = Object.values(newRecord).some((val) => { return (deSpace(val).length < 1) })
    if (fieldsEmpty) return alert('Please Complete The Form')

    // post create request to server
    setLoading(true)
    await axios({
      method: 'post',
      url: server + '/adminController/createSalesRecord',
      responseType: 'text',
      data: newRecord,
      withCredentials: true
    }).then(() => {
      alert('User Created!')
    }).catch((err) => {
      alert('Create Record Failed: ' + err.response.status)
    })
    setLoading(false)
    props.handleClose(true)
  }

  const renderInventoryCard = () => {
    return (
      <>
      </>
    )
  }

  // setters
  const onSkuChange = (event: React.ChangeEvent<HTMLInputElement>) => setNewRecord({ ...newRecord, sku: Number(event.target.value) })
  const onQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => setNewRecord({ ...newRecord, quantity: Number(event.target.value) })
  const onAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => setNewRecord({ ...newRecord, amount: Number(event.target.value) })

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
        <h4>💵 Create Sales Record</h4>
      </Modal.Header>
      {renderInventoryCard()}
      <Modal.Body>
        <InputGroup className="mb-3">
          <InputGroup.Text>SKU</InputGroup.Text>
          <Form.Control value={newRecord.sku} onChange={onSkuChange} />
        </InputGroup>
        <InputGroup className="mb-3">
          <InputGroup.Text>Quantity</InputGroup.Text>
          <Form.Control value={newRecord.quantity} onChange={onQuantityChange} />
        </InputGroup>
        <InputGroup className="mb-3">
          <InputGroup.Text>Sales Amount (CAD)</InputGroup.Text>
          <Form.Control value={newRecord.amount} onChange={onAmountChange} />
        </InputGroup>
      </Modal.Body>
      <Modal.Footer>
        <div className='text-center'>
          <Button color='slate' onClick={() => props.handleClose(false)}>
            Close
          </Button>
          <Button className='ml-2' color='emerald' onClick={createUser}>Create</Button>
        </div>
      </Modal.Footer>
    </Modal>
  )
}

export default CreateSalesRecordModal
