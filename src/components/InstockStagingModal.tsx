import { Badge, Button, Card, List, ListItem } from '@tremor/react'
import axios, { AxiosError, AxiosResponse } from 'axios'
import React, { useContext } from 'react'
import { Modal } from 'react-bootstrap'
import { InstockQueryFilter } from '../utils/Types'
import { getKwArr, server } from '../utils/utils'
import { AppContext } from '../App'
import { FaArrowRightLong } from 'react-icons/fa6'

type InstockStagingModalProps = {
  show: boolean,
  handleClose: () => void,
  queryFilter: InstockQueryFilter,
  totalItems: number,
  keywords: string
}

const InstockStagingModal: React.FC<InstockStagingModalProps> = (props: InstockStagingModalProps) => {
  const { setLoading } = useContext(AppContext)

  const push = async () => {
    const filter = {
      ...props.queryFilter,
      keywordFilter: getKwArr(props.keywords, false)
    }
    setLoading(true)
    await axios({
      method: 'post',
      url: server + '/inventoryController/',
      responseType: 'text',
      timeout: 8000,
      data: { filter: filter },
      withCredentials: true
    }).then((res: AxiosResponse) => {
      if (res.status < 201) {
        alert('Auction Record Created')
      } else {
        alert('Failed to Create Auction Record')
      }
    }).catch((err: AxiosError) => {
      setLoading(false)
      alert('Failed Fetching QA Records: ' + err.message)
    })
    setLoading(false)
  }

  const renderSkuInfo = () => (
    <ListItem>
      <span className='text-emerald-500'>Min SKU: {props.queryFilter.sku?.gte === '' ? 'N/A' : props.queryFilter.sku?.gte} (Include)</span>
      <span className='text-rose-500'>Max SKU: {props.queryFilter.sku?.lte === '' ? 'N/A' : props.queryFilter.sku?.lte} (Include)</span>
    </ListItem>
  )

  const renderMSRPInfo = () => (
    <ListItem>
      <span className='text-emerald-500'>Min MSRP: {props.queryFilter.msrpFilter.gte === '' ? 'N/A' : props.queryFilter.msrpFilter.gte} (Include)</span>
      <span className='text-rose-500'>Max MSRP: {props.queryFilter.msrpFilter.lt === '' ? 'N/A' : props.queryFilter.msrpFilter.lt} (Exclude)</span>
    </ListItem>
  )

  const renderDateRangeInfo = () => (
    <ListItem>
      <span className='text-emerald-500'>Time From: {props.queryFilter.timeRangeFilter.from?.getDate() ?? 'N/A'} (Include)</span>
      <span className='text-rose-500'>Time To: {props.queryFilter.timeRangeFilter.to?.getDate() ?? 'N/A'} (Include)</span>
    </ListItem>
  )

  return (
    <Modal
      show={props.show}
      onHide={props.handleClose}
      backdrop="static"
      keyboard={false}
    >
      <div className='grid p-3 gap-2'>
        <h2> Create Auction Record</h2>
        <hr />
        <Card>
          <h4>Filters:</h4>
          <List className="mt-2 p-0">
            {renderSkuInfo()}
            {renderMSRPInfo()}
            {renderDateRangeInfo()}
          </List>
          <hr />
          <h4>Repeating Detection</h4>
          <hr />
          <Badge color='emerald'>Total: {props.totalItems ?? 0} Items</Badge>
        </Card>

        <hr />
        <div className='flex'>
          <Button color='slate' onClick={props.handleClose}>Close</Button>
          <Button className='absolute right-8' color='emerald' onClick={push}>Create Auction Record</Button>
        </div>
      </div>
    </Modal>
  )
}
export default InstockStagingModal