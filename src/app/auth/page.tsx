import Link from 'next/link'
import React from 'react'

export default function page() {
  return (
    <div className='min-w-full min-h-screen bg-foreground flex items-center justify-center text-background font-roboto-mono'>
        <div className='flex flex-col gap-8'>
            <Link href='/auth/login'><button className='text-4xl py-4 px-8 border-2 border-background '>Sign up</button></Link>
            <Link href='/auth/login'><button className='text-4xl py-4 px-8 border-2 border-background '>Sign in</button></Link>
        </div>
    </div>
  )
}
