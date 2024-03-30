import React, { useContext, useState } from 'react'
import {
  Button,
  Form,
  InputGroup,
  Modal
} from 'react-bootstrap'
import { InstockQueryFilter } from '../utils/Types'
import { server, stringToNumber } from '../utils/utils'
import axios, { AxiosError, AxiosResponse } from 'axios'
import { AppContext } from '../App'
import { Switch } from '@tremor/react'

type AddToAuctionModalProps = {
  show: boolean,
  hide: () => void,
  filter: InstockQueryFilter
}

const AddToAuctionModal: React.FC<AddToAuctionModalProps> = (props: AddToAuctionModalProps) => {
  const { setLoading } = useContext(AppContext)
  const [targetAuction, setTargetAuction] = useState<number>(0)
  const [isDuplicate, setIsDuplicate] = useState<boolean>(false)

  const onTargetAuctionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTargetAuction(stringToNumber(event.target.value))
  }

  const onConfirmAdd = async () => {
    setLoading(true)
    await axios({
      method: 'put',
      url: `${server}/inventoryController/addSelectionToAuction`,
      responseType: 'text',
      timeout: 8000,
      data: JSON.stringify({
        fil: props.filter,
        auctionLot: targetAuction,
        duplicate: isDuplicate
      }),
      withCredentials: true
    }).then((res: AxiosResponse) => {
      if (res.status < 201) {
        alert('Auction Record Created')

        props.hide()
      } else {
        alert('Failed to Add Selected Inventory Items to Auction Record')
      }
    }).catch((err: AxiosError) => {
      setLoading(false)
      alert('Failed Creating Auction Record: ' + err.response?.data)
    })
    setLoading(false)
  }

  return (
    <Modal
      className='z-[1550]'
      show={props.show}
      onHide={props.hide}
      backdrop="static"
      centered
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>Add Current Selection to Auction</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <InputGroup className='mb-12'>
          <InputGroup.Text>Target Auction</InputGroup.Text>
          <Form.Control
            type='number'
            value={targetAuction}
            min={0}
            onChange={onTargetAuctionChange}
          />
        </InputGroup>
        <div className='flex absolute right-12 bottom-3'>
          <Switch
            className='mr-3'
            color='rose'
            onChange={() => setIsDuplicate(!isDuplicate)}
            checked={isDuplicate}
          />
          <span>Duplicate Row</span>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button color='slate' onClick={props.hide}>Close</Button>
        <Button color='blue' onClick={onConfirmAdd}>Confirm</Button>
      </Modal.Footer>
    </Modal>

  )
}

export default AddToAuctionModal