import React, { useEffect, useState } from 'react'
import {
  Grid,
  Col,
  Card,
  Title,
  BarChart,
  AreaChart,
  Subtitle,
} from '@tremor/react'
import { QARecord } from '../utils/Types'

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
    SemiAnalysis: 2890,
    "The Pragmatic Engineer": 2338,
  },
  {
    date: "Feb 22",
    SemiAnalysis: 2756,
    "The Pragmatic Engineer": 2103,
  },
  {
    date: "Mar 22",
    SemiAnalysis: 3322,
    "The Pragmatic Engineer": 2194,
  },
  {
    date: "Apr 22",
    SemiAnalysis: 3470,
    "The Pragmatic Engineer": 2108,
  },
  {
    date: "May 22",
    SemiAnalysis: 3475,
    "The Pragmatic Engineer": 1812,
  },
  {
    date: "Jun 22",
    SemiAnalysis: 3129,
    "The Pragmatic Engineer": 1726,
  },
]

type QARecordProps = {
  setLoading: (isloading: boolean) => void
}

const QARecords: React.FC<QARecordProps> = (prop: QARecordProps) => {
  const [QARecordArr, setQARecordArr] = useState<QARecord[]>([])
  const [dateRange, setDateRange] = useState<string>('All Time')
  const [currPage, setCurrPage] = useState<Number>(0)
  const [itemPerPage, setItemPerPage] = useState<Number>(20)
  const [sortBy, setSortBy] = useState<string>('Time Created')

  useEffect(() => {
    console.log('Loading Qa RECORDS...')
  }, [])

  const fetchAllQARecords = () => {

  }

  const updateInventory = () => {

  }

  const deleteInventory = () => {

  }

  const renderInventoryTable = () => {

  }

  const renderDeleteInventoryPopup = () => {

  }

  return (
    <div>
      {/* top 3 charts */}
      <Grid className="gap-2 mt-3" numItems={1} numItemsSm={2} numItemsLg={2} >
        <Col>
          <Card className="mb-3" decoration="top" decorationColor="slate">
            <Title>Daily Q&A Inventory Records</Title>
            <Subtitle>
              {dateRange}
            </Subtitle>
            <BarChart
              className="h-72"
              data={barChartData}
              index="name"
              categories={["Number of Items"]}
              colors={["amber", "fuchsia"]}
              valueFormatter={valueFormatter}
              yAxisWidth={48}
              layout='horizontal'
            />
          </Card>
        </Col>
        <Col>
          <Card className="mb-3" decoration="top" decorationColor="slate">
            <Title>Daily Q&A Inventory Records</Title>
            <Subtitle>
              {dateRange}
            </Subtitle>
            <AreaChart
              className="h-72"
              data={chartdata}
              index="date"
              categories={["SemiAnalysis", "The Pragmatic Engineer"]}
              colors={["indigo", "cyan"]}
              valueFormatter={valueFormatter}
            />
          </Card>
        </Col>
      </Grid>
      <Grid>
        <Col>

        </Col>
      </Grid>
      {/* actual table */}
      <div>
      </div>
    </div>
  )
}

export default QARecords
