import React, { useState } from 'react'
import CustomDatePicker from './DateRangePicker'
import { Form, InputGroup, Modal } from 'react-bootstrap'
import { QAQueryFilter } from '../utils/Types'
import { Button, DateRangePickerValue } from '@tremor/react'
import { renderItemConditionOptions, renderMarketPlaceOptions, renderPlatformOptions } from '../utils/utils'
import { FaFilterCircleXmark, FaFilter } from 'react-icons/fa6'
import QANameSelection from './QANameSelection'
import ShelfLocationsSelection from './ShelfLocationsSelection'

type TableFilterProps = {
  queryFilter: QAQueryFilter,
  setQueryFilter: React.Dispatch<React.SetStateAction<QAQueryFilter>>,
  setChanged: React.Dispatch<React.SetStateAction<boolean>>,
  resetFilters: () => void,
  refresh: (skeyword: string) => void
}

const TableFilter: React.FC<TableFilterProps> = (props: TableFilterProps) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [searchKeyword, setSearchKeyword] = useState<string>('')

  const onSkuStartChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.setQueryFilter({ ...props.queryFilter, sku: { ...props.queryFilter.sku, gte: event.target.value } })
    props.setChanged(true)
  }
  const onSkuEndChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.setQueryFilter({ ...props.queryFilter, sku: { ...props.queryFilter.sku, lte: event.target.value } })
    props.setChanged(true)
  }
  const onMarketplaceFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    props.setQueryFilter({ ...props.queryFilter, marketplaceFilter: event.target.value })
    props.setChanged(true)
  }
  const onTimeRangeFilterChange = (value: DateRangePickerValue) => {
    props.setQueryFilter({ ...props.queryFilter, timeRangeFilter: value })
    props.setChanged(true)
  }
  const onQANameChange = (value: string[]) => {
    props.setQueryFilter({ ...props.queryFilter, qaFilter: value })
    props.setChanged(true)
  }
  const onShelfLocationsChange = (value: string[]) => {
    props.setQueryFilter({ ...props.queryFilter, shelfLocationFilter: value })
    props.setChanged(true)
  }
  const onPlatformFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    props.setQueryFilter({ ...props.queryFilter, platformFilter: event.target.value })
    props.setChanged(true)
  }
  const onConditionFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    props.setQueryFilter({ ...props.queryFilter, conditionFilter: event.target.value })
    props.setChanged(true)
  }
  const onKeywordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(event.target.value)
    props.setChanged(true)
  }
  const onTargetSKUChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.setQueryFilter({ ...props.queryFilter, targetSku: event.target.value })
    props.setChanged(true)
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
              <InputGroup.Text>Target SKU</InputGroup.Text>
              <Form.Control
                type='number'
                onChange={onTargetSKUChange}
                value={props.queryFilter.targetSku}
              />
            </InputGroup>
            <InputGroup>
              <InputGroup.Text>Select SKU</InputGroup.Text>
              <InputGroup.Text>From</InputGroup.Text>
              <Form.Control
                type='number'
                onChange={onSkuStartChange}
                value={props.queryFilter.sku?.gte}
              />
              <InputGroup.Text>To</InputGroup.Text>
              <Form.Control
                type='number'
                onChange={onSkuEndChange}
                value={props.queryFilter.sku?.lte}
              />
            </InputGroup>
            <QANameSelection
              onQANameChange={onQANameChange}
              qaNameSelection={props.queryFilter.qaFilter}
            />
            <ShelfLocationsSelection
              onShelfLocationChange={onShelfLocationsChange}
              shelfLocationSelection={props.queryFilter.shelfLocationFilter}
            />
            <div className='flex text-center'>
              <Form.Check
                className='m-auto'
                inline
                label="Show Recorded Only"
                type="checkbox"
                checked={props.queryFilter.showRecordedOnly}
                onChange={() => props.setQueryFilter({ ...props.queryFilter, showRecordedOnly: !props.queryFilter.showRecordedOnly })}
              />
            </div>
            <InputGroup>
              <InputGroup.Text>Keyword / Tags<br />(Separate By Space)<br />(Case Sensitive)<br />(Or Operator)</InputGroup.Text>
              <Form.Control
                className='resize-none'
                as='textarea'
                rows={4}
                onChange={onKeywordChange}
                value={searchKeyword}
              />
            </InputGroup>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            color='emerald'
            onClick={() => {
              props.refresh(searchKeyword)
              setShowAdvancedFilters(false)
            }}
          >
            Filter
          </Button>
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
          onValueChange={onTimeRangeFilterChange}
          value={props.queryFilter.timeRangeFilter}
        />
      </div>
      <div className='absolute right-[420px] gap-2 flex'>
        <div>
          <label className='text-gray-500'>Condition:</label>
          <Form.Select value={props.queryFilter.conditionFilter} onChange={onConditionFilterChange}>
            {renderItemConditionOptions()}
          </Form.Select>
        </div>
        <div>
          <label className='text-gray-500'>Platform:</label>
          <Form.Select value={props.queryFilter.platformFilter} onChange={onPlatformFilterChange}>
            {renderPlatformOptions()}
          </Form.Select>
        </div>
        <div>
          <label className='text-gray-500'>Marketplace:</label>
          <Form.Select value={props.queryFilter.marketplaceFilter} onChange={onMarketplaceFilterChange}>
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