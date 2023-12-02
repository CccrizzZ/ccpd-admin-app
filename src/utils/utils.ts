import moment from "moment";

export const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
export const server = import.meta.env.VITE_APP_SERVER

export const bgDark = '#212332'
export const bgLight = '#2A2D3E'

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

export const compareDate = () => {

}

// t2 later than t1 (t2 > t1)
export const availability = (t1: string, t2: string) => {
  return moment(t1).valueOf() > moment(t2).valueOf()
}

// if returned false, its not expired
export const isExpired = (exp: string): boolean => {
  if (moment().valueOf() > moment(exp).valueOf()) return true
  return false
}