import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { SHA256, enc } from 'crypto-js';
import { UserInfo } from '../utils/Types'
import { sleep, server } from '../utils/utils'
import { Form, Button } from 'react-bootstrap'

type LoginProp = {
  setLogin: React.Dispatch<React.SetStateAction<boolean>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
  setUserInfo: React.Dispatch<React.SetStateAction<UserInfo>>
}

const Login: React.FC<LoginProp> = (prop: LoginProp) => {
  const [userEmail, setUserEmail] = useState<string>('')
  const [userPass, setUserPass] = useState<string>('')

  // checks if jwt token is in http only cookie
  const checkToken = async () => {
    prop.setLoading(true)
    await sleep(1000)
    await axios({
      method: 'post',
      url: server + '/adminController/checkAdminToken',
      responseType: 'text',
      data: '',
      withCredentials: true
    }).then((res) => {
      if (res.status === 200) {
        prop.setLogin(true)
        prop.setUserInfo(JSON.parse(res.data))
      }
    }).catch((err) => {
      console.log('please login')
    })
    prop.setLoading(false)
  }

  useEffect(() => {
    // check token
    checkToken()
  }, [])

  const onEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserEmail(event.target.value)
  }

  const onPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserPass(event.target.value)
  }

  const login = async () => {
    if (!userEmail || !userPass) return alert('Please Enter Both Username and Password')

    // encode password to sha256 Base 64 string
    // so database only store sha256 hash
    const passwordHash = SHA256(userPass).toString(enc.Base64)

    // send login request
    prop.setLoading(true)
    await sleep(1000)
    await axios({
      method: 'post',
      url: server + '/adminController/adminLogin',
      responseType: 'text',
      data: JSON.stringify({
        email: userEmail,
        password: passwordHash,
      }),
      withCredentials: true
    }).then((res) => {
      prop.setLogin(true)
      prop.setUserInfo(JSON.parse(res.data))
    }).catch((err) => {
      alert(' Login Error!!!')
    })
    prop.setLoading(false)
  }

  return (
    <div style={{ padding: 0 }}>
      <div className='mt-4' style={{ margin: 'auto', maxWidth: '500px', minWidth: '300px', maxHeight: '300px', backgroundColor: '#1f2937', padding: '20px', borderRadius: '2em' }}>
        <Form>
          <Form.Group className="mb-3" controlId="loginForm.unameInput1">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter your email..." value={userEmail} onChange={onEmailChange} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="loginForm.pwdInput1">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Enter your password..." value={userPass} onChange={onPasswordChange} />
          </Form.Group>
          <div className="d-grid gap-2">
            <Button variant="primary" size='lg' onClick={login}>Login</Button>
          </div>
        </Form>
      </div>
    </div>
  )



}

export default Login
