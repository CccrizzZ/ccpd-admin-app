import React, { useContext, useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap';
import { AppContext } from '../App';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { getObjectDifference, isObjectsEqual, server } from '../utils/utils';
import { AdminSettings } from '../utils/Types';
import ShelfLocationList from './ShelfLocationList';
import {
  Button,
  Col,
  Grid,
  Switch,
  TextInput
} from '@tremor/react';
import { FaCalendar, FaLock, FaRecycle } from 'react-icons/fa6';
import { auth } from '../utils/firebase';
import { isUserLogin, userInformation } from '../utils/atom';
import { useAtom, useSetAtom } from 'jotai';
import firebase from 'firebase/compat/app';

type AdminSettingsModalProps = {
  show: boolean,
  hide: () => void,
}

const AdminSettingsModal: React.FC<AdminSettingsModalProps> = (props: AdminSettingsModalProps) => {
  const { setLoading } = useContext(AppContext)
  const [userInfo] = useAtom(userInformation)
  const [ogSettings, setOgSettings] = useState<AdminSettings>({} as AdminSettings)
  const [settings, setSettings] = useState<AdminSettings>({} as AdminSettings)
  const setIsLogin = useSetAtom(isUserLogin)

  // change password
  const [newPass, setNewPass] = useState<string>()
  const [confirmPass, setConfirmPass] = useState<string>()

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
      setOgSettings(JSON.parse(res.data))
    }).catch((res: AxiosError) => {
      alert('Failed Getting Admin Settings: ' + res.response?.data)
    })
    setLoading(false)
  }

  const updateSettings = async () => {
    // return if no changes was made
    if (isObjectsEqual(ogSettings, settings)) return alert('Please Make Changes Before Submition')

    // get changes made
    const obj = getObjectDifference(ogSettings, settings)
    setLoading(true)

    await axios({
      method: 'post',
      url: server + '/adminController/updateAdminSettings',  // super admin only
      responseType: 'text',
      timeout: 8000,
      data: obj,
      withCredentials: true
    }).then((res: AxiosResponse) => {
      if (res.status === 200) {
        alert('Admin Settings Updated')
        props.hide()
      }
    }).catch((res: AxiosError) => {
      alert('Failed Getting Admin Settings: ' + res.response?.data)
    })
    setLoading(false)
  }

  // update admin password
  const sendAdminChangePasssword = async () => {
    if (newPass === '' || confirmPass === '') return alert('Please Enter New Password')
    if (newPass !== confirmPass) return alert('Confirm Password Does Not Match Password')
    setLoading(true)
    await axios({
      method: 'post',
      url: server + '/adminController/updateAdminPassword',  // super admin only
      responseType: 'text',
      timeout: 8000,
      data: {
        fid: auth.currentUser?.uid,
        uid: userInfo.id,
        newPass: newPass
      },
      withCredentials: true
    }).then(async (res: AxiosResponse) => {
      if (res.status === 200) {
        alert('Admin Settings Updated, Please Login With New Identity')
        setIsLogin(false)
        await firebase.auth().signOut()
        props.hide()
      }
    }).catch((res: AxiosError) => {
      alert('Failed Updating Admin Password: ' + res.response?.data)
    })
    setLoading(false)
  }

  // limits QA personal to delete their record within x days
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

  // can user with QA personal role access service outside of working hour
  const renderIsQAPermittedAfterHour = () => (
    <div className='mb-3 font-bold'>
      <span>Is Q&A Personal Permitted After Hours</span>
      <Switch
        checked={settings.isQAPermittedAfterHours}
        onChange={(val) => {
          setSettings({ ...settings, isQAPermittedAfterHours: val })
        }}
        className='mt-3'
      />
    </div>
  )

  const renderResetOwnPassword = () => (
    <div className='mb-3 font-bold grid gap-3'>
      <p>
        Change My Password ({userInfo.email})
      </p>
      <TextInput
        icon={FaLock}
        placeholder='Enter Your New Password...'
        type='password'
        value={newPass}
        onValueChange={setNewPass}
      />
      <TextInput
        icon={FaLock}
        placeholder='Confirm Your New Password...'
        type='password'
        value={confirmPass}
        onValueChange={setConfirmPass}
      />
      <Button color='indigo' onClick={sendAdminChangePasssword}>Confirm Reset Password</Button>
    </div>
  )

  // check if setting is modified
  const isChanged = () => !isObjectsEqual(ogSettings, settings)

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
        scrollable={true}
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
              {renderResetOwnPassword()}
              <hr />
            </Col>
            <Col>
              <ShelfLocationList
                shelfLocationsArr={settings.shelfLocationsDef ?? []}
                setShelfLocationArr={(val) => setSettings({ ...settings, 'shelfLocationsDef': val })}
              />
            </Col>
          </Grid>
        </Modal.Body>
        <Modal.Footer>
          <Button color='gray' onClick={props.hide}>Close</Button>
          <Button color={isChanged() ? 'amber' : 'emerald'} onClick={() => { updateSettings() }}>Update Settings</Button>
        </Modal.Footer>
      </Modal>

    </div>
  )
}

export default AdminSettingsModal
