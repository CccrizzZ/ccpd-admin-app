import {
  List,
  ListItem,
  Card,
  TextInput,
  Button
} from '@tremor/react'
import React, { useState } from 'react'
import { FaTrash } from 'react-icons/fa6'

type ShelfLocationListProps = {
  shelfLocationsArr: string[],
  setShelfLocationArr: (newArr: string[]) => void,
}

const ShelfLocationList: React.FC<ShelfLocationListProps> = (props: ShelfLocationListProps) => {
  const [newShelfLocation, setNewShelfLocation] = useState<string>('')

  const addNewShelfLocation = () => {
    if (props.shelfLocationsArr.includes(newShelfLocation.toLowerCase())) return
    props.setShelfLocationArr([...props.shelfLocationsArr, newShelfLocation])
  }

  const removeShelfLocationByName = (name: string) => {
    props.setShelfLocationArr(props.shelfLocationsArr.filter((location) => location !== name))
  }

  return (
    <Card>
      <h2>Shelf Location Definition</h2>
      <div className='flex gap-2 justify-center'>
        <TextInput
          className='max-w-64 my-2'
          type='text'
          value={newShelfLocation}
          onValueChange={setNewShelfLocation}
        />
        <Button size='sm' className='m-auto w-32' onClick={addNewShelfLocation}>
          Add
        </Button>
      </div>
      <hr />
      <List className='px-0'>
        {props.shelfLocationsArr !== undefined ? props.shelfLocationsArr.map((val, index) => (
          <ListItem key={`${val} ${index}`}>
            <span>{val}</span>
            <span>
              <Button color='red' onClick={() => removeShelfLocationByName(val)}>
                <FaTrash />
              </Button>
            </span>
          </ListItem>
        )) : <></>}
      </List>
    </Card>
  )
}
export default ShelfLocationList
