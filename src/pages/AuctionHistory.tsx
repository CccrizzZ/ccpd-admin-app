import { useContext, useRef, useState } from "react"
import { AppContext } from "../App"
import {
  Button,
  Card,
  Col,
  Grid,
  List,
  ListItem,
  Subtitle
} from "@tremor/react"
import moment from "moment"
import { Modal } from "react-bootstrap"
import { FaRotate, FaUpload } from "react-icons/fa6"

type AuctionInfo = {
  lot: number,
  totalItems: number,
  timeOpened: string,
  closed: boolean,
  title?: string,
  description?: string,
  minMSRP?: number,
  maxMSRP?: number,
  startDate?: string,
  inventorySpan?: {
    gt: string,
    lt: string
  }
}

type RemainingInfo = {
  lot: number,
  totalItems: number,
  sold: number,
  unsold: number,
  soldItems: {
    sku: number,
    amt: number
  }[],
  timeClosed: string,
}

// example
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
  }
]

const mockAuctionInfo: AuctionInfo[] = [
  {
    lot: 111,
    totalItems: 111,
    timeOpened: '2024-02-06',
    closed: true,

  }
]

const AuctionHistory: React.FC = () => {
  // const { setLoading, userInfo } = useContext(AppContext)
  const topRef = useRef<HTMLDivElement>(null)
  const [showremainingModal, setShowremainingModal] = useState<boolean>(false)
  const [auctionHistoryArr, setAuctionArr] = useState<AuctionInfo[]>([
    {
      lot: 119,
      title: 'Mainly high count Amazon small items, low values (<=$80)',
      timeOpened: '2024-02-25T12:20:00',
      totalItems: 257,
      closed: false
    }
  ])
  const [remainingHistoryArr, setremainingHistoryArr] = useState<RemainingInfo[]>(mockremainingInfo)

  const getAuctionAndremainingArr = () => {
    // get both column data togeather
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
        <h2>Import remaining CSV</h2>
        <hr />
        <Grid numItems={3}>
          <Col numColSpan={2}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas velit aliquid itaque ex, doloribus alias dolore! Temporibus minima facilis harum quibusdam laborum, ducimus eligendi blanditiis saepe neque? Aspernatur, quam ipsum.
          </Col>
          <Col numColSpan={1}>
            {/* csv upload box */}

            {/*             
            <div className="rounded-lg h-64 w-64 border-dashed border-[#ffffff] border-2 items-center justify-center">
              <div className="content-center">
                <FaUpload size={50} />
                <p>Drag and Drop CSV File Here</p>
              </div>
            </div> */}
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

  const renderAuctionCard = () => auctionHistoryArr.map((val, index) => (
    <Card key={index} style={{ backgroundColor: 'black' }}>
      <h4>Lot #{val.lot}</h4>

      <small>{val.title}</small>
      <Subtitle>Time Opened: {moment(val.timeOpened).format('LLL')}</Subtitle>
    </Card>
  ))

  const renderremainingCard = () => remainingHistoryArr.map((val, index) => (
    <Card key={index}>
      <h4>{val.sold}</h4>
      <List>
        <ListItem>
          <span>Sold: </span>
          {/* <span>{val.sold ?? 0}</span> */}
        </ListItem>
        <ListItem>
          <span>Andy Murray</span>
          <span>7,030</span>
        </ListItem>
      </List>
      {/* <small>{moment(val.time).format('LLL')}</small> */}
    </Card>
  ))

  return (
    <div ref={topRef}>
      {renderremainingRecordModal()}
      <Grid numItems={2} className="gap-2">
        <Col>
          <Card className="min-h-[90vh]">
            <div className="flex">
              <h2>💰 Auction History</h2>
              <Button
                color='emerald'
                className="absolute right-12"
                tooltip="Refresh Both Column"
                onClick={getAuctionAndremainingArr}
              >
                <FaRotate />
              </Button>
            </div>
            <hr />
            <div className="grid gap-2">
              {renderAuctionCard()}
            </div>
          </Card>
        </Col>
        <Col>
          <Card className="min-h-[90vh]">
            <div className="flex">
              <h2>📜 remaining History</h2>
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
            <div className="grid gap-2">

            </div>
          </Card>
        </Col>
      </Grid>
    </div>
  )
}
export default AuctionHistory