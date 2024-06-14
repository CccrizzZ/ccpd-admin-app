import axios, { AxiosError, AxiosResponse } from 'axios'
import React, { useContext, useState } from 'react'
import { Form, InputGroup, Modal } from 'react-bootstrap'
import { server } from '../utils/utils'
import { Button } from '@tremor/react'
import { UserInfo } from '../utils/Types'
import { AppContext } from '../App'

type ImageUploadModalProps = {
  sku: number,
  show: boolean,
  handleClose: () => void
  userInfo: UserInfo
}

const ImageUploadModal: React.FC<ImageUploadModalProps> = (props: ImageUploadModalProps) => {
  const { setLoading } = useContext(AppContext)
  // target image var
  const [targetImageUrl, setTargetImageUrl] = useState<string>('')
  const [targetImagePrefix, setTargetImagePrefix] = useState<string>(`__${String(props.sku)}_`)
  const [targetImageName, setTargetImageName] = useState<string>('')
  const [selectedImages, setSelectedImages] = useState<File[]>([])

  const onTargetImageNameChange = (event: React.ChangeEvent<HTMLInputElement>) => setTargetImageName(event.target.value)
  const onTargetImageUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTargetImageUrl(event.target.value)
    setTargetImageName(event.target.value.substring(event.target.value.lastIndexOf('/') + 1))
  }

  // upload url file
  const uploadTargetImage = async () => {
    // null check
    if (!targetImageName) return
    if (!targetImageUrl) return
    setLoading(true)

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
      setLoading(false)
    })
    props.handleClose()
    setLoading(false)
  }

  // upload local files
  const upoloadMultipleFiles = async () => {
    // null check
    if (selectedImages.length < 1) return
    const newFormData = new FormData()
    setLoading(true)
    // append all selected images
    for (const item of selectedImages) {
      newFormData.append(item.name, item)
    }

    // send to server
    await axios({
      method: 'post',
      url: `${server}/imageController/uploadImage/${props.userInfo.id}/${props.userInfo.name}/${props.sku}`,
      headers: { 'Content-Type': 'multipart/form-data' },
      data: newFormData,
      withCredentials: true,
    }).then((res: AxiosResponse) => {
      if (res.status === 200) {
        alert(`Uploaded ${selectedImages.length} Files`)
        setSelectedImages([])
      }
    }).catch((err: AxiosError) => {
      alert(err.response?.data)
      setLoading(false)
    })
    props.handleClose()
    setLoading(false)
  }

  const onSelectedFilesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedImages(Array.from(event.target.files))
    }
  }

  const onTargetImagePrefixChange = (event: React.ChangeEvent<HTMLInputElement>) => setTargetImagePrefix(event.target.value)
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
          {/* <InputGroup.Text>{props.sku + '_'}</InputGroup.Text> */}
          <Form.Control
            maxLength={16}
            value={targetImagePrefix}
            onChange={onTargetImagePrefixChange}
          />
          <Form.Control
            maxLength={16}
            value={targetImageName}
            onChange={onTargetImageNameChange}
          />
        </InputGroup>
        <InputGroup>
          <InputGroup.Text>URL</InputGroup.Text>
          <Form.Control
            as='textarea'
            rows={6}
            value={targetImageUrl}
            onChange={onTargetImageUrlChange}
          />
        </InputGroup>
        <img src={targetImageUrl} alt='Check URL' />
        <br />
        <Button color='emerald' onClick={uploadTargetImage}>Upload By URL</Button>
        <hr />
        <label>Select Local Files</label>
        <InputGroup>
          <Form.Control
            type="file"
            accept="image/jpeg, image/png"
            multiple
            onChange={onSelectedFilesChange}
          />
        </InputGroup>
        <br />
        <Button color='emerald' onClick={upoloadMultipleFiles}>Upload Local Files</Button>
        <hr />
        <div className='flex'>
          <Button color='slate' onClick={props.handleClose}>Close</Button>
        </div>
      </div>
    </Modal>
  )
}

export default ImageUploadModal
