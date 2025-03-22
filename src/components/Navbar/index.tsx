import React from 'react'
import Image from 'next/image'

function Navbar() {
  return (
    <div className='h-20 fixed top-0 w-screen flex justify-between items-center bg-foreground text-background px-12 py-2'>
        <h1 className='text-3xl font-inter font-bold'>Beaurocritic</h1>
        <Image src='/hamburger.png' alt="hamburger menu" width={500} height={500} className='h-6 w-auto'/>
    </div>
  )
}

export default Navbar