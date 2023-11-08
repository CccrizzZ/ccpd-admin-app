import React, { useState } from 'react'

type ListingTableProp<T> = {
  dataArr: T[]
}

const ListingTable = (prop: ListingTableProp<any>) => {


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