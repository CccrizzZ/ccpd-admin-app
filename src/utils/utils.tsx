import { SHA256, enc } from "crypto-js";
import moment from "moment-timezone";
import {
  Condition,
  CreateUser,
  InstockInventory,
  PaymentMethod,
  QARecord,
  QAQueryFilter,
  RetailRecord,
  ReturnRecord,
  UserDetail,
  InstockQueryFilter,
  Platform,
} from "./Types";
import { DateRangePickerValue } from "@tremor/react";

// server connection
export const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
export const server = import.meta.env.VITE_APP_SERVER

// conversion rate
export const usdToCadRate = 1.38
export const eurToCadRate = 1.55

// time zones
export const est = 'America/Toronto'
// get iso format dates
export const getEndOfDay = (day: Date) => moment.tz(day, est).endOf('day').toDate()
export const getStartOfToday = () => moment.tz(moment(), est).startOf('day').toDate()
export const getEndOfToday = () => moment.tz(moment(), est).endOf('day').toDate()
export const getYesterday = () => moment.tz(moment(), est).subtract(1, 'day').toDate().toDateString()
export const getStartOfYesterday = () => moment.tz(moment(), est).subtract(1, 'day').startOf('day').toDate()
export const getEndOfYesterday = () => moment.tz(moment(), est).subtract(1, 'day').endOf('day').toDate()
export const getStartOfThisWeek = () => moment.tz(moment(), est).startOf('week').toDate()
export const getEndOfThisWeek = () => moment.tz(moment(), est).endOf('week').toDate()
export const getStartOfThisMonth = () => moment.tz(moment(), est).startOf('month').toDate()
export const getEndOfThisMonth = () => moment.tz(moment(), est).endOf('month').toDate()

// color
export const bgDark = '#212332'
export const bgLight = '#2A2D3E'

// regex for http and https link in a string
export const urlRegex = '/(http|https):\/\/(\S*)/'

// hashing password to send to server
export const hashPass = (userPass: string) => SHA256(userPass).toString(enc.Base64)

// return tremor color pallete string
export const getPlatformBadgeColor = (platform: string | undefined) => {
  if (platform === undefined || platform === '') return 'slate'
  switch (platform) {
    case 'Amazon':
    case 'amazon':
      return 'orange'
    case 'eBay':
    case 'Ebay':
    case 'ebay':
      return 'lime'
    case 'Official Website':
    case 'official website':
      return 'slate'
    case 'Hibid':
    case 'hibid':
      return 'cyan'
    case 'HomeDepot':
    case 'homedepot':
    case 'Homedepot':
      return 'orange'
    case 'Wholesale':
    case 'wholesale':
      return 'rose'
    case 'Retail':
    case 'retail':
      return 'sky'
    case 'Facebook':
    case 'facebook':
    case 'Walmart':
    case 'walmart':
      return 'blue'
    case 'Kijiji':
    case 'kijiji':
      return 'indigo'
    case 'BestBuy':
    case 'bestbuy':
    case 'Bestbuy':
      return 'yellow'
    case 'Other':
    case 'other':
      return 'gray'
    default:
      return 'slate'
  }
}

// user role selection
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

// inventory item condition selections
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

// inventory's original platfrom selections
export const renderPlatformOptions = () => {
  return (
    <>
      <option value="">Select Platform</option>
      <option value="Amazon">Amazon</option>
      <option value="eBay">eBay</option>
      <option value="AliExpress">AliExpress</option>
      <option value="HomeDepot">HomeDepot</option>
      <option value="Walmart">Walmart</option>
      <option value="BestBuy">BestBuy</option>
      <option value="Official Website">Official Website</option>
      <option value="Other">Other</option>
    </>
  )
}

// target distribution platform
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
      <option className='text-blue-500' value=''>All</option>
      <option className='text-emerald-500' value='in'>In Stock</option>
      <option className='text-rose-500' value='out'>Out of Stock</option>
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
  sku: 0,
  msrp: 0,
  shelfLocation: '',
  condition: '' as Condition,
  comment: '',
  lead: '',
  description: '',
  url: '',
  quantityInstock: 0,
  quantitySold: 0,
  adminName: '',
  qaName: '',
  time: '',
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
  // if no link in string return
  if (link.length <= 7 || !link.includes('http')) return
  // extract http link in string and open it in new tab
  // regex method
  let matches = extractHttpsFromStr(link)
  // open link in new tab or slice it out
  if (!matches) {
    window.open(link.substring(link.indexOf("http"), link.length), '_blank', 'noreferrer')
  } else {
    window.open(matches?.toString(), '_blank', 'noreferrer')
  }
}

// extract https link from string
export const extractHttpsFromStr = (str: string) => {
  if (!str.includes('http')) return str
  const res = String(str.match(/\bhttps?:\/\/\S+/gi))
  if (res !== 'null') {
    return res
  } else {
    return str.slice(str.indexOf('https'))
  }
}

export const initQAQueryFilter: QAQueryFilter = {
  timeRangeFilter: {} as DateRangePickerValue,
  conditionFilter: '',
  platformFilter: '',
  marketplaceFilter: '',
  qaFilter: [],
  adminFilter: [],
  shelfLocationFilter: [],
  keywordFilter: [],
  sku: {
    gte: '',
    lte: ''
  }
}

export const initInstockQueryFilter: InstockQueryFilter = {
  timeRangeFilter: {} as DateRangePickerValue,
  conditionFilter: '' as Condition,
  platformFilter: '' as Platform,
  marketplaceFilter: '' as Platform,
  instockFilter: 'in',
  msrpFilter: {
    gte: '',
    lt: '',
  },
  adminFilter: [],
  qaFilter: [],
  shelfLocationFilter: [],
  keywordFilter: []
}

export const getInstockInventory = (qaRecord: QARecord, adminName: string): InstockInventory => {
  const inv: InstockInventory = {
    sku: qaRecord.sku,
    shelfLocation: qaRecord.shelfLocation,
    condition: qaRecord.itemCondition,
    comment: qaRecord.comment,
    url: qaRecord.link,
    quantityInstock: qaRecord.amount,
    quantitySold: 0,
    adminName: adminName,
    qaName: qaRecord.ownerName ?? '',
    time: qaRecord.time,
    platform: qaRecord.platform,
  }
  return inv
}

// convert QA record comment to inventory comment
export const convertCommentsInitial = (input: string) => {
  if (!input) return
  input = input.replace('UT.', 'UNTEST ')
  input = input.replace('MP.', 'MISSING PARTS ')
  input = input.replace('FT.', 'FUNCTION TEST ')
  input = input.replace('SI.', 'IMAGE SHOW SIMILAR ITEM ')
  input = input.replace('PT.', 'POWER TESTED ')
  input = input.replace('API.', 'ALL PARTS IN ')
  input = input.replace('MA.', 'MISSING ACCESSORIES ')
  return input
}

export const toCad = (input: number, currency: string): number | undefined => {
  switch (currency) {
    case 'CAD':
      return input
    case 'USD':
      return Number((input * 1.3).toFixed(2))
    case 'EUR':
      return Number((input * 1.45).toFixed(2))
    case 'GBP':
      return Number((input * 1.7).toFixed(2))
    default:
      break;
  }
}

export const isObjectsEqual = (a: Object, b: Object) => JSON.stringify(a) === JSON.stringify(b)

export const getKwArr = (skey: string, refresh?: boolean) => {
  return skey.length > 0 && !refresh ? skey.split(/(\s+)/).filter((item) => { return item.trim().length > 0 }) : []
}