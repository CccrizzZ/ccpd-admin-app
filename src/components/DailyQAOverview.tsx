import { useEffect, useState } from "react"
import axios, { AxiosError, AxiosResponse } from "axios"
import { Title, Button } from "@tremor/react"
import { server } from "../utils/utils"
import { ClipLoader } from "react-spinners"
import { FaRotate } from "react-icons/fa6"
import { Table } from 'react-bootstrap'


const DailyQAOverview = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [data, setData] = useState<Record<string, number[]>[]>([])
  const [datesArr, setDatesArr] = useState<string[]>([])

  useEffect(() => {
    getData()
  }, [])

  const getData = async () => {
    setIsLoading(true)
    await axios({
      method: 'get',
      url: server + '/inventoryController/getDailyQARecordData',
      responseType: 'text',
      timeout: 8000,
      withCredentials: true
    }).then((res: AxiosResponse) => {
      const data = JSON.parse(res.data)
      setData(data['res'])
      setDatesArr(data['dates'])
    }).catch((res: AxiosError) => {
      alert('Cannot Get Daily QA Data: ' + res.message)
    })
    setIsLoading(false)
  }

  const renderTableHead = () => datesArr.reverse().map((val, i) => (
    <th key={i}>{val}</th>
  ))

  // loop res object
  const renderTableBody = () => data.map((item, i) => {
    // loop item inside
    return Object.entries(item).map(([name, countArr]) =>
      <tr key={i}>
        <td>{name}</td>
        {countArr.map((item, i) => <td key={i}>{item}</td>)}
      </tr>
    )
  })

  return (
    <>
      <div className="flex">
        <Title>📆 Past 7 Days QA Records</Title>
        <Button className="absolute right-16" color="emerald" onClick={getData}><FaRotate /></Button>
      </div>
      {
        isLoading ?
          <ClipLoader className="absolute right-1/2 left-1/2 top-1/2" color="#d7375c" /> :
          <Table striped bordered size="sm" className="text-center">
            <thead>
              <tr>
                <th className="w-[120px]">#</th>
                {renderTableHead()}
              </tr>
            </thead>
            <tbody>
              {renderTableBody()}
            </tbody>
          </Table>
      }
    </>
  )
}
export default DailyQAOverview