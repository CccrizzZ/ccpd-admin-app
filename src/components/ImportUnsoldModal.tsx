import React, { useContext, useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
import {
  SearchSelect,
  SearchSelectItem,
  Button,
  TextInput,
  Switch
} from '@tremor/react';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { server } from '../utils/utils';
import { AppContext } from '../App';
import { FaRotate } from 'react-icons/fa6';
import { RiSpace } from 'react-icons/ri';

type ImportUnsoldModalProps = {
  hide: () => void,
  show: boolean,
  auctionLotNumber: number,
  refreshAuction: () => Promise<void>,
}

type remainingInfo = {
  totalCount: number,
  unsold: number,
  soldButInstock?: number,
  existInAuction?: number[]
}

// imports unsold items array into auction record past unsold record <lot:unsoldArr>
const ImportUnsoldModal: React.FC<ImportUnsoldModalProps> = (
  props: ImportUnsoldModalProps
) => {
  const { setLoading } = useContext(AppContext)
  const [remainingLots, setRemainingLots] = useState<number[]>([])
  const [remainingInfo, setRemainingInfo] = useState<remainingInfo>({} as remainingInfo)

  const [lotToImport, setLotToImport] = useState<string>('')
  const [gapSize, setGapSize] = useState<string>('100')

  // states for sold but have more than 0 in-stock
  const [duplicateSoldButInstock, setDuplicateSoldButInstock] = useState<boolean>(false)
  const [includeSoldButInstock, setIncludeSoldButInstock] = useState<boolean>(false)

  useEffect(() => {
    if (props.show) getRemainingLotNumbers(false)
  }, [props.show])

  const getRemainingLotNumbers = async (closeModal: boolean) => {
    setLoading(true)
    await axios({
      method: 'get',
      url: `${server}/inventoryController/getRemainingLotNumbers`,
      responseType: 'text',
      timeout: 8000,
      withCredentials: true,
    }).then((res: AxiosResponse) => {
      if (res.status > 200) return alert('Failed to Fetch Auction Lot Numbers')
      setRemainingLots(JSON.parse(res.data).reverse())
      props.refreshAuction()
      closeModal ? props.hide() : undefined
    }).catch((err: AxiosError) => {
      setLoading(false)
      alert('Failed to Fetch Auction Lot Numbers ' + err.response?.data)
    })
    setLoading(false)
  }

  const getRemainingLotInfos = async (includeSoldButInstock?: boolean, duplicateSoldButInstock?: boolean, lot?: number) => {
    setLoading(true)
    await axios({
      method: 'post',
      url: `${server}/inventoryController/getRemainingInfoByLot`,
      responseType: 'text',
      timeout: 80000,
      withCredentials: true,
      data: {
        'includeSoldButInstock': includeSoldButInstock,
        'duplicateSoldButInstock': duplicateSoldButInstock,
        'lot': lot,
        'targetAuction': props.auctionLotNumber,
      }
    }).then((res: AxiosResponse) => {
      if (res.status > 200) return alert('Failed to Fetch Auction Lot Information')
      setRemainingInfo(JSON.parse(res.data))
      console.log(JSON.parse(res.data))
    }).catch((err: AxiosError) => {
      setLoading(false)
      alert('Failed to Fetch Auction Lot Numbers ' + err.response?.data)
    })
    setLoading(false)
  }

  const onConfirmImport = async () => {
    if (lotToImport === '') return
    setLoading(true)
    await axios({
      method: 'post',
      url: `${server}/inventoryController/importUnsoldItems`,
      responseType: 'text',
      timeout: 800000,
      withCredentials: true,
      data: JSON.stringify({
        'auctionLotNumber': props.auctionLotNumber,
        'remainingLotNumber': lotToImport,
        'gapSize': Number(gapSize) ? Number(gapSize) : 0,
        'duplicateSoldButInstock': duplicateSoldButInstock,
        'includeSoldButInstock': includeSoldButInstock,
      })
    }).then((res: AxiosResponse) => {
      if (res.status > 200) return alert('Failed to Import Previous Auction Items')
      props.refreshAuction()
      props.hide()
    }).catch((err: AxiosError) => {
      setLoading(false)
      alert(`Failed to Import Unsold From Lot#${lotToImport}: ${err.response?.statusText}`)
    })
    setLoading(false)
  }

  const renderRemainingLotNumberSelection = () => {
    if (remainingLots.length > 0) {
      return (
        <SearchSelect
          value={lotToImport}
          onValueChange={(val) => {
            setLotToImport(val)
            if (val !== '') {
              getRemainingLotInfos(includeSoldButInstock, duplicateSoldButInstock, Number(val))
            } else {
              setDuplicateSoldButInstock(false)
              setIncludeSoldButInstock(false)
            }
          }}>
          {remainingLots.map((val, index) => (
            <SearchSelectItem key={index} value={String(val)}>
              {String(val)}
            </SearchSelectItem>
          ))}
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
        <Modal.Title>Import Unsold From #{lotToImport} -{'>'} #{props.auctionLotNumber}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className='grid min-h-16'>
          {lotToImport ? <h2 className='text-emerald-500'>{remainingInfo.totalCount} Total Items</h2> : <br />}
          {lotToImport ? <h2 className='text-red-500'>{remainingInfo.unsold} Unsold Items</h2> : <br />}
          {lotToImport ? <h2 className='text-blue-500'>{duplicateSoldButInstock ? '**' : ''}{remainingInfo.soldButInstock} Sold But Instock</h2> : <br />}
          {lotToImport ? <p>{JSON.stringify(remainingInfo.existInAuction)}</p> : <></>}
        </div>
        <br />
        <p className='mb-0'>Import Unsold From Remaining Lot</p>
        <div className='flex gap-3'>
          {renderRemainingLotNumberSelection()}
          <Button color='emerald' onClick={() => getRemainingLotNumbers(false)}>
            <FaRotate />
          </Button>
        </div>
        <p className='mt-3 mb-0'>Lot Number Gap Size (From the last item in auction)</p>
        <TextInput
          icon={RiSpace}
          value={gapSize}
          placeholder="Gap Size"
          onValueChange={setGapSize}
        />
        <hr />
        <div className='flex gap-3'>
          <div>
            <p className='m-0'>Include Sold But Instock</p>
            <p className='m-0 text-gray-500'>Import sold items that are still in-stock after database deduction (slow)</p>
          </div>
          <Switch
            checked={includeSoldButInstock}
            onChange={(val) => {
              if (!lotToImport) return
              setIncludeSoldButInstock(val)
              if (val === false) setDuplicateSoldButInstock(false)
              getRemainingLotInfos(val, duplicateSoldButInstock, Number(lotToImport))
            }}
          />
        </div>
        <hr />
        <div className='flex gap-3'>
          <div>
            <p className='m-0'>**Duplicate Sold But Instock</p>
            <p className='m-0 text-gray-500'>Import ALL in-stock for all sold but stil in stock items (slow)</p>
          </div>
          <Switch
            checked={duplicateSoldButInstock}
            onChange={(val) => {
              if (!includeSoldButInstock) return
              setDuplicateSoldButInstock(val)
              getRemainingLotInfos(includeSoldButInstock, val, Number(lotToImport))
            }}
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button color='slate' onClick={props.hide}>Close</Button>
        <Button color='emerald' onClick={onConfirmImport}>Confirm</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ImportUnsoldModal