import React from 'react'
import { Form } from 'react-bootstrap'
import { renderItemPerPageOptions } from '../utils/utils'

type PageItemStatsBoxProps = {
  itemsPerPage: number,
  totalItems: number,
  onItemsPerPageChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
}

const PageItemStatsBox: React.FC<PageItemStatsBoxProps> = (props: PageItemStatsBoxProps) => {
  return (
    <div className="flex">
      <div>
        <label className='text-gray-500'>Items Per Page</label>
        <Form.Select className='mr-2' value={String(props.itemsPerPage)} onChange={props.onItemsPerPageChange}>
          {renderItemPerPageOptions()}
        </Form.Select>
      </div>
      <div className="text-center ml-6">
        <label className='text-gray-500 mb-1'>Total Items</label>
        <h4>{props.totalItems}</h4>
      </div>
    </div>
  )
}

export default PageItemStatsBox