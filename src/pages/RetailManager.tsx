import React, { useEffect, useState } from 'react'
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
  BarChart
} from '@tremor/react'
import { RetailRecord, ReturnRecord } from '../utils/Types'

const valueFormatter = (num: number) => `${new Intl.NumberFormat("us").format(num).toString()} Items`;

const RetailManager: React.FC = () => {
  const [retailArr, setRetailArr] = useState<RetailRecord[]>([])
  const [returnArr, setReturnArr] = useState<ReturnRecord[]>([])

  useEffect(() => {

  }, [])

  // 6 month, quarterly or weekly
  const retailReturnData = [
    {
      month: 'Aug',
      "Retail": 1204,
      "Return": 17,
    },
    {
      month: 'Sept',
      "Retail": 1504,
      "Return": 23,
    },
    {
      month: 'Oct',
      "Retail": 1404,
      "Return": 15,
    },
    {
      month: 'Nov',
      "Retail": 1604,
      "Return": 22,
    },
    {
      month: 'Dec',
      "Retail": 1004,
      "Return": 4,
    },
    {
      month: 'Jan',
      "Retail": 156,
      "Return": 14,
    }
  ]

  // overviewing conditions of retail goods
  const retailConditionData = [
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

  const renderGraph1 = () => {
    return (
      <Card>
        <Title>Retails VS Returns</Title>
        <AreaChart
          className="mt-6"
          data={retailReturnData}
          index="month"
          categories={["Retail", "Return"]}
          colors={["green", "red"]}
          valueFormatter={valueFormatter}
          yAxisWidth={40}
        />
      </Card>
    )
  }

  // shows retail condition
  const renderGraph2 = () => {
    return (
      <Card className='h-full'>
        <Title>Retail Conditions</Title>
        <DonutChart
          className="mt-6"
          data={retailConditionData}
          category="value"
          index="name"
          valueFormatter={valueFormatter}
          colors={["slate", "violet", "indigo", "rose", "cyan", "amber"]}
        />
      </Card>
    )
  }

  // shows market place
  const renderGraph3 = () => {
    return (
      <Card className='h-full'>
        <Title>Retail Price Range</Title>
        <BarChart
          className="mt-6"
          data={retailPriceRangeData}
          index="name"
          categories={["Amount"]}
          colors={["green"]}
          valueFormatter={valueFormatter}
          yAxisWidth={48}
          layout='vertical'
        />

      </Card>
    )
  }

  const renderRetailTable = () => {
    return (
      <Card>

      </Card>
    )
  }

  const renderReturnTable = () => {
    return (
      <Card>

      </Card>
    )
  }

  return (
    <div>
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
      {/* <Grid className="gap-2 mb-6" numItemsLg={4} >

      </Grid> */}
      <Grid className='gap-2 mt-2' numItems={2}>
        <Col className='gap-2 flex' numColSpan={2}>
          <Card decoration="top" decorationColor="green">
            <Text>Today's Retails</Text>
            <Metric>55 Items</Metric>
          </Card>
          <Card decoration="top" decorationColor="green">
            <Text>Today's Revenue</Text>
            <div className='flex'>
              <Metric>$ 1,024</Metric>
            </div>
            <Text>Avg 20$/Item</Text>
          </Card>
          <Card decoration="top" decorationColor="red">
            <Text>Today's Return</Text>
            <div className='flex'>
              <Metric>4 Items</Metric>
            </div>
          </Card>
          <Card decoration="top" decorationColor="red">
            <Text>Today's Return Value</Text>
            <Metric>$ 158</Metric>
          </Card>
        </Col>
        <Col>
          {renderRetailTable()}
        </Col>
        <Col>
          {renderReturnTable()}
        </Col>
      </Grid>
    </div>
  )
}

export default RetailManager;