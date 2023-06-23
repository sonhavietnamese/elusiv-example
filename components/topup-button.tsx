import { useAppStore } from '@/stores/app'
import { Elusiv, TopupTxData } from '@elusiv/sdk'
import { useWallet } from '@solana/wallet-adapter-react'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'

interface TopupButtonProps {
  elusiv: Elusiv | undefined
}

export default function TopupButton({ elusiv }: TopupButtonProps) {
  const { publicKey, signTransaction } = useWallet()
  const [loading, setLoading] = useAppStore((state) => [state.loading, state.setLoading])

  // THIS IS THE WAY TO TOPUP TO ELUSIV, QUITE LONG BUT IT IS IN BUG FIXING
  const topup = async () => {
    if (!signTransaction || !elusiv) return

    setLoading(true)
    try {
      const topupTx = await elusiv?.buildTopUpTx(0.25 * LAMPORTS_PER_SOL, 'LAMPORTS')
      const signature = await signTransaction(topupTx.tx)

      const rebuildTopup = new TopupTxData(
        topupTx.getTotalFee(),
        'LAMPORTS',
        topupTx.lastNonce,
        topupTx.commitmentHash,
        topupTx.merkleStartIndex,
        topupTx.wardenInfo,
        signature,
        topupTx.hashAccIndex,
        topupTx.merge,
      )

      await elusiv.sendElusivTx(rebuildTopup)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {publicKey && (
        <>
          <button
            className='btn btn-primary btn-sm normal-case'
            disabled={loading ? true : elusiv ? false : true}
            onClick={topup}>
            {loading ? (
              <>
                <span className='loading loading-spinner'></span>
                Toping up
              </>
            ) : (
              'Topup 0.5 SOL'
            )}
          </button>
        </>
      )}
    </>
  )
}
