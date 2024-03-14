import React from 'react'
import { Toast } from 'react-bootstrap'
import { FaCloudBolt } from 'react-icons/fa6'
type PopupToastProp = {
  onClose: () => void,
  show: boolean,
  setMsg: (msg: string) => void
}


// TODO: replace all alerts in project
const PopupToast: React.FC<PopupToastProp> = (prop: PopupToastProp) => {
  return (
    <div>
      <Toast onClose={prop.onClose} show={prop.show} delay={3000} autohide>
        <Toast.Header>
          <FaCloudBolt />
          <strong className="me-auto">Alert</strong>
          {/* <small>11 mins ago</small> */}
        </Toast.Header>
        <Toast.Body>{ }</Toast.Body>
      </Toast>
    </div >
  )
}

export default PopupToast
