import React, { useContext, useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
import {
  SearchSelect,
  SearchSelectItem,
  Button
} from '@tremor/react';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { server } from '../utils/utils';
import { AppContext } from '../App';
import { FaRotate } from 'react-icons/fa6';

type ImportUnsoldModalProps = {
  hide: () => void,
  show: boolean,
  auctionLotNumber: number,
  refreshAuction: () => Promise<void>,
}

// imports unsold items array into auction record past unsold record <lot:unsoldArr>
const ImportUnsoldModal: React.FC<ImportUnsoldModalProps> = (
  props: ImportUnsoldModalProps
) => {
  const { setLoading } = useContext(AppContext)
  const [remainingLotNumbers, setRemainingLotNumbers] = useState<number[]>([])
  const [lotToImport, setLotToImport] = useState<string>('')

  useEffect(() => {
    // getAuctionLotNumbers(false)
  }, [])

  const getAuctionLotNumbers = async (closeModal: boolean) => {
    setLoading(true)
    await axios({
      method: 'get',
      url: `${server}/inventoryController/getRemainingLotNumbers`,
      responseType: 'text',
      timeout: 8000,
      withCredentials: true,
    }).then((res: AxiosResponse) => {
      if (res.status > 200) return alert('Failed to Fetch Auction Lot Numbers')
      setRemainingLotNumbers(JSON.parse(res.data))
      props.refreshAuction()
      closeModal ? props.hide() : undefined
    }).catch((err: AxiosError) => {
      setLoading(false)
      alert('Failed to Fetch Auction Lot Numbers ' + err.response?.data)
    })
    setLoading(false)
  }

  const onConfirmImport = async () => {
    setLoading(true)
    await axios({
      method: 'post',
      url: `${server}/inventoryController/importUnsoldItems`,
      responseType: 'text',
      timeout: 8000,
      withCredentials: true,
      data: JSON.stringify({
        'auctionLotNumber': props.auctionLotNumber,
        'remainingLotNumber': lotToImport
      })
    }).then((res: AxiosResponse) => {
      if (res.status > 200) return alert('Failed to Import Previous Auction Items')

      props.refreshAuction()
      props.hide()
    }).catch((err: AxiosError) => {
      setLoading(false)
      alert(`Failed to Import Unsold From Lot#${lotToImport}: ${err.response?.data}`)
    })
    setLoading(false)
  }

  const renderRemainingLotNumberSelection = () => {
    if (remainingLotNumbers.length > 0) {
      return (
        <SearchSelect value={lotToImport} onValueChange={setLotToImport}>
          {remainingLotNumbers.map((val, index) => (<SearchSelectItem key={index} value={String(val)}>
            {String(val)}
          </SearchSelectItem>))}
        </SearchSelect>
      )
    } else {
      return <p>No Remaining Records Found</p>
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
        <Modal.Title>Import Unsold Items to Lot #{props.auctionLotNumber}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Button
          className='absolute right-6'
          color='emerald'
          onClick={() => getAuctionLotNumbers(false)}
        >
          <FaRotate />
        </Button>
        <p>Select Remaining Lot for Unsold Items</p>
        {renderRemainingLotNumberSelection()}
      </Modal.Body>
      <Modal.Footer>
        <Button color='slate' onClick={props.hide}>Close</Button>
        <Button color='blue' onClick={onConfirmImport}>Confirm</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ImportUnsoldModal