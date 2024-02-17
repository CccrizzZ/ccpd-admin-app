import { Button, Col, Grid } from '@tremor/react'
import React, { useEffect, useState } from 'react'
import { Form, InputGroup, Modal } from 'react-bootstrap'
import { Condition, InstockInventory } from '../utils/Types'
import axios from 'axios'
import { initInstockInventory, renderItemConditionOptions, server } from '../utils/utils'

type EditInstockModalProps = {
  show: boolean,
  handleClose: () => void,
  selectedInventory: InstockInventory,
}

const EditInstockModal: React.FC<EditInstockModalProps> = (props: EditInstockModalProps) => {
  const [instockDetail, setInstockDetail] = useState<InstockInventory>(initInstockInventory)

  useEffect(() => {
    setInstockDetail(props.selectedInventory)
  }, [])

  const updateInstockInventory = async () => {
    await axios({
      method: 'put',
      url: server + '/adminController/update/',
      responseType: 'text',
      data: instockDetail,
      withCredentials: true
    }).then((res) => {
      if (res.status === 200) {
        alert('updated ' + instockDetail.sku)
      }
    }).catch((err) => {
      alert('Failed Deleting User: ' + err.response.status)
    })
  }

  const onShelfLocationChange = (event: React.ChangeEvent<HTMLInputElement>) => setInstockDetail({ ...instockDetail, shelfLocation: event.target.value })
  const onConditionChange = (event: React.ChangeEvent<HTMLSelectElement>) => setInstockDetail({ ...instockDetail, condition: event.target.value as Condition })
  const onMSRPChange = (event: React.ChangeEvent<HTMLInputElement>) => setInstockDetail({ ...instockDetail, msrp: Number(event.target.value) ?? 0 })

  return (
    <Modal
      show={props.show}
      onHide={() => props.handleClose()}
      aria-labelledby="contained-modal-title-vcenter"
      backdrop="static"
      keyboard={false}
      size='lg'
      centered
    >
      <Modal.Header>
        <h4>💾 Edit Instock Inventory Record #{instockDetail.sku}</h4>
      </Modal.Header>
      <Modal.Body>
        <Grid numItems={2}>
          <Col>
            <InputGroup className="mb-3">
              <InputGroup.Text>Shelf Location</InputGroup.Text>
              <Form.Control value={instockDetail.shelfLocation} onChange={onShelfLocationChange} />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text>Inventory Condition</InputGroup.Text>
              <Form.Select value={instockDetail.condition} onChange={onConditionChange}>
                {renderItemConditionOptions()}
              </Form.Select>
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text>MSRP ($CAD)</InputGroup.Text>
              <Form.Control max={100000} min={1} value={instockDetail.msrp} onChange={onMSRPChange} />
            </InputGroup>
          </Col>
          <Col>

          </Col>
        </Grid>
      </Modal.Body>
      <Modal.Footer>
        <div className='text-center'>
          <Button className='absolute left-12' color='rose' onClick={() => props.handleClose()}>Delete</Button>
          <Button color='slate' onClick={() => props.handleClose()}>Close</Button>
          <Button className='ml-2' color='emerald' onClick={updateInstockInventory}>Update</Button>
        </div>
      </Modal.Footer>
    </Modal>
  )
}

export default EditInstockModal