import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { UnsafeBurnerWalletAdapter } from '@solana/wallet-adapter-wallets'
import { clusterApiUrl } from '@solana/web3.js'
import React, { useMemo } from 'react'
require('@solana/wallet-adapter-react-ui/styles.css')

interface WalletAdapterProps {
  children: React.ReactNode
}

export default function WalletAdapter(props: WalletAdapterProps) {
  const endpoint = useMemo(() => clusterApiUrl(WalletAdapterNetwork.Devnet), [])

  const wallets = useMemo(
    () => [new UnsafeBurnerWalletAdapter()],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{props.children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}
