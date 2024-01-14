import {
  Button,
  Card,
  List,
  ListItem,
  Subtitle,
  Title
} from '@tremor/react'
import axios, { AxiosResponse } from 'axios'
import { forwardRef, useContext, useEffect, useImperativeHandle, useState } from 'react'
import { server } from '../utils/utils'
import { AppContext } from '../App'
import { QARecord } from '../utils/Types'
import { FaRotate } from 'react-icons/fa6'

export interface IProblemRecordsPanel {
  fetchProblemRecords: () => Promise<void>
}

type ProblemRecordsPanelProp = {
  setSelectedRecord: (record: QARecord) => void;
  setSelectedRecordImagesArr: (Arr: string[]) => void;
}

const ProblemRecordsPanel = forwardRef<IProblemRecordsPanel, ProblemRecordsPanelProp>((props: ProblemRecordsPanelProp, ref) => {
  const { setLoading } = useContext(AppContext)
  const [problemRecordsArr, setProblemRecordsArr] = useState<QARecord[]>([])

  useEffect(() => {
    fetchProblemRecords()
  }, [])

  useImperativeHandle(ref, () => ({
    fetchProblemRecords: () => fetchProblemRecords()
  }), [])

  const fetchProblemRecords = async () => {
    console.log('fetch Problem Records')
    setLoading(true)
    await axios({
      method: 'get',
      url: server + '/adminController/getProblematicRecords',
      responseType: 'text',
      timeout: 3000,
      data: '',
      withCredentials: true
    }).then((res: AxiosResponse) => {
      setProblemRecordsArr(JSON.parse(res.data))
    }).catch((err) => {
      setLoading(false)
      alert('Failed Fetching Problematic Records: ' + err.response.status)
    })
    setLoading(false)
  }



  const renderProblemRecordsList = () => {
    return problemRecordsArr.map((record) =>
      <ListItem key={record.sku}>
        <span>{record.sku}</span>
        <span>{record.ownerName}</span>
        <span>{record.shelfLocation}</span>
        <span>
          <Button
            color='slate'
            onClick={() => { props.setSelectedRecord(record); props.setSelectedRecordImagesArr([]) }}
          >
            👈Pull
          </Button>
        </span>
      </ListItem>
    )
  }

  return (
    <div>
      <Title>❓Problematic Records</Title>
      <Button
        color='emerald'
        className='right-16 absolute p-2 top-6'
        onClick={fetchProblemRecords}
        tooltip='Refresh Problematic Records'
      ><FaRotate /></Button>
      <Card className='h-72 overflow-y-scroll p-3 pt-0'>
        {problemRecordsArr.length > 0 ?
          <List>{renderProblemRecordsList()}</List> :
          <Subtitle className='text-center'>Records With Problems Will Be Shown Here</Subtitle>}
      </Card>
    </div>
  )
})

export default ProblemRecordsPanel