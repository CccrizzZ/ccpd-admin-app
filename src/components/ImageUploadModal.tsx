import axios, { AxiosError, AxiosResponse } from 'axios'
import React, { useState } from 'react'
import { Form, InputGroup, Modal } from 'react-bootstrap'
import { server } from '../utils/utils'
import { Button } from '@tremor/react'
import { UserInfo } from '../utils/Types'

type ImageUploadModalProps = {
  sku: number,
  show: boolean,
  handleClose: () => void
  userInfo: UserInfo
}

const ImageUploadModal: React.FC<ImageUploadModalProps> = (props: ImageUploadModalProps) => {
  const [targetImageUrl, setTargetImageUrl] = useState<string>('')
  const [targetImageName, setTargetImageName] = useState<string>('')

  const onTargetImageNameChange = (event: React.ChangeEvent<HTMLInputElement>) => setTargetImageName(event.target.value)
  const onTargetImageUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTargetImageUrl(event.target.value)
    setTargetImageName(event.target.value.substring(event.target.value.lastIndexOf('/') + 1))
  }

  const uploadTargetImage = async () => {
    const data = {
      'sku': props.sku,
      'owner': props.userInfo,
      'url': targetImageUrl,
      'imageName': targetImageName
    }
    // axios post
    await axios({
      method: 'post',
      url: server + '/imageController/uploadScrapedImage',
      responseType: 'text',
      timeout: 8000,
      data: JSON.stringify(data),
      withCredentials: true
    }).then((res: AxiosResponse) => {
      if (res.status === 200) {
        alert(`Uploaded Images for SKU: ${props.sku}`)
      }
    }).catch((res: AxiosError) => {
      alert(`Cannot Upload Image: ${res.message}`)
    })
    props.handleClose()
  }

  return (
    <Modal
      show={props.show}
      onHide={props.handleClose}
      backdrop="static"
      keyboard={false}
    >
      <div className='grid p-8 gap-2'>
        <h5>Upload Image by URL: </h5>
        <InputGroup>
          <InputGroup.Text>Name</InputGroup.Text>
          <InputGroup.Text>{props.sku + '_'}</InputGroup.Text>
          <Form.Control maxLength={16} value={targetImageName} onChange={onTargetImageNameChange} />
        </InputGroup>
        <InputGroup>
          <InputGroup.Text>URL</InputGroup.Text>
          <Form.Control as='textarea' rows={6} value={targetImageUrl} onChange={onTargetImageUrlChange} />
        </InputGroup>
        <img src={targetImageUrl} />
        <hr />
        <div className='flex'>
          <Button color='slate' onClick={props.handleClose}>Close</Button>
          <Button className='absolute right-8' color='emerald' onClick={uploadTargetImage}>Upload</Button>
        </div>
      </div>
    </Modal>
  )
}

export default ImageUploadModal
