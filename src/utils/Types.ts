import { DateRangePickerValue } from "@tremor/react";

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
  'Facebook' |
  'Kijiji' |
  'HomeDepot' |
  'Walmart' |
  'BestBuy' |
  'Other'

export type PaymentMethod =
  'Cash' |
  'Card' |
  'Card Online' |
  'E-transfer' |
  'Paypal' |
  'Check' |
  'Store Credit'

export const AmazonCategory = [
  'Pellet',
  'Monster',
  'HC',
  'E-HC',
  'MB',
  'E-MB',
  'Food',
  'Beauty',
  'Shoes',
  'Cleaning',
  'Pet Food'
]

export const AliExpressCategory = [
  'Watch',
  'Auto',
  'Jewelry',
  'Electronics',
  'MB',
  'Pallet'
]

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
  returnQuantity: number;
  refundAmount: number;
  refundMethod: PaymentMethod;
  reason: string;
  adminName: string;
}

export interface InstockInventory {
  sku: number;
  shelfLocation: string;
  condition: Condition;
  comment: string;
  url: string;
  quantityInstock: number;
  quantitySold: number;
  adminName: string;
  qaName: string;
  time: string;
  qaTime?: string;
  msrp?: number;         // scraped
  lead?: string;         // chat gpt generated from scraped data
  description?: string;  // chat gpt generated from scraped data
  platform?: Platform;
  marketplace?: Platform;
  qaRecordId?: string;
  tags?: string[];
}

export interface QARecord {
  sku: number;
  time: string;
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
  problem?: boolean;
  scrapedData: ScrapedData
}

// for user info context in App.tsx
export type UserInfo = {
  id: string,
  name: string,
  role?: string,
  fid?: string | null,
  email?: string | null,
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
  userActive: boolean,
  fid: string
}

export type CreateUser = {
  name: string,
  email: string,
  password: string,
  role: string,
}

export type QAQueryFilter = {
  timeRangeFilter: DateRangePickerValue,
  keywordFilter: string[],
  conditionFilter: string,
  platformFilter: string,
  marketplaceFilter: string,
  qaFilter: string[],
  adminFilter: string[],
  shelfLocationFilter: string[],
  sku?: {
    gte?: string,
    lte?: string,
  },
  targetSku?: string,
  showRecorded: string,
}

export type InstockQueryFilter = {
  instockFilter: string,
  msrpFilter: {
    gte: string,
    lt: string,
  },
  adminFilter: string[],
  adminHour: number,
  qaTime: DateRangePickerValue,
} & QAQueryFilter

export type ScrapedData = {
  title: string,
  msrp: number,
  imgUrl: string,
  currency: string
}

export type InstockItem = {
  lot: number,
  sku: number,
  lead: string,
  msrp: number,
  shelfLocation: string,
  condition?: string,
  description?: string,
  startBid?: number,
  reserve?: number,
}

export type PreviousUnsold = {
  lot: number,
  items: InstockItem[]
}

export type AuctionInfo = {
  lot: number,
  totalItems: number,
  openTime: string,
  closeTime: string,
  itemsArr: InstockItem[],
  topRow: InstockItem[],
  previousUnsoldArr: PreviousUnsold[],
  title?: string,
  description?: string,
  minMSRP?: number,
  maxMSRP?: number,
  remainingResolved?: boolean,
  itemLotStart?: number,
  timeRange?: string,
}

export type RemainingInfo = {
  lot: number,
  totalItems: number,
  soldCount: number,
  unsoldCount: number,
  soldItems: SoldItem[],
  unsoldItems: InstockItem[],
  soldTopRow: SoldItem[],     // sold item from top row
  unsoldTopRow: InstockItem[] // unsold item from top row
  timeClosed: string,
  isProcessed?: boolean,      // weather if the record is processed into DB
  errorItems?: InstockItem[],    // sold but out of stock
  deducted?: SoldItem[],      // all items caused database update
  totalBidAmount?: number,    // top row bid sum + item arr bid sum
  notInAuction?: NotInAuctionItem[],
  notInRemaining?: NotInAuctionItem[]
}

export type SoldItem = {
  bidAmount: number,
  clotNumber: number,
  soldStatus: boolean,
  sku: number,
  lead?: string,
  reserve?: string,
  shelfLocation?: string,
  quantityInstock?: string,
  isPickedUp?: boolean,
}

export type NotInAuctionItem = {
  sku: number,
  shelfLocation: boolean,
  description: string,
  bid: number,
  sold?: boolean,
  lead?: string,
  lot?: number,
  condition?: string,
}

export type AdminSettings = {
  shelfLocationsDef?: string[],
  daysQACanDeleteRecord?: number,
  isQAPermittedAfterHours?: boolean,
}