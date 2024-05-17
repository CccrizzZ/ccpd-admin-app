import React, { useState } from 'react'
// import axios, { AxiosError, AxiosResponse } from 'axios'
import { UserInfo } from '../utils/Types'
// import { server, hashPass } from '../utils/utils'
import { Form } from 'react-bootstrap'
import { auth } from '../utils/firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { Button } from '@tremor/react'

type LoginProp = {
  setLogin: React.Dispatch<React.SetStateAction<boolean>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
  setUserInfo: React.Dispatch<React.SetStateAction<UserInfo>>
}

const Login: React.FC<LoginProp> = (prop: LoginProp) => {
  const [userEmail, setUserEmail] = useState<string>('')
  const [userPass, setUserPass] = useState<string>('')
  const [isLogging, setIsLogging] = useState<boolean>(false)

  const onEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserEmail(event.target.value)
  }

  const onPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserPass(event.target.value)
  }

  const onEnterKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      firebaseLogin()
    }
  }

  const firebaseLogin = async () => {
    if (isLogging) return
    if (userEmail === '' || userPass === '') return alert('Please Enter Both Username and Password')
    setIsLogging(true)
    prop.setLoading(true)
    // if role correct sign into firebase
    await signInWithEmailAndPassword(
      auth,
      userEmail,
      userPass
    ).catch((err): void => {
      console.warn(err)
      prop.setLoading(false)
      setIsLogging(false)
      alert('Incorrect Credentials')
    })
    setIsLogging(false)
    // left loading on true, it will be reset later after login
  }

  return (
    <div className='p-0'>
      <div className='mt-4' style={{ margin: 'auto', maxWidth: '500px', minWidth: '300px', maxHeight: '300px', backgroundColor: '#1f2937', padding: '20px', borderRadius: '2em' }}>
        <Form>
          <Form.Group className="mb-3" controlId="loginForm.unameInput1">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter your email..." value={userEmail} onChange={onEmailChange} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="loginForm.pwdInput1">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Enter your password..." value={userPass} onChange={onPasswordChange} onKeyDown={onEnterKeyDown} />
          </Form.Group>
          <div className="d-grid gap-2">
            <Button
              size='lg'
              onClick={firebaseLogin}
              loading={isLogging}
            >
              Login
            </Button>
          </div>
        </Form>
      </div>
    </div>
  )
}

export default Login
