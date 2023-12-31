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
  'Other' |
  'Facebook' |
  'Kijiji' |
  'HomeDepot'

export type PaymentMethod =
  'Cash' |
  'Card' |
  'Card Online' |
  'E-transfer' |
  'Paypal' |
  'Check' |
  'Store Credit'

export interface RetailRecord {
  sku: number;
  time: string;
  amount: number;
  quantity: number;
  marketplace: string;
  paymentMethod: PaymentMethod;
  buyerName: string;
  adminName: string;
  invoiceNumber?: string;
  adminId?: string;
  returned?: boolean;
  paid?: boolean;
  pickedup?: boolean;
}

export interface ReturnRecord {
  retailRecord: RetailRecord;
  returnTime: string;
  returnQuantity: number
  refundAmount: number,
  refundMethod: PaymentMethod;
  reason: string;
  adminName: string;
}

export interface InstockInventory {
  qaRecord: QARecord;
  recordAdmin: string;
  recordTime: string;
  quantityInstock: number;
  quantitySold: number;
  tags?: Record<string, string>;  // tag requested by James
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
  marketplace?: Platform;
  recorded?: boolean;
  problem?: boolean
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

export type Paging = {
  currPage: number,
  itemsPerPage: number
}