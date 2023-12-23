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
} from '@tremor/react'
import { RetailRecord, ReturnRecord, Condition } from '../utils/Types'
import '../style/RetailManager.css'
import { Form } from 'react-bootstrap';
import CreateSalesRecordModal from '../components/CreateSalesRecordModal';
import { AppContext } from '../App';
import { renderItemPerPageOptions, server } from '../utils/utils';
import axios from 'axios';

const itemValueFormatter = (num: number) => `${new Intl.NumberFormat("us").format(num).toString()} Items`;
const priceValueFormatter = (num: number) => `$ ${new Intl.NumberFormat("us").format(num).toString()}`;

const RetailManager: React.FC = () => {
  const { setLoading, userInfo } = useContext(AppContext)
  const [retailArr, setRetailArr] = useState<RetailRecord[]>([])
  const [currPage, setCurrPage] = useState<number>(0)
  const [itemsPerPage, setItemsPerPage] = useState<number>(20)
  const [timeRange, setTimeRange] = useState<string>('All Time')
  const [showSalesRecordModal, setShowSalesRecordModal] = useState<boolean>(false)

  const tableHead = [
    'SKU',
    'Time',
    'Marketplace',
    'Quantity',
    'Amount',
    'Payment Method',
    'Buyer Name',
    'Admin Name'
  ]

  useEffect(() => {
    // fetchRetailDataByPage()
  }, [])

  const fetchRetailDataByPage = async () => {
    setLoading(true)
    await axios({
      method: 'post',
      url: server + '/adminController/getSalesRecordsByPage',
      responseType: 'text',
      data: { 'currPage': currPage, 'itemsPerPage': itemsPerPage },
      withCredentials: true
    }).then((res) => {
      setRetailArr(JSON.parse(res.data))
    }).catch((err) => {
      alert('Cannot Fetch Retail Record: ' + err.response.status)
    })
    setLoading(false)
  }

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
        <Legend
          className="mt-3"
          categories={["New", "Sealed", "Used Like New", "Used", "As Is", "Damaged"]}
          colors={["green", "violet", "blue", "sky", "red"]}
        />
        <DonutChart
          className="mt-6 h-64"
          data={retailConditionData}
          category="items"
          index="condition"
          valueFormatter={itemValueFormatter}
          colors={["green", "violet", "blue", "sky", "red"]}
          showAnimation={true}
        />

      </Card>
    )
  }

  const data = [
    {
      name: "Viola Amherd",
      Role: "Federal Councillor",
      departement: "The Federal Department of Defence, Civil Protection and Sport (DDPS)",
      status: "active",
    },
    {
      name: "Simonetta Sommaruga",
      Role: "Federal Councillor",
      departement:
        "The Federal Department of the Environment, Transport, Energy and Communications (DETEC)",
      status: "active",
    },
    {
      name: "Alain Berset",
      Role: "Federal Councillor",
      departement: "The Federal Department of Home Affairs (FDHA)",
      status: "active",
    },
    {
      name: "Ignazio Cassis",
      Role: "Federal Councillor",
      departement: "The Federal Department of Foreign Affairs (FDFA)",
      status: "active",
    },
    {
      name: "Karin Keller-Sutter",
      Role: "Federal Councillor",
      departement: "The Federal Department of Finance (FDF)",
      status: "active",
    },
    {
      name: "Guy Parmelin",
      Role: "Federal Councillor",
      departement: "The Federal Department of Economic Affairs, Education and Research (EAER)",
      status: "active",
    },
    {
      name: "Elisabeth Baume-Schneider",
      Role: "Federal Councillor",
      departement: "The Federal Department of Justice and Police (FDJP)",
      status: "active",
    },
  ]

  // retail records table
  const onItemsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => setItemsPerPage(Number(event.target.value))
  const onTimeRangeChange = (event: React.ChangeEvent<HTMLSelectElement>) => setTimeRange(event.target.value)
  const renderRetailTable = () => {
    return (
      <Card>
        <div className='flex'>
          <div className='left-12 w-48 text-left'>
            <label className='text-gray-500'>Show Only</label>
            <Form.Select className='mr-2' value={timeRange} onChange={onTimeRangeChange}>
              <option value="All Time">All Time</option>
              <option value="Today">Today</option>
              <option value="This Week">This Week</option>
              <option value="This Month">This Month</option>
              <option value="Last 3 Months">Last 3 Months</option>
              <option value="Custom Range">Custom Range</option>
            </Form.Select>
          </div>
          <div className="right-12 w-32 absolute text-left">
            <label className='text-gray-500'>Items Per Page</label>
            <Form.Select className='mr-2' value={String(itemsPerPage)} onChange={onItemsPerPageChange}>
              {renderItemPerPageOptions()}
            </Form.Select>
          </div>
        </div>
        <Table className="mt-5">
          <TableHead>
            <TableRow>
              {tableHead.map((value, index) => {
                return <TableHeaderCell key={index}>{value}</TableHeaderCell>
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.name}>
                <TableCell>{item.name}</TableCell>
                <TableCell>
                  <Text>{item.Role}</Text>
                </TableCell>
                <TableCell>
                  <Text>{item.departement}</Text>
                </TableCell>
                <TableCell>
                  <Badge color="emerald">
                    {item.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    )
  }

  const closeSalesRecordModal = (refresh: boolean) => {
    if (refresh) fetchRetailDataByPage()
    setShowSalesRecordModal(false)
  }

  return (
    <div>
      <CreateSalesRecordModal
        show={showSalesRecordModal}
        handleClose={closeSalesRecordModal}
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
          <Card decoration="top" decorationColor="green">
            <Button className='w-full h-full' color='emerald' onClick={() => setShowSalesRecordModal(true)}>Create Sales Records</Button>
          </Card>
          <Card decoration="top" decorationColor="green">
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
            <Button className='w-full h-full' color='rose'>Create Return Records</Button>
          </Card>
        </Col>
      </Grid>
      {/* the table */}
      {renderRetailTable()}
    </div>
  )
}

export default RetailManager;