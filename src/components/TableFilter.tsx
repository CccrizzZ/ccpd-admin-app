import React from 'react'
import CustomDatePicker from './DateRangePicker'
import { Form, InputGroup, Modal } from 'react-bootstrap'
import { QAQueryFilter } from '../utils/Types'
import { Button, DateRangePickerValue } from '@tremor/react'
import { renderItemConditionOptions, renderMarketPlaceOptions, renderPlatformOptions } from '../utils/utils'
import { FaFilterCircleXmark, FaFilter } from 'react-icons/fa6'
import QANameSelection from './QANameSelection'

type TableFilterProps = {
  queryFilter: QAQueryFilter,
  setQueryFilter: React.Dispatch<React.SetStateAction<QAQueryFilter>>,
  onTimeRangeFilterChange: (value: DateRangePickerValue) => void,
  onConditionFilterChange: (event: React.ChangeEvent<HTMLSelectElement>) => void,
  onPlatformFilterChange: (event: React.ChangeEvent<HTMLSelectElement>) => void,
  onMarketplaceFilterChange: (event: React.ChangeEvent<HTMLSelectElement>) => void,
  onQANameChange: (value: string[]) => void
  resetFilters: () => void
}

const TableFilter: React.FC<TableFilterProps> = (props: TableFilterProps) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = React.useState(false)
  const applyAdvFilters = () => {
    console.log(11111)
  }

  const renderAdvFilters = () => {
    return (
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={showAdvancedFilters}
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">
            🔮 Advanced Filter
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='grid gap-2 w-4/5 m-auto' style={{ minWidth: '80%' }}>
            <InputGroup>
              <InputGroup.Text>Select SKU</InputGroup.Text>
              <InputGroup.Text>From</InputGroup.Text>
              <Form.Control type='number' maxLength={8} max={8} />
              <InputGroup.Text>To</InputGroup.Text>
              <Form.Control type='number' maxLength={8} />
            </InputGroup>
            <InputGroup>
              <InputGroup.Text>QA Owner</InputGroup.Text>
              <Form.Control type='text' />
            </InputGroup>
            <QANameSelection
              onQANameChange={props.onQANameChange}
              qaNameSelection={props.queryFilter.qaFilter}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color='emerald' onClick={applyAdvFilters}>Filter</Button>
          <Button color='slate' onClick={() => setShowAdvancedFilters(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    )
  }

  return (
    <div className='gap-6 ml-16' style={{ minWidth: '80%' }}>
      {renderAdvFilters()}
      <div className='ml-6 mr-6 absolute'>
        <label className='text-gray-500'>Time Filter:</label>
        <CustomDatePicker
          onValueChange={props.onTimeRangeFilterChange}
          value={props.queryFilter.timeRangeFilter}
        />
      </div>
      <div className='absolute right-80 gap-2 flex'>
        <div>
          <label className='text-gray-500'>Condition:</label>
          <Form.Select value={props.queryFilter.conditionFilter} onChange={props.onConditionFilterChange}>
            {renderItemConditionOptions()}
          </Form.Select>
        </div>
        <div>
          <label className='text-gray-500'>Platform:</label>
          <Form.Select value={props.queryFilter.platformFilter} onChange={props.onPlatformFilterChange}>
            {renderPlatformOptions()}
          </Form.Select>
        </div>
        <div>
          <label className='text-gray-500'>Marketplace:</label>
          <Form.Select value={props.queryFilter.marketplaceFilter} onChange={props.onMarketplaceFilterChange}>
            {renderMarketPlaceOptions()}
          </Form.Select>
        </div>
        <Button
          className='text-white mt-4'
          color='rose'
          onClick={() => props.resetFilters()}
          tooltip='Reset Filters'
        >
          <FaFilterCircleXmark />
        </Button>
        <Button
          className='text-white mt-4'
          color='blue'
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          tooltip='Advanced Filters'
        >
          <FaFilter />
        </Button>
      </div>
    </div>
  )
}

export default TableFilter