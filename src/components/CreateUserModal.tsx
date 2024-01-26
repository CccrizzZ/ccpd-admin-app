import React, { useContext, useState } from 'react'
import { AppContext } from '../App'
import axios from 'axios'
import { server, initCreateUser, deSpace, renderUserRoleOptions, hashPass } from '../utils/utils'
import { CreateUser } from '../utils/Types'
import {
  Form,
  InputGroup,
  Modal
} from 'react-bootstrap'
import { Button } from '@tremor/react'

type CreateUserModalProps = {
  show: boolean
  handleClose: (refresh: boolean) => void,
}

const CreateUserModal: React.FC<CreateUserModalProps> = (props: CreateUserModalProps) => {
  const { setLoading } = useContext(AppContext)
  const [newUser, setNewUser] = useState<CreateUser>(initCreateUser)

  // create a custom user
  const createUser = async () => {
    // null check for all values of newUser
    const fieldsEmpty = Object.values(newUser).some((val) => { return (deSpace(val).length < 1) })
    if (fieldsEmpty) return alert('Please Complete The Form')

    // post to server
    setLoading(true)
    await axios({
      method: 'post',
      url: server + '/adminController/createUser',
      responseType: 'text',
      // remove space in password and email
      // hash password
      data: {
        ...newUser,
        name: newUser.name.trim(),
        password: hashPass(newUser.password),
        email: deSpace(newUser.email.trim())
      },
      withCredentials: true
    }).then((res) => {
      if (res.status === 201) {
        alert('User Created!')
        setNewUser(initCreateUser)
      }
    }).catch((err) => {
      alert('Create User Failed: ' + err.response.status)
    })
    setLoading(false)
    props.handleClose(true)
  }

  // setters
  const onUserNameChange = (event: React.ChangeEvent<HTMLInputElement>) => setNewUser({ ...newUser, name: event.target.value })
  const onEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => setNewUser({ ...newUser, email: event.target.value })
  const onPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => setNewUser({ ...newUser, password: event.target.value })
  const onRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => setNewUser({ ...newUser, role: event.target.value })

  return (
    <Modal
      show={props.show}
      onHide={() => props.handleClose(false)}
      aria-labelledby="contained-modal-title-vcenter"
      backdrop="static"
      keyboard={false}
      centered
    >
      <Modal.Header>
        <h4>✳️ Create New User</h4>
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
            {renderUserRoleOptions()}
          </Form.Select>
        </InputGroup>
      </Modal.Body>
      <Modal.Footer>
        <div className='text-center'>
          <Button color='slate' onClick={() => props.handleClose(false)}>
            Close
          </Button>
          <Button className='ml-2' color='emerald' onClick={createUser}>Create</Button>
        </div>
      </Modal.Footer>
    </Modal>
  )
}

export default CreateUserModal
