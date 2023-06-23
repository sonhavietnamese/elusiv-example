import { formatWallet } from '@/helpers/format-wallet'
import { useAppStore } from '@/stores/app'
import { Elusiv } from '@elusiv/sdk'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import Avatar from 'boring-avatars'
import { useEffect, useState } from 'react'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'

interface AccountProps {
  elusiv: Elusiv | undefined
}

export default function Account({ elusiv }: AccountProps) {
  const { publicKey, connected } = useWallet()
  const { connection } = useConnection()
  const [solBalance, setSolBalance] = useState<string | null>()
  const [privateBalance, setPrivateBalance] = useState<string | null>()
  const loading = useAppStore((state) => state.loading)

  useEffect(() => {
    const getSolBalance = async () => {
      if (!publicKey) return

      const lamports = await connection.getBalance(publicKey)
      setSolBalance((lamports / LAMPORTS_PER_SOL).toFixed(3))
    }

    const getPrivateBalance = async () => {
      if (!publicKey) return
      if (!elusiv) return

      // GET THE PRIVATE BALANCE IN ONE LINE (33)
      const balance = await elusiv.getLatestPrivateBalance('LAMPORTS')
      setPrivateBalance((Number(BigInt(balance)) / LAMPORTS_PER_SOL).toFixed(3))
    }

    getSolBalance()
    getPrivateBalance()

    return () => {
      setSolBalance(null)
      setPrivateBalance(null)
    }
  }, [publicKey, elusiv, connection, loading])

  return (
    <SkeletonTheme baseColor='#1E2329' highlightColor='#A7ACB9'>
      {publicKey && (
        <div className='flex gap-5 items-center p-5 bg-base-100 rounded-[36px] select-none'>
          <div className='avatar'>
            <div className=' w-28 rounded-3xl ring ring-primary ring-offset-base-100 ring-offset-2'>
              <Avatar
                size={120}
                name={publicKey.toString()}
                variant='beam'
                square
                colors={['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90']}
              />
            </div>
          </div>

          <div>
            <div>
              <span className='text-lg font-semibold text-primary-content'>{formatWallet(publicKey?.toString())}</span>
            </div>

            <div>
              {solBalance ? (
                <span className=' text-sm font-semibold text-neutral-content'>
                  {solBalance} <div className='badge badge-primary'>SOL</div>
                </span>
              ) : (
                <Skeleton />
              )}
            </div>

            <div className='flex flex-col mt-2'>
              <span className='text-primary-content'>Player Balance</span>
              {privateBalance ? (
                <span className=' text-sm font-semibold text-neutral-content'>
                  {privateBalance} <div className='badge badge-primary'>SOL</div>
                </span>
              ) : (
                <Skeleton />
              )}
            </div>
          </div>
        </div>
      )}
    </SkeletonTheme>
  )
}
