import React, { useContext, useEffect, useState } from 'react'
import {
  Modal,
  Button,
  Form,
  InputGroup,
} from 'react-bootstrap'
import { UserDetail } from '../utils/Types'
import { AppContext } from '../App'
import axios from 'axios'
import { server, hashPass, renderUserRoleOptions } from '../utils/utils'

type EditUserModalProp = {
  show: boolean,
  handleClose: () => void,
  targetUser: () => UserDetail
  setTargetUser: React.Dispatch<React.SetStateAction<UserDetail>>,
  refreshUserArr: () => void
}

const EditUserModal: React.FC<EditUserModalProp> = (props: EditUserModalProp) => {
  const { setLoading } = useContext(AppContext)
  const [targetUserDetail, setTargetUserDetail] = useState<UserDetail>(props.targetUser)
  const [userInfoToSend, setUserInfoToSend] = useState<Record<string, string | boolean>>({})

  useEffect(() => {
    setTargetUserDetail(props.targetUser)
  })

  // input will be set when changed
  const onUserNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.setTargetUser({ ...targetUserDetail, name: event.target.value })
    userInfoToSend.name = event.target.value
  }
  const onEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.setTargetUser({ ...targetUserDetail, email: event.target.value })
    userInfoToSend.email = event.target.value
  }
  const onPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.setTargetUser({ ...targetUserDetail, password: event.target.value })
    userInfoToSend.password = event.target.value
  }
  const onRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    props.setTargetUser({ ...targetUserDetail, role: event.target.value })
    userInfoToSend.role = event.target.value
  }
  const onUserActiveChange = () => {
    props.setTargetUser({ ...targetUserDetail, userActive: !targetUserDetail.userActive })
    userInfoToSend.userActive = !targetUserDetail.userActive
  }

  const updateUser = async () => {
    // alert if no changes made
    if (Object.keys(userInfoToSend).length === 0) return alert('Cannot Submit Without Making Changes')
    if (userInfoToSend['password']) userInfoToSend['password'] = hashPass(String(userInfoToSend['password']))
    if (userInfoToSend['userActive'] !== undefined) userInfoToSend['userActive'] = String(userInfoToSend['userActive'])
    setLoading(true)
    // send request
    await axios({
      method: 'put',
      url: server + '/adminController/updateUserById/' + targetUserDetail._id,
      responseType: 'text',
      data: userInfoToSend,
      withCredentials: true
    }).then((res) => {
      if (res.status === 200) {
        alert('updated ' + targetUserDetail.name)
      }
    }).catch((err) => {
      if (err.response?.status === 403) {
        alert('Failed Updating User: Only Super Admin Allowed')
      }
    })
    // clean up
    setLoading(false)
    setUserInfoToSend({})
    props.handleClose()
    props.refreshUserArr()
  }

  return (
    <Modal
      aria-labelledby="contained-modal-title-vcenter"
      show={props.show}
      onHide={props.handleClose}
      backdrop="static"
      keyboard={false}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>📝 Edit {targetUserDetail.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <InputGroup className="mb-3">
          <InputGroup.Text>Name</InputGroup.Text>
          <Form.Control value={targetUserDetail.name} onChange={onUserNameChange} />
        </InputGroup>
        <InputGroup className="mb-3">
          <InputGroup.Text>Email</InputGroup.Text>
          <Form.Control value={targetUserDetail.email} onChange={onEmailChange} />
        </InputGroup>
        <InputGroup className="mb-3">
          <InputGroup.Text>Password</InputGroup.Text>
          <Form.Control type='password' value={targetUserDetail.password} onChange={onPasswordChange} />
        </InputGroup>
        <InputGroup className="mb-3">
          <InputGroup.Text>Role</InputGroup.Text>
          <Form.Select value={targetUserDetail.role} onChange={onRoleChange}>
            {renderUserRoleOptions()}
          </Form.Select>
        </InputGroup>
        <InputGroup className="mb-2 mt-3 ml-2">
          <Form.Check
            className='text-xl'
            type="switch"
            id="custom-switch"
            label={targetUserDetail.userActive ? 'User Active' : 'User Inactive'}
            checked={targetUserDetail.userActive}
            onChange={onUserActiveChange}
          />
        </InputGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.handleClose}>
          Close
        </Button>
        <Button variant="success" onClick={updateUser}>Confirm</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default EditUserModal