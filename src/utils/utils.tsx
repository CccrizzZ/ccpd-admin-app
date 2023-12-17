import { SHA256, enc } from "crypto-js";
import moment from "moment";
import { CreateUser, QARecord, UserDetail } from "./Types";

// server connection
export const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
export const server = import.meta.env.VITE_APP_SERVER

// color
export const bgDark = '#212332'
export const bgLight = '#2A2D3E'

// hashing
export const hashPass = (userPass: string) => SHA256(userPass).toString(enc.Base64)

// return tremor color pallete string
export const getPlatformBadgeColor = (platform: string) => {
  switch (platform) {
    case 'Amazon' || 'amazon':
      return 'orange'
    case 'eBay' || 'Ebay' || 'ebay':
      return 'lime';
    case 'Official Website' || 'official website':
      return 'slate';
    case 'Hibid' || 'hibid':
      return 'cyan';
    case 'Wholesale' || 'wholesale':
      return 'rose';
    case 'Retail' || 'retail':
      return 'sky';
    case 'Other' || 'other':
      return 'slate';
    default:
      break;
  }
}

// for user role Form.Select
export const renderUserRoleOptions = () => {
  return (
    <>
      <option value="">Select Role</option>
      <option value="QAPersonal">Q&A Personal</option>
      <option value="Sales">Sales</option>
      <option value="Shelving Manager">Shelving Manager</option>
      <option value="Admin">Admin</option>
      <option value="Super Admin">Super Admin</option>
    </>
  )
}

// for item condition Form.Select
export const renderItemConditionOptions = () => {
  return (
    <>
      <option value="">Select Condition</option>
      <option value="New">New</option>
      <option value="Sealed">Sealed</option>
      <option value="Used">Used</option>
      <option value="Used Like New">Used Like New</option>
      <option value="Damaged">Damaged</option>
      <option value="As Is">As Is</option>
    </>
  )
}

// for QARecord platform Form.Select
export const renderPlatformOptions = () => {
  return (
    <>
      <option value="">Select Platform</option>
      <option value="Amazon">Amazon</option>
      <option value="eBay">eBay</option>
      <option value="AliExpress">AliExpress</option>
      <option value="Official Website">Official Website</option>
      <option value="Other">Other</option>
    </>
  )
}

// sealed = primary
// new = success
// used like new = secondary
// used = dark
// damaged = danger
// missing parts = warning
export const getVariant = (condition: string) => {
  switch (condition) {
    case 'Sealed':
      return 'primary'
    case 'New':
      return 'success'
    case 'Used Like New':
      return 'secondary'
    case 'Used':
      return 'dark'
    case 'Damaged':
      return 'dark'
    case 'As Is':
      return 'warning'
    default:
      'secondary'
  }
}

// if returned false, not expired
export const isExpired = (exp: string): boolean => {
  if (moment.unix(Number(exp)).valueOf() - moment.now().valueOf() < 0) return true
  return false
}

export const deSpace = (s: string) => s.replace(/ /g, '')

export const initUser: UserDetail = {
  _id: '',
  name: '',
  email: '',
  password: '',
  role: '',
  registrationDate: '',
  userActive: false
}

export const initCreateUser: CreateUser = {
  name: '',
  email: '',
  password: '',
  role: '',
}

export const initQARecord: QARecord = {
  sku: 0,
  time: '',
  itemCondition: 'New',
  comment: '',
  link: '',
  platform: 'Amazon',
  shelfLocation: '',
  amount: 0,
  owner: ''
}
