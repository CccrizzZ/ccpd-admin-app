import { TextInput, Button, ListItem } from '@tremor/react'
import axios, { AxiosError, AxiosResponse } from 'axios'
import React, { useState } from 'react'
import { Modal } from 'react-bootstrap'
import { FaMagnifyingGlass } from 'react-icons/fa6'
import { server } from '../utils/utils'
import { ClipLoader } from 'react-spinners'

type QueryInfo = {
  auctionLots: Record<number, number>[], // {"auctionLot": "itemLot"}
  remainingLots: Record<number, string>[], // {204: "unsold", 224: "sold"}
}

type AuctionItemSearchModalProps = {
  show: boolean,
  close: () => void,
}

const AuctionItemSearchModal: React.FC<AuctionItemSearchModalProps> = (props: AuctionItemSearchModalProps) => {
  const [sku, setSku] = useState<string>("")
  const [queryInfo, setQueryInfo] = useState<QueryInfo>({ auctionLots: [], remainingLots: [] })
  const [loading, setLoading] = useState<boolean>(false)

  const search = async () => {
    if (sku === "" || loading) return
    setLoading(true)
    // send duplication request
    await axios({
      method: 'post',
      url: `${server}/inventoryController/findItemInAuctionRemaining`,
      responseType: 'text',
      timeout: 8000,
      withCredentials: true,
      data: {
        sku: Number(sku)
      }
    }).then((res: AxiosResponse) => {
      if (res.status === 200) {
        console.log(res.data)
        setQueryInfo(JSON.parse(res.data))
      }
    }).catch((err: AxiosError) => {
      alert('Item Not Found In Both Auction Records & Remaining Records: ' + err.response?.data)
    })
    setLoading(false)
  }

  return (
    <Modal
      show={props.show}
      onHide={props.close}
      keyboard={false}
      size='sm'
    >
      <div className='p-6 grid gap-2'>
        <h2>Find Item By SKU</h2>
        <TextInput
          type="number"
          icon={FaMagnifyingGlass}
          value={sku}
          onValueChange={setSku}
        />
        <hr />
        <div>
          {queryInfo.auctionLots !== undefined ? queryInfo.auctionLots.map((val, index) => (
            <div key={index * 2}>
              {Object.entries(val).map(([aLot, iLot], index) => (
                <ListItem key={index + iLot}>
                  <p>
                    Auction:
                    <span className='text-emerald-400'>{aLot}</span>
                  </p>
                  <p>
                    Lot# in itemsArr:
                    <span className='text-emerald-400'>{iLot}</span>
                  </p>
                </ListItem>
              ))}
            </div>
          )) : <></>}
        </div>
        <hr />
        <Button color="emerald" onClick={search}>Search</Button>
        <Button color="gray" onClick={loading ? undefined : props.close}>{loading ? <ClipLoader /> : "Close"}</Button>
      </div>
    </Modal>
  )
}

export default AuctionItemSearchModal