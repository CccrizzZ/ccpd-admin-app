import axios, { AxiosError, AxiosResponse } from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import {
  Modal
} from 'react-bootstrap'
import { server } from '../utils/utils'
import { AppContext } from '../App'
import {
  Card,
  Button,
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Grid,
  Col,
  Badge,
  List,
  ListItem,
} from '@tremor/react'
import { AuctionInfo, InstockItem, RemainingInfo, SoldItem } from '../utils/Types'
import { FaRotate } from 'react-icons/fa6'

type RemainigAuditModalProps = {
  close: () => void,
  show: boolean,
  remainingRecord: RemainingInfo,
  auctionRecord: AuctionInfo | undefined,
}

type ErrorItems = {
  lot: number,
  sku: number,
  reason: string
}

// list all items out of stock
// list all error items that does not match auction record
// provide panel for database subtraction action
const RemainingAuditModal: React.FC<RemainigAuditModalProps> = (props: RemainigAuditModalProps) => {
  const { setLoading } = useContext(AppContext)
  const [errorItems, setErrorItems] = useState<ErrorItems[]>([])

  useEffect(() => {
    getErrorItems()
  }, [])

  const runDatabaseAction = async () => {
    setLoading(true)
    await axios({
      method: 'post',
      url: `${server}/inventoryController/auditRemainingRecord`,
      responseType: 'text',
      timeout: 8000,
      withCredentials: true,
      data: JSON.stringify({ 'remainingLotNumber': props.remainingRecord.lot })
    }).then((res: AxiosResponse) => {
      if (res.status > 200) return alert('Failed to Fetch Auction Lot Numbers')
      // set processed flag to true
      props.remainingRecord.isProcessed = true
      return alert('Pushed to Database')
    }).catch((err: AxiosError) => {
      setLoading(false)
      alert('Failed to Fetch Auction Lot Numbers ' + err.response?.data)
    })
    setLoading(false)

  }

  // get repetitive sku in auction record
  const getErrorItems = () => {
    if (props.auctionRecord) {
      // construct an all item array
      let allItems = [...props.auctionRecord.itemsArr, ...props.auctionRecord.topRow]
      if (props.auctionRecord.previousUnsoldArr) {
        Object.entries(props.auctionRecord.previousUnsoldArr).map(([lot, itemArr]) => {
          allItems = [...allItems, ...itemArr]
        })
      }

      // check for item does not exist in remaining record but is in the auction record
      // const notInRemaining: ErrorItems[] = []
      allItems.forEach((item) => {
        const sold = props.remainingRecord.soldItems.find((val) => val.clotNumber === item.lot && val.sku === item.sku)
        const notSold = props.remainingRecord.unsoldItems.find((val) => val.lot === item.lot && val.sku === item.sku)
        if (!sold && !notSold) {
          errorItems.push({
            lot: item.lot,
            sku: item.sku,
            reason: 'Found in Auction, Not in Remaining Record'
          })
        }
      })

      // check for items exist in the remaining record but not in auction:
      props.remainingRecord.soldItems.map((item: SoldItem) => {
        const exist = allItems.find((val) => val.lot === item.clotNumber && val.sku === item.sku)
        if (!exist) {
          errorItems.push({
            lot: item.clotNumber,
            sku: item.sku,
            reason: 'Found in Remaining Sold, Not in Auction Record'
          })
        }
      })
      props.remainingRecord.unsoldItems.map((item: InstockItem) => {
        const exist = allItems.find((val) => val.lot === item.lot && val.sku === item.sku)
        if (!exist) {
          errorItems.push({
            lot: item.lot,
            sku: item.sku,
            reason: 'Found in Remaining Unsold, Not in Auction Record'
          })
        }
      })
    }
  }

  const checkRemainingForItem = (item: InstockItem) => {
    // return status text for auction record item
    const sold = props.remainingRecord.soldItems.find((val) => val.sku === item.sku && val.shelfLocation === item.shelfLocation)
    const notSold = props.remainingRecord.unsoldItems.find((val) => val.sku === item.sku && val.shelfLocation === item.shelfLocation)
    if (sold) return `💵 Sold for ${sold.bidAmount}`
    if (notSold) return '⛔ Not Sold'
    return <p className='text-rose-500'>Missing From Remaining</p>
  }

  const renderAuctionTable = () => (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeaderCell className='w-32'>Lot</TableHeaderCell>
          <TableHeaderCell>SKU</TableHeaderCell>
          <TableHeaderCell className='w-48'>Status</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {props.auctionRecord?.topRow.map((val, index) => (
          <TableRow key={index}>
            <TableCell>{val.lot}</TableCell>
            <TableCell><Badge color='blue'>{val.sku}</Badge></TableCell>
            <TableCell>{checkRemainingForItem(val)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableBody>
        {props.auctionRecord?.itemsArr.map((val, index) => (
          <TableRow key={index}>
            <TableCell>{val.lot}</TableCell>
            <TableCell><Badge color='blue'>{val.sku}</Badge></TableCell>
            <TableCell>{checkRemainingForItem(val)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableBody>
        {props.auctionRecord && props.auctionRecord.previousUnsoldArr ? Object.entries(props.auctionRecord.previousUnsoldArr).map(([lot, itemArr]) => (
          itemArr.map((val, index) => (
            <TableRow key={index}>
              <TableCell>{val.lot} (from #{lot})</TableCell>
              <TableCell><Badge color='blue'>{val.sku}</Badge></TableCell>
              <TableCell>{checkRemainingForItem(val)}</TableCell>
            </TableRow>
          ))
        )) : <></>}
      </TableBody>
    </Table>
  )

  const renderRemainingTable = () => (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeaderCell className='w-32'>Lot</TableHeaderCell>
          <TableHeaderCell>SKU</TableHeaderCell>
          <TableHeaderCell>Status</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {props.remainingRecord.soldItems.map((val, index) => (
          <TableRow key={index}>
            <TableCell>{val.clotNumber}</TableCell>
            <TableCell><Badge color='emerald'>{val.sku}</Badge></TableCell>
            <TableCell>{val.soldStatus}</TableCell>
          </TableRow>
        ))}
        {props.remainingRecord.unsoldItems.map((val, index) => (
          <TableRow key={index}>
            <TableCell>{val.lot}</TableCell>
            <TableCell><Badge color='rose'>{val.sku}</Badge></TableCell>
            <TableCell>NS</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )

  const renderErrorItems = () => (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeaderCell>Lot</TableHeaderCell>
          <TableHeaderCell>SKU</TableHeaderCell>
          <TableHeaderCell>Reason</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {errorItems.map((val, index) => (
          <TableRow key={index}>
            <TableCell>{val.lot}</TableCell>
            <TableCell><Badge color='rose' className='font-bold'>{val.sku}</Badge></TableCell>
            <TableCell>{val.reason}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )

  return (
    <Modal
      show={props.show}
      onHide={props.close}
      backdrop="static"
      keyboard={false}
      size='xl'
    >
      <br />
      <Grid numItems={2} className='p-6 gap-2'>
        <Col className='text-center'>
          <Card>
            <h2>Auction #{props.auctionRecord?.lot ?? ''}</h2>
            {renderAuctionTable()}
          </Card>
        </Col>
        <Col className='text-center'>
          <Card>
            <h2>Remaining #{props.remainingRecord.lot}</h2>
            {renderRemainingTable()}
          </Card>
        </Col>
        <Col numColSpan={2}>
          <Card>
            <h2 className='text-rose-500'>Error Items</h2>
            {renderErrorItems()}
          </Card>
        </Col>
      </Grid>
      <div className='p-6'>
        <Button color='slate' onClick={props.close}>Close</Button>
        <Button color='emerald' className='absolute right-6' onClick={runDatabaseAction}>Push to Database</Button>
      </div>
    </Modal>
  )
}

export default RemainingAuditModal