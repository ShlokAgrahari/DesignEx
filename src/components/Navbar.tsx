import React from 'react'
import ActiveUser from './user/ActiveUser'

const Navbar = () => {
  return (
    <div className='top-0 h-[80px] bg-gray-500 items-center justify-center w-full'>
        <div className='flex h-full justify-between w-full px-5'>
            <div className='flex justify-center items-center text-white text-2xl'>
                DesignEx
            </div>
            <div>
                <ActiveUser/>
            </div>
        </div>
    </div>
  )
}

export default Navbar