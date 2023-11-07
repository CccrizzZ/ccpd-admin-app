import React from 'react'
import { QARecord } from '../utils/Types'
import {
  Grid,
  Col,
  Card,
  Text,
  Metric
} from '@tremor/react'
type dashboardProp = {
  inventoryArr: QARecord[]
}

const Dashboard: React.FC<dashboardProp> = (prop: dashboardProp) => {
  return (
    <div>

      <Grid numItems={1} numItemsSm={2} numItemsLg={3} className="gap-2">
        <Col numColSpan={1} numColSpanLg={2}>
          <Card>
            <Text>Title</Text>
            <Metric>KPI 1</Metric>
          </Card>
        </Col>
        <Card>
          <Text>Title</Text>
          <Metric>KPI 2</Metric>
        </Card>
        <Col>
          <Card>
            <Text>Title</Text>
            <Metric>KPI 3</Metric>
          </Card>
        </Col>
        <Card>
          <Text>Title</Text>
          <Metric>KPI 4</Metric>
        </Card>
        <Card>
          <Text>Title</Text>
          <Metric>KPI 5</Metric>
        </Card>
      </Grid>

    </div>
  )
}

export default Dashboard