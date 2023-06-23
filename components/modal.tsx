import useModal from '@/hooks/useModal'
import { useAppStore } from '@/stores/app'
import { Elusiv } from '@elusiv/sdk'
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'

interface ModalProps {
  elusiv: Elusiv | undefined
}

export default function Modal({ elusiv }: ModalProps) {
  const [isOpen, setIsOpen] = useModal((s) => [s.isOpen, s.setIsOpen])
  const [result, loading, setLoading] = useAppStore((s) => [s.result, s.loading, s.setLoading])

  // HEY!! THIS IS HOW ELUSIV SEND THE MONEY PRIVACY
  const send = async () => {
    if (!elusiv) return

    const privateBalance = await elusiv.getLatestPrivateBalance('LAMPORTS')

    if (privateBalance > BigInt(0)) {
      setLoading(true)

      const sendTx = await elusiv.buildSendTx(
        0.25 * LAMPORTS_PER_SOL,
        new PublicKey('3WTzKn73wqZS81ipLXe1Cu9PqYGULfHnheTPWG8vv1mz'),
        'LAMPORTS',
      )

      const sig = await elusiv.sendElusivTx(sendTx)
      console.log(`Send complete with sig ${sig.signature}`)

      setLoading(false)
      setIsOpen(false)
    } else {
      setLoading(false)
      throw new Error("Can't send from an empty private balance")
    }
  }

  return (
    <dialog className={`modal ${isOpen ? 'modal-open' : ''}`}>
      <form method='dialog' className='modal-box'>
        {result === 'lose' && (
          <>
            <h3 className='font-bold text-lg'>You lose, better try next time!</h3>
            <p className='py-4 text-neutral-content'>Computer is just computer, pay 0.25 SOL to revenge.</p>
            <div className='modal-action'>
              <button className='btn normal-case btn-primary' disabled={loading} onClick={send}>
                {loading ? (
                  <>
                    <span className='loading loading-spinner'></span> Paying ...
                  </>
                ) : (
                  <>Pay 0.25 SOL 😭</>
                )}
              </button>
            </div>
          </>
        )}
        {result === 'draw' && (
          <>
            <h3 className='font-bold text-lg'>Uh huh, not bad!</h3>
            <p className='py-4 text-neutral-content'>You just made a draw with computer, won&apos;t stop, right?</p>
            <div className='modal-action'>
              <button className='btn normal-case btn-primary' onClick={() => setIsOpen(false)}>
                Back and beat computer 🤜
              </button>
            </div>
          </>
        )}
        {result === 'win' && (
          <>
            <h3 className='font-bold text-lg'>Yayyy 🎉!</h3>
            <p className='py-4 text-neutral-content'>Computer is just computer. You just kicked it&apos;s ass!</p>
            <div className='modal-action'>
              <button className='btn normal-case btn-primary' onClick={() => setIsOpen(false)}>
                Back and kick it again 😤
              </button>
            </div>
          </>
        )}
      </form>
    </dialog>
  )
}
