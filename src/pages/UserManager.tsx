import React, { useState } from 'react'
import {
  Table,
  TableHead,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  Badge,
  Card,
  Text,
  Button
} from "@tremor/react";
import {
  FaUserGear,
  FaRotate
} from "react-icons/fa6";
import LoadingSpiner from '../utils/LoadingSpinner';
import { server, sleep } from '../utils/utils'
import axios from 'axios';

// type for user rows
export type UserDetail = {
  id: string,
  name: string,
  email: string,
  password: string,
  role: string,
  registration: string,
  userActive: boolean
}

type UserManagerProp = {
  setLoading: (isloading: boolean) => void
}

const UserManager = (prop: UserManagerProp) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [UserArr, setUserArr] = useState<UserDetail[]>([])

  const data = [
    {
      id: "12332112332111311",
      name: "Viola Amherd",
      email: "xxxx@xxxx",
      password: "x",
      role: "Q&A Personal",
      registrationDate: "xx xx xxxx",
      status: "active",
    },
    {
      id: "12332112332111312",
      name: "Viola Amherd",
      email: "xxxx@xxxx",
      password: "x",
      role: "Q&A Personal",
      registrationDate: "xx xx xxxx",
      status: "active",
    },
    {
      id: "12332112332111313",
      name: "Viola Amherd",
      email: "xxxx@xxxx",
      password: "x",
      role: "Q&A Personal",
      registrationDate: "xx xx xxxx",
      status: "active",
    },
    {
      id: "12332112332111314",
      name: "Viola Amherd",
      email: "xxxx@xxxx",
      password: "x",
      role: "Q&A Personal",
      registrationDate: "xx xx xxxx",
      status: "active",
    },
    {
      id: "12332112332111315",
      name: "Viola Amherd",
      email: "xxxx@xxxx",
      password: "x",
      role: "Q&A Personal",
      registrationDate: "xx xx xxxx",
      status: "active",
    },
    {
      id: "12332112332111316",
      name: "Viola Amherd",
      email: "xxxx@xxxx",
      password: "x",
      role: "Q&A Personal",
      registrationDate: "xx xx xxxx",
      status: "active",
    },
    {
      id: "12332112332111317",
      name: "Viola Amherd",
      email: "xxxx@xxxx",
      password: "x",
      role: "Q&A Personal",
      registrationDate: "xx xx xxxx",
      status: "active",
    },
    {
      id: "12332112332111318",
      name: "Viola Amherd",
      email: "xxxx@xxxx",
      password: "x",
      role: "Q&A Personal",
      registrationDate: "xx xx xxxx",
      status: "active",
    },
    {
      id: "12332112332111319",
      name: "Viola Amherd",
      email: "xxxx@xxxx",
      password: "x",
      role: "Q&A Personal",
      registrationDate: "xx xx xxxx",
      status: "active",
    },
    {
      id: "12332112332111320",
      name: "Viola Amherd",
      email: "xxxx@xxxx",
      password: "x",
      role: "Q&A Personal",
      registrationDate: "xx xx xxxx",
      status: "active",
    },
    {
      id: "12332112332111321",
      name: "Viola Amherd",
      email: "xxxx@xxxx",
      password: "x",
      role: "Q&A Personal",
      registrationDate: "xx xx xxxx",
      status: "active",
    },
  ];

  const renderTBody = () => {
    return data.map((user) => (
      <TableRow key={user.name}>
        <TableCell>
          {user.id}
        </TableCell>
        <TableCell>
          {user.name}
        </TableCell>
        <TableCell>
          <Text>{user.email}</Text>
        </TableCell>
        <TableCell>
          <Text>{user.password}</Text>
        </TableCell>
        <TableCell>
          <Text>{user.role}</Text>
        </TableCell>
        <TableCell>
          <Text>{user.registrationDate}</Text>
        </TableCell>
        <TableCell>
          <Badge color="emerald" icon={FaUserGear} style={{ margin: 0 }}>
            <p style={{ margin: 0, padding: 0 }}>{user.status.toUpperCase()}</p>
          </Badge>
        </TableCell>
      </TableRow>
    ))
  }

  const refreshUserTable = async () => {
    // send login request
    prop.setLoading(true)
    await sleep(3000)
    await axios({
      method: 'get',
      url: server + '/adminController/getAllUserInfo',
      responseType: 'text',
      data: '',
      withCredentials: true
    }).then((res) => {
      console.log(res)
    }).catch((err) => {
      console.log(err.response.data)
      alert('Login Failed: Invalid Credential')
    })
    prop.setLoading(false)
  }

  return (
    <div>
      <LoadingSpiner show={isLoading} />
      <h2 className='mt-6 ml-6'>User Management Console</h2>
      <Card className='mt-6' style={{ maxWidth: '90%' }}>
        <div>
          <Button color='green' onClick={refreshUserTable}><FaRotate style={{ margin: 0, color: 'white' }} /></Button>

        </div>
        <Table className="mt-5">
          <TableHead>
            <TableRow>
              <TableHeaderCell>ID</TableHeaderCell>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>Email</TableHeaderCell>
              <TableHeaderCell>Password</TableHeaderCell>
              <TableHeaderCell>Role</TableHeaderCell>
              <TableHeaderCell>Registration Date</TableHeaderCell>
              <TableHeaderCell>User Active</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {renderTBody()}
          </TableBody>
        </Table>
      </Card>

    </div>
  )
}

export default UserManager
