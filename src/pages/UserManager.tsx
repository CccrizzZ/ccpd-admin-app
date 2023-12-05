import React, { useEffect, useState } from 'react'
import {
  Table,
  TableHead,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  Badge,
  Card,
  Text,
  Button,
  Grid,
  Col,
  Switch,
  Title,
  List,
  ListItem,
  DonutChart,
  Legend,
  Subtitle
} from "@tremor/react";
import {
  FaRotate,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaCopy,
  FaRegTrashCan
} from "react-icons/fa6";
import { server, sleep } from '../utils/utils'
import axios from 'axios';
import '../style/UserManager.css'
import moment from 'moment';
import { isExpired } from '../utils/utils';
import { Modal } from 'react-bootstrap';

// type for user rows
export type UserDetail = {
  id: string,
  name: string,
  email: string,
  password: string,
  role: string,
  registrationDate: string,
  userActive: boolean
}

export type InvitationCode = {
  code: string,
  exp: string
}

type UserManagerProp = {
  setLoading: (isloading: boolean) => void
}
const valueFormatter = (number: number) => `${new Intl.NumberFormat("us").format(number).toString()} Members`

const UserManager = (prop: UserManagerProp) => {
  const [userArr, setUserArr] = useState<UserDetail[]>([])
  const [invitationArr, setInvitationArr] = useState<InvitationCode[]>([])
  // const [sortingMethod, setSortingMethod] = useState<(a: UserDetail, b: UserDetail) => number>()
  const [editMode, setEditMode] = useState<boolean>(false)
  const [showEditModal, setShowEditModal] = useState<boolean>(false)

  const pieData = [
    {
      name: "Q&A Personal",
      member: 12,
    },
    {
      name: "Sales",
      member: 2
    },
    {
      name: "Shelving Manager",
      member: 1,
    },
    {
      name: "Admin",
      member: 4,
    },
    {
      name: "Super Admin",
      member: 2,
    },
  ];

  // fetch all users on mount
  useEffect(() => {
    console.log('loading user infos')
    console.log('loading invitations')
    fetchUserInfo()
    fetchAllInvitationCode()
  }, [])

  // fetch user data into UserArr
  const fetchUserInfo = async () => {
    prop.setLoading(true)
    await axios({
      method: 'get',
      url: server + '/adminController/getAllUserInfo',
      responseType: 'text',
      data: '',
      withCredentials: true
    }).then((res) => {
      setUserArr(JSON.parse(res.data))
    }).catch((err) => {
      alert('Failed Getting All User info: ' + err.response.status)
    })
    prop.setLoading(false)
  }

  // fetch invitation code into invitationArr
  const fetchAllInvitationCode = async () => {
    prop.setLoading(true)
    await axios({
      method: 'get',
      url: server + '/adminController/getAllInvitationCode',
      responseType: 'text',
      data: '',
      withCredentials: true
    }).then((res) => {
      setInvitationArr(JSON.parse(res.data))
    }).catch((err) => {
      alert('Failed Getting All Invitation Code: ' + err.response.status)
    })
    prop.setLoading(false)
  }

  // issue invitation code and refresh invitationArr
  const IssueInvitation = async () => {
    prop.setLoading(true)
    await axios({
      method: 'post',
      url: server + '/adminController/issueInvitationCode',
      responseType: 'text',
      data: '',
      withCredentials: true
    }).then(() => {
      fetchAllInvitationCode()
    }).catch((err) => {
      alert('Failed Getting All Invitation Code: ' + err.response.status)
    })
    prop.setLoading(false)
  }

  // delete invitation code by code and refresh invitationArr
  const deleteInvitationCode = async (code: string) => {
    prop.setLoading(true)
    await axios({
      method: 'delete',
      url: server + '/adminController/deleteInvitationCode',
      responseType: 'text',
      data: { 'code': code },
      withCredentials: true
    }).then(() => {
      fetchAllInvitationCode()
    }).catch((err) => {
      alert('Failed Getting All Invitation Code: ' + err.response.status)
    })
    prop.setLoading(false)
  }

  // render user info from displayArr
  const renderTBody = () => {
    userArr.sort((a, b) => {
      if (moment(a.registrationDate).valueOf() > moment(b.registrationDate).valueOf()) {
        return 1
      }
      return -1
    })

    return userArr.map((user) => (
      <TableRow key={user.name}>
        <TableCell>
          <Text>{user.name}</Text>
        </TableCell>
        <TableCell>
          <Text>{user.email}</Text>
        </TableCell>
        <TableCell>
          <Text><Button color='gray' variant='light' size='xs'>Change</Button></Text>
        </TableCell>
        <TableCell>
          <Text>{user.role}</Text>
        </TableCell>
        <TableCell>
          <Text>{(moment(user.registrationDate, "MMM DD YYYY").valueOf())}</Text>
        </TableCell>
        <TableCell>
          {user.userActive ? <Badge size="xs" color="emerald" style={{ margin: 0, padding: 0 }}>Active</Badge> : <Badge size="xs" color="red" style={{ margin: 0, padding: 0 }}>Inactive</Badge>}
        </TableCell>
        {editMode ? <TableCell><Button size="xs" color='amber'>Edit</Button><Button size="xs" color='red'>Delete</Button></TableCell> : undefined}
      </TableRow>
    ))
  }

  // sort the userArr by index
  const sortBy = (index: string) => {
    if (index === 'Registration Date') {

    }
  }


  const renderInvitationPanel = () => {
    return (
      <Card decoration="top" decorationColor='emerald'>
        <Title>Invitations Code</Title>
        <Subtitle>
          Issued code for user registration, available for the next 24 horus
          <Button className='right-6 absolute' size='xs' color='emerald' onClick={fetchAllInvitationCode}><FaRotate /></Button>
        </Subtitle>
        <hr />
        <div style={{ maxHeight: '180px', overflow: 'hidden', overflowY: 'scroll' }}>
          {invitationArr.map((invCode) => (
            <ListItem key={invCode.code}>
              <span>
                <Badge color="indigo">{invCode.code}</Badge>
              </span>
              <span>
                {isExpired(invCode.exp) ? <Badge color="red">Unavailable</Badge> : <Badge color='emerald'>Available</Badge>}
              </span>
              <span>
                Use Before {moment(invCode.exp).format('MMM DD YYYY')}
              </span>
              <span className='mr-3'>
                <Button size='xs' color="stone" onClick={() => { deleteInvitationCode(invCode.code) }}><FaRegTrashCan /></Button>
              </span>
            </ListItem>
          ))}
        </div >
        <div style={{ position: 'absolute', bottom: '12px', width: '95%' }}>
          <hr />
          <Button color='emerald' onClick={IssueInvitation}>Issue Invitation Code</Button>
        </div>
      </Card>
    )
  }

  const renderPieChart = () => {
    return (
      <Card className="w-2/3 h-96" decoration='top' decorationColor='indigo'>
        <Title>Overview</Title>
        <DonutChart
          className="h-56"
          data={pieData}
          category="member"
          index="name"
          valueFormatter={valueFormatter}
          colors={["orange", "lime", "teal", "indigo", "rose"]}
        />
        <Legend
          enableLegendSlider={true}
          className="mt-6 mt-12"
          categories={["Q&A Personal", "Sales", "Shelving Manager", "Admin", "Super Admin"]}
          colors={["orange", "lime", "teal", "indigo", "rose"]}
        />
      </Card >
    )
  }


  const renderEditUserPopup = () => {
    return (
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Modal title</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          I will not close if you click outside me. Do not even try to press
          escape key.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Close
          </Button>
          <Button color='emerald'>Confirm</Button>
        </Modal.Footer>
      </Modal>
    )
  }

  const toggleEditMode = () => setEditMode(!editMode)
  const inlineDisplay = { display: 'inline' }
  const flexDisplay = { display: 'flex' }
  return (
    <div>
      <h2 className='mt-6 ml-6'>User Management Console</h2>
      <Grid className='mt-6'>
        {/* top 2 panel */}
        <Col className='gap-6' style={flexDisplay}>
          {renderInvitationPanel()}
          {renderPieChart()}
        </Col>
        {/* user table */}
        <Card className='mt-6' style={{ maxWidth: '100%' }}>
          <div style={flexDisplay}>
            <Button color='emerald' onClick={fetchUserInfo}><FaRotate style={{ margin: 0, color: 'white' }} /></Button>
            <div className="flex items-center space-x-3" style={{ position: 'fixed', right: '50px' }}>
              <Switch id="switcswitchh" name="switch" checked={editMode} onChange={toggleEditMode} />
              <label className="text-sm text-gray-500">Edit Mode</label>
            </div>
          </div>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Name</TableHeaderCell>
                <TableHeaderCell>Email</TableHeaderCell>
                <TableHeaderCell>Password</TableHeaderCell>
                <TableHeaderCell>
                  Role
                  <FaSort style={inlineDisplay} />
                </TableHeaderCell>
                <TableHeaderCell onClick={() => { sortBy('Registration Date') }}>
                  Registration Date
                  <FaSort style={inlineDisplay} />
                </TableHeaderCell>
                <TableHeaderCell>User Active</TableHeaderCell>
                {editMode ? <TableHeaderCell>Actions</TableHeaderCell> : undefined}
              </TableRow>
            </TableHead>
            <TableBody>
              {renderTBody()}
            </TableBody>
          </Table>
        </Card>
      </Grid>
    </div>
  )
}

export default UserManager
