import { atom } from 'jotai'
import { UserInfo } from './Types'

// show loading spinner
export const showSpinner = atom<boolean>(false)

// current logged in user
export const userInformation = atom<UserInfo>({
    name: '',
    id: '',
    role: '',
    fid: '',
    email: '',
})

// if not login, goto login page
export const isUserLogin = atom<boolean>(false)