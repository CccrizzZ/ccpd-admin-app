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
      timeout: 10000,
      withCredentials: true
    }).then((res: AxiosResponse) => {
      const data = JSON.parse(res.data)
      setData(data['res'])
      setDatesArr(data['dates'].reverse())
    }).catch((res: AxiosError) => {
      alert('Cannot Get Daily QA Data: ' + res.message)
    })
    setIsLoading(false)
  }

  const exportCSV = async (daysAgo: number) => {
    await axios({
      method: 'post',
      url: server + '/inventoryController/getAllShelfSheet',
      responseType: 'blob',
      timeout: 800000,
      withCredentials: true,
      data: { "daysAgo": daysAgo }
    }).then(async (res: AxiosResponse) => {
      if (res.status > 200) return alert('No records found!')

      // JSON parse csv content
      let file = new Blob([res.data], { type: 'text/csv' })
      const csv = JSON.parse(await file.text())
      file = new Blob([csv], { type: 'text/csv' })

      // way to get custom file name
      let link = document.createElement("a");
      link.setAttribute("href", URL.createObjectURL(file));
      link.setAttribute("download", `${moment().subtract(daysAgo, "days").format('LL')}_Shelf_Sheet.csv`);
      document.body.appendChild(link);
      link.click()
      document.body.removeChild(link)
    }).catch((res: AxiosError) => {
      alert('Cannot Get Shelf Sheet CSV: ' + res.response?.statusText)
    })
  }

  const renderTableHead = () => datesArr.map((val, i) => (
    <th key={i}>{val}</th>
  ))

  // loop res object
  const renderTableBody = () => data.map((item, i) => {
    // loop item inside
    return Object.entries(item).map(([name, countArr]) =>
      <tr key={i}>
        <td>{name}</td>
        {countArr.slice(0).reverse().map((item, i) => <td key={i}>{item}</td>)}
      </tr>
    )
  })

  const renderSumRow = () => {
    let sum = [0, 0, 0, 0, 0, 0, 0]

    data.map((val) => {
      Object.entries(val).map((arr) => {
        sum[0] += arr[1][0]
        sum[1] += arr[1][1]
        sum[2] += arr[1][2]
        sum[3] += arr[1][3]
        sum[4] += arr[1][4]
        sum[5] += arr[1][5]
        sum[6] += arr[1][6]
      })
    })
    sum.reverse()
    return (
      <tr>
        <td className="!text-green-500">SUM</td>
        <td className="!text-green-500">{sum[0]}</td>
        <td className="!text-green-500">{sum[1]}</td>
        <td className="!text-green-500">{sum[2]}</td>
        <td className="!text-green-500">{sum[3]}</td>
        <td className="!text-green-500">{sum[4]}</td>
        <td className="!text-green-500">{sum[5]}</td>
        <td className="!text-green-500">{sum[6]}</td>
      </tr>
    )
  }

  const renderExportCSVButtonRow = () => {
    const daysAgoArr = [0, 1, 2, 3, 4, 5, 6]
    if (data.length < 1) return
    return (
      <tr>
        <td>CSV</td>
        {daysAgoArr.reverse().map((val, index) => (
          <td key={`${val}-${index}`}>
            <Button
              className="p-1"
              color="emerald"
              onClick={() => exportCSV(val)}
              tooltip="Get Shelf Sheet CSV"
            >
              <FaFileCsv />
            </Button>
          </td>
        ))}
      </tr>
    )
  }

  return (
    <>
      <div className="flex">
        <Title>📆 Past 7 Days QA Records</Title>

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
              {renderSumRow()}
              {renderExportCSVButtonRow()}
            </tbody>
          </Table>
      }
    </>
  )
}
export default DailyQAOverview