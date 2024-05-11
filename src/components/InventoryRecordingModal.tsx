import axios, { AxiosError, AxiosResponse } from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import {
  Card,
  Col,
  Form,
  InputGroup,
} from 'react-bootstrap'
import {
  extractHttpsFromStr,
  initInstockInventory,
  server,
  getInstockInventory,
  convertCommentsInitial,
  toCad
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
  Grid
} from '@tremor/react';

type InventoryRecordingModalProps = {
  // show: boolean,
  // handleClose: () => void
  record: QARecord,
  scrapeData: ScrapedData
}

// Chat GPT generation panel
const descriptionCharLimit = 250
const leadCharLimit = 50
const InventoryRecordingModal: React.FC<InventoryRecordingModalProps> = (props: InventoryRecordingModalProps) => {
  const { setLoading, userInfo } = useContext(AppContext)
  const [newInv, setNewInv] = useState<InstockInventory>(initInstockInventory)
  const [lead, setLead] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  // chat gpt
  const [titleTemplate, setTitleTemplate] = useState<string>("You are an Auctioneer, based on the information, create a short product title. The character limit for product title is 50 characters.")
  const [descTemplate, setDescTemplate] = useState<string>("Please generate a product description in the format '[Item Condition] - [Item information]', The character limit for Item information is 250 characters.")


  useEffect(() => {
    setNewInv({
      ...getInstockInventory(props.record, userInfo.name),
      url: extractHttpsFromStr(props.record.link),
      comment: convertCommentsInitial(props.record.comment) ?? '',
      msrp: toCad(props.scrapeData.msrp, props.scrapeData.currency) ?? props.scrapeData.msrp,
      time: 'today' // let the server decide
    })

    return (() => {
      setDescription('')
      setLead('')
    })
  }, [props.record, props.scrapeData])

  const recordInventory = async () => {
    if (String(props.scrapeData.msrp) === 'NaN' || !props.scrapeData.msrp) return alert('MSRP of Scraped Data is Missing, Wait Until Scrape Finish')
    if (!description || !lead) return alert('Description or Lead is Missing')
    if (props.record.problem) return alert('Record is Problematic, Please Resolve it First')
    setLoading(true)
    await axios({
      method: 'post',
      url: server + '/inventoryController/createInstockInventory',
      responseType: 'text',
      timeout: 8000,
      data: JSON.stringify({ ...newInv, lead: lead, description: description }),
      withCredentials: true
    }).then((res: AxiosResponse) => {
      if (res.status === 200) {
        alert(`Instock Inventory Created: ${props.record.sku}`)
        // props.handleClose()
      }
    }).catch((res: AxiosError) => {
      alert('Cannot Push to Database: ' + res.response?.data)
    })
    setLoading(false)
  }

  const renderItems = () => {
    const recordEntries = Object.entries(newInv)
    return recordEntries.map(([index, val]) => {
      return (
        <ListItem key={index}>
          <span>{index}</span>
          {
            index === 'msrp' ?
              <span>{val} (CAD)</span> :
              <span className={`${index === 'adminName' || index === 'sku' ? 'text-rose-500' : ''} max-w-64`}>{val}</span>
          }
        </ListItem>
      )
    })
  }

  const renderScrapes = () => {
    const recordEntries = Object.entries(props.scrapeData)
    return recordEntries.map(([index, val]) => {
      return (
        <ListItem key={index}>
          <span>{index}</span>
          {
            index === 'imgUrl' ?
              <p className='max-w-64 min-h-12 text-wrap'>{val}</p> : index === 'msrp' ? <span>{val} ({props.scrapeData.currency})</span> :
                <span className={`${index === 'msrp' ? 'text-rose-500' : ''} max-w-64`}>{val}</span>
          }
        </ListItem>
      )
    })
  }

  const getLeadDesc = async () => {
    if (props.scrapeData.title === '') return alert('Title of Scraped Data is Missing, Wait Until Scrape Finish')
    setLoading(true)
    await axios({
      method: 'post',
      url: server + '/inventoryController/generateDescriptionBySku',
      responseType: 'text',
      timeout: 8000,
      data: ({
        comment: newInv.comment,
        condition: newInv.condition,
        title: props.scrapeData.title,
        titleTemplate: titleTemplate,
        descTemplate: descTemplate
      }),
      withCredentials: true
    }).then((res: AxiosResponse) => {
      if (res.status === 200) {
        const data = JSON.parse(res.data)
        setLead(data['lead'])
        setDescription(data['desc'])
      }
    }).catch((res: AxiosError) => {
      alert('Cannot Get Description: ' + res.response?.data)
    })
    setLoading(false)
  }
  const onLeadTemplateChange = (event: React.ChangeEvent<HTMLInputElement>) => setTitleTemplate(event.target.value)
  const onDescTemplateChange = (event: React.ChangeEvent<HTMLInputElement>) => setDescTemplate(event.target.value)
  const onLeadChange = (event: React.ChangeEvent<HTMLInputElement>) => setLead(event.target.value)
  const onDescChange = (event: React.ChangeEvent<HTMLInputElement>) => setDescription(event.target.value)
  const getWordCount = (limit: Number, input?: string) => {
    if (input === '' || input === ' ' || input === undefined) return `0 / ${limit}`
    return `${input?.length} / ${limit}`
  }
  return (
    // <Modal
    //   show={props.show}
    //   onHide={props.handleClose}
    //   backdrop="static"
    //   size='xl'
    //   keyboard={false}
    // >
    <div className='p-8 mb-12'>
      <h2>Stage Q&A Record: #{newInv.sku}</h2>
      <Card className='p-3'>
        <Grid numItems={2} className='mb-12'>
          <Col className='gap-2 grid mb-2'>
            <InputGroup>
              <InputGroup.Text>Lead Template</InputGroup.Text>
              <Form.Control
                className='resize-none '
                as="textarea"
                rows={2}
                value={titleTemplate}
                onChange={onLeadTemplateChange}
              />
            </InputGroup>
            <InputGroup>
              <InputGroup.Text>
                <p className='text-emerald-500'>
                  Result Lead<br />{getWordCount(leadCharLimit, lead)}
                </p>
              </InputGroup.Text>
              <Form.Control
                className='resize-none'
                as="textarea"
                rows={2}
                value={lead}
                onChange={onLeadChange}
              />
            </InputGroup>
            <InputGroup>
              <InputGroup.Text>Description Template</InputGroup.Text>
              <Form.Control
                className='resize-none'
                as="textarea"
                rows={4}
                value={descTemplate}
                onChange={onDescTemplateChange}
              />
            </InputGroup>
            <InputGroup>
              <InputGroup.Text>
                <p className='text-emerald-500'>
                  Result Description<br />{getWordCount(descriptionCharLimit, description)}
                </p>
              </InputGroup.Text>
              <Form.Control
                className='resize-none'
                as="textarea"
                rows={4}
                value={description}
                onChange={onDescChange}
              />
            </InputGroup>
          </Col>
          <Col className="p-2">
            <Card style={{ borderColor: '#4BBB8B' }}>
              <h4 className='p-3 mb-0'>Q&A Record #{newInv.sku}</h4>
              <List className="p-6">
                {renderItems()}
              </List>
            </Card>
            <Card className={`mt-2 ${props.scrapeData.msrp ? '' : 'bg-[#f07]'}`}>
              <h4 className='p-3 mb-0'> Scraped Data</h4>
              <List className='p-6'>
                {renderScrapes()}
              </List>
            </Card>
          </Col>
          <Col className='gap-2 grid'>
            <Button color='indigo' onClick={getLeadDesc}>Generate Lead & Desc with ChatGPT</Button>
          </Col>
        </Grid>
      </Card>
      <div className='flex mt-3'>
        {/* <Button color='slate' onClick={props.handleClose}>Close</Button> */}
        {(lead.length > 0 && description.length > 0) ? <Button className='absolute right-6' color='emerald' onClick={recordInventory}>👌 Submit Into Inventory</Button> : undefined}
      </div>
    </div>
    // </Modal>
  )
}

export default InventoryRecordingModal
