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
import Dashboard from './components/Dashboard'
import Inventory from './components/Inventory'
import { QARecord, UserInfo } from './utils/Types'
import { bgDark, bgLight, server } from './utils/utils'
import Login from './components/Login'
import QARecords from './components/QARecords'
import UserManager from './components/UserManager';
import LoadingSpiner from './utils/LoadingSpinner'
import {
  FaBoxesStacked,
  FaUsersGear,
  FaTableList,
  FaHouseChimney,
  FaPowerOff
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
    if (!isLogin) {
      return <Login setLogin={setIsLogin} setUserInfo={setUserInfo} setLoading={setIsLoading} />
    } else {
      return (
        <div>
          {/* <Navbar className="bg-body-tertiary" style={{ width: '200px' }}>
            <img
              src="assets/react.svg"
              width="30"
              height="30"
              className="d-inline-block align-top"
              alt="React Bootstrap logo"
            />
          </Navbar> */}
          <TabContainer defaultActiveKey="Dashboard" data-bs-theme="dark">
            <Row style={{ margin: 0, height: '100vh', width: '100vw', minWidth: '1500px' }}>
              <Col sm={2} style={{ backgroundColor: bgLight, userSelect: 'none', minWidth: '250px' }}>
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
                </Nav>

                <Button variant='danger' onClick={logout} style={{ bottom: '10px', position: 'absolute' }}>
                  <FaPowerOff style={{ margin: 'auto' }} />
                </Button>
              </Col>
              <Col sm={10} style={{ backgroundColor: bgDark, color: '#fff', minWidth: '1250px' }}>
                <Tab.Content>
                  <Tab.Pane eventKey="Dashboard"><Dashboard inventoryArr={inventoryArr} /></Tab.Pane>
                  <Tab.Pane eventKey="Q&A Records"><QARecords /></Tab.Pane>
                  <Tab.Pane eventKey="Inventory"><Inventory /></Tab.Pane>
                  <Tab.Pane eventKey="User Management"><UserManager /></Tab.Pane>
                </Tab.Content>
              </Col>
            </Row>
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
