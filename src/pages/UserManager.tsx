import React, { useContext, useEffect, useState } from 'react'
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
  ListItem,
  DonutChart,
  Legend,
  Subtitle
} from "@tremor/react";
import {
  FaRotate,
  FaSort,
  FaUserPlus,
  FaRegTrashCan,
  FaPenToSquare
} from "react-icons/fa6";
import { server, initUser } from '../utils/utils'
import axios, { AxiosError } from 'axios';
import '../style/UserManager.css'
import moment from 'moment';
import { isExpired } from '../utils/utils';
import EditUserModal from '../components/EditUserModal';
import { Modal } from 'react-bootstrap';
import { AppContext } from '../App';
import CreateUserModal from '../components/CreateUserModal';
import {
  UserDetail,
  InvitationCode,
} from '../utils/Types'

const valueFormatter = (number: number) => `${new Intl.NumberFormat("us").format(number).toString()} Members`
type chartData = {
  name: string,
  members: number
}

// to manage existing users and add new users
// need user table pagination
const UserManager: React.FC = () => {
  const { userInfo, setLoading } = useContext(AppContext)
  const [userArr, setUserArr] = useState<UserDetail[]>([])
  const [invitationArr, setInvitationArr] = useState<InvitationCode[]>([])
  const [pieOverviewData, setPieOverviewData] = useState<chartData[]>([])

  // user manipulation target
  const [targetUser, setTargetUser] = useState<UserDetail>(initUser)

  // flag
  const [editMode, setEditMode] = useState<boolean>(false)
  const [showActiveOnly, setshowActiveOnly] = useState<boolean>(true)
  const [showDeletePopup, setShowDeletePopup] = useState<boolean>(false)
  const [showCreatePopup, setShowCreatePopup] = useState<boolean>(false)
  const [showEditModal, setShowEditModal] = useState<boolean>(false)

  // fetch all users info and invite code on mount
  useEffect(() => {
    fetchAllUserInfo()
    fetchAllInvitationCode()
    getPieData(userArr)
  }, [])

  // generate pie data by user array
  const getPieData = (data: UserDetail[]) => {
    // clear data
    setPieOverviewData([])
    const newArr = [
      {
        name: "Q&A Personal",
        members: 0,
      },
      {
        name: "Sales",
        members: 0
      },
      {
        name: "Shelving Manager",
        members: 0,
      },
      {
        name: "Admin",
        members: 0,
      },
      {
        name: "Super Admin",
        members: 0,
      },
    ]
    // populate chart data
    data.map((val) => {
      switch (val.role) {
        case 'QAPersonal':
          newArr[0].members++
          break;
        case 'Sales':
          newArr[1].members++
          break;
        case 'Shelving Manager':
          newArr[2].members++
          break;
        case 'Admin':
          newArr[3].members++
          break;
        case 'Super Admin':
          newArr[4].members++
          break;
        default:
          break;
      }
    })
    setPieOverviewData(newArr)
  }

  // fetch user data into UserArr
  const fetchAllUserInfo = async () => {
    setLoading(true)
    // get all user rows without password
    await axios({
      method: 'get',
      url: server + '/adminController/getAllUserInfo',
      responseType: 'text',
      data: '',
      withCredentials: true
    }).then((res) => {
      const parsedData = JSON.parse(res.data)
      setUserArr(parsedData)
      getPieData(parsedData)
    }).catch((err) => {
      console.warn('Failed Getting All User info: ' + err.message)
    })
    setLoading(false)
  }

  // fetch invitation code into invitationArr
  const fetchAllInvitationCode = async () => {
    setLoading(true)
    await axios({
      method: 'get',
      url: server + '/adminController/getAllInvitationCode',
      responseType: 'text',
      data: '',
      withCredentials: true
    }).then((res) => {
      setInvitationArr(JSON.parse(res.data))
    }).catch((err) => {
      console.warn('Failed Getting All Invitation Code: ' + err.message)
    })
    setLoading(false)
  }

  // issue invitation code and refresh invitationArr
  const IssueInvitation = async () => {
    setLoading(true)
    await axios({
      method: 'post',
      url: server + '/adminController/issueInvitationCode',
      responseType: 'text',
      data: '',
      withCredentials: true
    }).then(() => {
      fetchAllInvitationCode()
    }).catch((err: AxiosError) => {
      if (err.response?.status === 403) {
        console.warn('Failed Getting All Invitation Code: Only Super Admin Allowed')
      }
    })
    setLoading(false)
  }

  // delete invitation code by code and refresh invitationArr
  const deleteInvitationCode = async (code: string) => {
    setLoading(true)
    await axios({
      method: 'delete',
      url: server + '/adminController/deleteInvitationCode',
      responseType: 'text',
      data: { 'code': code },
      withCredentials: true
    }).then(() => {
      fetchAllInvitationCode()
    }).catch((err) => {
      if (err.response?.status === 403) {
        console.warn('Failed Deleting Invitation Code: Only Super Admin Allowed')
      }
    })
    setLoading(false)
  }

  // request delete user by id
  const deleteUser = async () => {
    setLoading(true)
    await axios({
      method: 'delete',
      url: server + '/adminController/deleteUserById',
      responseType: 'text',
      data: { id: targetUser._id },
      withCredentials: true
    }).then(() => {
      fetchAllUserInfo()
    }).catch((err) => {
      if (err.response?.status === 403) {
        console.warn('Failed Deleting User: Only Super Admin Allowed')
      }
    })
    setLoading(false)
    setShowDeletePopup(false)
    setTargetUser(initUser)
  }

  // called by row delete button
  const showAndSetDelPopup = (user: UserDetail) => {
    setTargetUser(user)
    setShowDeletePopup(true)
  }

  // called by row edit button
  const showAndSetEditPopup = (user: UserDetail) => {
    setTargetUser(user)
    setShowEditModal(true)
  }

  // called by edit user modal
  const hideAndSetEditPopup = () => {
    setShowEditModal(false)
    setTargetUser(initUser)
  }

  // called by create user model
  const hideCreatePopup = (refresh: boolean) => {
    setShowCreatePopup(false)
    if (refresh) fetchAllUserInfo()
  }

  // sort the userArr by index
  const sortBy = (index: string) => {
    if (index === 'Registration Date') {

    }
  }

  const renderTBody = () => {
    return userArr.map((user) => {
      if (showActiveOnly && !user.userActive) return
      return (
        <TableRow key={user._id}>
          <TableCell>
            <Text>{user._id}</Text>
          </TableCell>
          <TableCell>
            <Badge color={user.userActive ? 'teal' : 'red'}>{user.name}</Badge>
          </TableCell>
          <TableCell>
            <Text>{user.email}</Text>
          </TableCell>
          <TableCell>
            <Text>Redacted</Text>
          </TableCell>
          <TableCell>
            <Badge>{user.role}</Badge>
          </TableCell>
          <TableCell>
            <Text>{(moment(user.registrationDate, "MMM DD YYYY").format('MMM DD YYYY'))}</Text>
          </TableCell>
          <TableCell>
            {user.userActive ? <Badge className='m-0' size="xs" color="emerald">Active</Badge> : <Badge size="xs" color="red" className='m-0'>Inactive</Badge>}
          </TableCell>
          {/* hide edit option for current user */}
          {editMode && user._id !== userInfo.id ? <TableCell><Button className='mr-1' size="xs" color='amber' onClick={() => showAndSetEditPopup(user)}><FaPenToSquare /></Button>
            <Button size="xs" color='red' onClick={() => showAndSetDelPopup(user)}><FaRegTrashCan /></Button></TableCell> : undefined}
        </TableRow>
      )
    })
  }

  const renderInvitationPanel = () => {
    return (
      <Card decoration="top" decorationColor='emerald'>
        <Title>Invitations Code</Title>
        <Title>
          Issued code for user registration, available for the next 24 horus
          <Button className='right-6 absolute' size='xs' color='emerald' onClick={fetchAllInvitationCode}><FaRotate /></Button>
        </Title>
        <hr />
        <div style={{ maxHeight: '180px', overflow: 'hidden', overflowY: 'scroll', textAlign: 'center' }}>
          {invitationArr.length > 0 ? invitationArr.map((invCode) => (
            <ListItem key={invCode.code}>
              <span>
                <Badge color="amber">{invCode.code}</Badge>
              </span>
              <span>
                {isExpired(invCode.exp) ? <Badge color="red">Unavailable</Badge> : <Badge color='emerald'>Available</Badge>}
              </span>
              <span>
                Use Before {moment.unix(Number(invCode.exp)).format("MMMM Do, YYYY h:mm A")}
              </span>
              <span className='mr-3'>
                <Button size='xs' color="stone" onClick={() => { deleteInvitationCode(invCode.code) }}><FaRegTrashCan /></Button>
              </span>
            </ListItem>
          )) : <Subtitle className='mt-6'>No Invitation Code, Issued Invitation Code Will Display Here</Subtitle>}
        </div >
        <div className='absolute bottom-3' style={{ width: '95%' }}>
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
          showAnimation={true}
          data={pieOverviewData}
          category="members"
          index="name"
          valueFormatter={valueFormatter}
          colors={["orange", "lime", "teal", "indigo", "rose"]}
        />
        <Legend
          enableLegendSlider={true}
          className="mt-12"
          categories={["Q&A Personal", "Sales", "Shelving Manager", "Admin", "Super Admin"]}
          colors={["orange", "lime", "teal", "indigo", "rose"]}
        />
      </Card >
    )
  }

  const renderDeletePopup = () => {
    return (
      <Modal
        show={showDeletePopup}
        onHide={() => setShowDeletePopup(false)}
        aria-labelledby="example-modal-sizes-title-sm"
        backdrop="static"
        centered
      >
        <Modal.Body>
          <h4 className='m-6 ml-6'>❌ Confirm Delete User {targetUser.name}?</h4>
          <div className='text-center'>
            <Button color='slate' onClick={() => setShowDeletePopup(false)}>
              Close
            </Button>
            <Button className='ml-12' color='red' onClick={deleteUser}>Confirm</Button>
          </div>
        </Modal.Body>
      </Modal>
    )
  }

  return (
    <div>
      {showDeletePopup ? renderDeletePopup() : undefined}
      <EditUserModal show={showEditModal} handleClose={hideAndSetEditPopup} targetUser={() => targetUser} setTargetUser={setTargetUser} refreshUserArr={fetchAllUserInfo} />
      <CreateUserModal show={showCreatePopup} handleClose={hideCreatePopup} />
      <Grid>
        {/* top 2 panel */}
        <Col className='gap-6 flex'>
          {renderInvitationPanel()}
          {renderPieChart()}
        </Col>
        {/* user table */}
        <Card className='mt-6 max-w-full'>
          <div className='flex'>
            <Button color='emerald' onClick={fetchAllUserInfo}><FaRotate className='m-0 text-white' /></Button>
            {editMode ? <Button color='blue' className='ml-2' onClick={() => setShowCreatePopup(true)}><FaUserPlus /></Button> : undefined}
            <div className="absolute right-48 flex">
              <label className="text-sm text-gray-500 mr-4">Show Active Users Only</label>
              <Switch checked={showActiveOnly} onChange={() => setshowActiveOnly(!showActiveOnly)} />
            </div>
            <div className="absolute right-12 flex">
              <label className="text-sm text-gray-500 mr-4">Edit Mode</label>
              <Switch checked={editMode} onChange={() => setEditMode(!editMode)} />
            </div>
          </div>
          <hr />
          <Table>
            <TableHead >
              <TableRow className='th-row'>
                <TableHeaderCell>ID</TableHeaderCell>
                <TableHeaderCell className='w-48'>Name</TableHeaderCell>
                <TableHeaderCell>Email</TableHeaderCell>
                <TableHeaderCell className='w-28'>Password</TableHeaderCell>
                <TableHeaderCell className='w-36'>
                  Role
                  <FaSort className='inline' />
                </TableHeaderCell>
                <TableHeaderCell onClick={() => { sortBy('Registration Date') }}>
                  Registration Date
                  <FaSort className='inline' />
                </TableHeaderCell>
                <TableHeaderCell className='w-36'>User Active</TableHeaderCell>
                {editMode ? <TableHeaderCell className='w-28'>Actions</TableHeaderCell> : undefined}
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
