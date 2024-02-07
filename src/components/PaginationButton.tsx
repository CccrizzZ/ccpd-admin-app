import { Button, Subtitle } from '@tremor/react'
import React from 'react'
import { FaCaretLeft, FaCaretRight, FaAnglesLeft, FaAnglesRight } from 'react-icons/fa6'

type PaginationButtonProps = {
  nextPage: () => void,
  prevPage: () => void,
  firstPage: () => void,
  lastPage: () => void,
  currentPage: number,
  totalPage: number
}

const PaginationButton: React.FC<PaginationButtonProps> = (props: PaginationButtonProps) => {
  return (
    <div className='flex gap-2 mr-auto ml-auto w-max h-8'>
      <Button className='w-8' color='orange' tooltip='First Page' onClick={props.firstPage}><FaAnglesLeft /></Button>
      <Button className='w-32' color='blue' onClick={props.prevPage}><FaCaretLeft /> Prev Page</Button>
      <Subtitle className='mt-2'>Page {props.currentPage + 1} / {props.totalPage + 1}</Subtitle>
      <Button className='w-32' color='blue' onClick={props.nextPage}>Next Page <FaCaretRight /></Button>
      <Button className='w-8' color='orange' tooltip='Last Page' onClick={props.lastPage}><FaAnglesRight /></Button>
    </div>
  )
}

export default PaginationButton