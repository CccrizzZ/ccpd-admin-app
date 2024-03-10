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
import { FaFileCirclePlus, FaRotate, FaUpload } from "react-icons/fa6"
import {
  RemainingInfo,
  AuctionInfo,
  InstockInventory,
  InstockItem
} from "../utils/Types"
import axios, { AxiosError, AxiosResponse } from "axios"
import { server, stringToNumber } from "../utils/utils"

const mockremainingInfo: RemainingInfo[] = [
  {
    lot: 111,
    totalItems: 111,
    sold: 11,
    unsold: 100,
    soldItems: [
      { sku: 10020, amt: 1 },
      { sku: 10021, amt: 1 },
      { sku: 10022, amt: 1 },
      { sku: 10023, amt: 2 },
      { sku: 10024, amt: 1 },
      { sku: 10025, amt: 1 },
      { sku: 10026, amt: 4 },
      { sku: 10027, amt: 1 },
    ],
    timeClosed: '2024-02-13'
  },
  {
    lot: 112,
    totalItems: 111,
    sold: 11,
    unsold: 100,
    soldItems: [
      { sku: 10020, amt: 1 },
      { sku: 10021, amt: 1 },
      { sku: 10022, amt: 1 },
      { sku: 10023, amt: 2 },
      { sku: 10024, amt: 1 },
      { sku: 10025, amt: 1 },
      { sku: 10026, amt: 4 },
      { sku: 10027, amt: 1 },
    ],
    timeClosed: '2024-02-14'
  },
  {
    lot: 113,
    totalItems: 111,
    sold: 11,
    unsold: 100,
    soldItems: [
      { sku: 10020, amt: 1 },
      { sku: 10021, amt: 1 },
      { sku: 10022, amt: 1 },
      { sku: 10023, amt: 2 },
      { sku: 10024, amt: 1 },
      { sku: 10025, amt: 1 },
      { sku: 10026, amt: 4 },
      { sku: 10027, amt: 1 },
    ],
    timeClosed: '2024-02-15'
  },
]

const initInstockItem: InstockItem = {
  lot: 0,
  sku: 0,
  shelfLocation: '',
  msrp: 0,
  lead: '',
  description: ''
}

const AuctionHistory: React.FC = () => {
  const { setLoading, userInfo } = useContext(AppContext)
  const topRef = useRef<HTMLDivElement>(null)
  // const [dragging, setDragging] = useState<boolean>(false)
  const [showremainingModal, setShowremainingModal] = useState<boolean>(false)
  const [auctionHistoryArr, setAuctionArr] = useState<AuctionInfo[]>([])
  const [remainingHistoryArr, setremainingHistoryArr] = useState<RemainingInfo[]>([])
  const [topRowRec, setTopRowRec] = useState<Record<string, InstockItem[]>>({
    '120': [],
    '105': []
  })
  const [newTopRowItem, setNewTopRowItem] = useState<InstockItem>(initInstockItem)
  // const [editMode, setEditMode] = useState<boolean>(false)
  // const [countDown, setCountDown] = useState<number>(0)

  useEffect(() => {
    getAuctionAndRemainingArr()
  }, [])

  // apend to top row record
  const appendItemToRecord = (auctionLotNumber: string | number, newItem: InstockItem) => {
    setTopRowRec(prevRecords => ({
      ...prevRecords,
      [auctionLotNumber]: [...(prevRecords[auctionLotNumber] || []), newItem],
    }))
  }

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
      setAuctionArr(data['auctions'])
      if (data['auctions'].length > 0) {
        const arr: AuctionInfo[] = data['auctions']
        // TODO: add top row 
        // populate every auction's top row record with empty array
        arr.forEach(element => setTopRowRec({ ...topRowRec, [element.lot]: [] }))
      }
      setremainingHistoryArr(data['remaining'])
    }).catch((err: AxiosError) => {
      setLoading(false)
      alert('Failed Fetching QA Records: ' + err.message)
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
        'topRow': topRowRec[lot]
      },
      withCredentials: true
    }).then(async (res: AxiosResponse) => {
      if (res.status > 200) return alert('Failed to Get CSV')

      // JSON parse csv content
      let file = new Blob([res.data], { type: 'text/csv' })
      const csv = JSON.parse(await file.text())
      file = new Blob([csv], { type: 'text/csv' })

      // way to get custom file name
      let link = document.createElement("a")
      link.setAttribute("href", URL.createObjectURL(file))
      link.setAttribute("download", `${100}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }).catch((err: AxiosError) => {
      setLoading(false)
      alert('Failed Fetching Auction CSV: ' + err.message)
    })
    setLoading(false)
  }

  const executeremainingRecordToDB = () => {
    // send remaining data to server
  }

  const handleFileChange = () => {

  }

  const renderremainingRecordModal = () => (
    <Modal
      show={showremainingModal}
      onHide={() => setShowremainingModal(false)}
      backdrop="static"
      keyboard={false}
      size="lg"
    >
      <div className="p-6">
        <h2>Import Remaining CSV</h2>
        <hr />
        <Grid numItems={3}>
          <Col numColSpan={2}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas velit aliquid itaque ex, doloribus alias dolore! Temporibus minima facilis harum quibusdam laborum, ducimus eligendi blanditiis saepe neque? Aspernatur, quam ipsum.
          </Col>
          <Col numColSpan={1}>
            {/* csv upload box */}
            <div className="rounded-lg h-64 w-64 border-dashed border-[#ffffff] border-2 items-center justify-center">
              <div className="content-center">
                <FaUpload size={50} />
                <p>Drag and Drop CSV File Here</p>
                <input
                  className=""
                  type='file'
                  multiple={false}
                  accept='.csv'
                />
              </div>
            </div>
          </Col>
        </Grid>
        <hr />
        <div className="flex">
          <Button color="slate" onClick={() => setShowremainingModal(false)}>Close</Button>
          <Button className="absolute right-6" color="emerald" onClick={executeremainingRecordToDB}>Submit</Button>
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

  // update inventory amount to auction info arr
  const changeAmount = (direction: number, auc: AuctionInfo) => {
    // setAuctionArr({})
  }

  // TODO: push to database
  // add it into top row array
  const createNewTopRowItem = (auctionLotNum: number) => {
    // null check on new top row item
    if (newTopRowItem.lot === 0) return alert('Lot Number Invalid')
    if (newTopRowItem.sku === 0) return alert('SKU Invalid')
    if (newTopRowItem.shelfLocation === '') return alert('Shelf Location Missing')
    if (newTopRowItem.lead === '') return alert('Lead Missing')
    // check exist
    // if (topRowArr.find((item) => item.lot === newTopRowItem.lot)) alert('Lot Number Existed')
    // append to rec
    // setTopRowRec(prev => {...prev})
    appendItemToRecord(auctionLotNum, newTopRowItem)
    clearNewTopRowItem()
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
  // const onEditModeChange = (value: boolean) => setEditMode(value)
  const renderTopRowsTable = (auctionLotNum: number) => (
    <Accordion>
      <AccordionHeader className="text-sm font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
        ⚡ Inventories to Add Before
      </AccordionHeader>
      <AccordionBody className="leading-6 p-2">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell className="w-16">Lot#</TableHeaderCell>
              <TableHeaderCell className="w-20">SKU</TableHeaderCell>
              <TableHeaderCell>Lead</TableHeaderCell>
              <TableHeaderCell className="w-48">Desc</TableHeaderCell>
              <TableHeaderCell className="w-30">MSRP<br />(CAD)</TableHeaderCell>
              <TableHeaderCell className="w-30">Shelf</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {topRowRec[auctionLotNum].map((item) => (
              <TableRow key={item.sku}>
                <TableCell>{item.lot}</TableCell>
                <TableCell>{item.sku}</TableCell>
                <TableCell className="text-wrap">{item.lead}</TableCell>
                <TableCell className="text-wrap">{item.description}</TableCell>
                <TableCell><Badge color='emerald'>{item.msrp}</Badge></TableCell>
                <TableCell>
                  <Badge color="indigo">{item.shelfLocation}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="grid gap-2 p-6 mt-6 border-slate-600 border-2 rounded pt-0">
          <div className="flex">
            <Button
              className="m-auto flex mb-3 mt-3"
              color="emerald"
              onClick={() => createNewTopRowItem(auctionLotNum)}
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

  const renderInventoryTable = (val: AuctionInfo) => (
    <Accordion>
      <AccordionHeader className="text-sm font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
        📜 Inventories on Auction
      </AccordionHeader>
      <AccordionBody className="leading-6 p-2">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell className="w-18">Lot#</TableHeaderCell>
              <TableHeaderCell className="w-20">SKU</TableHeaderCell>
              <TableHeaderCell>Lead</TableHeaderCell>
              <TableHeaderCell className="w-48">Description</TableHeaderCell>
              <TableHeaderCell className="w-30">MSRP<br />(CAD)</TableHeaderCell>
              <TableHeaderCell className="w-30">Shelf</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {val.itemsArr.map((item) => (
              <TableRow key={item.sku}>
                <TableCell>{item.lot}</TableCell>
                <TableCell>{item.sku}</TableCell>
                <TableCell className="text-wrap">{item.lead}</TableCell>
                <TableCell className="text-wrap">{item.description}</TableCell>
                <TableCell>{item.msrp}</TableCell>
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

  const renderAuctionCard = () => {
    if (auctionHistoryArr.map) {
      return auctionHistoryArr.map((val, index) => (
        <Card key={index} className='!bg-[#223] !border-slate-500 border-2'>
          <div className="flex gap-2">
            <h4>Lot #{val.lot}</h4>
            <Button
              color="emerald"
              className="absolute right-6"
              onClick={() => getAuctionRecordCSV(val.lot)}
            >
              Download Hibid Compatible CSV
            </Button>
          </div>
          <p>Item Lot # Starts From {val.lot}</p>
          <h6>{val.title}</h6>
          <hr />
          <div className="flex gap-6">
            <Badge color="emerald">Min MSRP: {val.minMSRP ?? 'No minimum'}</Badge>
            <Badge color="rose">Max MSRP: {val.maxMSRP ?? 'No maximum'}</Badge>
          </div>
          <div className="mt-3">
            {renderTopRowsTable(val.lot)}
          </div>
          <div className="mt-3">
            {renderInventoryTable(val)}
          </div>
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

  const renderremainingCard = () => {
    if (remainingHistoryArr.map) {
      return remainingHistoryArr.map((val, index) => (
        <Card key={index} className="!bg-[#223] border-2 !border-slate-500	">
          <h4>Lot #{val.lot}</h4>
          <h6>Total Items: {val.totalItems}</h6>
          <Card>
            <Grid numItems={2}>
              <Col>
                <h6>💵 Sold Items: {val.sold}</h6>

              </Col>
              <Col>
                <h6>📦 Unsold Items: {val.totalItems - val.sold}</h6>

              </Col>
            </Grid>
          </Card>
          <small>Time Closed: {moment(val.timeClosed).format('LLL')}</small>
        </Card>
      ))
    } else {
      return <h2>No Remaining History Found</h2>
    }
  }

  return (
    <div ref={topRef}>
      {renderremainingRecordModal()}
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
              {renderremainingCard()}
            </div>
          </Card>
        </Col>
      </Grid>
    </div>
  )
}
export default AuctionHistory