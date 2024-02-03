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
  AreaChart,
  Switch,
} from '@tremor/react'
import { Condition, InstockInventory, Platform, InstockQueryFilter } from '../utils/Types'
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
  renderItemPerPageOptions,
  initInstockQueryFilter,
  openLink,
  extractHttpsFromStr
} from '../utils/utils'
import moment from 'moment'
import { Form, InputGroup } from 'react-bootstrap'
import PaginationButton from '../components/PaginationButton'
import "../style/Inventory.css"
import CustomDatePicker from '../components/DateRangePicker'
import PageItemStatsBox from '../components/PageItemStatsBox'

// mock data
const valueFormatter = (number: number) => `${new Intl.NumberFormat("us").format(number).toString()}`
const chartdata = [
  {
    date: 'Jan 22',
    'Recorded Inventory': 0,
  },
  {
    date: 'Feb 22',
    'Recorded Inventory': 2,
  },
  {
    date: 'Mar 22',
    'Recorded Inventory': 194,
  },
  {
    date: 'Apr 22',
    'Recorded Inventory': 218,
  },
  {
    date: 'May 22',
    'Recorded Inventory': 182,
  },
  {
    date: 'Jun 22',
    'Recorded Inventory': 176,
  },
];


const Inventory: React.FC = () => {
  const { setLoading } = useContext(AppContext)
  const tableRef = useRef<HTMLDivElement>(null)
  const [instockArr, setInstockArr] = useState<InstockInventory[]>([])
  // paging
  const [currPage, setCurrPage] = useState<number>(0)
  const [itemsPerPage, setItemsPerPage] = useState<number>(20)
  const [itemCount, setItemCount] = useState<number>(0)
  // search keyword
  const [searchSku, setSearchSku] = useState<string>('')
  const [searchKeyword, setSearchKeyword] = useState<string>('')
  const [shelfLocationKeyword, setshelfLocationKeyword] = useState<string>('')
  // query filters
  const [queryFilter, setQueryFilter] = useState<InstockQueryFilter>(initInstockQueryFilter)
  // flag
  const [changed, setChanged] = useState<boolean>(false)
  const [editMode, setEditMode] = useState<boolean>(false)

  useEffect(() => {
    fetchInstockByPage()
  }, [])

  const fetchInstockByPage = async () => {
    setLoading(true)
    await axios({
      method: 'post',
      url: server + '/inventoryController/getInstockByPage',
      responseType: 'text',
      timeout: 3000,
      data: {
        page: currPage,
        itemsPerPage: itemsPerPage,
        filter: queryFilter
      },
      withCredentials: true
    }).then((res: AxiosResponse) => {
      const data = JSON.parse(res.data)
      setInstockArr(data['arr'])
      setItemCount(data['count'])
    }).catch((err) => {
      setLoading(false)
      alert('Failed Fetching QA Records: ' + err.response.status)
    })
    setLoading(false)
    setCurrPage(0)
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
      url: server + '/inventoryController/getInstockByPage',
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
      if (data['arr'] && data['arr'].length > 0) {
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

  const resetFilters = () => {
    setSearchSku('')
    setSearchKeyword('')
    setshelfLocationKeyword('')
    setItemsPerPage(20)
    setQueryFilter(initInstockQueryFilter)
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
          </Col>
        </Grid>
        <Button className='absolute bottom-3 w-48' color='rose' size='xs' onClick={resetFilters}>Reset Filters</Button>
        <Button className='absolute bottom-3 w-64 right-64' color='indigo' size='xs' onClick={resetFilters}>Export Current Selection to CSV</Button>
        <Button className='absolute bottom-3 w-48 right-6' color={changed ? 'amber' : 'emerald'} size='xs' onClick={fetchInstockByPage}>Refresh</Button>
      </Card>
    )
  }

  const renderOverviewChart = () => {
    return (
      <Card>
        <Title>Overview</Title>
        <Subtitle>Last 6 Weeks (Dec 7 - Dec 14)</Subtitle>
        <AreaChart
          className="h-72 mt-4"
          data={chartdata}
          index="date"
          yAxisWidth={65}
          categories={['Recorded Inventory']}
          colors={["sky"]}
          valueFormatter={valueFormatter}
        />
      </Card>
    )
  }

  const renderInventoryTableBody = () => {
    if (!instockArr || instockArr.length < 1) return
    return instockArr.map((instock) => (
      <TableRow key={instock.sku}>
        <TableCell>
          <Button size='xs' color='violet'>{instock.sku}</Button>
        </TableCell>
        <TableCell>
          <Badge color='slate'>{instock.shelfLocation}</Badge>
        </TableCell>
        <TableCell>
          <Badge color={getConditionVariant(instock.condition)}>{instock.condition}</Badge>
        </TableCell>
        <TableCell>
          <Text>{instock.lead}</Text>
        </TableCell>
        <TableCell>
          <Text>{instock.description}</Text>
        </TableCell>
        <TableCell>
          <Text>{instock.comment}</Text>
        </TableCell>
        <TableCell>
          <Text><a className='cursor-pointer' onClick={() => openLink(instock.url)}>{String(instock.url).slice(0, 50)}</a></Text>
        </TableCell>
        <TableCell>
          <Text>{instock.quantityInstock}</Text>
        </TableCell>
        <TableCell>
          <Text>{instock.quantitySold}</Text>
        </TableCell>
        <TableCell>
          <div className='grid gap-1'>
            <Badge color='slate'>{instock.qaName}</Badge>
            <Badge color='orange'>{instock.adminName}</Badge>
          </div>
        </TableCell>
        <TableCell>
          <Text>{moment(instock.recordTime).format('LLL')}</Text>
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
    const onItemsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setItemsPerPage(Number(event.target.value))
      setChanged(true)
    }
    return (
      <Card ref={tableRef}>
        <div className="flex top-12">
          <PageItemStatsBox
            totalItems={itemCount}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={onItemsPerPageChange}
          />
        </div>

        <div className="absolute right-16 flex top-12">
          <label className="text-sm text-gray-500 mr-4">Edit Mode</label>
          <Switch checked={editMode} onChange={() => setEditMode(!editMode)} />
        </div>

        <div className='flex w-full'>
          <PaginationButton
            currentPage={currPage}
            nextPage={() => fetchPage(1)}
            prevPage={() => fetchPage(-1)}
          />
        </div>
        <hr />
        <Table>
          <TableHead>
            <TableRow className='th-row'>
              <TableHeaderCell className='w-28'>SKU</TableHeaderCell>
              <TableHeaderCell className='w-32'>Shelf Location</TableHeaderCell>
              <TableHeaderCell className='w-36'>Condition</TableHeaderCell>
              <TableHeaderCell className='w-36'>Lead</TableHeaderCell>
              <TableHeaderCell>Desc</TableHeaderCell>
              <TableHeaderCell>QAComment</TableHeaderCell>
              <TableHeaderCell className='w-28'>URL</TableHeaderCell>
              <TableHeaderCell className='w-28'>Instock</TableHeaderCell>
              <TableHeaderCell className='w-28'>Sold</TableHeaderCell>
              <TableHeaderCell className='w-36'>
                <div>QAPersonal &<br /><p className='text-orange-500'>Admin</p></div>
              </TableHeaderCell>
              <TableHeaderCell className='w-36'>Time</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!instockArr || instockArr.length > 0 ? renderInventoryTableBody() : undefined}
          </TableBody>
        </Table>
        {!instockArr || instockArr.length < 1 ? <h4 className='text-red-400 w-max ml-auto mr-auto mt-12 mb-12'>No Inventory Found!</h4> : undefined}
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