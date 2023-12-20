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

export type PaymentMethod =
  'Cash' |
  'E-transfer' |
  'Check' |
  'Online' |
  'Store Credit'

export interface RetailRecord {
  sku: string;
  time: string;
  amount: string;
  quantity: string;
  marketplace: string;
  paymentMethod: PaymentMethod;
  buyerName: string;
  adminName: string;
  adminId?: string;
}

export interface ReturnRecord {
  retailRecord: RetailRecord;
  returnTime: string;
  refundMethod: PaymentMethod;
  reason: string;
  admin: string;
}

export interface Inventory {
  recordOwner: string;
  recordTime: string;
  tags: Record<string, string>;  // tag requested by James
  qaRecord: QARecord;
}

export interface QARecord {
  sku: number;
  time: string,
  itemCondition: Condition;
  comment: string;
  link: string;
  platform: Platform;
  shelfLocation: string;
  amount: number;
  owner?: string;
  ownerName?: string;
  marketplace?: string;
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

