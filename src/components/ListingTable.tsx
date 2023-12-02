import React, { useState } from 'react'

type ListingTableProp<T> = {
  dataArr: T[]
}

const ListingTable: React.FC<ListingTableProp<any>> = (prop: ListingTableProp<any>) => {
  const renderRow = () => {
    return (
      <>
      </>
    )
  }

  const renderTable = () => {
    return (
      <>
      </>
    )
  }

  return (
    <div>
      {renderTable()}
    </div>
  )
}

export default ListingTable