import { SHA256, enc } from "crypto-js";
import moment from "moment";
import { CreateUser, InstockInventory, PaymentMethod, QARecord, RetailRecord, ReturnRecord, UserDetail } from "./Types";

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
    case 'HomeDepot' || 'homedepot' || 'Homedepot':
      return 'amber'
    case 'Wholesale' || 'wholesale':
      return 'rose';
    case 'Retail' || 'retail':
      return 'sky';
    case 'Other' || 'other':
      return 'slate';
    default:
      return 'slate';
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
      <option value="HomeDepot">HomeDepot</option>
      <option value="Official Website">Official Website</option>
      <option value="Other">Other</option>
    </>
  )
}

export const renderMarketPlaceOptions = () => {
  return (
    <>
      <option value="">Select Marketplace</option>
      <option value="Hibid">Hibid</option>
      <option value="eBay">eBay</option>
      <option value="Facebook">Facebook</option>
      <option value="Wholesale">Wholesale</option>
      <option value="Retail">Retail</option>
      <option value="Kijiji">Kijiji</option>
      <option value="Other">Other</option>
    </>
  )
}

export const renderItemPerPageOptions = () => {
  return (
    <>
      <option value="10">10</option>
      <option value="20">20</option>
      <option value="50">50</option>
      <option value="100">100</option>
    </>
  )
}

export const renderInstockOptions = () => {
  return (
    <>
      <option value="">All</option>
      <option value="instock">In Stock</option>
      <option value="outOfStock">Out of Stock</option>
    </>
  )
}


export const renderPaymentMethodOptions = () => {
  return (
    <>
      <option value="Cash">Cash</option>
      <option value="Card">Card</option>
      <option value="Card Online">Card Online</option>
      <option value="E-transfer">E-transfer</option>
      <option value="Check">Check</option>
    </>
  )
}

// for tremor color palette
export const getConditionVariant = (condition: string) => {
  switch (condition) {
    case 'Sealed':
      return 'blue'
    case 'New':
      return 'emerald'
    case 'Used Like New':
      return 'lime'
    case 'Used':
      return 'yellow'
    case 'Damaged':
      return 'gray'
    case 'As Is':
      return 'red'
    default:
      'slate'
  }
}

// if returned false, not expired
export const isExpired = (exp: string): boolean => {
  if (moment.unix(Number(exp)).valueOf() - moment.now().valueOf() < 0) return true
  return false
}

export const deSpace = (s: string) => s.replace(/ /g, '')

// init value of custom type
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

export const initRetailRecord: RetailRecord = {
  sku: 0,
  time: '',
  amount: 0,
  quantity: 1,
  marketplace: '',
  paymentMethod: '' as PaymentMethod,
  buyerName: '',
  adminName: '',
  invoiceNumber: '',
  returned: false,
  paid: false,
  pickedup: false
}

export const initInstockInventory: InstockInventory = {
  qaRecord: initQARecord,
  recordAdmin: '',
  recordTime: '',
  quantityInstock: 0,
  quantitySold: 0,
}

export const initReturnRecord: ReturnRecord = {
  retailRecord: {} as RetailRecord,
  returnTime: '',
  returnQuantity: 1,
  refundAmount: 0,
  refundMethod: 'Cash',
  reason: '',
  adminName: '',
}

export const copyLink = (link: string) => navigator.clipboard.writeText(link)
export const openLink = (link: string) => {
  // extract http link in string and open it in new tab
  const url = link.split(" ").find(word => word.startsWith("http"))
  window.open(url, '_blank', 'noreferrer')
}