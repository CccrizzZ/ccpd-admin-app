import { useContext, useEffect, useRef, useState } from "react"
import { AppContext } from "../App"
import { Modal } from "react-bootstrap"
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
  TableCell
} from "@tremor/react"
import moment from "moment"
import { FaRotate, FaUpload } from "react-icons/fa6"
import {
  RemainingInfo,
  AuctionInfo
} from "../utils/Types"
import axios, { AxiosError, AxiosResponse } from "axios"
import { server } from "../utils/utils"

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
]

const mockAuctionInfo: AuctionInfo[] = [
  {
    lot: 113,
    totalItems: 86,
    openTime: '2024-03-02',
    closeTime: '2024-03-08',
    closed: false,
    title: 'LOT 111, Amazon Tools Ryobi DeWalt High Value Items.',
    description: 'Mostly power tools, high value (>=$80)',
    minMSRP: 25,
    maxMSRP: 660,
    remainingResolved: false,
    itemsArr: [
      { sku: 33250, msrp: 30, title: '', amount: 1 },
      { sku: 33251, msrp: 130, title: '', amount: 1 },
      { sku: 33252, msrp: 30, title: '', amount: 1 },
      { sku: 33253, msrp: 30, title: '', amount: 1 },
      { sku: 33254, msrp: 30, title: '', amount: 1 },
      { sku: 33255, msrp: 30, title: '', amount: 1 },
      { sku: 33256, msrp: 230, title: '', amount: 1 },
      { sku: 33257, msrp: 25, title: '', amount: 1 },
      { sku: 33258, msrp: 660, title: '', amount: 1 },
      { sku: 33259, msrp: 30, title: '', amount: 1 },
      { sku: 33260, msrp: 30, title: '', amount: 1 },
    ]
  },
  {
    lot: 111,
    totalItems: 111,
    openTime: '2024-02-10',
    closeTime: '2024-02-13',
    closed: true,
    title: 'LOT 111, Amazon Tools Ryobi DeWalt High Value Items.',
    description: 'Mostly power tools, high value (>=$80)',
    minMSRP: 75,
    maxMSRP: 550,
    remainingResolved: false,
    itemsArr: [
      { sku: 33250, msrp: 30, title: '', amount: 1 },
      { sku: 33251, msrp: 130, title: '', amount: 1 },
      { sku: 33252, msrp: 30, title: '', amount: 1 },
      { sku: 33253, msrp: 30, title: '', amount: 1 },
      { sku: 33254, msrp: 30, title: '', amount: 1 },
      { sku: 33255, msrp: 30, title: '', amount: 1 },
      { sku: 33256, msrp: 230, title: '', amount: 1 },
      { sku: 33257, msrp: 30, title: '', amount: 1 },
      { sku: 33258, msrp: 430, title: '', amount: 1 },
      { sku: 33259, msrp: 30, title: '', amount: 1 },
      { sku: 33260, msrp: 30, title: '', amount: 1 },
    ]
  },
  {
    lot: 107,
    totalItems: 98,
    openTime: '2024-02-01',
    closeTime: '2024-02-06',
    closed: true,
    title: 'LOT 107, Amazon Tools Ryobi DeWalt High Value Items.',
    description: 'Mostly power tools, high value (>=$80)',
    minMSRP: 30,
    maxMSRP: 430,
    remainingResolved: true,
    itemsArr: [
      { sku: 33250, msrp: 30, title: '', amount: 1 },
      { sku: 33251, msrp: 130, title: '', amount: 1 },
      { sku: 33252, msrp: 30, title: '', amount: 1 },
      { sku: 33253, msrp: 30, title: '', amount: 1 },
      { sku: 33254, msrp: 30, title: '', amount: 1 },
      { sku: 33255, msrp: 30, title: '', amount: 1 },
      { sku: 33256, msrp: 230, title: '', amount: 1 },
      { sku: 33257, msrp: 30, title: '', amount: 1 },
      { sku: 33258, msrp: 430, title: '', amount: 1 },
      { sku: 33259, msrp: 30, title: '', amount: 1 },
      { sku: 33260, msrp: 30, title: '', amount: 1 },
    ]
  }
]

const AuctionHistory: React.FC = () => {
  const { setLoading, userInfo } = useContext(AppContext)
  const topRef = useRef<HTMLDivElement>(null)
  // const [dragging, setDragging] = useState<boolean>(false)
  const [showremainingModal, setShowremainingModal] = useState<boolean>(false)
  const [auctionHistoryArr, setAuctionArr] = useState<AuctionInfo[]>(mockAuctionInfo)
  const [remainingHistoryArr, setremainingHistoryArr] = useState<RemainingInfo[]>(mockremainingInfo)
  const [countDown, setCountDown] = useState<number>(0)

  useEffect(() => {

  }, [])

  const getAuctionAndRemainingArr = () => {
    // get both column data in one call
  }

  const getAuctionRecordCSV = async () => {
    setLoading(true)
    await axios({
      method: 'post',
      url: server + '/inventoryController/getInstockCsv',
      responseType: 'blob',
      timeout: 8000,
      data: { 'lot': 100 },
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
      diff = `⏱️ ${close.diff(open, 'days')} Days ${close.diff(open, 'hours')} Hours ${close.diff(open, 'minutes')} Minutes`
    }

    return (
      <Badge color={diff.length > 17 ? 'blue' : 'emerald'}>
        <div className="pt-2">
          {diff.length > 17 ? 'Time Untill Closing' : undefined}
          <h6>{diff}</h6>
        </div>
      </Badge>
    )
  }

  const renderInventoryTable = (val: AuctionInfo) => (
    <Accordion>
      <AccordionHeader className="text-sm font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
        📜 Inventories On Auction
      </AccordionHeader>
      <AccordionBody className="leading-6 p-2">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>SKU</TableHeaderCell>
              <TableHeaderCell>Title</TableHeaderCell>
              <TableHeaderCell>MSRP (CAD)</TableHeaderCell>
              <TableHeaderCell>Amount</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {val.itemsArr.map((item) => (
              <TableRow key={item.sku}>
                <TableCell>{item.sku}</TableCell>
                <TableCell>{item.title}</TableCell>
                <TableCell>{item.msrp}</TableCell>
                <TableCell>
                  <Badge color="emerald">{item.amount}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </AccordionBody>
    </Accordion>
  )

  const renderAuctionCard = () => auctionHistoryArr.map((val, index) => (
    <Card key={index} className='!bg-[#223] !border-slate-500 border-2'>
      <div className="flex gap-2">
        <h4>Lot #{val.lot}</h4>
        <Button
          color="emerald"
          className="absolute right-6"
          onClick={getAuctionRecordCSV}
        >
          Download CSV
        </Button>
      </div>
      <h6>{val.title}</h6>
      <hr />
      <div className="flex gap-6">
        <Badge color="emerald">Min MSRP: {val.minMSRP ?? 'No minimum'}</Badge>
        <Badge color="rose">Max MSRP: {val.maxMSRP ?? 'No maximum'}</Badge>
      </div>
      <div className="mt-3">
        {renderInventoryTable(val)}
      </div>
      <hr />
      <div className="flex p-4">
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

  const renderremainingCard = () => remainingHistoryArr.map((val, index) => (
    <Card key={index} className="!bg-[#223] border-2 !border-slate-500	">
      <h4>Lot #{val.lot}</h4>
      <h6>Total Items: {val.totalItems}</h6>
      <h6>💵 Sold Items: {val.sold}</h6>
      <p>Sold Over Reserve: 8</p>
      <p>Under or Equal Reserve: 3</p>
      <h6>📦 Unsold Items: {val.totalItems - val.sold}</h6>
      {/* <h6>Irregular Items: 0</h6> */}
      <small>Time Closed: {moment(val.timeClosed).format('LLL')}</small>
    </Card>
  ))

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