export type Condition =
  'New' |
  'Sealed' |
  'Used' |
  'Used Like New' |
  'Damaged' |
  'As Is'

export type Platform =
  'Amazon' |
  'eBay' |
  'AliExpress' |
  'Hibid' |
  'Retail' |
  'Wholesale' |
  'Official Website' |
  'Other'

export interface QARecord {
  sku: number,
  time: string,
  itemCondition: Condition,
  comment: string,
  link: string,
  platform: Platform,
  shelfLocation: string,
  amount: number,
  owner?: string
  ownerName?: string
  marketplace?: string
}

// for user info context in App.tsx
export type UserInfo = {
  id: string,
  name: string,
}

// used in user manager
export type InvitationCode = {
  code: string,
  exp: string
}

// type for user rows
export type UserDetail = CreateUser & {
  _id: string,
  registrationDate: string,
  userActive: boolean
}

export type CreateUser = {
  name: string,
  email: string,
  password: string,
  role: string,
}

