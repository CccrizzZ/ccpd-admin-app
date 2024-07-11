import { createContext, useEffect, useState } from 'react'
import {
  Tab,
  Nav,
  TabContainer,
  Button,
} from 'react-bootstrap'
import './App.css'
import axios, { AxiosError, AxiosResponse } from 'axios'
import Dashboard from './pages/Dashboard'
import Inventory from './pages/Inventory'
import {
  // AdminSettings,
  UserInfo
} from './utils/Types'
import {
  bgDark,
  bgLight,
  server,
  sleep,
  // server
} from './utils/utils'
import Login from './pages/Login'
import QARecords from './pages/QARecords'
import UserManager from './pages/UserManager';
import LoadingSpiner from './components/LoadingSpinner'
import {
  FaBoxesStacked,
  FaUsersGear,
  FaTableList,
  // FaHouseChimney,
  // FaFileInvoiceDollar,
  FaDoorOpen,
  FaGear,
  FaCommentDollar,
  FaGavel
} from "react-icons/fa6";
import AuctionHistory from './pages/AuctionHistory'
import AdminSettingsModal from './components/AdminSettingsModal'
import { auth } from './utils/firebase'
import { Badge } from '@tremor/react'
import { useAtom } from 'jotai'
import { isUserLogin, userInformation } from './utils/atom'

// context passed to all child component
type ContextType = {
  setLoading: (l: boolean) => void
  userInfo: UserInfo
}

// loading spinner context
export const AppContext = createContext({} as ContextType)
const App = () => {
  // atoms
  const [userInfo, setUserInfo] = useAtom(userInformation)

  // user login
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isLogin, setIsLogin] = useAtom(isUserLogin)

  // admin settings
  const [showAdminSettingsModal, setShowAdminSettingsModal] = useState<boolean>(false)

  // wait a moment before fetching all datas
  // received "Token used too early" error because system time
  const waitLogin = async (email: string | null, fid: string | null) => {
    setIsLoading(true)
    await sleep(2000)
    if (email) {
      await getAdminRBACInfo(email)
      setUserInfo((prev) => ({
        ...prev,
        fid: fid,
        email: email,
      }))
    }
  }

  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        await waitLogin(user.email, user.uid)
        console.log("User is logged in")
        return
      } else {
        console.log("No user is logged in")
        setIsLogin(false)
        return
      }
    });

    // add firebase token with interceptors
    axios.interceptors.request.use(
      async (config) => {
        config.headers.Authorization = await auth.currentUser?.getIdToken();
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );
  }, [])

  // get user role and name info
  const getAdminRBACInfo = async (email: string): Promise<boolean> => {
    await axios({
      method: 'post',
      url: server + '/userController/getAdminRBACInfo',
      responseType: 'text',
      timeout: 3000,
      data: JSON.stringify({
        email: email,
      }),
      withCredentials: true
    }).then((res: AxiosResponse) => {
      const data = JSON.parse(res.data)
      setUserInfo({
        ...userInfo,
        id: data['id'],
        name: data['name'],
        role: data['role'],
      })
      setIsLogin(true)
      return true
    }).catch((err: AxiosError) => {
      setIsLoading(false)
      auth.signOut()
      alert('Failed to Login' + err.response?.data)
      return false
    })
    return false
  }

  // logout user (delete http only cookies)
  const logout = async () => {
    if (auth.currentUser?.email) {
      auth.signOut().then(() => {
        alert("Logged Out")
      })
    }
  }

  // map all navigation items
  const renderNavItem = () => {
    const pages = [
      // 'Dashboard',
      'Q&A Records',
      'Inventory',
      'Auction History',
      // 'Retail & Return',
      'User Management',
      // 'Procurement'
      // 'Pallet Manager'
    ]

    const icons = [
      // <FaHouseChimney />,
      <FaTableList />,
      <FaBoxesStacked />,
      <FaGavel />,
      // <FaFileInvoiceDollar />,
      <FaUsersGear />,
      <FaCommentDollar />
    ]

    return pages.map((item, index) => {
      // if not super admin, hide user management
      if (userInfo.role !== 'Super Admin' && item === 'User Management') return
      return (
        <Nav.Item className='mb-3' key={item}>
          <Nav.Link className='text-white' eventKey={item} style={{ display: 'flex' }}>
            {icons[index]} {item}
          </Nav.Link>
        </Nav.Item>
      )
    })
  }

  const renderHome = () => {
    // if not login prompt login else show app
    if (!isLogin) {
      return <Login setUserInfo={setUserInfo} setLoading={setIsLoading} />
    } else {
      return (
        <div className='wrapper'>
          <AdminSettingsModal
            show={showAdminSettingsModal}
            hide={() => {
              setShowAdminSettingsModal(false)
            }}
          />
          <TabContainer defaultActiveKey="Q&A Records" data-bs-theme="dark">
            {/* side navigation */}
            <div className='sideBar' style={{ backgroundColor: bgLight, userSelect: 'none' }}>
              <Nav variant="pills" className="flex-column mt-4 p-3">
                {renderNavItem()}
              </Nav>
              {/* side panel footer */}
              <div className='bottom-2.5 absolute'>
                <Badge className='mt-3 text-[#6B7280]' color='stone'>Signed in As: {userInfo.name}</Badge>
                {/* <Badge className='mt-3 text-[#6B7280]' color='stone'>Signed in As: {userInfo.email}</Badge> */}
                <Badge className='mt-3 text-[#6B7280]' color='stone'>Role: {userInfo.role}</Badge>
                <br />
                <br />
                <Button className='mr-3' variant='danger' onClick={logout}>
                  <FaDoorOpen className='m-auto' />
                </Button>
                {
                  userInfo.role === 'Super Admin' ?
                    <Button variant='secondary' onClick={() => {
                      setShowAdminSettingsModal(true)
                      setIsLoading(true)
                    }}>
                      <FaGear className='m-auto' />
                    </Button> : <></>
                }
              </div>
            </div>
            {/* main content */}
            <div className="mainView gradient-background bg-[url('/assets/bg2.jpg')]" style={{ backgroundColor: bgDark, color: '#fff', minWidth: '1250px' }}>
              <Tab.Content>
                <Tab.Pane eventKey="Dashboard"><Dashboard /></Tab.Pane>
                <Tab.Pane eventKey="Q&A Records"><QARecords /></Tab.Pane>
                <Tab.Pane eventKey="Inventory"><Inventory /></Tab.Pane>
                <Tab.Pane eventKey="Auction History"><AuctionHistory /></Tab.Pane>
                {userInfo.role === 'Super Admin' ? <Tab.Pane eventKey="User Management"><UserManager /></Tab.Pane> : undefined}
                {/* <Tab.Pane eventKey="Retail & Return"><RetailManager /></Tab.Pane> */}
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
