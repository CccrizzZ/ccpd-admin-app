import { useContext, useEffect, useRef, useState } from "react"
import { AppContext } from "../App"
import { Form, InputGroup, Modal } from "react-bootstrap"
import {
  Button,
  Card,
  Col,
  Grid,
  Subtitle,
  Badge,
  Accordion,
  AccordionHeader,
  AccordionBody,
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Switch,
} from "@tremor/react"
import moment from "moment"
import { FaFileCsv, FaRotate } from "react-icons/fa6"
import {
  RemainingInfo,
  AuctionInfo,
  InstockInventory,
  InstockItem,
  SoldItem
} from "../utils/Types"
import axios, { AxiosError, AxiosResponse } from "axios"
import {
  server,
  stringToNumber,
  downloadCustomNameFile
} from "../utils/utils"

const initInstockItem: InstockItem = {
  lot: 0,
  sku: 0,
  shelfLocation: '',
  msrp: 0,
  lead: '',
  description: '',
  reserve: 0,
  startBid: 0,
  condition: '',
}

const AuctionHistory: React.FC = () => {
  const { setLoading, userInfo } = useContext(AppContext)
  const topRef = useRef<HTMLDivElement>(null)
  // const [dragging, setDragging] = useState<boolean>(false)
  const [showremainingModal, setShowremainingModal] = useState<boolean>(false)
  const [auctionHistoryArr, setAuctionHistoryArr] = useState<AuctionInfo[]>([])
  const [remainingHistoryArr, setRemainingHistoryArr] = useState<RemainingInfo[]>([])
  const [newTopRowItem, setNewTopRowItem] = useState<InstockItem>(initInstockItem)
  const [editMode, setEditMode] = useState<boolean>(false)
  // const [countDown, setCountDown] = useState<number>(0)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [lotToClose, setLotToClose] = useState<number>(0)

  useEffect(() => {
    getAuctionAndRemainingArr()
  }, [])

  const getAuctionAndRemainingArr = async () => {
    setLoading(true)
    await axios({
      method: 'get',
      url: server + '/inventoryController/getAuctionRemainingRecord',
      responseType: 'text',
      timeout: 8000,
      withCredentials: true
    }).then((res: AxiosResponse) => {
      if (res.status > 200) alert('Failed to Fetch Auction Record')
      const data = JSON.parse(res.data)
      setAuctionHistoryArr(data['auctions'])
      setRemainingHistoryArr(data['remaining'])
    }).catch((err: AxiosError) => {
      setLoading(false)
      alert('Failed Fetching Auction & Remaining Records: ' + err.message)
    })
    setLoading(false)
  }

  const getAuctionRecordCSV = async (lot: number) => {
    setLoading(true)
    await axios({
      method: 'post',
      url: server + '/inventoryController/getAuctionCsv',
      responseType: 'blob',
      timeout: 8000,
      data: {
        'lot': lot,
      },
      withCredentials: true
    }).then(async (res: AxiosResponse) => {
      if (res.status > 200) return alert('Failed to Get CSV')

      // JSON parse csv content
      let file = new Blob([res.data], { type: 'text/csv' })
      const csv = JSON.parse(await file.text())
      file = new Blob([csv], { type: 'text/csv' })

      downloadCustomNameFile(file, `${lot}_AuctionRecord.csv`, document)
    }).catch((err: AxiosError) => {
      setLoading(false)
      alert('Failed Fetching Auction CSV: ' + err.message)
    })
    setLoading(false)
  }

  // closing function
  const remainingRecordToDB = async () => {
    if (uploadedFile) {
      // append to form data
      const formData = new FormData();
      formData.append('xls', uploadedFile);
      formData.append('lot', String(lotToClose))
      setLoading(true)
      await axios({
        method: 'post',
        url: `${server}/inventoryController/processRemaining`,
        responseType: 'blob',
        timeout: 8000,
        // data: JSON.stringify({ 'lot': lotToClose, 'FILES': formData }),
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      }).then(async (res: AxiosResponse) => {
        if (res.status > 200) return alert('Failed to Get CSV')

        // JSON parse csv content
        let file = new Blob([res.data], { type: 'text/csv' })
        const csv = JSON.parse(await file.text())
        file = new Blob([csv], { type: 'text/csv' })

        downloadCustomNameFile(file, `${lotToClose}_AuctionRecord.csv`, document)
      }).catch((err: AxiosError) => {
        setLoading(false)
        alert('Failed Fetching Auction CSV: ' + err.response?.data)
      })
      setLoading(false)
      setShowremainingModal(false)
      getAuctionAndRemainingArr()
    }
  }

  const handleLotChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLotToClose(stringToNumber(event.target.value))
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) setUploadedFile(event.target.files[0])
  }

  const renderRemainingRecordModal = () => (
    <Modal
      show={showremainingModal}
      onHide={() => setShowremainingModal(false)}
      backdrop="static"
      keyboard={false}
    >
      <div className="p-6">
        <h2>Import Remaining CSV</h2>
        <hr />
        {/* csv upload box */}
        <div className="content-center">
          <InputGroup className='mb-3'>
            <InputGroup.Text>Lot to Close</InputGroup.Text>
            <Form.Control
              type="number"
              value={lotToClose}
              onChange={handleLotChange}
            />
          </InputGroup>
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>Upload XLS Here</Form.Label>
            <Form.Control
              type="file"
              accept=".xls"
              onChange={handleFileChange}
            />
          </Form.Group>
        </div>
        <hr />
        <div className="flex">
          <Button color="slate" onClick={() => setShowremainingModal(false)}>Close</Button>
          <Button className="absolute right-6" color="emerald" onClick={remainingRecordToDB}>Submit</Button>
        </div>
      </div>
    </Modal>
  )

  const renderCountDown = (closeTime: string, openTime: string) => {
    const close = moment(closeTime)
    const open = moment(openTime)
    let diff = ''
    if (moment().unix() > close.unix()) {
      diff = 'Auction Closed ✅'
    } else {
      diff = `⏱️ ${close.diff(open, 'days')} Days ` // ${close.diff(open, 'hours')} Hours ${close.diff(open, 'minutes')} Minutes
    }

    return (
      <Badge color={diff.length > 17 ? 'blue' : 'emerald'}>
        <div className="pt-2">
          {diff.length > 17 ? 'Time Untill Closing' : undefined}
          <h4>{diff}</h4>
        </div>
      </Badge>
    )
  }

  // TODO: push to database
  // add it into top row array
  const createNewTopRowItem = async (auctionLotNum: number) => {
    // null check on new top row item
    if (newTopRowItem.lot === 0) return alert('Lot Number Invalid')
    if (newTopRowItem.sku === 0) return alert('SKU Invalid')
    if (newTopRowItem.shelfLocation === '') return alert('Shelf Location Missing')
    if (newTopRowItem.lead === '') return alert('Lead Missing')

    // addTopRowItem
    setLoading(true)
    await axios({
      method: 'post',
      url: `${server}/inventoryController/addTopRowItem`,
      responseType: 'text',
      timeout: 8000,
      withCredentials: true,
      data: JSON.stringify({ 'auctionLot': auctionLotNum, 'newItem': newTopRowItem })
    }).then((res: AxiosResponse) => {
      if (res.status === 200) {
        getAuctionAndRemainingArr()
        clearNewTopRowItem()
      }
    }).catch((err: AxiosError) => {
      setLoading(false)
      alert('Failed Adding Item to Top Row: ' + err.response?.data)
    })
    setLoading(false)
  }

  const clearNewTopRowItem = () => setNewTopRowItem(initInstockItem)
  const onLotChange = (event: React.ChangeEvent<HTMLInputElement>) => setNewTopRowItem({ ...newTopRowItem, lot: stringToNumber(event.target.value) })
  const onSkuChange = (event: React.ChangeEvent<HTMLInputElement>) => setNewTopRowItem({ ...newTopRowItem, sku: stringToNumber(event.target.value) })
  const onMsrpChange = (event: React.ChangeEvent<HTMLInputElement>) => setNewTopRowItem({ ...newTopRowItem, msrp: stringToNumber(event.target.value) })
  const onShelfLocationChange = (event: React.ChangeEvent<HTMLInputElement>) => setNewTopRowItem({ ...newTopRowItem, shelfLocation: event.target.value })
  const onLeadChange = (event: React.ChangeEvent<HTMLInputElement>) => setNewTopRowItem({ ...newTopRowItem, lead: event.target.value })
  const onDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => setNewTopRowItem({ ...newTopRowItem, description: event.target.value })
  const onStartBidChange = (event: React.ChangeEvent<HTMLInputElement>) => setNewTopRowItem({ ...newTopRowItem, startBid: stringToNumber(event.target.value) })
  const onReserveChange = (event: React.ChangeEvent<HTMLInputElement>) => setNewTopRowItem({ ...newTopRowItem, reserve: stringToNumber(event.target.value) })

  const deleteTopRowItem = async (item: InstockItem, auctionLotNum: number) => {
    setLoading(true)
    await axios({
      method: 'delete',
      url: `${server}/inventoryController/deleteTopRowItem`,
      responseType: 'text',
      timeout: 8000,
      withCredentials: true,
      data: JSON.stringify({
        'sku': item.sku,
        'itemLotNumber': item.lot,
        'auctionLotNumber': auctionLotNum
      })
    }).then((res: AxiosResponse) => {
      if (res.status > 200) return alert('Failed to Delete')
      alert(`Deleted Item ${item.sku} from Auction ${auctionLotNum}`)
      getAuctionAndRemainingArr()
    }).catch((err: AxiosError) => {
      setLoading(false)
      alert('Failed to Delete Record From Top Row: ' + err.response?.data)
    })
    setLoading(false)
  }

  const deleteAuctionRecord = async (auction: AuctionInfo) => {
    setLoading(true)
    await axios({
      method: 'delete',
      url: `${server}/inventoryController/deleteAuctionRecord`,
      responseType: 'text',
      timeout: 8000,
      withCredentials: true,
      data: JSON.stringify({ 'auctionLotNumber': auction.lot })
    }).then((res: AxiosResponse) => {
      if (res.status > 200) return alert('Failed to Delete Auction Record')
      getAuctionAndRemainingArr()
    }).catch((err: AxiosError) => {
      setLoading(false)
      alert('Failed to Delete Auction Record: ' + err.response?.data)
    })
    setLoading(false)
  }

  // top row items
  const renderTopRowsTable = (val: AuctionInfo) => (
    <Accordion>
      <AccordionHeader className="text-sm font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
        ⚡ Top Row Inventories
        <Badge color="orange" className="absolute right-20">
          Total Items: {val.topRow ? val.topRow.length : 0}
        </Badge>
      </AccordionHeader>
      <AccordionBody className="leading-6 p-2">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell className="w-16">Lot#</TableHeaderCell>
              <TableHeaderCell className="w-20">SKU</TableHeaderCell>
              <TableHeaderCell>Lead</TableHeaderCell>
              <TableHeaderCell className="w-48">Desc</TableHeaderCell>
              <TableHeaderCell className="w-30">MSRP (CAD)<br />Reserve</TableHeaderCell>
              {editMode ? <TableHeaderCell className="w-30">Edit</TableHeaderCell> : <TableHeaderCell className="w-30">Shelf</TableHeaderCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {val.topRow ? val.topRow.slice(0).reverse().map((item: InstockItem) => (
              <TableRow key={item.sku}>
                <TableCell>{item.lot}</TableCell>
                <TableCell>{item.sku}</TableCell>
                <TableCell className="text-wrap">{item.lead}</TableCell>
                <TableCell className="text-wrap">{item.description}</TableCell>
                <TableCell className="justify-center">
                  <div className='grid justify-items-center'>
                    <Badge color='emerald'>{item.msrp}</Badge>
                    <br />
                    <Badge color='blue'>{item.reserve ?? 0}</Badge>
                  </div>
                </TableCell>
                {
                  editMode ?
                    <TableCell>
                      <Button
                        color="rose"
                        size="xs"
                        onClick={() => deleteTopRowItem(item, val.lot)}
                      >
                        Delete
                      </Button>
                    </TableCell> :
                    <TableCell>
                      <Badge color="indigo">{item.shelfLocation}</Badge>
                    </TableCell>
                }
              </TableRow>
            )) : undefined}
          </TableBody>
        </Table>
        <div className="grid gap-2 p-6 mt-6 border-slate-600 border-2 rounded pt-0">
          <div className="flex">
            <Button
              className="m-auto flex mb-3 mt-3"
              color="emerald"
              onClick={() => createNewTopRowItem(val.lot)}
            >
              🆕 Create New Item 🆕
            </Button>
          </div>
          <InputGroup>
            <InputGroup.Text>Lot#</InputGroup.Text>
            <Form.Control
              type='number'
              min={0}
              value={newTopRowItem.lot}
              onChange={onLotChange}
            />
            <InputGroup.Text>SKU</InputGroup.Text>
            <Form.Control
              type='number'
              min={0}
              value={newTopRowItem.sku}
              onChange={onSkuChange}
            />
            <InputGroup.Text>Shelf Location</InputGroup.Text>
            <Form.Control
              type='text'
              value={newTopRowItem.shelfLocation}
              onChange={onShelfLocationChange}
            />
          </InputGroup>
          <InputGroup>
            <InputGroup.Text>MSRP</InputGroup.Text>
            <Form.Control
              type='number'
              min={0}
              value={newTopRowItem.msrp}
              onChange={onMsrpChange}
              step={0.01}
            />
            <InputGroup.Text>Start Bid</InputGroup.Text>
            <Form.Control
              type='number'
              min={0}
              value={newTopRowItem.startBid}
              onChange={onStartBidChange}
            />
            <InputGroup.Text>Reserve</InputGroup.Text>
            <Form.Control
              type='number'
              min={0}
              value={newTopRowItem.reserve}
              onChange={onReserveChange}
            />
          </InputGroup>
          <InputGroup>
            <InputGroup.Text>Lead</InputGroup.Text>
            <Form.Control
              type='text'
              value={newTopRowItem.lead}
              onChange={onLeadChange}
            />
          </InputGroup>
          <InputGroup>
            <InputGroup.Text>Description</InputGroup.Text>
            <Form.Control
              className="resize-none"
              type='text'
              as='textarea'
              rows={6}
              value={newTopRowItem.description}
              onChange={onDescriptionChange}
            />
          </InputGroup>
        </div>
      </AccordionBody>
    </Accordion>
  )

  const renderInventoryTableHead = () => (
    <TableRow>
      <TableHeaderCell className="w-16 align-middle text-center">Lot#</TableHeaderCell>
      <TableHeaderCell className="w-18 align-middle text-center">SKU</TableHeaderCell>
      <TableHeaderCell className="w-32">Lead</TableHeaderCell>
      <TableHeaderCell className="w-48">Desc</TableHeaderCell>
      <TableHeaderCell className="w-32 align-middle text-center">MSRP<br />(CAD)<br />Reserve</TableHeaderCell>
      <TableHeaderCell className="w-30 align-middle text-center">Shelf</TableHeaderCell>
    </TableRow>
  )

  const renderInventoryTable = (val: AuctionInfo) => (
    <Accordion>
      <AccordionHeader className="text-sm font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
        📜 Inventories on Auction
        <Badge color="orange" className="absolute right-20">Total Items: {val.totalItems}</Badge>
      </AccordionHeader>
      <AccordionBody className="leading-6 p-2">
        <Table>
          <TableHead>
            {renderInventoryTableHead()}
          </TableHead>
          <TableBody>
            {val.itemsArr.map((item: InstockItem) => (
              <TableRow key={item.sku}>
                <TableCell>{item.lot}</TableCell>
                <TableCell>{item.sku}</TableCell>
                <TableCell className="text-wrap">{item.lead}</TableCell>
                <TableCell className="text-wrap">{item.description}</TableCell>
                <TableCell>
                  <div className='grid justify-items-center'>
                    <Badge color='emerald'>{item.msrp}</Badge>
                    <br />
                    <Badge color='blue'>{item.reserve ?? 0}</Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge color="indigo">{item.shelfLocation}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </AccordionBody>
    </Accordion>
  )

  const renderItemTable = (auctionInfo: AuctionInfo) => (
    <>
      <div className="mt-3">
        {renderTopRowsTable(auctionInfo)}
      </div>
      <div className="mt-3">
        {renderInventoryTable(auctionInfo)}
      </div>
    </>
  )

  const onEditModeChange = (value: boolean) => setEditMode(value)
  const renderAuctionCard = () => {
    if (auctionHistoryArr.map) {
      return auctionHistoryArr.map((val, index) => (
        <Card key={index} className='!bg-[#223] !border-slate-500 border-2'>
          <div className="flex gap-2">
            <h4>Lot #{val.lot}</h4>
            {editMode ? <Button
              color="rose"
              className="absolute right-32"
              onClick={() => deleteAuctionRecord(val)}
            >
              Delete
            </Button> : undefined}
            <Button
              color="emerald"
              className="absolute right-6"
              tooltip="Download Hibid Compatible CSV"
              onClick={() => getAuctionRecordCSV(val.lot)}
            >
              <FaFileCsv className="mr-1" /> CSV
            </Button>
          </div>
          <p>Item Lot # Starts From {val.lot}</p>
          <h6>{val.title}</h6>
          <hr />
          <div className="flex gap-6">
            <Badge color="emerald">Min MSRP: {val.minMSRP ?? 0}</Badge>
            <Badge color="rose">Max MSRP: {val.maxMSRP ?? 0}</Badge>
            <Badge color="blue" className="absolute right-20">
              Total Items: {val.topRow ? val.topRow.length + val.itemsArr.length : val.itemsArr.length}
            </Badge>
          </div>
          {renderItemTable(val)}
          <hr />
          <div className="flex p-4 pb-0">
            <div>
              <p className="!text-slate-500">Open Time: {moment(val.openTime).format('LLL')}</p>
              <p className="!text-slate-500">Close Time: {moment(val.closeTime).format('LLL')}</p>
            </div>
            <div className="absolute right-16 mt-1">
              {renderCountDown(val.closeTime, val.openTime)}
            </div>
          </div>
        </Card>
      ))
    } else {
      return <h2>No Auction Records Found</h2>
    }
  }

  const renderSoldTable = (record: RemainingInfo) => {
    return (
      <Accordion>
        <AccordionHeader className="text-sm fontr-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
          💵 Sold Items
          <Badge color="emerald" className="absolute right-20">Sold: {record.soldItems.length ?? 0}</Badge>
        </AccordionHeader>
        <AccordionBody className="leading-6 p-2">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell className="w-16 align-middle text-center">Lot#</TableHeaderCell>
                <TableHeaderCell className="w-20 align-middle text-center">SKU</TableHeaderCell>
                <TableHeaderCell className="w-36">Lead</TableHeaderCell>
                <TableHeaderCell className="w-24">Bid Amount</TableHeaderCell>
                <TableHeaderCell className="w-24 align-middle text-center">Reserve</TableHeaderCell>
                <TableHeaderCell className="w-24 align-middle text-center">Shelf</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {record.soldItems.map((sold: SoldItem) => (
                <TableRow key={sold.sku}>
                  <TableCell>{sold.clotNumber}</TableCell>
                  <TableCell>{sold.sku}</TableCell>
                  <TableCell className="text-wrap">
                    {sold.lead}
                  </TableCell>
                  <TableCell className="align-middle text-center">
                    <Badge color='green'>${sold.bidAmount}</Badge>
                  </TableCell>
                  <TableCell className="align-middle text-center">
                    <Badge color='indigo' className='font-bold'>${sold.reserve}</Badge>
                  </TableCell>
                  <TableCell className="align-middle text-center">
                    <Badge color="indigo" className='font-bold'>{sold.shelfLocation}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </AccordionBody>
      </Accordion>
    )
  }

  const renderUnsoldTable = (record: RemainingInfo) => {
    return (
      <Accordion>
        <AccordionHeader className="text-sm font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
          📦 Unsold Items
          <Badge color="rose" className="absolute right-20">Unsold: {record.unsoldItems.length ?? 0}</Badge>
        </AccordionHeader>
        <AccordionBody className="leading-6 p-2">
          <Table>
            <TableHead>
              {renderInventoryTableHead()}
            </TableHead>
            <TableBody>
              {record.unsoldItems.map((unsold: InstockItem) => (
                <TableRow key={unsold.sku}>
                  <TableCell className="align-middle text-center">{unsold.lot}</TableCell>
                  <TableCell className="align-middle text-center">{unsold.sku}</TableCell>
                  <TableCell className="text-wrap">{unsold.lead}</TableCell>
                  <TableCell className="text-wrap">{unsold.description}</TableCell>
                  <TableCell className="align-middle text-center">
                    <div className='grid justify-items-center'>
                      <Badge color='emerald'>${unsold.msrp}</Badge>
                      <br />
                      <Badge color='blue'>${unsold.reserve ?? 0}</Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge color="indigo">{unsold.shelfLocation}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </AccordionBody>
      </Accordion>
    )
  }

  const deleteRemainingRecord = async (record: RemainingInfo) => {
    setLoading(true)
    await axios({
      method: 'delete',
      url: `${server}/inventoryController/deleteRemainingRecord`,
      responseType: 'text',
      timeout: 8000,
      withCredentials: true,
      data: JSON.stringify({ 'remainingLotNumber': record.lot })
    }).then((res: AxiosResponse) => {
      if (res.status > 200) return alert('Failed to Delete Remaining Record')
      getAuctionAndRemainingArr()
    }).catch((err: AxiosError) => {
      setLoading(false)
      alert('Failed to Delete Remaining Record: ' + err.response?.data)
    })
    setLoading(false)
  }

  const renderRemainingCard = () => {
    if (remainingHistoryArr.map) {
      return remainingHistoryArr.map((remainingRecord, index) => (
        <Card key={index} className="!bg-[#223] border-2 !border-slate-500	">
          <h4>Lot #{remainingRecord.lot}</h4>
          {editMode ? <Button
            color="rose"
            className="absolute right-12 top-6"
            onClick={() => deleteRemainingRecord(remainingRecord)}
          >
            Delete
          </Button> : undefined}
          <hr />
          <Badge color='blue'>
            Total Items: {remainingRecord.totalItems}
          </Badge>
          <div className="mt-3">
            {renderSoldTable(remainingRecord)}
          </div>
          <div className="mt-3">
            {renderUnsoldTable(remainingRecord)}
          </div>
          <hr />
          <p className="mt-3">Time Closed: {moment(remainingRecord.timeClosed).format('LLL')}</p>
        </Card>
      ))
    } else {
      return <h2>No Remaining History Found</h2>
    }
  }

  return (
    <div ref={topRef}>
      {renderRemainingRecordModal()}
      <Grid numItems={2} className="gap-3">
        <Col>
          <Card className="min-h-[90vh]">
            <div className="flex">
              <h2>💰 Auction History</h2>
              <Button
                color='emerald'
                className="absolute right-12"
                tooltip="Refresh Both Column"
                onClick={getAuctionAndRemainingArr}
              >
                <FaRotate />
              </Button>
            </div>
            <hr />
            <div className="grid gap-3">
              <div className="right-12 flex absolute">
                <label>Edit Mode</label>
                <Switch
                  className=" ml-3"
                  color='rose'
                  checked={editMode}
                  onChange={onEditModeChange}
                />
              </div>
              <br />
              {renderAuctionCard()}
            </div>
          </Card>
        </Col>
        <Col>
          <Card className="min-h-[90vh]">
            <div className="flex">
              <h2>📜 Remaining History</h2>
              <Button
                color='blue'
                className="absolute right-12"
                onClick={() => setShowremainingModal(true)}
              >
                + New remaining Record
              </Button>
            </div>
            <hr />
            <Subtitle></Subtitle>
            <div className="grid gap-3">
              {renderRemainingCard()}
            </div>
          </Card>
        </Col>
      </Grid>
    </div>
  )
}
export default AuctionHistory