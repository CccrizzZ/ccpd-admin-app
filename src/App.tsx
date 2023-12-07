import { createContext, useState } from 'react'
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
import LoadingSpiner from './components/LoadingSpinner'
import {
  FaBoxesStacked,
  FaUsersGear,
  FaTableList,
  FaHouseChimney,
  FaMoneyBillTransfer,
  FaDoorOpen
} from "react-icons/fa6";

// loading spinner context
export const SetLoadingContext = createContext((loading: boolean) => { })

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

  const navLinkStyle = { display: 'flex' }
  const renderHome = () => {
    // if not login prompt login else show app
    if (!isLogin) {
      return <Login setLogin={setIsLogin} setUserInfo={setUserInfo} setLoading={setIsLoading} />
    } else {
      return (
        <div className='wrapper'>
          <TabContainer defaultActiveKey="User Management" data-bs-theme="dark">
            <div className='sideBar' style={{ backgroundColor: bgLight, userSelect: 'none' }}>
              <Nav variant="pills" className="flex-column mt-4 p-3">
                <Nav.Item className='mb-3'>
                  <Nav.Link className='text-white' eventKey="Dashboard" style={navLinkStyle}>
                    <FaHouseChimney /> Dashboard
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item className='mb-3'>
                  <Nav.Link className='text-white' eventKey="Q&A Records" style={navLinkStyle}>
                    <FaTableList /> Q&A Records
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item className='mb-3'>
                  <Nav.Link className='text-white' eventKey="Inventory" style={navLinkStyle}>
                    <FaBoxesStacked /> Inventory
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item className='mb-3'>
                  <Nav.Link className='text-white' eventKey="User Management" style={navLinkStyle}>
                    <FaUsersGear /> User Management
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item className='mb-3'>
                  <Nav.Link className='text-white' eventKey="Retail & Return" style={navLinkStyle}>
                    <FaMoneyBillTransfer /> Retail & Return
                  </Nav.Link>
                </Nav.Item>
              </Nav>

              {/* side panel footer */}
              <Button className='bottom-2.5 absolute' variant='danger' onClick={logout}>
                <FaDoorOpen style={{ margin: 'auto' }} />
              </Button>
              <p style={{ bottom: '-5px', position: 'absolute', right: '20px', color: '#6B7280' }}>Signed in As: {userInfo.name}</p>
            </div>
            <div className='mainView' style={{ backgroundColor: bgDark, color: '#fff', minWidth: '1250px' }}>
              <Tab.Content>
                <Tab.Pane eventKey="Dashboard"><Dashboard inventoryArr={inventoryArr} /></Tab.Pane>
                <Tab.Pane eventKey="Q&A Records"><QARecords setLoading={setIsLoading} /></Tab.Pane>
                <Tab.Pane eventKey="Inventory"><Inventory setLoading={setIsLoading} /></Tab.Pane>
                <Tab.Pane eventKey="User Management"><UserManager setLoading={setIsLoading} /></Tab.Pane>
              </Tab.Content>
            </div>
          </TabContainer>
        </div>
      )
    }
  }

  return (
    <SetLoadingContext.Provider value={setIsLoading}>
      <LoadingSpiner show={isLoading} />
      {renderHome()}
    </SetLoadingContext.Provider>
  )

}

export default App
