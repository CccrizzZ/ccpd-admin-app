import React, { useContext } from 'react'
import { Modal, Button } from 'react-bootstrap';
import { AppContext } from '../App';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { server } from '../utils/utils';
import { AdminSettings } from '../utils/Types';

type AdminSettingsModalProps = {
  show: boolean,
  hide: () => void,
  settings: AdminSettings,
  setSettings: (setting: AdminSettings) => void
}

const AdminSettingsModal: React.FC<AdminSettingsModalProps> = (props: AdminSettingsModalProps) => {
  const { setLoading } = useContext(AppContext)

  const updateSettings = async () => {
    setLoading(true)
    await axios({
      method: 'post',
      url: server + '/adminController/updateAdminSettings',  // super admin only
      responseType: 'text',
      timeout: 8000,
      data: '',
      withCredentials: true
    }).then((res: AxiosResponse) => {
      props.setSettings((res.data))
    }).catch((res: AxiosError) => {
      alert('Failed Getting Admin Settings: ' + res.response?.data)
    })
    setLoading(false)
  }

  return (
    <div>
      <Modal
        className='z-[1550]'
        show={props.show}
        onHide={props.hide}
        backdrop="static"
        centered
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Admin Settings</Modal.Title>
        </Modal.Header>
        <Modal.Body>

        </Modal.Body>
        <Modal.Footer>
          <Button color='slate' onClick={props.hide}>Close</Button>
          <Button color='blue' onClick={() => { updateSettings(); props.hide() }}>Confirm</Button>
        </Modal.Footer>
      </Modal>

    </div>
  )
}

export default AdminSettingsModal
