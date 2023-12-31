import { createContext, useState } from 'react'
import {
  Tab,
  Nav,
  TabContainer,
  Button,
} from 'react-bootstrap'
import './App.css'
import axios from 'axios'
import Dashboard from './pages/Dashboard'
import Inventory from './pages/Inventory'
import { UserInfo } from './utils/Types'
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
  FaFileInvoiceDollar,
  FaDoorOpen,
  FaGear,
  FaCommentDollar
} from "react-icons/fa6";
import RetailManager from './pages/RetailManager'

// type for app context
type ContextType = {
  setLoading: (l: boolean) => void
  userInfo: UserInfo
}

// loading spinner context
export const AppContext = createContext({} as ContextType)
const App = () => {
  const [isLogin, setIsLogin] = useState<boolean>(false)
  const [userInfo, setUserInfo] = useState<UserInfo>({
    id: '',
    name: ''
  })
  const [isLoading, setIsLoading] = useState<boolean>(false)
  // const [userSettings, setUserSettings] = useState<UserSettings>([])

  // logout user (delete http only cookies)
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

  // map all navigation items
  const renderNavItem = () => {
    const pages = [
      'Dashboard',
      'Q&A Records',
      'Inventory',
      'Retail & Return',
      'User Management',
      // 'Procurement'
    ]
    const icons = [
      <FaHouseChimney />,
      <FaTableList />,
      <FaBoxesStacked />,
      <FaFileInvoiceDollar />,
      <FaUsersGear />,
      <FaCommentDollar />
    ]
    return pages.map((item, index) => {
      return (
        <Nav.Item className='mb-3' key={item}>
          <Nav.Link className='text-white' eventKey={item} style={{ display: 'flex' }}>
            {icons[index]} {item}
          </Nav.Link>
        </Nav.Item>
      )
    })
  }

  // render main content
  const renderHome = () => {
    // if not login prompt login else show app
    if (!isLogin) {
      return <Login setLogin={setIsLogin} setUserInfo={setUserInfo} setLoading={setIsLoading} />
    } else {
      return (
        <div className='wrapper'>
          <TabContainer defaultActiveKey="Retail & Return" data-bs-theme="dark">
            {/* side navigation */}
            <div className='sideBar' style={{ backgroundColor: bgLight, userSelect: 'none' }}>
              <Nav variant="pills" className="flex-column mt-4 p-3">
                {renderNavItem()}
              </Nav>
              {/* side panel footer */}
              <div className='bottom-2.5 absolute'>
                <p className='mt-3' style={{ color: '#6B7280' }}>Signed in As: {userInfo.name}</p>
                <Button className='mr-3' variant='danger' onClick={logout}>
                  <FaDoorOpen className='m-auto' />
                </Button>
                <Button variant='secondary'>
                  <FaGear className='m-auto' />
                </Button>
              </div>
            </div>
            {/* main content */}
            <div className='mainView gradient-background' style={{ backgroundColor: bgDark, color: '#fff', minWidth: '1250px' }}>
              <Tab.Content>
                <Tab.Pane eventKey="Dashboard"><Dashboard /></Tab.Pane>
                <Tab.Pane eventKey="Q&A Records"><QARecords /></Tab.Pane>
                <Tab.Pane eventKey="Inventory"><Inventory /></Tab.Pane>
                <Tab.Pane eventKey="User Management"><UserManager /></Tab.Pane>
                <Tab.Pane eventKey="Retail & Return"><RetailManager /></Tab.Pane>
              </Tab.Content>
            </div>
          </TabContainer >
        </div >
      )
    }
  }

  return (
    <AppContext.Provider value={{ setLoading: setIsLoading, userInfo: userInfo }}>
      <LoadingSpiner show={isLoading} />
      {renderHome()}
    </AppContext.Provider>
  )

}

export default App
