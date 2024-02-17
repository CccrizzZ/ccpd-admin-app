import axios, { AxiosError, AxiosResponse } from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import {
  Card,
  Col,
  Form,
  InputGroup,
  Modal
} from 'react-bootstrap'
import {
  extractHttpsFromStr,
  initInstockInventory,
  server,
  getInstockInventory,
  convertCommentsInitial
} from '../utils/utils'
import { AppContext } from '../App'
import {
  InstockInventory,
  QARecord,
  ScrapedData
} from '../utils/Types'
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
  scrapeData: ScrapedData
}

const descriptionCharLimit = 250
const leadCharLimit = 50
const InventoryRecordingModal: React.FC<InventoryRecordingModalProps> = (props: InventoryRecordingModalProps) => {
  const { setLoading, userInfo } = useContext(AppContext)
  const [newInv, setNewInv] = useState<InstockInventory>(initInstockInventory)
  const [lead, setLead] = useState<string>()
  const [description, setDescription] = useState<string>()

  useEffect(() => {
    setNewInv({
      ...getInstockInventory(props.record, props.scrapeData, userInfo.name),
      url: extractHttpsFromStr(props.record.link),
      comment: convertCommentsInitial(props.record.comment) ?? ''
    })

  }, [props.record, props.scrapeData])

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
    // const recordEntries = Object.entries({ ...newInv, link: extractHttpsFromStr(newInv.url) })
    const recordEntries = Object.entries(newInv)
    return recordEntries.map(([index, val]) => {

      // if (index === 'link') val = extractHttpsFromStr(val)
      return (
        <ListItem key={index}>
          <span>{index}</span>
          <span className={index === 'adminName' || index === 'sku' ? 'text-rose-500' : ''}>{val}</span>
        </ListItem>
      )
    })
  }

  const onLeadChange = (event: React.ChangeEvent<HTMLInputElement>) => setLead(event.target.value)
  const onDescChange = (event: React.ChangeEvent<HTMLInputElement>) => setDescription(event.target.value)
  const getWordCount = (limit: Number, input?: string) => {
    if (input === '' || input === ' ' || input === undefined) return `0 / ${limit}`
    return `${input?.length} / ${limit}`
  }
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
                <InputGroup.Text>Lead<br />{getWordCount(leadCharLimit, lead)}</InputGroup.Text>
                <Form.Control
                  className='resize-none'
                  as="textarea"
                  rows={4}
                  value={lead}
                  onChange={onLeadChange}
                  maxLength={leadCharLimit}
                />
              </InputGroup>
              <InputGroup>
                <InputGroup.Text>Description<br />{getWordCount(descriptionCharLimit, description)}</InputGroup.Text>
                <Form.Control
                  className='resize-none'
                  as="textarea"
                  rows={4}
                  value={description}
                  onChange={onDescChange}
                  maxLength={descriptionCharLimit}
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
