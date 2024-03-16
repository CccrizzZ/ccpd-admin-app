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

type ImportUnsoldModalProps = {
  hide: () => void,
  show: boolean,
  auctionLotNumber: number,
  refreshAuction: () => Promise<void>,
}

const ImportUnsoldModal: React.FC<ImportUnsoldModalProps> = (
  props: ImportUnsoldModalProps
) => {
  const { setLoading } = useContext(AppContext)
  const [remainingLotNumbers, setRemainingLotNumbers] = useState<number[]>([])
  const [lotToImport, setLotToImport] = useState<string>('')

  useEffect(() => {
    getAuctionLotNumbers()
  }, [])

  const getAuctionLotNumbers = async () => {
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
      props.hide()
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
      alert('Failed to Delete Remaining Record: ' + err.response?.data)
    })
    setLoading(false)
  }

  const renderRemainingLotNumberSelection = () => {
    if (remainingLotNumbers.length > 0) return (
      <SearchSelect value={lotToImport} onValueChange={setLotToImport}>
        {remainingLotNumbers.map((val, index) => (<SearchSelectItem key={index} value={String(val)}>
          {String(val)}
        </SearchSelectItem>))}
      </SearchSelect>
    )
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
        <Modal.Title>Import Unsold Items</Modal.Title>
      </Modal.Header>
      <Modal.Body>
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