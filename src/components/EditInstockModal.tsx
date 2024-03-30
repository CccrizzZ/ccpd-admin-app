import {
  Button,
  Col,
  Grid,
  DonutChart,
  Card
} from '@tremor/react'
import React, { useContext, useEffect, useState } from 'react'
import { Form, InputGroup, Modal } from 'react-bootstrap'
import { Condition, InstockInventory, Platform } from '../utils/Types'
import axios, { AxiosError, AxiosResponse } from 'axios'
import {
  initInstockInventory,
  isObjectsEqual,
  openLink,
  renderItemConditionOptions,
  renderMarketPlaceOptions,
  renderPlatformOptions,
  server,
  stringToNumber
} from '../utils/utils'
import ConfirmationModal from './ConfirmationModal'
import { AppContext } from '../App'

type ChartData = {
  name: string,
  amount: number,
}

type EditInstockModalProps = {
  show: boolean,
  handleClose: () => void,
  selectedInventory: InstockInventory,
  refreshTable: () => void
}

const EditInstockModal: React.FC<EditInstockModalProps> = (props: EditInstockModalProps) => {
  const { setLoading } = useContext(AppContext)
  const [instockDetail, setInstockDetail] = useState<InstockInventory>(initInstockInventory)
  const [originalDetail, setOriginalDetail] = useState<InstockInventory>(initInstockInventory)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<boolean>(false)
  const [instockChartData, setInstockChartData] = useState<ChartData[]>([])

  useEffect(() => {
    setInstockDetail(props.selectedInventory)
    setOriginalDetail({ ...initInstockInventory, ...props.selectedInventory })
    setInstockChartData([
      {
        name: 'sold',
        amount: props.selectedInventory.quantitySold ?? 0
      },
      {
        name: 'instock',
        amount: props.selectedInventory.quantityInstock ?? 0
      },
    ])
  }, [props.selectedInventory])

  const updateInstockInventory = async () => {
    if (isObjectsEqual(instockDetail, originalDetail)) return alert('Cannot Submit Unchanged Record')
    setLoading(true)
    await axios({
      method: 'put',
      url: server + '/inventoryController/updateInstockBySku',
      responseType: 'text',
      data: JSON.stringify(instockDetail),
      withCredentials: true
    }).then((res) => {
      if (res.status === 200) {
        alert('updated ' + instockDetail.sku)
      }
    }).catch((err) => {
      alert('Failed Updating Inventory Record: ' + err.message)
    })
    setLoading(false)
    props.handleClose()
    props.refreshTable()
  }

  const deleteInstockInventory = async () => {
    setLoading(true)
    await axios({
      method: 'delete',
      url: server + '/inventoryController/deleteInstockBySku',
      responseType: 'text',
      data: JSON.stringify({ 'sku': instockDetail.sku }),
      withCredentials: true
    }).then((res: AxiosResponse) => {
      if (res.status === 200) {
        alert(`Deleted Instock Inventory #${instockDetail.sku}`)
      }
    }).catch((err: AxiosError) => {
      alert(`Failed Deleting Instock Inventory: ${err.message}`)
    })
    setLoading(false)
    props.handleClose()
    props.refreshTable()
  }

  const resetToOriginal = () => {
    setInstockDetail(originalDetail)
    setInstockChartData([
      {
        name: 'sold',
        amount: originalDetail.quantitySold
      },
      {
        name: 'instock',
        amount: originalDetail.quantityInstock
      },
    ])
  }

  const close = () => {
    resetToOriginal()
    props.handleClose()
  }

  const onShelfLocationChange = (event: React.ChangeEvent<HTMLInputElement>) => setInstockDetail({ ...instockDetail, shelfLocation: event.target.value })
  const onConditionChange = (event: React.ChangeEvent<HTMLSelectElement>) => setInstockDetail({ ...instockDetail, condition: event.target.value as Condition })
  const onMSRPChange = (event: React.ChangeEvent<HTMLInputElement>) => setInstockDetail({ ...instockDetail, msrp: stringToNumber(event.target.value) })
  const onSkuChange = (event: React.ChangeEvent<HTMLInputElement>) => setInstockDetail({ ...instockDetail, sku: stringToNumber(event.target.value) })
  const onCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => setInstockDetail({ ...instockDetail, comment: event.target.value })
  const onUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => setInstockDetail({ ...instockDetail, url: event.target.value })
  const onLeadChange = (event: React.ChangeEvent<HTMLInputElement>) => setInstockDetail({ ...instockDetail, lead: event.target.value })
  const onDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => setInstockDetail({ ...instockDetail, description: event.target.value })
  const onTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => setInstockDetail({ ...instockDetail, time: event.target.value })
  const onQANameChange = (event: React.ChangeEvent<HTMLInputElement>) => setInstockDetail({ ...instockDetail, qaName: event.target.value })
  const onPlatformChange = (event: React.ChangeEvent<HTMLSelectElement>) => setInstockDetail({ ...instockDetail, platform: event.target.value as Platform })
  const onMarketplaceChange = (event: React.ChangeEvent<HTMLSelectElement>) => setInstockDetail({ ...instockDetail, marketplace: event.target.value as Platform })

  const onQuantityInstockChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInstockDetail({ ...instockDetail, quantityInstock: stringToNumber(event.target.value) })
    setInstockChartData([
      { name: 'sold', amount: instockDetail.quantitySold },
      { name: 'instock', amount: stringToNumber(event.target.value) },
    ])
  }

  const onQuantitySoldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInstockDetail({ ...instockDetail, quantitySold: stringToNumber(event.target.value) })
    setInstockChartData([
      { name: 'sold', amount: stringToNumber(event.target.value) },
      { name: 'instock', amount: instockDetail.quantityInstock },
    ])
  }

  return (
    <Modal
      show={props.show}
      onHide={() => props.handleClose()}
      keyboard={false}
      size='lg'
      centered
    >
      <ConfirmationModal
        confirmAction={deleteInstockInventory}
        show={showDeleteConfirmation}
        hide={() => setShowDeleteConfirmation(false)}
        title={`Confirm to Delete ${instockDetail.sku}`}
        msg='You Cannot Undo Delete'
      />
      <Modal.Header>
        <h4>🏷️ Edit Instock Inventory Record #{instockDetail.sku}</h4>
        <Button className='absolute right-12' color='blue' onClick={resetToOriginal}>Reset</Button>
      </Modal.Header>
      <Modal.Body>
        <Grid className='gap-4' numItems={2}>
          <Col>
            <InputGroup className="mb-3">
              <InputGroup.Text>SKU</InputGroup.Text>
              <Form.Control value={instockDetail.sku} onChange={onSkuChange} />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text>Shelf Location</InputGroup.Text>
              <Form.Control value={instockDetail.shelfLocation} onChange={onShelfLocationChange} />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text>Inventory Condition</InputGroup.Text>
              <Form.Select value={instockDetail.condition} onChange={onConditionChange}>
                {renderItemConditionOptions()}
              </Form.Select>
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text>Original Platform</InputGroup.Text>
              <Form.Select value={instockDetail.platform} onChange={onPlatformChange}>
                {renderPlatformOptions()}
              </Form.Select>
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text>Target Marketplace</InputGroup.Text>
              <Form.Select value={instockDetail.marketplace} onChange={onMarketplaceChange}>
                {renderMarketPlaceOptions()}
              </Form.Select>
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text>Comment</InputGroup.Text>
              <Form.Control
                className='resize-none'
                value={instockDetail.comment}
                onChange={onCommentChange}
                as='textarea'
                rows={6}
              />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text>URL</InputGroup.Text>
              <Form.Control
                className='resize-none'
                value={instockDetail.url}
                onChange={onUrlChange}
                as='textarea'
                rows={4}
              />
              <Button color='slate' onClick={() => openLink(instockDetail.url)}>Open</Button>
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text>MSRP</InputGroup.Text>
              <Form.Control
                type='number'
                step={0.01}
                value={instockDetail.msrp}
                onChange={onMSRPChange}
              />
              <InputGroup.Text>($CAD)</InputGroup.Text>
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text>QA Personal</InputGroup.Text>
              <Form.Control
                value={instockDetail.qaName}
                onChange={onQANameChange}
              />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text>Time</InputGroup.Text>
              <Form.Control
                value={instockDetail.time}
                onChange={onTimeChange}
              />
            </InputGroup>
          </Col>
          <Col>
            <Card className='mb-3'>
              <DonutChart
                className='h-60 mb-3'
                data={instockChartData}
                showAnimation={true}
                category='amount'
                index='name'
                colors={['rose', 'emerald']}
                label={`Total Amount: ${instockDetail.quantityInstock + (instockDetail.quantitySold ?? 0)}`}
              />
              <InputGroup className="mt-3">
                <InputGroup.Text style={{ color: '#10b981' }}>Instock</InputGroup.Text>
                <Form.Control
                  value={instockDetail.quantityInstock}
                  onChange={onQuantityInstockChange}
                  min={0}
                  type='number'
                />
                <InputGroup.Text style={{ color: '#f43f5e' }}>Sold</InputGroup.Text>
                <Form.Control
                  min={0}
                  value={instockDetail.quantitySold}
                  onChange={onQuantitySoldChange}
                  type='number'
                />
              </InputGroup>
            </Card>
            <InputGroup className="mb-3">
              <InputGroup.Text>Lead</InputGroup.Text>
              <Form.Control
                className='resize-none'
                value={instockDetail.lead}
                onChange={onLeadChange}
                as='textarea'
                rows={4}
              />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text>Description</InputGroup.Text>
              <Form.Control
                className='resize-none'
                value={instockDetail.description}
                onChange={onDescriptionChange}
                as='textarea'
                rows={12}
              />
            </InputGroup>
          </Col>
        </Grid>
      </Modal.Body>
      <Modal.Footer>
        <div className='text-center'>
          <Button className='absolute left-6' color='rose' onClick={() => setShowDeleteConfirmation(true)}>Delete</Button>
          <Button color='slate' onClick={close}>Close</Button>
          <Button className='ml-2' color='emerald' onClick={updateInstockInventory}>Update</Button>
        </div>
      </Modal.Footer>
    </Modal>
  )
}

export default EditInstockModal