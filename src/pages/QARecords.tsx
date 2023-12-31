import React, { useContext, useEffect, useRef, useState, version } from 'react'
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
  BarChart,
  Subtitle,
  AreaChart,
  ListItem,
  List,
  Textarea,
  DateRangePicker,
  DateRangePickerItem,
  DateRangePickerValue
} from '@tremor/react'
import { Condition, Platform, QARecord } from '../utils/Types'
import { AppContext } from '../App'
import moment from 'moment'
import {
  FaRotate,
  FaArrowRightArrowLeft,
  FaCaretLeft,
  FaCaretRight,
  FaFilterCircleXmark
} from 'react-icons/fa6'
import axios, { AxiosResponse } from 'axios'
import {
  initQARecord,
  server,
  getPlatformBadgeColor,
  renderItemConditionOptions,
  renderPlatformOptions,
  getConditionVariant,
  renderItemPerPageOptions,
  renderMarketPlaceOptions
} from '../utils/utils'
import {
  ListGroup,
  Form,
  InputGroup,
  Tooltip,
  OverlayTrigger,
  Modal
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
  const tableRef = useRef<HTMLDivElement>(null)
  const topRef = useRef<HTMLDivElement>(null)
  const [QARecordArr, setQARecordArr] = useState<QARecord[]>([])
  const [problemRecordsArr, setProblemRecordsArr] = useState<QARecord[]>([])
  const [selectedRecord, setSelectedRecord] = useState<QARecord>(initQARecord)
  const [selectedRecordImagesArr, setSelectedRecordImagesArr] = useState<string[]>([])
  const [displaySearchRecords, setDisplaySearchRecords] = useState<boolean>(true)
  const [displayProblemRecordsPanel, setDisplayProblemRecordsPanel] = useState<boolean>(true)
  const [showMarkConfirmPopup, setShowMarkConfirmPopup] = useState<boolean>(false)
  const [showImagePopup, setShowImagePopup] = useState<boolean>(false)
  const [imagePopupUrl, setImagePopupUrl] = useState<string>('')
  // paging
  const [currPage, setCurrPage] = useState<number>(0)
  const [itemsPerPage, setItemsPerPage] = useState<number>(20)
  // sorting & filtering
  const [timeRangeFilter, setTimeRangeFilter] = useState<DateRangePickerValue>({});
  const [conditionFilter, setConditionFilter] = useState<string>('')
  const [platformFilter, setPlatformFilter] = useState<string>('')
  const [marketplaceFilter, setMarketplaceFilter] = useState<string>('')
  const [searchSKU, setSearchSKU] = useState<string>('')
  const [searchRes, setSearchRes] = useState<QARecord>(initQARecord)

  useEffect(() => {
    // fetchProblemRecordsByPage()
    fetchQARecordsByPage()
    console.log('Loading Qa RECORDS...')
  }, [])

  const fetchQARecordsByPage = async () => {
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

  const fetchProblemRecords = async () => {
    setLoading(true)
    await axios({
      method: 'get',
      url: server + '/adminController/getProblematicRecords',
      responseType: 'text',
      timeout: 3000,
      data: '',
      withCredentials: true
    }).then((res: AxiosResponse) => {
      console.log(res)
      setProblemRecordsArr(JSON.parse(res.data))
    }).catch((err) => {
      setLoading(false)
      alert('Failed Fetching Problematic Records: ' + err.response.status)
    })
    setLoading(false)
  }

  const setRecordProblematic = async (sku: string, isProblematic: boolean) => {
    setShowMarkConfirmPopup(false)
    setLoading(true)
    await axios({
      method: 'post',
      url: server + '/adminController/setProblematicBySku/' + sku,
      responseType: 'text',
      timeout: 3000,
      data: { 'isProblem': isProblematic },
      withCredentials: true
    }).then(() => {
      // refresh
    }).catch((err) => {
      setLoading(false)
      alert('Failed Fetching QA Records: ' + err.response.status)
    })
    setLoading(false)
  }

  const fetchImageUrlArr = async () => {
    setLoading(true)
    await axios({
      method: 'post',
      url: server + '/imageController/getUrlsBySku',
      responseType: 'text',
      timeout: 3000,
      data: { 'sku': String(selectedRecord.sku) },
      withCredentials: true
    }).then((res) => {
      console.log(res)
      setSelectedRecordImagesArr(JSON.parse(res.data))
    }).catch(() => {
      setLoading(false)
      alert('Failed Fetching Image for: ' + selectedRecord.sku)
    })
    setLoading(false)
  }

  const fetchPage = async (direction: number) => {
    scrollToTable()
    let newPage = 0
    if (direction > 0) {
      newPage = currPage + 1
    } else {
      newPage = currPage - 1
      if (newPage < 0) return alert('This is the first page!')
    }
    setLoading(true)
    await axios({
      method: 'post',
      url: server + '/adminController/getQARecordsByPage',
      responseType: 'text',
      timeout: 3000,
      data: {
        page: newPage,
        itemsPerPage: itemsPerPage,
        timeRange: {
          start: '',
          end: ''
        },
        marketplace: '',
        condition: ''
      },
      withCredentials: true
    }).then((res: AxiosResponse) => {
      const records = JSON.parse(res.data)
      if (records.length > 0) {
        setQARecordArr(records)
        setCurrPage(newPage)
      }
    }).catch(() => {
      setLoading(false)
      alert('This is the last page')
    })
    setLoading(false)
  }

  const copyLink = (link: string) => navigator.clipboard.writeText(link)
  const openLink = (link: string) => {
    // extract http link in string and open it in new tab
    const url = link.split(" ").find(word => word.startsWith("http"))
    window.open(url, '_blank', 'noreferrer')
  }

  // control panel cursor jump to record
  const nextRecord = () => {
    const next = QARecordArr[QARecordArr.indexOf(selectedRecord) + 1]
    if (next !== undefined) setSelectedRecord(next)
  }

  const prevRecord = () => {
    const prev = QARecordArr[QARecordArr.indexOf(selectedRecord) - 1]
    if (prev !== undefined) setSelectedRecord(prev)
  }

  const renderRecordingPanel = () => {
    const record = async () => {
      // call admin create in stock inventory

    }
    const onConditionChange = (event: React.ChangeEvent<HTMLSelectElement>) => setSelectedRecord({ ...selectedRecord, itemCondition: event.target.value as Condition })
    const onSkuChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      // console.log(typeof (event.target.value))
      // if (typeof Number(event.target.value) === 'number') setSelectedRecord({ ...selectedRecord, sku: Number(event.target.value) })
    }
    const onOwnerChange = (event: React.ChangeEvent<HTMLInputElement>) => setSelectedRecord({ ...selectedRecord, ownerName: event.target.value })
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

    const clearImagePopup = () => {
      setImagePopupUrl('')
      setShowImagePopup(false)
    }

    const renderLargePhoto = () => {
      return (
        <Modal
          show={showImagePopup}
          onHide={clearImagePopup}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>{selectedRecord.sku}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <img src={imagePopupUrl} />
          </Modal.Body>
          <Modal.Footer>
            <Button color='slate' onClick={clearImagePopup}>
              Close
            </Button>
            <Button color='emerald'>
              Download
            </Button>
          </Modal.Footer>
        </Modal>
      )
    }

    const renderThumbnails = () => {
      return selectedRecordImagesArr.map((link: string) =>
        <Button key={link} color='slate' onClick={() => { setShowImagePopup(true); setImagePopupUrl(link) }}>
          <img src={link} width={200} height={200} />
        </Button>
      )
    }

    return (
      <div className='h-full'>
        <div className='flex'>
          {renderLargePhoto()}
          <Modal
            show={showMarkConfirmPopup}
            onHide={() => setShowMarkConfirmPopup(false)}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header closeButton>
              <Modal.Title>Record {selectedRecord.sku}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Mark this record
              {
                selectedRecord.problem ?
                  ' resolved' : ' problematic'
              }?
            </Modal.Body>
            <Modal.Footer>
              <Button color='slate' onClick={() => setShowMarkConfirmPopup(false)}>
                Close
              </Button>
              {
                selectedRecord.problem ?
                  <Button color='lime' onClick={() => setRecordProblematic(String(selectedRecord.sku), false)}>Confirm</Button> :
                  <Button color='red' onClick={() => setRecordProblematic(String(selectedRecord.sku), true)}>Confirm</Button>
              }
            </Modal.Footer>
          </Modal>
          <div className='w-1/2 p-3'>
            <h2 className={selectedRecord.problem ? 'text-red-500 mb-0' : 'mb-0'}>{selectedRecord.sku}</h2>
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
              <Form.Control className='resize-none h-32' as={Textarea} style={{ resize: 'none' }} value={selectedRecord.comment} onChange={onCommentChange} />
            </InputGroup>
            <InputGroup size="sm" className="mb-3">
              <InputGroup.Text>Link</InputGroup.Text>
              <Form.Control className='resize-none h-32' as={Textarea} value={selectedRecord.link} onChange={onLinkChange} />
              <Button size='xs' color='slate' onClick={() => copyLink(selectedRecord.link)}>Copy</Button>
              <Button size='xs' color='gray' onClick={() => openLink(selectedRecord.link)}>Open</Button>
            </InputGroup>
          </div>
          <div className='w-1/2'>
            <div className='flex'>
              <h2>📷 Photos</h2>
              <Button
                className='absolute right-8 mt-2'
                color='indigo'
                tooltip='Fetch Photos'
                onClick={() => fetchImageUrlArr()}
              >
                <FaRotate />
              </Button>
            </div>
            <hr />
            <Card className='overflow-y-scroll h-3/4'>
              {selectedRecordImagesArr.length < 1 ? <Subtitle>Photos Uploaded By Q&A Personal Will Show Up Here</Subtitle> : renderThumbnails()}
            </Card>
          </div>
        </div>
        <div className='absolute bottom-3 w-full'>
          <Button color='indigo' onClick={prevRecord}>Prev</Button>
          <Button className='ml-12' color={selectedRecord.problem ? 'lime' : 'rose'} onClick={() => setShowMarkConfirmPopup(true)}>{selectedRecord.problem ? 'Mark Resolved' : 'Mark Problem'}</Button>
          <Button className='absolute right-48' color='emerald' onClick={record}>Submit & Next</Button>
          <Button className='absolute right-12' color='indigo' onClick={nextRecord}>Next</Button>
        </div>
      </div>
    )
  }

  const renderInventoryTableBody = () => {
    return QARecordArr.map((record) => (
      <TableRow key={record.sku}>
        <TableCell>
          <Button
            className='text-white'
            color={record.problem ? 'rose' : 'slate'}
            tooltip={record.problem ? 'This Record Have Problem' : ''}
            onClick={() => { setSelectedRecord(record); scrollToTop(); }}
          >
            {record.sku}
          </Button>
        </TableCell>
        <TableCell>
          <Text>{record.ownerName}</Text>
        </TableCell>
        <TableCell>
          <Badge color='slate'>{record.shelfLocation}</Badge>
        </TableCell>
        <TableCell>
          <Badge color={getConditionVariant(record.itemCondition)}>{record.itemCondition}</Badge>
        </TableCell>
        <TableCell>
          <p>{record.comment}</p>
        </TableCell>
        <TableCell>
          <p><a className='cursor-pointer' onClick={() => openLink(record.link)}>{record.link.slice(0, 100)}</a></p>
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

  const renderSearchPanel = () => {
    const searchRecordBySKU = async () => {
      if (searchSKU.length < 2) return alert('Please Enter Target SKU')
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

    const resetSearch = () => {
      setSearchSKU('')
      setSearchRes(initQARecord)
    }

    const onSearchSKUChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.value.length < 8) setSearchSKU(event.target.value)
    }

    const handleEnterKeySearch = (event: React.KeyboardEvent) => {
      if (event.key === 'Enter') searchRecordBySKU()
    }

    return (
      <>
        <Title>🔍 Search Record</Title>
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
              <Badge color='slate'>{searchRes.shelfLocation}</Badge>
            </ListItem>
            <ListItem>
              <span>Item Condition</span>
              <Badge color={getConditionVariant(searchRes.itemCondition)}>{searchRes.itemCondition}</Badge>
            </ListItem>
            <ListItem>
              <span>Amount</span>
              <span>{searchRes.amount}</span>
            </ListItem>
            <ListItem>
              <span>Platform</span>
              <Badge color={getPlatformBadgeColor(searchRes.platform)}>{searchRes.platform}</Badge>
            </ListItem>
            <ListItem>
              <span>Time Created</span>
              <span>{searchRes.time}</span>
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

  const renderProblemRecordsPanel = () => {
    const renderProblemRecordsList = () => {
      return problemRecordsArr.map((record) =>
        <ListItem>
          <span>{record.sku}</span>
          <span><Button>👈Pull</Button></span>
        </ListItem>
      )
    }

    return (
      <>
        <Title>❓Problematic Records</Title>
        <Button
          color='emerald'
          className='right-16 absolute p-2 top-6'
          onClick={fetchProblemRecords}
          tooltip='Refresh Problematic Records'
        ><FaRotate /></Button>
        <Card className='h-72 overflow-y-scroll p-3 pt-0'>
          {problemRecordsArr.length > 0 ?
            <List>{renderProblemRecordsList()}</List> :
            <Subtitle className='text-center'>Records With Problems Will Be Shown Here</Subtitle>}
        </Card>
      </>
    )
  }

  const renderBottomOverviewChart = () => {
    return (
      <>
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
      </>
    )
  }

  const scrollToTable = () => {
    if (tableRef.current) tableRef.current.scrollIntoView({
      behavior: 'instant'
    })
  }

  const scrollToTop = () => {
    if (topRef.current) topRef.current.scrollIntoView({
      behavior: 'instant'
    })
  }

  const renderFilter = () => {
    const onPlatformFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => setPlatformFilter(event.target.value)
    const onConditionFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => setConditionFilter(event.target.value)
    const onMarketplaceFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => setMarketplaceFilter(event.target.value)
    const onTimeRangeFilterChange = (value: DateRangePickerValue) => setTimeRangeFilter(value)
    const renderDatePicker = () => {
      return (
        <DateRangePicker
          className="h-full"
          enableSelect={true}
          onValueChange={onTimeRangeFilterChange}
          value={timeRangeFilter}
        >
          <DateRangePickerItem
            key="Today"
            value="today"
            from={new Date()}
          >
            Today
          </DateRangePickerItem>
          <DateRangePickerItem
            key="This Week"
            value="thisWeek"
            from={moment().startOf('week').toDate()}
          >
            This Week
          </DateRangePickerItem>
          <DateRangePickerItem
            key="This Month"
            value="thisMonth"
            from={moment().startOf('month').toDate()}
          >
            This Month
          </DateRangePickerItem>
        </DateRangePicker>
      )
    }

    const resetFilters = () => {
      setPlatformFilter('')
      setConditionFilter('')
      setMarketplaceFilter('')
      setTimeRangeFilter({})
    }

    return (
      <div className='flex mb-4'>
        <Button
          className='text-white absolute mt-4'
          color='emerald'
          onClick={fetchQARecordsByPage}
          tooltip='Refresh QA Records Table'
        >
          <FaRotate />
        </Button>
        <div className='flex gap-6 ml-16' style={{ minWidth: '80%' }}>
          <div className='ml-6 mr-6 absolute'>
            <label className='text-gray-500'>Time Filter:</label>
            {renderDatePicker()}
          </div>
          <div className='absolute right-96 gap-2 flex'>
            <div>
              <label className='text-gray-500'>Condition:</label>
              <Form.Select value={conditionFilter} onChange={onConditionFilterChange}>
                {renderItemConditionOptions()}
              </Form.Select>
            </div>
            <div>
              <label className='text-gray-500'>Platform:</label>
              <Form.Select value={platformFilter} onChange={onPlatformFilterChange}>
                {renderPlatformOptions()}
              </Form.Select>
            </div>
            <div>
              <label className='text-gray-500'>Marketplace:</label>
              <Form.Select value={marketplaceFilter} onChange={onMarketplaceFilterChange}>
                {renderMarketPlaceOptions()}
              </Form.Select>
            </div>
            <Button
              className='text-white mt-4'
              color='red'
              onClick={resetFilters}
              tooltip='Reset Filters'
            >
              <FaFilterCircleXmark />
            </Button>
          </div>
        </div>
        <div>
          <label className='text-gray-500 mb-1'>Items Per Page</label>
          <Form.Select className='mr-2' value={String(itemsPerPage)} onChange={onItemsPerPageChange}>
            {renderItemPerPageOptions()}
          </Form.Select>
        </div>
        <div className="text-center ml-6">
          <label className='text-gray-500 mb-1'>Current Page</label>
          <h4>{currPage + 1}</h4>
        </div>
      </div>
    )
  }

  const onItemsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => setItemsPerPage(Number(event.target.value))

  return (
    <div ref={topRef}>
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
            <Button
              color='rose'
              className='right-6 absolute p-2'
              onClick={() => setDisplayProblemRecordsPanel(!displayProblemRecordsPanel)}
              tooltip='Flip Card'
            >
              <FaArrowRightArrowLeft />
            </Button>
            {displayProblemRecordsPanel ? renderProblemRecordsPanel() : renderBottomOverviewChart()}
          </Card>
        </Col>
      </Grid>
      {/* table */}
      <Card className='mt-2 max-w-full'>
        <div ref={tableRef}></div>
        {renderFilter()}
        <hr />
        <Table>
          <TableHead>
            <TableRow className='th-row'>
              <TableHeaderCell>SKU</TableHeaderCell>
              <TableHeaderCell className='w-36'>Owner</TableHeaderCell>
              <TableHeaderCell className='w-36'>Shelf Location</TableHeaderCell>
              <TableHeaderCell className='w-36'>Condition</TableHeaderCell>
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
        <div className='flex gap-2'>
          <Button color='blue' onClick={() => fetchPage(-1)}><FaCaretLeft />Previous Page</Button>
          <Button color='blue' onClick={() => fetchPage(1)}>Next Page <FaCaretRight /></Button>
        </div>
      </Card>
    </div>
  )
}
export default QARecords
