import { SHA256, enc } from "crypto-js";
import moment from "moment";
import { CreateUser, QARecord, UserDetail } from "./Types";

export const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
export const server = import.meta.env.VITE_APP_SERVER

export const bgDark = '#212332'
export const bgLight = '#2A2D3E'

export const hashPass = (userPass: string) => SHA256(userPass).toString(enc.Base64)

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
