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
  images?: string[]
}

export interface User {
  email: string,
  password: string, // sha256 hash only
}

// for storing user info in App.tsx
export interface UserInfo {
  id: string,
  name: string,
}