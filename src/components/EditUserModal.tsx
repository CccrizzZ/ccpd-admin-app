import React, { useEffect, useState } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { UserDetail } from '../pages/UserManager'

type EditUserModalProp = {
  show: boolean,
  handleClose: () => void,
  setLoading: (loading: boolean) => void,
  targetUser: () => UserDetail
}

const EditUserModal: React.FC<EditUserModalProp> = (props: EditUserModalProp) => {
  const [targetUserDetail, setTargetUserDetail] = useState<UserDetail>(props.targetUser())

  const onUserNameChange = (event: React.ChangeEvent<HTMLInputElement>) => setTargetUserDetail({ ...targetUserDetail, email: event.target.value })
  const onEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => setTargetUserDetail({ ...targetUserDetail, email: event.target.value })
  const onPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => setTargetUserDetail({ ...targetUserDetail, email: event.target.value })
  const onRoleChange = (event: React.ChangeEvent<HTMLInputElement>) => setTargetUserDetail({ ...targetUserDetail, email: event.target.value })
  const onUserActiveChange = (event: React.ChangeEvent<HTMLInputElement>) => setTargetUserDetail({ ...targetUserDetail, email: event.target.value })

  useEffect(() => {
    setTargetUserDetail(props.targetUser())
  })

  const updateUser = async () => {
    props.setLoading(true)
    // await axios({
    //   method: 'delete',
    //   url: server + '/adminController/delete',
    //   responseType: 'text',
    //   data: { 'name': user.name, 'email': user.email, 'role': user.role },
    //   withCredentials: true
    // }).then(() => {
    //   fetchAllInvitationCode()
    // }).catch((err) => {
    //   alert('Failed Deleting User: ' + err.response.status)
    // })
    alert('updated ' + targetUserDetail.name)
    props.setLoading(false)
    props.handleClose()
  }

  return (
    <Modal
      aria-labelledby="contained-modal-title-vcenter"
      show={props.show}
      onHide={props.handleClose}
      backdrop="static"
      keyboard={false}
      size="lg"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Edit {props.targetUser().name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>

        {targetUserDetail.name}
        {targetUserDetail.email}
        {targetUserDetail.password}
        {targetUserDetail.registrationDate}
        {targetUserDetail.role}
        {targetUserDetail.userActive}
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