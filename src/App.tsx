import { useState } from 'react'
import {
  Tab,
  Row,
  Col,
  Nav,
  TabContainer,
  Button,
  Navbar,
  Container,
} from 'react-bootstrap'
import './App.css'
import axios from 'axios'
import Dashboard from './pages/Dashboard'
import Inventory from './pages/Inventory'
import { QARecord, UserInfo } from './utils/Types'
import { bgDark, bgLight, server } from './utils/utils'
import Login from './pages/Login'
import QARecords from './pages/QARecords'
import UserManager from './pages/UserManager';
import LoadingSpiner from './utils/LoadingSpinner'
import {
  FaBoxesStacked,
  FaUsersGear,
  FaTableList,
  FaHouseChimney,
  FaMoneyBillTransfer,
  FaDoorOpen
} from "react-icons/fa6";

function App() {
  const [isLogin, setIsLogin] = useState<boolean>(false)
  const [userInfo, setUserInfo] = useState<UserInfo>({
    id: '',
    name: ''
  })
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [inventoryArr, setInventoryArr] = useState<QARecord[]>([])

  const logout = async () => {
    await axios({
      method: 'post',
      url: server + '/userController/logout',
      responseType: 'text',
      withCredentials: true
    }).then(() => {
      alert('Logout Success!!!')
      setIsLogin(false)
    }).catch((err) => {
      setIsLogin(false)
      throw err
    })
  }

  const renderHome = () => {
    // if not login prompt login else show app
    if (!isLogin) {
      return <Login setLogin={setIsLogin} setUserInfo={setUserInfo} setLoading={setIsLoading} />
    } else {
      return (
        <div className='wrapper'>
          <TabContainer defaultActiveKey="Dashboard" data-bs-theme="dark">
            <div className='sideBar' style={{ backgroundColor: bgLight, userSelect: 'none' }}>
              <Nav variant="pills" className="flex-column mt-4" style={{ padding: '10px' }}>
                <Nav.Item className='mb-3'>
                  <Nav.Link eventKey="Dashboard" style={{ color: '#fff', display: 'flex' }}>
                    <FaHouseChimney /> Dashboard
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item className='mb-3'>
                  <Nav.Link eventKey="Q&A Records" style={{ color: '#fff', display: 'flex' }}>
                    <FaTableList /> Q&A Records
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item className='mb-3'>
                  <Nav.Link eventKey="Inventory" style={{ color: '#fff', display: 'flex' }}>
                    <FaBoxesStacked /> Inventory
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item className='mb-3'>
                  <Nav.Link eventKey="User Management" style={{ color: '#fff', display: 'flex' }}>
                    <FaUsersGear /> User Management
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item className='mb-3'>
                  <Nav.Link eventKey="Retail & Return" style={{ color: '#fff', display: 'flex' }}>
                    <FaMoneyBillTransfer /> Retail & Return
                  </Nav.Link>
                </Nav.Item>
              </Nav>

              <Button variant='danger' onClick={logout} style={{ bottom: '10px', position: 'absolute' }}>
                <FaDoorOpen style={{ margin: 'auto' }} />
              </Button>

              <p style={{ bottom: '-5px', position: 'absolute', right: '20px', color: '#6B7280' }}>Signed in As: {userInfo.name}</p>
            </div>
            <div className='mainView' style={{ backgroundColor: bgDark, color: '#fff', minWidth: '1250px' }}>
              <Tab.Content>
                <Tab.Pane eventKey="Dashboard"><Dashboard inventoryArr={inventoryArr} /></Tab.Pane>
                <Tab.Pane eventKey="Q&A Records"><QARecords /></Tab.Pane>
                <Tab.Pane eventKey="Inventory"><Inventory /></Tab.Pane>
                <Tab.Pane eventKey="User Management"><UserManager setLoading={setIsLoading} /></Tab.Pane>
              </Tab.Content>
            </div>
          </TabContainer>
        </div>
      )
    }
  }

  return (
    <>
      <LoadingSpiner show={isLoading} />
      {renderHome()}
    </>
  )

}

export default App
