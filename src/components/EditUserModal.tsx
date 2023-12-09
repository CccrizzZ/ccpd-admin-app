import React, { useContext, useEffect, useState } from 'react'
import {
  Modal,
  Button,
  Form,
  InputGroup,
} from 'react-bootstrap'
import { UserDetail, initUser } from '../pages/UserManager'
import { AppContext } from '../App'
import axios from 'axios'
import { server } from '../utils/utils'

type EditUserModalProp = {
  show: boolean,
  handleClose: () => void,
  targetUser: () => UserDetail
  setTargetUser: React.Dispatch<React.SetStateAction<UserDetail>>,
  refreshUserArr: () => void
}

const EditUserModal: React.FC<EditUserModalProp> = (props: EditUserModalProp) => {
  const { setLoading } = useContext(AppContext)
  const [targetUserDetail, setTargetUserDetail] = useState<UserDetail>(initUser)

  const onUserNameChange = (event: React.ChangeEvent<HTMLInputElement>) => props.setTargetUser({ ...targetUserDetail, name: event.target.value })
  const onEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => props.setTargetUser({ ...targetUserDetail, email: event.target.value })
  const onPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => props.setTargetUser({ ...targetUserDetail, password: event.target.value })
  const onRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => props.setTargetUser({ ...targetUserDetail, role: event.target.value })
  const onUserActiveChange = () => props.setTargetUser({ ...targetUserDetail, userActive: !targetUserDetail.userActive })

  useEffect(() => {
    setTargetUserDetail(props.targetUser)
  })

  const updateUser = async () => {
    setLoading(true)
    console.log(targetUserDetail)
    await axios({
      method: 'put',
      url: server + '/adminController/updateUserById/' + targetUserDetail._id,
      responseType: 'text',
      data: targetUserDetail,
      withCredentials: true
    }).then((res) => {
      console.log(String(res))
    }).catch((err) => {
      alert('Failed Deleting User: ' + err.response.status)
    })
    alert('updated ' + targetUserDetail.name)
    setLoading(false)
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
          <Form.Control placeholder="************" value={targetUserDetail.password} onChange={onPasswordChange} />
        </InputGroup>
        <InputGroup className="mb-3">
          <InputGroup.Text>Role</InputGroup.Text>
          <Form.Select value={targetUserDetail.role} onChange={onRoleChange}>
            <option>Select Role</option>
            <option value="QAPersonal">Q&A Personal</option>
            <option value="Sales">Sales</option>
            <option value="Shelving Manager">Shelving Manager</option>
            <option value="Admin">Admin</option>
            <option value="Super Admin">Super Admin</option>
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
            value={Number(targetUserDetail.userActive)}
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