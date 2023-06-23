import { useAppStore } from '@/stores/app'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { LogOut } from 'lucide-react'

export default function ConnectWalletButton() {
  const { setVisible } = useWalletModal()
  const { publicKey, disconnect } = useWallet()
  const loading = useAppStore((state) => state.loading)

  const connectWallet = async () => {
    setVisible(true)
  }

  return (
    <div className='mt-3'>
      {publicKey ? (
        <button className='btn btn-neutral btn-sm btn-square' onClick={disconnect} disabled={loading}>
          <LogOut size={18} />
        </button>
      ) : (
        <button className='btn btn-primary ' onClick={connectWallet}>
          One, Two, Three — Connect and fight
        </button>
      )}
    </div>
  )
}
