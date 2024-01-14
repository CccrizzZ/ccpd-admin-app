import { useContext, useEffect, useRef, useState } from 'react'
import {
  Badge,
  BarChart,
  Button,
  Card,
  Col,
  Grid,
  Subtitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Title,
  Text,
  DateRangePickerValue,
} from '@tremor/react'
import { Condition, InstockInventory, Platform } from '../utils/Types'
import { AppContext } from '../App'
import axios, { AxiosResponse } from 'axios'
import {
  getPlatformBadgeColor,
  getConditionVariant,
  initInstockInventory,
  server,
  renderItemConditionOptions,
  renderMarketPlaceOptions,
  renderPlatformOptions,
  renderInstockOptions,
  renderItemPerPageOptions
} from '../utils/utils'
import moment from 'moment'
import { Form, InputGroup } from 'react-bootstrap'
import PaginationButton from '../components/PaginationButton'
import "../style/Inventory.css"
import CustomDatePicker from '../components/DateRangePicker'
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

const initQueryFilter: QueryFilter = {
  timeRangeFilter: {} as DateRangePickerValue,
  conditionFilter: '' as Condition,
  platformFilter: '' as Platform,
  marketplaceFilter: '' as Platform,
  instockFilter: 'in'
}

type QueryFilter = {
  timeRangeFilter: DateRangePickerValue;
  conditionFilter: Condition;
  platformFilter: Platform;
  marketplaceFilter: Platform;
  instockFilter: string
}

const Inventory: React.FC = () => {
  const { setLoading } = useContext(AppContext)
  const tableRef = useRef<HTMLDivElement>(null)
  const [instockArr, setInstockArr] = useState<InstockInventory[]>([])
  // paging
  const [currPage, setCurrPage] = useState<number>(0)
  const [itemsPerPage, setItemsPerPage] = useState<number>(20)
  // search keyword
  const [searchSku, setSearchSku] = useState<string>('')
  const [searchKeyword, setSearchKeyword] = useState<string>('')
  const [shelfLocationKeyword, setshelfLocationKeyword] = useState<string>('')
  // query filters
  const [queryFilter, setQueryFilter] = useState<QueryFilter>(initQueryFilter)
  // flag
  const [changed, setChanged] = useState<boolean>(false)

  useEffect(() => {
    // fetchInstockByPage()
  }, [])

  const fetchInstockByPage = async () => {
    setLoading(true)
    await axios({
      method: 'post',
      url: server + '/adminController/getQARecordsByPage',
      responseType: 'text',
      timeout: 3000,
      data: { page: currPage, itemsPerPage: itemsPerPage },
      withCredentials: true
    }).then((res: AxiosResponse) => {

    }).catch((err) => {
      setLoading(false)
      alert('Failed Fetching QA Records: ' + err.response.status)
    })
    setLoading(false)
  }

  // for next and prev page button
  const fetchPage = async (direction: number) => {
    scrollToTable()
    // direction for page turning
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
        filter: queryFilter
      },
      withCredentials: true
    }).then((res: AxiosResponse) => {
      const data = JSON.parse(res.data)
      if (data['arr'].length > 0) {
        setInstockArr(data['arr'])
        setChanged(false)
        setCurrPage(newPage)
      } else {
        alert('No More Pages!')
      }
    }).catch(() => {
      setLoading(false)
      alert('This is the last page!')
    })
    setLoading(false)
  }

  const exportToCSV = async () => {

  }

  const searchInstockByKeyword = async () => {

  }

  const resetFilters = () => {
    setSearchSku('')
    setSearchKeyword('')
    setshelfLocationKeyword('')
    setItemsPerPage(20)
    setQueryFilter(initQueryFilter)
    setChanged(false)
  }

  const renderSearchPanel = () => {
    const onSearchSKUChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.value.length < 8) {
        setSearchSku(event.target.value)
        setChanged(true)
      }
    }
    const onKeywordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchKeyword(event.target.value)
      setChanged(true)
    }
    const onConditionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setQueryFilter({ ...queryFilter, conditionFilter: event.target.value as Condition })
      setChanged(true)
    }
    const onPlatformChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setQueryFilter({ ...queryFilter, platformFilter: event.target.value as Platform })
      setChanged(true)
    }
    const onMarketplaceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setQueryFilter({ ...queryFilter, marketplaceFilter: event.target.value as Platform })
      setChanged(true)
    }
    const onInstockChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setQueryFilter({ ...queryFilter, instockFilter: event.target.value })
      setChanged(true)
    }
    const onDatePickerChange = (value: DateRangePickerValue) => {
      setQueryFilter({ ...queryFilter, timeRangeFilter: value })
      setChanged(true)
    }
    const onShelfLocationKeywordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.value.length + 1 < 6) setshelfLocationKeyword((event.target.value).toUpperCase())
      setChanged(true)
    }
    const onItemsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setItemsPerPage(Number(event.target.value))
      setChanged(true)
    }
    const getInstockColor = (instock: string) => instock === 'in' ? '#10b981' : instock === 'out' ? '#f43f5e' : '#3b82f6'
    return (
      <Card className='h-full'>
        <Title>🧪 Record Filters</Title>
        <Grid className='gap-2' numItems={2}>
          <Col>
            <InputGroup size='sm' className='mb-3'>
              <InputGroup.Text>SKU</InputGroup.Text>
              <Form.Control type='number' value={searchSku} onChange={onSearchSKUChange} />
            </InputGroup>
            <InputGroup size='sm' className='mb-3'>
              <InputGroup.Text>Keyword</InputGroup.Text>
              <Form.Control value={searchKeyword} onChange={onKeywordChange} />
            </InputGroup>
            <InputGroup size='sm' className='mb-3'>
              <InputGroup.Text>Shelf Location</InputGroup.Text>
              <Form.Control value={shelfLocationKeyword} onChange={onShelfLocationKeywordChange} />
            </InputGroup>
            <InputGroup size='sm' className='mb-3'>
              <InputGroup.Text>Item Condition</InputGroup.Text>
              <Form.Select value={queryFilter.conditionFilter} onChange={onConditionChange}>
                {renderItemConditionOptions()}
              </Form.Select>
            </InputGroup>
            <InputGroup size='sm' className='mb-3'>
              <InputGroup.Text>Original Platform</InputGroup.Text>
              <Form.Select value={queryFilter.platformFilter} onChange={onPlatformChange}>
                {renderPlatformOptions()}
              </Form.Select>
            </InputGroup>
            <InputGroup size='sm' className='mb-3'>
              <InputGroup.Text>Target Marketplace</InputGroup.Text>
              <Form.Select value={queryFilter.marketplaceFilter} onChange={onMarketplaceChange}>
                {renderMarketPlaceOptions()}
              </Form.Select>
            </InputGroup>

          </Col>
          <Col>
            <InputGroup size='sm' className='mb-2'>
              <CustomDatePicker
                onValueChange={onDatePickerChange}
                value={queryFilter.timeRangeFilter}
              />
            </InputGroup>
            <InputGroup size='sm' className='mb-3'>
              <InputGroup.Text>Instock Status</InputGroup.Text>
              <Form.Select style={{ color: getInstockColor(queryFilter.instockFilter) }} value={queryFilter.instockFilter} onChange={onInstockChange}>
                {renderInstockOptions()}
              </Form.Select>
            </InputGroup>
            <InputGroup size='sm' className='mb-3'>
              <InputGroup.Text>Items Per Page</InputGroup.Text>
              <Form.Select value={itemsPerPage} onChange={onItemsPerPageChange}>
                {renderItemPerPageOptions()}
              </Form.Select>
            </InputGroup>
          </Col>
        </Grid>
        <Button className='absolute bottom-3 w-48' color='rose' size='xs' onClick={resetFilters}>Reset Filters</Button>
        <Button className='absolute bottom-3 w-64 right-64' color='indigo' size='xs' onClick={resetFilters}>Export Current Selection to CSV</Button>
        <Button className='absolute bottom-3 w-48 right-6' color={changed ? 'amber' : 'emerald'} size='xs' onClick={searchInstockByKeyword}>Refresh</Button>
      </Card>
    )
  }

  const renderOverviewChart = () => {
    return (
      <Card>
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
      </Card>
    )
  }

  const renderInventoryTableBody = () => {
    return instockArr.map((instock) => (
      <TableRow key={instock.qaRecord.sku}>
        <TableCell>
          <Text>{instock.qaRecord.sku}</Text>
        </TableCell>
        <TableCell>
          <Text>{instock.qaRecord.shelfLocation}</Text>
        </TableCell>
        <TableCell>
          <Badge color='slate'>{instock.qaRecord.ownerName}</Badge>
        </TableCell>
        <TableCell>
          <Badge color='slate'>{instock.recordAdmin}</Badge>
        </TableCell>
        <TableCell>
          <Badge color={getConditionVariant(instock.qaRecord.itemCondition)}>{instock.qaRecord.itemCondition}</Badge>
        </TableCell>
        <TableCell>
          <p>{instock.qaRecord.comment}</p>
        </TableCell>
        <TableCell>
          <p>{instock.qaRecord.link.slice(0, 100)}</p>
        </TableCell>
        <TableCell>
          <Badge color={getPlatformBadgeColor(instock.qaRecord.platform)}>{instock.qaRecord.platform}</Badge>
        </TableCell>
        <TableCell>
          <Badge color={getPlatformBadgeColor(instock.qaRecord.marketplace ?? 'None')}>{instock.qaRecord.marketplace}</Badge>
        </TableCell>
        <TableCell>
          <Text>{instock.quantityInstock}</Text>
        </TableCell>
        <TableCell>
          <Text>{(moment(instock.recordTime, "ddd MMM DD kk:mm:ss YYYY").format('LLL'))}</Text>
        </TableCell>
      </TableRow>
    ))
  }

  const scrollToTable = () => {
    if (tableRef.current) tableRef.current.scrollIntoView({
      behavior: 'instant'
    })
  }

  const renderInstockTable = () => {
    return (
      <Card ref={tableRef}>
        <Table>
          <TableHead>
            <TableRow className='th-row'>
              <TableHeaderCell className='w-36'>SKU</TableHeaderCell>
              <TableHeaderCell className='w-36'>Owner</TableHeaderCell>
              <TableHeaderCell className='w-36'>Shelf Location</TableHeaderCell>
              <TableHeaderCell className='w-36'>Condition</TableHeaderCell>
              <TableHeaderCell>Desc</TableHeaderCell>
              <TableHeaderCell>Link</TableHeaderCell>
              <TableHeaderCell className='w-46'>Platform</TableHeaderCell>
              <TableHeaderCell className='w-36'>Marketplace</TableHeaderCell>
              <TableHeaderCell className='w-32'>Instock</TableHeaderCell>
              <TableHeaderCell className='w-36'>Sold</TableHeaderCell>
              <TableHeaderCell>Time Recorded</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {instockArr.length > 0 ? renderInventoryTableBody() : undefined}
          </TableBody>
        </Table>
        {instockArr.length < 1 ? <h4 className='text-red-400 w-max ml-auto mr-auto mt-12 mb-12'>No Inventory Found!</h4> : undefined}
        <PaginationButton
          currentPage={currPage}
          nextPage={() => fetchPage(1)}
          prevPage={() => fetchPage(-1)}
        />
      </Card>
    )
  }

  return (
    <div>
      {/* top 2 charts */}
      <Grid className='gap-2 mb-2' numItems={2}>
        <Col>
          {renderSearchPanel()}
        </Col>
        <Col>
          {renderOverviewChart()}
        </Col>
      </Grid>
      {/* in stock table */}
      {renderInstockTable()}
    </div>
  )
}

export default Inventory