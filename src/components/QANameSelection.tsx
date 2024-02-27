import { MultiSelect, MultiSelectItem } from '@tremor/react'
import axios, { AxiosError, AxiosResponse } from 'axios'
import { useEffect, useState } from 'react'
import { FaUser } from 'react-icons/fa6'
import { server } from '../utils/utils'

type QANameSelectionProps = {
  onQANameChange: (value: string[]) => void,
  qaNameSelection: string[],
}

const QANameSelection: React.FC<QANameSelectionProps> = (props: QANameSelectionProps) => {
  const [QANameArr, setQANameArr] = useState<string[]>([])

  useEffect(() => {
    fetchQANames()
  }, [])

  const fetchQANames = async () => {
    await axios({
      method: 'get',
      url: server + '/userController/getAllActiveQAPersonal',
      responseType: 'text',
      timeout: 8000,
      withCredentials: true
    }).then((res: AxiosResponse) => {
      setQANameArr(JSON.parse(res.data))
    }).catch((err: AxiosError) => {
      alert('Failed Fetching QA Names: ' + err.message)
    })
  }

  const renderQANames = () => {
    if (QANameArr.map && QANameArr.length > 0) {
      return QANameArr.map((name, index) => (
        <MultiSelectItem value={name} key={index}>
          {name}
        </MultiSelectItem>
      ))
    }
  }

  return (
    <MultiSelect
      placeholder='Select QA Personal'
      icon={FaUser}
      onValueChange={props.onQANameChange}
      value={props.qaNameSelection}
    >
      {renderQANames()}
    </MultiSelect>
  )
}

export default QANameSelection
