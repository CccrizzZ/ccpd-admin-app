import React, { useState } from 'react'
import {
  Grid,
  Col,
  Card,
  Text,
  Metric,
  Title,
  BarChart,
  LineChart,
  AreaChart,
  List,
  Subtitle,
  ListItem
} from '@tremor/react'
import ListingTable from '../components/ListingTable'
import { QARecord } from '../utils/Types'

const valueFormatter = (number: number) => `${new Intl.NumberFormat("us").format(number).toString()}`

// mock data
const LineChartData = [
  {
    day: 'Dec 1',
    "Total QA Inventory": 143,
    "Defect QA Record": 5,
  },
  {
    day: 'Dec 2',
    "Total QA Inventory": 112,
    "Defect QA Record": 2,
  },
  {
    day: 'Dec 3',
    "Total QA Inventory": 132,
    "Defect QA Record": 12,
  },
  {
    day: 'Dec 4',
    "Total QA Inventory": 123,
    "Defect QA Record": 7,
  },
  {
    day: 'Dec 5',
    "Total QA Inventory": 154,
    "Defect QA Record": 8,
  },
  //...
]
const barChartData = [
  {
    name: "New",
    "Number of Items": 2488,
  },
  {
    name: "Sealed",
    "Number of Items": 1445,
  },
  {
    name: "Used Like New",
    "Number of Items": 743,
  },
  {
    name: "Used",
    "Number of Items": 281,
  },
  {
    name: "Damaged",
    "Number of Items": 251,
  },
  {
    name: "As Is",
    "Number of Items": 232,
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

const QARecords = () => {
  const [QARecordArr, setQARecordArr] = useState<QARecord[]>([])

  return (
    <div>
      {/* top 3 charts */}
      <Grid className="gap-2 mt-3" numItems={1} numItemsSm={2} numItemsLg={2} >
        <Col>
          <Card className="mb-3" decoration="top" decorationColor="slate">
            <Title>Daily Q&A Inventory Records</Title>
            <Subtitle>
              Q&A entry of today.
            </Subtitle>
            <BarChart
              className="h-72"
              data={barChartData}
              index="name"
              categories={["Number of Items"]}
              colors={["lime", "amber", "fuchsia"]}
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
              Q&A entry of today.
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
      {/* actual table */}
      <div>
        <ListingTable dataArr={QARecordArr} />
      </div>
    </div>
  )
}

export default QARecords
