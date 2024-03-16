import { useContext, useEffect, useRef, useState } from 'react'
import {
  Badge,
  Button,
  Card,
  Col,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Title,
  Text,
  DateRangePickerValue,
  BarChart,
} from '@tremor/react'
import {
  Condition,
  InstockInventory,
  Platform,
  InstockQueryFilter
} from '../utils/Types'
import { AppContext } from '../App'
import axios, { AxiosError, AxiosResponse } from 'axios'
import {
  getPlatformBadgeColor,
  getConditionVariant,
  initInstockInventory,
  server,
  renderItemConditionOptions,
  renderMarketPlaceOptions,
  renderPlatformOptions,
  renderInstockOptions,
  initInstockQueryFilter,
  openLink,
} from '../utils/utils'
import moment from 'moment'
import { Form, InputGroup } from 'react-bootstrap'
import PaginationButton from '../components/PaginationButton'
import "../style/Inventory.css"
import CustomDatePicker from '../components/DateRangePicker'
import PageItemStatsBox from '../components/PageItemStatsBox'
import ShelfLocationsSelection from '../components/ShelfLocationsSelection'
import EditInstockModal from '../components/EditInstockModal'
import AdminNameSelection from '../components/AdminNameSelection'
import QANameSelection from '../components/QANameSelection'
import { FaAnglesDown } from 'react-icons/fa6'
import InstockStagingModal from '../components/InstockStagingModal'
import ConfirmationModalProps from '../components/ConfirmationModal'

// mock data
// TODO: add server graph information route
const valueFormatter = (number: number) => `${new Intl.NumberFormat("us").format(number).toString()}`
type ChartData = {
  date: string,
  'Recorded Invenotry': number
}

const Inventory: React.FC = () => {
  const { setLoading } = useContext(AppContext)
  const tableRef = useRef<HTMLDivElement>(null)
  // instock info
  const [instockArr, setInstockArr] = useState<InstockInventory[]>([])
  const [selectedInstock, setSelectedInstock] = useState<InstockInventory>(initInstockInventory)
  const [showInstockModal, setShowInstockModal] = useState<boolean>(false)
  const [pastInventoryData, setPastInventoryData] = useState<ChartData[]>([])
  // paging
  const [currPage, setCurrPage] = useState<number>(0)
  const [itemsPerPage, setItemsPerPage] = useState<number>(20)
  const [itemCount, setItemCount] = useState<number>(0)
  // search keyword
  const [searchKeyword, setSearchKeyword] = useState<string>('')
  // query filters
  const [queryFilter, setQueryFilter] = useState<InstockQueryFilter>(initInstockQueryFilter)
  // flag
  const [changed, setChanged] = useState<boolean>(false)
  const [showStagePopup, setShowStagePopup] = useState<boolean>(false)

  useEffect(() => {
    fetchInstockByPage()
  }, [])

  const populateChartData = (newItemArr: ChartData[]) => {
    const arr: ChartData[] = []
    for (let i = 0; i < 10; i++) {
      arr.push({
        date: moment().subtract(Math.abs(i), 'day').format('MMM DD').toString(),
        'Recorded Invenotry': 0
      })
    }
    const arr1: ChartData[] = []
    arr.map(item => {
      const initem = newItemArr.find((newItem) => String(newItem['date']) === String(item.date))
      arr1.push(initem === undefined ? item : initem)
    })
    setPastInventoryData(arr1.reverse())
  }

  // fetch page with filters
  const getKwArr = (skey: string, refresh?: boolean) => {
    return skey.length > 0 && !refresh ? skey.split(/(\s+)/).filter((item) => { return item.trim().length > 0 }) : []
  }
  const getTotalPage = () => Math.ceil(itemCount / itemsPerPage) - 1
  const fetchInstockByPage = async (refresh?: boolean, newItemsPerPage?: number) => {
    // if refresh use init query filter
    const filter = refresh ? initInstockQueryFilter : { ...queryFilter, keywordFilter: getKwArr(searchKeyword, refresh) }
    setLoading(true)
    await axios({
      method: 'post',
      url: server + '/inventoryController/getInstockByPage',
      responseType: 'text',
      timeout: 8000,
      data: {
        page: refresh ? 0 : currPage,
        itemsPerPage: newItemsPerPage ?? itemsPerPage,
        filter: filter,
      },
      withCredentials: true
    }).then((res: AxiosResponse) => {
      const data = JSON.parse(res.data)
      setInstockArr(data['arr'])
      setItemCount(data['count'])
      if (!data['chartData']) return
      populateChartData(data['chartData'])
    }).catch((err: AxiosError) => {
      setLoading(false)
      alert('Failed Fetching Instock Records: ' + err.message)
    })
    setLoading(false)
    setCurrPage(0)
    setChanged(false)
  }

  const pageAxios = async (newPage: number) => {
    await axios({
      method: 'post',
      url: server + '/inventoryController/getInstockByPage',
      responseType: 'text',
      timeout: 8000,
      data: {
        page: newPage,
        itemsPerPage: itemsPerPage,
        filter: { ...queryFilter, keywordFilter: getKwArr(searchKeyword) }
      },
      withCredentials: true
    }).then((res: AxiosResponse) => {
      const data = JSON.parse(res.data)
      if (data['arr'] && data['arr'].length > 0) {
        setInstockArr(data['arr'])
        setChanged(false)
        setCurrPage(newPage)
      }
    }).catch((res: AxiosError) => {
      setLoading(false)
      alert('Cannot get page: ' + res.status)
    })
  }

  // for next and prev page button
  // direction for page turning
  const fetchPage = async (direction: number) => {
    let newPage = 0
    if (direction > 0) {
      if (currPage + 1 > getTotalPage()) return
      newPage = currPage + 1
    } else {
      if (currPage - 1 < 0) return
      newPage = currPage - 1
    }
    scrollToTable()
    setLoading(true)
    pageAxios(newPage)
    setLoading(false)
  }

  // jump to fist or last page
  const gotoFirstLastPage = async (direction: number) => {
    // goto fist or last page
    let newPage = 0
    if (direction > 0) {
      if (currPage === getTotalPage()) return
      newPage = getTotalPage()
    } else {
      if (currPage === 0) return
      newPage = 0
    }
    scrollToTable()
    setLoading(true)
    pageAxios(newPage)
    setLoading(false)
  }

  const resetFilters = () => {
    setSearchKeyword('')
    setQueryFilter(initInstockQueryFilter)
    setChanged(false)
    fetchInstockByPage(true)
  }

  const renderFilterPanel = () => {
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
    const onShelfLocationChange = (value: string[]) => {
      setQueryFilter({ ...queryFilter, shelfLocationFilter: value })
      setChanged(true)
    }
    const onAdminNameChange = (value: string[]) => {
      setQueryFilter({ ...queryFilter, adminFilter: value })
      setChanged(true)
    }
    const onQANameChange = (value: string[]) => {
      setQueryFilter({ ...queryFilter, qaFilter: value })
      setChanged(true)
    }
    const onMsrpMaxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setQueryFilter({ ...queryFilter, msrpFilter: { ...queryFilter.msrpFilter, lt: event.target.value } })
      setChanged(true)
    }
    const onMsrpMinChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setQueryFilter({ ...queryFilter, msrpFilter: { ...queryFilter.msrpFilter, gte: event.target.value } })
      setChanged(true)
    }
    const onMinSKUChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setQueryFilter({ ...queryFilter, sku: { ...queryFilter.sku, gte: event.target.value } })
      setChanged(true)
    }
    const onMaxSKUChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setQueryFilter({ ...queryFilter, sku: { ...queryFilter.sku, lte: event.target.value } })
      setChanged(true)
    }

    const getInstockColor = (instock: string) => instock === 'in' ? '#10b981' : instock === 'out' ? '#f43f5e' : '#3b82f6'
    return (
      <Card className='h-full'>
        <Title>📋 Record Filters</Title>
        <Grid className='gap-6' numItems={2}>
          <Col>
            <InputGroup size='sm' className='mb-3'>
              <InputGroup.Text>Min SKU</InputGroup.Text>
              <Form.Control
                type='number'
                value={queryFilter.sku?.gte}
                min={0}
                onChange={onMinSKUChange}
              />
              <InputGroup.Text>Max SKU</InputGroup.Text>
              <Form.Control
                type='number'
                value={queryFilter.sku?.lte}
                min={0}
                onChange={onMaxSKUChange}
              />
            </InputGroup>
            <InputGroup size='sm' className='mb-3'>
              <InputGroup.Text>Instock Status</InputGroup.Text>
              <Form.Select style={{ color: getInstockColor(queryFilter.instockFilter) }} value={queryFilter.instockFilter} onChange={onInstockChange}>
                {renderInstockOptions()}
              </Form.Select>
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
            <InputGroup size='sm' className='mb-3'>
              <InputGroup.Text>Min MSRP</InputGroup.Text>
              <Form.Control
                type='number'
                maxLength={6}
                step={0.1}
                value={queryFilter.msrpFilter.gte}
                onChange={onMsrpMinChange}
              />
              <InputGroup.Text>Max MSRP</InputGroup.Text>
              <Form.Control
                type='number'
                step={0.1}
                value={queryFilter.msrpFilter.lt}
                onChange={onMsrpMaxChange}
              />
            </InputGroup>
            <InputGroup size='sm' className='mb-3'>
              <InputGroup.Text>
                Keyword / Tags<br />(Separate By Space)<br />(Case Sensitive)<br />(Or Operator)
              </InputGroup.Text>
              <Form.Control
                className='resize-none'
                as='textarea'
                value={searchKeyword}
                onChange={onKeywordChange}
                rows={4}
              />
            </InputGroup>
          </Col>
          <Col>
            <InputGroup size='sm' className='mb-3'>
              <CustomDatePicker
                onValueChange={onDatePickerChange}
                value={queryFilter.timeRangeFilter}
              />
            </InputGroup>
            <ShelfLocationsSelection
              onShelfLocationChange={onShelfLocationChange}
              shelfLocationSelection={queryFilter.shelfLocationFilter}
            />
            <AdminNameSelection
              onAdminNameChange={onAdminNameChange}
              adminNameSelection={queryFilter.adminFilter}
            />
            <QANameSelection
              onQANameChange={onQANameChange}
              qaNameSelection={queryFilter.qaFilter}
            />
          </Col>
        </Grid>
        <Button className='absolute bottom-3 w-48' color='rose' size='xs' onClick={resetFilters}>Reset Filters</Button>
        {changed ? undefined : <Button className='absolute bottom-3 w-64 right-64' color='indigo' size='xs' onClick={() => setShowStagePopup(true)}>Create Auction Record</Button>}
        <Button
          className='absolute bottom-3 w-48 right-6'
          color={changed ? 'amber' : 'emerald'}
          size='xs'
          onClick={() => fetchInstockByPage()}
        >
          Refresh
        </Button>
      </Card>
    )
  }

  const renderOverviewChart = () => {
    if (pastInventoryData.length === 0) {
      return (
        <Card className='h-full'>
          <Title>Inventory Recorded Last 10 Days</Title>
          <Title>{`${moment().subtract(10, 'days').format('L')} to ${moment().format('L')}`}</Title>
          <BarChart
            animationDuration={2000}
            showAnimation={true}
            className="h-[400px] mt-4"
            data={pastInventoryData}
            index="date"
            yAxisWidth={65}
            categories={['Recorded Inventory']}
            colors={["emerald"]}
            valueFormatter={valueFormatter}
          />
        </Card>
      )
    } else {
      return (
        <Card className='h-full'>
          <Title>Inventory Recorded Last 10 Days</Title>
          <Title>{`${moment().subtract(10, 'days').format('L')} to ${moment().format('L')}`}</Title>
          <h2>No Data Available Last 10 Days</h2>
        </Card>
      )
    }
  }

  const showModal = (i: InstockInventory) => {
    setSelectedInstock(i)
    setShowInstockModal(true)
  }

  const renderInventoryTableBody = () => {
    if (!instockArr || instockArr.length < 1) return
    return instockArr.map((instock) => (
      <TableRow key={instock.sku}>
        <TableCell>
          <Button size='xs' color='slate' onClick={() => showModal(instock)}>{instock.sku}</Button>
        </TableCell>
        <TableCell>
          <div className='grid justify-items-center'>
            <Badge color='purple' className='font-bold'>{instock.shelfLocation}</Badge><br />
            <Badge color={getConditionVariant(instock.condition)}>{instock.condition}</Badge>
          </div>
        </TableCell>
        <TableCell className='text-center'>
          <Badge color='green'>${instock.msrp}</Badge>
        </TableCell>
        <TableCell>
          <Text>{instock.lead}</Text>
        </TableCell>
        <TableCell>
          <Text>{instock.description}</Text>
        </TableCell>
        <TableCell>
          <Text><a className='cursor-pointer' onClick={() => openLink(instock.url)}>{String(instock.url).slice(0, 50)}</a></Text>
        </TableCell>
        <TableCell>
          <Text>{instock.comment}</Text>
        </TableCell>
        <TableCell>
          <div className='grid gap-1 justify-items-center'>
            <Badge color={getPlatformBadgeColor(instock.platform)}>{instock.platform}</Badge>
            <FaAnglesDown className='m-0' />
            <Badge color={instock.marketplace ? getPlatformBadgeColor(instock.marketplace) : 'cyan'}>{instock.marketplace ?? 'Hibid'}</Badge>
          </div>
        </TableCell>
        <TableCell>
          <div className='grid gap-1 justify-items-center'>
            <Badge color='green'>{instock.quantityInstock}</Badge>
            <FaAnglesDown className='m-0' />
            <Badge color='rose'>{instock.quantitySold ?? 0}</Badge>
          </div>
        </TableCell>
        <TableCell>
          <div className='grid gap-1 justify-items-center'>
            <Badge color='slate'>{instock.qaName}</Badge>
            <Badge color='orange'>{instock.adminName}</Badge>
          </div>
        </TableCell>
        <TableCell>
          <Text>{moment(instock.time).format('LLL')}</Text>
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
      setCurrPage(0)
      setItemsPerPage(Number(event.target.value))
      fetchInstockByPage(false, Number(event.target.value))
    }
    return (
      <Card ref={tableRef}>
        <EditInstockModal
          show={showInstockModal}
          handleClose={() => setShowInstockModal(false)}
          selectedInventory={selectedInstock}
          refreshTable={() => fetchInstockByPage(false)}
        />
        <div className="flex top-12 absolute">
          <PageItemStatsBox
            totalItems={itemCount}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={onItemsPerPageChange}
          />
        </div>
        <div className='flex items-center justify-center mt-12'>
          <PaginationButton
            totalPage={getTotalPage()}
            currentPage={currPage}
            nextPage={() => fetchPage(1)}
            prevPage={() => fetchPage(-1)}
            firstPage={() => gotoFirstLastPage(-1)}
            lastPage={() => gotoFirstLastPage(1)}
          />
        </div>
        <hr />
        <Table>
          <TableHead>
            <TableRow className='th-row'>
              <TableHeaderCell className='w-28'>SKU</TableHeaderCell>
              <TableHeaderCell className='w-36 text-center'>Shelf Location & <br /> Condition</TableHeaderCell>
              <TableHeaderCell className='w-28 text-center'>MSRP<br />($CAD)</TableHeaderCell>
              <TableHeaderCell className='w-36'>Lead</TableHeaderCell>
              <TableHeaderCell>Desc</TableHeaderCell>
              <TableHeaderCell className='w-28'>URL</TableHeaderCell>
              <TableHeaderCell className='w-32'>QAComment</TableHeaderCell>
              <TableHeaderCell className='w-36 text-center'>Platform &<br />Marketplace</TableHeaderCell>
              <TableHeaderCell className='w-28 text-center'>Instock &<br /><p className='text-rose-500'>Sold</p></TableHeaderCell>
              <TableHeaderCell className='w-36 text-center'>
                <div>QAPersonal &<br /><p className='text-orange-500'>Admin</p></div>
              </TableHeaderCell>
              <TableHeaderCell className='w-36 text-center'>Time<br />(EST)</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!instockArr || instockArr.length > 0 ? renderInventoryTableBody() : undefined}
          </TableBody>
        </Table>
        {!instockArr || instockArr.length < 1 ? <h4 className='text-red-400 w-max ml-auto mr-auto mt-12 mb-12'>No Inventory Found!</h4> : undefined}
        <hr />
        <PaginationButton
          totalPage={getTotalPage()}
          currentPage={currPage}
          nextPage={() => fetchPage(1)}
          prevPage={() => fetchPage(-1)}
          firstPage={() => gotoFirstLastPage(-1)}
          lastPage={() => gotoFirstLastPage(1)}
        />
      </Card>
    )
  }

  return (
    <div>
      <InstockStagingModal
        show={showStagePopup}
        handleClose={() => setShowStagePopup(false)}
        queryFilter={queryFilter}
        keywords={searchKeyword}
        totalItems={itemCount}
      />
      {/* top 2 charts */}
      <Grid className='gap-2 mb-2 h-[550px]' numItems={2}>
        <Col>
          {renderFilterPanel()}
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