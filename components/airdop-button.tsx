import { useAppStore } from '@/stores/app'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'

export default function AirdropButton() {
  const { publicKey } = useWallet()
  const [loading, setLoading] = useAppStore((state) => [state.loading, state.setLoading])
  const { connection } = useConnection()

  const airdrop = async () => {
    if (!publicKey) return

    try {
      setLoading(true)
      await connection.requestAirdrop(publicKey, 1 * LAMPORTS_PER_SOL)
    } catch (error) {
      alert('Airdrop failed! Yelling the speaker to sent you some SOL!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {publicKey && (
        <>
          <button className='btn btn-primary btn-sm normal-case' disabled={loading} onClick={airdrop}>
            {loading ? (
              <>
                <span className='loading loading-spinner'></span>
                Hand on
              </>
            ) : (
              'Airdop 1 SOL'
            )}
          </button>
        </>
      )}
    </>
  )
}
