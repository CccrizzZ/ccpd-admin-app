import axios, { AxiosResponse } from 'axios'
import React, { useEffect, useState } from 'react'
import { MultiSelect, MultiSelectItem } from "@tremor/react"
import { server } from '../utils/utils'
import { FaWarehouse } from 'react-icons/fa6'

type ShelfLocationsSelectionProps = {
  onShelfLocationChange: (value: string[]) => void,
  shelfLocationSelection: string[],
}

const ShelfLocationsSelection: React.FC<ShelfLocationsSelectionProps> = (props: ShelfLocationsSelectionProps) => {
  const [shelfLocations, setShelfLocations] = useState<string[]>([])
  useEffect(() => {
    fetchAllShelfLocations()
  }, [])

  const fetchAllShelfLocations = async () => {
    await axios({
      method: 'get',
      url: server + '/inventoryController/getAllShelfLocations',
      responseType: 'text',
      timeout: 8000,
      data: '',
      withCredentials: true
    }).then((res: AxiosResponse) => {
      setShelfLocations(JSON.parse(res.data))
    }).catch((err) => {
      alert('Failed Fetching Shelf Locations: ' + err.message)
    })
  }

  const renderShelfLocations = () => {
    if (shelfLocations === undefined) return
    if (shelfLocations.map) {
      return shelfLocations.map((location, index) => (
        <MultiSelectItem value={location} key={index}>
          {location}
        </MultiSelectItem>
      ))
    }
  }

  return (
    <MultiSelect
      placeholder='Select Shelf Locations'
      className='mb-3'
      icon={FaWarehouse}
      onValueChange={props.onShelfLocationChange}
      value={props.shelfLocationSelection}
    >
      {renderShelfLocations()}
    </MultiSelect>
  )
}

export default ShelfLocationsSelection
