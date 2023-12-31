import { useContext, useEffect, useState } from 'react'
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
  ListItem,
  List
} from '@tremor/react'
import { InstockInventory } from '../utils/Types'
import { AppContext } from '../App'
import axios, { AxiosResponse } from 'axios'
import {
  getPlatformBadgeColor,
  getConditionVariant,
  initInstockInventory,
  server
} from '../utils/utils'
import moment from 'moment'
import { Form, InputGroup } from 'react-bootstrap'
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

type DateRange = {
  begin: string,
  end: string
}

const Inventory: React.FC = () => {
  const { setLoading, userInfo } = useContext(AppContext)
  const [instockArr, setInstockArr] = useState<InstockInventory[]>([])
  // paging
  const [currPage, setCurrPage] = useState<number>(0)
  const [itemsPerPage, setItemsPerPage] = useState<number>(20)
  // filtering
  const [dateRange, setDateRange] = useState<DateRange>({ begin: '', end: '' })
  const [conditionFilter, setConditionFilter] = useState<string[]>([])
  const [platformFilter, setPlatformFilter] = useState<string[]>([])
  const [marketPlaceFilter, setMarketPlaceFilter] = useState<string[]>([])
  // filters
  const [searchSku, setSearchSku] = useState<string>('')
  const [searchKeyword, setSearchKeyword] = useState<string>('')
  const [searchRes, setSearchRes] = useState<InstockInventory[]>([])

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
      setSearchRes(JSON.parse(res.data))
    }).catch((err) => {
      setLoading(false)
      alert('Failed Fetching QA Records: ' + err.response.status)
    })
    setLoading(false)
  }

  const searchInstockByKeyword = async () => {

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

  const renderInstockTable = () => {
    return (
      <Card>
        <Table>
          <TableHead>
            <TableRow className='th-row'>
              <TableHeaderCell className='w-36'>SKU</TableHeaderCell>
              <TableHeaderCell className='w-36'>Owner</TableHeaderCell>
              <TableHeaderCell className='w-36'>Shelf Location</TableHeaderCell>
              <TableHeaderCell className='w-36'>Condition</TableHeaderCell>
              <TableHeaderCell>Comment</TableHeaderCell>
              <TableHeaderCell>Link</TableHeaderCell>
              <TableHeaderCell className='w-46'>Platform</TableHeaderCell>
              <TableHeaderCell className='w-36'>Marketplace</TableHeaderCell>
              <TableHeaderCell className='w-32'>Instock</TableHeaderCell>
              <TableHeaderCell className='w-36'>Sold</TableHeaderCell>
              <TableHeaderCell>Time Created</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {renderInventoryTableBody()}
          </TableBody>
        </Table>
      </Card>
    )
  }

  const renderSearchPanel = () => {
    const onSearchSKUChange = (event: React.ChangeEvent<HTMLInputElement>) => setSearchSku(event.target.value)
    const onKeywordChange = (event: React.ChangeEvent<HTMLInputElement>) => setSearchKeyword(event.target.value)
    return (
      <Card className='h-full'>
        <Title>🧪 Record Filters</Title>
        <InputGroup size="sm" className="mb-3">
          <InputGroup.Text>SKU</InputGroup.Text>
          <Form.Control value={searchKeyword} onChange={onSearchSKUChange} />
        </InputGroup>
        <InputGroup size="sm" className="mb-3">
          <InputGroup.Text>Keyword</InputGroup.Text>
          <Form.Control value={searchKeyword} onChange={onKeywordChange} />
        </InputGroup>

        {/* <Card className='h-52 overflow-y-scroll p-3 pt-0'>

        </Card> */}
        <Button className='absolute bottom-3 w-48' color='emerald' size='xs' onClick={searchInstockByKeyword}>Filter</Button>
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