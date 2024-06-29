import React, { useContext, useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap';
import { AppContext } from '../App';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { server } from '../utils/utils';
import { AdminSettings } from '../utils/Types';
import ShelfLocationList from './ShelfLocationList';
import { Button, Col, Grid, Switch, TextInput } from '@tremor/react';
import { FaCalendar, FaRecycle } from 'react-icons/fa6';

type AdminSettingsModalProps = {
  show: boolean,
  hide: () => void,
}

const AdminSettingsModal: React.FC<AdminSettingsModalProps> = (props: AdminSettingsModalProps) => {
  const { setLoading } = useContext(AppContext)
  const [settings, setSettings] = useState<AdminSettings>({} as AdminSettings)

  useEffect(() => {
    // get settings on load
    if (props.show) getSettings()
  }, [props.show])

  const getSettings = async () => {
    setLoading(true)
    await axios({
      method: 'get',
      url: server + '/adminController/getAdminSettings',  // super admin only
      responseType: 'text',
      timeout: 8000,
      withCredentials: true
    }).then((res: AxiosResponse) => {
      setSettings(JSON.parse(res.data))
      console.log(res.data)
    }).catch((res: AxiosError) => {
      alert('Failed Getting Admin Settings: ' + res.response?.data)
    })
    setLoading(false)
  }

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
      if (res.status === 200) {
        alert('Admin Settings Updated')
      }
    }).catch((res: AxiosError) => {
      alert('Failed Getting Admin Settings: ' + res.response?.data)
    })
    setLoading(false)
  }

  const renderQADeleteRecordLimit = () => (
    <div className='mb-3 font-bold'>
      <span>Q&A Personal Record Delete Time Limit (Days)</span>
      <TextInput
        className='max-w-64 my-2'
        type='number'
        icon={FaCalendar}
        value={String(settings.daysQACanDeleteRecord)}
        onValueChange={(val) => setSettings({ ...settings, daysQACanDeleteRecord: val })}
      />
    </div>
  )

  const renderIsQAPermittedAfterHour = () => (
    <div className='mb-3 font-bold'>
      <span>Is Q&A Personal Permitted After Hours</span>
      <Switch
        checked={settings.isQAPermittedAfterHours}
        onChange={(val) => {
          setSettings({ ...settings, isQAPermittedAfterHours: val })
          console.log(val)
        }}
        className='mt-3'
      />
    </div>
  )

  return (
    <div>
      <Modal
        className='z-[1550] p-6'
        show={props.show}
        onHide={props.hide}
        backdrop="static"
        size='xl'
        centered
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>⚙️ Admin Settings</Modal.Title>
          <Button className='ml-6' color='green' onClick={getSettings}>
            <FaRecycle className='p-0' /> Refresh
          </Button>
        </Modal.Header>
        <Modal.Body className='min-h-96'>
          <Grid numItems={2} className='gap-6'>
            <Col>
              {renderQADeleteRecordLimit()}
              <hr />
              {renderIsQAPermittedAfterHour()}
              <hr />
            </Col>
            <Col>
              <ShelfLocationList
                shelfLocationsArr={settings.shelfLocationsDef}
                setShelfLocationArr={(val) => setSettings({ ...settings, 'shelfLocationsDef': val })}
              />
            </Col>
          </Grid>
        </Modal.Body>
        <Modal.Footer>
          <Button color='gray' onClick={props.hide}>Close</Button>
          <Button color='emerald' onClick={() => { updateSettings(); props.hide() }}>Update Settings</Button>
        </Modal.Footer>
      </Modal>

    </div>
  )
}

export default AdminSettingsModal
