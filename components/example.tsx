import Account from '@/components/account'
import ConnectWalletButton from '@/components/connect-wallet-button'
import GameScene from '@/components/game-scene'
import TopupButton from '@/components/topup-button'
import { Elusiv, SEED_MESSAGE } from '@elusiv/sdk'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { useEffect, useState } from 'react'
import AirdropButton from './airdop-button'
import Modal from './modal'

export default function Example() {
  const { publicKey, signMessage } = useWallet()
  const [elusiv, setElusiv] = useState<Elusiv>()
  const { connection } = useConnection()

  useEffect(() => {
    // THIS IS HOW WE GET THE ELUSIV INSTANCE
    const getElusiv = async () => {
      if (publicKey && signMessage) {
        const encodedMessage = new TextEncoder().encode(SEED_MESSAGE)

        const seed = await signMessage(encodedMessage)
        const elusivInstance = await Elusiv.getElusivInstance(seed, publicKey, connection, 'devnet')
        setElusiv(elusivInstance)
      }
    }

    getElusiv()

    return () => {
      setElusiv(undefined)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicKey, connection])

  return (
    <div className='w-[700px] h-full bg-base-300 flex flex-col items-center justify-center'>
      <Account elusiv={elusiv} />
      <div className='flex gap-2 mt-2'>
        <TopupButton elusiv={elusiv} />
        <AirdropButton />
      </div>
      <ConnectWalletButton />
      <GameScene elusiv={elusiv} />
      <Modal elusiv={elusiv} />
    </div>
  )
}
