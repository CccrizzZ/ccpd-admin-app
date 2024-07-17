import {
  Badge,
  Button,
  Card,
  DatePicker,
  List,
  ListItem,
  DatePickerValue,
  Switch
} from '@tremor/react'
import axios, { AxiosError, AxiosResponse } from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { Form, InputGroup, Modal } from 'react-bootstrap'
import { InstockQueryFilter } from '../utils/Types'
import { getKwArr, server, stringToNumber } from '../utils/utils'
import { AppContext } from '../App'

type InstockStagingModalProps = {
  show: boolean,
  handleClose: () => void,
  queryFilter: InstockQueryFilter,
  totalItems: number,
  keywords: string
}

// for creating auction records
const InstockStagingModal: React.FC<InstockStagingModalProps> = (props: InstockStagingModalProps) => {
  const { setLoading } = useContext(AppContext)
  const [lot, setLot] = useState<number>(0)
  const [itemLotStart, setItemLotStart] = useState<number>(100)
  const [endDate, setEndDate] = useState<DatePickerValue>(undefined)
  // if true, duplicate items and push the same stuff x times
  const [duplicate, setDuplicate] = useState<boolean>(false)

  useEffect(() => {
  }, [])

  const createAuctionRecord = async () => {
    if (props.totalItems === 0) return alert('Cannot Create Auction With 0 Inventory')
    if (lot === 0) return alert('Lot Number Cannot Be 0')
    if (itemLotStart === 0) return alert('First Item Lot Number Cannot Be 0')
    if (endDate === undefined) return alert('Please Set Auction End Date')
    const filter = {
      ...props.queryFilter,
      keywordFilter: getKwArr(props.keywords, false)
    }
    setLoading(true)
    await axios({
      method: 'post',
      url: `${server}/inventoryController/createAuctionRecord`,
      responseType: 'text',
      timeout: 8000,
      data: {
        lot: lot,
        itemLotStart: itemLotStart,
        endDate: endDate,
        filter: filter,
        duplicate: duplicate,
      },
      withCredentials: true
    }).then((res: AxiosResponse) => {
      if (res.status < 201) {
        alert('Auction Record Created')
        props.handleClose()
      } else {
        alert('Failed to Create Auction Record')
      }
    }).catch((err: AxiosError) => {
      setLoading(false)
      alert('Failed Creating Auction Record: ' + err.response?.data)
    })
    setLoading(false)
  }

  // TODO: alerts in the staging window
  // instock records can possibly have no lead or description
  // const getAbnormalRecords = async () => {
  //   await axios({
  //     method: 'post',
  //     url: server + '/inventoryController/getAbnormalInstockInventory',
  //     responseType: 'text',
  //     timeout: 8000,
  //     data: {
  //       filter: {
  //         ...props.queryFilter,
  //         keywordFilter: getKwArr(props.keywords, false)
  //       }
  //     },
  //     withCredentials: true
  //   }).then((res: AxiosResponse) => {
  //     const data = JSON.parse(res.data)
  //     if (data.length > 0) {
  //       setAbnormalRecords(data)
  //     }
  //   }).catch((err: AxiosError) => {
  //     setLoading(false)
  //     alert('Failed Fetching Abnormal Record: ' + err.response?.data)
  //   })
  // }

  const renderSkuInfo = () => (
    <ListItem>
      <span className='text-emerald-500'>
        Min SKU: <p className='text-white ml-2 mr-2 mb-0'>{props.queryFilter.sku?.gte === '' ? 'N/A' : props.queryFilter.sku?.gte}</p> (Include)
      </span>
      <span className='text-rose-500'>
        Max SKU: <p className='text-white ml-2 mr-2 mb-0'>{props.queryFilter.sku?.lte === '' ? 'N/A' : props.queryFilter.sku?.lte}</p> (Include)
      </span>
    </ListItem>
  )

  const renderMSRPInfo = () => (
    <ListItem>
      <span className='text-emerald-500'>
        Min MSRP: <p className='text-white ml-2 mr-2 mb-0'>{props.queryFilter.msrpFilter.gte === '' ? 'N/A' : props.queryFilter.msrpFilter.gte}</p> (Include)
      </span>
      <span className='text-rose-500'>
        Max MSRP: <p className='text-white ml-2 mr-2 mb-0'>{props.queryFilter.msrpFilter.lt === '' ? 'N/A' : props.queryFilter.msrpFilter.lt}</p> (Exclude)
      </span>
    </ListItem >
  )

  const renderDateRangeInfo = () => (
    <ListItem>
      <span className='text-emerald-500'>
        Time From: <p className='text-white ml-2 mr-2 mb-0'>{props.queryFilter.timeRangeFilter.from?.toLocaleDateString('US') ?? 'N/A'}</p> (05:00am)
      </span>
      <span className='text-rose-500'>
        Time To: <p className='text-white ml-2 mr-2 mb-0'>{props.queryFilter.timeRangeFilter.to?.toLocaleDateString('US') ?? 'N/A'}</p> (23:59pm)
      </span>
    </ListItem>
  )

  const onLotChange = (event: React.ChangeEvent<HTMLInputElement>) => setLot(stringToNumber(event.target.value))
  const onItemLotStartChange = (event: React.ChangeEvent<HTMLInputElement>) => setItemLotStart(stringToNumber(event.target.value))
  const onEndDateChange = (value: DatePickerValue) => setEndDate(value)
  return (
    <Modal
      show={props.show}
      onHide={props.handleClose}
      backdrop="static"
      keyboard={false}
      size='lg'
    >
      <div className='grid p-3 gap-2'>
        <h2 className='mb-0'>✳️ Create Auction Record</h2>
        <hr />
        <Card>
          <InputGroup size='sm' className='mb-3'>
            <InputGroup.Text>Auction Lot #</InputGroup.Text>
            <Form.Control
              value={lot}
              onChange={onLotChange}
              step='0.01'
              type='number'
            />
          </InputGroup>
          <InputGroup size='sm' className='mb-3'>
            <InputGroup.Text>Item Lot No. Start</InputGroup.Text>
            <Form.Control
              value={itemLotStart}
              onChange={onItemLotStartChange}
            />
          </InputGroup>
          <hr />
          <div className='flex min-h-20'>
            <div className='absolute left-24'>
              <p>Today's Date:</p>
              <DatePicker
                className='max-w-64 mb-3'
                placeholder='Today'
                value={new Date()}
                disabled={true}
              />
            </div>
            <div className='absolute right-24'>
              <p>Auction Ends:</p>
              <DatePicker
                className='w-72'
                placeholder='Auction End Time'
                value={endDate}
                onValueChange={onEndDateChange}
              />
            </div>
          </div>
          <hr />
          <h4>Filters:</h4>
          <List className="mt-2 p-0">
            {renderSkuInfo()}
            {renderMSRPInfo()}
            {renderDateRangeInfo()}
          </List>
          <hr />
          <Badge color='emerald'>
            <h4 className='m-0'>Total: {props.totalItems ?? 0} Items</h4>
          </Badge>
          <div className='flex absolute right-12 bottom-6'>
            <Switch
              className='mr-3'
              color='rose'
              onChange={() => setDuplicate(!duplicate)}
              checked={duplicate}
            />
            <span>Duplicate Row</span>
          </div>
        </Card>
        <hr />
        <div className='flex'>
          <Button color='slate' onClick={props.handleClose}>Close</Button>
          <Button className='absolute right-8' color='emerald' onClick={createAuctionRecord}>Create Auction Record</Button>
        </div>
      </div>
    </Modal>
  )
}
export default InstockStagingModal