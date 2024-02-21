import React, { useContext, useState } from 'react'
import { QARecord } from '../utils/Types'
import { getConditionVariant, getPlatformBadgeColor, initQARecord, server } from '../utils/utils'
import { AppContext } from '../App'
import axios, { AxiosError, AxiosResponse } from 'axios'
import {
  Badge,
  Card,
  Title,
  Button,
  Subtitle,
  ListItem,
  List,
} from '@tremor/react'
import { Form, InputGroup } from 'react-bootstrap'

type SearchPanelProp = {
  setSelectedRecord: (record: QARecord) => void
}

const SearchPanel: React.FC<SearchPanelProp> = (props: SearchPanelProp) => {
  const { setLoading } = useContext(AppContext)
  const [searchSKU, setSearchSKU] = useState<string>('')
  const [searchRes, setSearchRes] = useState<QARecord>(initQARecord)
  const searchRecordBySKU = async () => {
    if (searchSKU.length < 2) return alert('Please Enter Target SKU')
    if (searchSKU === String(searchRes.sku)) return
    setLoading(true)
    // send searchSKU with axios
    await axios({
      method: 'post',
      url: server + '/inventoryController/getInventoryBySku',
      responseType: 'text',
      data: { sku: searchSKU },
      timeout: 8000,
      withCredentials: true
    }).then((res: AxiosResponse) => {
      setSearchRes(JSON.parse(res.data))
    }).catch((err: AxiosError) => {
      setLoading(false)
      alert('No Record: ' + err.message)
    })
    setLoading(false)
  }

  const resetSearch = () => {
    setSearchSKU('')
    setSearchRes(initQARecord)
  }

  const onSearchSKUChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length < 8) setSearchSKU(event.target.value)
  }

  const handleEnterKeySearch = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') searchRecordBySKU()
  }

  return (
    <>
      <Title>🔍 Search Single Record</Title>
      <InputGroup size="sm" className="mb-3">
        <InputGroup.Text>SKU</InputGroup.Text>
        <Form.Control value={searchSKU} onChange={onSearchSKUChange} onKeyDown={handleEnterKeySearch} />
        <Button color='emerald' onClick={searchRecordBySKU}>Search</Button>
      </InputGroup>
      <Card className='h-52 overflow-y-scroll p-3 pt-0'>
        {searchRes.sku !== 0 ? <List>
          <ListItem>
            <span>SKU</span>
            <span>{searchRes.sku}</span>
          </ListItem>
          <ListItem>
            <span>Owner</span>
            <span>{searchRes.ownerName}</span>
          </ListItem>
          <ListItem>
            <span>Shelf Location</span>
            <Badge color='slate'>{searchRes.shelfLocation}</Badge>
          </ListItem>
          <ListItem>
            <span>Item Condition</span>
            <Badge color={getConditionVariant(searchRes.itemCondition)}>{searchRes.itemCondition}</Badge>
          </ListItem>
          <ListItem>
            <span>Amount</span>
            <span>{searchRes.amount}</span>
          </ListItem>
          <ListItem>
            <span>Platform</span>
            <Badge color={getPlatformBadgeColor(searchRes.platform)}>{searchRes.platform}</Badge>
          </ListItem>
          <ListItem>
            <span>Time Created</span>
            <span>{searchRes.time}</span>
          </ListItem>
          <ListItem>
            <Button onClick={() => props.setSelectedRecord(searchRes)} color='slate'>Select</Button>
          </ListItem>
        </List> : <Subtitle className='text-center'>Search Result Will Be Shown Here</Subtitle>}
      </Card>
      <Button className='absolute bottom-3' color='rose' size='xs' onClick={resetSearch}>Reset Search</Button>
    </>
  )
}

export default SearchPanel
