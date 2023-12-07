import React from 'react'
import { QARecord } from '../utils/Types'
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
  Subtitle,
  List,
  ListItem,
  DonutChart,
  Legend
} from '@tremor/react'
import '../style/Dashboard.css'
import moment from 'moment'

type dashboardProp = {
  inventoryArr: QARecord[]
}

const Dashboard: React.FC<dashboardProp> = (prop: dashboardProp) => {
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
  const pieData = [
    {
      name: "New York",
      sales: 9800,
    },
    {
      name: "London",
      sales: 4567,
    },
    {
      name: "Hong Kong",
      sales: 3908,
    },
    {
      name: "San Francisco",
      sales: 2400,
    },
    {
      name: "Singapore",
      sales: 1908,
    },
    {
      name: "Zurich",
      sales: 1398,
    },
  ];

  // get all data from server
  const getBarChartData = () => {
    const data = []
    for (let i = 0; i < 6; i++) {
      data.push({
        name: 'New',
        'Number of Items': i
      })
    }
    return data
  }

  const getLineChartData = () => {

  }

  const valueFormatter = (number: number) => `${new Intl.NumberFormat("us").format(number).toString()}`

  return (
    <div style={{ userSelect: 'none' }}>
      {/* top 3 charts */}
      <Grid className="gap-2 mt-3" numItems={1} numItemsSm={2} numItemsLg={3} >
        <Col numColSpan={1} numColSpanLg={1}>
          <Card className="mb-3" decoration="top" decorationColor="slate">
            <Title>7 Days &A Inventory Record Defects</Title>
            <Subtitle>
              Compare between defected Q&A entry and passed ones.
            </Subtitle>
            <LineChart
              className="h-72"
              data={LineChartData}
              index="day"
              categories={["Total QA Inventory", "Defect QA Record"]}
              colors={["emerald", "red"]}
              valueFormatter={valueFormatter}
              yAxisWidth={40}
            />
          </Card>
        </Col>
        <Col>
          <Card className="mb-3" decoration="top" decorationColor="slate">
            <Title>Today's Q&A Record </Title>
            <Subtitle>
              {moment().format("MMMM DD YYYY")}
            </Subtitle>
            <DonutChart
              className="h-64"
              data={pieData}
              category="sales"
              index="name"
              valueFormatter={valueFormatter}
              colors={["slate", "violet", "indigo", "rose", "cyan", "amber"]}
            />
            <Legend
              categories={["Active users", "Inactive users"]}
              colors={["emerald", "red"]}
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

      {/* live datas overview */}
      <Grid numItems={1} numItemsSm={2} numItemsLg={3} className="gap-2">
        <Col numColSpan={1} numColSpanLg={1}>
          <Card decoration="top" decorationColor="indigo">
            <Text>Today's QA Inventory</Text>
            <Metric>55</Metric>
          </Card>
        </Col>
        <Card decoration="top" decorationColor="green">
          <Text>Today's Retail</Text>
          <Metric>$ 1,024 / 12 Items</Metric>
        </Card>
        <Card decoration="top" decorationColor="red">
          <Text>Today's Return</Text>
          <Metric>$ 45 / 1 Item</Metric>
        </Card>
        <Col>
          <Card decoration="top" decorationColor="orange">
            <Text>Unclosed Auction</Text>
            <Metric>Auction #129</Metric>
            <Text>Closing on Dec 12 2023</Text>
          </Card>
        </Col>
        <Card decoration="top" decorationColor="purple">
          <Text>Last Shipment Date</Text>
          <Metric>Oct 25</Metric>
        </Card>
        <Card decoration="top" decorationColor="sky">
          <Text>Today's Working Q&A Employee</Text>
          <Metric>7 People</Metric>
        </Card>
      </Grid>

    </div>
  )
}

export default Dashboard