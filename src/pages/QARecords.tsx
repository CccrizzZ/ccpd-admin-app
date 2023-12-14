import React, { useContext, useEffect, useState } from 'react'
import {
  Grid,
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
  Select,
  SelectItem,
  DatePicker,
  BarChart,
  Subtitle,
  AreaChart
} from '@tremor/react'
import { QARecord } from '../utils/Types'
import { AppContext } from '../App'
import moment from 'moment'
import { FaRotate } from 'react-icons/fa6'
import axios, { AxiosResponse } from 'axios'
import { initQARecord, server } from '../utils/utils'
import { Form } from 'react-bootstrap'

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
];

type QARecordProps = {

}

const QARecords: React.FC<QARecordProps> = (prop: QARecordProps) => {
  const { setLoading } = useContext(AppContext)
  const [selectedRecord, setSelectedRecord] = useState<QARecord>(initQARecord)
  const [QARecordArr, setQARecordArr] = useState<QARecord[]>([])
  const [currPage, setCurrPage] = useState<Number>(0)
  const [itemsPerPage, setItemsPerPage] = useState<Number>(20)
  // sorting & filtering
  const [dateRange, setDateRange] = useState<string>('All Time')


  useEffect(() => {
    fetchQARecords()
    console.log('Loading Qa RECORDS...')
  }, [])

  // fetch QA records according to page and size
  const fetchQARecords = async () => {
    setLoading(true)
    await axios({
      method: 'post',
      url: server + '/adminController/getQARecordsByPage',
      responseType: 'text',
      data: { page: currPage, itemsPerPage: itemsPerPage },
      withCredentials: true
    }).then((res: AxiosResponse) => {
      setQARecordArr(JSON.parse(res.data))

    }).catch((err) => {
      alert('Failed Fetching QA Records: ' + err.response.status)
    })
    setLoading(false)
  }

  const updateInventory = () => {
    setLoading(true)

    setLoading(false)
  }

  const deleteInventory = () => {
    setLoading(true)

    setLoading(false)
  }

  const onItemsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(event.target.value))
  }

  const renderRecordingPanel = () => {
    return (
      <div>

      </div>
    )
  }

  const renderInventoryTableBody = () => {
    return QARecordArr.map((record) => (
      <TableRow key={record.sku}>
        <TableCell>
          <Button className='text-white' color='indigo'>{record.sku}</Button>
        </TableCell>
        <TableCell>
          <Text>{record.owner}</Text>
        </TableCell>
        <TableCell>
          <Text>{record.shelfLocation}</Text>
        </TableCell>
        <TableCell>
          <Text>{record.comment}</Text>
        </TableCell>
        <TableCell>
          <Text>{record.link}</Text>
        </TableCell>
        <TableCell>
          <Text>{record.platform}</Text>
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

  return (
    <div>
      {/* top 3 charts */}
      <Grid className="gap-2" numItems={3} >
        <Col numColSpan={2}>
          <Card className="h-full" decoration='top' decorationColor='green'>
            <Title>Inventory Recording</Title>
            <hr />
            {selectedRecord.sku === 0 ? <Subtitle className='text-center mt-64'>Selected QA Records Details Will Be Shown Here!</Subtitle> : renderRecordingPanel()}
          </Card>
        </Col>
        <Col numColSpan={1}>
          <Card className="h-96">
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
            />
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
            />
          </Card>
        </Col>
      </Grid>
      <Card className='mt-2 max-w-full'>
        {/* table header */}
        <div className='flex'>
          <Button className='text-white mt-auto mb-auto' color='emerald' onClick={fetchQARecords}><FaRotate /></Button>
          <div className='flex ml-auto mr-auto'>
            <Subtitle>Show in range: </Subtitle>
            <DatePicker className="mr-3" />
            <small>to</small>
            <DatePicker className="ml-3" />
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
              <TableHeaderCell>Owner</TableHeaderCell>
              <TableHeaderCell>Shelf Location</TableHeaderCell>
              <TableHeaderCell>Comment</TableHeaderCell>
              <TableHeaderCell>Link</TableHeaderCell>
              <TableHeaderCell>Platform</TableHeaderCell>
              <TableHeaderCell>Amount</TableHeaderCell>
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
