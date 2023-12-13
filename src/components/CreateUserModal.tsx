import React, { useContext, useState } from 'react'
import { UserDetail, initUser } from '../pages/UserManager'
import { AppContext } from '../App'
import axios from 'axios'
import { server } from '../utils/utils'
import {
  Form,
  InputGroup,
  Modal
} from 'react-bootstrap'
import { Button } from '@tremor/react'

type CreateUserModalProps = {
  show: boolean
  handleClose: () => void,
}

const CreateUserModal: React.FC<CreateUserModalProps> = (props: CreateUserModalProps) => {
  const { setLoading } = useContext(AppContext)
  const [newUser, setNewUser] = useState<UserDetail>(initUser)

  // create a custom user
  const createUser = async () => {
    // null check


    setLoading(true)
    await axios({
      method: 'delete',
      url: server + '/adminController/createUser',
      responseType: 'text',
      data: newUser,
      withCredentials: true
    }).then(() => {
      props.handleClose()
    }).catch((err) => {
      alert('Create User Failed: ' + err.response.status)
    })
    setLoading(false)
    props.handleClose()
  }

  // setters
  const onUserNameChange = (event: React.ChangeEvent<HTMLInputElement>) => setNewUser({ ...newUser, name: event.target.value })
  const onEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => setNewUser({ ...newUser, email: event.target.value })
  const onPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => setNewUser({ ...newUser, password: event.target.value })
  const onRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => setNewUser({ ...newUser, role: event.target.value })

  return (
    <Modal
      show={props.show}
      onHide={props.handleClose}
      aria-labelledby="contained-modal-title-vcenter"
      backdrop="static"
      keyboard={false}
      centered
    >
      <Modal.Header>
        <h4 className=''>✳️ Create New User</h4>
      </Modal.Header>
      <Modal.Body>
        <InputGroup className="mb-3">
          <InputGroup.Text>Name</InputGroup.Text>
          <Form.Control value={newUser.name} onChange={onUserNameChange} />
        </InputGroup>
        <InputGroup className="mb-3">
          <InputGroup.Text>Email</InputGroup.Text>
          <Form.Control value={newUser.email} onChange={onEmailChange} />
        </InputGroup>
        <InputGroup className="mb-3">
          <InputGroup.Text>Password</InputGroup.Text>
          <Form.Control type='password' value={newUser.password} onChange={onPasswordChange} />
        </InputGroup>
        <InputGroup className="mb-3">
          <InputGroup.Text>Role</InputGroup.Text>
          <Form.Select value={newUser.role} onChange={onRoleChange}>
            <option>Select Role</option>
            <option value="QAPersonal">Q&A Personal</option>
            <option value="Sales">Sales</option>
            <option value="Shelving Manager">Shelving Manager</option>
            <option value="Admin">Admin</option>
            <option value="Super Admin">Super Admin</option>
          </Form.Select>
        </InputGroup>
      </Modal.Body>
      <Modal.Footer>
        <div className='text-center'>
          <Button color='slate' onClick={props.handleClose}>
            Close
          </Button>
          <Button className='ml-2' color='emerald' onClick={createUser}>Create</Button>
        </div>
      </Modal.Footer>
    </Modal>
  )
}

export default CreateUserModal
