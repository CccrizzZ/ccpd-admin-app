import React, { useState, useContext } from 'react'
import { AppContext } from '../App'
import {
  Card,
  Title,
  TextInput
} from '@tremor/react'
import {
  FaMagnifyingGlass
} from 'react-icons/fa6'
import { QARecord } from '../utils/Types'
import { initQARecord } from '../utils/utils'

type SKULookupPanelProps = {

}

const SKULookupPanel: React.FC<SKULookupPanelProps> = (props: SKULookupPanelProps) => {
  const { setLoading } = useContext(AppContext)
  const [sku, setSku] = useState<string>('')
  const [inventory, setInventory] = useState<QARecord>(initQARecord)

  const onSkuChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSku(String(event.target.value))
  }

  const lookup = () => {
    setLoading(true)
    // send request
    // /getInventoryBySku {sku: string}
    setLoading(false)
  }

  return (
    <Card>
      <Title>SKU Lookup</Title>
      <small>Enter sku to lookup inventory details</small>
      <TextInput
        value={sku}
        className='mt-3'
        placeholder="Search..."
        error={false}
        errorMessage="Invalid SKU"
        icon={FaMagnifyingGlass}
        onChange={onSkuChange}
        onClick={lookup}
      />
      <hr />
      <small>Inventory details will be shown here</small>


    </Card>
  )
}

export default SKULookupPanel