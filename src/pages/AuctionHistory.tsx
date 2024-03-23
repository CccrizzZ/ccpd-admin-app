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
import { FaAngleDown, FaFileCsv, FaRotate } from "react-icons/fa6"
import {
  RemainingInfo,
  AuctionInfo,
  InstockItem,
  SoldItem
} from "../utils/Types"
import axios, { AxiosError, AxiosResponse } from "axios"
import {
  server,
  stringToNumber,
  downloadCustomNameFile
} from "../utils/utils"
import { FaAngleUp } from 'react-icons/fa6'
import ImportUnsoldModal from "../components/ImportUnsoldModal"
import RemainingAuditModal from "../components/RemainingAuditModal"

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
  const { setLoading } = useContext(AppContext)
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
  const [showImportUnsold, setShowImportUnsold] = useState<boolean>(false)
  const [showAuditModal, setShowAuditModal] = useState<boolean>(false)

  const [targetAuctionLot, setTargetAuctionLot] = useState<number>(0)

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

  const createRemainingRecord = async () => {
    if (uploadedFile) {
      // append to form data
      const formData = new FormData()
      formData.append('xls', uploadedFile)
      formData.append('lot', String(lotToClose))
      setLoading(true)
      await axios({
        method: 'post',
        url: `${server}/inventoryController/createRemainingRecord`,
        responseType: 'blob',
        timeout: 8000,
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      }).then(async (res: AxiosResponse) => {
        if (res.status > 200) return alert('Failed to Get CSV')
      }).catch((err: AxiosError) => {
        setLoading(false)
        alert('Failed Fetching Auction CSV: ' + err.response?.data)
      })
      setLoading(false)
      setShowremainingModal(false)
      getAuctionAndRemainingArr()
    }
  }

  const handleLotChange = (event: React.ChangeEvent<HTMLInputElement>) => setLotToClose(stringToNumber(event.target.value))

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) setUploadedFile(event.target.files[0])
  }

  const findAuction = (auctionLot: number) => auctionHistoryArr.find((val) => val.lot === auctionLot)

  const renderImportRemainingRecordModal = () => (
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
              accept=".xls, .xlsx"
              onChange={handleFileChange}
            />
          </Form.Group>
        </div>
        <hr />
        <div className="flex">
          <Button color="slate" onClick={() => setShowremainingModal(false)}>Close</Button>
          <Button className="absolute right-6" color="emerald" onClick={createRemainingRecord}>Submit</Button>
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
      diff = `⏱️ ${Math.floor(close.diff(open, 'hours') / 24)} Days ${close.diff(open, 'hours') % 24} Hours Until Closing` // ${close.diff(open, 'hours')} Hours ${close.diff(open, 'minutes')} Minutes
    }

    return (
      <Badge color={diff.length > 17 ? 'blue' : 'emerald'}>
        <div className="pt-2">
          <h6>{diff}</h6>
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

  const duplicateTopRowItem = async (auc: AuctionInfo, lot: number) => {
    // find that item in auction record
    const auctionRecord = findAuction(auc.lot)
    if (auctionRecord) {
      const duplicateItem = auctionRecord.topRow.find((val) => val.lot === lot)
      if (duplicateItem) {
        duplicateItem.lot += 1
      }

      // send duplication request
      setLoading(true)
      await axios({
        method: 'post',
        url: `${server}/inventoryController/addTopRowItem`,
        responseType: 'text',
        timeout: 8000,
        withCredentials: true,
        data: JSON.stringify({ 'auctionLot': auc.lot, 'newItem': duplicateItem })
      }).then((res: AxiosResponse) => {
        if (res.status === 200) {
          getAuctionAndRemainingArr()
        }
      }).catch((err: AxiosError) => {
        setLoading(false)
        alert('Failed Adding Item to Top Row: ' + err.response?.data)
      })
      setLoading(false)
    }
  }

  const renderTopRowsTable = (auction: AuctionInfo) => (
    <Accordion>
      <AccordionHeader className="text-sm font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
        ⚡ Top Row Inventories
        <Badge color="orange" className="absolute right-20 font-bold">
          Total Items: {auction.topRow ? auction.topRow.length : 0}
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
              <TableHeaderCell className="w-30 align-middle text-center">MSRP<br />Reserve<br />Start Bid</TableHeaderCell>
              {editMode ?
                <TableHeaderCell className="w-30 align-middle text-center">Edit</TableHeaderCell>
                : <TableHeaderCell className="w-30">Shelf</TableHeaderCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {auction.topRow ? auction.topRow.slice(0).reverse().map((item: InstockItem) => (
              <TableRow key={item.sku}>
                <TableCell>{item.lot}</TableCell>
                <TableCell>{item.sku}</TableCell>
                <TableCell className="text-wrap">{item.lead}</TableCell>
                <TableCell className="text-wrap">{item.description}</TableCell>
                <TableCell className="justify-center">
                  <div className='grid justify-items-center'>
                    <Badge color='emerald'>${item.msrp}</Badge>
                    <FaAngleUp className="m-0" />
                    <Badge color='orange'>${item.reserve ?? 0}</Badge>
                    <FaAngleUp className="m-0" />
                    <Badge color='stone'>${item.startBid ?? 0}</Badge>
                  </div>
                </TableCell>
                {
                  editMode ?
                    <TableCell>
                      <Button
                        color="rose"
                        size="xs"
                        onClick={() => deleteTopRowItem(item, auction.lot)}
                      >
                        Delete
                      </Button>
                      <br />
                      <Button
                        color="blue"
                        size="xs"
                        onClick={() => duplicateTopRowItem(auction, item.lot)}
                      >
                        Duplicate
                      </Button>
                    </TableCell> :
                    <TableCell>
                      <Badge color="purple" className="font-bold">{item.shelfLocation}</Badge>
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
              onClick={() => createNewTopRowItem(auction.lot)}
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
      <TableHeaderCell className="w-32 align-middle text-center">MSRP<br />Reserve</TableHeaderCell>
      <TableHeaderCell className="w-30 align-middle text-center">Shelf</TableHeaderCell>
    </TableRow>
  )

  const renderInventoryTable = (auction: AuctionInfo) => (
    <Accordion>
      <AccordionHeader className="text-sm font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
        📜 Inventories on Auction
        <Badge color="orange" className="absolute right-20 font-bold">
          Total Items: {auction.itemsArr.length}
        </Badge>
      </AccordionHeader>
      <AccordionBody className="leading-6 p-2">
        <Table>
          <TableHead>
            {renderInventoryTableHead()}
          </TableHead>
          <TableBody>
            {auction.itemsArr.map((item: InstockItem) => (
              <TableRow key={item.sku}>
                <TableCell>{item.lot}</TableCell>
                <TableCell>{item.sku}</TableCell>
                <TableCell className="text-wrap">{item.lead}</TableCell>
                <TableCell className="text-wrap">{item.description}</TableCell>
                <TableCell>
                  <div className='grid justify-items-center'>
                    <Badge color='emerald'>${item.msrp}</Badge>
                    <FaAngleUp className="m-0" />
                    <Badge color='blue'>{item.reserve ?? 0}</Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge color="purple" className="font-bold">{item.shelfLocation}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </AccordionBody>
    </Accordion>
  )

  // remove unsold item array from auction by remaining lot number
  const deleteUnsold = async (auctionLot: number, remainingLot: number) => {
    setLoading(true)
    await axios({
      method: 'delete',
      url: `${server}/inventoryController/deleteUnsoldItems`,
      responseType: 'text',
      timeout: 8000,
      withCredentials: true,
      data: JSON.stringify({
        'auctionLotNumber': auctionLot,
        'remainingLotNumber': remainingLot,
      })
    }).then((res: AxiosResponse) => {
      if (res.status > 200) return alert('Failed to Delete')
      alert(`Deleted Remaining Inventory Set: ${remainingLot} from Auction ${auctionLot}`)
      getAuctionAndRemainingArr()
    }).catch((err: AxiosError) => {
      setLoading(false)
      alert('Failed to Delete Remaining Inventory Set: ' + err.response?.data)
    })
    setLoading(false)
  }

  const renderLastAuctionItemTable = (auction: AuctionInfo) => {
    if (!auction.previousUnsoldArr) return undefined
    return Object.entries(auction.previousUnsoldArr).map(([key, item], index) => (
      <Accordion key={index}>
        <AccordionHeader className="text-sm font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
          📦 Unsold From Auction {key} (Randomly Sorted)
          <Badge color="orange" className="absolute right-20 font-bold">
            Total Items: {item.length}
          </Badge>
        </AccordionHeader>
        <AccordionBody className="leading-6 p-2">
          <Button
            className="ml-6"
            color="rose"
            onClick={() => deleteUnsold(auction.lot, Number(key))}
          >
            Delete
          </Button>
          <Table>
            <TableHead>
              {renderInventoryTableHead()}
            </TableHead>
            <TableBody>
              {item.map((item: InstockItem) => (
                <TableRow key={item.sku}>
                  <TableCell>{item.lot}</TableCell>
                  <TableCell>{item.sku}</TableCell>
                  <TableCell className="text-wrap">{item.lead}</TableCell>
                  <TableCell className="text-wrap">{item.description}</TableCell>
                  <TableCell>
                    <div className='grid justify-items-center'>
                      <Badge color='emerald'>${item.msrp}</Badge>
                      <FaAngleUp className="m-0" />
                      <Badge color='blue'>{item.reserve ?? 0}</Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge color="purple" className="font-bold">{item.shelfLocation}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </AccordionBody>
      </Accordion>
    ))
  }

  const renderItemTable = (auctionInfo: AuctionInfo) => (
    <>
      <div className="mt-3">
        {renderTopRowsTable(auctionInfo)}
      </div>
      <div className="mt-3">
        {renderInventoryTable(auctionInfo)}
      </div>
      <div className="mt-3">
        {renderLastAuctionItemTable(auctionInfo)}
      </div>
    </>
  )

  const showImportModal = (lot: number) => {
    setTargetAuctionLot(lot)
    setShowImportUnsold(true)
  }
  const onEditModeChange = (value: boolean) => setEditMode(value)
  const renderAuctionCard = () => {
    if (auctionHistoryArr.map) {
      return auctionHistoryArr.map((val, index) => (
        <Card key={index} className='!bg-[#223] !border-slate-500 border-2'>
          <ImportUnsoldModal
            show={showImportUnsold}
            hide={() => setShowImportUnsold(false)}
            auctionLotNumber={targetAuctionLot}
            refreshAuction={getAuctionAndRemainingArr}
          />
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
          <p>Item Lot # Starts From {val.itemLotStart}</p>
          <h6>{val.title}</h6>
          <hr />
          <div className="flex gap-6">
            <Button color="indigo" onClick={() => showImportModal(val.lot)}>
              Import Unsold Items
            </Button>
            <br />
            <Badge color="emerald" className="absolute right-20 font-bold">
              Total Items: {val.totalItems}
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
          <Badge color="emerald" className="absolute right-20 font-bold">
            Sold: {record.soldItems.length ?? 0}
          </Badge>
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
                <TableHeaderCell className="w-24 align-middle text-center">Shelf<br />AMT</TableHeaderCell>
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
                    <Badge color='blue' className='font-bold'>${sold.reserve}</Badge>
                  </TableCell>
                  <TableCell className="align-middle text-center">
                    <div className='grid justify-items-center'>
                      <Badge color="purple" className='font-bold'>{sold.shelfLocation}</Badge>
                      <FaAngleDown className="m-0" />
                      <Badge color='emerald' className='font-bold'>{sold.quantityInstock}</Badge>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </AccordionBody>
      </Accordion>
    )
  }

  const renderUnsoldTable = (record: RemainingInfo) => (
    <Accordion>
      <AccordionHeader className="text-sm font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
        📦 Unsold Items
        <Badge color="red" className="font-bold absolute right-20">
          Unsold: {record.unsoldItems.length ?? 0}
        </Badge>
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
                    <FaAngleUp className="m-0" />
                    <Badge color='blue'>${unsold.reserve ?? 0}</Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge color="purple" className="font-bold">{unsold.shelfLocation}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </AccordionBody>
    </Accordion>
  )

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

  const renderErrorItemsTable = (record: RemainingInfo) => (
    <Accordion>
      <AccordionHeader className="text-sm font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
        🚩 Error Items (out-of-stock)
        <Badge color="gray" className="font-bold absolute right-20">
          Error Items: {record.errorItems?.length ?? 0}
        </Badge>
      </AccordionHeader>
      <AccordionBody className="leading-6 p-2">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell className="w-16 align-middle text-center">Lot#</TableHeaderCell>
              <TableHeaderCell className="w-18 align-middle text-center">SKU</TableHeaderCell>
              <TableHeaderCell className="w-32">Lead</TableHeaderCell>
              <TableHeaderCell className="w-32 align-middle text-center">Bid<br />Reserve</TableHeaderCell>
              <TableHeaderCell className="w-30 align-middle text-center">Shelf</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {record.errorItems?.map((unsold: SoldItem) => (
              <TableRow key={unsold.sku}>
                <TableCell className="align-middle text-center">{unsold.clotNumber}</TableCell>
                <TableCell className="align-middle text-center">{unsold.sku}</TableCell>
                <TableCell className="text-wrap">{unsold.lead}</TableCell>
                <TableCell className="align-middle text-center">
                  <div className='grid justify-items-center'>
                    <Badge color='emerald'>${unsold.bidAmount}</Badge>
                    <FaAngleUp className="m-0" />
                    <Badge color='blue'>${unsold.reserve ?? 0}</Badge>
                  </div>
                </TableCell>
                <TableCell className="align-middle text-center">
                  <div className='grid justify-items-center'>
                    <Badge color="purple" className="font-bold">{unsold.shelfLocation}</Badge>
                    <FaAngleDown className="m-0" />
                    <Badge color="emerald" className="font-bold">{unsold.quantityInstock}</Badge>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </AccordionBody>
    </Accordion>
  )

  const renderDatabaseResultTable = (record: RemainingInfo) => {
    if (!record.isProcessed) {
      return (
        <Button
          className="w-32"
          color='orange'
          onClick={() => setShowAuditModal(true)}
        >
          Audit
        </Button>
      )
    } else {
      return (
        <Accordion>
          <AccordionHeader className="text-sm font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
            🖍️ Database Changes Made
            <Badge color="blue" className="font-bold absolute right-20">
              Items Deducted: {record.deducted ? record.deducted.length : 0}
            </Badge>
          </AccordionHeader>
          <AccordionBody className="leading-6 p-2">
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeaderCell className="w-16 align-middle text-center">Lot#</TableHeaderCell>
                  <TableHeaderCell className="w-18 align-middle text-center">SKU</TableHeaderCell>
                  <TableHeaderCell className="w-32">Lead</TableHeaderCell>
                  <TableHeaderCell className="w-32 align-middle text-center">Bid<br />Reserve</TableHeaderCell>
                  <TableHeaderCell className="w-30 align-middle text-center">
                    Shelf
                    <br />
                    Before
                    <br />
                    After
                  </TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {record.deducted?.map((deducted: SoldItem) => (
                  <TableRow key={deducted.sku}>
                    <TableCell className="align-middle text-center">{deducted.clotNumber}</TableCell>
                    <TableCell className="align-middle text-center">{deducted.sku}</TableCell>
                    <TableCell className="text-wrap">{deducted.lead}</TableCell>
                    <TableCell className="align-middle text-center">
                      <div className='grid justify-items-center'>
                        <Badge color='emerald'>${deducted.bidAmount}</Badge>
                        <FaAngleUp className="m-0" />
                        <Badge color='blue'>${deducted.reserve ?? 0}</Badge>
                      </div>
                    </TableCell>
                    <TableCell className="align-middle text-center">
                      <div className='grid justify-items-center'>
                        <Badge color="purple" className="font-bold">{deducted.shelfLocation}</Badge>
                        <FaAngleDown className="m-0" />
                        <Badge color="emerald" className="font-bold">{deducted.quantityInstock}</Badge>
                        <FaAngleDown className="m-0" />
                        <Badge color="rose" className="font-bold">{Number(deducted.quantityInstock) - 1}</Badge>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </AccordionBody>
        </Accordion>
      )
    }
  }

  const renderRemainingCard = () => {
    if (remainingHistoryArr.map) {
      return remainingHistoryArr.map((remainingRecord, index) => (
        <Card key={index} className={`!bg-[#223] border-2 ${remainingRecord.isProcessed ? '!border-emerald-600' : '!border-slate-500'}`}>
          <RemainingAuditModal
            show={showAuditModal}
            close={() => setShowAuditModal(false)}
            remainingRecord={remainingRecord}
            auctionRecord={findAuction(remainingRecord.lot)}
          />
          <h4>
            {remainingRecord.isProcessed ? <>✅</> : undefined}Lot #{remainingRecord.lot}
          </h4>
          {editMode ?
            <Button
              color="rose"
              className="absolute right-12 top-6"
              onClick={() => deleteRemainingRecord(remainingRecord)}
            >
              Delete
            </Button> : undefined}
          <hr />
          <Badge className="font-bold" color='emerald'>
            Total Items: {remainingRecord.totalItems}
          </Badge>
          <div className="mt-3">
            {renderSoldTable(remainingRecord)}
          </div>
          <div className="mt-3">
            {renderUnsoldTable(remainingRecord)}
          </div>
          <div className="mt-3">
            {renderErrorItemsTable(remainingRecord)}
          </div>
          <hr />
          <div className="mt-3">
            {renderDatabaseResultTable(remainingRecord)}
          </div>
          <hr />
          <Badge className="font-bold" color='rose'>
            Time Closed: {moment(remainingRecord.timeClosed).format('LLL')}
          </Badge>
        </Card>
      ))
    } else {
      return <h2>No Remaining History Found</h2>
    }
  }

  return (
    <div ref={topRef}>
      {renderImportRemainingRecordModal()}
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