import {
  List,
  ListItem,
  Card,
  TextInput,
  Button,
  Badge
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
    if (newShelfLocation === '') return
    if (props.shelfLocationsArr.includes((newShelfLocation).toUpperCase())) return alert("Location Exist")
    props.setShelfLocationArr([...props.shelfLocationsArr, (newShelfLocation).toUpperCase()])
    setNewShelfLocation('')
  }

  const removeShelfLocationByName = (name: string) => {
    props.setShelfLocationArr(props.shelfLocationsArr.filter((location) => location !== name))
  }

  return (
    <Card className='min-h-[600px]'>
      <h2>Shelf Location Definition</h2>
      <div className='flex gap-2 justify-center'>
        <TextInput
          className='max-w-64 my-2'
          type='text'
          value={newShelfLocation}
          onValueChange={setNewShelfLocation}
          onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
            if (event.key === 'Enter') addNewShelfLocation()
          }}
        />
        <Button
          size='sm'
          className='m-auto w-32'
          onClick={addNewShelfLocation}
          color='emerald'
        >
          Add
        </Button>
      </div>
      <hr />
      <List className='px-0'>
        {props.shelfLocationsArr !== undefined ? props.shelfLocationsArr.map((val, index) => (
          <ListItem key={`${val} ${index}`}>
            <span>
              <Badge color='sky'>
                {val}
              </Badge>
            </span>
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
