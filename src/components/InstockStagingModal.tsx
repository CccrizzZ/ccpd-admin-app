import { Button } from '@tremor/react'
import axios, { AxiosError, AxiosResponse } from 'axios'
import React, { useContext } from 'react'
import { Modal } from 'react-bootstrap'
import { InstockQueryFilter } from '../utils/Types'
import { getKwArr, server } from '../utils/utils'
import { AppContext } from '../App'

type InstockStagingModalProps = {
  show: boolean,
  handleClose: () => void,
  queryFilter: InstockQueryFilter,
  keywords: string
}

const InstockStagingModal: React.FC<InstockStagingModalProps> = (props: InstockStagingModalProps) => {
  const { setLoading } = useContext(AppContext)

  const push = async () => {
    const filter = {
      ...props.queryFilter,
      keywordFilter: getKwArr(props.keywords, false)
    }
    setLoading(true)
    await axios({
      method: 'post',
      url: server + '/inventoryController/',
      responseType: 'text',
      timeout: 8000,
      data: { filter: filter },
      withCredentials: true
    }).then((res: AxiosResponse) => {
      if (res.status < 201) {
        alert('Auction Record Created')
      } else {
        alert('Failed to Create Auction Record')
      }
    }).catch((err: AxiosError) => {
      setLoading(false)
      alert('Failed Fetching QA Records: ' + err.message)
    })
    setLoading(false)
  }

  return (
    <Modal
      show={props.show}
      onHide={props.handleClose}
      backdrop="static"
      keyboard={false}
    >
      <div className='grid p-8 gap-2'>
        <h2>Create Auction Record</h2>
        <hr />
        <div className='flex'>
          <Button color='slate' onClick={props.handleClose}>Close</Button>
          <Button className='absolute right-8' color='emerald' onClick={push}>Create Auction Record</Button>
        </div>
      </div>
    </Modal>
  )
}
export default InstockStagingModal