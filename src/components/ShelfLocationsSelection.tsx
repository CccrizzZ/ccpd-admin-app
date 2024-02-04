import axios, { AxiosResponse } from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { MultiSelect, MultiSelectItem } from "@tremor/react"
import { AppContext } from '../App'
import { server } from '../utils/utils'
import { FaWarehouse } from 'react-icons/fa6'

type ShelfLocationsSelectionProps = {
  value: string[],
  onShelfLocationChange: (value: string[]) => void
}

const ShelfLocationsSelection: React.FC<ShelfLocationsSelectionProps> = (props: ShelfLocationsSelectionProps) => {
  const { setLoading } = useContext(AppContext)
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
      setLoading(false)
      alert('Failed Fetching Shelf Locations: ' + err.response.status)
    })
  }

  const renderShelfLocations = () => {
    if (shelfLocations.map) {
      return shelfLocations.map((location, index) => (
        <MultiSelectItem value={location} key={index}>
          {location}
        </MultiSelectItem>
      ))
    }
  }

  return (
    <MultiSelect placeholder='Select Shelf Locations' className='mb-3' icon={FaWarehouse} onValueChange={props.onShelfLocationChange}>
      {renderShelfLocations()}
    </MultiSelect>
  )
}

export default ShelfLocationsSelection
