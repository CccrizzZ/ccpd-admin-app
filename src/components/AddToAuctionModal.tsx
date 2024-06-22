import React, { useContext, useEffect, useState } from 'react'
import {
  Modal
} from 'react-bootstrap'
import { InstockQueryFilter } from '../utils/Types'
import { server } from '../utils/utils'
import axios, { AxiosError, AxiosResponse } from 'axios'
import { AppContext } from '../App'
import { SearchSelect, SearchSelectItem, Switch, Button } from '@tremor/react'

type AddToAuctionModalProps = {
  show: boolean,
  hide: () => void,
  filter: InstockQueryFilter,
  itemCount: number
}

const AddToAuctionModal: React.FC<AddToAuctionModalProps> = (
  props: AddToAuctionModalProps
) => {
  const { setLoading } = useContext(AppContext)
  const [targetAuction, setTargetAuction] = useState<string>('')
  const [isDuplicate, setIsDuplicate] = useState<boolean>(false)
  const [auctionLotArr, setAuctionLotArr] = useState<number[]>([])

  useEffect(() => {
    if (props.show && props.itemCount > 0) {
      getAuctionsLotNumber()
    } else {
      props.hide()
    }
  }, [props.show])

  const getAuctionsLotNumber = async () => {
    await axios({
      method: 'get',
      url: `${server}/inventoryController/getAuctionLotNumbers`,
      responseType: 'text',
      timeout: 8000,
      withCredentials: true
    }).then((res: AxiosResponse) => {
      if (res.data) {
        setAuctionLotArr(JSON.parse(res.data))
        console.log(res.data)
      }
    }).catch((err: AxiosError) => {
      alert(`Cannot Get Auction Lot Numbers: ${err.response?.data}`)
    })
  }

  const onConfirmAdd = async () => {
    setLoading(true)
    await axios({
      method: 'put',
      url: `${server}/inventoryController/addSelectionToAuction`,
      responseType: 'text',
      timeout: 8000,
      data: JSON.stringify({
        filter: props.filter,
        auctionLot: targetAuction,
        duplicate: isDuplicate
      }),
      withCredentials: true
    }).then((res: AxiosResponse) => {
      if (res.status < 201) {
        alert('Added to Auction Record Bottom Row')
        props.hide()
      } else {
        alert('Failed to Add Selected Inventory Items to Auction Record')
      }
    }).catch((err: AxiosError) => {
      setLoading(false)
      alert('Failed Add to Auction Record: ' + err.response?.data)
    })
    setLoading(false)
  }

  const renderAuctionLotNumberSelection = () => {
    if (auctionLotArr.map) {
      return (
        <SearchSelect value={targetAuction} onValueChange={setTargetAuction}>
          {auctionLotArr.map((val, index) => (
            <SearchSelectItem key={index} value={String(val)}>
              {String(val)}
            </SearchSelectItem>
          ))}
        </SearchSelect>
      )
    } else {
      return <p>No Auction Records Found</p>
    }
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
        <span className='text-gray-500'>Repetitive Items Will Be Ignored</span>
        <span>Add to Auction</span>
        {renderAuctionLotNumberSelection()}
        <br />
        <div className='flex gap-2 justify-center'>
          <span>Duplicate Row</span>
          <Switch
            className='ml-3'
            color='rose'
            onChange={() => setIsDuplicate(!isDuplicate)}
            checked={isDuplicate}
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button color='slate' onClick={props.hide}>Close</Button>
        <Button color='emerald' onClick={onConfirmAdd}>Confirm</Button>
      </Modal.Footer>
    </Modal>

  )
}

export default AddToAuctionModal