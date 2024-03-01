import { useEffect, useState } from "react"
import axios, { AxiosError, AxiosResponse } from "axios"
import { Title, Button } from "@tremor/react"
import { server } from "../utils/utils"
import { ClipLoader } from "react-spinners"
import { FaFileCsv, FaRotate } from "react-icons/fa6"
import { Table } from 'react-bootstrap'
import moment from "moment"

// Daily QA record count overview table 
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

  const exportToday = async () => {
    await axios({
      method: 'get',
      url: server + '/inventoryController/getAllShelfSheet',
      responseType: 'blob',
      timeout: 8000,
      withCredentials: true
    }).then(async (res: AxiosResponse) => {
      if (res.status > 200) return alert('No records found for today!')

      // JSON parse csv content
      let file = new Blob([res.data], { type: 'text/csv' })
      const csv = JSON.parse(await file.text())
      file = new Blob([csv], { type: 'text/csv' })

      // way to get custom file name
      let link = document.createElement("a");
      link.setAttribute("href", URL.createObjectURL(file));
      link.setAttribute("download", `${moment().format('LL')}_Shelf_Sheet.csv`);
      document.body.appendChild(link);
      link.click()
      document.body.removeChild(link)
    }).catch((res: AxiosError) => {
      alert('Cannot Get Shelf Sheet CSV: ' + res.message)
    })
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
        {countArr.reverse().map((item, i) => <td key={i}>{item}</td>)}
      </tr>
    )
  })

  return (
    <>
      <div className="flex">
        <Title>📆 Past 7 Days QA Records</Title>
        <Button
          className="absolute right-36"
          color="emerald"
          onClick={exportToday}
          tooltip="Get Today's Shelf Sheet CSV"
        >
          <FaFileCsv />
        </Button>
        <Button
          className="absolute right-16"
          color="emerald"
          onClick={getData}
          tooltip="Refresh Table"
        >
          <FaRotate />
        </Button>
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