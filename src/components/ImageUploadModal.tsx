import React, { useState } from 'react'
import { Form, InputGroup } from 'react-bootstrap'

type ImageUploadModalProps = {
  sku: number
}

const ImageUploadModal: React.FC<ImageUploadModalProps> = (props: ImageUploadModalProps) => {
  const [targetImageUrl, setTargetImageUrl] = useState<string>('')
  const [targetImageName, setTargetImageName] = useState<string>('')

  const onTargetImageNameChange = (event: React.ChangeEvent<HTMLInputElement>) => setTargetImageName(event.target.value)
  const onTargetImageUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => setTargetImageUrl(event.target.value)
  const uploadTargetImage = () => {
    // axios post

  }
  return (
    <div className='grid gap-2'>
      <h5>Upload Image By URL: </h5>
      <InputGroup>
        <InputGroup.Text>Name</InputGroup.Text>
        <Form.Control maxLength={16} value={targetImageName} onChange={onTargetImageNameChange} defaultValue={props.sku} />
      </InputGroup>
      <InputGroup>
        <InputGroup.Text>URL</InputGroup.Text>
        <Form.Control value={targetImageUrl} onChange={onTargetImageUrlChange} />
      </InputGroup>
    </div>
  )
}

export default ImageUploadModal
