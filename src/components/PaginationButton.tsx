import { Button, Subtitle } from '@tremor/react'
import React from 'react'
import { FaCaretLeft, FaCaretRight } from 'react-icons/fa6'

type PaginationButtonProps = {
  nextPage: () => void,
  prevPage: () => void,
  currentPage: number
}

const PaginationButton: React.FC<PaginationButtonProps> = (props: PaginationButtonProps) => {
  return (
    <div className='flex gap-2 mr-auto ml-auto w-max'>
      <Button className='w-32' color='blue' onClick={props.prevPage}><FaCaretLeft />Prev Page</Button>
      <Subtitle className='mt-2'>Page {props.currentPage + 1}</Subtitle>
      <Button className='w-32' color='blue' onClick={props.nextPage}>Next Page <FaCaretRight /></Button>
    </div>
  )
}

export default PaginationButton