import { Result } from '@/types/result'
import { create } from 'zustand'

interface BearState {
  loading: boolean
  setLoading: (loading: boolean) => void

  result: Result
  setResult: (result: Result) => void
}

export const useAppStore = create<BearState>()((set) => ({
  loading: false,
  setLoading: (loading: boolean) => set({ loading }),

  result: 'not-yet',
  setResult: (result: Result) => set({ result }),
}))
