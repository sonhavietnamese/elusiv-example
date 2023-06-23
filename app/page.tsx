'use client'

import Example from '@/components/example'
import WalletAdapter from '@/components/wallet-adapter'
import { useEffect, useState } from 'react'
import 'react-loading-skeleton/dist/skeleton.css'

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <>
      {mounted && (
        <WalletAdapter>
          <main className='flex flex-col w-full h-screen bg-base-200 items-center'>
            <Example />
          </main>
        </WalletAdapter>
      )}
    </>
  )
}
