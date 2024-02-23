import React from 'react'
import { Modal } from 'react-bootstrap'
import { Button } from '@tremor/react'

type ConfirmationModalProps = {
  confirmAction: () => void,
  hide: () => void,
  show: boolean,
  title: string,
  msg: string
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = (props: ConfirmationModalProps) => {
  return (
    <Modal
      className='z-[1550]'
      show={props.show}
      onHide={props.hide}
      backdrop="static"
      centered
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>{props.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {props.msg}
      </Modal.Body>
      <Modal.Footer>
        <Button color='slate' onClick={props.hide}>Close</Button>
        <Button color='blue' onClick={() => { props.confirmAction(); props.hide() }}>Confirm</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ConfirmationModal