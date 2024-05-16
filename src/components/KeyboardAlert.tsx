import React, { useEffect } from 'react'
import { setTimeout } from 'timers'

type KeyboardAlertProps = {
  key: string
  show: boolean
}

const KeyboardAlert: React.FC<KeyboardAlertProps> = (props: KeyboardAlertProps) => {
  useEffect(() => {
    setTimeout(() => {
      props.show = false
    }, 2000)
  })

  return (
    props.show ?
      <div className='absolute left-12 bottom-12 text-6xl'>
        {props.key}
      </div> : <></>
  )
}

export default KeyboardAlert