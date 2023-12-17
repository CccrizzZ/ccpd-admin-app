import React, { useContext, useEffect, useState } from 'react'
import {
  Grid,
  Badge,
  Col,
  Card,
  Title,
  Text,
  Table,
  TableHead,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  Button,
  DatePicker,
  BarChart,
  Subtitle,
  AreaChart,
  ListItem,
  List,
  Textarea,
} from '@tremor/react'
import { Condition, Platform, QARecord } from '../utils/Types'
import { AppContext } from '../App'
import moment from 'moment'
import {
  FaMagnifyingGlass,
  FaRotate,
  FaArrowRightArrowLeft,
  FaShareFromSquare
} from 'react-icons/fa6'
import axios, { AxiosResponse } from 'axios'
import { initQARecord, server, getPlatformBadgeColor, renderItemConditionOptions, renderPlatformOptions } from '../utils/utils'
import {
  ListGroup,
  Form,
  InputGroup,
  Tooltip,
  OverlayTrigger
} from 'react-bootstrap'
import '../style/QARecords.css'

const valueFormatter = (number: number) => `${new Intl.NumberFormat("us").format(number).toString()}`

// mock data
const barChartData = [
  {
    name: "New",
    "Number of Items": 546,
  },
  {
    name: "Sealed",
    "Number of Items": 120,
  },
  {
    name: "Used Like New",
    "Number of Items": 25,
  },
  {
    name: "Used",
    "Number of Items": 13,
  },
  {
    name: "Damaged",
    "Number of Items": 8,
  },
  {
    name: "As Is",
    "Number of Items": 2,
  }
]

const chartdata = [
  {
    date: "Jan 22",
    Recorded: 2890,
    "QARecorded": 2338,
  },
  {
    date: "Feb 22",
    Recorded: 2756,
    "QARecorded": 2103,
  },
  {
    date: "Mar 22",
    Recorded: 3322,
    "QARecorded": 2194,
  },
  {
    date: "Apr 22",
    Recorded: 3470,
    "QARecorded": 2108,
  },
  {
    date: "May 22",
    Recorded: 3475,
    "QARecorded": 1812,
  },
  {
    date: "Jun 22",
    Recorded: 3129,
    "QARecorded": 1726,
  },
]

const QARecords: React.FC = () => {
  const { setLoading } = useContext(AppContext)
  const [QARecordArr, setQARecordArr] = useState<QARecord[]>([])
  const [selectedRecord, setSelectedRecord] = useState<QARecord>(initQARecord)
  // paging
  const [currPage, setCurrPage] = useState<Number>(0)
  const [itemsPerPage, setItemsPerPage] = useState<Number>(20)
  // search panel
  const [displaySearchRecords, setDisplaySearchRecords] = useState<boolean>(true)
  const [searchSKU, setSearchSKU] = useState<string>('')
  const [searchRes, setSearchRes] = useState<QARecord>(initQARecord)
  // sorting & filtering
  const [dateRange, setDateRange] = useState<string>('All Time')
  const [showOnly, setShowOnly] = useState<string>('')
  const [sortingMethod, setSortingMethod] = useState<string>('')

  useEffect(() => {
    fetchQARecords()
    console.log('Loading Qa RECORDS...')
  }, [])

  // fetch QA records according to page and size into QARecordArr
  const fetchQARecords = async () => {
    setLoading(true)
    await axios({
      method: 'post',
      url: server + '/adminController/getQARecordsByPage',
      responseType: 'text',
      timeout: 3000,
      data: { page: currPage, itemsPerPage: itemsPerPage },
      withCredentials: true
    }).then((res: AxiosResponse) => {
      setQARecordArr(JSON.parse(res.data))
    }).catch((err) => {
      setLoading(false)
      alert('Failed Fetching QA Records: ' + err.response.status)
    })
    setLoading(false)
  }

  // update QA record
  const updateInventory = () => {
    setLoading(true)

    setLoading(false)
  }

  // for search panel
  const searchRecordBySKU = async () => {
    if (searchSKU === String(searchRes.sku)) return
    setLoading(true)
    // send searchSKU with axios
    await axios({
      method: 'post',
      url: server + '/adminController/getQARecordBySku/' + searchSKU,
      responseType: 'text',
      data: '',
      timeout: 3000,
      withCredentials: true
    }).then((res: AxiosResponse) => {
      setSearchRes(JSON.parse(res.data))
    }).catch((err) => {
      setLoading(false)
      alert('Failed Searching QA Records: ' + err.response.status)
    })
    setLoading(false)
  }

  // input,select,keydown event
  const onItemsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => setItemsPerPage(Number(event.target.value))
  const onSearchSKUChange = (event: React.ChangeEvent<HTMLInputElement>) => { if (event.target.value.length < 8) setSearchSKU(event.target.value) }
  const handleEnterKeySearch = (event: React.KeyboardEvent) => {
    console.log('enter pressed')
    if (event.key === 'Enter') searchRecordBySKU()
  }

  // reset search panel
  const resetSearch = () => {
    setSearchSKU('')
    setSearchRes(initQARecord)
  }

  // main control panel
  const renderRecordingPanel = () => {
    const onConditionChange = (event: React.ChangeEvent<HTMLSelectElement>) => setSelectedRecord({ ...selectedRecord, itemCondition: event.target.value as Condition })
    const onSkuChange = (event: React.ChangeEvent<HTMLInputElement>) => setSelectedRecord({ ...selectedRecord, sku: Number(event.target.value) })
    const onOwnerChange = (event: React.ChangeEvent<HTMLInputElement>) => setSelectedRecord({ ...selectedRecord, sku: Number(event.target.value) })
    const onShelfLocationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.value.length < 5) setSelectedRecord({ ...selectedRecord, shelfLocation: event.target.value })
    }
    const onPlatformChange = (event: React.ChangeEvent<HTMLSelectElement>) => setSelectedRecord({ ...selectedRecord, platform: event.target.value as Platform })
    const onAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.value.length < 3) setSelectedRecord({ ...selectedRecord, amount: Number(event.target.value) })
    }
    const onCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.value.length < 100) setSelectedRecord({ ...selectedRecord, comment: event.target.value })
    }
    const onLinkChange = (event: React.ChangeEvent<HTMLInputElement>) => setSelectedRecord({ ...selectedRecord, comment: event.target.value })


    return (
      <div className='h-full'>
        <h2>{selectedRecord.sku}</h2>
        <div className='flex'>
          <div className='w-3/6 p-3'>
            <InputGroup size="sm" className="mb-3">
              <InputGroup.Text>SKU</InputGroup.Text>
              <Form.Control value={selectedRecord.sku} onChange={onSkuChange} />
            </InputGroup>
            <InputGroup size="sm" className="mb-3">
              <InputGroup.Text>Owner</InputGroup.Text>
              <Form.Control value={selectedRecord.ownerName} onChange={onOwnerChange} />
            </InputGroup>
            <InputGroup size="sm" className="mb-3">
              <InputGroup.Text>Shelf Location</InputGroup.Text>
              <Form.Control value={selectedRecord.shelfLocation} onChange={onShelfLocationChange} />
            </InputGroup>
            <InputGroup size="sm" className="mb-3">
              <InputGroup.Text>Item Condition</InputGroup.Text>
              <Form.Select value={selectedRecord.itemCondition} onChange={onConditionChange}>
                {renderItemConditionOptions()}
              </Form.Select>
            </InputGroup>
            <InputGroup size="sm" className="mb-3">
              <InputGroup.Text>Platform</InputGroup.Text>
              <Form.Select value={selectedRecord.platform} onChange={onPlatformChange}>
                {renderPlatformOptions()}
              </Form.Select>
            </InputGroup>
            <InputGroup size="sm" className="mb-3">
              <InputGroup.Text>Amount</InputGroup.Text>
              <Form.Control value={selectedRecord.amount} onChange={onAmountChange} />
            </InputGroup>
            <InputGroup size="sm" className="mb-3">
              <InputGroup.Text>Comment</InputGroup.Text>
              <Form.Control className='resize-none' as={Textarea} style={{ resize: 'none' }} value={selectedRecord.comment} onChange={onCommentChange} />
            </InputGroup>
            <InputGroup size="sm" className="mb-3">
              <InputGroup.Text>Link</InputGroup.Text>
              <Form.Control className='resize-none h-32' as={Textarea} value={selectedRecord.link} onChange={onLinkChange} />
              <Button size='xs' color='orange'>Copy</Button>
            </InputGroup>
          </div>
          <div className='w-3/6'>
            <Card className='min-h-fit'>
              <h2></h2>
              <hr />
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Repellendus neque perspiciatis tempora iusto voluptatum nisi ipsam non? Non libero corporis nihil culpa, reprehenderit assumenda eveniet ex provident officia doloribus ut!
            </Card>
          </div>
        </div>
        <Button className='absolute bottom-3 left-3' color='indigo'>Prev</Button>
        <Button className='absolute bottom-3 left-2/3' color='emerald'>Submit & Next</Button>
        <Button className='absolute bottom-3 right-3' color='indigo'>Next</Button>
      </div>
    )
  }

  // QA records table row
  const renderInventoryTableBody = () => {
    return QARecordArr.map((record) => (
      <TableRow key={record.sku}>
        <TableCell>
          <Button className='text-white' color='stone' onClick={() => setSelectedRecord(record)}>{record.sku}</Button>
        </TableCell>
        <TableCell>
          <Text>{record.ownerName}</Text>
        </TableCell>
        <TableCell>
          <Badge color='slate'>{record.shelfLocation}</Badge>
        </TableCell>
        <TableCell>
          <p>{record.comment}</p>
        </TableCell>
        <TableCell>
          <p>{record.link.slice(0, 100)}</p>
        </TableCell>
        <TableCell>
          <Badge color={getPlatformBadgeColor(record.platform)}>{record.platform}</Badge>
        </TableCell>
        <TableCell>
          <Badge color={getPlatformBadgeColor(record.marketplace ?? 'None')}>{record.marketplace}</Badge>
        </TableCell>
        <TableCell>
          <Text>{record.amount}</Text>
        </TableCell>
        <TableCell>
          <Text>{(moment(record.time, "ddd MMM DD kk:mm:ss YYYY").format('LLL'))}</Text>
        </TableCell>
      </TableRow>
    ))
  }

  // the chart on the top
  const renderTopOverViewChart = () => {
    return (
      <>
        <Title>Overview</Title>
        <Subtitle>Last 7 Days (Dec 7 - Dec 14)</Subtitle>
        <BarChart
          className="h-64"
          data={barChartData}
          index="name"
          categories={["Number of Items"]}
          colors={["rose"]}
          valueFormatter={valueFormatter}
          yAxisWidth={32}
          showAnimation={true}
        />
      </>
    )
  }

  // flip side of the chart on the top 
  const renderSearchPanel = () => {
    return (
      <>
        <Title>Search Record</Title>
        <InputGroup size="sm" className="mb-3">
          <InputGroup.Text>SKU</InputGroup.Text>
          <Form.Control value={searchSKU} onChange={onSearchSKUChange} onKeyDown={handleEnterKeySearch} />
        </InputGroup>
        <Card className='h-52 overflow-y-scroll p-3 pt-0'>
          {searchRes.sku !== 0 ? <List>
            <ListItem>
              <span>SKU</span>
              <span>{searchRes.sku}</span>
            </ListItem>
            <ListItem>
              <span>Owner</span>
              <span>{searchRes.ownerName}</span>
            </ListItem>
            <ListItem>
              <span>Shelf Location</span>
              <span>{searchRes.shelfLocation}</span>
            </ListItem>
            <ListItem>
              <span>Item Condition</span>
              <span>{searchRes.itemCondition}</span>
            </ListItem>
            <ListItem>
              <span>Amount</span>
              <span>{searchRes.amount}</span>
            </ListItem>
            <ListItem>
              <span>Platform</span>
              <span>{searchRes.platform}</span>
            </ListItem>
            <ListItem>
              <Button onClick={() => setSelectedRecord(searchRes)} color='slate'>Select</Button>
            </ListItem>
          </List> : <Subtitle className='text-center'>Search Result Will Be Shown Here</Subtitle>}
        </Card>
        <Button className='absolute bottom-3' color='emerald' size='xs' onClick={searchRecordBySKU}>Search</Button>
        <Button className='absolute bottom-3 right-6' color='rose' size='xs' onClick={resetSearch}>Reset Search</Button>
      </>
    )
  }

  return (
    <div>
      {/* control panels */}
      <Grid className="gap-2" numItems={3}>
        <Col numColSpan={2}>
          <Card className="h-full">
            <Title>Inventory Recording</Title>
            <hr />
            {selectedRecord.sku === 0 ? <Subtitle className='text-center mt-64'>Selected QA Records Details Will Be Shown Here!</Subtitle> : renderRecordingPanel()}
          </Card>
        </Col>
        <Col numColSpan={1}>
          <Card className="h-96">
            <Button
              color='rose'
              className='right-6 absolute p-2'
              onClick={() => setDisplaySearchRecords(!displaySearchRecords)}
              tooltip='Flip Card'
            >
              <FaArrowRightArrowLeft />
            </Button>
            {displaySearchRecords ? renderSearchPanel() : renderTopOverViewChart()}
          </Card>
          <Card className="h-96 mt-2">
            <Title>Compare QA Records and Recorded Records</Title>
            <Subtitle>Last 7 Days (Dec 7 - Dec 14)</Subtitle>
            <AreaChart
              className="h-64"
              data={chartdata}
              index="date"
              categories={["Recorded", "QARecorded"]}
              colors={["green", "red"]}
              valueFormatter={valueFormatter}
              showAnimation={true}
            />
          </Card>
        </Col>
      </Grid>
      {/* table */}
      <Card className='mt-2 max-w-full'>
        <div className='flex'>
          <Button
            className='text-white mt-auto mb-auto'
            color='slate'
            onClick={fetchQARecords}
            tooltip='Refresh QA Records Table'
          >
            <FaRotate />
          </Button>
          <div className='flex ml-auto mr-auto gap-6' style={{ minWidth: '80%' }}>
            <div>
              <label className='text-gray-500'>Sort By:</label>
              <Form.Select className='mr-2' value={showOnly}>
                <option value="SKU Dsc">SKU Dsc</option>
                <option value="SKU Asc">SKU Asc</option>
                <option value="Time Dsc">Time Dsc</option>
                <option value="Time Asc">Time Asc</option>
              </Form.Select>
            </div>
            <div>
              <label className='text-gray-500'>Show Records Created:</label>
              <Form.Select className='mr-2' value={showOnly}>
                <option value="All Time">All Time</option>
                <option value="Today">Today</option>
                <option value="This Week">This Week</option>
                <option value="This Month">This Month</option>
              </Form.Select>
            </div>
          </div>
          <div className="right-12 mt-auto mb-auto">
            <label className='text-gray-500'>Items Per Page</label>
            <Form.Select className='mr-2' value={String(itemsPerPage)} onChange={onItemsPerPageChange}>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </Form.Select>
          </div>
        </div>
        <hr />
        <Table>
          <TableHead>
            <TableRow className='th-row'>
              <TableHeaderCell>SKU</TableHeaderCell>
              <TableHeaderCell className='w-36'>Owner</TableHeaderCell>
              <TableHeaderCell className='w-36'>Shelf Location</TableHeaderCell>
              <TableHeaderCell>Comment</TableHeaderCell>
              <TableHeaderCell>Link</TableHeaderCell>
              <TableHeaderCell>Platform</TableHeaderCell>
              <TableHeaderCell>Target Marketplace</TableHeaderCell>
              <TableHeaderCell className='w-36'>Amount</TableHeaderCell>
              <TableHeaderCell>Time Created</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {renderInventoryTableBody()}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
export default QARecords
