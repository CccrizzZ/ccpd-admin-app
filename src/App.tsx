import { useState } from 'react'
import {
  Tab,
  Row,
  Col,
  Nav,
  TabContainer
} from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import './style/tremor.css';
import Dashboard from './components/Dashboard'
import Inventory from './components/Inventory'
import { QARecord, UserInfo } from './utils/Types'
import { bgDark, bgLight } from './utils/utils'
import Login from './components/Login'
import QARecords from './components/QARecords'
import UserManager from './components/UserManager';
import {
  FaBoxesStacked,
  FaUsersGear,
  FaTableList,
  FaHouseChimney
} from "react-icons/fa6";

function App() {
  const [isLogin, setIsLogin] = useState<boolean>(false)
  const [userInfo, setUserInfo] = useState<UserInfo>({
    id: '',
    name: ''
  })
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [inventoryArr, setInventoryArr] = useState<QARecord[]>([])

  const renderHome = () => {
    if (!isLogin) {
      return <Login setLogin={setIsLogin} setUserInfo={setUserInfo} setLoading={setIsLoading} />
    } else {
      return (
        <div style={{ width: '100vw', height: '100vh' }}>
          <TabContainer defaultActiveKey="Dashboard" data-bs-theme="dark">
            <Row style={{ margin: 0, height: '100vh', width: '100vw' }}>
              <Col sm={2} style={{ backgroundColor: bgLight, userSelect: 'none' }}>
                <Nav variant="pills" className="flex-column mt-4">
                  <Nav.Item>
                    <Nav.Link eventKey="Dashboard" style={{ color: '#fff' }}><FaHouseChimney /> Dashboard</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="Q&A Records" style={{ color: '#fff' }}><FaTableList /> Q&A Records</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="Inventory" style={{ color: '#fff' }}><FaBoxesStacked /> Inventory</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="User Management" style={{ color: '#fff' }}><FaUsersGear /> User Management</Nav.Link>
                  </Nav.Item>
                </Nav>
              </Col>
              <Col sm={10} style={{ backgroundColor: bgDark, color: '#fff' }}>
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
      {renderHome()}
    </>
  )

}

export default App
