import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const SupportUs = () => {
  return (
    <div className='bg-gray-200/35 dark:bg-gray-800/30'>
      <div className='mx-auto max-w-xl px-8 py-20 xs:pt-24 lg:px-8 text-center flex flex-col gap-5'>
        <div className='flex flex-col gap-3'>
            <div>
                <h1 className='text-3xl font-bold'>Support Us!</h1>
            </div>
            <div>
                <p className='text-sm dark:text-gray-400 text-gray-500'>The Odin Project is funded by the community. Join us in empowering learners around the globe by supporting The Odin Project!</p>
            </div>
        </div>
        <div className='flex gap-6 justify-center'>
            <Link href='/support_us' className='px-7 py-3 text-sm border border-gray-500 rounded-sm hover:dark:bg-gray-600 hover:bg-gray-300 cursor-pointer'>Learn More</Link>
            <Link href='/support_us' className='cursor-pointer pl-7 pr-3 py-3 bg-gray-200 hover:bg-gray-300 text-sm dark:bg-gray-700 dark:hover:bg-gray-800 duration-500 rounded-sm flex items-center gap-2'>Donate Now <ArrowRight size={18}/></Link>
        </div>
      </div>
    </div>
  )
}

export default SupportUs
