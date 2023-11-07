import React, { useState } from 'react'
import { Button } from 'react-bootstrap'

const Inventory = () => {
  const [QARecordArr, setQARecordArr] = useState<boolean>(false)


  const onClick = () => {
    setQARecordArr(!QARecordArr)
  }


  return (
    <div>
      <h1>{String(QARecordArr)}</h1>
      <Button onClick={onClick}>Flip</Button>
    </div>
  )
}

export default Inventory