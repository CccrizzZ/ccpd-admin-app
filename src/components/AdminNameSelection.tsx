import { MultiSelect, MultiSelectItem } from '@tremor/react'
import axios, { AxiosResponse } from 'axios'
import React, { forwardRef, useEffect, useState } from 'react'
import { FaUserTie } from 'react-icons/fa6'
import { server } from '../utils/utils'

type AdminNameSelectionProps = {
  onAdminNameChange: (value: string[]) => void;
  adminNameSelection: string[],
}

const AdminNameSelection: React.FC<AdminNameSelectionProps> = (props: AdminNameSelectionProps) => {
  const [AdminNameArr, setAdminNameArr] = useState<string[]>([])

  useEffect(() => {
    fetchAdminNames()
  }, [])

  const fetchAdminNames = async () => {
    await axios({
      method: 'post',
      url: server + '/adminController/getInstockDistinct',
      responseType: 'text',
      timeout: 8000,
      data: JSON.stringify({ 'distinct': 'adminName' }),
      withCredentials: true
    }).then((res: AxiosResponse) => {
      setAdminNameArr(JSON.parse(res.data))
    }).catch((err) => {
      alert('Failed Fetching Admin Names: ' + err.response.status)
    })
  }

  const renderAdminNames = () => {
    if (AdminNameArr.map && AdminNameArr.length > 0) {
      return AdminNameArr.map((name, index) => (
        <MultiSelectItem value={name} key={index}>
          {name}
        </MultiSelectItem>
      ))
    }
  }

  return (
    <MultiSelect
      className='mb-3'
      placeholder='Select Admin'
      icon={FaUserTie}
      onValueChange={props.onAdminNameChange}
      value={props.adminNameSelection}
    >
      {renderAdminNames()}
    </MultiSelect>
  )
}

export default AdminNameSelection