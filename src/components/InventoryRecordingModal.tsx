import axios, { AxiosError, AxiosResponse } from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { Card, Col, Form, InputGroup, Modal } from 'react-bootstrap'
import { extractHttpsFromStr, initInstockInventory, server } from '../utils/utils'
import { AppContext } from '../App'
import { InstockInventory, QARecord, ScrapedData } from '../utils/Types'
import {
  List,
  ListItem,
  Button,
  Badge,
  Grid
} from '@tremor/react';

type InventoryRecordingModalProps = {
  show: boolean,
  handleClose: () => void
  record: QARecord,
  scrapeData: () => ScrapedData
}

const InventoryRecordingModal: React.FC<InventoryRecordingModalProps> = (props: InventoryRecordingModalProps) => {
  const { setLoading, userInfo } = useContext(AppContext)
  const [newInv, setNewInv] = useState<InstockInventory>(initInstockInventory)
  const [lead, setLead] = useState<string>()
  const [description, setDescription] = useState<string>()

  useEffect(() => {
    console.log(props.scrapeData)
    setNewInv({
      ...props.record,
      marketplace: props.record.marketplace,
      url: extractHttpsFromStr(props.record.link),
      adminName: userInfo.name,
      qaName: props.record.ownerName ?? '',
      condition: props.record.itemCondition,
      msrp: props.scrapeData().msrp,
      lead: '',
      description: '',
      quantityInstock: props.record.amount,
      quantitySold: 0
    })
  }, [])

  const recordInventory = async () => {
    setLoading(true)
    await axios({
      method: 'post',
      url: server + '/inventoryController/createInstockInventory',
      responseType: 'text',
      timeout: 8000,
      data: {

      },
      withCredentials: true
    }).then((res: AxiosResponse) => {
      if (res.status === 200) {
        alert(`Instock Inventory Created: ${props.record.sku}`)
      }
    }).catch((res: AxiosError) => {
      alert('Cannot get page: ' + res.status)
    })
    setLoading(false)
  }

  const renderItems = () => {
    const recordEntries = Object.entries({ ...newInv, link: extractHttpsFromStr(newInv.url) })
    return recordEntries.map(([index, val]) => <ListItem key={index}><span>{index}</span><span>{val}</span></ListItem>)
  }

  const onLeadChange = (event: React.ChangeEvent<HTMLInputElement>) => setLead(event.target.value)
  const onDescChange = (event: React.ChangeEvent<HTMLInputElement>) => setDescription(event.target.value)
  return (
    <Modal
      show={props.show}
      onHide={props.handleClose}
      backdrop="static"
      size='lg'
      keyboard={false}
    >
      <div className='p-8'>
        <h2>Confirm Inventory Info: #{newInv.sku}</h2>
        <Card className='p-3'>
          <Grid numItems={2}>
            <Col className='gap-2 grid mb-2'>
              <InputGroup>
                <InputGroup.Text>Lead</InputGroup.Text>
                <Form.Control
                  className='resize-none'
                  as="textarea"
                  rows={4}
                  value={lead}
                  onChange={onLeadChange}
                />
              </InputGroup>
              <InputGroup>
                <InputGroup.Text>Description</InputGroup.Text>
                <Form.Control
                  className='resize-none'
                  as="textarea"
                  rows={4}
                  value={description}
                  onChange={onDescChange}
                />
              </InputGroup>
            </Col>
            <Col>
              <List className="p-6">
                {renderItems()}
              </List>
            </Col>
            <Col className='gap-2 grid'>
              <Button color='indigo'>Generate Lead & Desc with ChatGPT</Button>
            </Col>
            <Col>

            </Col>
          </Grid>
        </Card>
        <div className='flex mt-3'>
          <Button color='slate' onClick={props.handleClose}>Close</Button>
          <Button className='absolute right-6' color='emerald' onClick={recordInventory}>Submit</Button>
        </div>
      </div>
    </Modal>
  )
}

export default InventoryRecordingModal
