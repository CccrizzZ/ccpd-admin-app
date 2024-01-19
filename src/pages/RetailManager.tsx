import React, { useContext, useEffect, useState } from 'react'
import {
  Grid,
  Card,
  Col,
  Title,
  Text,
  Metric,
  LineChart,
  AreaChart,
  DonutChart,
  BarList,
  BarChart,
  Table,
  TableHead,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  Badge,
  Legend,
  Button,
  TabGroup,
  TabList,
  TabPanels,
  TabPanel,
  Tab,
  DateRangePickerValue
} from '@tremor/react'
import { RetailRecord, ReturnRecord, Condition, QueryFilter } from '../utils/Types'
import '../style/RetailManager.css'
import { Form } from 'react-bootstrap';
import CreateSalesRecordModal from '../components/CreateSalesRecordModal';
import { AppContext } from '../App';
import { renderItemPerPageOptions, server, getPlatformBadgeColor, initQueryFilter } from '../utils/utils';
import axios from 'axios';
import CreateReturnRecordModal from '../components/CreateReturnRecord';
import TableFilter from '../components/TableFilter';
import { FaRotate } from 'react-icons/fa6';

const itemValueFormatter = (num: number) => `${new Intl.NumberFormat("us").format(num).toString()} Items`;
const priceValueFormatter = (num: number) => `$ ${new Intl.NumberFormat("us").format(num).toString()}`;

// 6 month, quarterly or weekly
const retailReturnData = [
  {
    day: 'Dec 8',
    "Retail": 1004,
    "Return": 120,
  },
  {
    day: 'Dec 9',
    "Retail": 1504,
    "Return": 30,
  },
  {
    day: 'Dec 10',
    "Retail": 1304,
    "Return": 100,
  },
  {
    day: 'Dec 11',
    "Retail": 804,
    "Return": 10,
  },
  {
    day: 'Dec 12',
    "Retail": 1104,
    "Return": 100,
  },
  {
    day: 'Dec 13',
    "Retail": 1204,
    "Return": 170,
  },
  {
    day: 'Dec 14',
    "Retail": 2504,
    "Return": 230,
  },
  {
    day: 'Dec 15',
    "Retail": 1404,
    "Return": 150,
  },
  {
    day: 'Dec 16',
    "Retail": 2004,
    "Return": 20,
  },
  {
    day: 'Dec 17',
    "Retail": 1004,
    "Return": 40,
  },
  {
    day: 'Dec 18',
    "Retail": 156,
    "Return": 14,
  }
]

// overviewing conditions of retail goods
const retailConditionData = [
  {
    condition: "New",
    items: 55,
  },
  {
    condition: "Sealed",
    items: 2,
  },
  {
    condition: "Used Like New",
    items: 16,
  },
  {
    condition: "Used",
    items: 5,
  },
  {
    condition: "As Is",
    items: 2,
  },
  {
    condition: "Damaged",
    items: 0,
  },
]

const retailPriceRangeData = [
  {
    name: "<$50",
    'Amount': 74,
  },
  {
    name: "$50-100",
    'Amount': 12,
  },
  {
    name: "$100-200",
    'Amount': 4,
  },
  {
    name: ">$200",
    'Amount': 2,
  },
]

const RetailManager: React.FC = () => {
  const { setLoading, userInfo } = useContext(AppContext)
  const [retailArr, setRetailArr] = useState<RetailRecord[]>([])
  const [returnArr, setReturnArr] = useState<ReturnRecord[]>([])
  const [currPage, setCurrPage] = useState<number>(0)
  const [itemsPerPage, setItemsPerPage] = useState<number>(20)
  const [timeRange, setTimeRange] = useState<string>('All Time')
  const [showSalesRecordModal, setShowSalesRecordModal] = useState<boolean>(false)
  const [showReturnsRecordModal, setShowReturnsRecordModal] = useState<boolean>(false)

  // filters
  const [queryFilter, setQueryFilter] = useState<QueryFilter>(initQueryFilter)
  const [changed, setChanged] = useState<boolean>(false)

  useEffect(() => {
    // fetchRetailDataByPage()
    // fetchReturnRecordsByPage()
  }, [])

  const fetchRetailDataByPage = async () => {
    setLoading(true)
    await axios({
      method: 'post',
      url: server + '/adminController/getSalesRecordsByPage',
      responseType: 'text',
      data: {
        currPage: currPage,
        itemsPerPage: itemsPerPage
      },
      withCredentials: true
    }).then((res) => {
      setRetailArr(JSON.parse(res.data))
    }).catch((err) => {
      alert('Cannot Fetch Retail Record: ' + err.response.status)
    })
    setLoading(false)
  }

  const fetchReturnRecordsByPage = async () => {
    setLoading(true)
    await axios({
      method: 'post',
      url: server + '/adminController/getReturnRecordsByPage',
      responseType: 'text',
      data: {
        currPage: currPage,
        itemsPerPage: itemsPerPage
      },
      withCredentials: true
    }).then((res) => {
      setReturnArr(JSON.parse(res.data))
    }).catch((err) => {
      alert('Cannot Fetch Return Record: ' + err.response.status)
    })
    setLoading(false)
  }

  // return vs retail amount
  const renderGraph1 = () => {
    return (
      <Card className='h-full pl-2 pr-2'>
        <Title className='ml-2'>Retails VS Returns</Title>
        <AreaChart
          className="mt-6"
          data={retailReturnData}
          index="day"
          categories={["Retail", "Return"]}
          colors={["green", "red"]}
          valueFormatter={priceValueFormatter}
          yAxisWidth={64}
          showAnimation={true}
        />
      </Card>
    )
  }

  // shows retail condition
  const renderGraph2 = () => {
    return (
      <Card className='h-full pl-4 pr-4'>
        <Title>Retail Price Range</Title>
        <BarChart
          className="mt-6"
          data={retailPriceRangeData}
          index="name"
          categories={["Amount"]}
          colors={["orange"]}
          valueFormatter={itemValueFormatter}
          yAxisWidth={68}
          showAnimation={true}
        />
      </Card>
    )
  }

  // shows market place
  const renderGraph3 = () => {
    return (
      <Card className='h-full'>
        <Title>Retail Conditions Overview</Title>
        <DonutChart
          className="mt-6 h-64"
          data={retailConditionData}
          category="items"
          index="condition"
          valueFormatter={itemValueFormatter}
          colors={["green", "violet", "blue", "sky", "rose", "gray"]}
          showAnimation={true}
        />
        <Legend
          className="mt-6 mb-0"
          categories={["New", "Sealed", "Used Like New", "Used", "As Is", "Damaged"]}
          colors={["green", "violet", "blue", "sky", "rose", "gray"]}
        />
      </Card>
    )
  }

  const data: RetailRecord[] = [
    {
      sku: 10220,
      time: 'Thu Oct 12 18:44:00 2023',
      amount: 44.5,
      quantity: 1,
      marketplace: 'Hibid',
      paymentMethod: 'Card',
      buyerName: 'John Doe',
      adminName: 'Michael',
      invoiceNumber: '113245',
      paid: true,
      pickedup: false
    },
    {
      sku: 10221,
      time: 'Thu Oct 12 18:44:00 2023',
      amount: 160.45,
      quantity: 4,
      marketplace: 'eBay',
      paymentMethod: 'Paypal',
      buyerName: 'John Doe',
      adminName: 'Michael',
      invoiceNumber: '113245',
      paid: true,
      pickedup: false
    },
  ]

  // retail records table
  const renderTable = () => {
    const returnTableHead = [
      'Return Time',
      'SKU',
      'Invoice No.',
      'Buyer Name',
      'Admin Name',
      'Marketplace',
      'Reason',
      'Refund Method',
      'Return Quantity',
      'Refund Amount (CAD)',
    ]

    const renderFilter = () => {
      const onItemsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => setItemsPerPage(Number(event.target.value))
      const onPlatformFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => { setQueryFilter({ ...queryFilter, platformFilter: event.target.value }); setChanged(true) }
      const onConditionFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => { setQueryFilter({ ...queryFilter, conditionFilter: event.target.value }); setChanged(true) }
      const onMarketplaceFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => { setQueryFilter({ ...queryFilter, marketplaceFilter: event.target.value }); setChanged(true) }
      const onTimeRangeFilterChange = (value: DateRangePickerValue) => { setQueryFilter({ ...queryFilter, timeRangeFilter: value }); setChanged(true) }
      const resetFilters = () => {
        setQueryFilter(initQueryFilter)
        setCurrPage(0)
        setChanged(false)
        fetchRetailDataByPage()
      }
      return (
        <div className='flex'>
          <Button
            className='text-white absolute mt-4'
            color={changed ? 'amber' : 'emerald'}
            onClick={() => fetchRetailDataByPage()}
            tooltip='Refresh QA Records Table'
          >
            <FaRotate />
          </Button>
          <TableFilter
            queryFilter={queryFilter}
            setQueryFilter={setQueryFilter}
            onTimeRangeFilterChange={onTimeRangeFilterChange}
            onConditionFilterChange={onConditionFilterChange}
            onPlatformFilterChange={onPlatformFilterChange}
            onMarketplaceFilterChange={onMarketplaceFilterChange}
            resetFilters={resetFilters}
          />
          <div className="right-12 w-32 absolute text-left">
            <label className='text-gray-500'>Items Per Page</label>
            <Form.Select className='mr-2' value={String(itemsPerPage)} onChange={onItemsPerPageChange}>
              {renderItemPerPageOptions()}
            </Form.Select>
          </div>
        </div>
      )
    }
    return (
      <Card className='max-w-full'>
        {/* filter section */}
        {renderFilter()}
        {/* table */}
        <TabGroup className='mt-24'>
          <TabList className="mt-8" color='orange'>
            <Tab title='Sales'>Sales</Tab>
            <Tab title='Returns'>Returns</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <div className="mt-10">
                <Table className="mt-5">
                  <TableHead>
                    <TableRow>
                      <TableHeaderCell className='w-24'>SKU</TableHeaderCell>
                      <TableHeaderCell className='w-36'>Time</TableHeaderCell>
                      <TableHeaderCell className='w-36'>Buyer Name</TableHeaderCell>
                      <TableHeaderCell className='w-36'>Admin Name</TableHeaderCell>
                      <TableHeaderCell className='w-36'>Marketplace</TableHeaderCell>
                      <TableHeaderCell className='w-36'>Sales Quantity</TableHeaderCell>
                      <TableHeaderCell className='w-36'>Sales Amount ($CAD)</TableHeaderCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.map((item) => (
                      <TableRow key={item.sku}>
                        <TableCell>{item.sku}</TableCell>
                        <TableCell>{item.time}</TableCell>
                        <TableCell>{item.buyerName}</TableCell>
                        <TableCell>{item.adminName}</TableCell>
                        <TableCell>
                          <Badge color={getPlatformBadgeColor(item.marketplace)}>
                            {item.marketplace}
                          </Badge>
                        </TableCell>
                        <TableCell><Badge>{item.quantity}</Badge></TableCell>
                        <TableCell><Badge color='emerald'>{item.amount}</Badge></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabPanel>
            <TabPanel>
              {/* return */}
              <div className="mt-10">
                <Table className="mt-5">
                  <TableHead>
                    <TableRow>
                      {returnTableHead.map((value, index) => {
                        return <TableHeaderCell key={index}>{value}</TableHeaderCell>
                      })}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {returnArr.map((item) => (
                      <TableRow key={item.retailRecord.sku}>
                        <TableCell>{item.retailRecord.sku}</TableCell>
                        <TableCell>{item.retailRecord.invoiceNumber}</TableCell>
                        <TableCell>{item.returnTime}</TableCell>
                        <TableCell>{item.retailRecord.adminName}</TableCell>
                        <TableCell>{item.retailRecord.buyerName}</TableCell>
                        <TableCell>
                          <Badge color={getPlatformBadgeColor(item.retailRecord.marketplace)}>
                            {item.retailRecord.marketplace}
                          </Badge>
                        </TableCell>
                        <TableCell>{item.reason}</TableCell>
                        <TableCell>{item.refundMethod}</TableCell>
                        <TableCell>{item.returnQuantity}</TableCell>
                        <TableCell>{item.refundAmount}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </Card>
    )
  }

  const closeSalesRecordModal = (refresh: boolean) => {
    if (refresh) fetchRetailDataByPage()
    setShowSalesRecordModal(false)
  }

  const closeReturnsRecordModal = (refresh: boolean) => {
    if (refresh) fetchRetailDataByPage()
    setShowReturnsRecordModal(false)
  }

  return (
    <div>
      <CreateSalesRecordModal
        show={showSalesRecordModal}
        handleClose={closeSalesRecordModal}
      />
      <CreateReturnRecordModal
        show={showReturnsRecordModal}
        handleClose={closeReturnsRecordModal}
      />
      {/* top 3 charts */}
      <Grid className='gap-2' numItems={4}>
        <Col numColSpan={2}>
          {renderGraph1()}
        </Col>
        <Col>
          {renderGraph2()}
        </Col>
        <Col>
          {renderGraph3()}
        </Col>
      </Grid>
      {/* middle 4 cards */}
      <Grid className='gap-2 mt-2 mb-2' numItems={2}>
        <Col className='gap-2 flex' numColSpan={2}>
          <Card decoration="top" decorationColor="emerald">
            <Button className='w-full h-full' color='emerald' onClick={() => setShowSalesRecordModal(true)}>Create Sales Records</Button>
          </Card>
          <Card decoration="top" decorationColor="emerald">
            <Text>Today's Revenue</Text>
            <div className='flex'>
              <Metric>$ 1,024</Metric>
            </div>
            <Text>Avg 20.5$/Item</Text>
          </Card>
          <Card decoration="top" decorationColor="red">
            <Text>Today's Return Value</Text>
            <Metric>$ 158</Metric>
            <Text>Avg 13.4$/Item</Text>
          </Card>
          <Card decoration="top" decorationColor="red">
            <Button className='w-full h-full' color='rose' onClick={() => setShowReturnsRecordModal(true)}>Create Return Records</Button>
          </Card>
        </Col>
      </Grid>
      {/* the table */}
      {renderTable()}
    </div>
  )
}

export default RetailManager;